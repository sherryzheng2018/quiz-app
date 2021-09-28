
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

let remaining = 0;
let countDownTimer;
let answerLabels = ["A. ", "B. ", "C. ", "D. "];
let questionIndex = 0;

let scoreBdDataLocal = localStorage.getItem("scoreBoardLocal");
let scoreBoardData;
if (scoreBdDataLocal === null) {
    scoreBoardData = [];
    localStorage.setItem("scoreBoardLocal", JSON.stringify(scoreBoardData));
} else {
    scoreBoardData = JSON.parse(scoreBdDataLocal);
}

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

function startQuiz() {
    startTimer(30);
    // console.log("startQuiz");
    startBtnEl.classList.add("hide");
    renderQuestion();
    questionBoxEl.classList.remove("hide");
    gameResultEl.classList.add("hide");
}

function renderQuestion() {
    let currentQuestion = questions[questionIndex];
    questionEl.textContent = currentQuestion.question;
    answerEl.innerHTML = '';
    currentQuestion.answers.forEach(populateAnswer);
}

function hideQuestion() {
    questionBoxEl.classList.add("hide");
}

function selectAnswer(e) {
    // console.log(e.target.dataset.correct);
    if (e.target.dataset.correct === "true") {
        resultEl.textContent = "Correct!";
        gameContinue();
    } else {
        resultEl.textContent = "Wrong!";
        countingDown(5);
    }
}

function gameContinue() {
    //1. if more questions
        //   show next question
        //2. if last question
        //   show initial input
        //   record score with initial
        //   update scorecard
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

function showResult(success) {
    gameResultEl.classList.remove("hide");
    let resultHeader = document.querySelector("#gameResult h3");
    if (success) {
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

function populateAnswer(answerEntry, index) {
    // console.log(answerEntry);
    // console.log(answerLabels[index]);
    let answerBtn = document.createElement("button");
    answerBtn.textContent = answerLabels[index] + answerEntry.answerText;
    answerBtn.addEventListener("click", selectAnswer);
    answerBtn.dataset.correct = answerEntry.correct;
    answerBtn.classList.add("btn");
    answerEl.appendChild(answerBtn);
}

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
        // show time up message in main center
        answerEl.childNodes.forEach(disableBtn);
    }
}

function disableBtn(e) {
    e.removeEventListener("click", selectAnswer);
}

function startTimer(seconds) {
    remaining = seconds;
    countDownTimer = setInterval(function() {
        countingDown(1);
    }
   , 1000);
}


startBtnEl.addEventListener("click", startQuiz)

function submitScore(e) {
    // console.log(playerInitialInputEl.value);
    let currentScore = {
        initial: playerInitialInputEl.value,
        score: remaining,
    };
    scoreBoardEl.innerHTML = "";
    scoreBoardData.push(currentScore);
    localStorage.setItem("scoreBoardLocal", JSON.stringify(scoreBoardData));
    scoreBoardData = scoreBoardData.sort(compare);
    scoreBoardData.forEach(renderScore);
    gameResultScoreFormEl.classList.add("hide");
}

function compare( a, b ) {
    if ( a.score < b.score ){
      return 1;
    }
    if ( a.score > b.score ){
      return -1;
    }
    return 0;
  }

function renderScore(score, index) {
    // console.log(score.initial);
    // console.log(score.score);
   
    let scoreEntry = document.createElement("li");
    scoreEntry.textContent = score.initial + ": " + score.score;
    scoreBoardEl.appendChild(scoreEntry);
}

scoreBtnEl.addEventListener("click", submitScore);

scoreBoardData = scoreBoardData.sort(compare);
scoreBoardData.forEach(renderScore);



function resetScore() {
    localStorage.clear();
    scoreBoardEl.innerHTML = "";
    scoreBoardData = [];
}

resetScoreEl.addEventListener("click", resetScore);