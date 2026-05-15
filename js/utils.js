const GAME_CONFIG = {
  revealDelayMs: 700,
  defaultDifficulty: "easy"
};

const DIFFICULTIES = {
  easy: {
    key: "easy",
    label: "Easy",
    columns: 4,
    timeLimitSeconds: 60,
    bestScoreKey: "fruit-puzzle-easy-best-score"
  },
  medium: {
    key: "medium",
    label: "Medium",
    columns: 8,
    timeLimitSeconds: 180,
    bestScoreKey: "fruit-puzzle-medium-best-score"
  },
  hard: {
    key: "hard",
    label: "Hard",
    columns: 16,
    timeLimitSeconds: 600,
    bestScoreKey: "fruit-puzzle-hard-best-score"
  }
};

const FRUITS = [
  { name: "Apple", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Lemon", color: "#eab308" },
  { name: "Lime", color: "#22c55e" },
  { name: "Berry", color: "#3b82f6" },
  { name: "Grape", color: "#8b5cf6" },
  { name: "Peach", color: "#fb7185" },
  { name: "Melon", color: "#14b8a6" },
  { name: "Cherry", color: "#dc2626" },
  { name: "Banana", color: "#facc15" },
  { name: "Kiwi", color: "#65a30d" },
  { name: "Mango", color: "#fb923c" },
  { name: "Plum", color: "#7c3aed" },
  { name: "Pear", color: "#84cc16" },
  { name: "Coconut", color: "#a16207" },
  { name: "Fig", color: "#9333ea" },
  { name: "Guava", color: "#f472b6" },
  { name: "Papaya", color: "#f97316" }
];

function createFruitImage(fruit) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="22" fill="#ffffff"/>
      <circle cx="60" cy="56" r="34" fill="${fruit.color}"/>
      <path d="M60 22 C63 13 71 9 80 10 C78 20 70 25 60 22Z" fill="#16a34a"/>
      <text x="60" y="64" text-anchor="middle" font-family="Arial" font-size="22" font-weight="800" fill="#ffffff">${fruit.label}</text>
      <text x="60" y="104" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#1f2937">${fruit.name}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getRandomIndex(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  const copiedArray = [...array];

  for (let index = copiedArray.length - 1; index > 0; index -= 1) {
    const randomIndex = getRandomIndex(index + 1);
    const currentItem = copiedArray[index];

    copiedArray[index] = copiedArray[randomIndex];
    copiedArray[randomIndex] = currentItem;
  }

  return copiedArray;
}

function getDifficulty(key) {
  return DIFFICULTIES[key] || DIFFICULTIES[GAME_CONFIG.defaultDifficulty];
}

function getPairCount(difficulty) {
  return (difficulty.columns * difficulty.columns) / 2;
}

function createFruitSet(pairCount) {
  return Array.from({ length: pairCount }, function (_, index) {
    const baseFruit = FRUITS[index % FRUITS.length];
    const variant = Math.floor(index / FRUITS.length) + 1;
    const label = `${baseFruit.name.charAt(0)}${variant}`;

    return {
      pairKey: `${baseFruit.name}-${variant}`,
      name: variant === 1 ? baseFruit.name : `${baseFruit.name} ${variant}`,
      label,
      color: baseFruit.color
    };
  });
}

function createCards(difficultyKey) {
  const difficulty = getDifficulty(difficultyKey);
  const fruits = createFruitSet(getPairCount(difficulty));

  return shuffle([...fruits, ...fruits]).map(function (fruit, index) {
    return {
      id: String(index),
      pairKey: fruit.pairKey,
      name: fruit.name,
      image: createFruitImage(fruit),
      flipped: false,
      matched: false
    };
  });
}

function getBestScore(difficultyKey) {
  const difficulty = getDifficulty(difficultyKey);

  try {
    const rawScore = localStorage.getItem(difficulty.bestScoreKey);
    const score = Number(rawScore);

    return Number.isFinite(score) && rawScore !== null ? score : null;
  } catch {
    return null;
  }
}

function saveBestScore(difficultyKey, moves) {
  const difficulty = getDifficulty(difficultyKey);
  const bestScore = getBestScore(difficultyKey);

  if (bestScore !== null && moves >= bestScore) {
    return;
  }

  try {
    localStorage.setItem(difficulty.bestScoreKey, String(moves));
  } catch {
    return;
  }
}

window.GameUtils = {
  FRUITS,
  GAME_CONFIG,
  DIFFICULTIES,
  createCards,
  getDifficulty,
  getPairCount,
  getBestScore,
  saveBestScore
};
