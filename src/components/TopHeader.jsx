import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpModal from './HelpModal';

export default function TopHeader({ userAvatar, onSearch }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const notifications = [
    { id: 1, title: 'Sprint 27 Velocity Updated', desc: 'Velocity increased by +12.4%', time: '10m ago', unread: true },
    { id: 2, title: 'New Task Assignment', desc: 'Jane assigned "Implement authentication" to you', time: '1h ago', unread: true },
    { id: 3, title: 'Board Sync Completed', desc: 'All changes synced with server', time: '3h ago', unread: false },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const avatar =
    userAvatar ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDgpAuTfntSDT6BFvCebsYZrAyxP0sDz1V8UqyXlEwardJaSKEJr5PaPbRc0gvvghe2XeQs-kF7MKoi4JrauhFJNVtjUzwIrAJYZO2KQYSoIkSHNVD8OlusV9e2wCWDBTjwRdoMw6v3wLSuj3mwi_SCCRWNO0zBM2ehwgJdxGh8aKPs7Xpc3vwWHJO0aMhYShJunifX6K6XILukCaG5GR0JBMuTc7HtzuGNou4ibDl6_BZabiKZf4Vj';

  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (e) {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-margin-desktop">
        <div className="flex items-center gap-md flex-1 max-w-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-body-lg">
              search
            </span>
            <input
              className="w-full pl-xl pr-md py-sm bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md rounded-lg outline-none focus:bg-surface-container transition-colors"
              placeholder="Search boards, cards, or tasks..."
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          {/* Help */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title="Help & Documentation"
          >
            <span className="material-symbols-outlined text-body-lg">help</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors flex items-center justify-center relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-body-lg">notifications</span>
              <span className="absolute top-xs right-xs w-2 h-2 rounded-full bg-error"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-50 p-md flex flex-col gap-sm">
                <div className="flex items-center justify-between border-b border-surface-container pb-xs">
                  <span className="font-headline-sm text-body-lg font-semibold text-on-surface">Notifications</span>
                  <span className="font-label-sm text-label-sm text-primary font-medium cursor-pointer">Mark all as read</span>
                </div>
                <div className="flex flex-col gap-xs max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-xs rounded-lg hover:bg-surface-container-low transition-colors flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md font-semibold text-on-surface">{n.title}</span>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                      </div>
                      <span className="font-body-md text-label-sm text-on-surface-variant">{n.desc}</span>
                      <span className="font-label-sm text-[10px] text-secondary mt-0.5">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-xs py-sm px-md bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container hover:text-on-secondary-fixed rounded-lg font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-body-lg">share</span>
            <span>Share</span>
          </button>

          {/* Profile Avatar + Menu */}
          <div className="relative ml-xs">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="User Account & Settings"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary transition-all"
                src={avatar}
              />
            </div>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-50 py-1.5 text-left">
                <div className="px-3 py-2 border-b border-outline-variant/20 mb-1">
                  <p className="text-xs font-semibold text-on-surface truncate">
                    {currentUser?.name || 'User Account'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant truncate">
                    {currentUser?.email || ''}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                  Boards Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                  Account &amp; Profile
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/analytics');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">bar_chart</span>
                  Analytics &amp; Reports
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">settings</span>
                  Settings
                </button>
                <div className="border-t border-outline-variant/20 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-error hover:bg-error-container/20 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-2xl max-w-md w-full flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-body-lg">share</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Share Workspace</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-xs text-on-surface-variant hover:text-on-surface rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="font-body-md text-on-surface-variant text-body-md">
              Anyone with this link can view the Marketing Team workspace and metrics.
            </p>

            <div className="flex items-center gap-xs p-xs bg-surface-container-low rounded-lg border border-outline-variant/30">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full bg-transparent text-on-surface text-body-md px-sm outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-md py-xs bg-primary text-on-primary rounded-md font-label-md hover:bg-primary-container transition-colors shrink-0"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="flex justify-end gap-sm pt-xs">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-md py-sm bg-surface-container-low text-on-surface rounded-lg font-label-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Resource Center Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  );
}
