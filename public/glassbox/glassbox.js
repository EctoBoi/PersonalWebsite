const canvasEle = document.createElement("canvas")
canvasEle.setAttribute('id', 'glassbox-canvas')
$('body').append(canvasEle)
let canvas = document.getElementById('glassbox-canvas')
let ctx = canvas.getContext('2d')

setCanvasSize()
getCursorPosition()

window.addEventListener('resize', function() {
    setCanvasSize()
    getCursorPosition()
}, true)

function setCanvasSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')
}

document.body.setAttribute('onmousemove', 'getCursorPosition(event)')
document.body.addEventListener('touchmove', (e) => {
    let posX = e.touches[0].clientX
    let posY = e.touches[0].clientY
    drawGlassbox(posX, posY)
    positionContent(posX, posY)
}, false);

function getCursorPosition(event) {
    let posX
    let posY
    if (event) {
        posX = event.clientX
        posY = event.clientY
    } else {
        posX = canvas.width / 2
        posY = canvas.height / 2
    }

    drawGlassbox(posX, posY)
    positionContent(posX, posY)
}

function positionContent(posX, posY) {
    let contentDiv = document.getElementById('glassbox-content')
    let contentSize = 0.9
    let warpLimiter = 15
    let xOffset = (posX - canvas.width / 2) / warpLimiter
    let yOffset = (posY - canvas.height / 2) / warpLimiter

    contentDiv.style.width = window.innerWidth * contentSize + 'px'
    contentDiv.style.height = window.innerHeight * contentSize + 'px'
    contentDiv.style.left = (((1 - contentSize) * window.innerWidth) / 2) + xOffset + 'px'
    contentDiv.style.top = (((1 - contentSize) * window.innerHeight) / 2) + yOffset + 'px'
}

function drawGlassbox(posX, posY) {
    let warpLimiter = 1.5
    let xOffset = (posX - canvas.width / 2) / warpLimiter
    let yOffset = (posY - canvas.height / 2) / warpLimiter
    let centerX = (canvas.width / 2) - xOffset
    let centerY = (((canvas.height / 2) * 1.3) - yOffset)

    let dColor = '#dfd3d3'
    let lColor = '#fff5f5'

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = lColor
    ctx.fill();

    let lineBaseWidth = 3

    function addColorStop(grd) {
        grd.addColorStop(0, dColor)
        grd.addColorStop(0.5, dColor)
        grd.addColorStop(0.8, lColor)
        grd.addColorStop(1, lColor)
    }

    //4 lines towards center
    ctx.beginPath()
    ctx.moveTo(-lineBaseWidth, lineBaseWidth)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(lineBaseWidth, -lineBaseWidth)
    let grd = ctx.createLinearGradient(0, 0, centerX, centerY)
    addColorStop(grd)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(canvas.width - lineBaseWidth, -lineBaseWidth)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(canvas.width + lineBaseWidth, +lineBaseWidth)
    grd = ctx.createLinearGradient(canvas.width, 0, centerX, centerY)
    addColorStop(grd)
    ctx.fillStyle = grd
    ctx.fill()

    /*
    //floor for hallway look
     ctx.beginPath()
     ctx.moveTo(-lineBaseWidth, canvas.height-lineBaseWidth)
     ctx.lineTo(centerX, centerY)
     ctx.lineTo(canvas.width+lineBaseWidth, canvas.height-lineBaseWidth)
     grd = ctx.createLinearGradient(canvas.width/2, canvas.height, canvas.width/2, centerY)
     grd.addColorStop(0, dColor)
     grd.addColorStop(0.4, dColor)
     grd.addColorStop(0.8, lColor)
     grd.addColorStop(1, lColor)
     ctx.fillStyle = grd
     ctx.fill()
     */

    ctx.beginPath()
    ctx.moveTo(canvas.width + lineBaseWidth, canvas.height - lineBaseWidth)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(canvas.width - lineBaseWidth, canvas.height + lineBaseWidth)
    grd = ctx.createLinearGradient(canvas.width, canvas.height, centerX, centerY)
    addColorStop(grd)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(lineBaseWidth, canvas.height + lineBaseWidth)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(-lineBaseWidth, canvas.height - lineBaseWidth)
    grd = ctx.createLinearGradient(0, canvas.height, centerX, centerY)
    addColorStop(grd)
    ctx.fillStyle = grd
    ctx.fill()

    //back rectangle
    let dist = .2
    ctx.beginPath()
    ctx.moveTo(centerX * dist, centerY * dist)
    ctx.lineTo((canvas.width * (2 - dist) / 2) - (xOffset * dist), centerY * dist)
        //0.15 = 1.025 0.30 = 1.055 fix scaling, stand in: (1 + 0.17 * dist)
    ctx.lineTo((canvas.width * (2 - dist) / 2) - (xOffset * dist), ((canvas.height * (2 - dist) / 2) * (1 + 0.17 * dist)) - (yOffset * dist))
    ctx.lineTo(centerX * dist, ((canvas.height * (2 - dist) / 2) * (1 + 0.17 * dist)) - (yOffset * dist))
    ctx.closePath()
    ctx.strokeStyle = dColor
    ctx.lineWidth = 5
    ctx.stroke()
}