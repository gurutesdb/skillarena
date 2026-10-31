import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadState, saveState, createSeedState } from '../engine/storage';
import {
  getTotalXp, getLevel, getStreak, getWeeklyXp, getWeeklyActivity, getSkillProgress,
  getRank, getHistory, buildLeaderboard, evaluateMission, completeMission,
} from '../engine/gamification';
import { DEMO_STUDENT } from '../data/students';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e) => e.key === 'skillarena:v1' && setState(loadState());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const notify = useCallback((message, tone = 'info') => {
    const id = Date.now() + Math.random();
    setToast({ message, tone, id });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3000);
  }, []);

  const login = useCallback(() => setState((s) => ({ ...s, loggedIn: true })), []);
  const logout = useCallback(() => setState((s) => ({ ...s, loggedIn: false })), []);
  const resetDemo = useCallback(() => {
    setState({ ...createSeedState(), loggedIn: true });
    notify('Demo progress reset to the starting state', 'info');
  }, [notify]);

  // Evaluate + (maybe) award XP. Returns { evaluation, reward } synchronously.
  const submitMission = useCallback(
    (mission, answers) => {
      const evaluation = evaluateMission(mission, answers);
      const { state: next, reward } = completeMission(state, mission, evaluation);
      setState(next);
      return { evaluation, reward };
    },
    [state],
  );

  const derived = useMemo(() => {
    const xp = getTotalXp(state);
    return {
      student: DEMO_STUDENT,
      xp,
      level: getLevel(xp),
      streak: getStreak(state),
      weeklyXp: getWeeklyXp(state),
      weeklyActivity: getWeeklyActivity(state),
      skills: getSkillProgress(state),
      rank: getRank(state, 'all'),
      weeklyRank: getRank(state, 'weekly'),
      history: getHistory(state),
      completedCount: Object.keys(state.completed).length,
      leaderboard: (mode) => buildLeaderboard(state, mode),
    };
  }, [state]);

  const value = { state, ...derived, login, logout, resetDemo, submitMission, toast, notify };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
