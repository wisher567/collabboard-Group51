import React, { useState } from 'react';
import TaskCard from './TaskCard';

function Column({ column, onAddTask, onMoveTask, onTaskClick }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const tasks = column.tasks || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onAddTask) {
      onAddTask(column.id, newTitle.trim());
    }
    setNewTitle('');
    setIsAdding(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (taskData && onMoveTask) {
        onMoveTask(taskData, column.id);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleCardDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const isDone = column.title.toLowerCase().includes('done');

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-shrink-0 w-[85vw] sm:w-[320px] max-w-[360px] min-w-[280px] rounded-xl flex flex-col border border-outline-variant/20 transition-all ${
        isDone ? 'bg-surface-container-low/30 opacity-95' : 'bg-surface-container-low/50'
      } ${dragOver ? 'ring-2 ring-primary/40 bg-primary/5' : ''}`}
    >
      {/* Column Header */}
      <div className="p-md flex justify-between items-center sticky top-0 bg-surface-container-low/50 backdrop-blur-sm z-10 rounded-t-xl border-b border-outline-variant/10 p-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm font-semibold text-gray-800 text-base">
          <span>{column.title}</span>
          <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs ml-2">
            {tasks.length}
          </span>
        </h3>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-md cursor-pointer text-gray-500 hover:text-blue-600"
            title="Add Task"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>

      {/* Column Tasks Body */}
      <div className="p-md flex-1 overflow-y-auto space-y-md kanban-scroll p-4 space-y-3 min-h-[140px]">
        {isAdding && (
          <form onSubmit={handleAdd} className="mb-3 animate-fadeIn">
            <input
              type="text"
              placeholder="Task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="w-full p-2 text-sm border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-primary text-white font-medium rounded-md hover:bg-primary-container cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id || task._id}
            task={task}
            onDragStart={handleCardDragStart}
            onClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && !isAdding && (
          <div className="h-[100px] rounded-[10px] border-2 border-dashed border-outline-variant/40 bg-surface-container-low/20 flex items-center justify-center text-xs text-gray-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default Column;
