import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoards, createBoard } from '../api/boardApi';
import collabboardLogo from '../assets/collabboard_logo.png';

const SAMPLE_BOARDS = [
  {
    _id: 'demo-1',
    title: 'Mobile App Redesign',
    updated: 'Updated 2 hours ago',
    members: 4,
    color: 'bg-primary/10 border-primary/20',
    iconColor: 'text-primary',
    starred: true,
  },
  {
    _id: 'demo-2',
    title: 'Q4 Product Roadmap',
    updated: 'Updated yesterday',
    members: 6,
    color: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-600',
    starred: true,
  },
  {
    _id: 'demo-3',
    title: 'Marketing Campaign Launch',
    updated: 'Updated 3 days ago',
    members: 3,
    color: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-600',
    starred: false,
  },
  {
    _id: 'demo-4',
    title: 'Customer Feedback Backlog',
    updated: 'Updated 1 week ago',
    members: 8,
    color: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-600',
    starred: false,
  },
  {
    _id: 'demo-5',
    title: 'Engineering Sprint 42',
    updated: 'Updated 2 weeks ago',
    members: 5,
    color: 'bg-rose-500/10 border-rose-500/20',
    iconColor: 'text-rose-600',
    starred: false,
  },
  {
    _id: 'demo-6',
    title: 'Design System Documentation',
    updated: 'Updated 3 weeks ago',
    members: 2,
    color: 'bg-sky-500/10 border-sky-500/20',
    iconColor: 'text-sky-600',
    starred: false,
  },
];

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !currentUser) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((userData) => {
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setCurrentUser(userData);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  let navigate;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  useEffect(() => {
    async function loadBoards() {
      try {
        setLoading(true);
        const data = await getBoards();
        if (data && Array.isArray(data) && data.length > 0) {
          setBoards(data);
        } else {
          setBoards(SAMPLE_BOARDS);
        }
      } catch (err) {
        console.warn('Could not fetch boards from API, using sample data:', err);
        setBoards(SAMPLE_BOARDS);
      } finally {
        setLoading(false);
      }
    }
    loadBoards();
  }, []);

  const filteredBoards = boards.filter((b) =>
    (b.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (navigate) navigate('/login');
    else window.location.href = '/login';
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setCreating(true);
      setCreateError('');
      const created = await createBoard(newTitle.trim());
      setIsModalOpen(false);
      setNewTitle('');
      if (created && created._id) {
        if (navigate) navigate(`/board/${created._id}`);
        else window.location.href = `/board/${created._id}`;
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create board. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCardClick = async (board) => {
    if (board._id && !board._id.startsWith('demo-')) {
      if (navigate) navigate(`/board/${board._id}`);
      else window.location.href = `/board/${board._id}`;
    } else {
      try {
        const created = await createBoard(board.title);
        if (created && created._id) {
          if (navigate) navigate(`/board/${created._id}`);
          else window.location.href = `/board/${created._id}`;
        }
      } catch (e) {
        if (navigate) navigate('/board/new');
        else window.location.href = '/board/new';
      }
    }
  };

  return (
    <div className="flex h-screen bg-surface font-sans text-on-surface antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-outline-variant/30 flex flex-col justify-between p-4 bg-surface-container-low shrink-0 select-none hidden md:flex">
        <div className="space-y-6">
          {/* App Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <img
              src={collabboardLogo}
              alt="CollabBoard Logo"
              className="w-8 h-8 rounded object-contain"
            />
            <span className="font-bold text-lg tracking-tight text-on-surface">
              CollabBoard
            </span>
          </div>

          {/* Current Workspace Switcher */}
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-outline-variant/40 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                {(currentUser?.name || 'W').charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold leading-tight">Workspace</p>
                <p className="text-[10px] text-gray-500 truncate max-w-[120px]">
                  {currentUser?.name ? `${currentUser.name}'s Team` : 'Marketing Team'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 text-sm">
              unfold_more
            </span>
          </div>

          {/* Primary Action */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-primary hover:bg-primary-container text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer text-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Create New Board
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => navigate('/boards')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium bg-secondary-container text-on-secondary-container transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                dashboard
              </span>
              <span>Boards</span>
            </button>
            <button
              onClick={() => navigate('/members')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-surface-container-high transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                group
              </span>
              <span>Members</span>
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-surface-container-high transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                bar_chart
              </span>
              <span>Analytics</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-surface-container-high transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                settings
              </span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom utility links */}
        <div className="space-y-1 pt-4 border-t border-outline-variant/30">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-surface-container-high transition-colors text-left cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              inventory_2
            </span>
            <span>Archive</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-surface-container-high transition-colors text-left cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Help &amp; Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-surface-container-lowest">
        {/* Top App Bar */}
        <header className="h-16 border-b border-outline-variant/30 flex items-center justify-between px-6 bg-surface-container-lowest shrink-0">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search boards, tasks, or members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 ml-4">
            <button className="text-gray-600 hover:bg-surface-container-high transition-colors p-2 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-[22px]">
                notifications
              </span>
            </button>
            <button className="text-gray-600 hover:bg-surface-container-high transition-colors p-2 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hidden md:flex">
              <span className="material-symbols-outlined text-[22px]">
                help
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="bg-primary-container text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
            >
              Share
            </button>

            {/* User Profile */}
            <div className="relative ml-1">
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs cursor-pointer ring-2 ring-outline-variant/30 hover:ring-primary transition-all shadow-2xs"
                title={currentUser?.name || currentUser?.email || 'User Profile'}
              >
                {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
              </div>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1.5 z-50 text-left">
                  <div className="px-3 py-2 border-b border-outline-variant/20 mb-1">
                    <p className="text-xs font-semibold text-on-surface truncate">
                      {currentUser?.name || 'User Account'}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {currentUser?.email || ''}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (navigate) navigate('/settings');
                      else window.location.href = '/settings';
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    Account &amp; Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (navigate) navigate('/analytics');
                      else window.location.href = '/analytics';
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">bar_chart</span>
                    Analytics &amp; Reports
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (navigate) navigate('/settings');
                      else window.location.href = '/settings';
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-500">settings</span>
                    Settings
                  </button>
                  <div className="border-t border-outline-variant/20 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-outline-variant/20">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Workspace Boards
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Collaborate with your team, manage workflows, and track sprint tasks in real time.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Board
            </button>
          </div>

          {/* Boards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                All Boards ({filteredBoards.length})
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-2xl bg-surface-container-low animate-pulse border border-outline-variant/30"
                  />
                ))}
              </div>
            ) : filteredBoards.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-low/50 rounded-2xl border border-dashed border-outline-variant/50">
                <span className="material-symbols-outlined text-gray-400 text-5xl mb-3">
                  dashboard_customize
                </span>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No boards found
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  {searchTerm
                    ? `No boards match "${searchTerm}"`
                    : 'Create your first board to start collaborating.'}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-container"
                >
                  Create Board
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBoards.map((board) => (
                  <div
                    key={board._id}
                    onClick={() => handleCardClick(board)}
                    className="group bg-surface-container-lowest hover:bg-surface-container-low/80 rounded-2xl p-5 border border-outline-variant/30 hover:border-primary/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-40 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            board.color || 'bg-primary/10 border-primary/20'
                          } ${board.iconColor || 'text-primary'}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            space_dashboard
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 text-sm">
                            {board.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {board.updated || 'Active recently'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`material-symbols-outlined text-lg ${
                          board.starred
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-300 group-hover:text-gray-400'
                        }`}
                      >
                        star
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-gray-400">
                          group
                        </span>
                        {Array.isArray(board.members) ? board.members.length : (board.members || 3)} members
                      </span>
                      <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs">
                        Open <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Board Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-100 text-left animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">Create New Board</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCreateError('');
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer rounded-full p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              {createError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {createError}
                </div>
              )}
              <div>
                <label
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                  htmlFor="board-title"
                >
                  Board Title
                </label>
                <input
                  id="board-title"
                  type="text"
                  placeholder="e.g. Sprint 24 Planning"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-gray-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCreateError('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-primary hover:bg-primary-container text-white px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-70 flex items-center gap-1.5"
                >
                  {creating ? 'Creating...' : 'Create Board'}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm animate-fadeIn">
          <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern In-App Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 text-left animate-scaleUp">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Share Workspace</h3>
                  <p className="text-xs text-gray-500">Invite colleagues or copy the workspace link.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="my-5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Workspace Link
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 pl-3">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent border-none text-xs text-gray-700 flex-1 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                    setCopied(true);
                    showToast('Link copied to clipboard!');
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-primary text-white hover:bg-primary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-gray-400">lock_open</span>
                Public to workspace members
              </span>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
