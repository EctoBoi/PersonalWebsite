let glassboxContent = document.getElementById('glassbox-content')


let welcomeDiv = document.getElementById('welcome-div')
welcomeDiv.onmouseover = function() {
    let randX = Math.floor(Math.random() * ((+glassboxContent.clientWidth / 2) - 100))
    let randY = Math.floor(Math.random() * ((+glassboxContent.clientHeight / 2) - 30))

    if (Math.random() < 0.5) {
        this.style.left = randX + 'px'
    } else {
        this.style.left = -randX + 'px'
    }
    if (Math.random() < 0.5) {
        this.style.top = randY + 'px'
    } else {
        this.style.top = -randY + 'px'
    }
}