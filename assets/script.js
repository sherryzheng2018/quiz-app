// define variable elements
var timerEl = document.getElementById("timer");
var startBtnEl = document.getElementById("start");
var questionEl = document.getElementById("question");
var answerEl = document.getElementById("answerBox");
var resultEl = document.getElementById("questionResult");
var questionBoxEl = document.getElementById("questionBox");
var gameResultEl = document.getElementById("gameResult");
var gameResultScoreFormEl = document.getElementById("scoreForm");
var playerInitialInputEl = document.getElementById("playerInitial");
var scoreBtnEl = document.getElementById("submitScore");
var scoreBoardEl = document.getElementById("scoreBoard");
var resetScoreEl = document.getElementById("clearScore");

let resultHeader = document.querySelector("#gameResult h3");

let remaining = 0;
let countDownTimer;
let questionIndex = 0;
// read score board data from local storage
let scoreBdDataLocal = localStorage.getItem("scoreBoardLocal");
// local var to store data
let scoreBoardData;
// initialize score borad data by using local storage
if (scoreBdDataLocal === null) {
    scoreBoardData = [];
    localStorage.setItem("scoreBoardLocal", JSON.stringify(scoreBoardData));
} else {
    scoreBoardData = JSON.parse(scoreBdDataLocal);
}
// initialize questions
let questions = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: [
            {
                answerText: "<scripting>",
            },
            {
                answerText: "<script>",
                correct: true,
            },
            {
                answerText: "<javascript>",
            },
            {
                answerText: "<js>",
            }
        ]
    },
    {
        question: "How do you write \"Hello World\" in an alert box?",
        answers: [
            {
                answerText: "msg(\'Hello World\')",
            },
            {
                answerText: "msgBox(\'Hello World\')",
            },
            {
                answerText: "alertBox(\'Hello World\')",
            },
            {
                answerText: "alert(\'Hello World\')",
                correct: true,
            }
        ]
    },
    {
        question: "How do you create a function in JavaScript?",
        answers: [
            {
                answerText: "function:myFunction()",
            },
            {
                answerText: "function=myFunction()",
            },
            {
                answerText: "function myFunction()",
                correct: true,
            },
            {
                answerText: "function/myFunction()",
            }
        ]
    },
    {
        question: "How to write an IF statement in JavaScript?",
        answers: [
            {
                answerText: "if i=5 then",
            },
            {
                answerText: "if i===5 then",
            },
            {
                answerText: "if (i == 5)",
                correct: true,
            },
            {
                answerText: "if i=5",
            }
        ]
    },
    {
        question: "How does a FOR loop start?",
        answers: [
            {
                answerText: "for(i=0; i<5; i++)",
                correct: true,
            },
            {
                answerText: "for i = 1 to 5",
            },
            {
                answerText: "for (i<=5; i++)",
            },
            {
                answerText: "for (i=0; i <=5)",
            }
        ]
    }
]

let answerLabels = ["A. ", "B. ", "C. ", "D. "];
// ******************
// using function to generate question
// ******************
// function newQuestion(question, answerList, correctIndex) {
    //     var returnQuestion = {
        //         question: question,
        //         answers: []
        //     };
        
        //     var answerListObject = [];

//     answerList.forEach((answerItem, index) =>{
//         if(index === correctIndex) {
//             answerListObject.push({
//                 answerText: answerItem,
//                 correct: true
//             })
//         } else {
//             answerListObject.push({
//                 answerText: answerItem,
//             })
//         }
//     })

//     returnQuestion.answers = answerListObject;
//     return returnQuestion;
// }

// questions.push(newQuestion("How does a FOR loop start?", 
//                     ["for(i=0; i<5; i++)","for i = 1 to 5","for (i<=5; i++)","for (i=0; i <=5)"], 
//                     0))            
// questions.push(newQuestion("How does another FOR loop start?", 
//                     ["for(i=0; i<5; i++)","for i = 1 to 5","for (i<=5; i++)","for (i=0; i <=5)"], 
//                     0))
// ******************

// function to start the quiz
function startQuiz() {
    startTimer(30);
    // console.log("startQuiz");
    startBtnEl.classList.add("hide");
    renderQuestion();
    questionBoxEl.classList.remove("hide");
    // clear result from last round
    gameResultEl.classList.add("hide"); 
}

function renderQuestion() {
    let currentQuestion = questions[questionIndex];
    questionEl.textContent = currentQuestion.question;
    // clear answer list from last question
    answerEl.innerHTML = '';
    // call populateAnswer for each answer entry
    currentQuestion.answers.forEach(populateAnswer);
}

function populateAnswer(answerEntry, index) {
    // console.log(answerEntry);
    // console.log(answerLabels[index]);
    // create answer btns
    let answerBtn = document.createElement("button");
    // use answer entry to populate btn text
    answerBtn.textContent = answerLabels[index] + answerEntry.answerText;
    // add click function to answer btn
    answerBtn.addEventListener("click", verifyAnswer);
    // label the btn with correct answer, using dataset
    answerBtn.dataset.correct = answerEntry.correct;
    // add btn class
    answerBtn.classList.add("answerBtn");
    answerEl.appendChild(answerBtn);
}

// click function for answer btn
// if result is correct, continue to next question or complete
// else if result is wrong, decrease 5 seconds as punishment
function verifyAnswer(e) {
    // console.log(e.target.dataset.correct);
    if (e.target.dataset.correct === "true") {
        resultEl.textContent = "Correct!";
        gameContinue();
    } else {
        resultEl.textContent = "Wrong!";
        countingDown(5);
    }
}

// add function to hide question box after game done
function hideQuestion() {
    questionBoxEl.classList.add("hide");
}

//1. if there are more questions
//   then show next question
//2. if no more questions
//   then quiz completed
//   show initial input to submit socre
//   record score with initial
//   then update scorecard
function gameContinue() {
    
    if (questionIndex < questions.length-1) {
        questionIndex++;
        renderQuestion();
    } else { //else means the last question has been answered
        clearInterval(countDownTimer);
        resultEl.textContent = 'play again';
        hideQuestion();
        showResult(true);
    }
}

// display result when quiz is completed, or time is up
function showResult(allQuestionAnswered) {
    gameResultEl.classList.remove("hide");
    
    if (allQuestionAnswered) {
        resultHeader.textContent = "Congratulations! Quiz Completed! You scored " + remaining + " .";
        console.log(resultHeader);
        gameResultScoreFormEl.classList.remove("hide");
    } else {
        resultHeader.textContent = "Time up! Please try again!";
        gameResultScoreFormEl.classList.add("hide");
    }
    questionIndex = 0;
    startBtnEl.classList.remove("hide");
}

// function to keep track of remianing time of the quiz
function countingDown(numberOfSeconds) {
    timerEl.textContent = "Time remaining: " + (remaining-1) + "s.";
    if (remaining-numberOfSeconds < 0) {
        remaining = 0;
    } else {
        remaining=remaining-numberOfSeconds;
    }

    if (remaining ===0 ) {
        clearInterval(countDownTimer);
        timerEl.textContent = "";
        resultEl.textContent = "";
        hideQuestion();
        showResult(false);
    }
}

function startTimer(seconds) {
    remaining = seconds;
    countDownTimer = setInterval(function() {
        countingDown(1);
    }
   , 1000);
}

function submitScore(e) {
    // console.log(playerInitialInputEl.value);
    let currentScore = {
        initial: playerInitialInputEl.value,
        score: remaining,
    };
    // clear previous score board
    scoreBoardEl.innerHTML = "";
    // add current score to the score board data
    scoreBoardData.push(currentScore);
    // update score board data to local storage
    localStorage.setItem("scoreBoardLocal", JSON.stringify(scoreBoardData));
    // sort score data from high to low 
    scoreBoardData = scoreBoardData.sort(compare);
    scoreBoardData.forEach(renderScore);
    // hide score submission form 
    gameResultScoreFormEl.classList.add("hide");
}

// custom compare function for sorting 
function compare( a, b ) {
    if ( a.score < b.score ){
      return 1;
    }
    if ( a.score > b.score ){
      return -1;
    }
    return 0;
  }

//function to render score board
function renderScore(score, index) {
    // console.log(score.initial);
    // console.log(score.score);
   
    let scoreEntry = document.createElement("li");
    scoreEntry.textContent = score.initial + ": " + score.score;
    scoreBoardEl.appendChild(scoreEntry);
}

function resetScore() {
    localStorage.clear();
    scoreBoardEl.innerHTML = "";
    scoreBoardData = [];
}

startBtnEl.addEventListener("click", startQuiz)
scoreBtnEl.addEventListener("click", submitScore);
resetScoreEl.addEventListener("click", resetScore);
scoreBoardData = scoreBoardData.sort(compare);
scoreBoardData.forEach(renderScore);