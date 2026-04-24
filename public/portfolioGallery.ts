//╔══════════════════════════════════════╗
//║       PORTFOLIO GALLERY SYSTEM       ║
//╚══════════════════════════════════════╝

interface Slide {
    img: string;
    title: string;
    url: string;
    sourceUrl: string;
    description: string;
}

const slides: Slide[] = [
    {
        img: "/imgs/going-once.jpg",
        title: "Going Once",
        url: "https://goingonce.vercel.app",
        sourceUrl: "https://github.com/EctoBoi/going-once",
        description:
            "A multiplayer auction simulator where players buy, sell, and flip items through short-lived bid wars while AI-driven NPCs keep the economy alive. <br><strong>Made using:</strong> Next.js, Prisma, Supabase, and TypeScript",
    },
    {
        img: "/imgs/lithomancy.jpg",
        title: "Lithomancy",
        url: "https://lithomancy.up.railway.app",
        sourceUrl: "https://github.com/EctoBoi/lithomancy",
        description:
            "Browser-based online 1v1 dueling game. Cast spells, concoct potions, and harness charms, a wizardly reimagining of rock paper scissors. <br><strong>Made using:</strong> WebSocket, Tailwind, and TypeScript",
    },
    {
        img: "/imgs/SignMaker.jpg",
        title: "SignMaker",
        url: "https://justinbanton.ca/SignMaker",
        sourceUrl: "https://github.com/EctoBoi/SignMaker",
        description:
            "A tool to create sale signage of various sizes. It can autofill info taken from Cabelas.ca using my CabBPSSearch chrome extension. <br><strong>Made using:</strong> JavaScript, HTML, and CSS",
    },
    {
        img: "/imgs/TaskBoard.jpg",
        title: "TaskBoard",
        url: "",
        sourceUrl: "https://github.com/EctoBoi/TaskBoard",
        description:
            "A shared task board for Hunt: Showdown, allowing multiple players to send their current challenges to a server and have the info simplified and displayed for the whole party. <br><strong>Made using:</strong> C# and TSP Server Library",
    },
    {
        img: "/imgs/Snakish.jpg",
        title: "Snakish",
        url: "https://justinbanton.ca/Snakish",
        sourceUrl: "https://github.com/EctoBoi/Snakish",
        description:
            "A Tron-snake-ish game where you, the prince, must steal as many crowns from the dragons. Careful, the more crowns you grab the more their rage burns. <br><strong>Made using:</strong> JavaScript, HTML Canvas, and CSS",
    },
    {
        img: "/imgs/EmoticonRumble.jpg",
        title: "EmoticonRumble",
        url: "https://justinbanton.ca/EmoticonRumble",
        sourceUrl: "https://github.com/EctoBoi/EmoticonRumble",
        description:
            "Watch emoticon fight with dice roll mechanics, and even become one yourself! <br><strong>Made using:</strong> jQuery, JavaScript, HTML Canvas, and CSS",
    },

    {
        img: "/imgs/OatSoup.jpg",
        title: "OatSoup",
        url: "https://justinbanton.ca/OatSoup",
        sourceUrl: "https://github.com/EctoBoi/OatSoup",
        description:
            "A rhythm game where you have to match color and direction. Generate a random sequence or try Tetris Mode! <br><strong>Made using:</strong> JavaScript, HTML Canvas, and CSS",
    },
    {
        img: "/imgs/ExistingPixelsGenerator.jpg",
        title: "Existing Pixels Generator",
        url: "https://justinbanton.ca/ExistingPixelsGenerator",
        sourceUrl: "https://github.com/EctoBoi/ExistingPixelsGenerator",
        description:
            "Recrates the second image using the pixels from the first. Can also sort an images pixels by intensity. <br><strong>Made using:</strong> jQuery, JavaScript, HTML Canvas, and CSS",
    },
    {
        img: "/imgs/DavigoMaps.jpg",
        title: "Davigo Maps",
        url: "https://mod.io/g/davigo/u/ectoboi",
        sourceUrl: "",
        description: "Custom maps for the VR game Davigo, with over eighty thousand unique downloads. <br><strong>Made using:</strong> Blender and Unity",
    },
    {
        img: "/imgs/MapGen.jpg",
        title: "MapGen",
        url: "https://justinbanton.ca/MapGen",
        sourceUrl: "https://github.com/EctoBoi/MapGen",
        description: "Based off Snakish, it generates a chain of rooms of various sizes. <br><strong>Made using:</strong> JavaScript, HTML Canvas, and CSS",
    },
    {
        img: "/imgs/ThisSiteItself.jpg",
        title: "This Site Itself",
        url: "https://justinbanton.ca/",
        sourceUrl: "https://github.com/EctoBoi/PersonalWebsite",
        description: "Thanks for visiting! <br><strong>Made using:</strong> TypeScript, Node.js, Express, HTML, and CSS",
    },
];

let currentPage = 0;

const slideshowEl = document.getElementById("slideshow") as HTMLDivElement;
const dotsEl = document.getElementById("dots") as HTMLDivElement;
const detailViewEl = document.getElementById("detail-view") as HTMLDivElement;

function renderSlides() {
    let itemsPerPage = window.innerWidth < window.innerHeight ? 2 : 4;

    slideshowEl.innerHTML = "";
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageSlides = slides.slice(start, end);

    pageSlides.forEach((slide) => {
        const div = document.createElement("div");
        div.className = "slide-item";

        const img = document.createElement("img");
        img.src = slide.img;
        img.alt = slide.title;
        img.addEventListener("click", () => showDetail(slide));

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.textContent = slide.title;

        div.appendChild(img);
        div.appendChild(caption);
        slideshowEl.appendChild(div);
    });

    renderDots(itemsPerPage);
}

function renderDots(itemsPerPage: number) {
    dotsEl.innerHTML = "";
    const pageCount = Math.ceil(slides.length / itemsPerPage);
    for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === currentPage ? " active" : "");
        dot.addEventListener("click", () => {
            currentPage = i;
            renderSlides();
        });
        dotsEl.appendChild(dot);
    }
}

function showDetail(slide: Slide) {
    slideshowEl.classList.add("hidden");
    dotsEl.classList.add("hidden");

    detailViewEl.innerHTML = `
    <div class="detail-content">
      <div class="detail-image">
        <img id="detail-img" src="${slide.img}" alt="${slide.title}">
      </div>
      <div class="detail-info">
        <h2>${slide.title}</h2>
        <p>${slide.description}</p>
        ${slide.url ? `<a href="${slide.url}" target="_blank">View Project</a> <br>` : ""}
        ${slide.sourceUrl ? `<a href="${slide.sourceUrl}" target="_blank">View Source Code</a> <br>` : ""}
        <button id="backBtn">Back to Portfolio</button>
      </div>
    </div>
  `;

    const detailImg = document.getElementById("detail-img") as HTMLImageElement;
    if (slide.url) {
        detailImg.style.cursor = "pointer";
        detailImg.addEventListener("click", () => {
            window.open(slide.url, "_blank");
        });
    }

    detailViewEl.classList.remove("hidden");

    const backBtn = document.getElementById("backBtn") as HTMLButtonElement;
    backBtn.addEventListener("click", () => {
        detailViewEl.classList.add("hidden");
        slideshowEl.classList.remove("hidden");
        dotsEl.classList.remove("hidden");
    });

    const portfolioDiv = document.getElementById("portfolio-div") as HTMLElement | null;
    if (portfolioDiv) {
        const onOutsideClick = (e: Event) => {
            if (detailViewEl.classList.contains("hidden")) return;

            const path: EventTarget[] = typeof (e as any).composedPath === "function" ? (e as any).composedPath() : (e as any).path || [];

            const targetNode = (e.target as Node) || (path.length ? (path[0] as Node) : null);

            const clickedInside =
                (targetNode && (portfolioDiv.contains(targetNode) || detailViewEl.contains(targetNode))) ||
                path.some((p) => p === portfolioDiv || p === detailViewEl);

            if (!clickedInside) {
                backBtn.click();
            }
        };

        document.addEventListener("pointerdown", onOutsideClick, {
            passive: true,
        });

        backBtn.addEventListener(
            "click",
            () => {
                document.removeEventListener("pointerdown", onOutsideClick);
            },
            { once: true },
        );
    }
}

renderSlides();
