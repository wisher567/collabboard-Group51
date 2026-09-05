import React, { useState } from 'react';
import { updateTask, deleteTask } from '../api/boardApi';

export default function TaskModal({ task, columns = [], members = [], onClose, onUpdateTask, onDeleteTask }) {
  const [title, setTitle] = useState(task?.title || 'Design Landing Page');
  const [description, setDescription] = useState(
    task?.description ||
      'We need a modern, high-converting landing page for the new Q3 campaign. Focus on clean typography and highlighting the new features.'
  );
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [assignee, setAssignee] = useState(task?.assignee || null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'Alex Johnson',
      time: '2 hours ago',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDrjjIRyg7dEtbkvNL38qS2Kbp5SHp_lbZ_CXgT01WglvbJgK_MWDPIF5ORf-zrZ02BDUET1niqQUl1vJSZQbRSZX75oZZ7QQM_14doekcCYfg22emVcQWXQhYlt4jm4ioV1CkHFdexpGSr6dbNBHFZ8HZeLapqMnW_Y-XSDBtZGFXSNg7raRYH4o81szW64qnkbv8bNKnnKKb8SH370GE9TKH4j1XSymLYXoJ-vpcvWuTqdaHOT1Lm',
      text: "I've uploaded the initial wireframes to the shared drive. Let me know what you think.",
    },
  ]);
  const [currentColumnId, setCurrentColumnId] = useState(task?.columnId || (columns[0] ? columns[0].id : 'col-progress'));
  const [saving, setSaving] = useState(false);

  const currentColumn = columns.find((c) => c.id === currentColumnId) || columns[0] || { title: 'In Progress' };

  const handleSaveDescription = async () => {
    setSaving(true);
    try {
      const taskId = task?._id || task?.id;
      if (taskId && !taskId.startsWith('sample-') && !taskId.startsWith('local-')) {
        await updateTask(taskId, { description, version: task?.version });
      }
      if (onUpdateTask) {
        onUpdateTask({ ...task, description });
      }
      setIsEditingDesc(false);
    } catch (err) {
      console.warn('Failed to save description:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTitleBlur = async () => {
    if (!title.trim() || title === task?.title) return;
    try {
      const taskId = task?._id || task?.id;
      if (taskId && !taskId.startsWith('sample-') && !taskId.startsWith('local-')) {
        await updateTask(taskId, { title, version: task?.version });
      }
      if (onUpdateTask) {
        onUpdateTask({ ...task, title });
      }
    } catch (err) {
      console.warn('Failed to update title:', err);
    }
  };

  const handleStatusChange = async (e) => {
    const newColId = e.target.value;
    setCurrentColumnId(newColId);
    try {
      const taskId = task?._id || task?.id;
      if (taskId && !taskId.startsWith('sample-') && !taskId.startsWith('local-')) {
        await updateTask(taskId, { columnId: newColId, version: task?.version });
      }
      if (onUpdateTask) {
        onUpdateTask({ ...task, columnId: newColId });
      }
    } catch (err) {
      console.warn('Failed to change status:', err);
    }
  };

  const handleAssigneeChange = async (memberKey) => {
    const selected = members.find((m) => (m.id || m._id || m.name) === memberKey) || null;
    setAssignee(selected);
    try {
      const taskId = task?._id || task?.id;
      if (taskId && !taskId.startsWith('sample-') && !taskId.startsWith('local-')) {
        await updateTask(taskId, {
          assignee: selected,
          assignedTo: selected ? (selected.id || selected._id || null) : null,
          version: task?.version,
        });
      }
      if (onUpdateTask) {
        onUpdateTask({
          ...task,
          assignee: selected,
          assignedTo: selected ? (selected.id || selected._id || null) : null,
        });
      }
    } catch (err) {
      console.warn('Failed to update assignee:', err);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Jane Doe',
      time: 'Just now',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCbbulxkUR_BWi-j270bl-IZrg0ux88fe9GUMa3XJ785HJSTrn0Lg67D1Cn62lMA3TGD2rzxSRZN52w0XXbgTjlmXn-A3M2TENvscE2EJCywrAjAryGl7wDqlSuae-wx-jdX0gCms6ltrO4xd_l_cSTISyNBld40NU56vsvD_O-bfiM2qiJbdYjYXhcU9dcbLJ_xezjSR4eDTIsh2C0lXaMj-y5N6yKrAOcwGfZl1ROX6c6mU-41gMO',
      text: commentText.trim(),
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteClick = () => {
    setDeleteError('');
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      const taskId = task?._id || task?.id;
      if (taskId && !taskId.startsWith('sample-') && !taskId.startsWith('local-')) {
        await deleteTask(taskId);
      }
      if (onDeleteTask) {
        onDeleteTask(task);
      }
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-dimmed flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[2px] animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-xl shadow-[0px_8px_16px_rgba(26,37,64,0.08)] border border-outline-variant/40 flex flex-col max-h-[90vh] overflow-hidden text-left bg-white">
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 border-b border-outline-variant/30">
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant text-xs text-gray-500 font-medium">
              <span className="material-symbols-outlined text-[16px]">web</span>
              <span>
                in list{' '}
                <a href="#" onClick={(e) => e.preventDefault()} className="underline hover:text-primary font-semibold text-gray-700">
                  {currentColumn.title}
                </a>
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full bg-transparent border-transparent hover:bg-surface-container-low focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary text-2xl font-bold text-gray-900 rounded px-2 py-1 -ml-2 transition-all outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
          {/* Main Content Area (Left) */}
          <div className="flex-1 p-6 flex flex-col gap-8">
            {/* Description Section */}
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-gray-500 mt-1">notes</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setIsEditingDesc(true)}
                  placeholder="Add a more detailed description..."
                  className="w-full h-32 bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all placeholder:text-gray-400"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleSaveDescription}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-surface-tint transition-colors cursor-pointer shadow-xs disabled:opacity-70"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setDescription(task?.description || '');
                      setIsEditingDesc(false);
                    }}
                    className="px-4 py-2 bg-transparent text-gray-600 text-xs font-medium rounded hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Feed Section */}
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-gray-500 mt-1">list_alt</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
                  <button className="px-3 py-1 bg-surface-container-low text-gray-600 text-xs font-medium rounded hover:bg-surface-container-high transition-colors cursor-pointer">
                    Show Details
                  </button>
                </div>

                {/* Comment Input */}
                <div className="flex gap-3 mb-6">
                  <img
                    alt="Current user"
                    className="w-8 h-8 rounded-full border border-outline-variant object-cover mt-1"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbbulxkUR_BWi-j270bl-IZrg0ux88fe9GUMa3XJ785HJSTrn0Lg67D1Cn62lMA3TGD2rzxSRZN52w0XXbgTjlmXn-A3M2TENvscE2EJCywrAjAryGl7wDqlSuae-wx-jdX0gCms6ltrO4xd_l_cSTISyNBld40NU56vsvD_O-bfiM2qiJbdYjYXhcU9dcbLJ_xezjSR4eDTIsh2C0lXaMj-y5N6yKrAOcwGfZl1ROX6c6mU-41gMO"
                  />
                  <div className="flex-1">
                    <form
                      onSubmit={handleAddComment}
                      className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden"
                    >
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows="2"
                        className="w-full bg-transparent border-none p-3 text-sm text-gray-800 resize-none focus:ring-0 placeholder:text-gray-400 outline-none"
                      />
                      <div className="px-3 py-2 bg-surface-container-low border-t border-outline-variant/30 flex justify-between items-center">
                        <div className="flex gap-1 text-gray-500">
                          <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">format_bold</span>
                          </button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">format_italic</span>
                          </button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">link</span>
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-primary-container text-on-primary-container text-xs font-semibold rounded hover:bg-surface-tint hover:text-white transition-colors cursor-pointer shadow-xs"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Activity Items */}
                <div className="flex flex-col gap-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <img
                        alt="User comment"
                        className="w-8 h-8 rounded-full border border-outline-variant object-cover mt-1"
                        src={c.avatar}
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-900">{c.author}</span>
                          <span className="text-[12px] text-gray-400">{c.time}</span>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 text-sm text-gray-800 shadow-xs bg-gray-50/50">
                          <p>{c.text}</p>
                        </div>
                        <div className="flex gap-3 mt-1 text-[12px] text-gray-500">
                          <button className="hover:text-gray-800 underline cursor-pointer">Edit</button>
                          <button
                            onClick={() => setComments(comments.filter((item) => item.id !== c.id))}
                            className="hover:text-red-600 underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* System Activity */}
                  <div className="flex gap-3">
                    <div className="w-8 flex justify-center mt-1">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">history</span>
                    </div>
                    <div className="flex-1 text-xs text-gray-500 flex items-baseline gap-1">
                      <span className="font-bold text-gray-800">Sarah Lee</span>
                      <span>moved this card from</span>
                      <span className="font-medium underline">To Do</span>
                      <span>to</span>
                      <span className="font-medium underline">In Progress</span>
                      <span className="text-[11px] ml-1">Yesterday at 4:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel (Metadata & Actions) */}
          <div className="w-full md:w-[240px] bg-surface-container-low p-6 border-t md:border-t-0 md:border-l border-outline-variant/30 flex flex-col gap-6 flex-shrink-0 bg-gray-50/60">
            {/* Assignees */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Assignee</h4>
                {assignee && (
                  <button
                    type="button"
                    onClick={() => handleAssigneeChange('')}
                    className="text-[10px] text-gray-400 hover:text-red-500 underline cursor-pointer"
                  >
                    Unassign
                  </button>
                )}
              </div>

              {assignee ? (
                <div className="flex items-center gap-2 mb-2 p-1.5 rounded-lg bg-white border border-outline-variant/40 shadow-xs">
                  {assignee.avatar ? (
                    <img
                      alt={assignee.name}
                      className="w-7 h-7 rounded-full border border-white shadow-xs object-cover"
                      src={assignee.avatar}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold">
                      {(assignee.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-semibold text-gray-800 truncate">{assignee.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{assignee.role || 'Member'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white border border-dashed border-gray-300 text-xs text-gray-400">
                  <span className="material-symbols-outlined text-sm">person_outline</span>
                  <span>Unassigned</span>
                </div>
              )}

              {/* Assignee Dropdown */}
              <div className="relative">
                <select
                  value={assignee ? (assignee.id || assignee._id || assignee.name) : ''}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="w-full bg-white border border-outline-variant/60 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-primary cursor-pointer shadow-xs"
                >
                  <option value="">Select Assignee...</option>
                  {members.map((m) => (
                    <option key={m.id || m._id || m.name} value={m.id || m._id || m.name}>
                      {m.name} ({m.role || 'Member'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Labels */}
            <div>
              <h4 className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-bold">Labels</h4>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="px-2 py-0.5 bg-primary-container text-white text-[11px] font-semibold rounded shadow-xs">
                  Design
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-semibold rounded shadow-xs">
                  High Priority
                </span>
              </div>
              <button className="flex items-center justify-center gap-2 px-3 py-1.5 w-full bg-white border border-outline-variant/50 rounded text-xs text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shadow-xs">
                <span className="material-symbols-outlined text-[16px]">add</span> Add Label
              </button>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-bold">Status</h4>
              <div className="relative">
                <select
                  value={currentColumnId}
                  onChange={handleStatusChange}
                  className="appearance-none w-full bg-white border border-outline-variant/60 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer pr-8 shadow-xs"
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                  {columns.length === 0 && (
                    <>
                      <option value="col-1">To Do</option>
                      <option value="col-2">In Progress</option>
                      <option value="col-3">In Review</option>
                      <option value="col-4">Done</option>
                    </>
                  )}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6 border-t border-outline-variant/30">
              <h4 className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-bold">Actions</h4>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 w-full bg-white border border-outline-variant/50 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shadow-xs text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-400">arrow_forward</span> Move
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 w-full bg-white border border-outline-variant/50 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shadow-xs text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-400">content_copy</span> Copy
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 px-3 py-2 w-full bg-white border border-red-200 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer shadow-xs text-left mt-1"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span> Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern In-App Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full p-6 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-inner">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Task?</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{title}"</span>? This action cannot be undone.
            </p>
            {deleteError && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {deleteError}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-red-200 disabled:opacity-70"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
