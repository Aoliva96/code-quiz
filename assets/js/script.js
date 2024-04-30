// KNOWN ISSUES:
// - Questions advance to the next question when clicking anywhere on the question card, not just the answer buttons.
// - The timer stops at 2 seconds left, but the score is still saved as 0.
// - The high score list allows numbers and special characters to be entered as initials.
// - All answers counting as incorrect regardless of the answer selected.
// - The 'resultBanner' should unhide and display 'Correct!' or 'Incorrect!' based on the user's answer, then hide until the next question is answered.
// - The 'perfectScore' message should be hidden unless user's score is 75.
// ============================================================================

// DOM hooks
const startEl = document.querySelector("#start");
const timerEl = document.querySelector("#timer");
const timeLeftEl = document.querySelector("#timeLeft");
const resultEl = document.querySelector("#result");
const highScoreEl = document.querySelector("#highScore");

const backBtn = document.querySelector("#back");
const clearBtn = document.querySelector("#clear");
const submitBtn = document.querySelector("#submit");

const questions = document.querySelectorAll(".questions");
const finalScore = document.querySelector("#score");
const scoreList = document.querySelector("#scoreList");
const scoreInput = document.querySelector("#scoreInput");

// Countdown timer
let time = 75;
let timer;

function countdown() {
  timer = setInterval(() => {
    timeLeftEl.textContent = time;
    time--;
    if (time <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

// Shuffle 10 questions from available 15 questions
const availableQuestions = Array.from(questions);
const shuffledQuestions = [];

for (let i = 0; i < 10; i++) {
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  shuffledQuestions.push(availableQuestions[randomIndex]);
  availableQuestions.splice(randomIndex, 1);
}

shuffledQuestions.forEach((question, index) => {
  question.setAttribute("data-index", index);
});

// Start quiz
function startQuiz() {
  startEl.classList.add("hide");
  questions[0].classList.remove("hide");
  countdown();
}

// End quiz
function endQuiz() {
  clearInterval(timer);
  questions.forEach((question) => {
    question.classList.add("hide");
  });
  finalScore.textContent = time;
  resultEl.classList.remove("hide");
  timerEl.classList.add("hide");
}

// Next question
function nextQuestion(index) {
  questions[index].classList.add("hide");
  questions[index + 1].classList.remove("hide");
}

// Check if answer is correct
function checkAnswer(index, answer) {
  if (answer === "correct") {
    if (time <= 65) {
      time += 10;
    } else {
      time = 75;
    }
  } else {
    if (time >= 10) {
      time -= 10;
    } else {
      time = 0;
    }
  }

  timeLeftEl.textContent = time;
  nextQuestion(index);
}

// Update scores
function updateScores() {
  scoreList.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  console.log("scores", scores); // Debug

  scores.forEach((score) => {
    console.log("score", score); // Debug
    const li = document.createElement("li");
    li.textContent = `${score.initials}  -  ${score.score}`;
    scoreList.insertBefore(li, scoreList.firstChild);
  });
}

updateScores();

// Add event listeners
startEl.addEventListener("click", startQuiz);

questions.forEach((question, index) => {
  question.addEventListener("click", (event) => {
    const answer = event.target.getAttribute("data-answer");
    checkAnswer(index, answer);
  });
});

submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const initials = scoreInput.value;
  if (!initials) {
    alert("Please enter your initials to save your score.");
    return;
  }
  const score = {
    initials: initials,
    score: time,
  };

  console.log("score", score); // Debug

  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(score);
  localStorage.setItem("scores", JSON.stringify(scores));
  updateScores();
  resultEl.classList.add("hide");
  highScoreEl.classList.remove("hide");
});

backBtn.addEventListener("click", function () {
  time = 75;
  highScoreEl.classList.add("hide");
  startEl.classList.remove("hide");
  timerEl.classList.remove("hide");
});

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("scores");
  updateScores();
});
