const electron = require('electron')
const {remote, ipcRenderer} = electron
const {Menu, MenuItem} = remote
const BrowserWindow = electron.remote.BrowserWindow
const menu = new Menu()
const path = require('path')

// const menu = new Menu()
// let selectedText;
let slackWindow;
window.onload = ()=>{
    if(document.querySelector('a.jsx-557233006.nav-link-mobile') != null) {
        document.querySelector('a.jsx-557233006.nav-link-mobile').click()
    }
    if(document.querySelector('a.jsx-718046460.social-login-item')!=null){
        document.querySelector('a.jsx-718046460.social-login-item').click();
    }
    menu.append(new MenuItem({
        label: 'search in stackoverflow',
        click() {
            selectedText = document.getSelection().toString();
            // selectedText="error in creating window electron"
            url = "https://stackoverflow.com/search?q="+selectedText
            ipcRenderer.send("stackoverflow",url)
            // popUpStackOverflow(selectedText)
        }
    }));
    menu.append(new MenuItem({
            label: 'Send Snippet in slack',
            click() {  
                selectedText = document.getSelection().toString();
                popUpSlack(selectedText);         
    }
    }))

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        menu.popup()
        // ipcRenderer.send('show-context-menu',gitlabmenu)
    })
}
function popUpStackOverflow(selectedText){
    stackOverflowWin= new BrowserWindow({
      width:500,
      height:500,
    })
    url = "https://stackoverflow.com/search?q="+selectedText
    stackOverflowWin.loadURL(url)
    stackOverflowWin.show()
    stackOverflowWin.on("close",function(){
      stackOverflowWin = null
    })
  }

  function popUpSlack(selectedText){
                ipcRenderer.send('sendtoslack',selectedText); 
                slackWindow = new BrowserWindow({
                    width: 800,
                    height: 800,  
                    webPreferences: {
                        preload: path.join(__dirname,'..','slack','slackSnippetPreload.js')        }  
                });
                slackWindow.loadURL("https://slack.com/signin")   
                slackWindow.show();  
                slackWindow.on("close",function(){
                    stackOverflowWin = null
                  })
         }