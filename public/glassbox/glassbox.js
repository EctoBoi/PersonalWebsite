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
    let xPos = event.clientX;
    let yPos = event.clientY;
    let xOffset = (xPos - canvas.width / 2) / 10
    let yOffset = (yPos - canvas.height / 2) / 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0074d9'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo((canvas.width / 2) - xOffset, (canvas.height / 2) - yOffset)
    ctx.lineTo(canvas.width, 0)
    ctx.fill()
}