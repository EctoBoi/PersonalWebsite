let glassboxCanvas: HTMLCanvasElement;
let navCanvases: HTMLCollectionOf<HTMLCanvasElement>;
let navBox: HTMLDivElement;
let viewportRef: HTMLDivElement;

// Set actual pixel dimensions
let dpr = window.devicePixelRatio || 1;
let ctx: CanvasRenderingContext2D;
let cWidth = window.innerWidth;
let cHeight = window.innerHeight;

let navButtonWidth: number;
let navButtonHeight: number;
let navBoxWidth: number;
let lineWidth = 0;
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
let contactIcon = new Image();
let aboutIcon = new Image();
let portfolioIcon = new Image();

function isTouchDevice(): boolean {
    // Check if device doesn't support hover
    return !window.matchMedia("(hover:hover)").matches || !window.matchMedia("(pointer:fine)").matches;
}
let mobileMode = isTouchDevice();

function resize() {
    mobileMode = isTouchDevice();

    setGlassboxSize();
    setNavSize();
    repositionFromMouse(null);

    currentPage = 0;
    renderSlides();
}

window.addEventListener("DOMContentLoaded", () => {
    glassboxCanvas = document.getElementById("glassbox-canvas") as HTMLCanvasElement;
    navCanvases = (document.getElementById("nav-box-div") as HTMLDivElement).children as HTMLCollectionOf<HTMLCanvasElement>;
    navBox = document.getElementById("nav-box-div") as HTMLDivElement;
    ctx = glassboxCanvas.getContext("2d") as CanvasRenderingContext2D;
    viewportRef = document.getElementById("viewport-ref") as HTMLDivElement;

    homeIcon.src = "/imgs/HomeIcon.png";
    homeIcon.onload = () => drawNav(viewportRef.clientWidth / 2, viewportRef.clientHeight / 2);
    contactIcon.src = "/imgs/ContactIcon.png";
    contactIcon.onload = () => drawNav(viewportRef.clientWidth / 2, viewportRef.clientHeight / 2);
    aboutIcon.src = "/imgs/AboutIcon.png";
    aboutIcon.onload = () => drawNav(viewportRef.clientWidth / 2, viewportRef.clientHeight / 2);
    portfolioIcon.src = "/imgs/PortfolioIcon.png";
    portfolioIcon.onload = () => drawNav(viewportRef.clientWidth / 2, viewportRef.clientHeight / 2);

    resize();

    window.addEventListener(
        "resize",
        function () {
            resize();
        },
        true,
    );

    const resizeObserver = new ResizeObserver(() => {
        dpr = window.devicePixelRatio || 1;
        resize();
    });

    resizeObserver.observe(glassboxCanvas);

    document.body.addEventListener("mousemove", (e) => {
        repositionFromMouse(e);
    });

    document.body.addEventListener(
        "touchmove",
        (e) => {
            let posX = e.touches[0].clientX;
            let posY = e.touches[0].clientY;
            lastPosX = posX;
            lastPosY = posY;
            drawGlassbox(posX, posY, glassboxCanvas);
            drawNav(posX, posY);
            positionContent(posX, posY);
            positionNav(posX);
        },
        false,
    );

    navCanvases[0].addEventListener("click", function () {
        hideAllContent();
        activePage = 0;
        let welcomeDiv = document.getElementById("welcome-div") as HTMLDivElement;
        welcomeDiv.style.display = "block";
        repositionFromMouse({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
        welcomeDiv.dispatchEvent(new Event("mouseover"));
    });
    navCanvases[1].addEventListener("click", function () {
        hideAllContent();
        activePage = 1;
        (document.getElementById("about-div") as HTMLDivElement).style.display = "flex";
        repositionFromMouse({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
    });
    navCanvases[2].addEventListener("click", function () {
        hideAllContent();
        activePage = 2;
        (document.getElementById("portfolio-div") as HTMLDivElement).style.display = "block";
        repositionFromMouse({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
    });
    navCanvases[3].addEventListener("click", function () {
        hideAllContent();
        activePage = 3;
        (document.getElementById("contact-div") as HTMLDivElement).style.display = "flex";
        repositionFromMouse({ clientX: lastPosX, clientY: lastPosY } as MouseEvent);
    });

    (document.getElementById("welcome-div") as HTMLDivElement).addEventListener("mouseover", function () {
        let glassboxContent = document.getElementById("glassbox-content-div") as HTMLDivElement;
        let randX = Math.floor(Math.random() * (glassboxContent.clientWidth * 0.35));
        let randY = Math.floor(Math.random() * (glassboxContent.clientHeight * 0.35));

        const maxOffsetX = Math.max(0, (glassboxContent.clientWidth - this.clientWidth) / 2);
        const maxOffsetY = Math.max(0, (glassboxContent.clientHeight - this.clientHeight) / 2);
        let targetLeft = (Math.random() < 0.5 ? randX : -randX);
        let targetTop = (Math.random() < 0.5 ? randY : -randY);

        this.style.left = Math.max(-maxOffsetX, Math.min(maxOffsetX, targetLeft)) + "px";
        this.style.top = Math.max(-maxOffsetY, Math.min(maxOffsetY, targetTop)) + "px";

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
});

function repositionFromMouse(e: MouseEvent | null) {
    let posX: number;
    let posY: number;
    if (e) {
        posX = e.clientX;
        posY = e.clientY;
    } else {
        posX = cWidth / 2;
        posY = cHeight / 2;
    }
    lastPosX = posX;
    lastPosY = posY;

    drawGlassbox(posX, posY, glassboxCanvas);
    drawNav(posX, posY);
    positionContent(posX, posY);
    positionNav(posX);
}

//╔══════════════════════════════════════╗
//║           CONTENT POSITIONING        ║
//╚══════════════════════════════════════╝
function positionContent(posX: number, posY: number) {
    let glassboxContent = document.getElementById("glassbox-content-div") as HTMLDivElement;
    let contentSize = 0.9;
    let warpLimiter = 15;
    let xOffset = mobileMode ? 0 : (posX - cWidth / 2) / warpLimiter;
    let yOffset = mobileMode ? 0 : (posY - cHeight / 2) / warpLimiter;

    glassboxContent.style.width = cWidth * contentSize + "px";
    glassboxContent.style.height = cHeight * contentSize + "px";
    glassboxContent.style.left = ((1 - contentSize) * cWidth) / 2 + xOffset + "px";
    glassboxContent.style.top = ((1 - contentSize) * cHeight) / 2 + yOffset + "px";
}

//╔══════════════════════════════════════╗
//║            GLASSBOX DRAWING          ║
//╚══════════════════════════════════════╝
function setGlassboxSize() {
    cWidth = viewportRef.clientWidth;
    cHeight = viewportRef.clientHeight;
    navBoxWidth = cWidth * 0.9;

    glassboxCanvas.width = cWidth * dpr;
    glassboxCanvas.height = cHeight * dpr;

    glassboxCanvas.style.width = cWidth + "px";
    glassboxCanvas.style.height = cHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawGlassbox(posX: number, posY: number, canvas: HTMLCanvasElement) {
    let warpLimiter = 2;
    let xOffset = (posX - cWidth / 2) / warpLimiter;
    let yOffset = (posY - cHeight / 2) / warpLimiter;
    let centerX = cWidth / 2 - xOffset;
    let centerY = (cHeight / 2) * 1.3 - yOffset;

    ctx.beginPath();
    ctx.rect(0, 0, cWidth, cHeight);
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
    ctx.moveTo(cWidth - lc, -lc);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(cWidth + lc, +lc);
    grd = ctx.createLinearGradient(cWidth, 0, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();

    /*
    //floor for hallway look
     ctx.beginPath()
     ctx.moveTo(-lc, cHeight-lc)
     ctx.lineTo(centerX, centerY)
     ctx.lineTo(cWidth+lc, cHeight-lc)
     grd = ctx.createLinearGradient(cWidth/2, cHeight, cWidth/2, centerY)
     grd.addColorStop(0, dColor)
     grd.addColorStop(0.4, dColor)
     grd.addColorStop(0.8, lColor)
     grd.addColorStop(1, lColor)
     ctx.fillStyle = grd
     ctx.fill()
     */

    ctx.beginPath();
    ctx.moveTo(cWidth + lc, cHeight - lc);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(cWidth - lc, cHeight + lc);
    grd = ctx.createLinearGradient(cWidth, cHeight, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(lc, cHeight + lc);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(-lc, cHeight - lc);
    grd = ctx.createLinearGradient(0, cHeight, centerX, centerY);
    addColorStop(grd);
    ctx.fillStyle = grd;
    ctx.fill();

    //back rectangle
    let dist = 0.2;
    ctx.beginPath();
    ctx.moveTo(centerX * dist, centerY * dist);
    ctx.lineTo((cWidth * (2 - dist)) / 2 - xOffset * dist, centerY * dist);
    //0.15 = 1.025 0.30 = 1.055 fix scaling, stand in: (1 + 0.17 * dist)
    ctx.lineTo((cWidth * (2 - dist)) / 2 - xOffset * dist, ((cHeight * (2 - dist)) / 2) * (1 + 0.17 * dist) - yOffset * dist);
    ctx.lineTo(centerX * dist, ((cHeight * (2 - dist)) / 2) * (1 + 0.17 * dist) - yOffset * dist);
    ctx.closePath();
    ctx.strokeStyle = dColor;
    ctx.lineWidth = 5;
    ctx.stroke();
}

//╔══════════════════════════════════════╗
//║          NAVIGATION CONTROLS         ║
//╚══════════════════════════════════════╝
function setNavSize() {
    navBoxWidth = viewportRef.clientWidth * 0.9;
    navButtonWidth = Math.floor(navBoxWidth / 4) - 1;
    navButtonHeight = Math.round(Math.max(48, viewportRef.clientHeight * 0.06));
    lineWidth = Math.max(3, Math.round(navButtonHeight * 0.08));

    for (let i = 0; i < navCanvases.length; i++) {
        let canvas = navCanvases.item(i) as HTMLCanvasElement;

        canvas.width = navButtonWidth * dpr;
        canvas.height = navButtonHeight * dpr;

        canvas.style.width = navButtonWidth + "px";
        canvas.style.height = navButtonHeight + "px";

        const ctx = canvas.getContext("2d")!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    drawNav(viewportRef.clientWidth / 2, viewportRef.clientHeight / 2);
}

function positionNav(posX: number) {
    let warpLimiter = 15;
    let xOffset = mobileMode ? 0 : (posX - cWidth / 2) / warpLimiter;

    navBox.style.left = viewportRef.clientWidth / 2 - navBoxWidth / 2 + xOffset + "px";
}

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

let hideNavText = false;

function drawNav0(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, navButtonWidth, navButtonHeight);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(lc, -lc);
    let slopeOffset = navButtonWidth * 0.3;
    ctx.lineTo(slopeOffset, navButtonHeight - lc);
    ctx.lineTo(navButtonWidth, navButtonHeight - lc);
    ctx.lineTo(navButtonWidth, 0);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 0) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = Math.max(12, Math.round(navButtonHeight * 0.4));
    ctx.font = fontHeight + "px " + fontName;
    let text = "Home";
    let iconSize = navButtonHeight * 0.6;
    let textWidth = ctx.measureText(text).width;
    let gap = navButtonWidth * 0.04;

    let iconX = navButtonWidth / 2 - (iconSize + textWidth + gap) / 2 + slopeOffset / 3;
    let iconY = navButtonHeight / 2 - iconSize / 2 - lc;

    if (hideNavText) {
        if (homeIcon.complete) {
            ctx.drawImage(homeIcon, (navButtonWidth - iconSize) / 2 + slopeOffset / 3, iconY, iconSize, iconSize);
        }
    } else {
        if (homeIcon.complete) {
            ctx.drawImage(homeIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + gap;
        ctx.fillText(text, textPosX, navButtonHeight / 2 + fontHeight / 2 - lineWidth);
    }
}

function drawNav1(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, navButtonWidth, navButtonHeight);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, navButtonHeight - lc);
    ctx.lineTo(navButtonWidth, navButtonHeight - lc);
    ctx.lineTo(navButtonWidth, 0);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 1) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = Math.max(12, Math.round(navButtonHeight * 0.4));
    ctx.font = fontHeight + "px " + fontName;
    let text = "About";
    let iconSize = navButtonHeight * 0.6;
    let textWidth = ctx.measureText(text).width;
    let gap = navButtonWidth * 0.04;

    let iconX = navButtonWidth / 2 - (iconSize + textWidth + gap) / 2;
    let iconY = navButtonHeight / 2 - iconSize / 2 - lc;

    if (hideNavText) {
        if (aboutIcon.complete) {
            ctx.drawImage(aboutIcon, (navButtonWidth - iconSize) / 2, iconY, iconSize, iconSize);
        }
    } else {
        if (aboutIcon.complete) {
            ctx.drawImage(aboutIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + gap;
        ctx.fillText(text, textPosX, navButtonHeight / 2 + fontHeight / 2 - lineWidth);
    }
}

function drawNav2(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, navButtonWidth, navButtonHeight);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, navButtonHeight - lc);
    ctx.lineTo(navButtonWidth, navButtonHeight - lc);
    ctx.lineTo(navButtonWidth, 0);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 2) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = Math.max(12, Math.round(navButtonHeight * 0.4));
    ctx.font = fontHeight + "px " + fontName;
    let text = "Portfolio";
    let iconSize = navButtonHeight * 0.6;
    let textWidth = ctx.measureText(text).width;
    let gap = navButtonWidth * 0.04;

    let iconX = navButtonWidth / 2 - (iconSize + textWidth + gap) / 2;
    let iconY = navButtonHeight / 2 - iconSize / 2 - lc;

    if (hideNavText) {
        if (portfolioIcon.complete) {
            ctx.drawImage(portfolioIcon, (navButtonWidth - iconSize) / 2, iconY, iconSize, iconSize);
        }
    } else {
        if (portfolioIcon.complete) {
            ctx.drawImage(portfolioIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + gap;
        ctx.fillText(text, textPosX, navButtonHeight / 2 + fontHeight / 2 - lineWidth);
    }
}

function drawNav3(ctx: CanvasRenderingContext2D, isHovered: boolean) {
    ctx.clearRect(0, 0, navButtonWidth, navButtonHeight);
    let lc = lineWidth / 2; //lineCenter

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, navButtonHeight - lc);
    let slopeOffset = navButtonWidth * 0.3;
    ctx.lineTo(navButtonWidth - slopeOffset, navButtonHeight - lc);
    ctx.lineTo(navButtonWidth - lc, -lc);

    ctx.strokeStyle = dColor;
    ctx.lineWidth = lineWidth;
    if (activePage === 3) ctx.fillStyle = lColorActivePage;
    else ctx.fillStyle = isHovered ? lColorHover : lColor;
    ctx.fill();
    ctx.stroke();

    let fontHeight = Math.max(12, Math.round(navButtonHeight * 0.4));
    ctx.font = fontHeight + "px " + fontName;
    let text = "Contact";
    let iconSize = navButtonHeight * 0.6;
    let textWidth = ctx.measureText(text).width;
    let gap = navButtonWidth * 0.04;

    let iconX = navButtonWidth / 2 - (iconSize + textWidth + gap) / 2 - slopeOffset / 3;
    let iconY = navButtonHeight / 2 - iconSize / 2 - lc;

    if (iconSize + textWidth + gap + slopeOffset > navButtonWidth) {
        hideNavText = true;
        if (contactIcon.complete) {
            ctx.drawImage(contactIcon, (navButtonWidth - iconSize) / 2 - slopeOffset / 3, iconY, iconSize, iconSize);
        }
    } else {
        hideNavText = false;
        if (contactIcon.complete) {
            ctx.drawImage(contactIcon, iconX, iconY, iconSize, iconSize);
        }
        ctx.fillStyle = fontColor;
        let textPosX = iconX + iconSize + gap;
        ctx.fillText(text, textPosX, navButtonHeight / 2 + fontHeight / 2 - lineWidth);
    }
}

/// <reference path="./portfolioGallery.ts" />
/// <reference path="./EmailJS.ts" />
