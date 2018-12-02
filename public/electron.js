const {app, BrowserWindow} = require('electron');

const APP_URL = 'https://todo-jcpmmx-reactcli.herokuapp.com';
let mainWindow;


function createWindow () {

  const path = require('path');
  const url = require('url');
  const startUrl = process.env.DEV ? url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  }) : APP_URL;

  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null
  });
  // mainWindow.webContents.openDevTools();

}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
