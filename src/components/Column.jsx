import TaskCard from './TaskCard';

function Column({ column }) {
  return (
    <div className="column">
      <h2>{column.title}</h2>
      {column.tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default Column;
