const puzzles = [
  new SliderPuzzle({
    id: "slider-1",
    title: "The Wooden Box",
    description: "Slide wooden tiles until the correct order is restored.",
    prompt: "My lips I nightly lift toward the silver moon,</br>With trembling strings I weave upon my tiny loom,</br>On wings of ink I glide above the sulking gloom.</br></br>Scuttling through the shadows, in darkness I confide,</br>With daylight's fragile beauty upon my lying eyes,</br>Silent in the cavern's womb, with naught but stars to guide.</br></br>I seek majesty in solitude,</br>I have no truths to hide,</br>My crown yet sits upon my head for all to see with pride.",
    hint: null,
    size: 3,
    initialState: [6, 4, 8, 1, "", 7, 2, 3, 5],
    goalState: [1, 2, 3, 4, 5, 6, 7, "", 8],
    tileLabels: ["./Images/wolf.jpg", "./Images/spider.jpg", "./Images/raven.jpg", "./Images/rat.jpg", "./Images/butterfly.jpg", "./Images/bat.jpg", "./Images/bear.jpg", "./Images/elk.jpg"],
    solutionText: "The box clicks open.",
    incorrectText: null
  }),
  new QuizPuzzle({
    id: "quiz-1",
    title: "Quiz Template",
    description: "Input the correct answer.",
    prompt: "What is the capital of France?",
    answer: "paris",
    hint: "It's the city of light.",
    solutionText: "Correct!",
    incorrectText: "Not quite."
  })

];

const puzzleList = document.getElementById("puzzle-list");
const detailPanel = document.getElementById("detail-panel");
let currentPuzzleId = puzzles[0]?.id || null;

function renderPuzzleList() {
  puzzleList.innerHTML = "";

  puzzles.forEach((puzzle) => {
    puzzleList.appendChild(puzzle.renderInList(currentPuzzleId));
  });
}

function showPuzzle(id) {
  const puzzle = puzzles.find((entry) => entry.id === id);
  if (!puzzle) return;

  currentPuzzleId = puzzle.id;
  renderPuzzleList();
  detailPanel.innerHTML = puzzle.renderDetails();
  puzzle.attachInteractions();
}

renderPuzzleList();
showPuzzle(puzzles[0].id);
