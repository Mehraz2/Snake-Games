const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = {};
const snake = [
  { x: 1, y: 3 }
];

// ১. বানান ঠিক করা হয়েছে (diretion -> direction)
let direction = 'down';

// গ্রিড তৈরি করা
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row}-${col}`; // প্রয়োজনে আনকমেন্ট করতে পারেন
    blocks[`${row}-${col}`] = block;
  }
}

// ২. render() ফাংশনের ভেতরে সাপকে স্ক্রিনে দেখানোর লজিক লেখা হয়েছে
function render() {
  snake.forEach(segment => {
    // সাপ যে ঘরে থাকবে সেখানে 'fill' ক্লাস যোগ হবে
    if (blocks[`${segment.x}-${segment.y}`]) {
      blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    }
  });
}

// গেম লুপ
setInterval(() => {
  // পুরোনো পজিশন থেকে 'fill' ক্লাস সরাতে হবে
  snake.forEach(segment => {
    if (blocks[`${segment.x}-${segment.y}`]) {
      blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    }
  });

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

  // সাপের নতুন মাথা যোগ করা ও লেজ বাদ দেওয়া
  snake.unshift(head);
  snake.pop();

  // স্ক্রিনে নতুন পজিশন রেন্ডার করা
  render();

}, 400);