const glassboxCanvas = document.getElementById("glassbox-canvas") as HTMLCanvasElement;
const navCanvases = (document.getElementById("nav-box-div") as HTMLDivElement).children as HTMLCollectionOf<HTMLCanvasElement>;
const navBox = document.getElementById("nav-box-div") as HTMLDivElement;

const lineWidth = 6;
const dColor = "#4e5864";
const lColor = "#f6f6f7";
const lColorHover = "#e7e9ea";
const lColorActivePage = "#d1d5d8";
const fontColor = "#181c21";
const fontName = "Noto Sans";

let activePage = 0;

let lastPosX = 0;
let lastPosY = 0;

let homeIcon = new Image();
homeIcon.src = "/imgs/HomeIcon.png";
homeIcon.onload = () => drawNav(window.innerWidth / 2, window.innerHeight / 2);
let contactIcon = new Image();
contactIcon.src = "/imgs/ContactIcon.png";
contactIcon.onload = () => drawNav(window.innerWidth / 2, window.innerHeight / 2);
let aboutIcon = new Image();
aboutIcon.src = "/imgs/AboutIcon.png";
aboutIcon.onload = () => drawNav(window.innerWidth / 2, window.innerHeight / 2);
let portfolioIcon = new Image();
portfolioIcon.src = "/imgs/PortfolioIcon.png";
portfolioIcon.onload = () => drawNav(window.innerWidth / 2, window.innerHeight / 2);

const mobileMaxWidth = 500;
function isTouchDevice(): boolean {
    // Check if device doesn't support hover
    return !window.matchMedia("(hover:hover)").matches || !window.matchMedia("(pointer:fine)").matches;
}
let mobileMode = window.innerWidth <= mobileMaxWidth || isTouchDevice();

setGlassboxSize();
setNavSize();
getCursorPosition(null);

window.addEventListener(
    "resize",
    function () {
        mobileMode = window.innerWidth <= mobileMaxWidth || isTouchDevice();

        setGlassboxSize();
        setNavSize();
        getCursorPosition(null);

        currentPage = 0;
        renderSlides();
    },
    true,
);

document.body.addEventListener("mousemove", (e) => {
    getCursorPosition(e);
});

document.body.addEventListener(
    "touchmove",
    (e) => {
        let posX = e.touches[0].clientX;
        let posY = e.touches[0].clientY;
        lastPosX = posX;
        lastPosY = posY;
        drawGlassbox(posX, posY, glassboxCanvas);
        positionContent(posX, posY);
        positionNav(posX);
    },
    false,
);

function getCursorPosition(e: MouseEvent | null) {
    let posX: number;
    let posY: number;
    if (e) {
        posX = e.clientX;
        posY = e.clientY;
    } else {
        posX = glassboxCanvas.width / 2;
        posY = glassboxCanvas.height / 2;
    }
    lastPosX = posX;
    lastPosY = posY;

    drawGlassbox(posX, posY, glassboxCanvas);
    positionContent(posX, posY);
    positionNav(posX);
    drawNav(posX, posY);
}

//╔══════════════════════════════════════╗
//║           CONTENT POSITIONING        ║
//╚══════════════════════════════════════╝
function positionContent(posX: number, posY: number) {
    let glassboxContent = document.getElementById("glassbox-content-div") as HTMLDivElement;
    let contentSize = 0.9;
    let warpLimiter = 15;
    let xOffset = mobileMode ? 0 : (posX - glassboxCanvas.width / 2) / warpLimiter;
    let yOffset = mobileMode ? 0 : (posY - glassboxCanvas.height / 2) / warpLimiter;

    glassboxContent.style.width = window.innerWidth * contentSize + "px";
    glassboxContent.style.height = window.innerHeight * contentSize + "px";
    glassboxContent.style.left = ((1 - contentSize) * window.innerWidth) / 2 + xOffset + "px";
    glassboxContent.style.top = ((1 - contentSize) * window.innerHeight) / 2 + yOffset + "px";
}

(document.getElementById("welcome-div") as HTMLDivElement).addEventListener("mouseover", function () {
    let glassboxContent = document.getElementById("glassbox-content-div") as HTMLDivElement;
    let randX = Math.floor(Math.random() * (+glassboxContent.clientWidth / 3 - 100));
    let randY = Math.floor(Math.random() * (+glassboxContent.clientHeight / 3 - 60));

    if (Math.random() < 0.5) {
        this.style.left = randX + "px";
    } else {
        this.style.left = -randX + "px";
    }
    if (Math.random() < 0.5) {
        this.style.top = randY + "px";
    } else {
        this.style.top = -randY + "px";
    }

    this.style.transition = "transform 0.2s ease";
    this.style.transform = "scale(1.2)";
    setTimeout(() => {
        this.style.transform = "scale(1)";
    }, 200);
});

(document.getElementById("welcome-div") as HTMLDivElement).addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const isStillOver = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (isStillOver) {
        this.dispatchEvent(new Event("mouseover"));
    }
});

//╔══════════════════════════════════════╗
//║            GLASSBOX DRAWING          ║
//╚══════════════════════════════════════╝
function setGlassboxSize() {
    glassboxCanvas.width = window.innerWidth;
    glassboxCanvas.height = window.innerHeight;
}

function drawGlassbox(posX: number, posY: number, canvas: HTMLCanvasElement) {
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    let warpLimiter = 2;
    let xOffset = (posX - canvas.width / 2) / warpLimiter;
    let yOffset = (posY - canvas.height / 2) / warpLimiter;
    let centerX = canvas.width / 2 - xOffset;
    let centerY = (canvas.height / 2) * 1.3 - yOffset;

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = lColor;
    ctx.fill();

    let lc = lineWidth / 2; //lineCenter

    function addColorStop(grd: CanvasGradient) {
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
    let grd = ctx.createLinearGradient(0, 0, centerX, centerY);
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
    let dist = 0.2;
    ctx.beginPath();
    ctx.moveTo(centerX * dist, centerY * dist);
    ctx.lineTo((canvas.width * (2 - dist)) / 2 - xOffset * dist, centerY * dist);
    //0.15 = 1.025 0.30 = 1.055 fix scaling, stand in: (1 + 0.17 * dist)
    ctx.lineTo((canvas.width * (2 - dist)) / 2 - xOffset * dist, ((canvas.height * (2 - dist)) / 2) * (1 + 0.17 * dist) - yOffset * dist);
    ctx.lineTo(centerX * dist, ((canvas.height * (2 - dist)) / 2) * (1 + 0.17 * dist) - yOffset * dist);
    ctx.closePath();
    ctx.strokeStyle = dColor;
    ctx.lineWidth = 5;
    ctx.stroke();
}

//╔══════════════════════════════════════╗
//║          NAVIGATION CONTROLS         ║
//╚══════════════════════════════════════╝
function setNavSize() {
    let navWidth = 90;
    navBox.style.flexDirection = "row";

    if (navWidth > 100) navWidth = 100;
    navBox.style.width = navWidth + "%";

    let canvasWidth = Math.floor(navBox.clientWidth / 4) - 1;
    let canvasHeight = 35 + Math.round(window.innerHeight * 0.02);

    for (let i = 0; i < navCanvases.length; i++) {
        let canvas = navCanvases.item(i) as HTMLCanvasElement;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    drawNav(window.innerWidth / 2, window.innerHeight / 2);
}

function positionNav(posX: number) {
    let warpLimiter = 15;
    let xOffset = mobileMode ? 0 : (posX - glassboxCanvas.width / 2) / warpLimiter;

    navBox.style.left = window.innerWidth / 2 - navBox.clientWidth / 2 + xOffset + "px";
}

//Nav Clicks
navCanvases[0].addEventListener("click", function () {
    hideAllContent();
    activePage = 0;
    (document.getElementById("welcome-div") as HTMLDivElement).style.display = "block";
    getCursorPosition({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
});
navCanvases[1].addEventListener("click", function () {
    hideAllContent();
    activePage = 1;
    (document.getElementById("about-div") as HTMLDivElement).style.display = "flex";
    getCursorPosition({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
});
navCanvases[2].addEventListener("click", function () {
    hideAllContent();
    activePage = 2;
    (document.getElementById("portfolio-div") as HTMLDivElement).style.display = "block";
    getCursorPosition({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
});
navCanvases[3].addEventListener("click", function () {
    hideAllContent();
    activePage = 3;
    (document.getElementById("contact-div") as HTMLDivElement).style.display = "flex";
    getCursorPosition({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
});

function hideAllContent() {
    (document.getElementById("welcome-div") as HTMLDivElement).style.display = "none";
    (document.getElementById("about-div") as HTMLDivElement).style.display = "none";
    (document.getElementById("portfolio-div") as HTMLDivElement).style.display = "none";
    (document.getElementById("contact-div") as HTMLDivElement).style.display = "none";
}

function drawNav(posX: number, posY: number) {
    let ctx0 = navCanvases[0].getContext("2d") as CanvasRenderingContext2D,
        ctx1 = navCanvases[1].getContext("2d") as CanvasRenderingContext2D,
        ctx2 = navCanvases[2].getContext("2d") as CanvasRenderingContext2D,
        ctx3 = navCanvases[3].getContext("2d") as CanvasRenderingContext2D;

    let rect = navCanvases[0].getBoundingClientRect(),
        x = posX - rect.left,
        y = posY - rect.top,
        isHovered = ctx0.isPointInPath(x, y);
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

function navBoxVisability(visible: boolean) {
    if (visible) {
        navBox.style.visibility = "visible";
    } else {
        navBox.style.visibility = "hidden";
    }
}

function drawNav0(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(lc, -lc);
    let slopeOffset = (ctx.canvas.height + lc) * (ctx.canvas.width / 200);
    ctx.lineTo(slopeOffset, ctx.canvas.height - lc);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc);
    ctx.lineTo(ctx.canvas.width, 0);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 0) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = 30 * (ctx.canvas.height / 50) - 8;
    ctx.font = fontHeight + "px " + fontName;
    let text = "Home";
    let iconSize = ctx.canvas.height * 0.7;
    let textWidth = ctx.measureText(text).width;
    let iconX = (ctx.canvas.width - (iconSize + textWidth) + slopeOffset / 2) / 2;
    let iconY = (ctx.canvas.height - iconSize) / 2 - 3;

    if (window.innerWidth <= 830) {
        if (homeIcon.complete) {
            ctx.drawImage(homeIcon, (ctx.canvas.width - iconSize) / 2 + 10, iconY, iconSize, iconSize);
        }
    } else {
        if (homeIcon.complete) {
            ctx.drawImage(homeIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + 8;
        ctx.fillText(text, textPosX, fontHeight + 8);
    }
}

function drawNav1(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ctx.canvas.height - lc);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc);
    ctx.lineTo(ctx.canvas.width, 0);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 1) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = 30 * (ctx.canvas.height / 50) - 8;
    ctx.font = fontHeight + "px " + fontName;
    let text = "About";
    let iconSize = ctx.canvas.height * 0.7;
    let textWidth = ctx.measureText(text).width;
    let iconX = (ctx.canvas.width - iconSize - 8 - textWidth) / 2;
    let iconY = (ctx.canvas.height - iconSize) / 2 - 3;

    if (window.innerWidth <= 830) {
        if (aboutIcon.complete) {
            ctx.drawImage(aboutIcon, (ctx.canvas.width - iconSize) / 2, iconY, iconSize, iconSize);
        }
    } else {
        if (aboutIcon.complete) {
            ctx.drawImage(aboutIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + 8;
        ctx.fillText(text, textPosX, fontHeight + 8);
    }
}

function drawNav2(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ctx.canvas.height - lc);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - lc);
    ctx.lineTo(ctx.canvas.width, 0);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 2) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = 30 * (ctx.canvas.height / 50) - 8;
    ctx.font = fontHeight + "px " + fontName;
    let text = "Portfolio";
    let iconSize = ctx.canvas.height * 0.7;
    let textWidth = ctx.measureText(text).width;
    let iconX = (ctx.canvas.width - iconSize - 8 - textWidth) / 2;
    let iconY = (ctx.canvas.height - iconSize) / 2 - 3;

    if (window.innerWidth <= 830) {
        if (portfolioIcon.complete) {
            ctx.drawImage(portfolioIcon, (ctx.canvas.width - iconSize) / 2, iconY, iconSize, iconSize);
        }
    } else {
        if (portfolioIcon.complete) {
            ctx.drawImage(portfolioIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + 8;
        ctx.fillText(text, textPosX, fontHeight + 8);
    }
}

function drawNav3(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ctx.canvas.height - lc);
    let slopeOffset = (ctx.canvas.height + lc) * (ctx.canvas.width / 200);
    ctx.lineTo(ctx.canvas.width - slopeOffset, ctx.canvas.height - lc);
    ctx.lineTo(ctx.canvas.width - lc, -lc);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 3) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = 30 * (ctx.canvas.height / 50) - 8;
    ctx.font = fontHeight + "px " + fontName;
    let text = "Contact";
    let iconSize = ctx.canvas.height * 0.7;
    let textWidth = ctx.measureText(text).width;
    let iconX = (ctx.canvas.width - (iconSize + textWidth)) / 2 - slopeOffset / 2;
    let iconY = (ctx.canvas.height - iconSize) / 2 - 3;

    if (window.innerWidth <= 830) {
        if (contactIcon.complete) {
            ctx.drawImage(contactIcon, (ctx.canvas.width - iconSize) / 2 - 10, iconY, iconSize, iconSize);
        }
    } else {
        if (contactIcon.complete) {
            ctx.drawImage(contactIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + 8;
        ctx.fillText(text, textPosX, fontHeight + 8);
    }
}

/// <reference path="./portfolioGallery.ts" />
/// <reference path="./EmailJS.ts" />
