const boardImage = document.getElementById("board-image");

const pieces = [
  document.getElementById("piece1"),
  document.getElementById("piece2"),
  document.getElementById("piece3"),
  document.getElementById("piece4")
];

const turnText = document.getElementById("turn");
const resultText = document.getElementById("result");
const positionsText = document.getElementById("positions");
const rollButton = document.getElementById("roll");

const boardImages = [
  "board1.jpg",
  "board2.jpg",
  "board3.jpg",
  "board4.jpg",
  "board5.jpg"
];

const positions = [0, 0, 0, 0];
const restTurns = [0, 0, 0, 0];

let currentPlayer = 0;
let finishedPlayers = [false, false, false, false];
let gameFinished = false;

// マス番号に応じて画像を切り替える
function updateBoard() {
  const imageIndex = Math.min(
    Math.floor(positions[currentPlayer] / 10),
    4
  );

  boardImage.src = boardImages[imageIndex];
}

// コマの位置を更新
function movePiece(player) {
  const position = positions[player];
  const imageIndex = Math.min(Math.floor(position / 10), 4);
  const localPosition = position % 10;

  updateBoard();

  // 各画像内の仮の位置
  const x = 10 + localPosition * 8;
  const y = 50;

  pieces[player].style.left = x + "%";
  pieces[player].style.top = y + "%";
}

// プレイヤーの位置を表示
function updateDisplay() {
  positionsText.innerHTML =
    "🔴 プレイヤー1：" + (positions[0] + 1) + "マス<br>" +
    "🔵 プレイヤー2：" + (positions[1] + 1) + "マス<br>" +
    "🟡 プレイヤー3：" + (positions[2] + 1) + "マス<br>" +
    "🟢 プレイヤー4：" + (positions[3] + 1) + "マス";
}

// 次のプレイヤーへ
function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % 4;

  let count = 0;

  while (
    (finishedPlayers[currentPlayer] ||
     restTurns[currentPlayer] > 0) &&
    count < 4
  ) {
    if (restTurns[currentPlayer] > 0) {
      restTurns[currentPlayer]--;
      resultText.textContent =
        "プレイヤー" + (currentPlayer + 1) + "は1回休みです。";
    }

    currentPlayer = (currentPlayer + 1) % 4;
    count++;
  }

  if (finishedPlayers.every(value => value)) {
    gameFinished = true;
    turnText.textContent = "全員ゴールしました！";
    rollButton.disabled = true;
    return;
  }

  turnText.textContent =
    "プレイヤー" + (currentPlayer + 1) + "の番です";

  updateBoard();
  updateDisplay();
}

// サイコロ
function rollDice() {
  if (gameFinished || finishedPlayers[currentPlayer]) return;

  const dice = Math.floor(Math.random() * 6) + 1;
  const player = currentPlayer;

  positions[player] = Math.min(
    positions[player] + dice,
    49
  );

  movePiece(player);
  updateDisplay();

  resultText.textContent =
    "プレイヤー" + (player + 1) +
    "は " + dice + " が出ました！";

  if (positions[player] === 49) {
    finishedPlayers[player] = true;
    resultText.textContent += " ゴールです！🎉";

    if (finishedPlayers.every(value => value)) {
      gameFinished = true;
      turnText.textContent = "全員ゴールしました！";
      rollButton.disabled = true;
      return;
    }

    nextPlayer();
    return;
  }

  nextPlayer();
}

rollButton.addEventListener("click", rollDice);

// 最初の表示
updateBoard();

for (let i = 0; i < 4; i++) {
  movePiece(i);
}

updateDisplay();
