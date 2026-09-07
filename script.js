// ========================================
// BINGO 5x5 GAME
// ========================================


// DOM ELEMENTS

const setupScreen =
    document.getElementById("setupScreen");

const turnScreen =
    document.getElementById("turnScreen");

const gameScreen =
    document.getElementById("gameScreen");


const setupGrid =
    document.getElementById("setupGrid");

const gameGrid =
    document.getElementById("gameGrid");


const randomBtn =
    document.getElementById("randomBtn");

const orderBtn =
    document.getElementById("orderBtn");

const clearBtn =
    document.getElementById("clearBtn");


const startBtn =
    document.getElementById("startBtn");


const myTurnFirst =
    document.getElementById("myTurnFirst");

const opponentFirst =
    document.getElementById("opponentFirst");


const nextNumber =
    document.getElementById("nextNumber");

const fillCount =
    document.getElementById("fillCount");

const progressFill =
    document.getElementById("progressFill");


const turnIndicator =
    document.getElementById("turnIndicator");

const turnText =
    document.getElementById("turnText");


const lineCount =
    document.getElementById("lineCount");


const bingoLetters =
    document.querySelectorAll(".bingo-letter");


const winnerPopup =
    document.getElementById("winnerPopup");

const winnerText =
    document.getElementById("winnerText");


const newGameBtn =
    document.getElementById("newGameBtn");

const winnerNewGame =
    document.getElementById("winnerNewGame");


// ========================================
// GAME VARIABLES
// ========================================

let setupNumbers =
    new Array(25).fill(null);


let currentNumber = 1;


let currentTurn = "my";


let completedLineIndexes = [];


let gameOver = false;


// ========================================
// CREATE SETUP GRID
// ========================================

function createSetupGrid() {

    setupGrid.innerHTML = "";


    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const cell =
            document.createElement("div");


        cell.className =
            "setup-cell";


        if (
            setupNumbers[i] !== null
        ) {

            cell.innerText =
                setupNumbers[i];


            cell.classList.add(
                "filled"
            );
        }


        cell.addEventListener(
            "click",
            function () {

                manualFill(i);

            }
        );


        setupGrid.appendChild(cell);
    }
}


// ========================================
// MANUAL FILL
// ========================================

function manualFill(index) {

    if (
        setupNumbers[index] !== null
    ) {
        return;
    }


    if (
        currentNumber > 25
    ) {
        return;
    }


    setupNumbers[index] =
        currentNumber;


    currentNumber++;


    createSetupGrid();


    updateSetupUI();
}


// ========================================
// UPDATE SETUP UI
// ========================================

function updateSetupUI() {

    const filled =
        setupNumbers.filter(
            number =>
                number !== null
        ).length;


    fillCount.innerText =
        `${filled} / 25 Filled`;


    progressFill.style.width =
        `${(filled / 25) * 100}%`;


    if (filled < 25) {

        nextNumber.innerText =
            currentNumber;

    }

    else {

        nextNumber.innerText =
            "✓";

    }


    if (filled === 25) {

        startBtn.disabled = false;

        startBtn.innerText =
            "START GAME →";

    }

    else {

        startBtn.disabled = true;

        startBtn.innerText =
            `Fill Grid (${filled}/25)`;

    }
}


// ========================================
// RANDOM FILL
// ========================================

function randomFill() {

    let numbers = [];


    for (
        let i = 1;
        i <= 25;
        i++
    ) {

        numbers.push(i);
    }


    // Fisher-Yates Shuffle

    for (
        let i = numbers.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            numbers[i],
            numbers[j]
        ]
        =
        [
            numbers[j],
            numbers[i]
        ];
    }


    setupNumbers = numbers;


    currentNumber = 26;


    createSetupGrid();


    updateSetupUI();
}


// ========================================
// ORDER FILL
// ========================================

function orderFill() {

    setupNumbers = [];


    for (
        let i = 1;
        i <= 25;
        i++
    ) {

        setupNumbers.push(i);
    }


    currentNumber = 26;


    createSetupGrid();


    updateSetupUI();
}


// ========================================
// CLEAR GRID
// ========================================

function clearGrid() {

    setupNumbers =
        new Array(25).fill(null);


    currentNumber = 1;


    createSetupGrid();


    updateSetupUI();
}


// ========================================
// OPEN TURN SCREEN
// ========================================

function openTurnSelection() {

    if (
        setupNumbers.some(
            number =>
                number === null
        )
    ) {
        return;
    }


    setupScreen.classList.add(
        "hidden"
    );


    turnScreen.classList.remove(
        "hidden"
    );
}


// ========================================
// START GAME
// ========================================

function startGame(firstTurn) {

    currentTurn =
        firstTurn;


    completedLineIndexes = [];


    gameOver = false;


    // Remove old lines

    document
        .querySelectorAll(
            ".winning-line"
        )
        .forEach(
            line => line.remove()
        );


    turnScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "hidden"
    );


    createGameGrid();


    updateTurnIndicator();


    updateBingoStatus();
}


// ========================================
// CREATE GAME GRID
// ========================================

function createGameGrid() {

    gameGrid.innerHTML = "";


    setupNumbers.forEach(
        function (
            number,
            index
        ) {

            const cell =
                document.createElement(
                    "div"
                );


            cell.className =
                "game-cell";


            cell.innerText =
                number;


            cell.dataset.index =
                index;


            cell.addEventListener(
                "click",
                function () {

                    markCell(cell);

                }
            );


            gameGrid.appendChild(
                cell
            );

        }
    );
}


// ========================================
// MARK CELL
// ========================================

function markCell(cell) {

    if (gameOver) {
        return;
    }


    // Already marked

    if (

        cell.classList.contains(
            "marked-my"
        )

        ||

        cell.classList.contains(
            "marked-opponent"
        )

    ) {
        return;
    }


    // MY TURN = GREEN

    if (
        currentTurn === "my"
    ) {

        cell.classList.add(
            "marked-my"
        );

    }


    // OPPONENT = RED

    else {

        cell.classList.add(
            "marked-opponent"
        );

    }


    // Check lines

    checkLines();


    if (gameOver) {
        return;
    }


    // Change turn

    if (
        currentTurn === "my"
    ) {

        currentTurn =
            "opponent";

    }

    else {

        currentTurn =
            "my";

    }


    updateTurnIndicator();
}


// ========================================
// TURN INDICATOR
// ========================================

function updateTurnIndicator() {

    if (
        currentTurn === "my"
    ) {

        turnIndicator.className =
            "turn-indicator my-turn";


        turnText.innerText =
            "MY TURN";

    }

    else {

        turnIndicator.className =
            "turn-indicator opponent-turn";


        turnText.innerText =
            "OPPONENT TURN";

    }
}


// ========================================
// ALL WINNING PATTERNS
// ========================================

const winningPatterns = [

    // ROWS

    [0, 1, 2, 3, 4],

    [5, 6, 7, 8, 9],

    [10, 11, 12, 13, 14],

    [15, 16, 17, 18, 19],

    [20, 21, 22, 23, 24],


    // COLUMNS

    [0, 5, 10, 15, 20],

    [1, 6, 11, 16, 21],

    [2, 7, 12, 17, 22],

    [3, 8, 13, 18, 23],

    [4, 9, 14, 19, 24],


    // DIAGONALS

    [0, 6, 12, 18, 24],

    [4, 8, 12, 16, 20]

];


// ========================================
// CHECK BINGO LINES
// ========================================

function checkLines() {

    const cells =
        document.querySelectorAll(
            ".game-cell"
        );


    winningPatterns.forEach(
        function (
            pattern,
            patternIndex
        ) {


            // Already completed

            if (
                completedLineIndexes.includes(
                    patternIndex
                )
            ) {
                return;
            }


            // Check all cells

            const completed =
                pattern.every(
                    index =>

                        cells[index]
                            .classList
                            .contains("marked-my")

                        ||

                        cells[index]
                            .classList
                            .contains(
                                "marked-opponent"
                            )
                );


            if (completed) {

                completedLineIndexes.push(
                    patternIndex
                );


                drawWinningLine(
                    pattern,
                    patternIndex
                );

            }

        }
    );


    updateBingoStatus();


    // WIN AT 5 LINES

    if (
        completedLineIndexes.length >= 5
    ) {

        gameOver = true;


        setTimeout(
            showWinner,
            600
        );

    }
}


// ========================================
// UPDATE BINGO STATUS
// ========================================

function updateBingoStatus() {

    const totalLines =
        Math.min(
            completedLineIndexes.length,
            5
        );


    lineCount.innerText =
        `${totalLines} / 5 Lines`;


    bingoLetters.forEach(
        function (
            letter,
            index
        ) {

            if (
                index < totalLines
            ) {

                letter.classList.add(
                    "active"
                );

            }

            else {

                letter.classList.remove(
                    "active"
                );

            }

        }
    );
}


// ========================================
// PERFECT WINNING LINE
// ========================================

function drawWinningLine(
    pattern,
    patternIndex
) {

    const cells =
        document.querySelectorAll(
            ".game-cell"
        );


    const gameGrid =
        document.getElementById(
            "gameGrid"
        );


    // First cell

    const firstCell =
        cells[pattern[0]];


    // Last cell

    const lastCell =
        cells[pattern[4]];


    // Get exact positions

    const gridRect =
        gameGrid.getBoundingClientRect();


    const firstRect =
        firstCell.getBoundingClientRect();


    const lastRect =
        lastCell.getBoundingClientRect();


    // Center positions

    const x1 =
        firstRect.left -
        gridRect.left +
        firstRect.width / 2;


    const y1 =
        firstRect.top -
        gridRect.top +
        firstRect.height / 2;


    const x2 =
        lastRect.left -
        gridRect.left +
        lastRect.width / 2;


    const y2 =
        lastRect.top -
        gridRect.top +
        lastRect.height / 2;


    // Difference

    const dx =
        x2 - x1;


    const dy =
        y2 - y1;


    // Exact distance

    const length =
        Math.sqrt(

            dx * dx +

            dy * dy

        );


    // Exact angle

    const angle =
        Math.atan2(
            dy,
            dx
        )
        *
        180
        /
        Math.PI;


    // Create line

    const line =
        document.createElement(
            "div"
        );


    line.className =
        "winning-line";


    line.dataset.line =
        patternIndex;


    // Position

    line.style.width =
        `${length}px`;


    line.style.left =
        `${x1}px`;


    // Center line vertically

    const lineHeight = 8;


    line.style.top =
        `${y1 - lineHeight / 2}px`;


    // Rotate

    line.style.transform =
        `rotate(${angle}deg)`;


    gameGrid.appendChild(
        line
    );
}


// ========================================
// SHOW WINNER
// ========================================

function showWinner() {

    if (
        currentTurn === "my"
    ) {

        winnerText.innerText =
            "🎉 YOU WIN!";

    }

    else {

        winnerText.innerText =
            "🏆 OPPONENT WINS!";

    }


    winnerPopup.classList.remove(
        "hidden"
    );
}


// ========================================
// NEW GAME
// ========================================

function newGame() {

    winnerPopup.classList.add(
        "hidden"
    );


    setupNumbers =
        new Array(25).fill(null);


    currentNumber = 1;


    currentTurn = "my";


    completedLineIndexes = [];


    gameOver = false;


    bingoLetters.forEach(
        letter => {

            letter.classList.remove(
                "active"
            );

        }
    );


    gameScreen.classList.add(
        "hidden"
    );


    turnScreen.classList.add(
        "hidden"
    );


    setupScreen.classList.remove(
        "hidden"
    );


    createSetupGrid();


    updateSetupUI();
}


// ========================================
// EVENT LISTENERS
// ========================================

randomBtn.addEventListener(
    "click",
    randomFill
);


orderBtn.addEventListener(
    "click",
    orderFill
);


clearBtn.addEventListener(
    "click",
    clearGrid
);


startBtn.addEventListener(
    "click",
    openTurnSelection
);


myTurnFirst.addEventListener(
    "click",
    function () {

        startGame("my");

    }
);


opponentFirst.addEventListener(
    "click",
    function () {

        startGame("opponent");

    }
);


newGameBtn.addEventListener(
    "click",
    newGame
);


winnerNewGame.addEventListener(
    "click",
    newGame
);


// ========================================
// INITIAL LOAD
// ========================================

createSetupGrid();


updateSetupUI();