const electron = require('electron');
const { remote } = electron;
const BrowserWindow = electron.remote.BrowserWindow;
let composeWindow;
const composeWindowFunction = () => {
    document.querySelector('div.z0').innerHTML = "<button class='all-in-one-btn T-I J-J5-Ji T-I-KE L3'>Compose</button>"
    // Disable hangout
    document.querySelector('[aria-label="Hangouts"]').style.display = 'none';
    document.querySelector('div.aeQ').style.display = 'none';
    document.querySelector('span.J-Ke.n4.ah9').style.display = 'none';
    document.querySelector('div.nH.bAw.nn').style.display = 'none'
    document.querySelector('div.gb_lc.gb_Ja.gb_kc').style.display='none'
    document.querySelector('button.all-in-one-btn').addEventListener('click', () => {
        composeWindow = new BrowserWindow({
            parent: remote.getCurrentWindow(),
            alwaysOnTop: true,
            width: 500, height: 600, frame: true, webPreferences: {
                nodeIntegration: false
            }
        })
        composeWindow.loadURL('https://mail.google.com/mail/?view=cm&fs=1')
        composeWindow.webContents.on('did-finish-load',()=>{
            composeWindow.webContents.executeJavaScript(`
            document.querySelector('div.Io').style.webkitAppRegion = 'drag';
        `);
        })

        composeWindow.show();
    })
}
window.onload = () => {
    composeWindowFunction();
}


