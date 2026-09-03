import { render, screen } from '@testing-library/react';
import Column from './Column';

describe('Column component', () => {
  const mockColumn = {
    id: 'column-1',
    title: 'To Do',
    tasks: [
      { id: 'task-1', title: 'Design homepage' },
      { id: 'task-2', title: 'Create login page' },
    ],
  };

  test('renders the column title', () => {
    render(<Column column={mockColumn} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  test('renders all task cards in the column', () => {
    render(<Column column={mockColumn} />);

    expect(screen.getByText('Design homepage')).toBeInTheDocument();
    expect(screen.getByText('Create login page')).toBeInTheDocument();
  });
});