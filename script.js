document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const startBtn = document.querySelector('.btn-start');
    let isGameStarted = false;

    // ১. Modal থেকে গেম শুরু করার লজিক
    function startGame() {
        if (isGameStarted) return;
        isGameStarted = true;

        // Modal টি স্মুথলি গায়েব হবে
        modal.classList.add('hide');

        setTimeout(() => {
            modal.style.display = 'none';
            // মূল স্নেক গেম চালু হবে
            initGame();
        }, 400);
    }

    // Modal Events (Button Click & Keyboard Keypress)
    startBtn.addEventListener('click', startGame);

    document.addEventListener('keydown', (event) => {
        if (!isGameStarted && (event.code === 'Enter' || event.code === 'Space')) {
            event.preventDefault(); // Space চাপলে পেজ যেন স্ক্রোল না হয়
            startGame();
        }
    });

    // ২. আপনার মূল Snake Game এর লজিক
    function initGame() {
        const board = document.querySelector('.board');
        const blockHeight = 50;
        const blockWidth = 50;

        const cols = Math.floor(board.clientWidth / blockWidth);
        const rows = Math.floor(board.clientHeight / blockHeight);

        let intervalId = null;

        // খাবারের র্যান্ডম পজিশন
        let food = { 
            x: Math.floor(Math.random() * rows), 
            y: Math.floor(Math.random() * cols)
        };

        const blocks = {};
        const snake = [
            { x: 1, y: 3 }
        ];

        let direction = 'down';

        // নতুন খাবার তৈরি
        function generateFood() {
            food = { 
                x: Math.floor(Math.random() * rows),
                y: Math.floor(Math.random() * cols)
            };
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

        // গেম লুপ
        intervalId = setInterval(() => {
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

            // দেওয়াল চেক
            if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
                alert("YOUR SNAKE HAS FALLEN");
                clearInterval(intervalId);
                return;
            }

            // নতুন মাথা যোগ
            snake.unshift(head);

            // খাবার খাওয়ার চেক
            if (head.x === food.x && head.y === food.y) {
                generateFood();
            } else {
                snake.pop();
            }

            render();
        }, 400);

        // সাপের দিক নিয়ন্ত্রণের জন্য Arrow Key Listener
        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp" && direction !== "down") {
                direction = "up";
            } else if (event.key === "ArrowDown" && direction !== "up") {
                direction = "down";
            } else if (event.key === "ArrowLeft" && direction !== "right") {
                direction = "left";
            } else if (event.key === "ArrowRight" && direction !== "left") {
                direction = "right";
            }
        });
    }
});