var glassboxCanvas = document.getElementById('glassbox-canvas');
var menuButtonCanvas = document.getElementById('menu-button-canvas');
var navCanvases = document.getElementById('nav-box-div').children;
var galleryImgs = document.getElementsByClassName("gallery-img");
var navBox = document.getElementById('nav-box-div');
var glassboxContentDiv = document.getElementById('glassbox-content-div');
var lineWidth = 6;
var dColor = '#dfd3d3';
var lColor = '#fff5f5';
var lColorHover = '#f1e9e9';
var fontColor = 'black';
var fontName = 'Georgia';
var mobileMaxWidth = 500;
var mobileMode = window.innerWidth <= mobileMaxWidth;
setGlassboxSize();
setNavSize();
setImgOnClick();
getCursorPosition(null);
setImgSize();
window.addEventListener('resize', function () {
    mobileMode = window.innerWidth <= mobileMaxWidth;
    setGlassboxSize();
    setNavSize();
    getCursorPosition(null);
    setImgSize();
}, true);
document.body.addEventListener('mousemove', function (e) { getCursorPosition(e); });
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
    drawMenuButton(posX, posY);
}
//===============Content===============
function positionContent(posX, posY) {
    var glassboxContent = document.getElementById('glassbox-content-div');
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
    var glassboxContent = document.getElementById('glassbox-content-div');
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
    var lc = lineWidth / 2; //lineCenter
    function addColorStop(grd) {
        grd.addColorStop(0, dColor);
        grd.addColorStop(0.5, dColor);
        grd.addColorStop(0.8, lColor);
        grd.addColorStop(1, lColor);
    }
    //4 lines towards center
    ctx.beginPath();
    ctx.moveTo(-lc, lc);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(lc, -lc);
    var grd = ctx.createLinearGradient(0, 0, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(canvas.width - lc, -lc);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(canvas.width + lc, +lc);
    grd = ctx.createLinearGradient(canvas.width, 0, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();
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
    ctx.beginPath();
    ctx.moveTo(canvas.width + lc, canvas.height - lc);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(canvas.width - lc, canvas.height + lc);
    grd = ctx.createLinearGradient(canvas.width, canvas.height, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(lc, canvas.height + lc);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(-lc, canvas.height - lc);
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
    menuButtonVisability(mobileMode);
    navBoxVisability(!mobileMode);
    var navWidth = 90;
    if (!mobileMode) {
        (50 + (1 - (document.body.clientWidth / 1920)) * 100);
        navBox.style.flexDirection = 'row';
        navBox.style.top = '0px';
    }
    else {
        navBox.style.flexDirection = 'column';
        navBox.style.top = '55px';
    }
    if (navWidth > 100)
        navWidth = 100;
    navBox.style.width = navWidth + "%";
    var canvasWidth = Math.floor(navBox.clientWidth / 4) - 1;
    var canvasHeight = 35 + Math.round(window.innerHeight * .02);
    for (var i = 0; i < navCanvases.length; i++) {
        var canvas = navCanvases.item(i);
        canvas.width = mobileMode ? navBox.clientWidth : canvasWidth;
        canvas.height = canvasHeight;
        if (i == 0 && mobileMode) {
            canvas.height = canvasHeight + lineWidth;
        }
    }
    drawNav(window.innerWidth / 2, window.innerHeight / 2);
    drawMenuButton(window.innerWidth / 2, window.innerHeight / 2);
}
function positionNav(posX) {
    var warpLimiter = 15;
    var xOffset = (posX - glassboxCanvas.width / 2) / warpLimiter;
    navBox.style.left = window.innerWidth / 2 - navBox.clientWidth / 2 + xOffset + 'px';
}
//Nav Clicks
navCanvases[0].addEventListener('click', function () {
    hideAllContent();
    document.getElementById('welcome-div').style.display = 'block';
});
navCanvases[1].addEventListener('click', function () {
    hideAllContent();
    document.getElementById('about-div').style.display = 'block';
});
navCanvases[2].addEventListener('click', function () {
    hideAllContent();
    document.getElementById('portfolio-div').style.display = 'block';
    setImgSize();
});
navCanvases[3].addEventListener('click', function () {
    hideAllContent();
    document.getElementById('contact-div').style.display = 'block';
});
function hideAllContent() {
    document.getElementById('welcome-div').style.display = 'none';
    document.getElementById('about-div').style.display = 'none';
    document.getElementById('portfolio-div').style.display = 'none';
    document.getElementById('contact-div').style.display = 'none';
}
function drawNav(posX, posY) {
    var ctx0 = navCanvases[0].getContext('2d'), ctx1 = navCanvases[1].getContext('2d'), ctx2 = navCanvases[2].getContext('2d'), ctx3 = navCanvases[3].getContext('2d');
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
function navBoxVisability(visible) {
    if (visible) {
        navBox.style.visibility = 'visible';
    }
    else {
        navBox.style.visibility = 'hidden';
    }
}
function drawNav0(ctx, isHovered) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var lc = lineWidth / 2; //lineCenter
    ctx.beginPath();
    if (mobileMode) {
        ctx.lineTo(lc, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - lc, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - lc, lc);
        ctx.lineTo((ctx.canvas.height + lc) * (ctx.canvas.width / 200), lc);
        ctx.closePath();
    }
    else {
        ctx.moveTo(lc, -lc);
        ctx.lineTo((ctx.canvas.height + lc) * (ctx.canvas.width / 200), ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width, 0);
    }
    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = fontColor;
    var fontHeight = (30 * ((mobileMode ? ctx.canvas.height - lineWidth : ctx.canvas.height) / 50)) - 8;
    var text = "Home";
    ctx.font = fontHeight + "px " + fontName;
    var canvasTextCenter = (ctx.canvas.width / 2) - (ctx.measureText(text).width / 2);
    var canvasSlopeOffset = (ctx.canvas.height - lc) * (ctx.canvas.width / 600);
    if (mobileMode)
        canvasSlopeOffset = 0;
    var textPosX = canvasTextCenter + canvasSlopeOffset;
    ctx.fillText(text, textPosX, fontHeight + (mobileMode ? 8 + lineWidth : 8));
}
function drawNav1(ctx, isHovered) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var lc = lineWidth / 2; //lineCenter
    ctx.beginPath();
    if (mobileMode) {
        ctx.moveTo(lc, 0);
        ctx.lineTo(lc, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - lc, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - lc, 0);
    }
    else {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width, 0);
    }
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
    var lc = lineWidth / 2; //lineCenter
    ctx.beginPath();
    if (mobileMode) {
        ctx.moveTo(lc, 0);
        ctx.lineTo(lc, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - lc, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - lc, 0);
    }
    else {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width, 0);
    }
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
    var lc = lineWidth / 2; //lineCenter
    ctx.beginPath();
    if (mobileMode) {
        ctx.moveTo(lc, 0);
        ctx.lineTo(lc, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - ((ctx.canvas.height + lc) * (ctx.canvas.width / 200)), ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width, -lc);
    }
    else {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - ((ctx.canvas.height + lc) * (ctx.canvas.width / 200)), ctx.canvas.height - lc);
        ctx.lineTo(ctx.canvas.width - lc, -lc);
    }
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
    var canvasSlopeOffset = (ctx.canvas.height - lc) * (ctx.canvas.width / 600);
    if (mobileMode)
        canvasSlopeOffset = 0;
    var textPosX = canvasTextCenter - canvasSlopeOffset;
    ctx.fillText(text, textPosX, fontHeight + 8);
}
//Menu Button
function drawMenuButton(posX, posY) {
    menuButtonCanvas.height = 45;
    menuButtonCanvas.width = 45;
    var ctx = menuButtonCanvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var lc = lineWidth / 2; //lineCenter
    ctx.beginPath();
    ctx.rect(lc, lc, menuButtonCanvas.width - lineWidth, menuButtonCanvas.height - lineWidth);
    ctx.closePath();
    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    var rect = menuButtonCanvas.getBoundingClientRect();
    var x = posX - rect.left;
    var y = posY - rect.top;
    var isHovered = ctx.isPointInPath(x, y);
    ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();
    if (navBox.style.visibility == 'hidden') {
        ctx.beginPath();
        ctx.moveTo(lineWidth * 1.5, lineWidth * 2);
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), lineWidth * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lineWidth * 1.5, ctx.canvas.height / 2);
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), ctx.canvas.height / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lineWidth * 1.5, ctx.canvas.height - (lineWidth * 2));
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), ctx.canvas.height - (lineWidth * 2));
        ctx.stroke();
    }
    else {
        ctx.beginPath();
        ctx.moveTo(lineWidth * 1.5, lineWidth * 1.5);
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), ctx.canvas.height - (lineWidth * 1.5));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lineWidth * 1.5, ctx.canvas.height - (lineWidth * 1.5));
        ctx.lineTo(ctx.canvas.width - (lineWidth * 1.5), lineWidth * 1.5);
        ctx.stroke();
    }
}
menuButtonCanvas.addEventListener('click', function () {
    if (navBox.style.visibility == 'hidden') {
        navBoxVisability(true);
    }
    else {
        navBoxVisability(false);
    }
    drawMenuButton(window.innerWidth / 2, window.innerHeight / 2);
});
function menuButtonVisability(visible) {
    var menuButtonDiv = document.getElementById('menu-button-div');
    if (visible) {
        menuButtonDiv.style.visibility = 'visible';
    }
    else {
        menuButtonDiv.style.visibility = 'hidden';
    }
}
//===============Portfolio Gallery===============
var imgDefaultHeight = 130;
var imgDefaultWidth = 200;
function setImgOnClick() {
    for (var i = 0; i < galleryImgs.length; i++) {
        galleryImgs[i].addEventListener('click', expand);
    }
}
function expand() {
    if (this.expanded === undefined)
        this.expanded = false;
    if (this.expanded) {
        for (var j = 0; j < galleryImgs.length; j++) {
            var img = galleryImgs[j];
            img.hidden = false;
        }
        this.style.height = imgDefaultHeight + 'px';
        this.style.width = imgDefaultWidth + 'px';
    }
    else {
        for (var j = 0; j < galleryImgs.length; j++) {
            var img = galleryImgs[j];
            if (img != this) {
                img.hidden = true;
            }
            else {
                this.style.width = (this.width * 2) + 'px';
                this.style.height = (this.height * 2) + 'px';
            }
        }
    }
    this.expanded = !this.expanded;
}
function setImgSize() {
    var gallery = document.getElementById('gallery-div');
    imgDefaultHeight = glassboxContentDiv.clientWidth / 4;
    imgDefaultWidth = glassboxContentDiv.clientWidth * 0.39;
    for (var i = 0; i < galleryImgs.length; i++) {
        if (galleryImgs[i].expanded) {
            galleryImgs[i].style.height = (imgDefaultHeight * 2) + 'px';
            galleryImgs[i].style.width = (imgDefaultWidth * 2) + 'px';
        }
        else {
            galleryImgs[i].style.height = imgDefaultHeight + 'px';
            galleryImgs[i].style.width = imgDefaultWidth + 'px';
        }
        galleryImgs[i].style.margin = (gallery.clientWidth * 0.05) + 'px';
    }
}
