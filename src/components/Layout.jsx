import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Swords, Trophy, IdCard, Presentation, Flame, Zap, LogOut, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Avatar, Logo, ProgressBar, Toast } from './ui';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/arena', label: 'Mission Arena', short: 'Arena', icon: Swords },
  { to: '/leaderboard', label: 'Leaderboard', short: 'Ranks', icon: Trophy },
  { to: '/passport', label: 'Skill Passport', short: 'Passport', icon: IdCard },
];

function ResetButton({ className = '' }) {
  const { resetDemo } = useGame();
  const [confirm, setConfirm] = useState(false);
  if (confirm) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button className="btn bg-bad-500/15 px-3 py-1.5 text-xs text-bad-400 hover:bg-bad-500/25" onClick={() => { resetDemo(); setConfirm(false); }}>
          Confirm reset
        </button>
        <button className="btn px-2 py-1.5 text-xs text-ink-400 hover:text-ink-200" onClick={() => setConfirm(false)}>Cancel</button>
      </div>
    );
  }
  return (
    <button className={`btn px-3 py-1.5 text-xs text-ink-400 hover:bg-white/5 hover:text-ink-100 ${className}`} onClick={() => setConfirm(true)} title="Restore the demo starting state">
      <RotateCcw className="h-3.5 w-3.5" /> Reset demo
    </button>
  );
}

export default function Layout() {
  const { student, xp, level, streak, logout } = useGame();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[0.06] bg-ink-950/95 px-4 py-5 lg:flex">
        <div className="px-2"><Logo /></div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: I }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500/10 text-white shadow-[inset_0_0_0_1px_rgba(124,108,255,0.25)]' : 'text-ink-400 hover:bg-white/[0.04] hover:text-ink-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <I className={`h-[18px] w-[18px] ${isActive ? 'text-brand-300' : ''}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
          <div className="my-3 h-px bg-white/[0.06]" />
          <NavLink to="/business" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-400 transition hover:bg-white/[0.04] hover:text-ink-100">
            <Presentation className="h-[18px] w-[18px]" /> Business Overview
          </NavLink>
        </nav>

        <div className="mt-auto space-y-3">
          <div className="card p-3.5">
            <div className="flex items-center gap-3">
              <Avatar name={student.name} color={student.color} size={38} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{student.name}</div>
                <div className="text-xs" style={{ color: level.color }}>{level.name}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-ink-400">
              <span>{xp.toLocaleString('en-IN')} XP</span>
              <span>{level.next ? `${level.xpToNext} to ${level.next.name}` : 'Max level'}</span>
            </div>
            <ProgressBar value={level.progress} color={level.color} height={6} className="mt-1.5" />
          </div>
          <div className="flex items-center justify-between">
            <ResetButton />
            <button className="btn px-3 py-1.5 text-xs text-ink-400 hover:bg-white/5 hover:text-ink-100" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden"><Logo compact /></div>
            <div className="hidden text-sm text-ink-400 lg:block">
              Welcome back, <span className="font-medium text-ink-100">{student.name.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="chip border-streak-500/25 bg-streak-500/10 text-streak-400" title="Daily streak">
                <Flame className="h-3.5 w-3.5 fill-streak-500" /> {streak} day{streak === 1 ? '' : 's'}
              </div>
              <div className="chip border-xp-500/25 bg-xp-500/10 text-xp-400" title="Total XP">
                <Zap className="h-3.5 w-3.5 fill-xp-500" /> {xp.toLocaleString('en-IN')} XP
              </div>
              <div className="lg:hidden"><ResetButton className="!px-2" /></div>
              <button className="lg:hidden" onClick={() => navigate('/passport')} aria-label="Open Skill Passport">
                <Avatar name={student.name} color={student.color} size={32} />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Bottom tabs (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/[0.06] bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {NAV.map(({ to, label, short, icon: I }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? 'text-brand-300' : 'text-ink-500'}`}>
            <I className="h-5 w-5" />
            {short || label}
          </NavLink>
        ))}
      </nav>

      <Toast />
    </div>
  );
}
