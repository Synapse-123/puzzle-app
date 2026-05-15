function renderBoard(boardElement, cards, columns) {
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  cards.forEach(function (card) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.id = card.id;
    button.disabled = card.matched;
    button.setAttribute("aria-label", `${card.name} card`);

    if (card.flipped) {
      button.classList.add("flipped");
    }

    if (card.matched) {
      button.classList.add("matched");
    }

    const image = document.createElement("img");
    image.src = card.image;
    image.alt = card.name;

    button.appendChild(image);
    boardElement.appendChild(button);
  });
}

window.GameBoard = {
  renderBoard
};
