const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const colors = {
  red: "\x1b[31m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
  green: "\x1b[32m%s\x1b[0m",
  cyan: "\x1b[36m%s\x1b[0m",
  purple: "\x1b[35;1m%s\x1b[0m",
};

let runningCount = 0;
const decksAtPlay = 8;
let remainingDecks = decksAtPlay;
let cardsSeen = 0;

console.log(
  colors.green,
  "Blackjack Card Counter started. Type the card values to adjust the count, 'R' to reset the count, or 'D' followed by a number to adjust the remaining decks (e.g., 'D6')."
);

rl.on("line", (input) => {
  const card = input.trim().toUpperCase();

  if (card.startsWith("D")) {
    const decksInput = parseInt(card.substring(1), 10);
    if (!isNaN(decksInput)) {
      adjustRemainingDecks(decksInput);
    } else {
      console.log("Invalid command for adjusting decks.");
    }
  } else {
    adjustRunningCount(card);
    adjustForCardsSeen();
    const trueCount = calculateTrueCount();
    console.log(
      colors.purple,
      `Card: ${card}, Running Count: ${runningCount}, True Count: ${trueCount.toFixed(
        2
      )}, Remaining Decks: ${remainingDecks.toFixed(2)}`
    );
  }
});

function adjustRunningCount(card) {
  if (["2", "3", "4", "5", "6"].includes(card)) {
    runningCount += 1;
    cardsSeen += 1;
  } else if (["10", "J", "Q", "K", "A"].includes(card)) {
    runningCount -= 1;
    cardsSeen += 1;
  } else if (["7", "8", "9"].includes(card)) {
    cardsSeen += 1;
  } else if (["R"].includes(card)) {
    console.log("Count and decks reset.");
    resetCounts();
  }
}

function adjustForCardsSeen() {
  const totalCards = decksAtPlay * 52;
  const cardsRemaining = totalCards - cardsSeen;
  remainingDecks = cardsRemaining / 52;
}

function adjustRemainingDecks(decks) {
  remainingDecks = decks;
  const totalCards = decksAtPlay * 52;
  const cardsForRemainingDecks = remainingDecks * 52;
  cardsSeen = totalCards - cardsForRemainingDecks;

  console.log(
    `Remaining decks adjusted to: ${remainingDecks}. Cards seen adjusted to: ${cardsSeen}`
  );
}
function calculateTrueCount() {
  return runningCount / remainingDecks;
}

function resetCounts() {
  runningCount = 0;
  remainingDecks = decksAtPlay;
  cardsSeen = 0;
}

process.on("SIGINT", function () {
  console.log("\nBlackjack Card Counter terminated.");
  process.exit();
});
