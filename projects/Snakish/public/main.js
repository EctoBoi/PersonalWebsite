// === GAME DEFAULTS ===
const defaults = {};
defaults.rowSize = 30;
defaults.colSize = 24;
defaults.playerPos = [3, 3];
defaults.snakePos = JSON.stringify([
    [
        [defaults.colSize - 4, defaults.rowSize - 4],
        [defaults.colSize - 4, defaults.rowSize - 5],
        [defaults.colSize - 4, defaults.rowSize - 6],
    ],
    [
        [3, defaults.rowSize - 4],
        [3, defaults.rowSize - 5],
        [3, defaults.rowSize - 6],
    ],
]);

const ROWS = defaults.rowSize;
const COLS = defaults.colSize;

const playerChar = "P";
const snakeHeadChar = "H";
const snakeTailChar = "T";
const tokenChar = "K";
const blankChar = " ";
const wallChar = "W";

// === THREE.JS SETUP ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060614);
scene.fog = new THREE.FogExp2(0x060614, 0.013);

const W = 1100,
    H = 660;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("renderer-container").appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(54, W / H, 0.1, 200);
camera.position.set(ROWS / 2.4, 10, COLS + 10);
camera.lookAt(ROWS / 2 - 1, -6, COLS / 2);

// Very dim ambient — point lights paint with shadow
scene.add(new THREE.AmbientLight(0x080c1a, 0.9));

// Dramatic central overhead — bright middle, dark borders via falloff
const centerLight = new THREE.PointLight(0xfff0d8, 5.0, 30, 1.8);
centerLight.position.set(ROWS / 2, 10, COLS / 2);
scene.add(centerLight);

// Cool subtle fill from front
const rimLight = new THREE.DirectionalLight(0x1a2a55, 0.35);
rimLight.position.set(ROWS / 2, 3, COLS + 12);
scene.add(rimLight);

// Crown spotlight — follows token each frame (scene-space)
const SIN15 = Math.sin((15 * Math.PI) / 180);
const COS15 = Math.cos((15 * Math.PI) / 180);
const crownSpotLight = new THREE.SpotLight(0xffee88, 0, 18, Math.PI / 9, 0.35, 2);
crownSpotLight.visible = false;
scene.add(crownSpotLight);
scene.add(crownSpotLight.target);

// === ARENA GROUP — tilted 15 degrees ===
const arenaGroup = new THREE.Group();
arenaGroup.rotation.x = (15 * Math.PI) / 180;
scene.add(arenaGroup);

// === SHARED MATERIALS ===
const MAT = {
    floorA: new THREE.MeshLambertMaterial({ color: 0x111128 }),
    floorB: new THREE.MeshLambertMaterial({ color: 0x181838 }),
    wall: new THREE.MeshLambertMaterial({ color: 0x3d5080 }),
    robe: new THREE.MeshLambertMaterial({ color: 0x1a55cc }),
    skin: new THREE.MeshLambertMaterial({ color: 0xf4a060 }),
    gold: new THREE.MeshLambertMaterial({ color: 0xffdd00 }),
    darkGold: new THREE.MeshLambertMaterial({ color: 0xcc9900 }),
    ruby: new THREE.MeshLambertMaterial({ color: 0xff2222 }),
    dGreen: new THREE.MeshLambertMaterial({ color: 0x22bb44 }),
    dDark: new THREE.MeshLambertMaterial({ color: 0x117733 }),
    dLight: new THREE.MeshLambertMaterial({ color: 0x55ee77 }),
    orange: new THREE.MeshLambertMaterial({ color: 0xff5500 }),
    amber: new THREE.MeshLambertMaterial({ color: 0xffaa00 }),
    yellow: new THREE.MeshLambertMaterial({ color: 0xffee00 }),
    effect: new THREE.MeshLambertMaterial({ color: 0xff0000 }),
    effOrange: new THREE.MeshLambertMaterial({ color: 0xff6600 }),
    overlay: new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0.35, depthWrite: false }),
};

// === SHARED POOL GEOMETRIES ===
const GEO = {
    floor: new THREE.BoxGeometry(0.94, 0.12, 0.94),
    wall: new THREE.BoxGeometry(0.88, 0.54, 0.88),
    // dragon
    dHead: new THREE.SphereGeometry(0.3, 8, 6),
    dSnout: new THREE.BoxGeometry(0.2, 0.17, 0.24),
    dHorn: new THREE.ConeGeometry(0.06, 0.28, 4),
    // fire
    fBase: new THREE.ConeGeometry(0.36, 0.48, 7),
    fMid: new THREE.ConeGeometry(0.2, 0.68, 6),
    fTip: new THREE.ConeGeometry(0.08, 0.52, 5),
    fLick: new THREE.ConeGeometry(0.12, 0.4, 5),
    // effect
    effect: new THREE.OctahedronGeometry(0.38, 0),
    effCore: new THREE.OctahedronGeometry(0.62, 0),
    effShard: new THREE.OctahedronGeometry(0.24, 0),
};

// helper: mesh with position
function mk(geo, mat, x, y, z) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    return m;
}

// === FLOOR TILES ===
for (let gy = 0; gy < COLS; gy++) {
    for (let gx = 0; gx < ROWS; gx++) {
        arenaGroup.add(mk(GEO.floor, (gx + gy) % 2 === 0 ? MAT.floorA : MAT.floorB, gx, 0, gy));
    }
}

// === STATIC BORDER WALLS ===
for (let y = 0; y < COLS; y++) {
    for (let x = 0; x < ROWS; x++) {
        if (y === 0 || y === COLS - 1 || x === 0 || x === ROWS - 1) {
            arenaGroup.add(mk(GEO.wall, MAT.wall, x, 0.27, y));
        }
    }
}

// === GAME-OVER OVERLAY ===
const gameOverOverlay = new THREE.Mesh(new THREE.PlaneGeometry(ROWS - 2, COLS - 2), MAT.overlay);
gameOverOverlay.rotation.x = -Math.PI / 2;
gameOverOverlay.position.set((ROWS - 1) / 2, 0.6, (COLS - 1) / 2);
gameOverOverlay.visible = false;
arenaGroup.add(gameOverOverlay);

// === CROWN BEAM (moves with token each frame, lives in arenaGroup) ===
const crownBeamGroup = new THREE.Group();
crownBeamGroup.visible = false;
arenaGroup.add(crownBeamGroup);
// Outer wide cone — soft glow (narrow at top, fans out down)
const _beamOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 2.4, 14, 18, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false }),
);
_beamOuter.position.y = 7;
crownBeamGroup.add(_beamOuter);
// Inner narrow core — brighter streak
const _beamInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.35, 14, 8, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfffacc, transparent: true, opacity: 0.11, side: THREE.DoubleSide, depthWrite: false }),
);
_beamInner.position.y = 7;
crownBeamGroup.add(_beamInner);

// === MODEL BUILDERS ===

// Prince / 🤴 (player)
function buildPrince() {
    const g = new THREE.Group();
    // robe
    g.add(mk(new THREE.CylinderGeometry(0.2, 0.27, 0.65, 8), MAT.robe, 0, 0.33, 0));
    // head
    g.add(mk(new THREE.SphereGeometry(0.2, 8, 6), MAT.skin, 0, 0.85, 0));
    // crown band
    g.add(mk(new THREE.CylinderGeometry(0.155, 0.155, 0.09, 8), MAT.gold, 0, 1.1, 0));
    // 3 crown spikes
    for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        g.add(mk(new THREE.ConeGeometry(0.042, 0.17, 4), MAT.gold, Math.cos(a) * 0.1, 1.27, Math.sin(a) * 0.1));
    }
    return g;
}

// Dragon head / 🐉 (snake head)  — shared geometry from GEO
function buildDragon() {
    const g = new THREE.Group();
    const head = mk(GEO.dHead, MAT.dGreen, 0, 0.65, 0);
    head.scale.set(1, 1.35, 1);
    g.add(head);
    g.add(mk(GEO.dSnout, MAT.dDark, 0, 0.55, 0.29));
    const hL = mk(GEO.dHorn, MAT.dLight, -0.2, 1.05, 0);
    hL.rotation.z = -0.32;
    g.add(hL);
    const hR = mk(GEO.dHorn, MAT.dLight, 0.2, 1.05, 0);
    hR.rotation.z = 0.32;
    g.add(hR);
    return g;
}

// Fire / 🔥 (snake tail)
function buildFire() {
    const g = new THREE.Group();
    // Wide orange base
    g.add(mk(GEO.fBase, MAT.orange, 0, 0.24, 0));
    // Amber mid-body
    g.add(mk(GEO.fMid, MAT.amber, 0, 0.46, 0));
    // Bright yellow tip
    g.add(mk(GEO.fTip, MAT.yellow, 0, 0.84, 0));
    // Side licks — angled tongues of flame
    const ll = mk(GEO.fLick, MAT.orange, -0.18, 0.34, 0);
    ll.rotation.z = 0.52;
    g.add(ll);
    const lr = mk(GEO.fLick, MAT.amber, 0.18, 0.32, 0.06);
    lr.rotation.z = -0.52;
    g.add(lr);
    const lb = mk(GEO.fLick, MAT.orange, 0.04, 0.3, -0.16);
    lb.rotation.x = -0.45;
    g.add(lb);
    return g;
}

// Crown / 👑 (token)
function buildCrown() {
    const g = new THREE.Group();
    // base band
    g.add(mk(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 12), MAT.darkGold, 0, 0.14, 0));
    // 5 spikes
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        g.add(mk(new THREE.ConeGeometry(0.07, 0.33, 4), MAT.gold, Math.cos(a) * 0.22, 0.46, Math.sin(a) * 0.22));
    }
    // ruby gem
    g.add(mk(new THREE.SphereGeometry(0.07, 6, 4), MAT.ruby, 0, 0.28, 0.3));
    return g;
}

// Effect burst — explosion shards that spin with the group
function buildEffect() {
    const g = new THREE.Group();
    // Large bright core
    g.add(mk(GEO.effCore, MAT.yellow, 0, 0.55, 0));
    // Cardinal shards — fly outward as group rotates
    g.add(mk(GEO.effShard, MAT.effOrange, 0.72, 0.55, 0));
    g.add(mk(GEO.effShard, MAT.effOrange, -0.72, 0.55, 0));
    g.add(mk(GEO.effShard, MAT.effOrange, 0, 0.55, 0.72));
    g.add(mk(GEO.effShard, MAT.effOrange, 0, 0.55, -0.72));
    // Diagonal upper shards
    g.add(mk(GEO.effShard, MAT.amber, 0.5, 1.0, 0.5));
    g.add(mk(GEO.effShard, MAT.amber, -0.5, 1.0, -0.5));
    // Low shards near ground
    g.add(mk(GEO.effShard, MAT.effect, 0.5, 0.15, -0.5));
    g.add(mk(GEO.effShard, MAT.effect, -0.5, 0.15, 0.5));
    return g;
}

// === ENTITY POOLS ===
const playerGroup = buildPrince();
arenaGroup.add(playerGroup);
playerGroup.visible = false;

const tokenGroup = buildCrown();
arenaGroup.add(tokenGroup);
tokenGroup.visible = false;

const headPool = [];
for (let i = 0; i < 15; i++) {
    const g = buildDragon();
    arenaGroup.add(g);
    g.visible = false;
    headPool.push(g);
}

const tailPool = [];
for (let i = 0; i < 250; i++) {
    const g = buildFire();
    arenaGroup.add(g);
    g.visible = false;
    tailPool.push(g);
}

const effectPool = [];
for (let i = 0; i < 10; i++) {
    const g = buildEffect();
    arenaGroup.add(g);
    g.visible = false;
    effectPool.push(g);
}

// === GAME STATE ===
let autoReset = false;
let gameState = 0;
let gameTick = 0;
let rowSize = defaults.rowSize;
let colSize = defaults.colSize;

let heldDir = [false, false, false, false];

let playerPos = defaults.playerPos;
let snakes = JSON.parse(defaults.snakePos);
let recentBites = [];
let recentDeaths = [];
let tokenPos = [];
let tokensCollected = 0;
let spawnedSnakes = 2;
let mostSnakesAtOnce = 0;
let snakeDeaths = 0;
let matchNum = 1;
let matchHistory = [];

let tickTimer = null;
let board = [];
updateBoard();
drawBoard();

// === GAME FUNCTIONS ===
function reset() {
    clearTimeout(tickTimer);
    gameState = 0;
    gameTick = 0;

    matchHistory.push([matchNum, tokensCollected, snakes.length, snakeDeaths, spawnedSnakes]);
    matchHistory.sort((a, b) => b[1] - a[1]);

    document.getElementById("match-history").innerHTML = "";
    matchHistory.forEach((match) => {
        document.getElementById("match-history").innerHTML +=
            "[" + match[0] + "] \u{1F451}: " + match[1] + " \u{1F409}: " + match[2] + " \u26B0\uFE0F: " + match[3] + " \u{1F95A}: " + match[4] + "<br>";
    });

    rowSize = defaults.rowSize;
    colSize = defaults.colSize;
    playerPos = defaults.playerPos;
    recentBites = [];
    recentDeaths = [];
    tokenPos = [];
    snakes = JSON.parse(defaults.snakePos);
    tokensCollected = 0;
    spawnedSnakes = 2;
    mostSnakesAtOnce = 0;
    snakeDeaths = 0;
    matchNum++;

    document.getElementById("score-board").innerHTML = "";
    updateBoard();
    drawBoard();
    document.getElementById("start-stop").click();
}

function tick() {
    if (tokenPos.length === 0) spawnToken();

    if (gameTick % 1 === 0) {
        if (heldDir[0]) handleStep(playerPos, [playerPos[0] - 1, playerPos[1]]);
        else if (heldDir[1]) handleStep(playerPos, [playerPos[0], playerPos[1] + 1]);
        else if (heldDir[2]) handleStep(playerPos, [playerPos[0] + 1, playerPos[1]]);
        else if (heldDir[3]) handleStep(playerPos, [playerPos[0], playerPos[1] - 1]);
    }

    if (gameTick % 1 === 0) moveSnakes();

    drawBoard();
    updateScoreBoard();

    if (snakes.length > mostSnakesAtOnce) mostSnakesAtOnce = snakes.length;

    gameTick++;
    if (gameState === 1) tickTimer = setTimeout(tick, 50);
    if (gameState === 2) {
        addRecentDeath(playerPos);
        drawBoard();
        updateScoreBoard();
        if (autoReset) {
            document.getElementById("auto-reset-icon").innerHTML = "\u{1F504}";
            setTimeout(() => {
                document.getElementById("auto-reset-icon").innerHTML = "";
                document.getElementById("reset").click();
            }, 2000);
        }
    }
}

function updateScoreBoard() {
    const gameoverTxt = gameState === 2 ? "\u26B0\uFE0FGAME OVER\u26B0\uFE0F<br>" : "";
    document.getElementById("score-board").innerHTML =
        gameoverTxt +
        "Crowns Collected\u{1F451}: " +
        tokensCollected +
        "<br>Active Dragons\u{1F409}: " +
        snakes.length +
        "<br>Dragon Deaths\u26B0\uFE0F: " +
        snakeDeaths +
        "<br>Total Dragons\u{1F95A}: " +
        spawnedSnakes;
}

function updateBoard() {
    const b = [];
    for (let y = 0; y < colSize; y++) {
        b[y] = [];
        for (let x = 0; x < rowSize; x++) {
            if (y === 0 || y === colSize - 1 || x === 0 || x === rowSize - 1) {
                b[y][x] = wallChar;
            } else {
                b[y][x] = blankChar;
            }
            if (gameState === 2) b[y][x] = wallChar;
        }
    }

    b[playerPos[0]][playerPos[1]] = playerChar;
    if (tokenPos.length !== 0) b[tokenPos[0]][tokenPos[1]] = tokenChar;

    for (let si = 0; si < snakes.length; si++) {
        for (let sp = 0; sp < snakes[si].length; sp++) {
            b[snakes[si][sp][0]][snakes[si][sp][1]] = sp === snakes[si].length - 1 ? snakeHeadChar : snakeTailChar;
        }
    }
    board = b;
}

// === THREE.JS DRAW BOARD ===
function drawBoard() {
    const now = Date.now();

    // Hide all dynamic entity models
    playerGroup.visible = false;
    tokenGroup.visible = false;
    crownBeamGroup.visible = false;
    crownSpotLight.visible = false;
    for (const g of headPool) g.visible = false;
    for (const g of tailPool) g.visible = false;
    for (const g of effectPool) g.visible = false;

    gameOverOverlay.visible = gameState === 2;

    let headIdx = 0,
        tailIdx = 0,
        effIdx = 0;

    // Effects first (can appear on any cell)
    const effSet = new Set();
    recentBites.forEach((p) => effSet.add(p[0] * 1000 + p[1]));
    recentDeaths.forEach((p) => effSet.add(p[0] * 1000 + p[1]));
    for (const key of effSet) {
        if (effIdx >= effectPool.length) break;
        const ey = Math.floor(key / 1000);
        const ex = key % 1000;
        const g = effectPool[effIdx++];
        g.visible = true;
        g.position.set(ex, 0, ey);
        g.rotation.y = now * 0.005;
    }

    // Entity models (interior cells only — border is static walls)
    for (let y = 1; y < colSize - 1; y++) {
        for (let x = 1; x < rowSize - 1; x++) {
            const cell = board[y][x];

            if (cell === playerChar) {
                playerGroup.visible = true;
                playerGroup.position.set(x, 0, y);
            } else if (cell === snakeHeadChar) {
                if (headIdx < headPool.length) {
                    const g = headPool[headIdx++];
                    g.visible = true;
                    g.position.set(x, 0, y);
                    g.rotation.y = Math.atan2(playerPos[1] - x, playerPos[0] - y);
                }
            } else if (cell === snakeTailChar) {
                if (tailIdx < tailPool.length) {
                    const g = tailPool[tailIdx++];
                    g.visible = true;
                    g.position.set(x, 0, y);
                    // Sporadic per-cell spin: varying speed, direction, and phase based on position
                    const _spd = 0.0005 + ((x * 3 + y * 5) % 7) * 0.0001;
                    const _dir = (x * 7 + y * 11) % 2 === 0 ? 1 : -1;
                    g.rotation.y = now * _spd * _dir + x * 1.7 + y * 2.3;
                }
            } else if (cell === tokenChar) {
                const tBob = Math.sin(now * 0.0028) * 0.22 + 0.18;
                tokenGroup.visible = true;
                tokenGroup.position.set(x, tBob, y);
                tokenGroup.rotation.y = now * 0.0018;
                // Beam cone fixed at floor level — doesn't bob
                crownBeamGroup.visible = true;
                crownBeamGroup.position.set(x, 0, y);
                // Spotlight in world space at fixed y=0 (account for 15° arena tilt)
                const _wy = -y * SIN15;
                const _wz = y * COS15;
                crownSpotLight.visible = true;
                crownSpotLight.intensity = 14;
                crownSpotLight.position.set(x, _wy + 14 * COS15, _wz + 14 * SIN15);
                crownSpotLight.target.position.set(x, _wy, _wz);
                crownSpotLight.target.updateMatrixWorld();
            }
        }
    }

    renderer.render(scene, camera);
}

// === CONTROLS ===
document.addEventListener("keydown", function (event) {
    if (event.key === "w") heldDir[0] = true;
    if (event.key === "d") heldDir[1] = true;
    if (event.key === "s") heldDir[2] = true;
    if (event.key === "a") heldDir[3] = true;
    if (event.key === "ArrowUp") {
        event.preventDefault();
        heldDir[0] = true;
    }
    if (event.key === "ArrowRight") {
        event.preventDefault();
        heldDir[1] = true;
    }
    if (event.key === "ArrowDown") {
        event.preventDefault();
        heldDir[2] = true;
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        heldDir[3] = true;
    }
    if (event.key === "r" || event.key === "0") document.getElementById("reset").click();
    if (event.key === "Escape") document.getElementById("start-stop").click();
});

document.addEventListener("keyup", function (event) {
    if (event.key === "w") heldDir[0] = false;
    if (event.key === "d") heldDir[1] = false;
    if (event.key === "s") heldDir[2] = false;
    if (event.key === "a") heldDir[3] = false;
    if (event.key === "ArrowUp") {
        event.preventDefault();
        heldDir[0] = false;
    }
    if (event.key === "ArrowRight") {
        event.preventDefault();
        heldDir[1] = false;
    }
    if (event.key === "ArrowDown") {
        event.preventDefault();
        heldDir[2] = false;
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        heldDir[3] = false;
    }
});

document.getElementById("start-stop").addEventListener("click", function () {
    if (gameState === 0) {
        gameState = 1;
        tick();
    } else if (gameState === 1) gameState = 0;
});
document.getElementById("reset").addEventListener("click", function () {
    reset();
});
document.getElementById("auto-reset").addEventListener("click", function () {
    if (autoReset) {
        document.getElementById("auto-reset").innerHTML = "Auto Reset: OFF";
        autoReset = false;
    } else {
        document.getElementById("auto-reset").innerHTML = "Auto Reset: ON";
        autoReset = true;
    }
});

// === GAME LOGIC (unchanged) ===
function handleStep(currentPos, stepPos) {
    if (board[stepPos[0]][stepPos[1]] === blankChar) {
        board[currentPos[0]][currentPos[1]] = blankChar;
        playerPos = stepPos;
        updateBoard();
    } else if (board[stepPos[0]][stepPos[1]] === snakeHeadChar || board[stepPos[0]][stepPos[1]] === snakeTailChar) {
        gameState = 2;
    } else if (board[stepPos[0]][stepPos[1]] === tokenChar) {
        tokensCollected++;
        tokenPos = [];
        elongateSnakes();
    }
}

function moveSnakes() {
    const snakeIndex = Math.floor(Math.random() * snakes.length);
    const currentSnake = snakes[snakeIndex];
    const headPos = currentSnake[currentSnake.length - 1];
    let playerDir = [false, false, false, false];
    if (playerPos[0] < headPos[0]) playerDir[0] = true;
    if (playerPos[1] > headPos[1]) playerDir[1] = true;
    if (playerPos[0] > headPos[0]) playerDir[2] = true;
    if (playerPos[1] < headPos[1]) playerDir[3] = true;

    let validPlayerDirPos = [];

    if (removeNulls(charPosNearby(headPos, playerChar)).length > 0) {
        gameState = 2;
    } else {
        const blankCharPosNearby = charPosNearby(headPos, blankChar);
        for (let i = 0; i < playerDir.length; i++) {
            if (playerDir[i] && blankCharPosNearby[i] !== null) validPlayerDirPos.push(blankCharPosNearby[i]);
        }

        if (validPlayerDirPos.length > 0) {
            shiftSnake(currentSnake, getRandomElement(validPlayerDirPos));
        } else {
            const validBlankPos = removeNulls(charPosNearby(headPos, blankChar));
            const validSnakePos = removeNulls(
                charPosNearby(headPos, snakeTailChar)
                    .filter((pos) => !currentSnake.includes(pos))
                    .concat(charPosNearby(headPos, snakeHeadChar)),
            );

            if (validSnakePos.length > 0 && Math.random() < 0.5) {
                const bitePos = getRandomElement(validSnakePos);
                biteSnake(snakeIndex, bitePos);
                shiftSnake(currentSnake, bitePos);
            } else if (validBlankPos.length > 0) {
                shiftSnake(currentSnake, getRandomElement(validBlankPos));
            }
        }
    }
    updateBoard();

    function biteSnake(bitingSnakeIndex, pos) {
        for (let si = 0; si < snakes.length; si++) {
            if (si !== bitingSnakeIndex) {
                const cs = snakes[si];
                const len = cs.length;
                for (let sp = 0; sp < len; sp++) {
                    if (cs[sp][0] === pos[0] && cs[sp][1] === pos[1]) {
                        if (sp === len - 1) {
                            addRecentDeath(cs[sp]);
                            snakeDeaths++;
                            snakes.splice(si, 1);
                        } else {
                            const newSnake = cs.splice(0, sp);
                            cs.splice(0, 1);
                            if (cs.length < 3) {
                                addRecentDeath(cs[cs.length - 1]);
                                snakeDeaths++;
                                snakes.splice(si, 1);
                            }
                            if (newSnake.length > 5) {
                                snakes.push(newSnake.reverse());
                                spawnedSnakes++;
                            }
                        }
                        if (snakes.length < 2) {
                            const defaultSnakes = JSON.parse(defaults.snakePos);
                            snakes.push(defaultSnakes[Math.floor(Math.random() * defaultSnakes.length)]);
                            spawnedSnakes++;
                        }
                        recentBites.push(pos);
                        setTimeout(() => {
                            recentBites.splice(0, 1);
                        }, 600);
                        sp = 999;
                        si = 999;
                    }
                }
            }
        }
    }

    function shiftSnake(snake, pos) {
        snake.push([pos[0], pos[1]]);
        snake.splice(0, 1);
    }
}

function addRecentDeath(pos) {
    recentDeaths.push(pos);
    setTimeout(() => {
        recentDeaths.splice(0, 1);
    }, 600);
}

function spawnToken() {
    const newTokenPos = [Math.floor(Math.random() * (colSize - 2)) + 1, Math.floor(Math.random() * (rowSize - 2)) + 1];
    if (board[newTokenPos[0]][newTokenPos[1]] === blankChar) {
        tokenPos = newTokenPos;
        updateBoard();
    }
}

function elongateSnakes() {
    for (let loops = 0; loops < 2; loops++) {
        for (let si = 0; si < snakes.length; si++) {
            const tailPos = snakes[si][0];
            const validDirs = removeNulls(charPosNearby(tailPos, blankChar));
            if (validDirs.length > 0) snakes[si].unshift(getRandomElement(validDirs));
        }
    }
    updateBoard();
}

function charPosNearby(pos, char) {
    const n = [null, null, null, null];
    if (board[pos[0] - 1][pos[1]] === char) n[0] = [pos[0] - 1, pos[1]];
    if (board[pos[0]][pos[1] + 1] === char) n[1] = [pos[0], pos[1] + 1];
    if (board[pos[0] + 1][pos[1]] === char) n[2] = [pos[0] + 1, pos[1]];
    if (board[pos[0]][pos[1] - 1] === char) n[3] = [pos[0], pos[1] - 1];
    return n;
}

function removeNulls(arr) {
    return arr.filter((x) => x !== null);
}
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
