const puzzles = [
  {
    id: "slider-1",
    type: "slider",
    title: "The Wooden Box",
    description: "Slide wooden tiles until the correct order is restored.",
    prompt: "Arrange the wooden tiles on the box in the correct order. <br><br><strong>Carving:</strong><br>My lips I nightly lift toward the silver moon,<br>With trembling strings I weave upon my tiny loom,<br>On wings of ink I glide above the sulking gloom.<br><br>Scuttling through the shadows, in darkness I confide,<br>With daylight's fragile beauty upon my lying eyes,<br>Silent in the cavern's womb, with naught but stars to guide.<br><br>I seek majesty in solitude,<br>I have no truths to hide,<br>My crown yet sits upon my head for all to see with pride.",
    size: 3,
    initialState: [6, 4, 8, 1, "", 7, 2, 3, 5],
    goalState: [1, 2, 3, 4, 5, 6, 7, "", 8],
    tileLabels: ["./Images/wolf.jpg", "./Images/spider.jpg", "./Images/raven.jpg", "./Images/rat.jpg", "./Images/butterfly.jpg", "./Images/bat.jpg", "./Images/bear.jpg", "./Images/elk.jpg"],
    solutionText: "The box clicks open",
    incorrectText: null
  },
  {
    id: "slider-2",
    type: "slider",
    title: "Slider Template",
    description: "Slide tiles to the correct positions.",
    prompt: "arrange the tiles 1-8 with the blank in the bottom right corner.",
    size: 3,
    initialState: [6, 4, 8, 1, "", 7, 2, 3, 5],
    goalState: [1, 2, 3, 4, 5, 6, 7, 8, ""],
    tileLabels: [1, 2, 3, 4, 5, 6, 7, 8],
    solutionText: "correct!",
    incorrectText: null
},
{
    id: "quiz-1",
    type: "quiz",
    title: "Quiz Template",
    description: "Input the correct answer.",
    prompt: "What is the capital of France?",
    answer: "paris",
    hint: "It's the city of light.",
    solutionText: "correct!",
    incorrectText: null
}
];

const puzzleList = document.getElementById("puzzle-list");
const detailPanel = document.getElementById("detail-panel");
const sliderStates = new Map();
let currentPuzzleId = puzzles[0]?.id || null;

function renderPuzzleList() {
  puzzleList.innerHTML = "";

  puzzles.forEach((puzzle) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "puzzle-card";
    button.dataset.id = puzzle.id;
    button.innerHTML = `<h3>${puzzle.title}</h3><p>${puzzle.description}</p>`;
    button.addEventListener("click", () => showPuzzle(puzzle.id));

    if (puzzle.id === currentPuzzleId) {
      button.classList.add("active");
    }

    puzzleList.appendChild(button);
  });
}

function showPuzzle(id) {
  const puzzle = puzzles.find((entry) => entry.id === id);
  if (!puzzle) return;

  currentPuzzleId = puzzle.id;
  renderPuzzleList();

  if (puzzle.type === "slider") {
    renderSliderPuzzle(puzzle);
  } else {
    renderQuizPuzzle(puzzle);
  }
}

function renderQuizPuzzle(puzzle) {
  detailPanel.innerHTML = `
    <h2>${puzzle.title}</h2>
    <p class="detail-body">${puzzle.description}</p>
    <div class="prompt-box">
      <strong>Prompt</strong>
      <p>${puzzle.prompt}</p>
    </div>
    <form class="answer-form" id="answer-form">
      <label for="answer">Enter your answer</label>
      <input id="answer" name="answer" type="text" autocomplete="off" placeholder="Type your solution" />
      <button type="submit">Check Answer</button>
    </form>
    <p class="message" id="feedback"></p>
    <p><strong>Hint:</strong> ${puzzle.hint}</p>
  `;

  const form = document.getElementById("answer-form");
  const feedback = document.getElementById("feedback");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("answer").value.trim().toLowerCase();
    const expected = puzzle.answer.toLowerCase();

    if (input === expected) {
      feedback.textContent = "Correct. The puzzle is solved.";
      feedback.className = "message success";
    } else {
      feedback.textContent = "Not quite. Try the hint or think about the wording.";
      feedback.className = "message error";
    }
  });
}

function getSliderState(puzzleId, fallbackState) {
  if (!sliderStates.has(puzzleId)) {
    sliderStates.set(puzzleId, fallbackState.slice());
  }

  return sliderStates.get(puzzleId);
}

function setSliderState(puzzleId, nextState) {
  sliderStates.set(puzzleId, nextState);
}

function isMovable(index, state, size) {
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

function swapTiles(state, firstIndex, secondIndex) {
  const nextState = state.slice();
  [nextState[firstIndex], nextState[secondIndex]] = [nextState[secondIndex], nextState[firstIndex]];
  return nextState;
}

function isSolved(puzzle, state) {
  return state.every((value, index) => value === puzzle.goalState[index]);
}

function renderSliderPuzzle(puzzle) {
  const state = getSliderState(puzzle.id, puzzle.initialState);
  detailPanel.innerHTML = `
    <h2>${puzzle.title}</h2>
    <p class="detail-body">${puzzle.description}</p>
    <div class="prompt-box">
      <strong>Prompt</strong>
      <p>${puzzle.prompt}</p>
    </div>
    <p class="message" id="feedback"></p>
    <div class="slider-board" id="slider-board"></div>
    <div class="slider-actions">
      <button type="button" id="reset-slider">Reset</button>
    </div>
  `;

  const board = document.getElementById("slider-board");
  board.style.gridTemplateColumns = `repeat(${puzzle.size || 3}, 1fr)`;
  renderSliderBoard(puzzle, state);

  const resetButton = document.getElementById("reset-slider");
  resetButton.addEventListener("click", () => {
    setSliderState(puzzle.id, puzzle.initialState.slice());
    renderSliderBoard(puzzle, getSliderState(puzzle.id, puzzle.initialState));
    const feedback = document.getElementById("feedback");
    feedback.textContent = "";
    feedback.className = "message";
  });
}

function renderSliderBoard(puzzle, state) {
  const board = document.getElementById("slider-board");
  const feedback = document.getElementById("feedback");
  board.innerHTML = "";

  state.forEach((value, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = value === "" ? "tile empty" : "tile";

    const tileLabel = puzzle.tileLabels?.[value - 1] ?? value;
    if (value === "") {
      tile.textContent = "";
    } else if (typeof tileLabel === "string") {
      const normalizedPath = tileLabel.replace(/\\/g, "/");
      if (normalizedPath.startsWith("http") || normalizedPath.startsWith("data:") || normalizedPath.startsWith("./") || normalizedPath.startsWith("/")) {
        tile.innerHTML = `<img src="${normalizedPath}" alt="Tile ${value}" />`;
      } else {
        tile.textContent = tileLabel;
      }
    } else {
      tile.textContent = tileLabel;
    }

    if (value !== "") {
      tile.classList.toggle("movable", isMovable(index, state, puzzle.size || 3));
      tile.addEventListener("click", () => {
        if (!isMovable(index, state, puzzle.size || 3)) return;

        const nextState = swapTiles(state.slice(), index, state.indexOf(""));
        setSliderState(puzzle.id, nextState);
        renderSliderBoard(puzzle, nextState);

        if (isSolved(puzzle, nextState)) {
          feedback.textContent = puzzle.solutionText;
          feedback.className = "message success";
        } else {
          feedback.textContent = puzzle.incorrectText || "";
          feedback.className = "message";
        }
      });
    }

    board.appendChild(tile);
  });
}

renderPuzzleList();
showPuzzle(puzzles[0].id);
