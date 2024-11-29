// Select DOM elements
const btnPlay = $('#play');
const btnReplay = $('#btn-replay');
const scoreDisplay = $('#score');
const finalScore = $('#final-score');
const highScoreDisplay = $('#High-score');
const gameOverBox = $('#game-over-box');
const wrapper = $('.wrapper');
const myCar = $('#car');

const lines = [$('#line1'), $('#line2'), $('#line3')];
const cars = [$('#car1'), $('#car2'), $('#car3')];

// Game settings
let isGameRunning = false;
let score = 0;
let speed = 2;
let gameHeight = wrapper.height();
let gameWidth = wrapper.width();
let carWidth = myCar.width();
let carHeight = myCar.height();

let moveUp = false,
    moveDown = false,
    moveLeft = false,
    moveRight = false;

// Start game event
btnPlay.click(() => {
    startGame();
});

// Restart game event
btnReplay.click(() => {
    restartGame();
});

// Start the game
function startGame() {
    isGameRunning = true;
    score = 0;
    speed = 2;

    // Hide play button and show game UI
    $('#btn-play').fadeOut();
    $('#score_div').fadeIn();

    // Begin gameplay
    startGameplay();
}

// Restart the game
function restartGame() {
    window.location.reload();
}

// Main gameplay function
function startGameplay() {
    // Reset variables
    isGameRunning = true;
    score = 0;
    updateScore(0);

    function gameLoop() {
        if (!isGameRunning) return;

        moveRoad();
        moveCars();

        // Collision check
        if (checkCollision()) {
            endGame();
            return;
        }

        // Update score periodically
        score++;
        updateScore(score);

        // Gradually increase speed
        if (score % 500 === 0) {
            speed++;
        }

        // Continue game loop
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // Enable movement
    enableCarControls();
}

// Function to end the game
function endGame() {
    isGameRunning = false;
    disableCarControls();

    // Show game over box
    gameOverBox.fadeIn();
    $('#score_div').fadeOut();
    finalScore.text(score);
    setHighScore(score);
}

// Function to move road lines
function moveRoad() {
    lines.forEach((line) => {
        const top = parseInt(line.css('top'));
        if (top >= gameHeight) {
            line.css('top', -150);
        } else {
            line.css('top', top + speed);
        }
    });
}

// Function to move opponent cars
function moveCars() {
    cars.forEach((car) => {
        const top = parseInt(car.css('top'));
        if (top >= gameHeight) {
            car.css('top', -200);
            car.css('left', Math.random() * (gameWidth - carWidth));
        } else {
            car.css('top', top + speed);
        }
    });
}

// Check for collision
function checkCollision() {
    return cars.some((car) => isColliding(myCar, car));
}

// Utility function to check collision between two elements
function isColliding($div1, $div2) {
    const rect1 = $div1[0].getBoundingClientRect();
    const rect2 = $div2[0].getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// Enable car controls
function enableCarControls() {
    $(document).on('keydown', (e) => {
        const key = e.keyCode;

        if (key === 37 && !moveLeft) {
            moveLeft = requestAnimationFrame(moveCarLeft);
        } else if (key === 39 && !moveRight) {
            moveRight = requestAnimationFrame(moveCarRight);
        } else if (key === 38 && !moveUp) {
            moveUp = requestAnimationFrame(moveCarUp);
        } else if (key === 40 && !moveDown) {
            moveDown = requestAnimationFrame(moveCarDown);
        }
    });

    $(document).on('keyup', (e) => {
        const key = e.keyCode;

        if (key === 37) {
            cancelAnimationFrame(moveLeft);
            moveLeft = false;
        } else if (key === 39) {
            cancelAnimationFrame(moveRight);
            moveRight = false;
        } else if (key === 38) {
            cancelAnimationFrame(moveUp);
            moveUp = false;
        } else if (key === 40) {
            cancelAnimationFrame(moveDown);
            moveDown = false;
        }
    });
}

// Disable car controls
function disableCarControls() {
    $(document).off('keydown');
    $(document).off('keyup');
}

// Car movement functions
function moveCarLeft() {
    const left = parseInt(myCar.css('left'));
    if (left > 0) {
        myCar.css('left', left - 5);
        moveLeft = requestAnimationFrame(moveCarLeft);
    }
}

function moveCarRight() {
    const left = parseInt(myCar.css('left'));
    if (left < gameWidth - carWidth) {
        myCar.css('left', left + 5);
        moveRight = requestAnimationFrame(moveCarRight);
    }
}

function moveCarUp() {
    const top = parseInt(myCar.css('top'));
    if (top > 0) {
        myCar.css('top', top - 5);
        moveUp = requestAnimationFrame(moveCarUp);
    }
}

function moveCarDown() {
    const top = parseInt(myCar.css('top'));
    if (top < gameHeight - carHeight) {
        myCar.css('top', top + 5);
        moveDown = requestAnimationFrame(moveCarDown);
    }
}

// Update the displayed score
function updateScore(newScore) {
    scoreDisplay.text(newScore);
}

// Set high score in local storage
function setHighScore(newScore) {
    const highScore = parseInt(localStorage.getItem('high_score')) || 0;
    if (newScore > highScore) {
        localStorage.setItem('high_score', newScore);
    }
    highScoreDisplay.text(localStorage.getItem('high_score'));
}
