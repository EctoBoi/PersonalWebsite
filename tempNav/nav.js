/*
<div id='nav-box'>
      <canvas id="nav-canvas1"></canvas>
      <canvas id="nav-canvas2"></canvas>
      <canvas id="nav-canvas3"></canvas>
      <canvas id="nav-canvas4"></canvas>
    </div>
*/


let navC1 = document.getElementById('nav-canvas1')
let navC2 = document.getElementById('nav-canvas2')
let navC3 = document.getElementById('nav-canvas3')
let navC4 = document.getElementById('nav-canvas4')
let ctx1 = navC1.getContext('2d')
let ctx2 = navC2.getContext('2d')
let ctx3 = navC3.getContext('2d')
let ctx4 = navC4.getContext('2d')

let lineWidth = 6
let dColor = '#dfd3d3'

setCanvasSize()

navC1.onclick = function() {
    alert('1')
}
navC2.onclick = function() {
    alert('2')
}

window.addEventListener('resize', function() {
    setCanvasSize()
}, true)

function setCanvasSize() {
    let navBox = document.getElementById('nav-box')

    let navWidth = (50 + (1 - (navBox.parentElement.clientWidth / 1920)) * 100)
    if (navWidth > 100)
        navWidth = 100
    navBox.style.width = navWidth + "%"

    navBox.style.left = navBox.parentElement.clientWidth / 2 - navBox.clientWidth / 2 + 'px'



    let width = Math.floor(document.getElementById('nav-box').clientWidth / 4) - 1
    let height = 35 + Math.round(window.innerHeight * .02)
    navC1.width = width
    navC1.height = height
    navC2.width = width
    navC2.height = height
    navC3.width = width
    navC3.height = height
    navC4.width = width
    navC4.height = height


    drawNav1(ctx1)
    drawNav2(ctx2)
    drawNav3(ctx3)
    drawNav4(ctx4)
}

function drawNav1(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath()
    ctx.moveTo(lineWidth / 2, -lineWidth / 2)
    ctx.lineTo((ctx.canvas.height + lineWidth / 2) * (ctx.canvas.width / 200), ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width, 0)
    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.stroke()
}

function drawNav2(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width, 0)

    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.stroke()
}

function drawNav3(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width, 0)

    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.stroke()
}

function drawNav4(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width - ((ctx.canvas.height + lineWidth / 2) * (ctx.canvas.width / 200)), ctx.canvas.height - lineWidth / 2)
    ctx.lineTo(ctx.canvas.width - lineWidth / 2, -lineWidth / 2)

    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.stroke()
}