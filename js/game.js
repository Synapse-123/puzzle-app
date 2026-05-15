const renderBoardView = window.GameBoard.renderBoard;
const gameConfig = window.GameUtils.GAME_CONFIG;
const difficultyConfig = window.GameUtils.DIFFICULTIES;
const createFruitCards = window.GameUtils.createCards;
const getDifficultySetting = window.GameUtils.getDifficulty;
const countPairs = window.GameUtils.getPairCount;
const readBestScore = window.GameUtils.getBestScore;
const writeBestScore = window.GameUtils.saveBestScore;

function createInitialState(difficultyKey) {
  const difficulty = getDifficultySetting(difficultyKey);

  return {
    cards: [],
    selectedIds: [],
    difficulty,
    locked: false,
    moves: 0,
    matches: 0,
    timeLeft: difficulty.timeLimitSeconds,
    timerStarted: false,
    completed: false
  };
}

function createGame(elements) {
  let currentDifficultyKey = gameConfig.defaultDifficulty;
  let state = createInitialState(currentDifficultyKey);
  let timerId = null;
  let revealTimeoutId = null;

  function updateStatus(message) {
    elements.statusText.textContent = message;
  }

  function updateStats() {
    const totalPairs = countPairs(state.difficulty);
    const bestScore = readBestScore(state.difficulty.key);

    elements.timerText.textContent = formatTime(state.timeLeft);
    elements.timerText.classList.toggle("is-low-time", state.timeLeft <= 15 && !state.completed);
    elements.movesText.textContent = state.moves;
    elements.matchesText.textContent = `${state.matches} / ${totalPairs}`;
    elements.bestScoreText.textContent = bestScore === null ? "-" : String(bestScore);
  }

  function updateDifficultyView() {
    elements.board.dataset.difficulty = state.difficulty.key;
    elements.board.setAttribute("aria-label", `${state.difficulty.label} fruit puzzle board`);

    elements.difficultyButtons.forEach(function (button) {
      const isSelected = button.dataset.difficulty === state.difficulty.key;

      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function drawBoard() {
    renderBoardView(elements.board, state.cards, state.difficulty.columns);
  }

  function getCard(cardId) {
    return state.cards.find(function (card) {
      return card.id === cardId;
    });
  }

  function patchCard(cardId, updates) {
    state.cards = state.cards.map(function (card) {
      return card.id === cardId ? { ...card, ...updates } : card;
    });
  }

  function resetSelection() {
    state.selectedIds = [];
    state.locked = false;
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function clearRevealTimeout() {
    if (revealTimeoutId !== null) {
      window.clearTimeout(revealTimeoutId);
      revealTimeoutId = null;
    }
  }

  function endGameByTimeout() {
    stopTimer();
    clearRevealTimeout();
    state.locked = true;
    state.completed = true;
    state.selectedIds = [];
    state.cards = state.cards.map(function (card) {
      return card.matched ? card : { ...card, flipped: false };
    });

    updateStats();
    drawBoard();
    updateStatus("Time's up! Try one more round.");
  }

  function startTimer() {
    if (state.timerStarted) {
      return;
    }

    state.timerStarted = true;
    timerId = window.setInterval(function () {
      state.timeLeft = Math.max(0, state.timeLeft - 1);
      updateStats();

      if (state.timeLeft === 0) {
        endGameByTimeout();
      }
    }, 1000);
  }

  function hideSelectedCards() {
    state.selectedIds.forEach(function (cardId) {
      patchCard(cardId, { flipped: false });
    });

    resetSelection();
    drawBoard();
  }

  function completeGame() {
    stopTimer();
    state.completed = true;
    writeBestScore(state.difficulty.key, state.moves);
    updateStats();
    updateStatus("Clear!");
  }

  function checkSelectedPair() {
    const selectedCards = state.selectedIds.map(getCard);
    state.moves += 1;

    if (selectedCards[0].pairKey === selectedCards[1].pairKey) {
      selectedCards.forEach(function (card) {
        patchCard(card.id, { matched: true });
      });

      state.matches += 1;
      resetSelection();
      updateStats();
      drawBoard();

      if (state.matches === countPairs(state.difficulty)) {
        completeGame();
        return;
      }

      updateStatus("Correct!");
      return;
    }

    state.locked = true;
    updateStats();
    updateStatus("Try again.");
    revealTimeoutId = window.setTimeout(function () {
      revealTimeoutId = null;
      hideSelectedCards();
    }, gameConfig.revealDelayMs);
  }

  function selectCard(cardId) {
    const card = getCard(cardId);

    if (!card || state.locked || state.completed || card.flipped || card.matched) {
      return;
    }

    startTimer();
    patchCard(cardId, { flipped: true });
    state.selectedIds.push(cardId);
    drawBoard();

    if (state.selectedIds.length === 2) {
      checkSelectedPair();
      return;
    }

    updateStatus("Pick one more card.");
  }

  function handleBoardClick(event) {
    const button = event.target.closest(".card");

    if (button === null) {
      return;
    }

    selectCard(button.dataset.id);
  }

  function changeDifficulty(difficultyKey) {
    if (!difficultyConfig[difficultyKey]) {
      return;
    }

    currentDifficultyKey = difficultyKey;
    start();
  }

  function start() {
    stopTimer();
    clearRevealTimeout();
    state = createInitialState(currentDifficultyKey);
    state.cards = createFruitCards(state.difficulty.key);

    updateStatus(`Find all pairs on ${state.difficulty.columns}x${state.difficulty.columns}.`);
    updateDifficultyView();
    updateStats();
    drawBoard();
  }

  return {
    changeDifficulty,
    handleBoardClick,
    start
  };
}

window.createGame = createGame;
