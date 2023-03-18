// Created an array for the questions.
const questionS = [
    {
        questionText: "What does CSS stand for?",
        answer: "Cascading Style Sheet",
        options: [
            "Computer Style Sheet",
            "Common Style Sheet",
            "Colorful Style Sheet",
            "Cascading Style Sheet"
        ]
    },
    {
        questionText: "How can you make a numbered list in HTML?",
        answer: "ol",
        options: [
            "dl",
            "list",
            "ol",
            "ul"
        ]
    },
    {
        questionText: "What is the correct HTML for making a drop-down list?",
        answer: "select",
        options: [
            "select",
            "list",
            "input type='dropdown'",
            "input type='list"
        ]
    },
    {
        questionText: "Which HTML attribute is used to define inline styles?",
        answer: "style",
        options: [
            "font",
            "class",
            "styles",
            "style"
        ]
    },
    {
        questionText: "Which is the correct CSS syntax?",
        answer: "body {color: black;}",
        options: [
            "{body;color:black;}",
            "body {color: black;}",
            "{body:color=black;}",
            "body:color=black;"
        ]
    },
    {
        questionText: "How do you select an element with id 'demo'?",
        answer: "#demo",
        options: [
            "demo",
            "*demo",
            "#demo",
            ".demo"
        ]
    },
    {
        questionText: "Inside which HTML element do we put the JavaScript?",
        answer: "script",
        options: [
            "javascript",
            "script",
            "js",
            "scripting"
        ]
    },
    {
        questionText: "How do you create a function in JavaScript?",
        answer: "function myFunction()",
        options: [
            "function myFunction()",
            "function = myFunction()",
            "function:myFunction()",
            "myFunction():function"
        ]
    },
    {
        questionText: "How does a FOR loop start?",
        answer: "for (i = 0; i <= 5; i++)",
        options: [
            "for i = 1 to 5",
            "for (i <= 5; i++)",
            "for (i = 0; i <= 5; i++)",
            "for (i = 0; i <= 5)"
        ]
    },
    {
        questionText: "Which event occurs when the user clicks on an HTML element?",
        answer: "onclick",
        options: [
            "onclick",
            "onchange",
            "onmouseover",
            "onmouseclick"
        ]
    },
];
// Creating a variable for the card id's
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

// hide cards
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

// hide results
function hideResultText() {
  resultDiv.style.display = "none";
}

// Created global variables to use with functions.
var intervalID;
var time;
var currentQuestion;

document.querySelector("#start-button").addEventListener("click", startQuiz);


function startQuiz() {
  
  hideCards();
  questionCard.removeAttribute("hidden");

  
  currentQuestion = 0;
  displayQuestion();

  time = questionS.length * 5;

  intervalID = setInterval(countdown, 1000);

  displayTime();
}

// Creates countdown on timer.
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

//displays time on page
const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

//display the question and answer options for the current question
function displayQuestion() {
  let question = questionS[currentQuestion];
  let options = question.options;

  let h2QuestionElement = document.querySelector("#question-text");
  h2QuestionElement.textContent = question.questionText;

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    let optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}

document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

function optionIsCorrect(optionButton) {
  return optionButton.textContent === questionS[currentQuestion].answer;
}

//if answer is incorrect, deduct time
function checkAnswer(eventObject) {
  let optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      time = 0;
      displayTime();
      endQuiz();
    }
  }

  currentQuestion++;
  if (currentQuestion < questionS.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

const score = document.querySelector("#score");

function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");

//store user initials and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  event.preventDefault();

  //checks for valid input
  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }

  //store scores and initials in an object
  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  //hides the question card and shows the leaderboardcard
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}

function updateStoredLeaderboard(leaderboardItem) {
  let leaderboardArray = getLeaderboard();
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}

//displays leaderboard on leaderboard card
function renderLeaderboard() {
  let sortedLeaderboardArray = sortLeaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

//displays empty leaderboard
function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}


const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  clearInterval(intervalID);

  time = undefined;
  displayTime();

  renderLeaderboard();
}