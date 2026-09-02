---
name: "Scaffold: Electron + React + SQLite"
about: "Initial scaffold for PeopleCore desktop app"
labels: "scaffold, electron, react, sqlite"
assignees: "chambata"
---

This PR adds an initial scaffold for the PeopleCore desktop application. It includes an Electron main process, a Vite + React renderer (TypeScript), a SQLite database wrapper (better-sqlite3), and a minimal UI for employee CRUD.

Run instructions (development)

1. git checkout scaffold/electron-react-sqlite
2. npm install
3. npm run dev

Notes
- better-sqlite3 is a native dependency and may require build tools on your platform (build-essential on Linux, Xcode Command Line Tools on macOS, Visual Studio Build Tools on Windows).
- The renderer currently records the selected photo filename but does not yet copy the photo into data/photos. I'll implement file-copying for photos in a follow-up.

Next tasks (recommended)

- Implement photo file-copying in the main process and store photos under data/photos (done in upcoming PR)
- Complete form fields and validation for all employee details (NRC, social security, qualifications, dates, etc.)
- Add search, filtering, paging, and CSV import/export
- Add packaging configuration for target OSes and CI for build artifacts
- Add authentication / RBAC if needed
- Add seed data and screenshots for the README

