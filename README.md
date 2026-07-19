# D&D Puzzle Vault

This site is a simple framework for sharing D&D puzzles for online games.

## How to add/edit a puzzle

Open [app.js](app.js) and add a new object of one of the valid types to the `puzzles` array with:

- `id`
- `title`
- `description`
- `prompt`
- `answer` (only for quiz)
- `hint` (optional)
- `correctText` (displays when solved)
- `incorrectText` (displays on incorrect entry) (optional)

## If making a sliding puzzle you must also include
- `size` (ex size = 3 means 3x3 puzzle)
- `initialState` (starting arangement)
- `goalState` (target arangement)
- `titleLabels` (the labels for each tab, can include image links)

## Run locally

Open [index.html](index.html) in a browser, or start a simple local server from this folder.
