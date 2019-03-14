const electron = require('electron');
const ipc = electron.ipcRenderer;

window.onload = () => {
    mainUrl=ipc.sendSync('urlRecieve');
    document.querySelector('ul.list-unstyled.navbar-sub-nav').style.display="none";
    document.querySelector('ul.nav.navbar-nav').style.display="none";
}