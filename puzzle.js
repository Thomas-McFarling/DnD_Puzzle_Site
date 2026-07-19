class Puzzle {
  constructor({ id, title, description, prompt, hint, solutionText, incorrectText }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.prompt = prompt;
    this.hint = hint;
    this.solutionText = solutionText || "Correct.";
    this.incorrectText = incorrectText || "Not quite.";
  }

  renderInList(currentPuzzleId) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "puzzle-card";
    button.dataset.id = this.id;
    button.innerHTML = `<h3>${this.title}</h3><p>${this.description}</p>`;
    button.addEventListener("click", () => showPuzzle(this.id));

    if (this.id === currentPuzzleId) {
      button.classList.add("active");
    }

    return button;
  }

  renderDetails() {
    return `
      <h2>${this.title}</h2>
      <p class="detail-body">${this.description}</p>
      <div class="prompt-box">
        <strong>Prompt</strong>
        <p>${this.prompt}</p>
      </div>
    `;
  }

  attachInteractions() {
    return null;
  }
}

class QuizPuzzle extends Puzzle {
  constructor(options) {
    super(options);
    this.answer = options.answer;
  }

  renderDetails() {
    return `
      <h2>${this.title}</h2>
      <p class="detail-body">${this.description}</p>
      <div class="prompt-box">
        <strong>Prompt</strong>
        <p>${this.prompt}</p>
      </div>
      <form class="answer-form" id="answer-form">
        <label for="answer">Enter your answer</label>
        <input id="answer" name="answer" type="text" autocomplete="off" placeholder="Type your solution" />
        <button type="submit">Check Answer</button>
      </form>
      <p class="message" id="feedback"></p>
      <p><strong>Hint:</strong> ${this.hint}</p>
    `;
  }

  attachInteractions() {
    const form = document.getElementById("answer-form");
    const feedback = document.getElementById("feedback");

    if (!form || !feedback) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("answer").value.trim().toLowerCase();
      const expected = this.answer.toLowerCase();

      if (input === expected) {
        feedback.textContent = this.solutionText;
        feedback.className = "message success";
      } else {
        feedback.textContent = this.incorrectText || "Not quite.";
        feedback.className = "message error";
      }
    });
  }
}

class SliderPuzzle extends Puzzle {
  constructor(options) {
    super(options);
    this.size = options.size || 3;
    this.initialState = options.initialState;
    this.goalState = options.goalState;
    this.tileLabels = options.tileLabels || [];
    this.currentState = [...this.initialState];
  }

  renderDetails() {
    if(this.hint != null) {return `
      <h2>${this.title}</h2>
      <p class="detail-body">${this.description}</p>
      <div class="prompt-box">
        <strong>Prompt</strong>
        <p>${this.prompt}</p>
      </div>
      <p class="message" id="feedback"></p>
      <div class="slider-board" id="slider-board"></div>
      <div class="slider-actions">
        <button type="button" id="reset-slider">Reset</button>
      </div>
      <p><strong>Hint:</strong> ${this.hint}</p>
    `;
  }
  else {
    return `
      <h2>${this.title}</h2>
      <p class="detail-body">${this.description}</p>
      <div class="prompt-box">
        <strong>Prompt</strong>
        <p>${this.prompt}</p>
      </div>
      <p class="message" id="feedback"></p>
      <div class="slider-board" id="slider-board"></div>
      <div class="slider-actions">
        <button type="button" id="reset-slider">Reset</button>
      </div>
    `;
  }
}

  isMovable(index, state, size) {
    const emptyIndex = state.indexOf("");
    if (emptyIndex === -1) return false;

    const row = Math.floor(index / size);
    const emptyRow = Math.floor(emptyIndex / size);
    const col = index % size;
    const emptyCol = emptyIndex % size;

    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  }

  swapTiles(state, firstIndex, secondIndex) {
    const nextState = state.slice();
    [nextState[firstIndex], nextState[secondIndex]] = [nextState[secondIndex], nextState[firstIndex]];
    return nextState;
  }

  isSolved(state) {
    return state.every((value, index) => value === this.goalState[index]);
  }

  renderBoard() {
    const board = document.getElementById("slider-board");
    const feedback = document.getElementById("feedback");

    if (!board || !feedback) return;

    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

    this.currentState.forEach((value, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = value === "" ? "tile empty" : "tile";

      const tileLabel = this.tileLabels[value - 1] ?? value;
      if (value === "") {
        tile.textContent = "";
      } else if (typeof tileLabel === "string") {
        const normalizedPath = tileLabel.replace(/\\/g, "/");
        if (
          normalizedPath.startsWith("http") ||
          normalizedPath.startsWith("data:") ||
          normalizedPath.startsWith("./") ||
          normalizedPath.startsWith("/")
        ) {
          tile.innerHTML = `<img src="${normalizedPath}" alt="Tile ${value}" />`;
        } else {
          tile.textContent = tileLabel;
        }
      } else {
        tile.textContent = tileLabel;
      }

      if (value !== "") {
        tile.classList.toggle("movable", this.isMovable(index, this.currentState, this.size));
        tile.addEventListener("click", () => {
          if (!this.isMovable(index, this.currentState, this.size)) return;

          const nextState = this.swapTiles(this.currentState.slice(), index, this.currentState.indexOf(""));
          this.currentState = nextState;
          this.renderBoard();

          if (this.isSolved(nextState)) {
            feedback.textContent = this.solutionText;
            feedback.className = "message success";
          } else {
            feedback.textContent = this.incorrectText || "";
            feedback.className = "message";
          }
        });
      }

      board.appendChild(tile);
    });
  }

  attachInteractions() {
    this.currentState = [...this.initialState];
    this.renderBoard();

    const resetButton = document.getElementById("reset-slider");
    if (!resetButton) return;

    resetButton.addEventListener("click", () => {
      this.currentState = [...this.initialState];
      this.renderBoard();
      const feedback = document.getElementById("feedback");
      if (feedback) {
        feedback.textContent = "";
        feedback.className = "message";
      }
    });
  }
}