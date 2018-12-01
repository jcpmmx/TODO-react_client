const {app, BrowserWindow} = require('electron');

// const APP_URL = 'https://todo-jcpmmx-reactcli.herokuapp.com';
const APP_URL = 'http://localhost:3000';
let mainWindow;


function createWindow () {

  const path = require('path');
  const url = require('url');
  const startUrl = process.env.DEV_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null
  });

}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
