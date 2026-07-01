const puzzles = [
  {
    id: "riddle-1",
    title: "The Candle and the Key",
    description: "A small mystery for your first puzzle page.",
    prompt: "The chamber contains one candle, three locked boxes, and a note that says, 'Only the one who sees what is missing may open the final box.' What should the hero do?",
    answer: "look for the missing light",
    hint: "The clue is about what is absent rather than what is present."
  },
  {
    id: "riddle-2",
    title: "The Dragon's Coin",
    description: "A simple puzzle that can be styled into a tavern challenge.",
    prompt: "A dragon statue holds a single coin. The inscription says, 'Take the coin that is not mine and leave the one that is.' Which coin should be taken?",
    answer: "the coin that belongs to the statue",
    hint: "The wording points at ownership rather than value."
  }
];

const puzzleList = document.getElementById("puzzle-list");
const detailPanel = document.getElementById("detail-panel");

function renderPuzzleList() {
  puzzleList.innerHTML = "";

  puzzles.forEach((puzzle, index) => {
    const button = document.createElement("button");
    button.className = "puzzle-card";
    button.innerHTML = `<h3>${puzzle.title}</h3><p>${puzzle.description}</p>`;
    button.addEventListener("click", () => showPuzzle(puzzle.id));

    if (index === 0) {
      button.classList.add("active");
    }

    puzzleList.appendChild(button);
  });
}

function showPuzzle(id) {
  const puzzle = puzzles.find((entry) => entry.id === id);
  if (!puzzle) return;

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

  const cards = puzzleList.querySelectorAll(".puzzle-card");
  cards.forEach((card) => {
    card.classList.toggle("active", card.textContent.includes(puzzle.title));
  });

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

renderPuzzleList();
showPuzzle(puzzles[0].id);
