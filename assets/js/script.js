// DOM hooks
const scoreLinkEl = document.querySelector("#scoreLink");
const timerEl = document.querySelector("#timer");
const startEl = document.querySelector("#start");
const resultEl = document.querySelector("#result");
const feedbackEl = document.querySelector("#feedback");
const highScoreEl = document.querySelector("#highScore");

const startBtn = document.querySelector("#startBtn");
const backBtn = document.querySelector("#back");
const clearBtn = document.querySelector("#clear");
const submitBtn = document.querySelector("#submit");

const timeLeft = document.querySelector("#timeLeft");
const questions = document.querySelectorAll(".questions");
const feedbackText = document.querySelector("#feedbackText");
const perfectScore = document.querySelector("#perfectScore");
const finalScore = document.querySelector("#score");
const scoreList = document.querySelector("#scoreList");
const scoreInput = document.querySelector("#scoreInput");

// Countdown timer
let time = 75;
let timer;

function countdown() {
  timer = setInterval(function () {
    if (time > 0) {
      timeLeft.textContent = time;
      time--;
    } else {
      timeLeft.textContent = 0;
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

// Shuffle 10 questions from available 15 questions
const shuffledQuestions = [];

function shuffleQuestions() {
  const availableQuestions = Array.from(questions);

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    shuffledQuestions.push(availableQuestions[randomIndex]);
    availableQuestions.splice(randomIndex, 1);
  }

  shuffledQuestions.forEach((question, index) => {
    question.setAttribute("data-index", index);
  });
}

shuffleQuestions();

// Start quiz
function startQuiz() {
  startEl.classList.add("hide");
  perfectScore.classList.add("hide");
  shuffledQuestions[0].classList.remove("hide");

  countdown();
}

// Next question
function nextQuestion(index) {
  if (index <= 8) {
    shuffledQuestions[index].classList.add("hide");
    shuffledQuestions[index + 1].classList.remove("hide");
  } else {
    shuffledQuestions[index].classList.add("hide");
    endQuiz();
  }

  setTimeout(() => {
    feedbackEl.classList.add("hide");
  }, 1000);
}

// Check if answer is correct
function checkAnswer(index, answer) {
  const isCorrect = answer.classList.contains("correct");

  if (isCorrect) {
    if (time <= 65) {
      time += 10;
    } else {
      time = 75;
    }
    feedbackText.textContent = "Correct!";
    feedbackEl.classList.remove("hide");
  } else {
    if (time >= 10) {
      time -= 10;
    } else {
      time = 0;
    }
    feedbackText.textContent = "Incorrect!";
    feedbackEl.classList.remove("hide");
  }

  timeLeft.textContent = time;
  nextQuestion(index);
}

// End quiz
function endQuiz() {
  clearInterval(timer);

  shuffledQuestions.forEach((question) => {
    question.classList.add("hide");
  });

  if (time >= 0) {
    finalScore.textContent = time;
  } else {
    finalScore.textContent = 0;
  }
  if (time === 75) {
    perfectScore.classList.remove("hide");
  }

  resultEl.classList.remove("hide");
}

// Update scores
function updateScores() {
  scoreList.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.sort((a, b) => a.score - b.score);
  scores.forEach((score) => {
    const li = document.createElement("li");
    li.textContent = `${score.initials}  -  ${score.score}`;
    scoreList.insertBefore(li, scoreList.firstChild);
  });
}

updateScores();

// Error message for submitBtn
function errorMessage() {
  const error = document.createElement("p");

  error.textContent = "** Please enter valid initials to save this score **";
  error.style.cssText =
    "color: red; font-style: italic; font-weight: bold; margin: 1rem 0;";
  submitBtn.insertAdjacentElement("afterend", error);

  setTimeout(() => {
    error.remove();
  }, 4000);
}

// Submit user score and initials
function submitBtnHandler(event) {
  event.preventDefault();
  const initials = scoreInput.value;

  if (!/^[A-Za-z]+$/.test(initials)) {
    errorMessage();
    return;
  }

  const capitalizedInitials = initials.toUpperCase();
  const score = {
    initials: capitalizedInitials,
    score: time,
  };
  const scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push(score);
  localStorage.setItem("scores", JSON.stringify(scores));
  updateScores();

  resultEl.classList.add("hide");
  timerEl.classList.add("hide");
  scoreLinkEl.classList.add("hide");
  highScoreEl.classList.remove("hide");
}

// Navigate to high scores page
function viewScores() {
  endQuiz();

  resultEl.classList.add("hide");
  startEl.classList.add("hide");
  timerEl.classList.add("hide");
  scoreLinkEl.classList.add("hide");
  highScoreEl.classList.remove("hide");
}

// Add event listeners
startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", submitBtnHandler);
scoreLinkEl.addEventListener("click", viewScores);

backBtn.addEventListener("click", function () {
  window.location.reload();
});

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("scores");
  updateScores();
});

shuffledQuestions.forEach((question, index) => {
  const answerBtns = question.querySelectorAll(".answer");
  answerBtns.forEach((answerBtn) => {
    answerBtn.addEventListener("click", (event) => {
      const answer = event.target;
      checkAnswer(index, answer);
    });
  });
});
