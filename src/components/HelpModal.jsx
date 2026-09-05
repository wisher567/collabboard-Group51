import React, { useState, useEffect } from 'react';

export default function HelpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [searchQuery, setSearchQuery] = useState('');

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

  const faqs = [
    {
      q: 'How does real-time collaboration work in CollabBoard?',
      a: 'Cards and board column updates are instantly synchronized across all connected team members through WebSockets and stored reliably in MongoDB Atlas.',
    },
    {
      q: 'How are Sprint Bottlenecks identified and resolved?',
      a: 'The analytics engine flags tasks that remain in progress or stalled for longer than 48 hours. You can review them in the Bottlenecks card and resolve them directly.',
    },
    {
      q: 'How do I export sprint and task performance data?',
      a: 'Navigate to the Analytics page and click the "Export Report" button in the upper right. A comprehensive CSV report will download automatically.',
    },
    {
      q: 'How can I invite team members to my workspace?',
      a: 'Go to the Members tab in the sidebar or Settings, where you can see all registered accounts and configure collaborative permissions.',
    },
  ];

  const shortcuts = [
    { key: 'B', action: 'Navigate to Boards Overview' },
    { key: 'A', action: 'Open Analytics & Velocity Reports' },
    { key: 'M', action: 'Jump to Workspace Members' },
    { key: 'S', action: 'Open Account & Collaboration Settings' },
    { key: 'N', action: 'Create a New Kanban Board' },
    { key: 'Esc', action: 'Close any active dialog or modal' },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] border border-outline-variant/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-md border-b border-outline-variant/20">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-headline-sm">help</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">CollabBoard Help &amp; Resource Center</h2>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Product guide, keyboard shortcuts, FAQs, and platform support
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

        {/* Tab Selector */}
        <div className="flex items-center gap-xs my-md overflow-x-auto pb-xs">
          {[
            { id: 'quickstart', label: 'Quick Start', icon: 'rocket_launch' },
            { id: 'shortcuts', label: 'Shortcuts', icon: 'keyboard' },
            { id: 'faqs', label: 'Frequently Asked', icon: 'quiz' },
            { id: 'support', label: 'Support & Docs', icon: 'contact_support' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-xs px-md py-xs rounded-lg font-label-md text-label-md transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-body-md">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-xs flex flex-col gap-md">
          {activeTab === 'quickstart' && (
            <div className="flex flex-col gap-md">
              <div className="p-md rounded-xl bg-surface-container-low flex items-start gap-md">
                <span className="material-symbols-outlined text-primary text-headline-sm">dashboard</span>
                <div className="flex flex-col">
                  <h3 className="font-body-md text-body-md font-bold text-on-surface">Interactive Kanban Boards</h3>
                  <p className="font-body-md text-label-md text-on-surface-variant mt-0.5">
                    Organize sprints across columns (To Do, In Progress, Review, Done). Drag cards, assign story points, tag priorities, and configure custom workflows.
                  </p>
                </div>
              </div>

              <div className="p-md rounded-xl bg-surface-container-low flex items-start gap-md">
                <span className="material-symbols-outlined text-primary text-headline-sm">monitoring</span>
                <div className="flex flex-col">
                  <h3 className="font-body-md text-body-md font-bold text-on-surface">Velocity &amp; Analytics</h3>
                  <p className="font-body-md text-label-md text-on-surface-variant mt-0.5">
                    Monitor historical sprint throughput, active backlog distribution, average cycle times, and resolve blocker flags with instant CSV exports.
                  </p>
                </div>
              </div>

              <div className="p-md rounded-xl bg-surface-container-low flex items-start gap-md">
                <span className="material-symbols-outlined text-primary text-headline-sm">manage_accounts</span>
                <div className="flex flex-col">
                  <h3 className="font-body-md text-body-md font-bold text-on-surface">Profile &amp; Collaboration Control</h3>
                  <p className="font-body-md text-label-md text-on-surface-variant mt-0.5">
                    Customize your public avatar, presence indicators, notification delivery rules, and manage workspace members directly from MongoDB.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="flex flex-col gap-xs">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-xs">
                Global Keybindings
              </span>
              <div className="divide-y divide-outline-variant/20 rounded-xl bg-surface-container-low overflow-hidden">
                {shortcuts.map((sc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-sm px-md">
                    <span className="font-body-md text-body-md text-on-surface">{sc.action}</span>
                    <kbd className="px-sm py-0.5 rounded bg-surface-container-lowest border border-outline-variant/40 font-mono text-label-sm font-semibold text-primary shadow-xs">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="flex flex-col gap-sm">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-md py-xs rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none mb-xs"
              />
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="p-md rounded-xl bg-surface-container-low flex flex-col gap-xs">
                  <span className="font-body-md text-body-md font-bold text-on-surface flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary text-body-md">help_outline</span>
                    {faq.q}
                  </span>
                  <p className="font-body-md text-label-md text-on-surface-variant pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="flex flex-col gap-md p-md rounded-xl bg-surface-container-low text-center items-center py-lg">
              <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-xs">
                <span className="material-symbols-outlined text-headline-md">support_agent</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">CollabBoard Engineering Support</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Need specialized assistance, custom webhook integrations, or enterprise collaboration setups? Our engineering team is here to help.
              </p>
              <div className="flex items-center gap-sm flex-wrap justify-center mt-xs">
                <a
                  href="mailto:support@collabboard.dev"
                  className="px-lg py-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm inline-flex items-center gap-xs"
                >
                  <span className="material-symbols-outlined text-body-md">mail</span>
                  <span>Email Support (support@collabboard.dev)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-md mt-md border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            CollabBoard Platform v2.14 • MongoDB Atlas Connected
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
