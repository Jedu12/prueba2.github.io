const playBoard = document.querySelector(".play-board");
const backgroundMusic = document.getElementById("background-music");
const eatSound = document.getElementById("eat-sound");
const nicknameForm = document.getElementById("nickname-form");
const nicknameInput = document.getElementById("nickname");
const rankingList = document.getElementById("ranking-list");

let foodX, foodY;
let snakeX = 5;
let snakeY = 10;
let snakeBody = [];
let velocityX = 0;
let velocityY = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
let gameInterval;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

const handleGameOver = () => {
    clearInterval(gameInterval); 
    nicknameForm.style.display = 'block';  
    alert("Game Over! Press OK to restart.");
};

const submitNickname = (e) => {
    e.preventDefault();
    let nickname = nicknameInput.value.trim() || 'Anonymous';
    if (nickname === 'Anonymous') {
        alert("Please enter a nickname.");
        return;
    }
    rankings.push({ nickname: nickname, score: score });
    rankings.sort((a, b) => b.score - a.score);
    localStorage.setItem('rankings', JSON.stringify(rankings));
    updateRankings();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    nicknameForm.style.display = 'none'; 
    nicknameInput.value = '';  
    startGame(); 
};

const startGame = () => {
    resetGame();
    gameInterval = setInterval(initGame, 125); 
};

const resetGame = () => {
    snakeX = 5;
    snakeY = 10;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    score = 0;
    changeFoodPosition();
    updateScore();
};

const updateScore = () => {
    document.querySelector(".score").textContent = `Score: ${score}`;
    document.querySelector(".high-score").textContent = `High Score: ${highScore}`;
};

const initGame = () => {
    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        handleGameOver();
        return;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            handleGameOver();
            return;
        }
    }

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        eatSound.play().catch((error) => {
            console.error("Error playing eat sound:", error);
        });
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX - velocityX, snakeY - velocityY];
    }

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
    htmlMarkup += `<div class="head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;

    playBoard.innerHTML = htmlMarkup;

    updateScore();
};

const updateRankings = () => {
    rankingList.innerHTML = "";
    rankings.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${entry.nickname}: ${entry.score}`;
        rankingList.appendChild(listItem);
    });
};

document.addEventListener("keydown", changeDirection);

nicknameForm.addEventListener("submit", submitNickname);

window.addEventListener("load", () => {
    backgroundMusic.play().catch((error) => {
        console.error("Error playing background music:", error);
    });
    updateRankings();
});



