const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  listEmployees: () => ipcRenderer.invoke('employees:list'),
  getEmployee: (id) => ipcRenderer.invoke('employees:get', id),
  addEmployee: (payload) => ipcRenderer.invoke('employees:add', payload),
  updateEmployee: (id, payload) => ipcRenderer.invoke('employees:update', id, payload),
  deleteEmployee: (id) => ipcRenderer.invoke('employees:delete', id),
  uploadPhoto: (sourcePath) => ipcRenderer.invoke('employees:uploadPhoto', sourcePath)
})
