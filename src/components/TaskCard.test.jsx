import { render, screen } from '@testing-library/react';
import TaskCard from './TaskCard';

describe('TaskCard component', () => {
  test('renders the task title', () => {
    const mockTask = {
      id: 'task-1',
      title: 'Design homepage',
    };

    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('Design homepage')).toBeInTheDocument();
  });
});