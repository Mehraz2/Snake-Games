document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const startBtn = document.querySelector('.btn-start');
    const gameOverEl = document.querySelector('.game-over');
    const restartBtn = document.querySelector('.btn-restart');
    
    // UI Elements for Score & Time
    const scoreEl = document.getElementById('score');
    const highScoreEl = document.getElementById('high-score');
    const timeEl = document.getElementById('time');

    let isGameStarted = false;

    // Load stored High Score
    let highScore = localStorage.getItem('snake_high_score') || 0;
    highScoreEl.innerText = highScore;

    // ১. Modal থেকে গেম শুরু করার লজিক
    function startGame() {
        if (isGameStarted) return;
        isGameStarted = true;

        modal.classList.add('hide');

        setTimeout(() => {
            modal.style.display = 'none';
            initGame();
        }, 400);
    }

    if (startBtn) startBtn.addEventListener('click', startGame);

    document.addEventListener('keydown', (event) => {
        if (!isGameStarted && (event.code === 'Enter' || event.code === 'Space')) {
            event.preventDefault();
            startGame();
        }
    });

    // ২. মূল Snake Game এর লজিক
    function initGame() {
        const board = document.querySelector('.board');
        const blockHeight = 50;
        const blockWidth = 50;

        board.innerHTML = '';

        const cols = Math.floor(board.clientWidth / blockWidth);
        const rows = Math.floor(board.clientHeight / blockHeight);

        let intervalId = null;
        let timerIntervalId = null;

        let gameSpeed = 350; 
        const minSpeed = 40; 

        let currentScore = 0;
        let secondsPassed = 0;

        scoreEl.innerText = currentScore;
        timeEl.innerText = '00-00';

        timerIntervalId = setInterval(() => {
            secondsPassed++;
            const mins = String(Math.floor(secondsPassed / 60)).padStart(2, '0');
            const secs = String(secondsPassed % 60).padStart(2, '0');
            timeEl.innerText = `${mins}-${secs}`;
        }, 1000);

        let food = { 
            x: Math.floor(Math.random() * rows), 
            y: Math.floor(Math.random() * cols)
        };

        const blocks = {};
        let snake = [
            { x: 1, y: 3 }
        ];

        let direction = 'down';

        function restartGameLoop() {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(gameStep, gameSpeed);
        }

        function generateFood() {
            food = { 
                x: Math.floor(Math.random() * rows),
                y: Math.floor(Math.random() * cols)
            };

            if (gameSpeed > minSpeed) {
                gameSpeed -= 40; 
                if (gameSpeed < minSpeed) gameSpeed = minSpeed;
                restartGameLoop(); 
            }
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const block = document.createElement('div');
                block.classList.add("block");
                board.appendChild(block);
                blocks[`${row}-${col}`] = block;
            }
        }

        function render() {
            for (let key in blocks) {
                blocks[key].classList.remove("fill", "food");
            }

            snake.forEach(segment => {
                if (blocks[`${segment.x}-${segment.y}`]) {
                    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
                }
            });

            if (blocks[`${food.x}-${food.y}`]) {
                blocks[`${food.x}-${food.y}`].classList.add("food");
            }
        }

        function handleGameOver() {
            clearInterval(intervalId);
            clearInterval(timerIntervalId);

            if (currentScore > highScore) {
                highScore = currentScore;
                localStorage.setItem('snake_high_score', highScore);
                highScoreEl.innerText = highScore;
            }

            document.body.classList.add('game-screen-flash', 'shake-effect');

            setTimeout(() => {
                if (gameOverEl) gameOverEl.classList.add('active');
            }, 200);
        }

        function gameStep() {
            let head = null;

            if (direction === "left") {
                head = { x: snake[0].x, y: snake[0].y - 1 };
            } else if (direction === "right") {
                head = { x: snake[0].x, y: snake[0].y + 1 };
            } else if (direction === "down") {
                head = { x: snake[0].x + 1, y: snake[0].y };
            } else if (direction === "up") {
                head = { x: snake[0].x - 1, y: snake[0].y };
            }

            if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
                handleGameOver();
                return;
            }

            const isSelfCollision = snake.some(segment => segment.x === head.x && segment.y === head.y);
            if (isSelfCollision) {
                handleGameOver();
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                currentScore += 10;
                scoreEl.innerText = currentScore;

                if (currentScore > highScore) {
                    highScore = currentScore;
                    highScoreEl.innerText = highScore;
                }

                generateFood();
            } else {
                snake.pop();
            }

            render();
        }

        restartGameLoop();

        // দিক পরিবর্তনের কমন ফাংশন
        function changeDirection(newDir) {
            if (newDir === "up" && direction !== "down") direction = "up";
            if (newDir === "down" && direction !== "up") direction = "down";
            if (newDir === "left" && direction !== "right") direction = "left";
            if (newDir === "right" && direction !== "left") direction = "right";
        }

        // সাপের দিক নিয়ন্ত্রণের জন্য Key Listener (Desktop)
        const keyHandler = (event) => {
            if (event.key === "ArrowUp") changeDirection("up");
            else if (event.key === "ArrowDown") changeDirection("down");
            else if (event.key === "ArrowLeft") changeDirection("left");
            else if (event.key === "ArrowRight") changeDirection("right");
        };

        window.addEventListener("keydown", keyHandler);

        // 📱 মোবাইল বাটন কন্ট্রোল এরিয়া
        const btnUp = document.getElementById('btn-up');
        const btnDown = document.getElementById('btn-down');
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');

        // ক্লিকে ল্যাগ কমানোর জন্য 'touchstart' / 'click' ব্যবহার করা হয়েছে
        const handleMobileBtn = (btn, dir) => {
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault(); // জুম/স্ক্রোল রোদ করতে
                    changeDirection(dir);
                });
                btn.addEventListener('click', () => changeDirection(dir));
            }
        };

        handleMobileBtn(btnUp, 'up');
        handleMobileBtn(btnDown, 'down');
        handleMobileBtn(btnLeft, 'left');
        handleMobileBtn(btnRight, 'right');

        // RESTART Button Event Logic
        if (restartBtn) {
            restartBtn.onclick = () => {
                window.removeEventListener("keydown", keyHandler);
                document.body.classList.remove('game-screen-flash', 'shake-effect');
                if (gameOverEl) gameOverEl.classList.remove('active');
                initGame();
            };
        }
    }
});