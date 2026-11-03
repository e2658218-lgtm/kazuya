
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

// 5枚の盤面画像
const boardImages = [
  "board1.jpg",
  "board2.jpg",
  "board3.jpg",
  "board4.jpg",
  "board5.jpg"
];

// 各盤面のマスの座標（横%, 縦%）
const coordinates = [
  // 1限：1～10マス
  [
    [19, 90], [34, 86], [51, 81], [68, 75], [82, 62],
    [67, 50], [54, 39], [39, 35], [68, 28], [93, 22]
  ],

  // 2限：11～20マス
  [
    [5, 41], [13, 46], [22, 49], [31, 57], [45, 64],
    [57, 57], [69, 48], [75, 63], [83, 76], [95, 81]
  ],

  // 3限：21～30マス
  [
    [8, 50], [16, 61], [24, 74], [36, 83], [51, 87],
    [66, 84], [79, 76], [72, 60], [81, 52], [93, 36]
  ],

  // 4限：31～40マス
  [
    [8, 51], [17, 64], [25, 76], [38, 85], [53, 88],
    [68, 86], [82, 76], [76, 60], [85, 51], [93, 36]
  ],

  // 放課後：41～50マス
  [
    [7, 67], [17, 73], [26, 73], [35, 69], [43, 74],
    [54, 76], [62, 69], [71, 65], [79, 62], [91, 58]
  ]
];

// 位置は0～49（0が1マス目、49が50マス目）
const positions = [0, 0, 0, 0];

let currentPlayer = 0;
let finishedPlayers = [false, false, false, false];
let gameFinished = false;

// プレイヤーの位置から盤面番号を取得
function getBoardIndex(position) {
  return Math.min(Math.floor(position / 10), 4);
}

// 盤面画像を切り替える
function updateBoard() {
  const boardIndex = getBoardIndex(positions[currentPlayer]);
  boardImage.src = boardImages[boardIndex];
}

// 全プレイヤーのコマを表示する
function renderPieces() {
  const currentBoard = getBoardIndex(positions[currentPlayer]);

  for (let i = 0; i < 4; i++) {
    const playerBoard = getBoardIndex(positions[i]);

    // 現在の盤面にいるプレイヤーだけ表示
    if (playerBoard !== currentBoard) {
      pieces[i].style.display = "none";
      continue;
    }

    pieces[i].style.display = "block";

    const localPosition = positions[i] % 10;
    const point = coordinates[currentBoard][localPosition];

    pieces[i].style.left = point[0] + "%";
    pieces[i].style.top = point[1] + "%";
  }
}

// プレイヤーの位置を画面に表示
function updateDisplay() {
  positionsText.innerHTML =
    "🔴 プレイヤー1：" + (positions[0] + 1) + "マス<br>" +
    "🔵 プレイヤー2：" + (positions[1] + 1) + "マス<br>" +
    "🟡 プレイヤー3：" + (positions[2] + 1) + "マス<br>" +
    "🟢 プレイヤー4：" + (positions[3] + 1) + "マス";
}

// 次のプレイヤーへ
function nextPlayer() {
  let checked = 0;

  do {
    currentPlayer = (currentPlayer + 1) % 4;
    checked++;
  } while (
    finishedPlayers[currentPlayer] &&
    checked < 4
  );

  if (finishedPlayers.every(value => value)) {
    gameFinished = true;
    turnText.textContent = "全員ゴールしました！";
    resultText.textContent = "ゲーム終了です！🎉";
    rollButton.disabled = true;
    return;
  }

  turnText.textContent =
    "プレイヤー" + (currentPlayer + 1) + "の番です";

  updateBoard();
  renderPieces();
  updateDisplay();
}

// サイコロを振る
function rollDice() {
  if (gameFinished || finishedPlayers[currentPlayer]) {
    return;
  }

  const dice = Math.floor(Math.random() * 6) + 1;
  const player = currentPlayer;

  positions[player] = Math.min(
    positions[player] + dice,
    49
  );

  updateBoard();
  renderPieces();
  updateDisplay();

  resultText.textContent =
    "プレイヤー" + (player + 1) +
    "は " + dice + " が出ました！";

  // 50マス目に到着した場合
  if (positions[player] === 49) {
    finishedPlayers[player] = true;

    resultText.textContent += " ゴールです！🎉";

    if (finishedPlayers.every(value => value)) {
      gameFinished = true;
      turnText.textContent = "全員ゴールしました！";
      rollButton.disabled = true;
      return;
    }
  }

  nextPlayer();
}

// ボタンを押したとき
rollButton.addEventListener("click", rollDice);

// 最初の画面を表示
updateBoard();
renderPieces();
updateDisplay();
