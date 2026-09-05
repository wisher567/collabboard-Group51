import React from 'react';

function TaskCard({ task, onDragStart, isDragging, onClick }) {
  // Default metadata if not stored on simple tasks
  const tag = task.tag || (task.status === 'Done' ? 'Review' : task.columnId === 'col-progress' || task.columnId === 'Doing' ? 'Bug' : 'Feature');
  const tagColors = {
    Feature: 'bg-blue-100 text-blue-800',
    Content: 'bg-purple-100 text-purple-800',
    Bug: 'bg-red-100 text-red-800',
    Review: 'bg-green-100 text-green-800',
    Web: 'bg-gray-100 text-gray-800',
  };
  const badgeClass = tagColors[tag] || 'bg-blue-100 text-blue-800';

  const isDone = task.columnId === 'col-done' || task.columnId === 'Done' || task.status === 'Done';
  const isConflict = task.isConflict || task.hasConflict;

  return (
    <div
      draggable
      onClick={() => onClick && onClick(task)}
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      className={`bg-surface-container-lowest rounded-[10px] p-md card-shadow card-hover-shadow card-cursor relative group border transition-all text-left ${
        isConflict ? 'conflict-border border-amber-300' : isDone ? 'bg-surface-container-lowest/80 border-transparent' : 'border-transparent hover:border-outline-variant/30'
      } ${isDragging ? 'dragging' : ''}`}
    >
      {/* Top row: tags & status */}
      <div className="flex justify-between items-start mb-sm">
        <div className="flex gap-2 items-center">
          <span className={`px-2 py-0.5 rounded font-label-sm text-[10px] uppercase tracking-wide font-semibold ${badgeClass}`}>
            {tag}
          </span>
          {isConflict && (
            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-label-sm text-[10px] uppercase tracking-wide">
              Web
            </span>
          )}
        </div>

        {isDone ? (
          <span
            className="material-symbols-outlined text-green-600 text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        ) : isConflict ? (
          <div className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded flex items-center gap-1 font-label-sm text-[10px] uppercase font-bold">
            <span className="material-symbols-outlined text-[12px]">warning</span>
            Conflict
          </div>
        ) : (
          <button
            type="button"
            className="text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
          >
            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          </button>
        )}
      </div>

      {/* Task Title */}
      <h4 className={`font-label-md text-label-md text-on-surface font-semibold mb-xs line-clamp-2 text-sm text-gray-900 ${isDone ? 'line-through text-on-surface-variant text-gray-400' : ''}`}>
        {task.title}
      </h4>

      {/* Task Description */}
      <p className={`font-body-md text-[13px] text-on-surface-variant line-clamp-2 mb-md text-gray-500 ${isDone ? 'text-outline text-gray-400' : ''}`}>
        {task.description || (isDone ? 'Completed task and verified updates.' : 'Assigned tasks and updates for project sprint.')}
      </p>

      {/* Progress Bar for in-progress / conflict */}
      {isConflict && (
        <div className="w-full bg-surface-container h-1.5 rounded-full mb-md overflow-hidden bg-gray-100 my-2">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }} />
        </div>
      )}

      {/* Card Footer */}
      <div className="flex justify-between items-end mt-auto pt-sm border-t border-outline-variant/10 text-xs text-gray-400">
        <div className="flex items-center gap-sm font-label-sm">
          {isConflict ? (
            <span className="flex items-center gap-1 text-error font-medium">
              <span className="material-symbols-outlined text-[14px]">schedule</span> Overdue
            </span>
          ) : (
            <>
              <span className="flex items-center gap-[2px]">
                <span className="material-symbols-outlined text-[14px]">chat_bubble_outline</span> 2
              </span>
              <span className="flex items-center gap-[2px] ml-2">
                <span className="material-symbols-outlined text-[14px]">attach_file</span> 1
              </span>
            </>
          )}
        </div>

        {/* Assignee Avatar or Unassigned Icon */}
        {task.assignee ? (
          <div className="relative group/assignee" title={`Assigned to: ${task.assignee.name || 'Team Member'}`}>
            {task.assignee.avatar ? (
              <img
                alt={task.assignee.name || 'Assignee'}
                className="w-6 h-6 rounded-full border border-white object-cover ring-1 ring-primary/20 shadow-2xs"
                src={task.assignee.avatar}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold">
                {(task.assignee.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          <div
            className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors text-[10px]"
            title="Unassigned"
          >
            <span className="material-symbols-outlined text-[13px]">person_add</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
