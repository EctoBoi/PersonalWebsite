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
let lastResizeWidth = 0;

// ── Mobile dust particle system ──────────────────────────────────────────────
interface DustParticle {
    baseX: number;
    baseY: number;
    x: number;
    y: number;
    offsetX: number; // tap-push displacement
    offsetY: number;
    radius: number;
    alpha: number;
    wobblePhase: number;
    wobbleSpeed: number;
    wobbleAmp: number;
}

let dustParticles: DustParticle[] = [];
let dustAnimFrame: number | null = null;
let dustLastScrollY = 0;
let dustScrollOffset = 0; // accumulated Y lag from scrolling

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

    if (mobileMode && viewportRef && viewportRef.clientWidth === lastResizeWidth) {
        return;
    }
    lastResizeWidth = viewportRef ? viewportRef.clientWidth : 0;

    setGlassboxSize();
    setNavSize();

    startDustAnimation();
    if (mobileMode) {
        positionContent(cWidth / 2, cHeight / 2);
        positionNav(cWidth / 2);
    } else {
        positionContent(lastPosX || cWidth / 2, lastPosY || cHeight / 2);
        positionNav(lastPosX || cWidth / 2);
    }

    currentPage = 0;
    renderSlides();
}

window.addEventListener("DOMContentLoaded", () => {
    glassboxCanvas = document.getElementById("glassbox-canvas") as HTMLCanvasElement;
    navCanvases = (document.getElementById("nav-box-div") as HTMLDivElement).getElementsByTagName("canvas") as HTMLCollectionOf<HTMLCanvasElement>;
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

    document.body.addEventListener("click", (e) => {
        if (!mobileMode && dustParticles.length > 0) {
            applyDustTap(e.clientX, e.clientY);
        }
    });

    document.body.addEventListener(
        "touchstart",
        (e) => {
            if (mobileMode && dustParticles.length > 0) {
                applyDustTap(e.touches[0].clientX, e.touches[0].clientY);
            }
        },
        { passive: true },
    );

    document.body.addEventListener(
        "touchmove",
        (e) => {
            let posX = e.touches[0].clientX;
            let posY = e.touches[0].clientY;
            lastPosX = posX;
            lastPosY = posY;
            drawNav(posX, posY);
            positionContent(posX, posY);
            positionNav(posX);
        },
        false,
    );

    navCanvases[0].addEventListener("click", function () {
        activePage = 0;
        document.getElementById("section-home")!.scrollIntoView({ behavior: "smooth", block: "start" });
        drawNav(lastPosX, lastPosY);
    });
    navCanvases[1].addEventListener("click", function () {
        activePage = 1;
        document.getElementById("section-about")!.scrollIntoView({ behavior: "smooth", block: "start" });
        drawNav(lastPosX, lastPosY);
    });
    navCanvases[2].addEventListener("click", function () {
        activePage = 2;
        document.getElementById("section-portfolio")!.scrollIntoView({ behavior: "smooth", block: "start" });
        drawNav(lastPosX, lastPosY);
    });
    navCanvases[3].addEventListener("click", function () {
        activePage = 3;
        document.getElementById("section-contact")!.scrollIntoView({ behavior: "smooth", block: "start" });
        drawNav(lastPosX, lastPosY);
    });

    // Update active nav as user scrolls through sections
    const glassboxContent = document.getElementById("glassbox-content-div") as HTMLDivElement;
    const sectionPageMap: Record<string, number> = {
        "section-home": 0,
        "section-about": 1,
        "section-portfolio": 2,
        "section-contact": 3,
    };
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activePage = sectionPageMap[entry.target.id];
                    drawNav(lastPosX, lastPosY);
                }
            });
        },
        { root: null, threshold: 0.3 },
    );
    ["section-home", "section-about", "section-portfolio", "section-contact"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    (document.getElementById("welcome-div") as HTMLDivElement).addEventListener("mouseover", function () {
        let section = document.getElementById("section-home") as HTMLDivElement;
        let randX = Math.floor(Math.random() * (section.clientWidth * 0.35));
        let randY = Math.floor(Math.random() * (section.clientHeight * 0.35));

        const maxOffsetX = Math.max(0, (section.clientWidth - this.clientWidth) / 2);
        const maxOffsetY = Math.max(0, (section.clientHeight - this.clientHeight) / 2);
        let targetLeft = Math.random() < 0.5 ? randX : -randX;
        let targetTop = Math.random() < 0.5 ? randY : -randY;

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
    glassboxContent.style.transform = "translateX(" + xOffset + "px) translateY(" + yOffset + "px)";

    // Reserve space under the nav bar so sections align correctly when scrolled to
    const navPad = navButtonHeight + "px";
    glassboxContent.style.paddingTop = navPad;
    document.documentElement.style.setProperty("--nav-height", navPad);
}

//╔══════════════════════════════════════╗
//║        MOBILE DUST PARTICLES         ║
//╚══════════════════════════════════════╝
function initDustParticles() {
    dustParticles = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
        const x = cWidth * 0.05 + Math.random() * cWidth * 0.9;
        const y = cHeight * 0.05 + Math.random() * cHeight * 0.9;
        const depth = 0.1 + Math.random() * 0.8;
        dustParticles.push({
            baseX: x,
            baseY: y,
            x,
            y,
            offsetX: 0,
            offsetY: 0,
            radius: depth * 3 + 1,
            alpha: depth,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.0012 + Math.random() * 0.0018,
            wobbleAmp: 1 + Math.random() * 100,
        });
    }
    dustLastScrollY = window.scrollY;
    dustScrollOffset = 0;
}

function startDustAnimation() {
    stopDustAnimation();
    initDustParticles();
    dustAnimFrame = requestAnimationFrame(dustLoop);
}

function stopDustAnimation() {
    if (dustAnimFrame !== null) {
        cancelAnimationFrame(dustAnimFrame);
        dustAnimFrame = null;
    }
}

function dustLoop() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - dustLastScrollY;
    dustLastScrollY = currentScrollY;

    // Accumulate scroll lag then slowly decay it back to 0
    dustScrollOffset += scrollDelta * -0.5;
    dustScrollOffset *= 0.965; // bleeds off gradually each frame

    // Lerp factor: how fast particles chase their target
    const lerp = 0.01;

    for (const p of dustParticles) {
        // Decay tap-push offset the same way scroll offset decays
        p.offsetX *= 0.965;
        p.offsetY *= 0.965;

        p.wobblePhase += p.wobbleSpeed;
        const wobbleX = Math.sin(p.wobblePhase) * p.wobbleAmp;
        const wobbleY = Math.cos(p.wobblePhase * 0.63) * p.wobbleAmp * 0.6;

        // Desktop: gently repel particles near the cursor
        let hoverOffX = 0;
        let hoverOffY = 0;
        if (!mobileMode) {
            const mdx = p.baseX + wobbleX - lastPosX;
            const mdy = p.baseY + wobbleY - lastPosY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            const repelRadius = 110;
            if (mdist < repelRadius && mdist > 0) {
                const strength = (1 - mdist / repelRadius) * 45;
                hoverOffX = (mdx / mdist) * strength;
                hoverOffY = (mdy / mdist) * strength;
            }
        }

        // Desktop: parallax shift based on cursor distance from centre
        const cursorOffX = mobileMode ? 0 : (lastPosX - cWidth / 2) / 15;
        const cursorOffY = mobileMode ? 0 : (lastPosY - cHeight / 2) / 15;

        // Target is base position + wobble drift + scroll lag + tap push + hover repel + cursor parallax
        const targetX = p.baseX + wobbleX + p.offsetX + hoverOffX + cursorOffX;
        const targetY = p.baseY + wobbleY + dustScrollOffset + p.offsetY + hoverOffY + cursorOffY;

        // Pure lerp — smooth catch-up, zero bounce
        p.x += (targetX - p.x) * lerp;
        p.y += (targetY - p.y) * lerp;
    }

    drawDustCanvas();
    dustAnimFrame = requestAnimationFrame(dustLoop);
}

function applyDustTap(tapX: number, tapY: number) {
    const impactRadius = 140;
    const maxPush = 500;
    for (const p of dustParticles) {
        const dx = p.baseX - tapX;
        const dy = p.baseY - tapY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < impactRadius && dist > 0) {
            const strength = (1 - dist / impactRadius) * maxPush;
            p.offsetX += (dx / dist) * strength;
            p.offsetY += (dy / dist) * strength;
        }
    }
}

function drawDustCanvas() {
    // Desktop uses cursor position; mobile uses screen centre
    const gbX = mobileMode ? cWidth / 2 : lastPosX;
    const gbY = mobileMode ? cHeight / 2 : lastPosY;
    drawGlassbox(gbX, gbY, glassboxCanvas);

    // Overlay blurry dust specks using radial gradients
    for (const p of dustParticles) {
        const r = p.radius * 3.5;
        const grad = ctx.createRadialGradient(p.x, p.y, r * 0.4, p.x, p.y, r);
        grad.addColorStop(0, `rgba(78, 88, 100, ${p.alpha})`);
        grad.addColorStop(0.45, `rgba(78, 88, 100, ${p.alpha * 0.35})`);
        grad.addColorStop(1, `rgba(78, 88, 100, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
    }
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

    const backdrop = document.getElementById("nav-backdrop") as HTMLDivElement;
    backdrop.style.left = navButtonWidth / 2 + "px";
    backdrop.style.width = navButtonWidth * 3 + "px";
    backdrop.style.height = navButtonHeight + "px";

    drawNav(viewportRef.clientWidth / 2, viewportRef.clientHeight / 2);
}

function positionNav(posX: number) {
    let warpLimiter = 15;
    let xOffset = mobileMode ? 0 : (posX - cWidth / 2) / warpLimiter;

    navBox.style.left = viewportRef.clientWidth / 2 - navBoxWidth / 2 + xOffset + "px";
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
