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
    let xOffset = (posX - canvas.width / 2) / 6
    let yOffset = (posY - canvas.height / 2) / 6
    let centerX = (canvas.width / 2) - xOffset
    let centerY = (((canvas.height / 2) * 1.3) - yOffset)

    let dColor = '#dfd3d3'
    let lColor = '#fff5f5'

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = lColor
    ctx.fill();

    ctx.lineWidth = 6

    //4 lines towards center
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(centerX, centerY)
    let grd = ctx.createLinearGradient(0, 0, centerX, centerY)
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.strokeStyle = grd
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width, 0)
    ctx.lineTo(centerX, centerY)
    grd = ctx.createLinearGradient(canvas.width, 0, centerX, centerY)
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.strokeStyle = grd
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    ctx.lineTo(centerX, centerY)
    grd = ctx.createLinearGradient(0, canvas.height, centerX, centerY)
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.strokeStyle = grd
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width, canvas.height)
    ctx.lineTo(centerX, centerY)
    grd = ctx.createLinearGradient(canvas.width, canvas.height, centerX, centerY)
    grd.addColorStop(0, dColor)
    grd.addColorStop(0.5, dColor)
    grd.addColorStop(0.8, lColor)
    grd.addColorStop(1, lColor)
    ctx.strokeStyle = grd
    ctx.stroke()

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