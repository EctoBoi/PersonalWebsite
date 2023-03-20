let glassboxCanvas = document.getElementById('glassbox-canvas') as HTMLCanvasElement
let menuButtonCanvas = document.getElementById('menu-button-canvas') as HTMLCanvasElement
let navCanvases = (document.getElementById('nav-box-div') as HTMLDivElement).children
let navBox = document.getElementById('nav-box-div') as HTMLDivElement

let lineWidth = 6
let dColor = '#dfd3d3'
let lColor = '#fff5f5'
let lColorHover = '#f1e9e9'
let fontColor = 'black'
let fontName = 'Georgia'

let mobileMaxWidth = 500
let mobileMode = window.innerWidth <= mobileMaxWidth

setGlassboxSize()
setNavSize()
getCursorPosition(null)

window.addEventListener('resize', function () {
    mobileMode = window.innerWidth <= mobileMaxWidth

    setGlassboxSize()
    setNavSize()
    getCursorPosition(null)
}, true)

document.body.addEventListener('mousemove', (e) => { getCursorPosition(e) })

document.body.addEventListener('touchmove', (e) => {
    let posX = e.touches[0].clientX
    let posY = e.touches[0].clientY
    drawGlassbox(posX, posY, glassboxCanvas)
    positionContent(posX, posY)
    positionNav(posX)
}, false);

function getCursorPosition(e: MouseEvent | null) {
    let posX: number
    let posY: number
    if (e) {
        posX = e.clientX
        posY = e.clientY
    } else {
        posX = glassboxCanvas.width / 2
        posY = glassboxCanvas.height / 2
    }

    drawGlassbox(posX, posY, glassboxCanvas)
    positionContent(posX, posY)
    positionNav(posX)
    drawNav(posX, posY)
    drawMenuButton(posX, posY)
}

//===============Content===============
function positionContent(posX: number, posY: number) {
    let glassboxContent = document.getElementById('glassbox-content-div') as HTMLDivElement
    let contentSize = 0.9
    let warpLimiter = 15
    let xOffset = (posX - glassboxCanvas.width / 2) / warpLimiter
    let yOffset = (posY - glassboxCanvas.height / 2) / warpLimiter

    glassboxContent.style.width = window.innerWidth * contentSize + 'px'
    glassboxContent.style.height = window.innerHeight * contentSize + 'px'
    glassboxContent.style.left = (((1 - contentSize) * window.innerWidth) / 2) + xOffset + 'px'
    glassboxContent.style.top = (((1 - contentSize) * window.innerHeight) / 2) + yOffset + 'px'
}

(document.getElementById('welcome-div') as HTMLDivElement).addEventListener('mouseover', function () {
    let glassboxContent = document.getElementById('glassbox-content-div') as HTMLDivElement
    let randX = Math.floor(Math.random() * ((+glassboxContent.clientWidth / 2) - 100))
    let randY = Math.floor(Math.random() * ((+glassboxContent.clientHeight / 2) - 60))

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
})

//===============Glassbox===============
function setGlassboxSize() {
    glassboxCanvas.width = window.innerWidth
    glassboxCanvas.height = window.innerHeight
}

function drawGlassbox(posX: number, posY: number, canvas: HTMLCanvasElement) {
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    let warpLimiter = 2
    let xOffset = (posX - canvas.width / 2) / warpLimiter
    let yOffset = (posY - canvas.height / 2) / warpLimiter
    let centerX = (canvas.width / 2) - xOffset
    let centerY = (((canvas.height / 2) * 1.3) - yOffset)

    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = lColor
    ctx.fill()

    let lc = lineWidth / 2 //lineCenter

    function addColorStop(grd) {
        grd.addColorStop(0, dColor)
        grd.addColorStop(0.5, dColor)
        grd.addColorStop(0.8, lColor)
        grd.addColorStop(1, lColor)
    }

    //4 lines towards center
    ctx.beginPath()
    ctx.moveTo(-lc, lc)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(lc, -lc)
    let grd = ctx.createLinearGradient(0, 0, centerX, centerY)
    addColorStop(grd)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(canvas.width - lc, -lc)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(canvas.width + lc, +lc)
    grd = ctx.createLinearGradient(canvas.width, 0, centerX, centerY)
    addColorStop(grd)
    ctx.fillStyle = grd
    ctx.fill()

    /*
    //floor for hallway look
     ctx.beginPath()
     ctx.moveTo(-lc, canvas.height-lc)
     ctx.lineTo(centerX, centerY)
     ctx.lineTo(canvas.width+lc, canvas.height-lc)
     grd = ctx.createLinearGradient(canvas.width/2, canvas.height, canvas.width/2, centerY)
     grd.addColorStop(0, dColor)
     grd.addColorStop(0.4, dColor)
     grd.addColorStop(0.8, lColor)
     grd.addColorStop(1, lColor)
     ctx.fillStyle = grd
     ctx.fill()
     */

    ctx.beginPath()
    ctx.moveTo(canvas.width + lc, canvas.height - lc)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(canvas.width - lc, canvas.height + lc)
    grd = ctx.createLinearGradient(canvas.width, canvas.height, centerX, centerY)
    addColorStop(grd)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(lc, canvas.height + lc)
    ctx.lineTo(centerX, centerY)
    ctx.lineTo(-lc, canvas.height - lc)
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

//===============Navigation===============
function setNavSize() {
    menuButtonVisability(mobileMode)
    navBoxVisability(!mobileMode)

    let navWidth = 90
    if (!mobileMode) {
        (50 + (1 - (document.body.clientWidth / 1920)) * 100)
        navBox.style.flexDirection = 'row'
        navBox.style.top = '0px'
    } else {
        navBox.style.flexDirection = 'column'
        navBox.style.top = '55px'
    }
    if (navWidth > 100)
        navWidth = 100
    navBox.style.width = navWidth + "%"

    let canvasWidth = Math.floor(navBox.clientWidth / 4) - 1
    let canvasHeight = 35 + Math.round(window.innerHeight * .02)

    for (let i = 0; i < navCanvases.length; i++) {
        let canvas = navCanvases.item(i) as HTMLCanvasElement
        canvas.width = mobileMode ? navBox.clientWidth : canvasWidth
        canvas.height = canvasHeight
        if (i == 0 && mobileMode) {
            canvas.height = canvasHeight + lineWidth
        }
    }

    drawNav(window.innerWidth / 2, window.innerHeight / 2)
    drawMenuButton(window.innerWidth / 2, window.innerHeight / 2)
}

function positionNav(posX: number) {
    let warpLimiter = 15
    let xOffset = (posX - glassboxCanvas.width / 2) / warpLimiter

    navBox.style.left = window.innerWidth / 2 - navBox.clientWidth / 2 + xOffset + 'px'
}

//Nav Clicks
navCanvases[0].addEventListener('click', function () {
    alert('Home')
})
navCanvases[1].addEventListener('click', function () {
    alert('About')
})
navCanvases[2].addEventListener('click', function () {
    alert('Portfolio')
})
navCanvases[3].addEventListener('click', function () {
    alert('Contact')
})

function drawNav(posX: number, posY: number) {
    let ctx0 = (navCanvases.item(0) as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D,
        ctx1 = (navCanvases.item(1) as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D,
        ctx2 = (navCanvases.item(2) as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D,
        ctx3 = (navCanvases.item(3) as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D

    let rect = navCanvases[0].getBoundingClientRect(),
        x = posX - rect.left,
        y = posY - rect.top,
        isHovered = ctx0.isPointInPath(x, y)
    drawNav0(ctx0, isHovered)

    rect = navCanvases[1].getBoundingClientRect()
    x = posX - rect.left
    y = posY - rect.top
    isHovered = ctx1.isPointInPath(x, y)
    drawNav1(ctx1, isHovered)

    rect = navCanvases[2].getBoundingClientRect()
    x = posX - rect.left
    y = posY - rect.top
    isHovered = ctx2.isPointInPath(x, y)
    drawNav2(ctx2, isHovered)

    rect = navCanvases[3].getBoundingClientRect()
    x = posX - rect.left
    y = posY - rect.top
    isHovered = ctx3.isPointInPath(x, y)
    drawNav3(ctx3, isHovered)
}

function navBoxVisability(visible: boolean) {
    if (visible) {
        navBox.style.visibility = 'visible'
    } else {
        navBox.style.visibility = 'hidden'
    }
}

function drawNav0(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let lc = lineWidth / 2 //lineCenter

    ctx.beginPath()
    if (mobileMode) {
        ctx.lineTo(lc, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - lc, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - lc, lc)
        ctx.lineTo((ctx.canvas.height + lc) * (ctx.canvas.width / 200), lc)
        ctx.closePath()
    } else {
        ctx.moveTo(lc, -lc)
        ctx.lineTo((ctx.canvas.height + lc) * (ctx.canvas.width / 200), ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width, 0)
    }

    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.fillStyle = isHovered ? lColorHover : lColor
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = fontColor
    let fontHeight = (30 * ((mobileMode ? ctx.canvas.height - lineWidth : ctx.canvas.height) / 50)) - 8
    let text = "Home"
    ctx.font = fontHeight + "px " + fontName;
    let canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2)
    let canvasSlopeOffset = (ctx.canvas.height - lc) * (ctx.canvas.width / 600)
    if (mobileMode)
        canvasSlopeOffset = 0
    let textPosX = canvasTextCenter + canvasSlopeOffset
    ctx.fillText(text, textPosX, fontHeight + (mobileMode ? 8 + lineWidth : 8))
}

function drawNav1(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let lc = lineWidth / 2 //lineCenter

    ctx.beginPath()
    if (mobileMode) {
        ctx.moveTo(lc, 0)
        ctx.lineTo(lc, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - lc, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - lc, 0)
    } else {
        ctx.moveTo(0, 0)
        ctx.lineTo(0, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width, 0)
    }

    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.fillStyle = isHovered ? lColorHover : lColor
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = fontColor
    let fontHeight = (30 * (ctx.canvas.height / 50)) - 8
    let text = "About"
    ctx.font = fontHeight + "px " + fontName;
    let canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2)
    ctx.fillText(text, canvasTextCenter, fontHeight + 8)
}

function drawNav2(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let lc = lineWidth / 2 //lineCenter

    ctx.beginPath()
    if (mobileMode) {
        ctx.moveTo(lc, 0)
        ctx.lineTo(lc, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - lc, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - lc, 0)
    } else {
        ctx.moveTo(0, 0)
        ctx.lineTo(0, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width, 0)
    }

    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.fillStyle = isHovered ? lColorHover : lColor
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = fontColor
    let fontHeight = (30 * (ctx.canvas.height / 50)) - 8
    let text = "Portfolio"
    ctx.font = fontHeight + "px " + fontName;
    let canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2)
    ctx.fillText(text, canvasTextCenter, fontHeight + 8)
}

function drawNav3(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let lc = lineWidth / 2 //lineCenter

    ctx.beginPath()
    if (mobileMode) {
        ctx.moveTo(lc, 0)
        ctx.lineTo(lc, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - ((ctx.canvas.height + lc) * (ctx.canvas.width / 200)), ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width, -lc)
    } else {
        ctx.moveTo(0, 0)
        ctx.lineTo(0, ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - ((ctx.canvas.height + lc) * (ctx.canvas.width / 200)), ctx.canvas.height - lc)
        ctx.lineTo(ctx.canvas.width - lc, -lc)
    }

    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    ctx.fillStyle = isHovered ? lColorHover : lColor
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = fontColor
    let fontHeight = (30 * (ctx.canvas.height / 50)) - 8
    let text = "Contact"
    ctx.font = fontHeight + "px " + fontName;
    let canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2)
    let canvasSlopeOffset = (ctx.canvas.height - lc) * (ctx.canvas.width / 600)
    if (mobileMode)
        canvasSlopeOffset = 0
    let textPosX = canvasTextCenter - canvasSlopeOffset
    ctx.fillText(text, textPosX, fontHeight + 8)
}

//Menu Button
function drawMenuButton(posX: number, posY: number) {
    menuButtonCanvas.height = 45
    menuButtonCanvas.width = 45

    let ctx = menuButtonCanvas.getContext('2d') as CanvasRenderingContext2D

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let lc = lineWidth / 2 //lineCenter

    ctx.beginPath()
    ctx.rect(lc, lc, menuButtonCanvas.width - lineWidth, menuButtonCanvas.height - lineWidth)
    ctx.closePath()
    ctx.strokeStyle = dColor
    ctx.lineWidth = lineWidth
    let rect = menuButtonCanvas.getBoundingClientRect()
    let x = posX - rect.left
    let y = posY - rect.top
    let isHovered = ctx.isPointInPath(x, y)
    ctx.fillStyle = isHovered ? lColorHover : lColor
    ctx.fill()
    ctx.stroke()

    if (navBox.style.visibility == 'hidden') {
        ctx.beginPath()
        ctx.moveTo(lineWidth * 1.5, lineWidth * 2)
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), lineWidth * 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(lineWidth * 1.5, ctx.canvas.height / 2)
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), ctx.canvas.height / 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(lineWidth * 1.5, ctx.canvas.height - (lineWidth * 2))
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), ctx.canvas.height - (lineWidth * 2))
        ctx.stroke()
    } else {
        ctx.beginPath()
        ctx.moveTo(lineWidth * 1.5, lineWidth * 1.5)
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), ctx.canvas.height - (lineWidth * 1.5))
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(lineWidth * 1.5, ctx.canvas.height - (lineWidth * 1.5))
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), lineWidth * 1.5)
        ctx.stroke()
    }
}

menuButtonCanvas.addEventListener('click', function () {
    if (navBox.style.visibility == 'hidden') {
        navBoxVisability(true)
    } else {
        navBoxVisability(false)
    }
    drawMenuButton(window.innerWidth / 2, window.innerHeight / 2)
})

function menuButtonVisability(visible: boolean) {
    let menuButtonDiv = document.getElementById('menu-button-div') as HTMLDivElement
    if (visible) {
        menuButtonDiv.style.visibility = 'visible'
    } else {
        menuButtonDiv.style.visibility = 'hidden'
    }
}