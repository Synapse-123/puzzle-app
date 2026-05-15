const GAME_CONFIG = {
  columns: 4,
  revealDelayMs: 700,
  bestScoreKey: "fruit-puzzle-best-score"
};

const FRUITS = [
  { name: "Apple", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Lemon", color: "#eab308" },
  { name: "Lime", color: "#22c55e" },
  { name: "Berry", color: "#3b82f6" },
  { name: "Grape", color: "#8b5cf6" },
  { name: "Peach", color: "#fb7185" },
  { name: "Melon", color: "#14b8a6" }
];

function createFruitImage(fruit) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="22" fill="#ffffff"/>
      <circle cx="60" cy="56" r="34" fill="${fruit.color}"/>
      <path d="M60 22 C63 13 71 9 80 10 C78 20 70 25 60 22Z" fill="#16a34a"/>
      <text x="60" y="104" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#1f2937">${fruit.name}</text>
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

function createCards() {
  return shuffle([...FRUITS, ...FRUITS]).map(function (fruit, index) {
    return {
      id: String(index),
      name: fruit.name,
      image: createFruitImage(fruit),
      flipped: false,
      matched: false
    };
  });
}

function getBestScore() {
  try {
    const rawScore = localStorage.getItem(GAME_CONFIG.bestScoreKey);
    const score = Number(rawScore);

    return Number.isFinite(score) && rawScore !== null ? score : null;
  } catch {
    return null;
  }
}

function saveBestScore(moves) {
  const bestScore = getBestScore();

  if (bestScore !== null && moves >= bestScore) {
    return;
  }

  try {
    localStorage.setItem(GAME_CONFIG.bestScoreKey, String(moves));
  } catch {
    return;
  }
}

window.GameUtils = {
  FRUITS,
  GAME_CONFIG,
  createCards,
  getBestScore,
  saveBestScore
};
