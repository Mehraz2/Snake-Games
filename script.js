const board = document.querySelector('.board');
const blockHight = 30
const blockWidth = 30

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHight);

for (let i =0 ; i < rows * cols; i ++ ) {
   
    const block = document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
}