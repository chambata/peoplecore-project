/*
  Main Electron process (JavaScript for simplicity)
  - Loads dev URL when ELECTRON_START_URL is set by dev flow (we use wait-on)
  - Loads built index.html in production
*/

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

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
