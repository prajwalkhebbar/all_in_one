const path = require('path');
const { remote, ipcRenderer, } = require('electron')
let stackurl;
let insideEle1;
let insideEle2;
const { BrowserWindow } = remote
const { Menu, MenuItem } = remote
const dashboardMenu = new Menu()
let url;
// DOM elements
const webview1 = document.querySelector('#webview-1')
const webview2 = document.querySelector('#webview-2')
const gmailButton = document.querySelector('#gmail-button');
gmailButton.setAttribute("title","Gmail")
const chatButton = document.querySelector('#chat-button');
chatButton.setAttribute("title","Google Chat")
const gitlabButton = document.querySelector('#gitlab-button');
gitlabButton.setAttribute("title","Gitlab")
const loading = document.querySelector('#loading');
const logoutButton = document.querySelector('#logout');
logoutButton.setAttribute("title","Logout")
const replButton = document.querySelector('#repl-button');
replButton.setAttribute("title","repl")
const slackButton = document.querySelector('#slack-button');
slackButton.setAttribute("title","slack")


let gmailView = webviewCreator('https://mail.google.com/mail/u/0/', 'gmailWebView', path.join(__dirname, 'preloads', 'gmail', 'gmailCompose'));
let gitView = webviewCreator('https://git.hashedin.com', 'gitlabWebView', path.join(__dirname, 'preloads', 'gitlab', 'allProjectsPreload'));
let chatView = webviewCreator('https://chat.google.com/u/0/', 'chatWebView', path.join(__dirname, 'preloads', 'googleChat', 'googleChat.js'));
let replView = webviewCreator('https://repl.it', 'replWebView', path.join(__dirname, 'preloads', 'repl', 'repl.js'))
let slackView = webviewCreator('https://slack.com/signin', 'slackView', path.join(__dirname, 'preloads', 'slack', 'slackMainPreload.js'))

function webviewCreator(url, id, preload) {
    ele = document.createElement('webview');
    ele.src = url;
    ele.id = id;
    ele.style = "top:0; display:inline-flex !important; width: 100%; height: 99.5%;";
    if (preload != null) {
        ele.setAttribute('preload', preload);
    }
    ele.setAttribute('allowpopups', '')
    ele.addEventListener('did-finish-load', () => {
        loading.style.display = 'none'
        ele.style.display = "inline-flex"
    })
    // ele.addEventListener('dom-ready', () => {
    //     ele.openDevTools()
    // })

    return ele
}

replView.setAttribute('webPreferences', `{
    nativeWindowOpen:false
}`)

// Drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}
function dragEnter1(ev) {
    insideEle1 = ev.target.innerHTML;
    ev.target.innerHTML = '<h6 class="display-4 text-center text-secondary"><i>Drop Here</i></h6>'
}
function dragExit1(ev) {
    ev.target.innerHTML = insideEle1
}
function dragEnter2(ev) {
    insideEle2 = ev.target.innerHTML;
    ev.target.innerHTML = '<h6 class="display-4 text-center text-secondary"><i>Drop Here</i></h6>'
}
function dragExit2(ev) {
    ev.target.innerHTML = insideEle2
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    loading.style.display = 'block'
    var data = ev.dataTransfer.getData("text/plain");
    if (document.getElementById(data).id === 'gmail-button') {
        ev.target.innerHTML = ''
        ev.target.appendChild(gmailView)
    }
    else if (document.getElementById(data).id === 'chat-button') {
        ev.target.innerHTML = ''
        ev.target.appendChild(chatView)
    }
    else if (document.getElementById(data).id === 'gitlab-button') {
        ev.target.innerHTML = ''
        ev.target.appendChild(gitView)
    }
    else if (document.getElementById(data).id === 'slack-button') {
        ev.target.innerHTML = ''
        ev.target.appendChild(slackView)
    }
    else if (document.getElementById(data).id === 'repl-button') {
        ev.target.innerHTML = ''
        ev.target.appendChild(replView)
    }
}


let gmailWindowValue = ipcRenderer.sendSync("GmailWindow")
if (gmailWindowValue === 1) {
    webview1.innerHTML = ''
    webview1.appendChild(gmailView)
}

gmailButton.addEventListener('click', () => {
    webview1.innerHTML = ''
    webview1.appendChild(gmailView)
})
chatButton.addEventListener('click', () => {
    webview2.innerHTML = ''
    webview2.appendChild(chatView)
})
gitlabButton.addEventListener('click', () => {
    webview1.innerHTML = ''
    webview1.appendChild(gitView)
})

logoutButton.addEventListener('click', () => {
    fetch('https://www.google.com/accounts/Logout')
        .then(() => {
            fetch('https://git.hashedin.com/users/sign_out')
                .then(() => {
                    remote.getCurrentWindow().hide();
                })
        })
    });

    slackButton.addEventListener('click', () => {
        webview2.innerHTML = ''
        webview2.appendChild(slackView)
    })
    replButton.addEventListener('click', () => {
        webview1.innerHTML = ''
        webview1.appendChild(replView)
    })

    ipcRenderer.on('stackoverflow-open', (event, args) => {
        stackurl = args;
        let stackoverflowView = webviewCreator(stackurl, 'stackView', path.join(__dirname, 'preloads', 'stackoverflow', 'stackoverflow.js'))
        webview2.innerHTML = ''
        webview2.appendChild(stackoverflowView)
        stackoverflowView.addEventListener('dom-ready', () => {
          //  stackoverflowView.openDevTools();

        })
    })

    dashboardMenu.append(new MenuItem({
        label: 'open in new window',
        click() {
            createNewWindow(url)
        }
    }))

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        if (e.target.id) {
            if (e.target.id === 'gmail-button') {
                url = gmailView.src;
            }
            else if (e.target.id === 'chat-button') {
                url = chatView.src;

            }
            else if (e.target.id === 'gitlab-button') {
                url = gitView.src;

            }
            else if (e.target.id === 'slack-button') {
                url = slackView.src;

            }
            else if (e.target.id === 'repl-button') {
                url = replView.src;

            }
            else {
                url = "https://google.com";

            }
            dashboardMenu.popup()

        }


    })
    let value;
    ipcRenderer.on('sendingShortcutDetail', (event, arg) => {
        value = arg;
        if (value === "gmail") {
            webview1.innerHTML = ''
            webview1.appendChild(gmailView)

        }
        if (value === "chat") {
            webview2.innerHTML = ''
            webview2.appendChild(chatView)
        }
        if (value === "gitlab") {
            webview1.innerHTML = ''
            webview1.appendChild(gitView)
        }
        if (value === "slack") {
            webview2.innerHTML = ''
            webview2.appendChild(slackView)
        }
        if (value === "repl") {
            webview1.innerHTML = ''
            webview1.appendChild(replView)
        }
    })
    function createNewWindow(url) {
        let newWin = new BrowserWindow({
            width: 500,
            height: 600,
        })
        newWin.on('close', () => {
            newWin = null
        })
        newWin.loadURL(url)
        newWin.show()
    }
