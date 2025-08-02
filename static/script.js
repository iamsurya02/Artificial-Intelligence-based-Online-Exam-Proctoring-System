console.log("script.js loaded");

// Verify questions array
if (typeof questions === 'undefined') {
    console.error("questions array is undefined - ensure questions.js is loaded");
}

// Selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box ? info_box.querySelector(".buttons .quit") : null;
const continue_btn = info_box ? info_box.querySelector(".buttons .restart") : null;
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const waitTxt = document.querySelector(".result_box .wait_text");
const camOpen = document.querySelector(".camera");

// Verify DOM elements
console.log("DOM elements:", {
    start_btn: !!start_btn,
    info_box: !!info_box,
    exit_btn: !!exit_btn,
    continue_btn: !!continue_btn,
    quiz_box: !!quiz_box,
    option_list: !!option_list
});

// Shuffle array function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Randomize questions and options
if (typeof questions !== 'undefined') {
    console.log("Randomizing questions");
    questions = shuffle(questions);
    questions.forEach(q => q.options = shuffle(q.options));
} else {
    console.error("Cannot randomize: questions array is undefined");
}

// If startQuiz button clicked
if (start_btn) {
    start_btn.onclick = () => {
        console.log("Start Quiz button clicked");
        if (info_box) {
            info_box.classList.add("activeInfo"); // Show info box
        } else {
            console.error("info_box not found");
        }
    };
} else {
    console.error("start_btn not found");
}

// If exit quiz button clicked
if (exit_btn) {
    exit_btn.onclick = () => {
        console.log("Exit Quiz button clicked");
        location.replace("./quiz.html");
    };
}

// If continue quiz button clicked
if (continue_btn) {
    continue_btn.onclick = () => {
        console.log("Continue Quiz button clicked");
        document.documentElement.requestFullscreen().catch(err => {
            console.error("Fullscreen error:", err);
        });
        if (info_box && quiz_box) {
            info_box.classList.remove("activeInfo"); // Hide info box
            quiz_box.classList.add("activeQuiz"); // Show quiz
            if (typeof questions !== 'undefined' && questions.length > 0) {
                showQuetions(0);
                queCounter(1);
                startTimer(15);
                startTimerLine(0);
            } else {
                console.error("No questions available to display");
            }
        } else {
            console.error("info_box or quiz_box not found");
        }
    };
}

function showQuetions(index) {
    console.log("Showing question:", index + 1);
    if (!option_list || !quiz_box) {
        console.error("option_list or quiz_box not found");
        return;
    }
    const que_text = quiz_box.querySelector(".que_text");
    if (!que_text) {
        console.error("que_text not found");
        return;
    }

    // Creating a new span and div tag for questions and options
    let que_tag = 
        "<span>" +
        questions[index].numb + ". " + 
        questions[index].question +
        "</span>";

    let option_tag = 
        '<div class="option"><span>' + questions[index].options[0] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[1] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[2] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[3] + "</span></div>";

    que_text.innerHTML = que_tag; // Adding new span tag inside que_tag
    option_list.innerHTML = option_tag; // Adding new div tag inside option_tag

    const option = option_list.querySelectorAll(".option");

    // Set onclick attribute to all available options
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKZurBlLLkKcDsBNv8-_1sWHGVNQoJqhc",
    authDomain: "ai-online-exam-proctoring.firebaseapp.com",
    projectId: "ai-online-exam-proctoring",
    storageBucket: "ai-online-exam-proctoring.firebasestorage.app",
    messagingSenderId: "797453928989",
    appId: "1:797453928989:web:ef9da80144d8762dc714f4",
    measurementId: "G-9Z25R6Z260"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}
const db = firebase.database();

// Test Firebase connectivity
function testFirebase() {
    console.log("Testing Firebase...");
    db.ref('test').set({
        test: "Hello, Firebase!",
        timestamp: new Date().toISOString()
    }).then(() => {
        console.log("Test data saved successfully");
    }).catch(error => {
        console.error("Test data error:", error);
    });
}
testFirebase();

// Function to save the user's score to Firebase
function saveScore(username, score) {
    console.log("Attempting to save score:", { username, score });
    db.ref('scores').push({
        username: username,
        score: score,
        timestamp: new Date().toISOString()
    }).then(() => {
        console.log("Score saved successfully");
    }).catch(error => {
        console.error("Error saving score:", error);
    });
}

// Log proctoring events (e.g., tab switch)
function logProctoringEvent(event) {
    const username = localStorage.getItem("username") || "user";
    console.log("Proctoring event:", event);
    db.ref('proctoring_logs').push({
        username: username,
        event: event,
        timestamp: new Date().toISOString()
    }).then(() => {
        console.log("Proctoring event logged successfully");
    }).catch(error => {
        console.error("Error logging proctoring event:", error);
    });
}

// Detect tab switch or minimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        logProctoringEvent("User switched tabs or minimized window");
    }
});

// Disable copy and paste
document.addEventListener('copy', e => {
    e.preventDefault();
    logProctoringEvent("User attempted to copy content");
});
document.addEventListener('paste', e => {
    e.preventDefault();
    logProctoringEvent("User attempted to paste content");
});

function showResult() {
    console.log("showResult called, userScore:", userScore);
    if (!info_box || !quiz_box || !result_box) {
        console.error("info_box, quiz_box, or result_box not found");
        return;
    }
    info_box.classList.remove("activeInfo"); // Hide info box
    quiz_box.classList.remove("activeQuiz"); // Hide quiz box
    result_box.classList.add("activeResult"); // Show result box
    const scoreText = result_box.querySelector(".score_text");

    if (!scoreText) {
        console.error("score_text not found");
        return;
    }

    if (userScore > 3) {
        let scoreTag = "<span>Congrats! You got <p>" + userScore + "</p> out of <p>" + questions.length + "</p></span>";
        scoreText.innerHTML = scoreTag;
    } else {
        let scoreTag = "<span>Nice, You got <p>" + userScore + "</p> out of <p>" + questions.length + "</p></span>";
        scoreText.innerHTML = scoreTag;
    }

    // Save the score to Firebase
    const username = localStorage.getItem("username") || "user";
    console.log("Saving score for username:", username);
    saveScore(username, userScore);

    // Redirect after 10 seconds
    setTimeout(function() {
        console.log("Redirecting to home...");
        window.location.href = 'http://127.0.0.1:5000';
    }, 10000);
}

let counter;
let counterLine;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let timeValue = 15;
let widthValue = 0;

const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer) {
    console.log("Option selected:", answer.textContent);
    clearInterval(counter); // Clear counter
    clearInterval(counterLine); // Clear counterLine
    let userAns = answer.textContent; // Getting user selected option
    let correcAns = questions[que_count].answer; // Getting correct answer
    const allOptions = option_list.children.length; // Getting all option items

    if (userAns == correcAns) {
        userScore += 1; // Incrementing the user's score
        answer.classList.add("correct"); // Adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); // Adding tick icon
        console.log("Correct Answer, userScore:", userScore);
    } else {
        answer.classList.add("incorrect"); // Adding red color to incorrect selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Adding cross icon
        console.log("Wrong Answer");

        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) {
                option_list.children[i].setAttribute("class", "option correct"); // Highlight correct option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                console.log("Auto selected correct answer.");
            }
        }
    }
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); // Disable all options
    }
    next_btn.classList.add("show"); // Show the next button
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// If next question button clicked
if (next_btn) {
    next_btn.onclick = () => {
        console.log("Next button clicked, que_count:", que_count);
        if (que_count < questions.length - 1) {
            que_count++;
            que_numb++;
            showQuetions(que_count);
            queCounter(que_numb);
            clearInterval(counter);
            clearInterval(counterLine);
            startTimer(timeValue);
            startTimerLine(widthValue);
            timeText.textContent = 'Time Left';
            next_btn.classList.remove("show");
        } else {
            clearInterval(counter);
            clearInterval(counterLine);
            showResult();
        }
    };
} else {
    console.error("next_btn not found");
}

function queCounter(index) {
    console.log("Updating question counter:", index);
    if (bottom_ques_counter) {
        let totalQueCounTag = 
            "<span><p>" + index + "</p> of <p>" + questions.length + "</p> Questions</span>";
        bottom_ques_counter.innerHTML = totalQueCounTag;
    } else {
        console.error("bottom_ques_counter not found");
    }
}

function startTimer(time) {
    console.log("Starting timer:", time);
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; // Update time display
        time--; // Decrement time

        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; // Add leading zero
        }

        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Time Off";
            const allOptions = option_list.children.length;
            let correcAns = questions[que_count].answer;
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show");
        }
    }
}

function startTimerLine(time) {
    console.log("Starting timer line:", time);
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1;
        time_line.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }
}

// Disable screenshot (optional, may not work in all browsers)
window.addEventListener('screenshotTaken', function(e) {
    e.preventDefault();
    console.log("Screenshot attempt detected");
});