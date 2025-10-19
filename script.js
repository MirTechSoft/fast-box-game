const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
const candyWidth = gridSize;
const candyHeight = gridSize;
let candyX = Math.floor(canvas.width / 2 / gridSize) * gridSize;
let candyY = Math.floor((canvas.height - candyHeight - 10) / gridSize) * gridSize;
let obstacles = [];
let score = 0;
let gameOver = false;
let level = 1;
let keys = {};
let obstacleSpeed = 2;
let obstacleInterval = 2000;

// Event listeners for candy movement
document.addEventListener('keydown', (event) => keys[event.key] = true);
document.addEventListener('keyup', (event) => keys[event.key] = false);

function moveCandy() {
    if (keys['ArrowLeft'] && candyX > 0) {
        candyX -= gridSize;
    }
    if (keys['ArrowRight'] && candyX < canvas.width - candyWidth) {
        candyX += gridSize;
    }
    if (keys['ArrowUp'] && candyY > 0) {
        candyY -= gridSize;
    }
    if (keys['ArrowDown'] && candyY < canvas.height - candyHeight) {
        candyY += gridSize;
    }
}


function createObstacle() {
    if (!gameOver) {
        const obstacle = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: -gridSize, // Ensure obstacles start outside the canvas at a grid position
            width: gridSize,
            height: gridSize,
            speed: obstacleSpeed,
            shape: Math.random() > 0.5 ? 'circle' : 'rectangle',
            color: ['#FF69B4', '#FFD700', '#32CD32', '#00BFFF', '#FF4500'][Math.floor(Math.random() * 5)]
        };
        obstacles.push(obstacle);
        setTimeout(createObstacle, obstacleInterval);
    }
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;
        
        if (obstacle.y > canvas.height) {
            gameOver = true;
        }
        
        if (
            candyX < obstacle.x + obstacle.width &&
            candyX + candyWidth > obstacle.x &&
            candyY < obstacle.y + obstacle.height &&
            candyY + candyHeight > obstacle.y
        ) {
            score += 10;
            obstacles.splice(index, 1);
            
            if (score % 50 === 0) {
                level++;
                obstacleSpeed += 0.5;
                obstacleInterval = Math.max(500, obstacleInterval - 200);
            }
        }
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;

        if (obstacle.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        ctx.shadowBlur = 0;
    });
}

function drawCandy() {
    ctx.fillStyle = '#ff69b4';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    ctx.fillRect(candyX, candyY, candyWidth, candyHeight);
    ctx.shadowBlur = 0;
}

function drawBackground() {
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFD1DC');
    gradient.addColorStop(1, '#FFB6C1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Level: ' + level, 10, 60);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 50);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    moveCandy();
    drawCandy();
    drawScore();
    drawObstacles();
    updateObstacles();

    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth * 0.8 / gridSize) * gridSize;
    canvas.height = Math.floor(window.innerHeight * 0.8 / gridSize) * gridSize;
    candyX = Math.floor(canvas.width / 2 / gridSize) * gridSize;
    candyY = Math.floor((canvas.height - candyHeight - 10) / gridSize) * gridSize;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
createObstacle();
gameLoop();

