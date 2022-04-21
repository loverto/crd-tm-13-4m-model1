// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

let muButton = document.querySelectorAll('.mu-button');
muButton.forEach(function (ele) {
    ele.addEventListener('mouseover',function (event) {
        event.currentTarget.classList.add('hover')
    })
    ele.addEventListener('mouseout',function (event) {
        event.currentTarget.classList.remove('hover')
    })
})
