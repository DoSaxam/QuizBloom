# Rovio Quiz — Mobile Web App

A fast, offline-friendly, mobile-first quiz app powered by Open Trivia DB with a fallback to The Trivia API. Built as a single HTML file for easy hosting.

## Run
- Open `Index.html` in any modern browser.
- Works offline after first load (last successful batch cached).

## Features
- Categories, Difficulty, Advanced Setup, Quiz, Results, Leaderboard, Profile, Settings
- Lifelines: 50-50, Hint, Skip
- Scoring: difficulty + streak + time bonus
- Gamification: XP & Levels
- Sound, Haptics, Theme, Language (EN/HI), Text size
- Keyboard shortcuts (1-4 options, Enter next, H/F/S lifelines)

## APIs
- Primary: Open Trivia DB
- Fallback: The Trivia API

## Dev Notes
- Switch primary API via `ACTIVE_API` constant in `Index.html`.
- Local storage keys prefixed with `rq_`.