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

        // Modal টি স্মুথলি গায়েব হবে
        modal.classList.add('hide');

        setTimeout(() => {
            modal.style.display = 'none';
            // মূল স্নেক গেম চালু হবে
            initGame();
        }, 400);
    }

    // Modal Events (Button Click & Keyboard Keypress)
    if (startBtn) startBtn.addEventListener('click', startGame);

    document.addEventListener('keydown', (event) => {
        if (!isGameStarted && (event.code === 'Enter' || event.code === 'Space')) {
            event.preventDefault(); // Space চাপলে পেজ যেন স্ক্রোল না হয়
            startGame();
        }
    });

    // ২. মূল Snake Game এর লজিক
    function initGame() {
        const board = document.querySelector('.board');
        const blockHeight = 50;
        const blockWidth = 50;

        // আগের বোর্ডের কোনো ব্লক থাকলে তা ক্লিয়ার করা
        board.innerHTML = '';

        const cols = Math.floor(board.clientWidth / blockWidth);
        const rows = Math.floor(board.clientHeight / blockHeight);

        let intervalId = null;
        let timerIntervalId = null;

        // প্রাথমিক স্পিড এবং মিনিমাম স্পিড (সুপার স্পিডের জন্য মডিফাই করা হয়েছে)
        let gameSpeed = 350; 
        const minSpeed = 40; 

        // Score and Time tracking variables
        let currentScore = 0;
        let secondsPassed = 0;

        scoreEl.innerText = currentScore;
        timeEl.innerText = '00-00';

        // Timer Start Logic
        timerIntervalId = setInterval(() => {
            secondsPassed++;
            const mins = String(Math.floor(secondsPassed / 60)).padStart(2, '0');
            const secs = String(secondsPassed % 60).padStart(2, '0');
            timeEl.innerText = `${mins}-${secs}`;
        }, 1000);

        // খাবারের র্যান্ডম পজিশন
        let food = { 
            x: Math.floor(Math.random() * rows), 
            y: Math.floor(Math.random() * cols)
        };

        const blocks = {};
        let snake = [
            { x: 1, y: 3 }
        ];

        let direction = 'down';

        // 🚀 স্পিড আপডেট এবং টাইমার রিস্টার্ট ফাংশন (ঠিক করা হয়েছে)
        function restartGameLoop() {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(gameStep, gameSpeed);
        }

        // নতুন খাবার তৈরি এবং স্পিড বাড়ানোর লজিক
        function generateFood() {
            food = { 
                x: Math.floor(Math.random() * rows),
                y: Math.floor(Math.random() * cols)
            };

            // প্রতিবার খাবার খেলে গতি অনেক দ্রুত (Super Fast) বাড়বে
            if (gameSpeed > minSpeed) {
                gameSpeed -= 40; // ৫০ms করে টাইম ইন্টারভাল কমবে (দ্রুত গতি বাড়বে)
                if (gameSpeed < minSpeed) gameSpeed = minSpeed;
                restartGameLoop(); // নতুন স্পিডে লুপ চালু করবে
            }
        }

        // গ্রিড তৈরি
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const block = document.createElement('div');
                block.classList.add("block");
                board.appendChild(block);
                blocks[`${row}-${col}`] = block;
            }
        }

        // স্ক্রিনে রেন্ডার করা
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

        // Snake মারা গেলে Game Over ফাংশন
        function handleGameOver() {
            clearInterval(intervalId); // গেম লুপ বন্ধ করা
            clearInterval(timerIntervalId); // টাইম লুপ বন্ধ করা

            // High Score update (যদি বর্তমান স্কোর হাই-স্কোর থেকে বড় হয়)
            if (currentScore > highScore) {
                highScore = currentScore;
                localStorage.setItem('snake_high_score', highScore);
                highScoreEl.innerText = highScore;
            }

            // ১. স্ক্রিনে Red Light / Fire Flash এবং Shake ইফেক্ট যোগ
            document.body.classList.add('game-screen-flash', 'shake-effect');

            // ২. Game Over পপআপ স্মুথলি শো করানো
            setTimeout(() => {
                if (gameOverEl) gameOverEl.classList.add('active');
            }, 200);
        }

        // গেমের প্রতি স্টেপের লজিক
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

            // দেওয়াল চেক (Death Collision Check)
            if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
                handleGameOver();
                return;
            }

            // নিজ শরীরে কামড় দিলে মারা যাওয়ার চেক (Self Collision)
            const isSelfCollision = snake.some(segment => segment.x === head.x && segment.y === head.y);
            if (isSelfCollision) {
                handleGameOver();
                return;
            }

            // নতুন মাথা যোগ
            snake.unshift(head);

            // খাবার খাওয়ার চেক
            if (head.x === food.x && head.y === food.y) {
                currentScore += 10;
                scoreEl.innerText = currentScore;

                // হাইস্কোর লাইভ আপডেট করা (গেম খেলার চলাকালীন)
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

        // প্রথমবার গেম লুপ শুরু করা
        restartGameLoop();

        // সাপের দিক নিয়ন্ত্রণের জন্য Key Listener
        const keyHandler = (event) => {
            if (event.key === "ArrowUp" && direction !== "down") {
                direction = "up";
            } else if (event.key === "ArrowDown" && direction !== "up") {
                direction = "down";
            } else if (event.key === "ArrowLeft" && direction !== "right") {
                direction = "left";
            } else if (event.key === "ArrowRight" && direction !== "left") {
                direction = "right";
            }
        };

        window.addEventListener("keydown", keyHandler);

        // RESTART Button Event Logic
        if (restartBtn) {
            restartBtn.onclick = () => {
                // Event Listener ক্লিয়ার করা যাতে মাল্টিপল কি হ্যান্ডলার না তৈরি হয়
                window.removeEventListener("keydown", keyHandler);

                // CSS Animation Classes রিমুভ করা
                document.body.classList.remove('game-screen-flash', 'shake-effect');
                if (gameOverEl) gameOverEl.classList.remove('active');

                // পুনরায় গেম শুরু করা
                initGame();
            };
        }
    }
});