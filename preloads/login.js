const remote = require('electron').remote;

window.onload = () => {
    document.querySelector('div.google-footer-bar').style.display = 'none';
    document.querySelector('body').style.overflow='hidden';
    ele = document.createElement('a');
    ele.style.color = '#777';
    ele.innerHTML="✖"
    ele.style.font="14px/100% arial, sans-serif"
    ele.style.position="absolute"
    ele.style.right="5px"
    ele.style.textShadow="0 1px 0 #fff"
    ele.style.textDecoration="none"
    document.querySelector('div.wrapper').prepend(ele);
    ele.addEventListener('click',()=>{
        let win = remote.getCurrentWindow();
        win.hide();
    })
}
