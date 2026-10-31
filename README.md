# SkillArena: Play. Prove. Get Hired.

Hackathon prototype (IIT Gandhinagar). A frontend-only React + Vite app with no backend: everything runs in the browser and progress is stored in LocalStorage.

```bash
npm install
npm run dev      # http://localhost:5173
```

## 3-minute demo script
1. **Landing** → *Enter the Arena (Demo)*.
2. **Dashboard**: Aarav has 375 XP (Beginner), a 6-day streak and rank #10.
3. **Mission Arena** → filter *React JS* → *Fix a Component Rendering Issue* → *Start Mission*.
4. Answers: Q1 → B · Q2 → `setItems(prev => [...prev, { id: crypto.randomUUID(), text }]);` · Q3 → C.
5. **Submit** → reward: +220 XP (perfect bonus), level-up to Explorer, *5 Missions* and *7-Day Streak* badges, rank #10 → #9.
6. **Leaderboard** and **Skill Passport** update instantly → *Share Skill Passport*.
7. Replay the mission: practice mode awards no extra XP.
8. **Business Overview**: revenue model and illustrative calculator.
9. **Reset demo** (sidebar) restores the starting state.

All student data is simulated. The pricing is illustrative. The Skill Passport is not an accredited certification.
See `CLAUDE.md` for architecture and rules.
