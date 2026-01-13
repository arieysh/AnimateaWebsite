// --- DATA FOR DETAILS MODAL ---
const detailedContent = {
    ahead: { title: "Ahead of Story (Mystery)", body: "This occurs when the audience knows <em>less</em> than the characters. It creates curiosity and mystery." },
    behind: { title: "Behind Story (Suspense)", body: "This is the essence of suspense. The audience knows <em>more</em> than the characters." },
    parallel: { title: "Parallel Action (Pacing)", body: "This involves cutting between two different scenes happening simultaneously." },
    squash: { title: "Squash & Stretch", body: "Considered the most important principle. It gives the illusion of weight and volume." },
    anticipation: { title: "Anticipation", body: "This prepares the audience for an action." },
    staging: { title: "Staging", body: "Staging is the presentation of an idea so that it is completely and unmistakably clear." },
    straight: { title: "Straight Ahead vs Pose to Pose", body: "Straight Ahead: Animating frame by frame. Pose to Pose: Creating Keyframes first." },
    follow: { title: "Follow Through & Overlapping Action", body: "When a character stops, nothing stops all at once. This obeys the laws of inertia." },
    slow: { title: "Slow In and Slow Out", body: "Objects in the real world need time to accelerate and decelerate." },
    arcs: { title: "Arcs", body: "Most natural actions follow an arched trajectory." },
    secondary: { title: "Secondary Action", body: "Gestures that support the main action to add dimension." },
    timing: { title: "Timing", body: "The number of frames between two poses determines the speed and weight." },
    exaggeration: { title: "Exaggeration", body: "Pushing the expression, the pose, or the action to make it more appealing." },
    solid: { title: "Solid Drawing", body: "Understanding the rig and 3D space. Ensuring the character doesn't 'clip'." },
    appeal: { title: "Appeal", body: "The character is interesting to look at. Charismatic design." }
};

function openDetails(key) {
    const data = detailedContent[key];
    if(data) {
        document.getElementById('modal-title').innerHTML = data.title;
        document.getElementById('modal-body').innerHTML = data.body;
        document.getElementById('info-modal').style.display = 'flex';
    }
}

function closeModal() { document.getElementById('info-modal').style.display = 'none'; }
window.onclick = function(event) { if (event.target == document.getElementById('info-modal')) closeModal(); }

function toggleGlossary() { document.getElementById('glossaryPanel').classList.toggle('open'); }
function toggleTranscript(id) { document.getElementById(id).classList.toggle('open'); }

function updatePath() {
    const path = document.getElementById('scroll-path');
    const height = document.body.scrollHeight;
    const width = window.innerWidth;
    let d = `M ${width * 0.2}, 0 `; 
    const steps = 15;
    const stepHeight = height / steps;
    for(let i=0; i<steps; i++) {
        let y = (i+1) * stepHeight;
        let x = (i % 2 === 0) ? width * 0.22 : width * 0.18; 
        d += `L ${x}, ${y} `;
    }
    path.setAttribute('d', d);
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
}

window.addEventListener('scroll', () => {
    const path = document.getElementById('scroll-path');
    if(path) {
        const len = path.getTotalLength();
        const scrollPercent = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        const drawLength = len * scrollPercent;
        path.style.strokeDashoffset = len - drawLength;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
    }, {threshold: 0.1});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const timeline = document.querySelector('.timeline-container');
    const progress = document.getElementById('timeline-progress');
    if(timeline) {
        const rect = timeline.getBoundingClientRect();
        const winH = window.innerHeight;
        if(rect.top < winH/2) {
            let pct = (winH/2 - rect.top) / timeline.offsetHeight;
            pct = Math.min(Math.max(pct, 0), 1);
            progress.style.height = `${pct * 100}%`;
            document.querySelectorAll('.timeline-step').forEach(step => {
                if(step.getBoundingClientRect().top < winH/1.5) step.classList.add('active');
                else step.classList.remove('active');
            });
        }
    }
});

window.addEventListener('load', updatePath);
window.addEventListener('resize', updatePath);

const scenarios = [
    { text: "Bomb under table, characters happy.", answer: "behind", expl: "Dramatic Irony." },
    { text: "Mysterious letter, content unknown.", answer: "ahead", expl: "Mystery." },
    { text: "Hero defuses bomb, villain escapes.", answer: "parallel", expl: "Parallel Action." }
];
let quizIdx = 0;
function checkAnswer(ans) {
    const curr = scenarios[quizIdx];
    const fb = document.getElementById("feedback-area");
    const btn = document.getElementById("next-btn");
    fb.classList.remove("correct", "wrong");
    if(ans === curr.answer) {
        fb.innerHTML = "Correct! " + curr.expl;
        fb.classList.add("correct");
        btn.style.display = "block";
    } else {
        fb.innerHTML = "Incorrect. Try again!";
        fb.classList.add("wrong");
    }
    fb.style.display = "block";
}
function nextScenario() {
    quizIdx = (quizIdx + 1) % scenarios.length;
    document.getElementById("scenario-text").innerText = scenarios[quizIdx].text;
    document.getElementById("feedback-area").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
}

function playInterpolation() {
    const b1 = document.getElementById('ball-linear');
    const b2 = document.getElementById('ball-bezier');
    b1.classList.remove('animate-linear'); b2.classList.remove('animate-bezier');
    void b1.offsetWidth; 
    b1.classList.add('animate-linear'); b2.classList.add('animate-bezier');
}

const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let particles = [];
    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = 'hsl(' + (Math.random() * 60 + 240) + ', 100%, 70%)';
        }
        update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.2) this.size -= 0.1; }
        draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); particles[i].draw();
            if (particles[i].size <= 0.3) { particles.splice(i, 1); i--; }
        }
        requestAnimationFrame(animateCanvas);
    }
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        for(let i=0; i<3; i++){ particles.push(new Particle(e.clientX - rect.left, e.clientY - rect.top)); }
    });
    animateCanvas();
    window.addEventListener('resize', () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; });
}