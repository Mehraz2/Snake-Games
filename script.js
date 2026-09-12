const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = {};
const snake = [
    { x: 1, y: 3 }
];

let direction = 'down';

// ১. বোর্ডের ব্লক বা গ্রিড তৈরি করা
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        
        // কী (Key) হিসেবে row-col ব্যবহার
        blocks[`${row}-${col}`] = block;
    }
}

// ২. সাপকে স্ক্রিনে আঁকার ফাংশন (Render Function)
function render() {
    // আগের সমস্ত ব্লক থেকে fill ক্লাস তুলে নেওয়া
    for (let key in blocks) {
        blocks[key].classList.remove("fill");
    }

    // সাপের বর্তমান পজিশন অনুযায়ী fill ক্লাস যুক্ত করা
    snake.forEach(segment => {
        if (blocks[`${segment.x}-${segment.y}`]) {
            blocks[`${segment.x}-${segment.y}`].classList.add("fill");
        }
    });
}

// ৩. গেম লুপ / সাপের নড়াচড়া
setInterval(() => {
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

    // সাপকে এক ধাপ সামনে নেওয়া
    snake.unshift(head);
    snake.pop();

    // নতুন পজিশন রেন্ডার করা
    render();

}, 400);

// ৪. কিবোর্ড কন্ট্রোল (Keyboard Control)
addEventListener("keydown", (event) => {
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