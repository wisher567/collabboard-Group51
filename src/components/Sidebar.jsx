import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArchiveModal from './ArchiveModal';
import HelpModal from './HelpModal';
import collabboardLogo from '../assets/collabboard_logo.png';

export default function Sidebar({ activePath }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath =
    activePath ||
    (location.pathname.startsWith('/analytics')
      ? 'analytics'
      : location.pathname.startsWith('/members')
      ? 'members'
      : location.pathname.startsWith('/settings')
      ? 'settings'
      : location.pathname.startsWith('/boards') || location.pathname.startsWith('/dashboard')
      ? 'boards'
      : '');

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('Marketing Team');
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const navItems = [
    { path: 'boards', label: 'Boards', icon: 'dashboard', to: '/boards' },
    { path: 'members', label: 'Members', icon: 'group', to: '/members' },
    { path: 'analytics', label: 'Analytics', icon: 'bar_chart', to: '/analytics' },
    { path: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
  ];

  // Global keybindings
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setHelpOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex flex-col justify-between pt-md pb-lg select-none">
        <div className="flex flex-col gap-md">
          {/* Brand / Official CollabBoard Logo */}
          <div
            className="px-md flex items-center gap-sm cursor-pointer group"
            onClick={() => navigate('/boards')}
          >
            <img
              src={collabboardLogo}
              alt="CollabBoard Logo"
              className="w-8 h-8 rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              CollabBoard
            </span>
          </div>

          {/* Workspace Switcher */}
          <div className="px-md relative">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="w-full flex items-center justify-between p-sm bg-surface-container-low hover:bg-surface-container hover:text-on-surface rounded-lg transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-sm">
                <div className="w-6 h-6 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md text-label-md font-semibold">
                  {currentWorkspace.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-medium">
                    {currentWorkspace}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Free Tier
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-body-lg">
                unfold_more
              </span>
            </button>

            {workspaceMenuOpen && (
              <div className="absolute top-full left-md right-md mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg z-50 py-1">
                {['Marketing Team', 'Engineering Team', 'Design Sprint'].map((ws) => (
                  <div
                    key={ws}
                    onClick={() => {
                      setCurrentWorkspace(ws);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={`px-sm py-xs text-body-md hover:bg-surface-container-low cursor-pointer flex items-center justify-between ${
                      currentWorkspace === ws ? 'text-primary font-semibold' : 'text-on-surface'
                    }`}
                  >
                    <span>{ws}</span>
                    {currentWorkspace === ws && (
                      <span className="material-symbols-outlined text-body-md">check</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Board Button */}
          <div className="px-md">
            <button
              onClick={() => navigate('/board/new')}
              className="w-full flex items-center justify-center gap-xs py-sm px-md bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-label-md text-label-md rounded-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-body-lg">add</span>
              <span>New Board</span>
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="flex flex-col gap-xs px-md">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.to}
                  data-path={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-sm px-md py-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-fixed text-on-primary-fixed font-label-md font-semibold'
                      : 'font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-body-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Auxiliary Links */}
        <div className="px-md flex flex-col gap-xs">
          <button
            type="button"
            onClick={() => setArchiveOpen(true)}
            data-path="archive"
            className="w-full flex items-center gap-sm px-md py-sm rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-body-lg">archive</span>
            <span>Archive</span>
          </button>
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            data-path="help"
            className="w-full flex items-center gap-sm px-md py-sm rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-body-lg">help</span>
            <span>Help</span>
          </button>
        </div>
      </aside>

      {/* Archive Center Modal */}
      <ArchiveModal isOpen={archiveOpen} onClose={() => setArchiveOpen(false)} />

      {/* Help & Documentation Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
