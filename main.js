const { app, BrowserWindow, Menu, MenuItem, Tray , ipcMain} = require('electron');
const { globalShortcut } = require('electron')

const path = require('path');
const menu = new Menu()
const Store = require('./store.js');
let gmailBackgroundWiletndow;
var platform = process.platform;
console.log(platform)
let img;
if(platform === "darwin")
{
    img = 'Group123xMac.icns'
}
if(platform === "win32"||platform === "win64")
{
    img = 'Group123Win.ico'
}if(platform === "linux")
{
    img = 'Group123x.png'
}

const store = new Store({

  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 550, height: 1100 }
  }
});

let stackoverflowtext
let win
let loginChild,selectedText
let tray = null
const iconPath = path.join(__dirname,'assests','images',img)

function createTray(){
  tray = new Tray(iconPath)
  tray.setHighlightMode('always')

  let template = [
    {
      label: 'Open Gmail',
      click: function(){
        let windowGmail = new BrowserWindow(
          {
              alwaysOnTop: true,
              width: 800, height: 500,
              webPreferences:{
                preload: path.join(__dirname,'preloads','gmail','gmailCompose.js')
              } 
          }
      )
      windowGmail.loadURL('https://mail.google.com/mail/u/0/')
      windowGmail.show();

      windowGmail.on('close', function () { windowGmail = null })
        }
      },
   
    {
      label: 'Compose Mail',
      click: function(){
        let windowCompose = new BrowserWindow(
          {
              alwaysOnTop: true,
              width: 500, height: 600,
            }
      )
      windowCompose.loadURL('https://mail.google.com/mail/u/0/?view=cm&fs=1&tsu&body&bcc&tf=1')
      windowCompose.show();
      windowCompose.on('close', function () { windowCompose = null })

      }
    },
    {
      label: 'Open Chat',
      click: function(){
        let windowChat = new BrowserWindow(
          {
              //alwaysOnTop: true,
              width: 500, height: 500,
              webPreferences:{
                preload: path.join(__dirname,'preloads','googleChat','googleChat.js')
              } 
          }
      )
      windowChat.loadURL('https://chat.google.com/u/0/')
      windowChat.show();

      windowChat.on('close', function () { windowChat = null })

      }
    }, 
    
    {
      label: 'Open GitLab',
      click: function(){
        let gitlabChat = new BrowserWindow(
          {
              //alwaysOnTop: true,
              width:  600,
              height: 600,
              webPreferences:{
                preload: path.join(__dirname,'preloads','gitlab','allProjectsPreload.js')
              } 
          }
      )
      gitlabChat.loadURL('https://git.hashedin.com')
      gitlabChat.show();

      gitlabChat.on('close', function () { gitlabChat = null })

      }
    },
    {
      label: 'Open slack',
      click: function(){
        let slackWindow = new BrowserWindow(
          {
              //alwaysOnTop: true,
              width:  600,
              height: 600,
              webPreferences:{
                preload: path.join(__dirname,'preloads','slack','slackpreload.js')
              } 
          }
      )
      slackWindow.loadURL('https://slack.com/signin')
      slackWindow.show();

      slackWindow.on('close', function () { slackWindow = null })

      }
    },

    {
      label: 'Exit App',
      click:function(){
        app.exit();
      }
    }
  ]

  const contextMenu = Menu.buildFromTemplate(template)
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Tray App')
}
function createWindow() {
  let { width, height } = store.get('windowBounds');
  createTray();
  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    width,
    height,
    minHeight:550,
    minWidth:1100,
    webPreferences: {
      webviewTag: true,
      nativeWindowOpen: true,
    },
     icon: path.join(__dirname,'assests','images',img)
  })
  win.on('resize', () => {
    let { width, height } = win.getBounds();
    store.set('windowBounds', { width, height });
  });

  loginChild = new BrowserWindow(
    {
      parent: win, width: 575, height: 530, frame: false, resizable: false, webPreferences: {
        webviewTag: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preloads', 'login.js'),
      }
    })
  loginChild.loadURL('https://accounts.google.com/signin')

  loginChild.on('page-title-updated', () => {
    if (loginChild.webContents.getURL().includes('https://myaccount.google.com')) {
      loginChild.hide();
      win.loadFile('dashboard1.html');
      win.show();
    }
  })

  gmailBackgroundWindow = new BrowserWindow({
    show:false,
    webPreferences:{
      preload:path.join(__dirname,'assests','js','gmailBackground.js')
    }
   })
  gmailBackgroundWindow.loadURL('https://mail.google.com/')
  

  win.on('hide', () => {
    loginChild.loadURL('https://accounts.google.com/signin');
    loginChild.show();
  })

  ipcMain.on('stackoverflow',(e,args)=>{
    stackoverflowtext = args
    win.webContents.send('stackoverflow-open',args)
  })
  win.on('closed', () => {
    win = null;
    loginChild = null;
    app.exit();
  })
  loginChild.on('closed', () => {
    win = null;
    loginChild = null;
    app.exit();
  })

  globalShortcut.register('Alt+I', function () {
      win.webContents.send('sendingShortcutDetail','gmail')
    })
    globalShortcut.register('Alt+C', function () {
      win.webContents.send('sendingShortcutDetail','chat')
    })
    globalShortcut.register('Alt+S', function () {
      win.webContents.send('sendingShortcutDetail','slack')
    })
    globalShortcut.register('Alt+G', function () {
      win.webContents.send('sendingShortcutDetail','gitlab')
    })
    globalShortcut.register('Alt+R', function () {
      win.webContents.send('sendingShortcutDetail','repl')
    })
    globalShortcut.register('Alt+M', function () {
      composeWindow = new BrowserWindow({
        alwaysOnTop: true,
        width: 500, height: 600, frame: true, webPreferences: {
            nodeIntegration: false
        }
    })
      composeWindow.loadURL('https://mail.google.com/mail/?view=cm&fs=1')

    })
}

app.on('ready', createWindow)

let mainUrl;
let mergeRequestTextForSlack;
ipcMain.on('urlSend',function(event,arg){
  mainUrl=arg;

})
ipcMain.on('urlRecieve',function(event){
  event.returnValue=mainUrl;
})
let sshValue;
ipcMain.on('sshSend',function(event,arg){
  sshValue=arg;
})
ipcMain.on('sshValue',function(event){
  event.returnValue=sshValue;
})
// creating context menus
menu.append(new MenuItem({
  label:'open in new window',
  click(){
  }
}))

menu.append(new MenuItem({role:'copy'}))
menu.append(new MenuItem({role:'paste'}))

app.on('browser-window-created',(event,win)=>{
  win.webContents.on('context-menu',(e,params)=>{
    menu.popup(win,params.x,params.y)
  })
})

ipcMain.on('show-context-menu',(event, newMenu)=>{
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})
   
ipcMain.on('sendUrlToSlack',function(event,arg){
  mergeRequestTextForSlack = arg;
})
ipcMain.on('textFromMergeRequestToSlack',function(event){
  event.returnValue = mergeRequestTextForSlack;
})

let previousInbox;
let count=1;
ipcMain.on('countReceive',function(event){
  event.returnValue = count;
})
ipcMain.on('inboxUnreadSend',function(event){
  event.returnValue = previousInbox;
})
ipcMain.on('inboxUnreadReceive',function(event,arg){
  previousInbox = arg;
})
let openGmail;
ipcMain.on('OpenGmail',function(event,arg){
  openGmail=arg;
})
ipcMain.on('GmailWindow',function(event){
  event.returnValue = openGmail;
})

let slackText;
ipcMain.on('sendtoslack',function(event ,arg){
  slackText = arg
})
ipcMain.on('channeltoslacksnippet',function(event){
  event.returnValue = slackText;
})

