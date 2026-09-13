const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null; // গেম লুপের আইডি রাখার জন্য

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

// ১. নতুন খাবার তৈরি করার ফাংশন
function generateFood() {
    food = { 
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };
}

// ২. বোর্ডের ব্লক বা গ্রিড তৈরি করা
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        
        // কী (Key) হিসেবে row-col ব্যবহার
        blocks[`${row}-${col}`] = block;
    }
}

// ৩. রেন্ডার ফাংশন (সাপ এবং খাবার দুটিই রেন্ডার করা)
function render() {
    // আগের সমস্ত ব্লক থেকে fill এবং food ক্লাস মুছে নেওয়া
    for (let key in blocks) {
        blocks[key].classList.remove("fill", "food");
    }

    // সাপের পজিশন অনুযায়ী fill ক্লাস যোগ করা
    snake.forEach(segment => {
        if (blocks[`${segment.x}-${segment.y}`]) {
            blocks[`${segment.x}-${segment.y}`].classList.add("fill");
        }
    });

    // খাবারের পজিশন অনুযায়ী food ক্লাস যোগ করা
    if (blocks[`${food.x}-${food.y}`]) {
        blocks[`${food.x}-${food.y}`].classList.add("food");
    }
}

// ৪. গেম লুপ / সাপের নড়াচড়া
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

    // দেওয়ালের সীমানা চেক করা
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        alert("YOUR SNAKE HAS FALLEN");
        clearInterval(intervalId); // গেম থামানো
        return;
    }

    // সাপের নতুন মাথা যোগ করা
    snake.unshift(head);

    // খাবার খাওয়ার চেক (এটি গেম লুপের ভেতর থাকতে হবে)
    if (head.x === food.x && head.y === food.y) {
        generateFood(); // নতুন খাবার জন্মাবে (pop করা হলো না, তাই সাপ বড় হবে)
    } else {
        snake.pop(); // খাবার না খেলে শেষ অংশ কেটে যাবে
    }

    // নতুন পজিশন স্ক্রিনে আঁকা
    render();

}, 400);

// ৫. কিবোর্ড কন্ট্রোল
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