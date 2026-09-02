# PeopleCore — Employee Information System (Scaffold)

This branch adds photo handling and completes the employee form fields.

Run (development):
1. git checkout feature/photos-and-forms
2. npm install
3. npm run dev

Photo handling details
- Uploaded photos are copied into data/photos and a 256×256 thumbnail is created under data/photos/thumbs.
- The DB stores relative paths in the photo_path and photo_thumbnail_path columns.
- Max upload size: 5 MB. Allowed formats: JPG, JPEG, PNG.

Notes / TODOs
- better-sqlite3 and jimp are native dependencies and may require platform build tools.
- If you open the renderer outside of Electron (pure browser), file.path will not be available — the photo upload flow expects Electron's renderer to provide local file paths from a file input.

Next steps
- Add tests and CI
- Improve UI/UX and validation rules per country-specific ID formats
- Add CSV export/import and search/filtering

