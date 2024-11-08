import { app, BrowserWindow } from 'electron'
import contextMenu from 'electron-context-menu';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

  console.log('process.env.NODE_ENV', process.env.NODE_ENV)

const DEV = process.env.NODE_ENV === 'development';
global.DEV = DEV;

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 620,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    }
  })
  mainWindow.setMinimumSize(1000, 620);
  mainWindow.maximize();
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)
  if(DEV){
    mainWindow.openDevTools()
  }

  mainWindow.on('closed', () => {
    app.quit()
    mainWindow = null
  })

  contextMenu({
    window: mainWindow,
    showSearchWithGoogle: false,
    showCopyImage: false,
    showLookUpSelection: false
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
