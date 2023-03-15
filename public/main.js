var glassboxCanvas = document.getElementById('glassbox-canvas');
var navCanvases = document.getElementById('nav-box').children;
var lineWidth = 6;
var dColor = '#dfd3d3';
var lColor = '#fff5f5';
var lColorHover = '#f1e9e9';
var fontColor = 'black';
var fontName = 'Georgia';
setGlassboxSize();
setNavSize();
getCursorPosition(null);
window.addEventListener('resize', function () {
    setGlassboxSize();
    setNavSize();
    getCursorPosition(null);
}, true);
document.body.setAttribute('onmousemove', 'getCursorPosition(event)');
document.body.addEventListener('touchmove', function (e) {
    var posX = e.touches[0].clientX;
    var posY = e.touches[0].clientY;
    drawGlassbox(posX, posY, glassboxCanvas);
    positionContent(posX, posY);
    positionNav(posX);
}, false);
function getCursorPosition(e) {
    var posX;
    var posY;
    if (e) {
        posX = e.clientX;
        posY = e.clientY;
    }
    else {
        posX = glassboxCanvas.width / 2;
        posY = glassboxCanvas.height / 2;
    }
    drawGlassbox(posX, posY, glassboxCanvas);
    positionContent(posX, posY);
    positionNav(posX);
    drawNav(posX, posY);
}
//===============Content===============
function positionContent(posX, posY) {
    var glassboxContent = document.getElementById('glassbox-content');
    var contentSize = 0.9;
    var warpLimiter = 15;
    var xOffset = (posX - glassboxCanvas.width / 2) / warpLimiter;
    var yOffset = (posY - glassboxCanvas.height / 2) / warpLimiter;
    glassboxContent.style.width = window.innerWidth * contentSize + 'px';
    glassboxContent.style.height = window.innerHeight * contentSize + 'px';
    glassboxContent.style.left = (((1 - contentSize) * window.innerWidth) / 2) + xOffset + 'px';
    glassboxContent.style.top = (((1 - contentSize) * window.innerHeight) / 2) + yOffset + 'px';
}
document.getElementById('welcome-div').addEventListener('mouseover', function () {
    var glassboxContent = document.getElementById('glassbox-content');
    console.log(glassboxContent);
    var randX = Math.floor(Math.random() * ((+glassboxContent.clientWidth / 2) - 100));
    var randY = Math.floor(Math.random() * ((+glassboxContent.clientHeight / 2) - 60));
    if (Math.random() < 0.5) {
        this.style.left = randX + 'px';
    }
    else {
        this.style.left = -randX + 'px';
    }
    if (Math.random() < 0.5) {
        this.style.top = randY + 'px';
    }
    else {
        this.style.top = -randY + 'px';
    }
});
//===============Glassbox===============
function setGlassboxSize() {
    glassboxCanvas.width = window.innerWidth;
    glassboxCanvas.height = window.innerHeight;
}
function drawGlassbox(posX, posY, canvas) {
    var ctx = canvas.getContext('2d');
    var warpLimiter = 2;
    var xOffset = (posX - canvas.width / 2) / warpLimiter;
    var yOffset = (posY - canvas.height / 2) / warpLimiter;
    var centerX = (canvas.width / 2) - xOffset;
    var centerY = (((canvas.height / 2) * 1.3) - yOffset);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = lColor;
    ctx.fill();
    var lineBaseWidth = 3;
    function addColorStop(grd) {
        grd.addColorStop(0, dColor);
        grd.addColorStop(0.5, dColor);
        grd.addColorStop(0.8, lColor);
        grd.addColorStop(1, lColor);
    }
    //4 lines towards center
    ctx.beginPath();
    ctx.moveTo(-lineBaseWidth, lineBaseWidth);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(lineBaseWidth, -lineBaseWidth);
    var grd = ctx.createLinearGradient(0, 0, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(canvas.width - lineBaseWidth, -lineBaseWidth);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(canvas.width + lineBaseWidth, +lineBaseWidth);
    grd = ctx.createLinearGradient(canvas.width, 0, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();
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
    ctx.beginPath();
    ctx.moveTo(canvas.width + lineBaseWidth, canvas.height - lineBaseWidth);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(canvas.width - lineBaseWidth, canvas.height + lineBaseWidth);
    grd = ctx.createLinearGradient(canvas.width, canvas.height, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(lineBaseWidth, canvas.height + lineBaseWidth);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(-lineBaseWidth, canvas.height - lineBaseWidth);
    grd = ctx.createLinearGradient(0, canvas.height, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();
    //back rectangle
    var dist = .2;
    ctx.beginPath();
    ctx.moveTo(centerX * dist, centerY * dist);
    ctx.lineTo((canvas.width * (2 - dist) / 2) - (xOffset * dist), centerY * dist);
    //0.15 = 1.025 0.30 = 1.055 fix scaling, stand in: (1 + 0.17 * dist)
    ctx.lineTo((canvas.width * (2 - dist) / 2) - (xOffset * dist), ((canvas.height * (2 - dist) / 2) * (1 + 0.17 * dist)) - (yOffset * dist));
    ctx.lineTo(centerX * dist, ((canvas.height * (2 - dist) / 2) * (1 + 0.17 * dist)) - (yOffset * dist));
    ctx.closePath();
    ctx.strokeStyle = dColor;
    ctx.lineWidth = 5;
    ctx.stroke();
}
//===============Navigation===============
function setNavSize() {
    var navBox = document.getElementById('nav-box');
    var navWidth = (50 + (1 - (document.body.clientWidth / 1920)) * 100);
    if (navWidth > 100)
        navWidth = 100;
    navBox.style.width = navWidth + "%";
    var width = Math.floor(navBox.clientWidth / 4) - 1;
    var height = 35 + Math.round(window.innerHeight * .02);
    for (var i = 0; i < navCanvases.length; i++) {
        var canvas = navCanvases.item(i);
        canvas.width = width;
        canvas.height = height;
    }
    /*
    drawNav0(navCanvases[0].getContext('2d'), false)
    drawNav1(navCanvases[1].getContext('2d'), false)
    drawNav2(navCanvases[2].getContext('2d'), false)
    drawNav3(navCanvases[3].getContext('2d'), false)
    */
    drawNav(window.innerWidth / 2, window.innerHeight / 2);
}
function positionNav(posX) {
    var navBox = document.getElementById('nav-box');
    var warpLimiter = 15;
    var xOffset = (posX - glassboxCanvas.width / 2) / warpLimiter;
    navBox.style.left = window.innerWidth / 2 - navBox.clientWidth / 2 + xOffset + 'px';
}
//Nav Clicks
navCanvases[0].addEventListener('click', function () {
    alert('Home');
});
navCanvases[1].addEventListener('click', function () {
    alert('About');
});
navCanvases[2].addEventListener('click', function () {
    alert('Portfolio');
});
navCanvases[3].addEventListener('click', function () {
    alert('Contact');
});
function drawNav(posX, posY) {
    var ctx0 = navCanvases.item(0).getContext('2d'), ctx1 = navCanvases.item(1).getContext('2d'), ctx2 = navCanvases.item(2).getContext('2d'), ctx3 = navCanvases.item(3).getContext('2d');
    var rect = navCanvases[0].getBoundingClientRect(), x = posX - rect.left, y = posY - rect.top, isHovered = ctx0.isPointInPath(x, y);
    drawNav0(ctx0, isHovered);
    rect = navCanvases[1].getBoundingClientRect();
    x = posX - rect.left;
    y = posY - rect.top;
    isHovered = ctx1.isPointInPath(x, y);
    drawNav1(ctx1, isHovered);
    rect = navCanvases[2].getBoundingClientRect();
    x = posX - rect.left;
    y = posY - rect.top;
    isHovered = ctx2.isPointInPath(x, y);
    drawNav2(ctx2, isHovered);
    rect = navCanvases[3].getBoundingClientRect();
    x = posX - rect.left;
    y = posY - rect.top;
    isHovered = ctx3.isPointInPath(x, y);
    drawNav3(ctx3, isHovered);
}
function drawNav0(ctx, isHovered) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(lineWidth / 2, -lineWidth / 2);
    ctx.lineTo((ctx.canvas.height + lineWidth / 2) * (ctx.canvas.width / 200), ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width, 0);
    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = fontColor;
    var fontHeight = (30 * (ctx.canvas.height / 50)) - 8;
    var text = "Home";
    ctx.font = fontHeight + "px " + fontName;
    var canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2);
    var canvasSlopeOffset = (ctx.canvas.height - lineWidth / 2) * (ctx.canvas.width / 600);
    var textPosX = canvasTextCenter + canvasSlopeOffset;
    ctx.fillText(text, textPosX, fontHeight + 8);
}
function drawNav1(ctx, isHovered) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width, 0);
    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = fontColor;
    var fontHeight = (30 * (ctx.canvas.height / 50)) - 8;
    var text = "About";
    ctx.font = fontHeight + "px " + fontName;
    var canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2);
    ctx.fillText(text, canvasTextCenter, fontHeight + 8);
}
function drawNav2(ctx, isHovered) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width, 0);
    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = fontColor;
    var fontHeight = (30 * (ctx.canvas.height / 50)) - 8;
    var text = "Portfolio";
    ctx.font = fontHeight + "px " + fontName;
    var canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2);
    ctx.fillText(text, canvasTextCenter, fontHeight + 8);
}
function drawNav3(ctx, isHovered) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width - ((ctx.canvas.height + lineWidth / 2) * (ctx.canvas.width / 200)), ctx.canvas.height - lineWidth / 2);
    ctx.lineTo(ctx.canvas.width - lineWidth / 2, -lineWidth / 2);
    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = fontColor;
    var fontHeight = (30 * (ctx.canvas.height / 50)) - 8;
    var text = "Contact";
    ctx.font = fontHeight + "px " + fontName;
    var canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2);
    var canvasSlopeOffset = (ctx.canvas.height - lineWidth / 2) * (ctx.canvas.width / 600);
    var textPosX = canvasTextCenter - canvasSlopeOffset;
    ctx.fillText(text, textPosX, fontHeight + 8);
}
