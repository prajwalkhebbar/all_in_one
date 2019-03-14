const { ipcRenderer } = require('electron');
const { path } = require('path')
window.onload = () =>{
    let inbox = document.querySelectorAll('span.ts')[2].innerText
    const reply = ipcRenderer.sendSync("countReceive")
    if(reply == 1){
        ipcRenderer.send("countSend",0)
        ipcRenderer.send("inboxUnreadReceive",inbox)
    }
    let previousInbox = ipcRenderer.sendSync("inboxUnreadSend")
    function inboxCheck(){
        previousInbox = ipcRenderer.sendSync("inboxUnreadSend");
        if(document.querySelectorAll('span.ts')[2].innerText > previousInbox){
            Notification.requestPermission().then(function(result){
                var notification = new Notification('Gmail Notifications',{
                    body: 'new notification arrived',
                    icon: 'http://i68.tinypic.com/15y7m77.png'
                })
                notification.onclick=()=>{
                    ipcRenderer.send("OpenGmail",1)
                }
            })
            ipcRenderer.send("inboxUnreadReceive",document.querySelectorAll('span.ts')[2].innerText)
        }
    }
    setInterval(inboxCheck,10000);
}