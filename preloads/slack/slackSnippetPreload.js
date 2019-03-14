const electron = require('electron')
const path = require('path');
const { remote, ipcRenderer } = require('electron')

window.onload = () => {

    function runCode() {
        if (document.querySelector('footer')) 
        {
            document.querySelector('footer').style.display = 'none';
        }
        if (document.querySelectorAll('div.ql-editor')[1])
        {
            const reply = ipcRenderer.sendSync('channeltoslacksnippet');
            document.querySelectorAll('div.ql-editor')[1].innerText = reply
        }
    }

    function runSnippetCode() {
        if (document.getElementById("primary_file_button")) {
            document.getElementById("primary_file_button").click()
            document.querySelectorAll("li.file_menu_item")[0].click()
            document.querySelector("a.btn.btn_outline cancel").addEventListener('click',()=>{
                
                document.querySelector('button.btn btn_danger.dialog_cancel').addEventListener('click',()=>{
                    document.querySelectorAll('div.ql-editor')[1].innerText = '';
            
                });
    
            })
        
        }
    }


    window.setTimeout(runCode, 2000)
    window.setTimeout(runSnippetCode, 3000)


}