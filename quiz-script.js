document.addEventListener("DOMContentLoaded", () => {

// ================= START SCREEN LOGIC =================
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");

// Hide quiz initially
document.querySelector(".quiz-wrapper").style.display = "none";

startBtn.onclick = () => {
    startScreen.style.display = "none";                       // hide start screen
    document.querySelector(".quiz-wrapper").style.display = "flex"; // show quiz
    loadQuestion();                                           // start quiz
};

// ================= AUDIO =================
const correctSound = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
const wrongSound = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
correctSound.volume = 0.5;
wrongSound.volume = 0.5;

// ================= QUIZ DATA =================
const quizData = [
    { topic: "12 Principles", question: "Which principle gives a sense of weight and flexibility?", options: ["Timing", "Squash and Stretch", "Appeal", "Arcs"], correct: 1 },
    { topic: "12 Principles", question: "What is the purpose of 'Anticipation'?", options: ["Finish an action", "Prepare audience for action", "Slow down render", "Add color"], correct: 1 },
    { topic: "12 Principles", question: "Natural actions usually follow which path?", options: ["Straight lines", "Square patterns", "Arcs", "Zig-zags"], correct: 2 },
    { topic: "12 Principles", question: "What is 'Follow Through'?", options: ["Parts continuing after body stops", "Starting an action", "Camera movement", "Lighting technique"], correct: 0 },
    { topic: "12 Principles", question: "In 'Slow In/Out', where are most frames located?", options: ["Middle", "Start and End", "Only end", "Randomly"], correct: 1 },
    { topic: "3D Modeling", question: "What is a 4-sided polygon called?", options: ["Tris", "N-Gon", "Quad", "Vertex"], correct: 2 },
    { topic: "3D Modeling", question: "What does 'Extruding' do?", options: ["Deletes face", "Creates new geometry", "Changes color", "Rotates camera"], correct: 1 },
    { topic: "3D Modeling", question: "Which axis represents depth?", options: ["X", "Y", "Z", "W"], correct: 2 },
    { topic: "3D Modeling", question: "What is 'Topology'?", options: ["Flow of edges", "Texturing", "Lighting", "Rigging"], correct: 0 },
    { topic: "3D Modeling", question: "Flipped normals cause mesh to look:", options: ["Red", "Invisible", "Transparent", "Blurry"], correct: 1 },
    { topic: "Rigging", question: "What is an internal skeleton called?", options: ["Model", "Rig", "Render", "Sculpt"], correct: 1 },
    { topic: "Rigging", question: "Move hand, elbow follows:", options: ["FK", "IK", "Parenting", "Smoothing"], correct: 1 },
    { topic: "Rigging", question: "What is weight painting?", options: ["Coloring", "Bone influence", "Lighting", "Texturing"], correct: 1 },
    { topic: "Rigging", question: "Parent bone moves, child bone:", options: ["Stops", "Moves", "Breaks", "Shrinks"], correct: 1 },
    { topic: "Rigging", question: "Rotation points are:", options: ["Vertices", "Bones", "Edges", "Pixels"], correct: 1 },
    { topic: "Keyframing", question: "What stores motion data?", options: ["Timeline", "Keyframe", "Cache", "Asset"], correct: 1 },
    { topic: "Keyframing", question: "Motion between keys:", options: ["Interpolation", "Subdivision", "Baking", "Mapping"], correct: 0 },
    { topic: "Keyframing", question: "Timing editor:", options: ["Graph Editor", "Shader", "UV", "Outliner"], correct: 0 },
    { topic: "Keyframing", question: "Cinema FPS:", options: ["12", "24", "60", "120"], correct: 1 },
    { topic: "Keyframing", question: "Linear motion looks:", options: ["Smooth", "Robotic", "Elastic", "Curved"], correct: 1 },
    { topic: "Rendering", question: "UV Unwrapping is:", options: ["Bone setup", "Flattening mesh", "Lighting", "Exporting"], correct: 1 },
    { topic: "Rendering", question: "3-point lighting uses:", options: ["Key, Fill, Back", "Sun, Sky, Lamp", "HDRI", "Spot"], correct: 0 },
    { topic: "Rendering", question: "PBR means:", options: ["Pixel Based", "Physically Based Rendering", "Render Boost", "Polygon Build"], correct: 1 },
    { topic: "Rendering", question: "Render farm is:", options: ["Texture set", "Multiple computers", "Camera type", "Shader"], correct: 1 },
    { topic: "Rendering", question: "Realistic lighting method:", options: ["Wireframe", "Ray Tracing", "Flat shading", "Low poly"], correct: 1 }
];

// ================= VARIABLES =================
let currentQuestion = 0;
let userAnswers = new Array(quizData.length).fill(null);

const questionText = document.getElementById("question-text");
const topicLabel = document.querySelector(".topic-label");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const progressText = document.getElementById("progress-text");
const questionNum = document.getElementById("question-number");

// ================= ERROR MODAL =================
const errorModal = document.getElementById("error-modal");
const closeModalBtn = document.getElementById("close-modal");

function showErrorModal() {
    errorModal.style.display = "flex";
}

closeModalBtn.onclick = () => {
    errorModal.style.display = "none";
};

// ================= LOAD QUESTION =================
function loadQuestion() {
    const q = quizData[currentQuestion];

    topicLabel.innerText = `TOPIC: ${q.topic}`;
    questionNum.innerText = `Question ${currentQuestion + 1} of ${quizData.length}`;
    questionText.innerText = q.question;
    progressText.innerText = `Progress: ${Math.round((currentQuestion / quizData.length) * 100)}%`;

    optionsContainer.innerHTML = "";

    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;

        if (userAnswers[currentQuestion] !== null) {
            if (i === q.correct) btn.classList.add("correct");
            if (i === userAnswers[currentQuestion] && i !== q.correct) btn.classList.add("wrong");
        }

        btn.onclick = () => selectAnswer(i);
        optionsContainer.appendChild(btn);
    });

    backBtn.style.visibility = currentQuestion === 0 ? "hidden" : "visible";
    nextBtn.innerText = currentQuestion === quizData.length - 1 ? "Finish" : "Next";
}

// ================= SELECT ANSWER =================
function selectAnswer(index) {
    if (userAnswers[currentQuestion] !== null) return;

    userAnswers[currentQuestion] = index;

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, i) => {
        if (i === quizData[currentQuestion].correct) {
            btn.classList.add("correct");
            if (i === index) correctSound.play();
        }
        if (i === index && i !== quizData[currentQuestion].correct) {
            btn.classList.add("wrong");
            wrongSound.play();
        }
    });
}

// ================= NEXT BUTTON =================
nextBtn.onclick = () => {
    if (userAnswers[currentQuestion] === null) {
        showErrorModal();
        return;
    }
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
};

// ================= BACK BUTTON =================
backBtn.onclick = () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
};

// ================= SHOW RESULTS =================
function showResults() {
    const total = quizData.length;
    const correctCount = userAnswers.filter((a,i)=>a===quizData[i].correct).length;
    const percent = Math.round((correctCount/total)*100);

    let message = "";
    if (percent >= 85) {
        message = "Wow! You nailed it!";
    } else if (percent >= 50) {
        message = "More to go, keep practicing!";
    } else {
        message = "Keep trying, you can do it!";
    }

    const container = document.querySelector(".quiz-container");
    container.innerHTML = `
        <h2 style="text-align:center; color:#4f6ef7; margin-bottom:10px;">Congratulations! You've Completed the Quiz!</h2>
        <p style="text-align:center; font-size:20px; margin:5px;">Your Score:</p>
        <p style="text-align:center; font-size:28px; font-weight:bold; margin:5px;">${correctCount} / ${total} (${percent}%)</p>
        <p style="text-align:center; font-size:18px; color:#333; margin:15px 0;">${message}</p>
        <div style="text-align:center; margin-top:20px;">
            <button id="review-btn" class="result-btn">REVIEW ANSWERS</button>
            <button id="retry-btn" class="result-btn">TRY AGAIN</button>
        </div>
    `;

    progressText.style.display = "none";
    nextBtn.style.display = "none";
    backBtn.style.display = "none";

    document.getElementById("retry-btn").onclick = () => location.reload();
    document.getElementById("review-btn").onclick = () => reviewAnswers();
}

// ================= REVIEW ANSWERS =================
function reviewAnswers() {
    const container = document.querySelector(".quiz-container");
    container.innerHTML = "";

    quizData.forEach((q, idx) => {
        const qDiv = document.createElement("div");
        qDiv.style.marginBottom = "25px";

        const qTitle = document.createElement("p");
        qTitle.innerHTML = `<strong>Q${idx + 1}:</strong> ${q.question}`;
        qTitle.style.marginBottom = "10px";
        qDiv.appendChild(qTitle);

        q.options.forEach((opt, i) => {
            const optBtn = document.createElement("button");
            optBtn.className = "option-btn";
            optBtn.innerText = opt;

            if (i === q.correct) optBtn.classList.add("correct");
            if (i === userAnswers[idx] && i !== q.correct) optBtn.classList.add("wrong");

            optBtn.disabled = true;
            qDiv.appendChild(optBtn);
        });

        container.appendChild(qDiv);
    });

    const btnDiv = document.createElement("div");
    btnDiv.style.textAlign = "center";
    btnDiv.style.marginTop = "20px";

    const scoreBtn = document.createElement("button");
    scoreBtn.className = "result-btn";
    scoreBtn.innerText = "BACK TO SCORE";
    scoreBtn.onclick = () => showResults();

    const retryBtn = document.createElement("button");
    retryBtn.className = "result-btn";
    retryBtn.innerText = "TRY AGAIN";
    retryBtn.onclick = () => location.reload();

    btnDiv.appendChild(scoreBtn);
    btnDiv.appendChild(retryBtn);
    container.appendChild(btnDiv);
}

// ================= INITIAL LOAD =================
// Do NOT call loadQuestion() here, it will be called after start button click

});
