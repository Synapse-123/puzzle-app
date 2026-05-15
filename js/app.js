function initApp() {
  const elements = {
    board: document.querySelector("#board"),
    statusText: document.querySelector("#status"),
    timerText: document.querySelector("#timer"),
    movesText: document.querySelector("#moves"),
    matchesText: document.querySelector("#matches"),
    bestScoreText: document.querySelector("#best-score"),
    difficultyButtons: document.querySelectorAll("[data-difficulty]")
  };

  const restartButton = document.querySelector("#restart-button");

  if (!elements.board || !elements.statusText || !elements.timerText || !elements.movesText || !elements.matchesText || !elements.bestScoreText || elements.difficultyButtons.length === 0 || !restartButton) {
    return;
  }

  const game = createGame(elements);

  elements.board.addEventListener("click", game.handleBoardClick);
  elements.difficultyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      game.changeDifficulty(button.dataset.difficulty);
    });
  });
  restartButton.addEventListener("click", game.start);

  game.start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
