import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';
import useLocalCache from '../hooks/useLocalCache';
import { getBoard } from '../api/boardApi';

// --- Mocks -----------------------------------------------------------

jest.mock('../hooks/useLocalCache');
jest.mock('../api/boardApi');

// Column is mocked so these tests focus on Board's own logic.
jest.mock('./Column', () => ({
  __esModule: true,
  default: ({ column }) => (
    <div data-testid="column">
      <h2>{column.title}</h2>
      <ul>
        {column.tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  ),
}));

const mockBoard = {
  title: 'Project Phoenix',
  columns: [
    {
      id: 'col-1',
      title: 'To Do',
      tasks: [
        { id: 'task-1', title: 'Design homepage' },
        { id: 'task-2', title: 'Set up CI pipeline' },
      ],
    },
    {
      id: 'col-2',
      title: 'In Progress',
      tasks: [
        { id: 'task-3', title: 'Implement login flow' },
      ],
    },
    {
      id: 'col-3',
      title: 'Done',
      tasks: [
        { id: 'task-4', title: 'Initial project scaffolding' },
        { id: 'task-5', title: 'Write README' },
        { id: 'task-6', title: 'Configure linter' },
      ],
    },
  ],
};

const cachedBoard = {
  title: 'Cached Board',
  columns: [
    {
      id: 'col-cached',
      title: 'Cached Column',
      tasks: [
        { id: 'task-cached', title: 'Cached Task' },
      ],
    },
  ],
};

// Use real React state to simulate useLocalCache.
function useRealStateBackedCache(_key, initialValue) {
  return useState(initialValue);
}

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(console, 'warn').mockImplementation(() => {});

  useLocalCache.mockImplementation(useRealStateBackedCache);
});

afterEach(() => {
  console.warn.mockRestore();
});

// --- Tests -------------------------------------------------------------

describe('Board', () => {
  it('shows a loading state on first-ever load with no cache', () => {
    getBoard.mockReturnValue(new Promise(() => {}));

    render(<Board boardId="board-1" />);

    expect(
      screen.getByText(/loading board/i)
    ).toBeInTheDocument();
  });

  it('renders the board title once the fetch resolves', async () => {
    getBoard.mockResolvedValue(mockBoard);

    render(<Board boardId="board-1" />);

    expect(
      await screen.findByRole('heading', {
        name: mockBoard.title,
      })
    ).toBeInTheDocument();
  });

  it('renders all column titles', async () => {
    getBoard.mockResolvedValue(mockBoard);

    render(<Board boardId="board-1" />);

    await screen.findByRole('heading', {
      name: mockBoard.title,
    });

    mockBoard.columns.forEach((column) => {
      expect(
        screen.getByRole('heading', {
          name: column.title,
        })
      ).toBeInTheDocument();
    });
  });

  it('renders the correct number of task cards across all columns', async () => {
    getBoard.mockResolvedValue(mockBoard);

    render(<Board boardId="board-1" />);

    await screen.findByRole('heading', {
      name: mockBoard.title,
    });

    const totalTaskCount = mockBoard.columns.reduce(
      (sum, column) => sum + column.tasks.length,
      0
    );

    expect(
      screen.getAllByRole('listitem')
    ).toHaveLength(totalTaskCount);
  });

  it('shows an error state when there is no cache and the fetch fails', async () => {
    getBoard.mockRejectedValue(
      new Error('Network unreachable')
    );

    render(<Board boardId="board-1" />);

    expect(
      await screen.findByText(/error: network unreachable/i)
    ).toBeInTheDocument();
  });

  it('renders cached board data immediately, before the fetch resolves', () => {
    useLocalCache.mockReturnValue([
      cachedBoard,
      jest.fn(),
    ]);

    getBoard.mockReturnValue(new Promise(() => {}));

    render(<Board boardId="board-1" />);

    expect(
      screen.getByRole('heading', {
        name: cachedBoard.title,
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/loading board/i)
    ).not.toBeInTheDocument();
  });

  it('shows an offline warning and keeps the cached board when a background fetch fails', async () => {
    const setBoard = jest.fn();

    useLocalCache.mockReturnValue([
      cachedBoard,
      setBoard,
    ]);

    getBoard.mockRejectedValue(
      new Error('Network unreachable')
    );

    render(<Board boardId="board-1" />);

    expect(
      screen.getByRole('heading', {
        name: cachedBoard.title,
      })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/offline mode/i)
      ).toBeInTheDocument();
    });

    expect(setBoard).not.toHaveBeenCalled();
  });

  it('re-fetches when boardId changes', async () => {
    getBoard.mockResolvedValue(mockBoard);

    const { rerender } = render(
      <Board boardId="board-1" />
    );

    await screen.findByRole('heading', {
      name: mockBoard.title,
    });

    expect(getBoard).toHaveBeenCalledWith('board-1');

    const secondBoard = {
      ...mockBoard,
      title: 'Second Board',
    };

    getBoard.mockResolvedValue(secondBoard);

    rerender(
      <Board boardId="board-2" />
    );

    await screen.findByRole('heading', {
      name: secondBoard.title,
    });

    expect(getBoard).toHaveBeenCalledWith('board-2');
  });
});
