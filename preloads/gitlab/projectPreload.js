const electron = require('electron');
const BrowserWindow= electron.remote.BrowserWindow;
const path = require("path");
const { ipcRenderer } = require('electron');

window.onload = () => {
    document.querySelector('ul.list-unstyled.navbar-sub-nav').style.display="none";
    document.querySelector('ul.nav.navbar-nav').style.display="none";
    
    if(document.querySelector('div.detail-page-description'))
    {
        let gmailShareButton = document.createElement('button');
        gmailShareButton.title="Share by Gmail"
        gmailShareButton.style.marginLeft="0.2em"
        gmailShareButton.style.background="url('http://i64.tinypic.com/1zyec7r.png')"
        gmailShareButton.style.width = "10%"
        gmailShareButton.style.height = "100%"
        gmailShareButton.style.border = "0"
        gmailShareButton.style.backgroundRepeat = "no-repeat"
        slackBtn = document.createElement('button')
        slackBtn.title="Share by Slack"
        slackBtn.style.background="url('http://i67.tinypic.com/10sd44k.png')"
        slackBtn.style.width = "10%"
        slackBtn.style.height = "100%"
        slackBtn.style.border = "0"
        slackBtn.style.backgroundRepeat = "no-repeat"
        div = document.createElement('div');
        div.className= 'shareOptions';
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.height="3em"
        document.querySelector('div.detail-page-description').appendChild(div);
        div.appendChild(gmailShareButton)
        div.appendChild(slackBtn)
        
        let mergeRequestTitle = document.querySelector('h2.title')
        gmailShareButton.addEventListener("click",()=>{
            let gmailWindow = new BrowserWindow({
                width: 500,
                height: 600,    
            });
            gmailWindow.loadURL('https://mail.google.com/mail/?view=cm&fs=1&su=Please review my merge request'+
            '&body='+ mergeRequestTitle.innerText +
            '%0APlease review my merge request%0A'+ document.URL);

        })
        slackBtn.addEventListener('click',()=>{
            let slackWindow = new BrowserWindow({
                width: 800,
                height: 800,  
                webPreferences: {
                    preload: path.join(__dirname,'..','slack','slackMergeRequestPreload.js')
                    // preload: '/home/sujit_surendranath/Desktop/Electron/All_In_One/preloads/slack/slackMergeRequestPreload.js'
                }  
            });
            slackWindow.loadURL("https://slack.com/signin")
        
        
            let mergeRequestString = 'Merge Request :'+ mergeRequestTitle.innerText + ' ' + document.URL
            ipcRenderer.send('sendUrlToSlack',mergeRequestString); 
         

        })
        
    }

    let ssh = document.querySelector('input#ssh_project_clone');
    if(document.querySelector('div.project-repo-buttons.col-md-12.col-lg-6.d-inline-flex.flex-wrap.justify-content-lg-end')){
        var gmailShareButton = document.createElement("button")
        gmailShareButton.title="Share by Gmail"
        gmailShareButton.style.marginLeft="0.2em"
        gmailShareButton.style.background="url('http://i64.tinypic.com/1zyec7r.png')"
        gmailShareButton.style.width = "5%"
        gmailShareButton.style.height = "85%"
        gmailShareButton.style.border = "0"
        gmailShareButton.style.backgroundRepeat = "no-repeat"
        document.querySelector('div.project-repo-buttons.col-md-12.col-lg-6.d-inline-flex.flex-wrap.justify-content-lg-end').appendChild(gmailShareButton);
        gmailShareButton.className="shareSSHButton d-inline-flex js-notification-dropdown notification-dropdown project-action-button dropdown inline";
        gmailShareButton.style.display="flex"
        document.querySelector('button.shareSSHButton').addEventListener("click",(e)=>{
            let gmailWindow = new BrowserWindow({ 
                width: 500, 
                height: 600,
                resizable:false
             });
            gmailWindow.loadURL('https://mail.google.com/mail/?view=cm&fs=1&su=SSH for the project '+
            document.querySelector('h1.project-title.qa-project-name').innerText+'&body='+
            document.querySelector('h1.project-title.qa-project-name').innerText+ ' ssh is below %0A'
            + ssh.value);
        })
        var chatShareButton = document.createElement("button")
        chatShareButton.title="Share by Chat"
        chatShareButton.style.background = "url('http://i65.tinypic.com/20gms2f.png')"
        chatShareButton.style.width = "5%"
        chatShareButton.style.height = "85%"
        chatShareButton.style.border = "0"
        chatShareButton.style.backgroundRepeat = "no-repeat"
        document.querySelector('div.project-repo-buttons.col-md-12.col-lg-6.d-inline-flex.flex-wrap.justify-content-lg-end').appendChild(chatShareButton);
        chatShareButton.className="chatShareSSHButton d-inline-flex js-notification-dropdown notification-dropdown project-action-button dropdown inline";
        chatShareButton.style.display="flex"

        let chatWindow;
        document.querySelector('button.chatShareSSHButton').addEventListener("click",(e)=>{
            chatWindow = new BrowserWindow({ 
                width: 500,
                height: 600,
                resizable: false
             });
            chatWindow.loadURL("https://chat.google.com/add/dm");
            chatWindow.webContents.on('did-navigate-in-page',()=>{
                chatWindow.webContents.executeJavaScript(`
                    initialURL="https://chat.google.com/add/dm";
                    currentURL=document.URL;
                    if(currentURL !== initialURL)
                    {
                        const {ipcRenderer} = require('electron');
                        const reply = ipcRenderer.sendSync("sshValue")
                        function executeCode(){
                            document.querySelector('div.Ct5IYc.qs41qe').innerText=""
                            document.querySelector('div.oAzRtb.krjOGe').innerText=reply; 
                            document.querySelector('div.XT3Vq').click();      
                           
                        }
                        setTimeout(executeCode,5000);
        
                    }            
                `)
            })
        })
        
    }
    
    ipcRenderer.send('urlSend',document.URL);
    if(ssh)
    ipcRenderer.send('sshSend',ssh.value);
}