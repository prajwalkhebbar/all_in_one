backButton=document.createElement('button')
backButton.innerText = "back"
window.onload = ()=>{
    document.querySelector('div.-main').append(backButton)
    backButton
    .addEventListener("click",()=>{
        window.history.back()

    })
}