import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { getAnalytics, resolveBottlenecks, getExportUrl } from '../api/analyticsApi';

export default function Analytics() {
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedBottlenecks, setSelectedBottlenecks] = useState([]);
  const [resolving, setResolving] = useState(false);
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async (selectedRange = range) => {
    try {
      setLoading(true);
      const res = await getAnalytics(selectedRange);
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      // Default fallback matching screenshot if backend unreachable
      setData({
        range: selectedRange,
        kpi: {
          velocity: { value: 42, unit: 'pts / sprint', changeText: '+12.4% vs last mo', sparkline: 'M2 18 L16 14 L30 17 L44 9 L58 12 L78 3' },
          completedTasks: { completed: 128, planned: 140, percentage: 91.4, changeText: '+18.4%' },
          cycleTime: { value: '2.4', unit: 'days', changeText: '-0.6d improvement', badge: 'Faster' },
          activeBlockers: { count: 3, label: 'unresolved', statusText: 'Requires review', badge: 'P0 / High' },
        },
        sprints: [
          { name: 'Sprint 22', plannedHeight: 65, completedHeight: 55, pts: '34pt', current: false },
          { name: 'Sprint 23', plannedHeight: 70, completedHeight: 68, pts: '38pt', current: false },
          { name: 'Sprint 24', plannedHeight: 75, completedHeight: 72, pts: '41pt', current: false },
          { name: 'Sprint 25', plannedHeight: 72, completedHeight: 58, pts: '36pt', current: false },
          { name: 'Sprint 26', plannedHeight: 80, completedHeight: 82, pts: '45pt', current: false },
          { name: 'Sprint 27*', plannedHeight: 85, completedHeight: 92, pts: '48pt', current: true },
        ],
        forecast: {
          message: 'Sprint 27 is tracking +8% ahead of the historical quarterly average.',
        },
        statusBreakdown: {
          total: 140,
          centerPercentage: '36%',
          centerLabel: 'In Progress',
          segments: [
            { name: 'To Do (24%)', colorClass: 'bg-outline-variant' },
            { name: 'Doing (36%)', colorClass: 'bg-primary-container' },
            { name: 'Review (15%)', colorClass: 'bg-secondary' },
            { name: 'Done (25%)', colorClass: 'bg-primary' },
          ],
          priorityDispersion: [
            { label: '18 High', bg: 'bg-error-container text-on-error-container' },
            { label: '64 Medium', bg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
            { label: '58 Low', bg: 'bg-surface-container-high text-on-surface' },
          ],
        },
        teamWorkload: [
          {
            name: 'Alex Johnson',
            role: 'Lead Frontend Dev',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-1YbzzzwTFDBy0gvkwZwl4Oonh_JfVTFMQrzaex6f9BhjSRE3SE8cZcW3mzS_cEY18BxDiLe4NWICwpcJ9WNvgMPUElqPpyiX7nAGOuZphE1VacX_lqFyNvpZPp3M8NU4GNxJWLEfHcAvVQc40eNeF5YLRUlMuc3R3DbQXkne4t1gtwfVHSX4fhvmvhN_hQr_zOsDhUR_Rb8an4iu_PzC64pD3XZbAK86o-4tuL9qwcYFziGyAPiB',
            assignedCards: '14 cards',
            completionRate: 86,
            lastActive: '10m ago',
            color: 'bg-primary',
          },
          {
            name: 'Sarah Lee',
            role: 'Product Designer',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXlN7abP2zaLirYHifDSbDf7cUNeaZ_eS8d-jEXNvZre4OJEq3FmTgueexw7s1rnZ168aG9flte1tUy6O62fII3HbQwg14qVNXNvTWWut4fpyue--BffhVAwN1NQ9o1fKAZd2eG72Oz2GtPnncKxALvQ-gXLR4xRP6RlSiaqO8NCu1FhXxuLZmnyoHlfUcM2N8kuL4f68GVAvCzENR01XOw4O0b99p7rIqkILnVuOqXiQpnanZvaZE',
            assignedCards: '9 cards',
            completionRate: 94,
            lastActive: '2h ago',
            color: 'bg-primary',
          },
          {
            name: 'Marcus Vance',
            role: 'Full Stack Engineer',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS7Ml9n3lcBcw67FAGPJ9Y6dvnN30It8K7QHAevOiH5QTBGANMTRvx_MO8pzj_OxGOV6ipk93gWVPvYVbvuKziJ9uAzeJT9fUDKVNv0VowHSI22s79XhVjzpiHI2rZNBEmYvG51kb5E1qoLwaqbsXvirPBVTdlI7KiKtVP6tLAv0hAc6MnSjTAai8qr6CVEL67pw6bYiq-iLERKB9_baNrA11R_DaIp4Y4bM6vsYF0vm4suyP97qxj',
            assignedCards: '18 cards',
            completionRate: 68,
            lastActive: 'Just now',
            color: 'bg-tertiary',
          },
          {
            name: 'Jane Doe',
            role: 'QA Strategist',
            initials: 'JD',
            assignedCards: '11 cards',
            completionRate: 82,
            lastActive: '1d ago',
            color: 'bg-primary',
          },
        ],
        bottlenecks: [
          {
            id: 'b-1',
            type: 'Bug',
            tagClass: 'bg-error text-on-error',
            statusTag: '3 days overdue',
            statusIcon: 'schedule',
            statusColor: 'text-error',
            title: 'Stripe Checkout Webhook Failure',
            blockedBy: 'Marcus V.',
            reason: 'Missing API Credentials',
            reasonColor: 'text-tertiary',
            resolved: false,
          },
          {
            id: 'b-2',
            type: 'Feature',
            tagClass: 'bg-primary-fixed text-on-primary-fixed',
            statusTag: 'Stalled 2d',
            statusIcon: 'pending',
            statusColor: 'text-tertiary',
            title: 'Multi-workspace Permission Matrix',
            assigned: 'Alex Johnson',
            reason: 'Awaiting Security Signoff',
            reasonColor: 'text-on-surface',
            resolved: false,
          },
          {
            id: 'b-3',
            type: 'Content',
            tagClass: 'bg-secondary-container text-on-secondary-container',
            statusTag: 'Sync Conflict',
            statusIcon: 'sync_problem',
            statusColor: 'text-outline',
            title: 'Q4 Product Release Playbook',
            assigned: 'Sarah Lee',
            reason: 'Reviewer Offline',
            reasonColor: 'text-on-surface-variant',
            resolved: false,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(range);
  }, [range]);

  const handleDateFilter = (newRange) => {
    setRange(newRange);
  };

  const handleExport = () => {
    window.open(getExportUrl(), '_blank');
    showToast('Exporting CSV report...');
  };

  const toggleSelectBottleneck = (id) => {
    if (selectedBottlenecks.includes(id)) {
      setSelectedBottlenecks(selectedBottlenecks.filter((i) => i !== id));
    } else {
      setSelectedBottlenecks([...selectedBottlenecks, id]);
    }
  };

  const handleResolveBottlenecks = async () => {
    try {
      setResolving(true);
      const payload = selectedBottlenecks.length > 0 ? { ids: selectedBottlenecks } : { resolveAll: true };
      const res = await resolveBottlenecks(payload);
      setSelectedBottlenecks([]);
      showToast(res.message || 'Bottlenecks resolved successfully!');
      loadData(range);
    } catch (err) {
      console.error('Resolve failed:', err);
      showToast('Error resolving bottlenecks');
    } finally {
      setResolving(false);
    }
  };

  // KPI values with safe fallback
  const kpi = data?.kpi || {
    velocity: { value: 42, unit: 'pts / sprint', changeText: '+12.4% vs last mo', sparkline: 'M2 18 L16 14 L30 17 L44 9 L58 12 L78 3' },
    completedTasks: { completed: 128, planned: 140, percentage: 91.4, changeText: '+18.4%' },
    cycleTime: { value: '2.4', unit: 'days', changeText: '-0.6d improvement', badge: 'Faster' },
    activeBlockers: { count: 3, label: 'unresolved', statusText: 'Requires review', badge: 'P0 / High' },
  };

  const sprints = data?.sprints || [
    { id: 's22', name: 'Sprint 22', plannedHeight: 65, completedHeight: 55, pts: '34pt', current: false },
    { id: 's23', name: 'Sprint 23', plannedHeight: 70, completedHeight: 68, pts: '38pt', current: false },
    { id: 's24', name: 'Sprint 24', plannedHeight: 75, completedHeight: 72, pts: '41pt', current: false },
    { id: 's25', name: 'Sprint 25', plannedHeight: 72, completedHeight: 58, pts: '36pt', current: false },
    { id: 's26', name: 'Sprint 26', plannedHeight: 80, completedHeight: 82, pts: '45pt', current: false },
    { id: 's27', name: 'Sprint 27*', plannedHeight: 85, completedHeight: 92, pts: '48pt', current: true },
  ];

  const forecast = data?.forecast || {
    message: 'Sprint 27 is tracking +8% ahead of the historical quarterly average.',
  };

  const statusBreakdown = data?.statusBreakdown || {
    total: 19,
    centerPercentage: '36%',
    centerLabel: 'In Progress',
    segments: [
      { name: 'To Do (24%)', colorClass: 'bg-outline-variant' },
      { name: 'Doing (36%)', colorClass: 'bg-primary-container' },
      { name: 'Review (15%)', colorClass: 'bg-secondary' },
      { name: 'Done (25%)', colorClass: 'bg-primary' },
    ],
    priorityDispersion: [
      { label: '4 High', bg: 'bg-error-container text-on-error-container' },
      { label: '9 Medium', bg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
      { label: '6 Low', bg: 'bg-surface-container-high text-on-surface' },
    ],
  };

  const teamWorkload = data?.teamWorkload || [];
  const bottlenecks = data?.bottlenecks || [];
  const unresolvedCount = bottlenecks.filter((b) => !b.resolved).length;

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <Sidebar activePath="analytics" />

      <div className="pl-64 flex flex-col min-h-screen">
        <TopHeader />

        <main className="w-full pt-16 bg-background flex-1 px-margin-desktop">
          <div className="flex flex-col w-full pb-xl">
            {/* Header with Filters & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md py-lg">
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-xs text-secondary font-label-md text-label-md">
                  <span>Marketing Team Workspace</span>
                  <span className="material-symbols-outlined text-body-md text-outline">chevron_right</span>
                  <span className="text-primary font-semibold">Velocity &amp; Reports</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Analytics &amp; Insights</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Track team velocity, throughput, and sprint performance across boards.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-sm">
                {/* Date Range Selector Pill */}
                <div className="flex items-center bg-surface-container-low p-xs rounded-xl shadow-sm">
                  <button
                    onClick={() => handleDateFilter('30d')}
                    className={`px-md py-xs rounded-lg font-label-md text-label-md transition-all ${
                      range === '30d'
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => handleDateFilter('q3')}
                    className={`px-md py-xs rounded-lg font-label-md text-label-md transition-colors ${
                      range === 'q3'
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Q3 2024
                  </button>
                  <button
                    onClick={() => handleDateFilter('custom')}
                    className={`px-md py-xs rounded-lg font-label-md text-label-md transition-colors flex items-center gap-xs ${
                      range === 'custom'
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Custom</span>
                    <span className="material-symbols-outlined text-body-md">calendar_today</span>
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="flex items-center gap-xs px-md py-sm bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-body-lg text-secondary">download</span>
                  <span>Export Report</span>
                </button>

                {/* Refresh Action */}
                <button
                  onClick={() => {
                    loadData(range);
                    showToast('Metrics refreshed');
                  }}
                  className="p-sm bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant rounded-lg shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                  title="Refresh metrics"
                >
                  <span className={`material-symbols-outlined text-body-lg ${loading ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid (4 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
              {/* Metric 1: Velocity */}
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-secondary">Average Velocity</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        {kpi.velocity.value}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        {kpi.velocity.unit || 'pts / sprint'}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">speed</span>
                  </div>
                </div>
                <div className="mt-md pt-sm flex items-center justify-between">
                  <div className="flex items-center gap-xs text-primary font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-body-md">trending_up</span>
                    <span>{kpi.velocity.changeText}</span>
                  </div>
                  {/* Sparkline SVG */}
                  <svg className="w-20 h-6 text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 80 24">
                    <path d={kpi.velocity.sparkline || 'M2 18 L16 14 L30 17 L44 9 L58 12 L78 3'}></path>
                  </svg>
                </div>
              </div>

              {/* Metric 2: Completed Tasks */}
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-secondary">Tasks Completed</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        {kpi.completedTasks.completed}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        / {kpi.completedTasks.planned} planned
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                </div>
                <div className="mt-md flex flex-col gap-xs">
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${kpi.completedTasks.percentage}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-xs">
                    <span>{kpi.completedTasks.percentage}% target met</span>
                    <span className="text-primary font-semibold">{kpi.completedTasks.changeText}</span>
                  </div>
                </div>
              </div>

              {/* Metric 3: Cycle Time */}
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-secondary">Avg Cycle Time</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        {kpi.cycleTime.value}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">days</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined">timelapse</span>
                  </div>
                </div>
                <div className="mt-md pt-sm flex items-center justify-between">
                  <div className="flex items-center gap-xs text-on-surface font-label-sm text-label-sm font-medium">
                    <span className="material-symbols-outlined text-body-md text-primary">arrow_downward</span>
                    <span>{kpi.cycleTime.changeText}</span>
                  </div>
                  <span className="px-sm py-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                    {kpi.cycleTime.badge || 'Faster'}
                  </span>
                </div>
              </div>

              {/* Metric 4: Active Conflicts & Blockers */}
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-secondary">Active Blockers</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        {unresolvedCount}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">unresolved</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                </div>
                <div className="mt-md pt-sm flex items-center justify-between">
                  <div className="flex items-center gap-xs font-label-sm text-label-sm text-tertiary font-semibold">
                    {unresolvedCount > 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
                        <span>Requires review</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-primary text-body-md">check_circle</span>
                        <span className="text-primary">All clear</span>
                      </>
                    )}
                  </div>
                  <span className={`px-sm py-xs rounded-full font-label-sm text-label-sm ${
                    unresolvedCount > 0 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed'
                  }`}>
                    {unresolvedCount > 0 ? 'P0 / High' : 'Resolved'}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Analytics Row: Charts (2/3 + 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-lg">
              {/* Sprint Throughput Chart (2 cols) */}
              <div className="lg:col-span-2 bg-surface-container-lowest p-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm pb-md">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                      Sprint Throughput &amp; Velocity Trend
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Weekly completed story points vs. initial sprint forecast
                    </p>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-md">
                    <div className="flex items-center gap-xs">
                      <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
                      <span className="font-label-md text-label-md text-secondary">Completed</span>
                    </div>
                    <div className="flex items-center gap-xs">
                      <span className="w-3 h-3 rounded-sm bg-surface-container-high"></span>
                      <span className="font-label-md text-label-md text-secondary">Planned</span>
                    </div>
                  </div>
                </div>

                {/* Inline Bar Chart Visualization */}
                <div className="w-full mt-md">
                  <div className="h-64 w-full flex items-end justify-between gap-md sm:gap-lg pt-sm px-xs pb-sm">
                    {sprints.map((sprint) => {
                      const isCurrent = sprint.current;
                      return (
                        <div key={sprint.id || sprint.name} className="flex-1 flex flex-col items-center gap-xs h-full justify-end group">
                          <div className={`font-label-sm text-label-sm ${isCurrent ? 'text-primary font-bold' : 'text-on-surface opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                            {sprint.pts || `${sprint.completedHeight}pt`}
                          </div>
                          <div className="w-full flex items-end justify-center gap-1 h-48">
                            <div
                              className="w-1/2 bg-surface-container-high rounded-t group-hover:bg-surface-dim transition-colors"
                              style={{ height: `${sprint.plannedHeight}%` }}
                            ></div>
                            <div
                              className={`w-1/2 rounded-t transition-colors ${
                                isCurrent
                                  ? 'bg-primary shadow-sm'
                                  : 'bg-primary-container group-hover:bg-primary'
                              }`}
                              style={{ height: `${sprint.completedHeight}%` }}
                            ></div>
                          </div>
                          <span className={`font-label-md text-label-md mt-xs ${isCurrent ? 'text-primary font-bold' : 'text-secondary'}`}>
                            {sprint.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-md text-on-surface-variant font-body-md text-body-md bg-surface-container-low p-sm rounded-lg mt-md">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-body-lg text-primary">insights</span>
                    <span>{forecast.message || 'Sprint is tracking ahead of the historical quarterly average.'}</span>
                  </div>
                  <button
                    onClick={() => setForecastModalOpen(true)}
                    className="font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Inspect Forecast
                  </button>
                </div>
              </div>

              {/* Task Status & Priority Breakdown (1 col) */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-sm">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Status &amp; Priority</h2>
                    <span className="font-label-sm text-label-sm text-secondary bg-surface-container-high px-sm py-xs rounded-full">
                      {statusBreakdown.total || kpi.completedTasks.planned || 19} Total
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md">Active backlog distribution</p>

                  {/* Donut Visual */}
                  <div className="flex items-center justify-center my-md">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeWidth="12"></circle>
                        {/* Done */}
                        <circle className="text-primary" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeDasharray="60 180" strokeDashoffset="0" strokeWidth="12"></circle>
                        {/* In Progress */}
                        <circle className="text-primary-container" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeDasharray="86 154" strokeDashoffset="-60" strokeWidth="12"></circle>
                        {/* In Review */}
                        <circle className="text-secondary" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeDasharray="36 204" strokeDashoffset="-146" strokeWidth="12"></circle>
                        {/* To Do */}
                        <circle className="text-outline-variant" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeDasharray="58 182" strokeDashoffset="-182" strokeWidth="12"></circle>
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                          {statusBreakdown.centerPercentage || '36%'}
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                          {statusBreakdown.centerLabel || 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Legend breakdown */}
                  <div className="grid grid-cols-2 gap-sm pt-xs">
                    {statusBreakdown.segments?.map((seg, idx) => (
                      <div key={idx} className="flex items-center gap-xs p-xs rounded bg-surface-container-low">
                        <span className={`w-2.5 h-2.5 rounded-full ${seg.colorClass || 'bg-primary'}`}></span>
                        <span className="font-label-md text-label-md text-on-surface">{seg.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Breakdown Chips */}
                <div className="mt-md pt-sm">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-xs">
                    Priority Dispersion
                  </span>
                  <div className="flex items-center gap-xs">
                    {statusBreakdown.priorityDispersion?.map((item, idx) => (
                      <span
                        key={idx}
                        className={`flex-1 py-xs px-sm rounded ${item.bg || 'bg-surface-container-high'} font-label-sm text-label-sm text-center font-semibold`}
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Section: Team Workload & Recent Bottlenecks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              {/* Team Member Workload Table (2 cols) */}
              <div className="lg:col-span-2 bg-surface-container-lowest p-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-sm">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                        Team Workload &amp; Activity
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Capacity utilization and task throughput by assigned member
                      </p>
                    </div>
                    <button
                      onClick={() => showToast('Redirecting to Team Management...')}
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-xs"
                    >
                      <span>Manage Team</span>
                      <span className="material-symbols-outlined text-body-md">arrow_forward</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto mt-md">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-secondary font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low rounded-lg">
                          <th className="py-sm px-md rounded-l-lg">Team Member</th>
                          <th className="py-sm px-md">Assigned Tasks</th>
                          <th className="py-sm px-md">Completion Rate</th>
                          <th className="py-sm px-md rounded-r-lg">Last Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-0">
                        {teamWorkload && teamWorkload.length > 0 ? (
                          teamWorkload.map((member) => (
                            <tr key={member.id || member.name} className="hover:bg-surface-container-low/60 transition-colors">
                              <td className="py-md px-md">
                                <div className="flex items-center gap-sm">
                                  {member.avatar ? (
                                    <img
                                      className="w-9 h-9 rounded-full object-cover shadow-sm"
                                      alt={member.name}
                                      src={member.avatar}
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold flex items-center justify-center font-label-md text-label-md">
                                      {member.initials || member.name?.slice(0, 2).toUpperCase() || 'U'}
                                    </div>
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-body-md text-body-md font-semibold text-on-surface">{member.name}</span>
                                    <span className="font-label-sm text-label-sm text-secondary">{member.role || 'Contributor'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-md px-md font-body-md text-body-md text-on-surface font-semibold">{member.assignedCards}</td>
                              <td className="py-md px-md">
                                <div className="flex items-center gap-sm w-36">
                                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                                    <div className={`${member.color || member.colorClass || 'bg-primary'} h-full rounded-full`} style={{ width: `${member.completionRate}%` }}></div>
                                  </div>
                                  <span className={`font-label-sm text-label-sm font-semibold ${member.completionRate < 70 ? 'text-tertiary' : 'text-on-surface'}`}>
                                    {member.completionRate}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-md px-md font-label-sm text-label-sm text-secondary">{member.lastActive}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-lg text-center text-on-surface-variant font-body-md">
                              No team members found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bottlenecks & Overdue Tasks (1 col) */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-sm">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-tertiary">notification_important</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                        Bottlenecks &amp; Flags
                      </h2>
                    </div>
                    <span className="px-sm py-xs rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                      {unresolvedCount} {unresolvedCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                    Cards stalled or blocked for &gt; 48 hours
                  </p>

                  {/* Bottleneck Items List */}
                  <div className="flex flex-col gap-sm">
                    {bottlenecks && bottlenecks.length > 0 ? (
                      bottlenecks.map((item) => {
                        const isSelected = selectedBottlenecks.includes(item.id);
                        const isResolved = item.resolved;
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleSelectBottleneck(item.id)}
                            className={`flex flex-col gap-xs p-md rounded-xl bg-surface-container-low mb-sm group hover:bg-surface-container transition-colors cursor-pointer border ${
                              isSelected ? 'border-primary' : 'border-transparent'
                            } ${isResolved ? 'opacity-40 line-through' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`px-xs py-0.5 rounded ${item.tagClass || 'bg-error text-on-error'} font-label-sm text-label-sm uppercase`}>
                                {item.type || 'Bug'}
                              </span>
                              <span className={`font-label-sm text-label-sm ${item.statusColor || 'text-error'} font-semibold flex items-center gap-xs`}>
                                <span className="material-symbols-outlined text-body-md">{item.statusIcon || 'schedule'}</span>
                                {item.statusTag || 'Stalled'}
                              </span>
                            </div>
                            <span className="font-body-md text-body-md font-semibold text-on-surface mt-xs group-hover:text-primary transition-colors">
                              {item.title}
                            </span>
                            <div className="flex items-center justify-between mt-xs text-on-surface-variant font-label-sm text-label-sm">
                              <span>{item.blockedBy ? `Blocked by: ${item.blockedBy}` : item.assigned ? `Assigned: ${item.assigned}` : 'In Progress'}</span>
                              <span className={`${item.reasonColor || 'text-tertiary'} font-semibold`}>{item.reason || 'Pending review'}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-md text-center text-on-surface-variant font-body-md bg-surface-container-low rounded-xl">
                        No active bottlenecks detected.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleResolveBottlenecks}
                  disabled={resolving}
                  className="w-full mt-md py-sm bg-surface-container-high hover:bg-surface-dim text-on-surface font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-xs cursor-pointer active:scale-[0.99]"
                >
                  <span className={`material-symbols-outlined text-body-md ${resolving ? 'animate-spin' : ''}`}>
                    {resolving ? 'sync' : 'flag'}
                  </span>
                  <span>
                    {resolving
                      ? 'Resolving...'
                      : selectedBottlenecks.length > 0
                      ? `Resolve ${selectedBottlenecks.length} Selected`
                      : 'Resolve Selected Cards'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Forecast Inspection Dialog */}
      {forecastModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-2xl max-w-lg w-full flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-headline-sm">insights</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Sprint 27 Forecast Analysis</h3>
              </div>
              <button onClick={() => setForecastModalOpen(false)} className="p-xs text-on-surface-variant hover:text-on-surface rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-md text-on-surface-variant">
              Sprint 27 is tracking <strong>+8% ahead</strong> of the historical quarterly average of 40 story points.
            </p>
            <div className="grid grid-cols-2 gap-sm p-md bg-surface-container-low rounded-xl">
              <div>
                <span className="font-label-sm text-secondary block">Confidence Score</span>
                <span className="font-headline-sm text-primary font-bold">94%</span>
              </div>
              <div>
                <span className="font-label-sm text-secondary block">Projected Delivery</span>
                <span className="font-headline-sm text-on-surface font-bold">On Schedule</span>
              </div>
            </div>
            <div className="flex justify-end pt-xs">
              <button
                onClick={() => setForecastModalOpen(false)}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded-xl shadow-lg z-50 flex items-center gap-sm animate-fade-in">
          <span className="material-symbols-outlined text-primary-fixed text-body-lg">info</span>
          <span className="font-body-md">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
