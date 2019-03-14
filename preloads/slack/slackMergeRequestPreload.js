const electron = require('electron')
const { ipcRenderer } = require('electron');
window.onload = () => {
    
    if(document.querySelector('footer')){
        document.querySelector('footer').style.display = 'none';
        }
    initialURL = "https://slack.com/signin"
  
    const reply = ipcRenderer.sendSync("textFromMergeRequestToSlack")
    function runcode() {
        document.querySelectorAll('div.ql-editor')[1].innerText = reply

    }
    window.setTimeout(runcode, 3000)

}