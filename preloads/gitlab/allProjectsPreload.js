const electron = require('electron');
const BrowserWindow= electron.remote.BrowserWindow;
const path = require("path");
const ipcMain = electron.ipcMain;
const ipcRenderer = electron.ipcRenderer;
const {remote} = electron
const {Menu, MenuItem} = remote
const gitlabmenu = new Menu()

let selectedText


window.onload = () => {
    if(document.querySelector('a#oauth-login-google_oauth2') !== null){
        document.querySelector('a#oauth-login-google_oauth2').click();
    }
    let projects = document.querySelectorAll('li.d-flex.no-description.project-row');
    mainUrl=document.URL;
    document.querySelector('ul.list-unstyled.navbar-sub-nav').style.display="none";
    document.querySelector('ul.nav.navbar-nav').style.display="none";
    if(document.querySelector('a.btn.btn-success'))
    {
        let newProjectBtn = document.querySelector('a.btn.btn-success');
        newProjectBtn.addEventListener("click",(e)=>{
            e.preventDefault();
            let href = newProjectBtn.href;
            let newProjectWindow = new BrowserWindow({ 
                webPreferences:{
                    preload:path.join(__dirname,'newMergeRequestPreload.js')
                }
            });
            newProjectWindow.loadURL(href);
        })
    }

    for(let project of projects)
    {
        project.addEventListener("click",(e)=>{
            e.preventDefault();
            let href =project.querySelector('a').href;
            let projectWindow = new BrowserWindow({
                width:800,
                resizable: false,
                webPreferences:{
                    preload:path.join(__dirname, 'projectPreload.js')
                }
            });
            projectWindow.loadURL(href);
            projectWindow.on("close",()=>{
                ProjectWindow=null;
            })
        })
    }
    
    // creating context menus
    gitlabmenu.append(new MenuItem({role:'copy'}))
    gitlabmenu.append(new MenuItem({role:'paste'}))

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        gitlabmenu.popup()
        // ipcRenderer.send('show-context-menu',gitlabmenu)
    })
 };

 function popUpCompose(selectedText) {
    regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
    var found;
    var indexArray=[];
    var bodyText,strindex;
    var emailsArray = selectedText.match(regex);
    if (emailsArray!=null){

        if(emailsArray!=null && emailsArray.length){
            while((found=regex.exec(selectedText)) !==null){
            indexArray.push(found.index)
            }
                strindex=indexArray[emailsArray.length-1]+emailsArray[emailsArray.length-1].length
                // emails are in front and body comes after
                if(strindex != selectedText.length){
                    bodyText = selectedText.slice(strindex)
                }
                // body comes front so put everything in bodytext
                else{
                    bodyText = selectedText
                }
                
            }
        }
    
        else 
        {
            // put the selected text in the body
            bodyText = selectedText;
            emailsArray="";
        }

    let gmailComposeWin = new BrowserWindow({
        width: 500,
        height: 600
    })
    let url = "https://mail.google.com/mail/?view=cm&to=" + emailsArray + "&fs=1&body=" + bodyText
    gmailComposeWin.loadURL(url)
    gmailComposeWin.show()
    gmailComposeWin.on('close', () => {
        gmailComposeWin = null
    })
}
