
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
const nextButton = document.getElementById("next");
const bgm = document.getElementById("bgm");
const bgmButton = document.getElementById("bgm-button");

bgm.volume = 0.3;

const boardImages = [
  "board1.jpg",
  "board2.jpg",
  "board3.jpg",
  "board4.jpg",
  "夕暮れの大学キャンパスすごろく.png"
];

const coordinates = [
  [
    [19, 90], [34, 86], [51, 81], [68, 75], [82, 62],
    [67, 50], [54, 39], [39, 35], [68, 28], [93, 22]
  ],
  [
    [5, 41], [13, 46], [22, 49], [31, 57], [45, 64],
    [57, 57], [69, 48], [75, 63], [83, 76], [95, 81]
  ],
  [
    [8, 50], [16, 61], [24, 74], [36, 83], [51, 87],
    [66, 84], [79, 76], [72, 60], [81, 52], [93, 36]
  ],
  [
    [8, 51], [17, 64], [25, 76], [38, 85], [53, 88],
    [68, 86], [82, 76], [76, 60], [85, 51], [93, 36]
  ],
  [
    [7, 67], [17, 73], [26, 73], [35, 69], [43, 74],
    [54, 76], [62, 69], [71, 65], [79, 62], [91, 58]
  ]
];

const positions = [0, 0, 0, 0];
const finishedPlayers = [false, false, false, false];
const restTurns = [0, 0, 0, 0];
// 課題提出忘れイベントのマス（0から始まる番号）
const eventSquares = [4, 14, 24, 34, 44];

let currentPlayer = 0;
let gameFinished = false;

// 1ターンの段階
// roll：サイコロを振る段階
// move：コマを移動する段階
// change：次のプレイヤーに交代する段階
let turnPhase = "roll";
let pendingDice = 0;

function getBoardIndex(position) {
  return Math.min(Math.floor(position / 10), 4);
}

// 盤面画像を更新
function updateBoard() {
  const boardIndex = getBoardIndex(positions[currentPlayer]);
  boardImage.src = boardImages[boardIndex];
}

// コマの位置を更新
function renderPieces() {
  const currentBoard = getBoardIndex(positions[currentPlayer]);

  for (let i = 0; i < 4; i++) {
    const playerBoard = getBoardIndex(positions[i]);

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

// プレイヤーの位置を表示
function updateDisplay() {
  positionsText.innerHTML =
    "🔴 プレイヤー1：" + (positions[0] + 1) + "マス<br>" +
    "🔵 プレイヤー2：" + (positions[1] + 1) + "マス<br>" +
    "🟡 プレイヤー3：" + (positions[2] + 1) + "マス<br>" +
    "🟢 プレイヤー4：" + (positions[3] + 1) + "マス";
}

// ボタンの状態を更新
function updateButtons() {
  rollButton.disabled = turnPhase !== "roll" || gameFinished;
  nextButton.disabled = turnPhase === "roll" || gameFinished;
}

// ① サイコロを振る
function rollDice() {
  if (turnPhase !== "roll" || gameFinished) return;

  pendingDice = Math.floor(Math.random() * 6) + 1;

  resultText.textContent =
    "プレイヤー" + (currentPlayer + 1) +
    "は " + pendingDice + " が出ました！ " +
    (pendingDice) + "マス進みます。";

  turnPhase = "move";

  updateButtons();
}


// ② コマを移動する
function moveCurrentPiece() {
  if (turnPhase !== "move" || gameFinished) return;

  // サイコロの出目だけ進む
  positions[currentPlayer] = Math.min(
    positions[currentPlayer] + pendingDice,
    49
  );

  const position = positions[currentPlayer];

  // 1限の2マス目・3マス目：遅刻イベント
  if (position === 1 || position === 2) {
    restTurns[currentPlayer] = 1;

    resultText.innerHTML =
      "⏰ 遅刻してしまった！<br>" +
      "教授に怒られる！<br>" +
      '<span style="color:red; font-weight:bold;">1回休み！</span>';

  // 課題提出忘れイベント
  } else if (eventSquares.includes(position)) {
    positions[currentPlayer] = Math.max(
      positions[currentPlayer] - 3,
      0
    );

    resultText.innerHTML =
      "📚 課題を提出し忘れた！<br>" +
      '<span style="color:red; font-weight:bold;">3マス戻る！</span>';

  } else {
    resultText.textContent =
      "プレイヤー" + (currentPlayer + 1) +
      "が " + (position + 1) + "マス目に到着しました！";
  }

  updateBoard();
  renderPieces();
  updateDisplay();

  if (positions[currentPlayer] === 49) {
    finishedPlayers[currentPlayer] = true;
    resultText.textContent += " ゴールです！🎉";
  }

  turnPhase = "change";
  updateButtons();
}


// ③ 次のプレイヤーに交代
function changePlayer() {
  if (turnPhase !== "change" || gameFinished) return;

  // 全員ゴールしているか確認
  if (finishedPlayers.every(value => value)) {
    gameFinished = true;
    turnText.textContent = "全員ゴールしました！";
    resultText.textContent = "ゲーム終了です！🎉";
    updateButtons();
    return;
  }

  let skippedPlayers = [];

  // 次にプレイできる人を探す
  for (let i = 0; i < 4; i++) {
    currentPlayer = (currentPlayer + 1) % 4;

    // ゴールした人は飛ばす
    if (finishedPlayers[currentPlayer]) {
      continue;
    }

    // 1回休みなら飛ばす
    if (restTurns[currentPlayer] > 0) {
      restTurns[currentPlayer]--;

      skippedPlayers.push(
        "プレイヤー" + (currentPlayer + 1)
      );

      continue;
    }

    // 休みでない人が見つかった
    break;
  }

  // 全員ゴールしている場合
  if (finishedPlayers.every(value => value)) {
    gameFinished = true;
    turnText.textContent = "全員ゴールしました！";
    resultText.textContent = "ゲーム終了です！🎉";
    updateButtons();
    return;
  }

  // 次のプレイヤーを表示
  turnText.textContent =
    "プレイヤー" + (currentPlayer + 1) + "の番です";

  if (skippedPlayers.length > 0) {
    resultText.innerHTML =
      '<span style="color:red; font-weight:bold;">' +
      skippedPlayers.join("・") +
      "は1回休みです！</span><br>" +
      "プレイヤー" + (currentPlayer + 1) +
      "の番です。";
  } else {
    resultText.textContent = "サイコロを振ってください！";
  }

  updateBoard();
  renderPieces();
  updateDisplay();

  turnPhase = "roll";
  updateButtons();
}

// ボタンの動作
rollButton.addEventListener("click", rollDice);

nextButton.addEventListener("click", function () {
  if (turnPhase === "move") {
    moveCurrentPiece();
  } else if (turnPhase === "change") {
    changePlayer();
  }
});

// 最初の画面
updateBoard();
renderPieces();
updateDisplay();
updateButtons();
// BGMの再生・停止
bgmButton.addEventListener("click", function () {
  if (bgm.paused) {
    bgm.play();

    bgmButton.textContent = "🔇 BGM OFF";
  } else {
    bgm.pause();

    bgmButton.textContent = "🎵 BGM ON";
  }
});
