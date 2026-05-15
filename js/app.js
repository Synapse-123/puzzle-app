function initApp() {
  const elements = {
    board: document.querySelector("#board"),
    statusText: document.querySelector("#status"),
    timerText: document.querySelector("#timer"),
    movesText: document.querySelector("#moves"),
    matchesText: document.querySelector("#matches"),
    bestScoreText: document.querySelector("#best-score")
  };

  const restartButton = document.querySelector("#restart-button");

  if (!elements.board || !elements.statusText || !elements.timerText || !elements.movesText || !elements.matchesText || !elements.bestScoreText || !restartButton) {
    return;
  }

  const game = createGame(elements);

  elements.board.addEventListener("click", game.handleBoardClick);
  restartButton.addEventListener("click", game.start);

  game.start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
