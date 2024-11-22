const xChoice = document.querySelector(".x-mark");
const oChoice = document.querySelector(".o-mark");
const cpuBtn = document.querySelector(".cpu-btn");
const playerBtn = document.querySelector(".player-btn");
const restartBtn = document.querySelector(".retry-btn");
const quitBtn = document.querySelector(".quit");
const nextRoundBtn = document.querySelector(".next-round");
const continueRestart = document.querySelector(".continue");
const cancelBtn = document.querySelector(".cancel");
const start = document.querySelector(".start");
const mainGame = document.querySelector(".main-game");
const gridCards = [...document.querySelectorAll(".pick-card")];
const turnLabel = document.querySelector(".whose-turn i"); 
const turnL = document.querySelector(".whose-turn p"); 
const restartWindow = document.querySelector(".restart-div"); 
const winWindow = document.querySelector(".who-won"); 
const xSc = document.querySelector(".x-sc");
const tiesSc = document.querySelector(".ties");
const oSc = document.querySelector(".o-sc");
const scNum = document.querySelectorAll(".sc-num");

let posArr = JSON.parse(localStorage.getItem("posGrid"));
let ess = JSON.parse(localStorage.getItem("essentials"));
const scoreBoard = JSON.parse(localStorage.getItem("allScores")) || {
    x: 0,
    ties: 0,
    o: 0
};

if(!posArr) {
    ess = {
        playerChoice: 'x',
        turn: 'x',
        vsMatch: null,
        tilesCnt: 0,
        winner: "tie",
        completed: false
    };

    posArr = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
}

else {
    if(ess.completed) quitGame();
    else {
        start.classList.toggle("show");
        mainGame.classList.toggle("show");
        scoreTilesUpdate();
        resumeGridProgress();

        if(ess.turn === ess.playerChoice) {
            if(ess.playerChoice === 'x') turnLabel.className = "fa-solid fa-xmark";
            else turnLabel.className = "fa-solid fa-o";

            turnL.innerText = `TURN(YOU)`;
        }
        else {
            if(ess.playerChoice === 'x') turnLabel.className = "fa-solid fa-o";
            else turnLabel.className = "fa-solid fa-xmark";
            
            turnL.innerText = `TURN(${ess.vsMatch.toUpperCase()})`;
        }
    }
}

function resumeGridProgress() {
    let cnt = 0;
    posArr.forEach((el1) => {
        el1.forEach((el2) => {
            if(el2 === 'x') gridCards[cnt].innerHTML = `<i class="fa-solid fa-xmark" style="color: #f2b236"></i>`;
            else if(el2 === 'o') gridCards[cnt].innerHTML = `<i class="fa-solid fa-o" style="color: #31c4be"></i>`;

            cnt++;
        });
    });
}

function updateLS() {
    localStorage.setItem("posGrid", JSON.stringify(posArr));
    localStorage.setItem("essentials", JSON.stringify(ess));
    localStorage.setItem("allScores", JSON.stringify(scoreBoard));
}

function initalSetup() {
    start.classList.toggle("show");
    mainGame.classList.toggle("show");

    turnLabel.className = "fa-solid fa-xmark";
    
    if(ess.playerChoice === 'x') turnL.innerText = `TURN(YOU)`;
    else turnL.innerText = `TURN(${ess.vsMatch.toUpperCase()})`;

    if(ess.playerChoice === 'o' && ess.vsMatch === "cpu") cpuChoiceMaking();
    updateLS();
    scoreTilesUpdate();
}

function verifyPattern(arr) {
    const [i1, i2, i3] = arr;

    if((posArr[i1[0]][i1[1]] && posArr[i2[0]][i2[1]] && posArr[i3[0]][i3[1]]) && (posArr[i1[0]][i1[1]] === posArr[i2[0]][i2[1]] && posArr[i2[0]][i2[1]] === posArr[i3[0]][i3[1]])) return true;

    return false;
}

function patternChk() {
    const allPatterns = [
        [[0, 0], [0, 1], [0, 2], [0, 1, 2]],
        [[2, 0], [2, 1], [2, 2], [6, 7, 8]],
        [[1, 0], [1, 1], [1, 2], [3, 4, 5]],
        [[0, 0], [1, 0], [2, 0], [0, 3, 6]],
        [[0, 2], [1, 2], [2, 2], [2, 5, 8]],
        [[0, 1], [1, 1], [2, 1], [1, 4, 7]],
        [[0, 0], [1, 1], [2, 2], [0, 4, 8]],
        [[2, 0], [1, 1], [0, 2], [2, 4, 6]]
    ];
    
    for(let i = 0; i < allPatterns.length; i++) {
        if(verifyPattern(allPatterns[i])) {
            if(posArr[allPatterns[i][0][0]][allPatterns[i][0][1]] === 'x') {
                ess.winner = 'x';
                gridCards[allPatterns[i][3][0]].classList.add("yellow-pattern");
                gridCards[allPatterns[i][3][1]].classList.add("yellow-pattern");
                gridCards[allPatterns[i][3][2]].classList.add("yellow-pattern");
            }
            else {
                ess.winner = 'o';
                gridCards[allPatterns[i][3][0]].classList.add("blue-pattern");
                gridCards[allPatterns[i][3][1]].classList.add("blue-pattern");
                gridCards[allPatterns[i][3][2]].classList.add("blue-pattern");
            }

            updateScoreBoard();
            break;
        }
    }
}

function cpuChoiceMaking() {
    let randomIdx = parseInt(Math.random() * 9);

    while(posArr[parseInt(randomIdx / 3)][parseInt(randomIdx % 3)]) {
        randomIdx = parseInt(Math.random() * 9);
    }

    posArr[parseInt(randomIdx / 3)][parseInt(randomIdx % 3)] = ess.turn;
    setTimeout(() => setMark(gridCards[randomIdx]), 500);
}

function scoreTilesUpdate() {
    scNum[0].innerText = scoreBoard.x;
    scNum[1].innerText = scoreBoard.ties;
    scNum[2].innerText = scoreBoard.o;
}

function updateScoreBoard() {
    debugger
    ess.completed = true;
    turnLabel.className = "fa-solid fa-minus";
    turnL.innerText = "TURN";

    if(ess.winner === "tie") scoreBoard.ties++;
    else if(ess.winner === 'x') scoreBoard.x++;
    else scoreBoard.o++;

    scoreTilesUpdate();

    updateLS();
    setTimeout(() => winWindow.classList.add("show-base"), 400);
}

function setMark(el) {
    if(ess.turn === 'x') {
        marking = `<i class="fa-solid fa-xmark" style="color: #f2b236"></i>`;
        turnLabel.className = "fa-solid fa-o";
        ess.turn = 'o';

        if(ess.playerChoice === 'o') turnL.innerText = `TURN(YOU)`;
        else turnL.innerText = `TURN(${ess.vsMatch.toUpperCase()})`
    }

    else {
        marking = `<i class="fa-solid fa-o" style="color: #31c4be"></i>`;
        turnLabel.className = "fa-solid fa-xmark";
        ess.turn = 'x';

        if(ess.playerChoice === 'x') turnL.innerText = `TURN(YOU)`;
        else turnL.innerText = `TURN(${ess.vsMatch.toUpperCase()})`
    }

    el.innerHTML = marking;
    ess.tilesCnt++;
    patternChk();

    if(ess.tilesCnt === 9 && !ess.completed) updateScoreBoard();
    updateLS();
}

function quitGame() {
    gridReset();

    ess.playerChoice = 'x';
    ess.turn = 'x';
    ess.vsMatch = null;
    ess.tilesCnt = 0;
    ess.winner = "tie";
    ess.completed = false;

    start.classList.add("show");
    mainGame.classList.remove("show");
    
    localStorage.removeItem("essentials");
    localStorage.removeItem("posGrid");
    localStorage.setItem("allScores", JSON.stringify(scoreBoard));
}

function gridReset() {
    const temp = ess.winner;

    posArr.forEach((el1, r) => {
        el1.forEach((el2, c) => {
            posArr[r][c] = null;
        });
    });

    gridCards.forEach((el) => {
        el.innerHTML = "";
        if(temp === 'x') el.classList.remove("yellow-pattern");
        else if(temp === 'o') el.classList.remove("blue-pattern");
    });

    restartWindow.classList.remove("show-base");
    winWindow.classList.remove("show-base");

    updateLS();
}

function resetCurrentState() {
    gridReset();

    ess.turn = 'x';
    ess.tilesCnt = 0;
    ess.winner = "tie";
    ess.completed = false;

    updateLS();

    if(ess.playerChoice === 'x') {
        turnL.innerText = `TURN(YOU)`;
    }
    else {
        turnL.innerText = `TURN(${ess.vsMatch.toUpperCase()})`
    }

    turnLabel.className = "fa-solid fa-xmark";
    if(ess.playerChoice === 'o' && ess.vsMatch === "cpu") cpuChoiceMaking();
}

xChoice.addEventListener("click", () => {
    ess.playerChoice = 'x';
    xChoice.classList.add("picked");
    oChoice.classList.remove("picked");
});

oChoice.addEventListener("click", () => {
    ess.playerChoice = 'o';
    xChoice.classList.remove("picked");
    oChoice.classList.add("picked");
});

cpuBtn.addEventListener("click", () => {
    ess.vsMatch = "cpu";
    initalSetup();
});

playerBtn.addEventListener("click", () => {
    ess.vsMatch = "player";
    initalSetup();
});

cancelBtn.addEventListener("click", () => restartWindow.classList.remove("show-base"));

restartBtn.addEventListener("click", () => restartWindow.classList.add("show-base"));

continueRestart.addEventListener("click", resetCurrentState);

nextRoundBtn.addEventListener("click", resetCurrentState);

quitBtn.addEventListener("click", quitGame);

gridCards.forEach((el) => {
    el.addEventListener("click", (e) => {
        if((ess.turn === ess.playerChoice || ess.vsMatch == "player") && !ess.completed) {
            const idx = gridCards.indexOf(e.target);
            let marking;

            if(idx !== -1 && !posArr[parseInt(idx / 3)][parseInt(idx % 3)]) {
                posArr[parseInt(idx / 3)][parseInt(idx % 3)] = ess.turn;

                setMark(e.target);

                if(ess.vsMatch == "cpu" && ess.tilesCnt !== 9 && !ess.completed) cpuChoiceMaking();

                updateLS();
            }
        }
    });
});

window.addEventListener("resize", () => {
    const mainGameHeight = document.querySelector(".container").offsetHeight;
    document.querySelector(".restart-div").style.height = `${mainGameHeight}px`;
    document.querySelector(".who-won").style.height = `${mainGameHeight}px`;
});