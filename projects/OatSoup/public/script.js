const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
const radius = 100;
const steps = 360;
const step = (2 * Math.PI) / steps;

function setCanvasSize() {
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.75;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

setCanvasSize();

window.addEventListener("resize", function () {
    setCanvasSize();
});

let running = true;
let restartTimer = null;
let startTime = 0;
let lastNote = false;
let songMode = false;

let message = "";
let showMessage = false;
let showMessageTimer = null;
let hit = 0; // 0 soso 1 noice
let showHit = false;
let showHitTimer = false;

let score = 0;
let scoreLetter = "";
let levelName = "";
let misses = 0;
let sosos = 0;
let noices = 0;

/*
//old difficulties
const easyNoteLengths = [800, 1000, 900, 700, 900, 700, 1000, 800, 1100]
const easyNoteDirections = [0, 1, 2, 0, 2, 0, 1, 2, 0]
const mediumNoteLengths = [600, 700, 600, 500, 600, 500, 550, 600, 500, 700]
const mediumNoteDirections = [0, 1, 2, 0, 1, 2, 0, 1, 0, 0]
const hardNoteLengths = [400, 300, 400, 400, 250, 300, 400, 250, 400, 300, 500, 350]
const hardNoteDirections = [0, 1, 2, 0, 1, 2, 0, 2, 1, 0, 1, 1]
*/

let noteLengths = [600, 700, 600, 500, 600, 500, 550, 600, 500, 700];
let noteDirections = [0, 1, 2, 0, 1, 2, 0, 1, 0, 0];
let noteHz = [];
let notePath = [];
// 0 clockwise blue 1 counterclockwise red 2 swap green

let currentNote = -1;
let notePos = [-10, -10];
let lastNotePos = [-10, -10];
let noteTheta = 0;
let noteTime = 0;

let anchorPos = [centerX, centerY];
let activePos = [centerX + radius, centerY];
let activeTheta = 0;
let activeStep = 0;
let activeMoveSteps = 60;
let activeStepNum = 0;
let currentActiveTimer = null;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Hit
    if (showHit) {
        let size = 8; //radius division
        if (hit === 0) {
            size = 5;
        }
        if (hit === 1) {
            size = 4;

            ctx.beginPath();
            ctx.arc(
                lastNotePos[0],
                lastNotePos[1],
                radius / size + 4,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
                lastNotePos[0],
                lastNotePos[1],
                radius / size + 2,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = "white";
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(lastNotePos[0], lastNotePos[1], radius / size, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
            lastNotePos[0],
            lastNotePos[1],
            radius / size - 2,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = "white";
        ctx.fill();
    }

    //Note Path
    if (lastNote) {
        ctx.beginPath();
        ctx.moveTo(notePath[0][0], notePath[0][1]);
        for (let i = 1; i < notePath.length; i++) {
            ctx.lineTo(notePath[i][0], notePath[i][1]);
        }
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    //Line
    ctx.beginPath();
    ctx.moveTo(anchorPos[0], anchorPos[1]);
    ctx.lineTo(activePos[0], activePos[1]);
    ctx.lineWidth = 24;
    if (noteDirections[currentNote] === 0) ctx.strokeStyle = "blue";
    if (noteDirections[currentNote] === 1) ctx.strokeStyle = "red";
    if (noteDirections[currentNote] === 2) ctx.strokeStyle = "green";
    if (noteDirections[currentNote] === undefined) ctx.strokeStyle = "black";
    ctx.stroke();

    //Anchor
    ctx.beginPath();
    ctx.arc(anchorPos[0], anchorPos[1], radius / 8, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(anchorPos[0], anchorPos[1], radius / 16, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    //Active
    ctx.beginPath();
    ctx.arc(activePos[0], activePos[1], radius / 8, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(activePos[0], activePos[1], radius / 8, 0, 2 * Math.PI);
    if (noteDirections[currentNote] === 0) ctx.strokeStyle = "blue";
    if (noteDirections[currentNote] === 1) ctx.strokeStyle = "red";
    if (noteDirections[currentNote] === 2) ctx.strokeStyle = "green";
    if (noteDirections[currentNote] === undefined) ctx.strokeStyle = "black";
    ctx.stroke();

    //Note
    ctx.beginPath();
    ctx.arc(notePos[0], notePos[1], radius / 16, 0, 2 * Math.PI);
    if (noteDirections[currentNote + 1] === 0) ctx.fillStyle = "blue";
    if (noteDirections[currentNote + 1] === 1) ctx.fillStyle = "red";
    if (noteDirections[currentNote + 1] === 2) ctx.fillStyle = "green";
    if (noteDirections[currentNote + 1] === undefined) ctx.fillStyle = "black";
    ctx.fill();

    //Message
    if (showMessage) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        if (message === "noice") {
            ctx.fillStyle = "green";
            ctx.font = "40px Arial";
        }
        if (message === "missed") {
            ctx.fillStyle = "red";
            ctx.font = "25px Arial";
        }
        ctx.fillText(
            message,
            canvas.width / 2 - ctx.measureText(message).width / 2,
            35
        );
    }

    //Score
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(score, 20, 40);

    if (scoreLetter !== "") {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(scoreLetter, 20, 70);
        ctx.font = "25px Arial";
        ctx.fillText("-", 46, 67);
        ctx.font = "20px Arial";
        ctx.fillText(levelName, 60, 67);
        ctx.fillText("Noice's: " + noices, 20, 90);
        ctx.fillText("So so's: " + sosos, 20, 110);
        ctx.fillText("Misses: " + misses, 20, 130);
    }

    //Loop
    if (running) {
        setTimeout(render, 1000 / 60);
    }
}

//input
let lastKey = [0, 0];

document.addEventListener("keydown", function (event) {
    if (
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "ArrowUp" ||
        event.code === "ArrowDown"
    ) {
        event.preventDefault();
        lastKey = [event.code, Date.now() - startTime];
    }
    if (event.code === "KeyR") {
        restart();
    }
    if (event.code === "KeyP") {
        pause();
    }
});

function displayMessage(m) {
    message = m;
    showMessage = true;
    clearTimeout(showMessageTimer);
    showMessageTimer = setTimeout(() => {
        showMessage = false;
    }, 600);
}

//sound
function playSound() {
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let osc = context.createOscillator(); // instantiate an oscillator
    osc.type = "sine"; // this is the default - also square, sawtooth, triangle

    if (songMode) {
        osc.frequency.value = noteHz[currentNote - 1];
    } else {
        osc.frequency.value = 800; // Hz
    }

    let gain = context.createGain();
    gain.gain.value = 0.1; // from 0 to 1, 1 full volume, 0 is muted
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.04);
    osc.connect(gain); // connect osc to vol
    gain.connect(context.destination); // connect vol to context destination

    osc.start(); // start the oscillator
    osc.stop(context.currentTime + 0.2);
}

function displayHit(h) {
    hit = h;
    showHit = true;
    clearTimeout(showHitTimer);
    showHitTimer = setTimeout(() => {
        showHit = false;
    }, 200);
}
function noiceHit() {
    displayMessage("noice");
    displayHit(1);
    score += 1000;
    noices++;
}
function sosoHit() {
    displayMessage("so so");
    displayHit(0);
    score += 750;
    sosos++;
}
function miss() {
    displayMessage("missed");
    misses++;
}

function checkInput() {
    if (lastKey[1] - noteTime > -40 && lastKey[1] - noteTime < 40) {
        if (noteDirections[currentNote - 1] === 0) {
            if (lastKey[0] === "ArrowRight") noiceHit();
            else miss();
        } else if (noteDirections[currentNote - 1] === 1) {
            if (lastKey[0] === "ArrowLeft") noiceHit();
            else miss();
        } else if (noteDirections[currentNote - 1] === 2) {
            if (lastKey[0] === "ArrowDown" || lastKey[0] === "ArrowUp")
                noiceHit();
            else miss();
        } else miss();
    } else if (lastKey[1] - noteTime > -100 && lastKey[1] - noteTime < 100) {
        if (noteDirections[currentNote - 1] === 0) {
            if (lastKey[0] === "ArrowRight") sosoHit();
            else miss();
        } else if (noteDirections[currentNote - 1] === 1) {
            if (lastKey[0] === "ArrowLeft") sosoHit();
            else miss();
        } else if (noteDirections[currentNote - 1] === 2) {
            if (lastKey[0] === "ArrowDown" || lastKey[0] === "ArrowUp")
                sosoHit();
            else miss();
        } else miss();
    } else miss();

    playSound();

    if (lastNote) {
        setScoreLetter();
    }
}

function moveTimer() {
    if (activeStepNum < activeMoveSteps) {
        activeStepNum++;

        let notePosX = 0;
        let notePosY = 0;

        if (noteDirections[currentNote] === 0) {
            activeTheta += activeStep;

            notePosX = anchorPos[0] + radius * Math.cos(activeTheta);
            notePosY = anchorPos[1] + radius * Math.sin(activeTheta);
        }
        if (noteDirections[currentNote] === 1) {
            activeTheta -= activeStep;

            notePosX = anchorPos[0] + radius * Math.cos(activeTheta);
            notePosY = anchorPos[1] + radius * Math.sin(activeTheta);
        }
        if (noteDirections[currentNote] === 2) {
            notePosX =
                notePos[0] +
                (radius /
                    (activeMoveSteps / (activeMoveSteps - activeStepNum))) *
                    Math.cos(activeStep);
            notePosY =
                notePos[1] +
                (radius /
                    (activeMoveSteps / (activeMoveSteps - activeStepNum))) *
                    Math.sin(activeStep);
        }

        activePos = [notePosX, notePosY];
        if (activeStepNum % 6 === 0) notePath.push(activePos);

        currentActiveTimer = setTimeout(
            moveTimer,
            noteLengths[currentNote] / activeMoveSteps
        );
    } else {
        noteTime = Date.now() - startTime;
        setTimeout(checkInput, 100);
        activeStepNum = 0;

        calcNotePos();
    }
}

function calcNotePos() {
    currentNote++;
    let notePosX = 0;
    let notePosY = 0;
    activeTheta = noteTheta;

    if (noteDirections[currentNote] === 0) {
        //clockwise
        noteTheta += (noteLengths[currentNote] / 10) * step;

        notePosX = anchorPos[0] + radius * Math.cos(noteTheta);
        notePosY = anchorPos[1] + radius * Math.sin(noteTheta);

        activeStep = (noteTheta - activeTheta) / activeMoveSteps;
    }
    if (noteDirections[currentNote] === 1) {
        //counterclockwise
        noteTheta -= (noteLengths[currentNote] / 10) * step;

        notePosX = anchorPos[0] + radius * Math.cos(noteTheta);
        notePosY = anchorPos[1] + radius * Math.sin(noteTheta);

        activeStep = (activeTheta - noteTheta) / activeMoveSteps;
    }
    if (noteDirections[currentNote] === 2) {
        //swap
        notePosX = anchorPos[0];
        notePosY = anchorPos[1];

        anchorPos[0] = notePos[0];
        anchorPos[1] = notePos[1];

        activeStep = noteTheta;

        noteTheta = noteTheta - step * (steps / 2);
    }

    //console.log(noteDirections[currentNote] + " " + noteLengths[currentNote] + " " + noteTheta)
    lastNotePos = notePos;
    //Loop
    if (currentNote < noteLengths.length && running) {
        notePos = [notePosX, notePosY];
        moveTimer();
    } else {
        lastNote = true;
    }
}

function setScoreLetter() {
    let maxScore = noteLengths.length * 1000;

    if (score === maxScore) scoreLetter = "S";
    else if (score >= maxScore * 0.9) scoreLetter = "A";
    else if (score >= maxScore * 0.8) scoreLetter = "B";
    else if (score >= maxScore * 0.7) scoreLetter = "C";
    else if (score >= maxScore * 0.6) scoreLetter = "D";
    else if (score >= maxScore * 0.5) scoreLetter = "E";
    else scoreLetter = "F";
}

function pause() {
    running = false;
}

function reset() {
    clearTimeout(currentActiveTimer);
    clearTimeout(restartTimer);

    notePath = [];
    currentNote = -1;
    notePos = [-10, -10];
    noteTheta = 0;
    noteTime = 0;

    showMessage = false;
    showHit = false;
    lastNote = false;

    score = 0;
    scoreLetter = "";
    misses = 0;
    sosos = 0;
    noices = 0;

    anchorPos = [centerX, centerY];
    activePos = [centerX + radius, centerY];
    activeTheta = 0;
    activeStep = 0;
    activeStepNum = 0;
    currentActiveTimer = null;
}

function restart() {
    pause();
    reset();

    restartTimer = setTimeout(() => {
        running = true;
        render();

        startTime = Date.now();
        calcNotePos();
    }, 800);
}

/*
//old difficulties
function easyStart() {
    noteLengths = easyNoteLengths
    noteDirections = easyNoteDirections
    restart()
}
function mediumStart() {
    noteLengths = mediumNoteLengths
    noteDirections = mediumNoteDirections
    restart()
}
function hardStart() {
    noteLengths = hardNoteLengths
    noteDirections = hardNoteDirections
    restart()
}
*/

function tetrisStart() {
    songMode = true;

    noteLengths = [
        300, 600, 300, 300, 600, 300, 300, 600, 300, 300, 600, 300, 300, 900,
        300, 600, 600, 600, 600, 1200, 600, 300, 600, 300, 300, 900, 300, 600,
        300, 300, 600, 300, 300, 600, 600, 600, 600,
    ];
    noteDirections = [
        0, 1, 1, 0, 2, 0, 1, 2, 1, 1, 0, 0, 1, 2, 1, 2, 0, 0, 2, 1, 1, 1, 2, 0,
        0, 2, 0, 2, 0, 1, 2, 1, 1, 0, 0, 0, 1,
    ];
    restart();
    noteHz = [
        1319, 988, 1047, 1175, 1047, 988, 880, 880, 1047, 1319, 1175, 1047, 988,
        1047, 1175, 1319, 1047, 880, 880, 1175, 1397, 1760, 1568, 1397, 1319,
        1047, 1319, 1175, 1047, 988, 988, 1047, 1175, 1319, 1047, 880, 880,
    ];
    levelName = "Tetris Mode";
}

function randomStart() {
    songMode = false;

    let noteCountInput = document.getElementById("note-count");
    let noteCount = 1;

    if (noteCountInput.value > 0) noteCount = noteCountInput.value;

    let randomNoteLengths = [];
    let randomNoteDirections = [];

    function getRandomInt(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    for (let i = 0; i < noteCount; i++) {
        randomNoteLengths.push(getRandomInt(350, 800));
        if (i === 0) randomNoteDirections.push(getRandomInt(0, 1));
        else randomNoteDirections.push(getRandomInt(0, 2));
    }

    noteLengths = randomNoteLengths;
    noteDirections = randomNoteDirections;
    restart();
    levelName = "Random: " + noteCount;
}
function seededStart() {
    songMode = false;

    let seed = document.getElementById("seed").value;
    const regex = new RegExp("^[a-z]+$");

    let seededNoteLengths = [];
    let seededNoteDirections = [];

    if (regex.test(seed)) {
        let difficultyMod = 0;
        let difficulty = document.getElementById("difficulty").value;

        if (difficulty === "easy") difficultyMod = 200;
        if (difficulty === "medium") difficultyMod = 0;
        if (difficulty === "hard") difficultyMod = -100;
        if (difficulty === "veryhard") difficultyMod = -200;

        for (let i = 0; i < seed.length; i++) {
            const charCode = seed.charCodeAt(i);
            const indexedCharCode = charCode - 97;

            //lengths
            const lengthSets = [
                [300, 350],
                [350, 400],
                [350, 500],
                [450, 300],
                [500, 450],
                [300, 650],
                [350, 700],
                [350, 800],
                [450, 600],
                [500, 850],
                [650, 600],
                [700, 650],
                [800, 650],
                [600, 750],
                [850, 800],
                [650, 300],
                [700, 350],
                [800, 350],
                [600, 450],
                [850, 500],
                [600, 650],
                [650, 700],
                [650, 800],
                [750, 600],
                [800, 850],
                [700, 850],
            ];

            seededNoteLengths.push(
                lengthSets[indexedCharCode][0] + difficultyMod
            );
            seededNoteLengths.push(
                lengthSets[indexedCharCode][1] + difficultyMod
            );

            //directions
            const lastNum = parseInt((charCode + "").slice(-1));
            const directionSets = [
                [0, 0],
                [0, 1],
                [1, 0],
                [2, 2],
                [0, 2],
                [2, 0],
                [1, 0],
                [1, 1],
                [1, 2],
                [2, 1],
            ];

            if (i === 0 && directionSets[lastNum][0] === 2)
                seededNoteDirections.push(
                    0
                ); //start with clockwise if crossover
            else seededNoteDirections.push(directionSets[lastNum][0]);
            seededNoteDirections.push(directionSets[lastNum][1]);
        }

        noteLengths = seededNoteLengths;
        noteDirections = seededNoteDirections;
        restart();
        levelName = "Seed: " + seed + " on " + difficulty;
    } else {
        alert("Seed must contain lowercase letters only");
    }
}

//Button control functions
function pressLeft() {
    document.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }));
}
function pressUp() {
    document.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }));
}
function pressRight() {
    document.dispatchEvent(
        new KeyboardEvent("keydown", { code: "ArrowRight" })
    );
}

render();
