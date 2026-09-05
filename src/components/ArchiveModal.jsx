import React, { useState, useEffect } from 'react';

export default function ArchiveModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [archivedBoards, setArchivedBoards] = useState([
    { id: 'ab-1', title: 'Q2 Marketing Campaign Launch', closedDate: 'July 14, 2024', cardsCount: 24, owner: 'Mohomad Ashfark' },
    { id: 'ab-2', title: 'Legacy Architecture Migration v1', closedDate: 'June 28, 2024', cardsCount: 38, owner: 'Jane Doe' },
    { id: 'ab-3', title: 'Customer Feedback Beta Sprint', closedDate: 'May 12, 2024', cardsCount: 17, owner: 'Test User' },
  ]);

  const [archivedTasks, setArchivedTasks] = useState([
    { id: 'at-1', title: 'Design homepage layout', board: 'Assignment 03 Verification Board', completedAt: 'Sept 3, 2024', assignee: 'Mohomad Ashfark', tag: 'col-done' },
    { id: 'at-2', title: 'Write unit tests', board: 'Assignment 03 Verification Board', completedAt: 'Sept 3, 2024', assignee: 'Jane Doe', tag: 'col-done' },
    { id: 'at-3', title: 'Stripe Checkout Webhook Failure', board: 'E2E Integrated Sprint Board', completedAt: 'Sept 4, 2024', assignee: 'Test User', tag: 'resolved' },
    { id: 'at-4', title: 'Multi-workspace Permission Matrix', board: 'Asssignmnet 4', completedAt: 'Sept 4, 2024', assignee: 'Mohomad Ashfark', tag: 'resolved' },
    { id: 'at-5', title: 'Q4 Product Release Playbook', board: 'HR Onboarding', completedAt: 'Sept 4, 2024', assignee: 'Jane Doe', tag: 'resolved' },
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRestoreBoard = (id, title) => {
    setArchivedBoards(prev => prev.filter(b => b.id !== id));
    showToast(`Board "${title}" restored to active workspace!`);
  };

  const handleRestoreTask = (id, title) => {
    setArchivedTasks(prev => prev.filter(t => t.id !== id));
    showToast(`Task "${title}" restored to active board!`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredBoards = archivedBoards.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = archivedTasks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.board.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] border border-outline-variant/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-md border-b border-outline-variant/20">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-headline-sm">archive</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Workspace Archive Center</h2>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Inspect and restore completed task cards, closed sprints, and inactive boards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-body-lg">close</span>
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="my-sm px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-md flex items-center gap-xs animate-in slide-in-from-top-2 duration-150">
            <span className="material-symbols-outlined text-body-md">check_circle</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Controls: Search & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm my-md">
          <div className="flex items-center bg-surface-container-low p-xs rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-md py-xs rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Archived Tasks ({archivedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('boards')}
              className={`px-md py-xs rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'boards'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Archived Boards ({archivedBoards.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-body-md">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter archives..."
              className="w-full pl-xl pr-sm py-xs bg-surface-container-low text-on-surface text-body-md rounded-lg outline-none focus:bg-surface-container transition-colors"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto pr-xs flex flex-col gap-sm">
          {activeTab === 'tasks' ? (
            filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-md rounded-xl bg-surface-container-low hover:bg-surface-container/80 transition-colors border border-outline-variant/20"
                >
                  <div className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-primary text-body-lg mt-0.5">task_alt</span>
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">{task.title}</span>
                      <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm mt-0.5">
                        <span className="px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-medium">{task.board}</span>
                        <span>•</span>
                        <span>Assignee: {task.assignee}</span>
                        <span>•</span>
                        <span>Completed {task.completedAt}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestoreTask(task.id, task.title)}
                    className="flex items-center gap-xs px-md py-xs rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-body-md">unarchive</span>
                    <span>Restore</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-xl text-center text-on-surface-variant font-body-md">
                No archived tasks found matching your search.
              </div>
            )
          ) : (
            filteredBoards.length > 0 ? (
              filteredBoards.map((board) => (
                <div
                  key={board.id}
                  className="flex items-center justify-between p-md rounded-xl bg-surface-container-low hover:bg-surface-container/80 transition-colors border border-outline-variant/20"
                >
                  <div className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-secondary text-body-lg mt-0.5">dashboard_customize</span>
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">{board.title}</span>
                      <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm mt-0.5">
                        <span>{board.cardsCount} cards</span>
                        <span>•</span>
                        <span>Archived {board.closedDate}</span>
                        <span>•</span>
                        <span>Created by {board.owner}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestoreBoard(board.id, board.title)}
                    className="flex items-center gap-xs px-md py-xs rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-body-md">unarchive</span>
                    <span>Restore</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-xl text-center text-on-surface-variant font-body-md">
                No archived boards found matching your search.
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="pt-md mt-md border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Archived items remain accessible indefinitely and can be restored at any time.
          </span>
          <button
            onClick={onClose}
            className="px-lg py-xs rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
