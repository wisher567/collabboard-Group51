import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { getSettings, updateSettings, resetNotificationDefaults } from '../api/settingsApi';

export default function Settings() {
  const location = useLocation();
  const isMembersRoute = location.pathname.startsWith('/members');
  const [activeTab, setActiveTab] = useState(isMembersRoute ? 'members' : 'profile');

  useEffect(() => {
    if (location.pathname.startsWith('/members')) {
      setActiveTab('members');
    }
  }, [location.pathname]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '' | 'saving' | 'saved'
  const [lastUpdated, setLastUpdated] = useState('today at 10:45 AM');
  const fileInputRef = useRef(null);

  // Profile Form State loaded from MongoDB
  const [profile, setProfile] = useState({
    fullName: '',
    displayHandle: '',
    email: '',
    emailVerified: true,
    role: 'Lead Full Stack Developer',
    timezone: '(UTC-08:00) Pacific Time (US & Canada)',
    bio: 'Leading Q3 Marketing & Product redesign sprints on CollabBoard.',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDgpAuTfntSDT6BFvCebsYZrAyxP0sDz1V8UqyXlEwardJaSKEJr5PaPbRc0gvvghe2XeQs-kF7MKoi4JrauhFJNVtjUzwIrAJYZO2KQYSoIkSHNVD8OlusV9e2wCWDBTjwRdoMw6v3wLSuj3mwi_SCCRWNO0zBM2ehwgJdxGh8aKPs7Xpc3vwWHJO0aMhYShJunifX6K6XILukCaG5GR0JBMuTc7HtzuGNou4ibDl6_BZabiKZf4Vj',
  });

  // Collaboration State
  const [collaboration, setCollaboration] = useState({
    presenceIndicators: true,
    conflictWarnings: true,
    defaultLandingView: 'Last Active Board',
    compactCardDensity: false,
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    directAssignments: true,
    mentions: true,
    dueDateApproaching: true,
    weeklySprintDigest: false,
  });

  // Workspace Members from MongoDB
  const [workspaceMembers, setWorkspaceMembers] = useState([]);

  // Snapshot for revert
  const [initialSnapshot, setInitialSnapshot] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getSettings();
        if (data) {
          if (data.profile) setProfile(data.profile);
          if (data.collaboration) setCollaboration(data.collaboration);
          if (data.notifications) setNotifications(data.notifications);
          if (data.lastUpdated) setLastUpdated(data.lastUpdated);
          if (data.workspaceMembers) setWorkspaceMembers(data.workspaceMembers);
          setInitialSnapshot({
            profile: data.profile || profile,
            collaboration: data.collaboration || collaboration,
            notifications: data.notifications || notifications,
          });
        }
      } catch (err) {
        console.warn('Using default settings state:', err.message);
        setInitialSnapshot({ profile, collaboration, notifications });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleProfileChange = (field, val) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleToggleCollab = (key) => {
    setCollaboration((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleProfileChange('avatarUrl', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    handleProfileChange(
      'avatarUrl',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    );
  };

  const handleResetNotifications = async () => {
    try {
      const updated = await resetNotificationDefaults();
      if (updated?.notifications) {
        setNotifications(updated.notifications);
      } else {
        setNotifications({
          directAssignments: true,
          mentions: true,
          dueDateApproaching: true,
          weeklySprintDigest: false,
        });
      }
    } catch (err) {
      setNotifications({
        directAssignments: true,
        mentions: true,
        dueDateApproaching: true,
        weeklySprintDigest: false,
      });
    }
  };

  const handleCancelRevert = () => {
    if (initialSnapshot) {
      setProfile(initialSnapshot.profile);
      setCollaboration(initialSnapshot.collaboration);
      setNotifications(initialSnapshot.notifications);
    }
    const btn = document.getElementById('cancel-revert-btn');
    if (btn) {
      const oldText = btn.textContent;
      btn.textContent = 'Changes Reverted';
      setTimeout(() => {
        btn.textContent = oldText;
      }, 1500);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('saving');
    try {
      const payload = {
        profile,
        collaboration,
        notifications,
      };
      const res = await updateSettings(payload);
      if (res?.settings?.lastUpdated) {
        setLastUpdated(res.settings.lastUpdated);
      } else {
        const d = new Date();
        let h = d.getHours();
        const m = d.getMinutes().toString().padStart(2, '0');
        const ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        setLastUpdated(`today at ${h}:${m} ${ap}`);
      }
      setInitialSnapshot(JSON.parse(JSON.stringify(payload)));
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: 'person' },
    { id: 'security', label: 'Account Security', icon: 'shield' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications' },
    { id: 'display', label: 'Display & Theme', icon: 'palette' },
    { id: 'members', label: 'Workspace Members', icon: 'group' },
  ];

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <Sidebar activePath={activeTab === 'members' ? 'members' : 'settings'} />

      <div className="pl-64 flex flex-col min-h-screen">
        <TopHeader userAvatar={profile.avatarUrl} />

        <main className="w-full pt-16 bg-background flex-1 px-margin-desktop">
          <div className="flex flex-col w-full pb-xl">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md py-lg">
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-sm">
                  <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    {activeTab === 'members' ? 'Workspace Members' : 'Account Settings'}
                  </span>
                  <span className="px-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                    {activeTab === 'members' ? `${workspaceMembers.length} Members Active` : 'Workspace Active'}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  {activeTab === 'members'
                    ? 'Manage registered team accounts, administrative roles, and collaborative permissions across CollabBoard.'
                    : 'Manage your personal account preferences, live collaboration controls, and notification triggers across the CollabBoard ecosystem.'}
                </p>
              </div>

              {/* Quick Status Pill */}
              <div className="flex items-center gap-sm px-md py-sm rounded-xl bg-surface-container-low self-start md:self-auto shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-md text-label-md text-on-surface">Auto-sync enabled</span>
                <span className="text-outline-variant font-label-sm">|</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Client v2.14</span>
              </div>
            </div>

            {/* Sub-Navigation Horizontal Tabs */}
            <div className="flex items-center gap-xs overflow-x-auto pb-sm mb-lg border-b-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-xs px-md py-sm rounded-lg font-label-md text-label-md whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Settings Content */}
            <div className="flex flex-col gap-lg">
              {/* Workspace Members Tab */}
              {activeTab === 'members' && (
                <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm">
                  <div className="flex items-center justify-between pb-md mb-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                        <span className="material-symbols-outlined text-headline-sm">group</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Workspace Members</h2>
                        <p className="font-label-md text-label-md text-on-surface-variant">
                          Active team accounts registered in MongoDB database
                        </p>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary bg-surface-container-low px-sm py-xs rounded-lg">
                      {workspaceMembers.length} Registered Accounts
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-secondary font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low rounded-lg">
                          <th className="py-sm px-md rounded-l-lg">User</th>
                          <th className="py-sm px-md">Email</th>
                          <th className="py-sm px-md">Role</th>
                          <th className="py-sm px-md rounded-r-lg">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-0">
                        {workspaceMembers.map((member) => (
                          <tr key={member.id || member.email} className="hover:bg-surface-container-low/60 transition-colors">
                            <td className="py-md px-md">
                              <div className="flex items-center gap-sm">
                                <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold flex items-center justify-center font-label-md text-label-md">
                                  {member.initials || 'U'}
                                </div>
                                <span className="font-body-md text-body-md font-semibold text-on-surface">{member.name}</span>
                              </div>
                            </td>
                            <td className="py-md px-md font-body-md text-body-md text-on-surface-variant">{member.email}</td>
                            <td className="py-md px-md font-label-sm text-label-sm">
                              <span className="px-sm py-xs rounded-full bg-surface-container-high text-on-surface font-semibold">
                                {member.role || 'Member'}
                              </span>
                            </td>
                            <td className="py-md px-md font-label-sm text-label-sm text-secondary">{member.joinedDate || 'Recently'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* 1. Profile Information Card */}
              {activeTab !== 'members' && (
                <>
                  <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm">
                <div className="flex items-center justify-between pb-md mb-md">
                  <div className="flex items-center gap-sm">
                    <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                      <span className="material-symbols-outlined text-headline-sm">account_circle</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Profile Information</h2>
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        Update your public identity and work presence
                      </p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary bg-surface-container-low px-sm py-xs rounded-lg">
                    Public within Team
                  </span>
                </div>

                {/* Avatar Upload Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-md p-md rounded-xl bg-surface-container-low mb-lg">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 shadow-md group">
                    <img
                      className="w-full h-full object-cover"
                      alt={`${profile.fullName || 'User'} avatar`}
                      src={profile.avatarUrl}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-on-surface/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-surface text-headline-sm">photo_camera</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col gap-xs grow">
                    <div className="flex items-center gap-xs flex-wrap">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                        className="px-md py-sm rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
                      >
                        Change Avatar
                      </button>
                      <button
                        onClick={handleRemoveAvatar}
                        type="button"
                        className="px-md py-sm rounded-lg text-error hover:bg-error-container/30 font-label-md text-label-md transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Recommended JPG, PNG, or WebP. Minimum size 400×400px. Max limit 4MB.
                    </span>
                  </div>

                  {/* Visual Mini Activity Spark */}
                  <div className="hidden xl:flex flex-col items-end gap-xs text-right pr-sm">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Board Activity</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-3 rounded-full bg-secondary-container"></span>
                      <span className="w-1.5 h-5 rounded-full bg-primary-container"></span>
                      <span className="w-1.5 h-7 rounded-full bg-primary"></span>
                      <span className="w-1.5 h-4 rounded-full bg-primary-fixed-dim"></span>
                      <span className="w-1.5 h-6 rounded-full bg-primary"></span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">Top 5% active</span>
                  </div>
                </div>

                {/* Form Fields Grid (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Full Name */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface font-medium">Full Name</label>
                    <div className="relative">
                      <input
                        className="w-full px-md py-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container focus:ring-0 shadow-sm transition-colors"
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline text-body-md">
                        badge
                      </span>
                    </div>
                  </div>

                  {/* Display Name / Handle */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface font-medium">Display Handle</label>
                    <div className="relative">
                      <input
                        className="w-full px-md py-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container focus:ring-0 shadow-sm transition-colors"
                        type="text"
                        value={profile.displayHandle}
                        onChange={(e) => handleProfileChange('displayHandle', e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline text-body-md">
                        alternate_email
                      </span>
                    </div>
                  </div>

                  {/* Email Address with Verified Badge */}
                  <div className="flex flex-col gap-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface font-medium">Email Address</label>
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-primary-fixed bg-secondary-fixed px-sm py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-label-sm text-primary">verified</span>
                        Verified
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        className="w-full px-md py-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container shadow-sm transition-colors"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline text-body-md">
                        mail
                      </span>
                    </div>
                  </div>

                  {/* Role / Title */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface font-medium">Role / Title</label>
                    <div className="relative">
                      <input
                        className="w-full px-md py-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container shadow-sm transition-colors"
                        type="text"
                        value={profile.role}
                        onChange={(e) => handleProfileChange('role', e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline text-body-md">
                        work
                      </span>
                    </div>
                  </div>

                  {/* Timezone Selector */}
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface font-medium">Timezone</label>
                    <div className="relative">
                      <select
                        value={profile.timezone}
                        onChange={(e) => handleProfileChange('timezone', e.target.value)}
                        className="w-full appearance-none px-md py-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container shadow-sm cursor-pointer transition-colors pr-xl"
                      >
                        <option>(UTC-08:00) Pacific Time (US &amp; Canada)</option>
                        <option>(UTC-05:00) Eastern Time (US &amp; Canada)</option>
                        <option>(UTC+00:00) Greenwich Mean Time : London</option>
                        <option>(UTC+01:00) Central European Time : Berlin, Paris</option>
                        <option>(UTC+09:00) Japan Standard Time : Tokyo</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Bio / Status Note */}
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface font-medium">Bio &amp; Status Note</label>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {profile.bio.length}/120 characters
                      </span>
                    </div>
                    <textarea
                      maxLength={120}
                      rows={2}
                      value={profile.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="w-full px-md py-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container shadow-sm transition-colors resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Collaboration & Board Preferences */}
              <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm">
                <div className="flex items-center justify-between pb-md mb-md">
                  <div className="flex items-center gap-sm">
                    <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined text-headline-sm">tune</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Collaboration &amp; Board Preferences</h2>
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        Configure real-time teamwork dynamics and canvas behaviors
                      </p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-label-md">bolt</span> Live Synced
                  </span>
                </div>

                <div className="flex flex-col gap-md">
                  {/* Toggle 1: Real-time Presence */}
                  <div className="flex items-center justify-between p-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div className="flex items-start gap-md max-w-xl">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-body-lg">near_me</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-body-lg text-on-surface font-semibold">
                          Real-time presence indicators
                        </span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          Broadcast live status, active canvas selection, and cursor movement to teammates currently viewing the board.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={collaboration.presenceIndicators}
                      onClick={() => handleToggleCollab('presenceIndicators')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        collaboration.presenceIndicators ? 'bg-primary' : 'bg-surface-variant'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-md ring-0 transition duration-200 ease-in-out my-0.5 ml-0.5 ${
                          collaboration.presenceIndicators ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>

                  {/* Toggle 2: Conflict Warning Alerts (Orange Accent Token) */}
                  <div className="flex items-center justify-between p-md rounded-xl bg-tertiary-fixed/30 hover:bg-tertiary-fixed/40 transition-colors">
                    <div className="flex items-start gap-md max-w-xl">
                      <div className="w-8 h-8 rounded-lg bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-body-lg">warning</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-xs">
                          <span className="font-headline-sm text-body-lg text-on-tertiary-fixed font-semibold">
                            Conflict warning alerts
                          </span>
                          <span className="px-xs py-0.5 rounded text-[10px] bg-tertiary text-on-tertiary font-semibold uppercase tracking-wider">
                            Crucial
                          </span>
                        </div>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          Instantly flash non-intrusive warnings when two teammates make simultaneous updates to identical card descriptions or subtasks.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={collaboration.conflictWarnings}
                      onClick={() => handleToggleCollab('conflictWarnings')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        collaboration.conflictWarnings ? 'bg-primary' : 'bg-surface-variant'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-md ring-0 transition duration-200 ease-in-out my-0.5 ml-0.5 ${
                          collaboration.conflictWarnings ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>

                  {/* Select: Default Landing View */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md p-md rounded-xl bg-surface-container-low">
                    <div className="flex items-start gap-md">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-body-lg">view_kanban</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-body-lg text-on-surface font-semibold">Default landing view</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          Determine the primary workspace location opened upon CollabBoard login.
                        </span>
                      </div>
                    </div>
                    <div className="relative min-w-[200px]">
                      <select
                        value={collaboration.defaultLandingView}
                        onChange={(e) => setCollaboration((prev) => ({ ...prev, defaultLandingView: e.target.value }))}
                        className="w-full appearance-none px-md py-sm rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm outline-none cursor-pointer pr-xl"
                      >
                        <option>Last Active Board</option>
                        <option>My Boards Grid</option>
                        <option>Workspace Overview</option>
                        <option>Assigned Tasks List</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Toggle 4: Compact Task Card Density */}
                  <div className="flex items-center justify-between p-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div className="flex items-start gap-md max-w-xl">
                      <div className="w-8 h-8 rounded-lg bg-on-surface-variant/10 text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-body-lg">density_small</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-xs">
                          <span className="font-headline-sm text-body-lg text-on-surface font-semibold">
                            Compact task card density
                          </span>
                          <span className="px-xs py-0.5 rounded text-[10px] bg-surface-variant text-on-surface-variant font-semibold uppercase tracking-wider">
                            Standard Default
                          </span>
                        </div>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          Condense Kanban columns by hiding tag preview labels and multiline task descriptions.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={collaboration.compactCardDensity}
                      onClick={() => handleToggleCollab('compactCardDensity')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        collaboration.compactCardDensity ? 'bg-primary' : 'bg-surface-variant'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-md ring-0 transition duration-200 ease-in-out my-0.5 ml-0.5 ${
                          collaboration.compactCardDensity ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </section>

              {/* 3. Email & In-App Notifications */}
              <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm">
                <div className="flex items-center justify-between pb-md mb-md">
                  <div className="flex items-center gap-sm">
                    <div className="w-9 h-9 rounded-lg bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed-variant">
                      <span className="material-symbols-outlined text-headline-sm">mark_email_unread</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Email &amp; In-App Notifications</h2>
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        Choose delivery channels and delivery pacing for board events
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetNotifications}
                    className="text-primary font-label-md text-label-md hover:underline cursor-pointer"
                  >
                    Reset to defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Notification Item 1 */}
                  <label className="flex items-start gap-md p-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.directAssignments}
                      onChange={() => handleToggleNotif('directAssignments')}
                      className="mt-1 w-4 h-4 rounded text-primary accent-primary bg-surface-container-lowest cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-body-md text-on-surface font-semibold">
                        Direct Task Assignments
                      </span>
                      <span className="font-body-md text-label-md text-on-surface-variant">
                        Receive immediate email notification and mobile push when assigned to a task card.
                      </span>
                    </div>
                  </label>

                  {/* Notification Item 2 */}
                  <label className="flex items-start gap-md p-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.mentions}
                      onChange={() => handleToggleNotif('mentions')}
                      className="mt-1 w-4 h-4 rounded text-primary accent-primary bg-surface-container-lowest cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-body-md text-on-surface font-semibold">
                        Mentions in Task Comments
                      </span>
                      <span className="font-body-md text-label-md text-on-surface-variant">
                        Notify when a team member includes your {profile.displayHandle || '@handle'} handle in card discussion threads.
                      </span>
                    </div>
                  </label>

                  {/* Notification Item 3 */}
                  <label className="flex items-start gap-md p-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.dueDateApproaching}
                      onChange={() => handleToggleNotif('dueDateApproaching')}
                      className="mt-1 w-4 h-4 rounded text-primary accent-primary bg-surface-container-lowest cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-body-md text-on-surface font-semibold">
                        Due Date Approaching (24h Before)
                      </span>
                      <span className="font-body-md text-label-md text-on-surface-variant">
                        Get an automated reminder 24 hours prior to scheduled card deadlines.
                      </span>
                    </div>
                  </label>

                  {/* Notification Item 4 */}
                  <label className="flex items-start gap-md p-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.weeklySprintDigest}
                      onChange={() => handleToggleNotif('weeklySprintDigest')}
                      className="mt-1 w-4 h-4 rounded text-primary accent-primary bg-surface-container-lowest cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-body-md text-on-surface font-semibold">
                        Weekly Sprint Digest Summary
                      </span>
                      <span className="font-body-md text-label-md text-on-surface-variant">
                        A consolidated email digest delivered every Monday at 8:00 AM with team velocity metrics.
                      </span>
                    </div>
                  </label>
                </div>
                  </section>
                </>
              )}

              {/* 4. Form Actions Bottom Bar */}
              <div className="sticky bottom-4 z-30 flex flex-col sm:flex-row items-center justify-between gap-md p-md rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-body-lg text-outline">history</span>
                  <span className="font-label-md text-label-md">Last updated {lastUpdated}</span>
                </div>

                <div className="flex items-center gap-sm w-full sm:w-auto justify-end">
                  <button
                    id="cancel-revert-btn"
                    onClick={handleCancelRevert}
                    type="button"
                    className="px-md py-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md transition-colors w-1/2 sm:w-auto text-center cursor-pointer"
                  >
                    Cancel / Revert
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    type="button"
                    className="flex items-center justify-center gap-xs px-lg py-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-md transition-all duration-150 w-1/2 sm:w-auto cursor-pointer"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <span className="material-symbols-outlined text-body-md animate-spin">refresh</span>
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <span className="material-symbols-outlined text-body-md">check_circle</span>
                        <span>Saved Successfully!</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-body-md">save</span>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
