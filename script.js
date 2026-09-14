// ======================================================
// FIREBASE
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get,
    update,
    onValue,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";


// ======================================================
// FIREBASE CONFIGURATION
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyDmKoLtgwm87RdcffrncmJYru_5ZHKncN0",
    authDomain: "bingo-4180c.firebaseapp.com",
    databaseURL: "https://bingo-4180c-default-rtdb.firebaseio.com",
    projectId: "bingo-4180c",
    storageBucket: "bingo-4180c.firebasestorage.app",
    messagingSenderId: "374266989356",
    appId: "1:374266989356:web:0db5fc9622265b701d3a89",
    measurementId: "G-Y18959N1B4"
};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// ======================================================
// DOM ELEMENTS
// ======================================================

// MODE

const modeScreen =
    document.getElementById("modeScreen");

const offlineBtn =
    document.getElementById("offlineBtn");

const multiplayerBtn =
    document.getElementById("multiplayerBtn");


// ROOM

const roomScreen =
    document.getElementById("roomScreen");

const roomIdInput =
    document.getElementById("roomIdInput");

const createRoomBtn =
    document.getElementById("createRoomBtn");

const joinRoomBtn =
    document.getElementById("joinRoomBtn");

const roomMessage =
    document.getElementById("roomMessage");


// SETUP

const setupScreen =
    document.getElementById("setupScreen");

const setupGrid =
    document.getElementById("setupGrid");

const randomBtn =
    document.getElementById("randomBtn");

const orderBtn =
    document.getElementById("orderBtn");

const clearBtn =
    document.getElementById("clearBtn");

const startBtn =
    document.getElementById("startBtn");

const nextNumber =
    document.getElementById("nextNumber");

const fillCount =
    document.getElementById("fillCount");

const progressFill =
    document.getElementById("progressFill");


// TURN

const turnScreen =
    document.getElementById("turnScreen");

const myTurnFirst =
    document.getElementById("myTurnFirst");

const opponentFirst =
    document.getElementById("opponentFirst");


// GAME

const gameScreen =
    document.getElementById("gameScreen");

const gameGrid =
    document.getElementById("gameGrid");

const turnIndicator =
    document.getElementById("turnIndicator");

const turnText =
    document.getElementById("turnText");

const lineCount =
    document.getElementById("lineCount");

const bingoLetters =
    document.querySelectorAll(".bingo-letter");

const newGameBtn =
    document.getElementById("newGameBtn");


// WINNER

const winnerPopup =
    document.getElementById("winnerPopup");

const winnerText =
    document.getElementById("winnerText");

const winnerNewGame =
    document.getElementById("winnerNewGame");


// ======================================================
// GAME VARIABLES
// ======================================================

let setupNumbers =
    new Array(25).fill(null);

let currentNumber = 1;

let currentTurn = "my";

let completedLineIndexes = [];

let gameOver = false;


// ======================================================
// MULTIPLAYER VARIABLES
// ======================================================

let roomId = "";

let playerRole = "";

let latestRoomData = null;

let roomListenerStarted = false;

let waitingListenerStarted = false;


// ======================================================
// MODE SELECTION
// ======================================================

// PLAY OFFLINE

function playOffline() {

    roomId = "";
    playerRole = "";

    latestRoomData = null;

    modeScreen.classList.add("hidden");

    roomScreen.classList.add("hidden");

    setupScreen.classList.remove("hidden");

    turnScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

    winnerPopup.classList.add("hidden");

    setupNumbers =
        new Array(25).fill(null);

    currentNumber = 1;

    currentTurn = "my";

    completedLineIndexes = [];

    gameOver = false;

    createSetupGrid();

    updateSetupUI();
}


// CREATE / JOIN ROOM

function openMultiplayer() {

    modeScreen.classList.add("hidden");

    setupScreen.classList.add("hidden");

    turnScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

    winnerPopup.classList.add("hidden");

    roomScreen.classList.remove("hidden");

    roomMessage.innerText = "";

    roomIdInput.value = "";
}


// ======================================================
// MODE BUTTONS
// ======================================================

offlineBtn.addEventListener(
    "click",
    playOffline
);

multiplayerBtn.addEventListener(
    "click",
    openMultiplayer
);


// ======================================================
// CREATE SETUP GRID
// ======================================================

function createSetupGrid() {

    setupGrid.innerHTML = "";

    for (let i = 0; i < 25; i++) {

        const cell =
            document.createElement("div");

        cell.className =
            "setup-cell";

        if (setupNumbers[i] !== null) {

            cell.innerText =
                setupNumbers[i];

            cell.classList.add("filled");
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


// ======================================================
// MANUAL FILL
// ======================================================

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


// ======================================================
// UPDATE SETUP UI
// ======================================================

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

    } else {

        nextNumber.innerText =
            "✓";
    }

    if (filled === 25) {

        startBtn.disabled =
            false;

        startBtn.innerText =
            "START GAME →";

    } else {

        startBtn.disabled =
            true;

        startBtn.innerText =
            `Fill Grid (${filled}/25)`;
    }
}


// ======================================================
// RANDOM FILL
// ======================================================

function randomFill() {

    let numbers = [];

    for (let i = 1; i <= 25; i++) {

        numbers.push(i);
    }

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
        ] =
        [
            numbers[j],
            numbers[i]
        ];
    }

    setupNumbers =
        numbers;

    currentNumber = 26;

    createSetupGrid();

    updateSetupUI();
}


// ======================================================
// ORDER FILL
// ======================================================

function orderFill() {

    setupNumbers = [];

    for (let i = 1; i <= 25; i++) {

        setupNumbers.push(i);
    }

    currentNumber = 26;

    createSetupGrid();

    updateSetupUI();
}


// ======================================================
// CLEAR GRID
// ======================================================

function clearGrid() {

    setupNumbers =
        new Array(25).fill(null);

    currentNumber = 1;

    createSetupGrid();

    updateSetupUI();
}


// ======================================================
// SETUP BUTTONS
// ======================================================

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


// ======================================================
// OPEN TURN SCREEN
// ======================================================

async function openTurnSelection() {

    if (
        setupNumbers.some(
            number =>
                number === null
        )
    ) {
        return;
    }

    // OFFLINE

    if (!playerRole) {

        setupScreen.classList.add(
            "hidden"
        );

        turnScreen.classList.remove(
            "hidden"
        );

        return;
    }


    // MULTIPLAYER

    await saveMyBoardAndShowTurnScreen();
}


// ======================================================
// START BUTTON
// ======================================================

startBtn.addEventListener(
    "click",
    openTurnSelection
);


// ======================================================
// SAVE PLAYER BOARD
// ======================================================

async function saveMyBoardAndShowTurnScreen() {

    if (!roomId || !playerRole) {
        return;
    }

    try {

        const roomRef =
            ref(
                db,
                "games/" + roomId
            );

        const boardKey =
            playerRole === "player1"
                ? "player1Board"
                : "player2Board";

        const readyKey =
            playerRole === "player1"
                ? "player1Ready"
                : "player2Ready";

        await update(
            roomRef,
            {
                [boardKey]: setupNumbers,
                [readyKey]: true
            }
        );

        setupScreen.classList.add(
            "hidden"
        );

        turnScreen.classList.remove(
            "hidden"
        );

    }
    catch (error) {

        console.error(
            "Board Save Error:",
            error
        );

        showRoomMessage(
            "❌ Board save nahi hua."
        );
    }
}


// ======================================================
// START OFFLINE GAME
// ======================================================

function startOfflineGame(firstTurn) {

    startGame(firstTurn);

}


// ======================================================
// TURN SELECTION
// ======================================================

myTurnFirst.addEventListener(
    "click",
    async function () {

        if (!playerRole) {

            startOfflineGame("my");

            return;
        }

        await chooseMultiplayerTurn(
            "my"
        );
    }
);


opponentFirst.addEventListener(
    "click",
    async function () {

        if (!playerRole) {

            startOfflineGame("opponent");

            return;
        }

        await chooseMultiplayerTurn(
            "opponent"
        );
    }
);


// ======================================================
// CHOOSE MULTIPLAYER TURN
// ======================================================

async function chooseMultiplayerTurn(choice) {

    if (!roomId || !playerRole) {
        return;
    }

    try {

        const roomRef =
            ref(
                db,
                "games/" + roomId
            );

        const choiceKey =
            playerRole === "player1"
                ? "player1TurnChoice"
                : "player2TurnChoice";

        await update(
            roomRef,
            {
                [choiceKey]: choice
            }
        );

        turnScreen.classList.add(
            "hidden"
        );

        roomMessage.innerText =
            "✅ Turn choice save ho gayi. Dusre player ka wait karo...";

    }
    catch (error) {

        console.error(
            "Turn Choice Error:",
            error
        );
    }
}


// ======================================================
// PROCESS TURN CHOICES
// ======================================================

async function processTurnChoices(data) {

    if (!data) {
        return;
    }

    if (
        data.player1TurnChoice !== "my" &&
        data.player1TurnChoice !== "opponent"
    ) {
        return;
    }

    if (
        data.player2TurnChoice !== "my" &&
        data.player2TurnChoice !== "opponent"
    ) {
        return;
    }

    if (data.status === "playing") {
        return;
    }

    const p1Choice =
        data.player1TurnChoice;

    const p2Choice =
        data.player2TurnChoice;


    // Dono ko opposite choice karni hogi

    if (p1Choice === p2Choice) {

        if (playerRole) {

            roomMessage.innerText =
                "⚠️ Dono players ne same option select kiya. Ek MY TURN FIRST aur dusra OPPONENT FIRST select kare.";

        }

        return;
    }


    let firstPlayer;

    if (p1Choice === "my") {

        firstPlayer = "player1";

    } else {

        firstPlayer = "player2";
    }


    // Sirf Player 1 Firebase state start karega

    if (playerRole === "player1") {

        try {

            const roomRef =
                ref(
                    db,
                    "games/" + roomId
                );

            await update(
                roomRef,
                {
                    currentTurn: firstPlayer,
                    status: "playing",
                    moves: {},
                    lastMove: null,
                    winner: null
                }
            );

        }
        catch (error) {

            console.error(
                "Start Multiplayer Error:",
                error
            );
        }
    }
}


// ======================================================
// START GAME
// ======================================================

function startGame(firstTurn) {

    currentTurn =
        firstTurn;

    completedLineIndexes =
        [];

    gameOver =
        false;

    removeWinningLines();

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


// ======================================================
// CREATE GAME GRID
// ======================================================

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

            cell.dataset.number =
                number;

            cell.addEventListener(
                "click",
                function () {

                    if (playerRole) {

                        markMultiplayerCell(
                            cell
                        );

                    } else {

                        markOfflineCell(
                            cell
                        );
                    }

                }
            );

            gameGrid.appendChild(
                cell
            );
        }
    );
}


// ======================================================
// OFFLINE MARK CELL
// ======================================================

function markOfflineCell(cell) {

    if (gameOver) {
        return;
    }

    if (
        cell.classList.contains(
            "marked-my"
        ) ||
        cell.classList.contains(
            "marked-opponent"
        )
    ) {
        return;
    }

    if (currentTurn === "my") {

        cell.classList.add(
            "marked-my"
        );

    } else {

        cell.classList.add(
            "marked-opponent"
        );
    }

    checkLines();

    if (gameOver) {
        return;
    }

    currentTurn =
        currentTurn === "my"
            ? "opponent"
            : "my";

    updateTurnIndicator();
}


// ======================================================
// MULTIPLAYER MARK CELL
// ======================================================

async function markMultiplayerCell(cell) {

    if (gameOver) {
        return;
    }

    if (!roomId || !playerRole) {
        return;
    }


    // Local Firebase data check

    if (
        !latestRoomData ||
        latestRoomData.status !== "playing"
    ) {
        return;
    }


    // Wrong turn

    if (
        latestRoomData.currentTurn !==
        playerRole
    ) {

        return;
    }


    const number =
        Number(
            cell.dataset.number
        );


    // Firebase transaction

    const roomRef =
        ref(
            db,
            "games/" + roomId
        );


    try {

        await runTransaction(
            roomRef,
            function (room) {

                if (!room) {
                    return room;
                }

                if (
                    room.status !==
                    "playing"
                ) {
                    return;
                }


                // Check turn again inside transaction

                if (
                    room.currentTurn !==
                    playerRole
                ) {
                    return;
                }


                if (!room.moves) {

                    room.moves = {};
                }


                // Number already called

                if (
                    room.moves[number] !==
                    undefined
                ) {
                    return;
                }


                // Save move

                room.moves[number] =
                    playerRole;


                // Save latest move

                room.lastMove = {

                    number: number,

                    player: playerRole,

                    time: Date.now()

                };


                // Automatically change turn

                room.currentTurn =
                    playerRole === "player1"
                        ? "player2"
                        : "player1";


                return room;
            }
        );

    }
    catch (error) {

        console.error(
            "Move Error:",
            error
        );
    }
}


// ======================================================
// RENDER MULTIPLAYER MARKS
// ======================================================

function renderMultiplayerMarks(data) {

    if (!data) {
        return;
    }

    const moves =
        data.moves || {};

    const cells =
        document.querySelectorAll(
            ".game-cell"
        );


    cells.forEach(
        function (cell) {

            const number =
                Number(
                    cell.dataset.number
                );

            const moveBy =
                moves[number];


            cell.classList.remove(
                "marked-my"
            );

            cell.classList.remove(
                "marked-opponent"
            );


            if (!moveBy) {
                return;
            }


            if (
                moveBy ===
                playerRole
            ) {

                // Apna move = GREEN

                cell.classList.add(
                    "marked-my"
                );

            } else {

                // Opponent ka move = RED

                cell.classList.add(
                    "marked-opponent"
                );
            }

        }
    );


    updateMultiplayerBingo();
}


// ======================================================
// MULTIPLAYER BINGO
// ======================================================

function updateMultiplayerBingo() {

    if (
        !latestRoomData ||
        !latestRoomData.moves ||
        !playerRole
    ) {
        return;
    }


    const moves =
        latestRoomData.moves;


    const markedNumbers =
        new Set(
            Object.keys(moves)
                .map(
                    number =>
                        Number(number)
                )
        );


    const completed =
        [];


    winningPatterns.forEach(
        function (
            pattern,
            patternIndex
        ) {

            const complete =
                pattern.every(
                    index => {

                        const number =
                            Number(
                                setupNumbers[index]
                            );

                        return markedNumbers.has(
                            number
                        );
                    }
                );


            if (complete) {

                completed.push(
                    patternIndex
                );
            }
        }
    );


    completedLineIndexes =
        completed;


    updateBingoStatus();


    // Winning lines

    removeWinningLines();

    completed.forEach(
        function (patternIndex) {

            drawWinningLine(
                winningPatterns[
                    patternIndex
                ],
                patternIndex
            );
        }
    );


    // 5 lines = BINGO

    if (
        completed.length >= 5 &&
        !gameOver
    ) {

        gameOver = true;

        const winner =
            playerRole;


        // Only current player writes winner

        const roomRef =
            ref(
                db,
                "games/" + roomId
            );


        runTransaction(
            roomRef,
            function (room) {

                if (!room) {
                    return room;
                }

                if (
                    room.status ===
                    "finished"
                ) {
                    return;
                }

                room.status =
                    "finished";

                room.winner =
                    winner;

                return room;
            }
        );
    }
}


// ======================================================
// TURN INDICATOR
// ======================================================

function updateTurnIndicator() {

    if (!playerRole) {

        if (
            currentTurn === "my"
        ) {

            turnIndicator.className =
                "turn-indicator my-turn";

            turnText.innerText =
                "MY TURN";

        } else {

            turnIndicator.className =
                "turn-indicator opponent-turn";

            turnText.innerText =
                "OPPONENT TURN";
        }

        return;
    }


    if (
        currentTurn ===
        playerRole
    ) {

        turnIndicator.className =
            "turn-indicator my-turn";

        turnText.innerText =
            "MY TURN";

    } else {

        turnIndicator.className =
            "turn-indicator opponent-turn";

        turnText.innerText =
            "OPPONENT TURN";
    }
}


// ======================================================
// WINNING PATTERNS
// ======================================================

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


// ======================================================
// CHECK OFFLINE LINES
// ======================================================

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

            if (
                completedLineIndexes.includes(
                    patternIndex
                )
            ) {
                return;
            }


            const completed =
                pattern.every(
                    index =>

                        cells[index]
                            .classList
                            .contains(
                                "marked-my"
                            )

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


// ======================================================
// UPDATE BINGO STATUS
// ======================================================

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

            } else {

                letter.classList.remove(
                    "active"
                );
            }
        }
    );
}


// ======================================================
// DRAW WINNING LINE
// ======================================================

function drawWinningLine(
    pattern,
    patternIndex
) {

    const cells =
        document.querySelectorAll(
            ".game-cell"
        );

    const grid =
        document.getElementById(
            "gameGrid"
        );


    if (
        !cells[pattern[0]] ||
        !cells[pattern[4]]
    ) {
        return;
    }


    // Don't draw duplicate line

    if (
        grid.querySelector(
            `.winning-line[data-line="${patternIndex}"]`
        )
    ) {
        return;
    }


    const firstCell =
        cells[pattern[0]];

    const lastCell =
        cells[pattern[4]];


    const gridRect =
        grid.getBoundingClientRect();

    const firstRect =
        firstCell.getBoundingClientRect();

    const lastRect =
        lastCell.getBoundingClientRect();


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


    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const angle =
        Math.atan2(
            dy,
            dx
        ) *
        180 /
        Math.PI;


    const line =
        document.createElement(
            "div"
        );


    line.className =
        "winning-line";

    line.dataset.line =
        patternIndex;


    line.style.width =
        `${length}px`;

    line.style.left =
        `${x1}px`;

    const lineHeight = 8;

    line.style.top =
        `${y1 - lineHeight / 2}px`;

    line.style.transform =
        `rotate(${angle}deg)`;


    grid.appendChild(
        line
    );
}


// ======================================================
// REMOVE WINNING LINES
// ======================================================

function removeWinningLines() {

    document
        .querySelectorAll(
            ".winning-line"
        )
        .forEach(
            line =>
                line.remove()
        );
}


// ======================================================
// SHOW WINNER
// ======================================================

function showWinner() {

    if (!playerRole) {

        if (
            currentTurn === "my"
        ) {

            winnerText.innerText =
                "🎉 YOU WIN!";

        } else {

            winnerText.innerText =
                "🏆 OPPONENT WINS!";
        }

    } else {

        if (
            latestRoomData &&
            latestRoomData.winner ===
            playerRole
        ) {

            winnerText.innerText =
                "🎉 YOU WIN!";

        } else {

            winnerText.innerText =
                "🏆 OPPONENT WINS!";
        }
    }


    winnerPopup.classList.remove(
        "hidden"
    );
}


// ======================================================
// REVERSE LAST MOVE
// ======================================================

async function reverseLastMove() {

    if (!playerRole) {
        return;
    }

    if (!roomId) {
        return;
    }

    if (!latestRoomData) {
        return;
    }

    if (
        latestRoomData.status !==
        "playing"
    ) {
        return;
    }


    const lastMove =
        latestRoomData.lastMove;


    if (!lastMove) {
        return;
    }


    // Sirf latest move karne wala
    // player reverse kar sakta hai

    if (
        lastMove.player !==
        playerRole
    ) {
        return;
    }


    const roomRef =
        ref(
            db,
            "games/" + roomId
        );


    try {

        await runTransaction(
            roomRef,
            function (room) {

                if (!room) {
                    return room;
                }


                if (
                    room.status !==
                    "playing"
                ) {
                    return;
                }


                if (
                    !room.lastMove
                ) {
                    return;
                }


                if (
                    room.lastMove.player !==
                    playerRole
                ) {
                    return;
                }


                const number =
                    room.lastMove.number;


                if (
                    room.moves &&
                    room.moves[number] !==
                    undefined
                ) {

                    delete room.moves[
                        number
                    ];
                }


                // Turn wapas us player ki

                room.currentTurn =
                    playerRole;


                room.lastMove =
                    null;


                return room;
            }
        );

    }
    catch (error) {

        console.error(
            "Reverse Error:",
            error
        );
    }
}


// ======================================================
// ADD REVERSE BUTTON
// ======================================================

function createReverseButton() {

    let reverseBtn =
        document.getElementById(
            "reverseBtn"
        );


    if (reverseBtn) {
        return;
    }


    reverseBtn =
        document.createElement(
            "button"
        );

    reverseBtn.id =
        "reverseBtn";

    reverseBtn.type =
        "button";

    reverseBtn.className =
        "reverse-btn";

    reverseBtn.innerText =
        "↩ REVERSE LAST MOVE";


    reverseBtn.addEventListener(
        "click",
        reverseLastMove
    );


    gameScreen.appendChild(
        reverseBtn
    );
}


// ======================================================
// UPDATE REVERSE BUTTON
// ======================================================

function updateReverseButton(data) {

    const reverseBtn =
        document.getElementById(
            "reverseBtn"
        );

    if (!reverseBtn) {
        return;
    }


    if (
        !playerRole ||
        !data ||
        !data.lastMove ||
        data.status !== "playing"
    ) {

        reverseBtn.disabled =
            true;

        reverseBtn.style.opacity =
            "0.45";

        return;
    }


    if (
        data.lastMove.player ===
        playerRole
    ) {

        reverseBtn.disabled =
            false;

        reverseBtn.style.opacity =
            "1";

    } else {

        reverseBtn.disabled =
            true;

        reverseBtn.style.opacity =
            "0.45";
    }
}


// ======================================================
// NEW GAME
// ======================================================

async function newGame() {

    winnerPopup.classList.add(
        "hidden"
    );

    gameOver = false;

    completedLineIndexes = [];

    removeWinningLines();


    // OFFLINE

    if (!playerRole) {

        setupNumbers =
            new Array(25).fill(null);

        currentNumber = 1;

        currentTurn = "my";

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

        return;
    }


    // MULTIPLAYER

    if (roomId) {

        try {

            const roomRef =
                ref(
                    db,
                    "games/" + roomId
                );


            const boardKey =
                playerRole === "player1"
                    ? "player1Board"
                    : "player2Board";


            const readyKey =
                playerRole === "player1"
                    ? "player1Ready"
                    : "player2Ready";


            await update(
                roomRef,
                {
                    [boardKey]: null,
                    [readyKey]: false,

                    player1TurnChoice: null,
                    player2TurnChoice: null,

                    currentTurn: null,

                    moves: {},

                    lastMove: null,

                    winner: null,

                    status: "waiting"
                }
            );


            setupNumbers =
                new Array(25).fill(null);

            currentNumber = 1;

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
        catch (error) {

            console.error(
                "New Game Error:",
                error
            );
        }
    }
}


// ======================================================
// NEW GAME BUTTONS
// ======================================================

newGameBtn.addEventListener(
    "click",
    newGame
);

winnerNewGame.addEventListener(
    "click",
    newGame
);


// ======================================================
// ROOM MESSAGE
// ======================================================

function showRoomMessage(message) {

    roomMessage.innerText =
        message;
}


// ======================================================
// ROOM ID VALIDATION
// ======================================================

function validRoomId(id) {

    return /^\d{4}$/.test(id);
}


// ======================================================
// ONLY NUMBERS IN ROOM INPUT
// ======================================================

roomIdInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .replace(/\D/g, "")
                .slice(0, 4);
    }
);


// ======================================================
// OPEN BINGO SETUP
// ======================================================

function openBingoSetup() {

    modeScreen.classList.add(
        "hidden"
    );

    roomScreen.classList.add(
        "hidden"
    );

    turnScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.add(
        "hidden"
    );

    winnerPopup.classList.add(
        "hidden"
    );

    setupScreen.classList.remove(
        "hidden"
    );

    setupNumbers =
        new Array(25).fill(null);

    currentNumber = 1;

    createSetupGrid();

    updateSetupUI();
}

// ========================================
// CREATE ROOM
// ========================================

createRoomBtn.addEventListener("click", async () => {

    const id = roomIdInput.value.trim();

    if (!validRoomId(id)) {
        showRoomMessage("⚠️ 4 digit Room ID enter karo");
        return;
    }

    try {

        showRoomMessage("⏳ Room create ho raha hai...");

        const r = ref(db, `games/${id}`);

        // Same Room ID ho to bhi PURANA ROOM RESET karke
        // NAYA ROOM create hoga.
        await set(r, {

            player1: true,
            player2: false,

            status: "waiting",

            player1Board: null,
            player2Board: null,

            player1Ready: false,
            player2Ready: false,

            player1TurnChoice: null,
            player2TurnChoice: null,

            currentTurn: null,

            moves: {},

            lastMove: null,

            winner: null
        });

        roomId = id;
        playerRole = "player1";

        showRoomMessage("🎮 Room created!");

        openBingoSetup();

        listenToRoom();

    } catch (error) {

        console.error("Create Room Error:", error);

        showRoomMessage("❌ Room create nahi hua.");
    }

});

// ======================================================
// JOIN ROOM
// ======================================================

joinRoomBtn.addEventListener(
    "click",
    async function () {

        const id =
            roomIdInput.value.trim();


        if (
            !validRoomId(id)
        ) {

            showRoomMessage(
                "⚠️ 4 digit Room ID enter karo"
            );

            return;
        }


        try {

            showRoomMessage(
                "⏳ Room check ho raha hai..."
            );


            const roomRef =
                ref(
                    db,
                    "games/" + id
                );


            const snapshot =
                await get(roomRef);


            if (
                !snapshot.exists()
            ) {

                showRoomMessage(
                    "❌ Room nahi mila."
                );

                return;
            }


            const roomData =
                snapshot.val();


            if (
                roomData.player2 === true
            ) {

                showRoomMessage(
                    "❌ Room full hai."
                );

                return;
            }


            await update(
                roomRef,
                {
                    player2: true,
                    status: "waiting"
                }
            );


            roomId =
                id;

            playerRole =
                "player2";


            openBingoSetup();

            listenToRoom();

        }
        catch (error) {

            console.error(
                "Join Room Error:",
                error
            );

            showRoomMessage(
                "❌ Room join nahi hua."
            );
        }
    }
);


// ======================================================
// WAIT FOR OPPONENT
// ======================================================

function waitForOpponent() {

    if (waitingListenerStarted) {
        return;
    }

    waitingListenerStarted = true;


    const roomRef =
        ref(
            db,
            "games/" + roomId
        );


    onValue(
        roomRef,
        function (snapshot) {

            if (
                !snapshot.exists()
            ) {
                return;
            }


            const data =
                snapshot.val();


            latestRoomData =
                data;


            if (
                data.player2 === true
            ) {

                listenToRoom();
            }
        }
    );
}


// ======================================================
// LISTEN TO ROOM
// ======================================================

function listenToRoom() {

    if (
        !roomId ||
        roomListenerStarted
    ) {
        return;
    }


    roomListenerStarted = true;


    const roomRef =
        ref(
            db,
            "games/" + roomId
        );


    onValue(
        roomRef,
        async function (snapshot) {

            if (
                !snapshot.exists()
            ) {
                return;
            }


            const data =
                snapshot.val();


            latestRoomData =
                data;


            console.log(
                "Firebase Room Data:",
                data
            );


            // ==================================================
            // BOTH PLAYERS READY
            // ==================================================

            if (
                data.player1Ready === true &&
                data.player2Ready === true
            ) {

                if (
                    turnScreen.classList.contains(
                        "hidden"
                    ) &&
                    data.status !==
                    "playing"
                ) {

                    setupScreen.classList.add(
                        "hidden"
                    );

                    turnScreen.classList.remove(
                        "hidden"
                    );
                }
            }


            // ==================================================
            // PROCESS TURN CHOICES
            // ==================================================

            if (
                data.player1Ready === true &&
                data.player2Ready === true &&
                data.player1TurnChoice &&
                data.player2TurnChoice &&
                data.status !== "playing" &&
                data.status !== "finished"
            ) {

                await processTurnChoices(
                    data
                );
            }


            // ==================================================
            // GAME START
            // ==================================================

            if (
                data.status === "playing"
            ) {

                gameScreen.classList.remove(
                    "hidden"
                );

                setupScreen.classList.add(
                    "hidden"
                );

                turnScreen.classList.add(
                    "hidden"
                );


                // Apna board load karo

                const myBoard =
                    playerRole === "player1"
                        ? data.player1Board
                        : data.player2Board;


                if (
                    Array.isArray(myBoard)
                ) {

                    setupNumbers =
                        myBoard;
                }


                createGameGrid();


                currentTurn =
                    data.currentTurn;


                updateTurnIndicator();


                renderMultiplayerMarks(
                    data
                );


                createReverseButton();

                updateReverseButton(
                    data
                );
            }


            // ==================================================
            // FINISHED
            // ==================================================

            if (
                data.status === "finished"
            ) {

                currentTurn =
                    data.currentTurn ||
                    currentTurn;


                renderMultiplayerMarks(
                    data
                );

                createReverseButton();

                updateReverseButton(
                    data
                );


                if (
                    data.winner
                ) {

                    gameOver = true;

                    setTimeout(
                        function () {

                            if (
                                data.winner ===
                                playerRole
                            ) {

                                winnerText.innerText =
                                    "🎉 YOU WIN!";

                            } else {

                                winnerText.innerText =
                                    "🏆 OPPONENT WINS!";
                            }


                            winnerPopup.classList.remove(
                                "hidden"
                            );

                        },
                        300
                    );
                }
            }


            // ==================================================
            // UPDATE TURN
            // ==================================================

            if (
                data.currentTurn &&
                data.status === "playing"
            ) {

                currentTurn =
                    data.currentTurn;

                updateTurnIndicator();
            }


            // ==================================================
            // UPDATE MARKS
            // ==================================================

            if (
                data.status === "playing" ||
                data.status === "finished"
            ) {

                renderMultiplayerMarks(
                    data
                );

                updateReverseButton(
                    data
                );
            }

        }
    );
}


// ======================================================
// INITIALIZE APP
// ======================================================

modeScreen.classList.remove(
    "hidden"
);

roomScreen.classList.add(
    "hidden"
);

setupScreen.classList.add(
    "hidden"
);

turnScreen.classList.add(
    "hidden"
);

gameScreen.classList.add(
    "hidden"
);

winnerPopup.classList.add(
    "hidden"
);