# PeopleCore — Employee Information System (Scaffold)

This repository branch contains an initial scaffold for a cross-platform desktop application built with Electron + React (Vite) and SQLite (better-sqlite3).

Run (development):
1. npm install
2. npm run dev

This launches Vite dev server (renderer) and opens Electron.

Notes / TODOs:
- Photo upload currently only records the selected filename on the renderer side. For production you should copy the file to data/photos from the main process (or via a dedicated IPC) and save the stored path in the DB.
- better-sqlite3 is a native dependency and may require build tools on your platform.
- Add more validation, search, paging, export/backup features, and packaging configuration as needed.

Next steps I'll take if you want me to continue:
- Implement file copy for photo upload in the main process and store photos under data/photos.
- Add seed data and sample screenshot.
- Improve forms to include all fields (currently scaffolded minimal fields) and validation.
- Add authentication or role-based access (optional).

