// ===============================
// 🚗 NÉ XE
// ===============================

const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const gameOver = document.getElementById("gameOver");
const historyScreen = document.getElementById("historyScreen");
const recordsScreen = document.getElementById("recordsScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const historyBtn = document.getElementById("historyBtn");
const recordsBtn = document.getElementById("recordsBtn");

const historyBackBtn = document.getElementById("historyBackBtn");
const recordsBackBtn = document.getElementById("recordsBackBtn");

const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const road = document.getElementById("road");
const player = document.getElementById("player");
const enemiesContainer = document.getElementById("enemies");

const scoreText = document.getElementById("score");
const dodgedText = document.getElementById("dodged");
const livesText = document.getElementById("lives");

const finalScore = document.getElementById("finalScore");
const finalDodged = document.getElementById("finalDodged");
const finalTime = document.getElementById("finalTime");
const newRecord = document.getElementById("newRecord");

const bestScore = document.getElementById("bestScore");
const bestDodged = document.getElementById("bestDodged");
const bestTime = document.getElementById("bestTime");

const historyList = document.getElementById("historyList");
const emptyHistory = document.getElementById("emptyHistory");

const crashEffect = document.getElementById("crashEffect");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");


// ===============================
// GAME VARIABLES
// ===============================

let score = 0;
let dodged = 0;
let lives = 3;

let playerX = 50;

let gameRunning = false;

let gameSpeed = 4;
let spawnInterval = 1000;

let enemies = [];

let lastSpawn = 0;
let animationId;

let startTime = 0;
let elapsedTime = 0;

let keys = {
    left: false,
    right: false
};


// ===============================
// STORAGE
// ===============================

function getHistory() {
    return JSON.parse(localStorage.getItem("carGameHistory")) || [];
}

function saveHistory(data) {

    const history = getHistory();

    history.push(data);

    // Chỉ giữ lại 50 ván gần nhất
    if (history.length > 50) {
        history.shift();
    }

    localStorage.setItem(
        "carGameHistory",
        JSON.stringify(history)
    );
}


// ===============================
// SCREEN
// ===============================

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach(s => {
        s.classList.remove("active");
    });

    screen.classList.add("active");
}


// ===============================
// START GAME
// ===============================

function startGame() {

    score = 0;
    dodged = 0;
    lives = 3;

    playerX = 50;

    gameSpeed = 4;
    spawnInterval = 1000;

    enemies = [];

    enemiesContainer.innerHTML = "";

    player.style.left = "50%";

    scoreText.textContent = "0";
    dodgedText.textContent = "0";
    livesText.textContent = "❤️❤️❤️";

    newRecord.style.display = "none";

    startTime = Date.now();

    gameRunning = true;

    showScreen(gameScreen);

    lastSpawn = performance.now();

    cancelAnimationFrame(animationId);

    animationId = requestAnimationFrame(gameLoop);
}


// ===============================
// GAME LOOP
// ===============================

function gameLoop(time) {

    if (!gameRunning) return;

    elapsedTime = Math.floor(
        (Date.now() - startTime) / 1000
    );

    // Tăng tốc theo thời gian
    gameSpeed = 4 + elapsedTime * 0.08;

    // Tạo xe mới
    if (time - lastSpawn > spawnInterval) {

        spawnEnemy();

        lastSpawn = time;

        spawnInterval = Math.max(
            450,
            1000 - elapsedTime * 8
        );
    }

    movePlayer();

    moveEnemies();

    checkCollisions();

    moveRoadLines();

    animationId = requestAnimationFrame(gameLoop);
}


// ===============================
// PLAYER
// ===============================

function movePlayer() {

    if (keys.left) {
        playerX -= 0.8;
    }

    if (keys.right) {
        playerX += 0.8;
    }

    playerX = Math.max(
        10,
        Math.min(90, playerX)
    );

    player.style.left = playerX + "%";
}


// ===============================
// KEYBOARD
// ===============================

document.addEventListener("keydown", e => {

    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        keys.left = true;
    }

    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        keys.right = true;
    }
});


document.addEventListener("keyup", e => {

    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        keys.left = false;
    }

    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        keys.right = false;
    }
});


// ===============================
// MOBILE CONTROLS
// ===============================

leftBtn.addEventListener("pointerdown", () => {
    keys.left = true;
});

leftBtn.addEventListener("pointerup", () => {
    keys.left = false;
});

leftBtn.addEventListener("pointerleave", () => {
    keys.left = false;
});


rightBtn.addEventListener("pointerdown", () => {
    keys.right = true;
});

rightBtn.addEventListener("pointerup", () => {
    keys.right = false;
});

rightBtn.addEventListener("pointerleave", () => {
    keys.right = false;
});


// ===============================
// SPAWN ENEMY
// ===============================

function spawnEnemy() {

    const enemy = document.createElement("div");

    enemy.className = "enemy";

    const cars = [
        "🚙",
        "🚕",
        "🚓",
        "🚑",
        "🚐",
        "🏎️"
    ];

    enemy.textContent =
        cars[Math.floor(Math.random() * cars.length)];

    const x = Math.random() * 80 + 10;

    enemy.style.left = x + "%";
    enemy.style.top = "-70px";

    enemiesContainer.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: x,
        y: -70,
        passed: false
    });
}


// ===============================
// MOVE ENEMIES
// ===============================

function moveEnemies() {

    enemies.forEach(enemy => {

        enemy.y += gameSpeed;

        enemy.element.style.top =
            enemy.y + "px";

        // Xe đã đi qua người chơi
        if (
            !enemy.passed &&
            enemy.y > road.clientHeight
        ) {

            enemy.passed = true;

            dodged++;

            score += 10;

            scoreText.textContent = score;
            dodgedText.textContent = dodged;
        }

    });

    // Xóa xe đã ra khỏi màn hình
    enemies = enemies.filter(enemy => {

        if (enemy.y > road.clientHeight + 100) {

            enemy.element.remove();

            return false;
        }

        return true;
    });
}


// ===============================
// COLLISION
// ===============================

function checkCollisions() {

    const playerRect =
        player.getBoundingClientRect();

    for (let i = enemies.length - 1; i >= 0; i--) {

        const enemy = enemies[i];

        const enemyRect =
            enemy.element.getBoundingClientRect();

        const collision =
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top;

        if (collision) {

            enemy.element.remove();

            enemies.splice(i, 1);

            hitPlayer();

            break;
        }
    }
}


// ===============================
// PLAYER HIT
// ===============================

function hitPlayer() {

    lives--;

    updateLives();

    crashEffect.style.display = "block";

    crashEffect.style.left =
        player.offsetLeft + "px";

    crashEffect.style.top =
        player.offsetTop - 30 + "px";

    crashEffect.classList.remove("crashing");

    void crashEffect.offsetWidth;

    crashEffect.classList.add("crashing");

    setTimeout(() => {
        crashEffect.style.display = "none";
    }, 500);

    // Làm xe nhấp nháy
    player.style.opacity = "0.3";

    setTimeout(() => {
        player.style.opacity = "1";
    }, 250);

    if (lives <= 0) {
        endGame();
    }
}


// ===============================
// LIVES
// ===============================

function updateLives() {

    livesText.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(3 - lives);
}


// ===============================
// ROAD ANIMATION
// ===============================

function moveRoadLines() {

    const lines =
        document.querySelectorAll(".road-line");

    lines.forEach(line => {

        let top =
            parseFloat(getComputedStyle(line).top);

        top += gameSpeed;

        if (top > road.clientHeight) {
            top = -100;
        }

        line.style.top = top + "px";
    });
}


// ===============================
// END GAME
// ===============================

function endGame() {

    gameRunning = false;

    cancelAnimationFrame(animationId);

    const timeText =
        formatTime(elapsedTime);

    finalScore.textContent = score;

    finalDodged.textContent = dodged;

    finalTime.textContent = timeText;

    const oldBest =
        Number(localStorage.getItem("bestScore")) || 0;

    if (score > oldBest) {

        localStorage.setItem(
            "bestScore",
            score
        );

        newRecord.style.display = "block";

    } else {

        newRecord.style.display = "none";
    }

    const historyData = {

        score: score,

        dodged: dodged,

        time: elapsedTime,

        date: new Date().toLocaleString("vi-VN")

    };

    saveHistory(historyData);

    updateRecords();

    showScreen(gameOver);
}


// ===============================
// FORMAT TIME
// ===============================

function formatTime(seconds) {

    const min =
        Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");

    const sec =
        (seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${min}:${sec}`;
}


// ===============================
// HISTORY
// ===============================

function renderHistory() {

    const history = getHistory();

    historyList.innerHTML = "";

    if (history.length === 0) {

        emptyHistory.style.display = "block";

        return;
    }

    emptyHistory.style.display = "none";

    // Điểm cao nhất lên đầu
    const sorted =
        [...history].sort(
            (a, b) => b.score - a.score
        );

    sorted.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "history-item";

        let medal = "🎮";

        if (index === 0) medal = "🥇";
        if (index === 1) medal = "🥈";
        if (index === 2) medal = "🥉";

        div.innerHTML = `
            <div class="history-rank">
                ${medal}
            </div>

            <div>
                <div class="history-score">
                    ${item.score} điểm
                </div>

                <div class="history-info">
                    ⏱️ ${formatTime(item.time)}
                    &nbsp; • &nbsp;
                    🚙 ${item.dodged} xe
                    <br>
                    📅 ${item.date}
                </div>
            </div>

            <div class="history-points">
                +${item.score}
            </div>
        `;

        historyList.appendChild(div);
    });
}


// ===============================
// RECORDS
// ===============================

function updateRecords() {

    const history = getHistory();

    if (history.length === 0) {

        bestScore.textContent = "0";
        bestDodged.textContent = "0";
        bestTime.textContent = "00:00";

        return;
    }

    const highestScore =
        Math.max(
            ...history.map(item => item.score)
        );

    const highestDodged =
        Math.max(
            ...history.map(item => item.dodged)
        );

    const longestTime =
        Math.max(
            ...history.map(item => item.time)
        );

    bestScore.textContent =
        highestScore;

    bestDodged.textContent =
        highestDodged;

    bestTime.textContent =
        formatTime(longestTime);
}


// ===============================
// BUTTON EVENTS
// ===============================

startBtn.addEventListener(
    "click",
    startGame
);

restartBtn.addEventListener(
    "click",
    startGame
);

homeBtn.addEventListener(
    "click",
    () => showScreen(menu)
);

historyBtn.addEventListener(
    "click",
    () => {

        renderHistory();

        showScreen(historyScreen);
    }
);

recordsBtn.addEventListener(
    "click",
    () => {

        updateRecords();

        showScreen(recordsScreen);
    }
);

historyBackBtn.addEventListener(
    "click",
    () => showScreen(menu)
);

recordsBackBtn.addEventListener(
    "click",
    () => showScreen(menu)
);


// ===============================
// CLEAR HISTORY
// ===============================

clearHistoryBtn.addEventListener(
    "click",
    () => {

        if (
            confirm(
                "Bạn có chắc muốn xóa toàn bộ lịch sử?"
            )
        ) {

            localStorage.removeItem(
                "carGameHistory"
            );

            renderHistory();

            updateRecords();
        }
    }
);


// ===============================
// INIT
// ===============================

updateRecords();