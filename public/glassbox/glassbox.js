const canvasEle = document.createElement("canvas")
canvasEle.setAttribute('id', 'glassboxCanvas')
canvasEle.setAttribute('onmousemove', 'getCursorPosition(event)')
$('body').append(canvasEle)

let canvas = document.getElementById('glassboxCanvas')
let ctx = canvas.getContext('2d')
window.onresize = setCanvasSize
setCanvasSize()

function setCanvasSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')
}

function getCursorPosition(event) {
    let posX = event.clientX
    let posY = event.clientY
    let xOffset = (posX - canvas.width / 2) / 5
    let yOffset = (posY - canvas.height / 2) / 5
    let centerX = (canvas.width / 2) - xOffset
    let centerY = (((canvas.height / 2) * 1.3) - yOffset)

    let dColor = '#dfd3d3'
    let lColor = '#fff5f5'

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = lColor
    ctx.fill();

    let lineBaseWidth = 3

    //4 lines towards center
    ctx.beginPath()
    ctx.moveTo(-lineBaseWidth, lineBaseWidth)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(lineBaseWidth, -lineBaseWidth)
    let grd = ctx.createLinearGradient(0, 0, centerX, centerY)
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(canvas.width - lineBaseWidth, -lineBaseWidth)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(canvas.width + lineBaseWidth, +lineBaseWidth)
    grd = ctx.createLinearGradient(canvas.width, 0, centerX, centerY)
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.fillStyle = grd
    ctx.fill()

    /*
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
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(lineBaseWidth, canvas.height + lineBaseWidth)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(-lineBaseWidth, canvas.height - lineBaseWidth)
    grd = ctx.createLinearGradient(0, canvas.height, centerX, centerY)
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.fillStyle = grd
    ctx.fill()

    //back rectangle
    let dist = 0.15
    ctx.beginPath()
    ctx.moveTo(centerX * dist, centerY * dist)
    ctx.lineTo((canvas.width * (2 - dist) / 2) - (xOffset * dist), centerY * dist)
    ctx.lineTo((canvas.width * (2 - dist) / 2) - (xOffset * dist), ((canvas.height * (2 - dist) / 2) * 1.025) - (yOffset * dist))
    ctx.lineTo(centerX * dist, ((canvas.height * (2 - dist) / 2) * 1.025) - (yOffset * dist))
    ctx.closePath()
    ctx.strokeStyle = dColor
    ctx.lineWidth = 5
    ctx.stroke()
}