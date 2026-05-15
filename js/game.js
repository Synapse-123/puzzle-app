const renderBoardView = window.GameBoard.renderBoard;
const fruitList = window.GameUtils.FRUITS;
const gameConfig = window.GameUtils.GAME_CONFIG;
const createFruitCards = window.GameUtils.createCards;
const readBestScore = window.GameUtils.getBestScore;
const writeBestScore = window.GameUtils.saveBestScore;

function createInitialState() {
  return {
    cards: [],
    selectedIds: [],
    locked: false,
    moves: 0,
    matches: 0,
    completed: false
  };
}

function createGame(elements) {
  let state = createInitialState();

  function updateStatus(message) {
    elements.statusText.textContent = message;
  }

  function updateStats() {
    const bestScore = readBestScore();

    elements.movesText.textContent = state.moves;
    elements.matchesText.textContent = `${state.matches} / ${fruitList.length}`;
    elements.bestScoreText.textContent = bestScore === null ? "-" : String(bestScore);
  }

  function drawBoard() {
    renderBoardView(elements.board, state.cards, gameConfig.columns);
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

  function hideSelectedCards() {
    state.selectedIds.forEach(function (cardId) {
      patchCard(cardId, { flipped: false });
    });

    resetSelection();
    drawBoard();
  }

  function completeGame() {
    state.completed = true;
    writeBestScore(state.moves);
    updateStats();
    updateStatus("Clear!");
  }

  function checkSelectedPair() {
    const selectedCards = state.selectedIds.map(getCard);
    state.moves += 1;

    if (selectedCards[0].name === selectedCards[1].name) {
      selectedCards.forEach(function (card) {
        patchCard(card.id, { matched: true });
      });

      state.matches += 1;
      resetSelection();
      updateStats();
      drawBoard();

      if (state.matches === fruitList.length) {
        completeGame();
        return;
      }

      updateStatus("Correct!");
      return;
    }

    state.locked = true;
    updateStats();
    updateStatus("Try again.");
    window.setTimeout(hideSelectedCards, gameConfig.revealDelayMs);
  }

  function selectCard(cardId) {
    const card = getCard(cardId);

    if (!card || state.locked || state.completed || card.flipped || card.matched) {
      return;
    }

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

  function start() {
    state = createInitialState();
    state.cards = createFruitCards();

    updateStatus("Find two matching fruit cards.");
    updateStats();
    drawBoard();
  }

  return {
    handleBoardClick,
    start
  };
}

window.createGame = createGame;
