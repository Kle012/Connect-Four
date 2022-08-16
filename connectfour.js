// Connect Four
// Player 1 and 2 alternate turns. On each turn, a piece is dropped down a column until a player gets four-in-a-row (horiz, vert, or diag) or until board fills (tie)

const WIDTH = 7; // this is x
const HEIGHT = 6; // this is y

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells (board[y][x])

function makeBoard() {
  // loop over 6 times (height)
  for (let y = 0; y < HEIGHT; y++){
    // each loop creates 7 items (width)
    board.push(Array.from({length: WIDTH}));
  }
};

// makeHtmlBoard: make HTML table and row of column tops.
function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board"); 

  // Create column tops: creat a table row element and store it in the top variable, then set id attribute and add a handle to listen to a click (clickable area for adding a piece to that column)
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // Loop through each width, each time create a table data cell element (to create table row = WIDTH) and store it in the headCell variable, set id attribute x (width) anf append that into the top variable
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  };
  // Finally, add the top variables after running all of the loops to the htmlBoard variable
  htmlBoard.append(top);

  // Loop through each height, add a table row element to create columns (=height)
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // Loop through each width, add a table data cell to create rows (= width), set id and add that to the row variable
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    // Finally, add the row variable after running all of the loops to create the main body of the board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // loop over from top to bottom of the column of the board, if it is not filled, return top empty; otherwise, return null if filled 
  for (let y = HEIGHT - 1; y >= 0; y--){
    if (!board[y][x]){
      return y; 
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // add a div that has the piece class on it and should have a class for whether the current player is 1 or 2, like p1 or p2
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);

  // add the div inside the correct td cell in the HTML game board
  const place = document.getElementById(`${y}-${x}`);
  place.append(piece); 
}

/** endGame: announce game end */
function endGame(msg) {
  // pop up alert message
  alert(msg); 
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer; //updates the board variable with the player #
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if every rows in the board and every cells in the row are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!'); 
  }

  // switch players 1 <-> 2
  // if the currPlayer is 1, then switch to 2, if not, switch to 1
  currPlayer = currPlayer === 1 ? 2 : 1; 
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // loop over each column and each row
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // horiz: check if there are 4 cells in the row 
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // vert = check if there are 4 cells in the column 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // diagDR = check if there are 4 cells diagonally upward
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // diagDL = check if there are 4 cells diagonally downward
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if any of those, return true to find winner
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
