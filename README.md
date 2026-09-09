# PeopleCore — Employee Information System (Scaffold)

This branch adds photo handling and completes the employee form fields.

Run (development):
1. git checkout fix/photo-paths-and-form
2. npm install
3. npm run dev

Photo handling details
- Uploaded photos are copied into data/photos and a 256×256 thumbnail is created under data/photos/thumbs.
- The IPC upload API returns absolute file:// URLs (e.g., file:///full/path/to/data/photos/thumb.png) so the renderer can load them reliably across platforms.
- The DB stores the file URLs in the photo_path and photo_thumbnail_path columns.
- Max upload size: 5 MB. Allowed formats: JPG, JPEG, PNG.

Seed/demo
- A demo screenshot and a sample seed JSON are provided under data/demo/ and data/seed/ respectively. You can inspect or copy the sample JSON into the database for local testing.

Notes / TODOs
- better-sqlite3 and jimp are native dependencies and may require platform build tools.
- If you open the renderer outside of Electron (pure browser), file.path will not be available — the photo upload flow expects Electron's renderer to provide local file paths from a file input.

Next steps
- Add tests and CI
- Improve UI/UX and validation rules per country-specific ID formats
- Add CSV export/import and search/filtering
