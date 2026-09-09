/*
  Main Electron process (JavaScript)
  - Loads dev URL when ELECTRON_START_URL is set by dev flow
  - Loads built index.html in production
  - Adds IPC handler for uploading photos (copies file into data/photos and generates thumbnail)
*/

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { pathToFileURL } = require('url')
const Jimp = require('jimp')

const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.ELECTRON_START_URL) {
    win.loadURL(process.env.ELECTRON_START_URL)
  } else if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

// simple DB layer
const db = require('./db/db')

const dataDir = path.join(__dirname, '..', 'data')
const photosDir = path.join(dataDir, 'photos')
const thumbsDir = path.join(photosDir, 'thumbs')
if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir, { recursive: true })
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true })

app.whenReady().then(() => {
  db.init()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers to talk to renderer
ipcMain.handle('employees:list', async () => {
  return db.getAllEmployees()
})

ipcMain.handle('employees:get', async (event, id) => {
  return db.getEmployee(id)
})

ipcMain.handle('employees:add', async (event, payload) => {
  return db.addEmployee(payload)
})

ipcMain.handle('employees:update', async (event, id, payload) => {
  return db.updateEmployee(id, payload)
})

ipcMain.handle('employees:delete', async (event, id) => {
  return db.deleteEmployee(id)
})

// Photo upload handler: copies a file from sourcePath into data/photos and writes a thumbnail.
// Expects sourcePath to be a path on the local filesystem (from file input in Electron renderer).
ipcMain.handle('employees:uploadPhoto', async (event, sourcePath) => {
  try {
    if (!sourcePath) throw new Error('No source path provided')
    // validate file exists
    if (!fs.existsSync(sourcePath)) throw new Error('Source file does not exist')

    const stat = fs.statSync(sourcePath)
    const maxSize = 5 * 1024 * 1024 // 5 MB
    if (stat.size > maxSize) throw new Error('File too large (max 5 MB)')

    const ext = path.extname(sourcePath).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) throw new Error('Unsupported image format')

    // Optional safety: warn if uploading from outside the user's home directory
    if (!sourcePath.startsWith(os.homedir())) {
      console.warn('Uploading file from outside home directory:', sourcePath)
    }

    const timestamp = Date.now()
    const fileName = `employee_${timestamp}${ext}`
    const destPath = path.join(photosDir, fileName)

    // copy file
    fs.copyFileSync(sourcePath, destPath)

    // generate thumbnail 256x256
    const thumbName = `thumb_${timestamp}.png`
    const thumbPath = path.join(thumbsDir, thumbName)

    const image = await Jimp.read(destPath)
    image.cover(256, 256) // crop to cover
    await image.writeAsync(thumbPath)

    // return absolute file:// URLs so renderer can load them cross-platform
    const absPhotoUrl = pathToFileURL(destPath).href
    const absThumbUrl = pathToFileURL(thumbPath).href

    return { photoPath: absPhotoUrl, thumbnailPath: absThumbUrl }
  } catch (err) {
    return { error: err.message }
  }
})
