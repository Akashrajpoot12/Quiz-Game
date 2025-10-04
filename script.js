// Subjects (same as before)
const subjects = [
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Entertainment: Books' },
    { id: 11, name: 'Entertainment: Film' },
    { id: 12, name: 'Entertainment: Music' },
    { id: 13, name: 'Entertainment: Musicals & Theatres' },
    { id: 14, name: 'Entertainment: Television' },
    { id: 15, name: 'Entertainment: Video Games' },
    { id: 16, name: 'Entertainment: Board Games' },
    { id: 17, name: 'Science: Nature' },
    { id: 18, name: 'Science: Computers' },
    { id: 19, name: 'Science: Mathematics' },
    { id: 20, name: 'Science: Mythology' },
    { id: 21, name: 'Sports' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
    { id: 24, name: 'Politics' },
    { id: 25, name: 'Art' },
    { id: 26, name: 'Celebrities' },
    { id: 27, name: 'Animals' },
    { id: 28, name: 'Vehicles' },
    { id: 29, name: 'Entertainment: Comics' },
    { id: 30, name: 'Science: Gadgets' },
    { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, name: 'Entertainment: Cartoon & Animations' }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timerInterval;
let timeLeft = 30;
let isMuted = false;
let quizData = [];
let selectedSubject = null;

const subjectContainer = document.getElementById('subject-container');
const subjectsEl = document.getElementById('subjects');
const startQuizBtn = document.getElementById('start-quiz-btn');
const questionContainer = document.getElementById('question-container');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const timerEl = document.getElementById('timer');
const timeLeftEl = document.getElementById('time-left');
const scoreContainer = document.getElementById('score-container');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const restartBtn = document.getElementById('restart-btn');
const muteBtn = document.getElementById('mute-btn');
const cancelBtn = document.getElementById('cancel-btn');
const progressFill = document.getElementById('progress-fill');
const confettiCanvas = document.getElementById('confetti-canvas');

// HTML Decoder (same)
function decodeHtml(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// Audio Manager (same)
class AudioManager {
    constructor() {
        this.sounds = {};
        this.preloadSounds();
    }

    preloadSounds() {
        const soundFiles = {
            correct: 'correct.mp3',
            wrong: 'wrong.mp3',
            beep: 'beep.mp3',
            whoosh: 'whoosh.mp3'
        };

        Object.keys(soundFiles).forEach(key => {
            this.sounds[key] = new Audio(soundFiles[key]);
            this.sounds[key].preload = 'auto';
        });
    }

    play(soundKey) {
        if (isMuted || !this.sounds[soundKey]) return;
        this.sounds[soundKey].currentTime = 0;
        this.sounds[soundKey].play().catch(e => console.log('Audio play failed:', e));
    }
}

const audioManager = new AudioManager();

function toggleMute() {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
    muteBtn.style.background = isMuted ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)';
}

// Load subjects (same, but add grid class)
function loadSubjects() {
    subjectsEl.innerHTML = '';
    subjectsEl.classList.add('subjects-grid');
    subjects.forEach(subject => {
        const subjectEl = document.createElement('div');
        subjectEl.classList.add('subject');
        subjectEl.textContent = subject.name;
        subjectEl.addEventListener('click', () => selectSubject(subject, subjectEl));
        subjectsEl.appendChild(subjectEl);
    });
}

// Select subject (same)
function selectSubject(subject, subjectEl) {
    document.querySelectorAll('.subject').forEach(el => el.classList.remove('selected'));
    subjectEl.classList.add('selected');
    selectedSubject = subject;
    startQuizBtn.disabled = false;
}

// FetchQuizData (same with retry)
async function fetchQuizData() {
    if (!selectedSubject) return;
    
    let apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedSubject.id}&difficulty=medium&type=multiple`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.response_code === 0 && data.results.length > 0) {
            processQuizData(data);
            return;
        }
    } catch (error) {
        console.error('First fetch error:', error);
    }
    
    apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedSubject.id}&type=multiple`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.response_code === 0 && data.results.length > 0) {
            processQuizData(data);
            return;
        }
    } catch (error) {
        console.error('Retry fetch error:', error);
    }
    
    apiUrl = `https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.response_code === 0 && data.results.length > 0) {
            processQuizData(data);
            return;
        }
    } catch (error) {
        console.error('Fallback fetch error:', error);
    }
    
    alert(`No questions available for "${selectedSubject.name}". Try another subject or check internet.`);
}

function processQuizData(data) {
    quizData = data.results.map(q => {
        const answers = [...q.incorrect_answers, q.correct_answer];
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        const correctIndex = answers.findIndex(ans => ans === q.correct_answer);
        return {
            question: decodeHtml(q.question),
            options: answers.map(ans => decodeHtml(ans)),
            correct: correctIndex
        };
    });
    startQuiz();
}

function startQuiz() {
    subjectContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    updateProgress();
    loadQuestion();
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressFill.style.width = progress + '%';
}

// Timer functions (same)
function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();
    audioManager.play('whoosh');
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 10 && timeLeft > 9) {
            audioManager.play('beep');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            audioManager.play('wrong');
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timeLeftEl.textContent = timeLeft;
    const timerDiv = timerEl;
    
    timerDiv.classList.remove('warning', 'danger');
    if (timeLeft <= 10) {
        timerDiv.classList.add('danger');
    } else if (timeLeft <= 20) {
        timerDiv.classList.add('warning');
    }
}

function timeUp() {
    nextBtn.disabled = true;
    showFeedback(false);
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

// Show feedback (same)
function showFeedback(isCorrect) {
    const correctIndex = quizData[currentQuestionIndex].correct;
    document.querySelectorAll('.option').forEach((el, index) => {
        el.style.pointerEvents = 'none';
        if (index === correctIndex) {
            el.classList.add('correct');
        } else if (selectedOption === index && !isCorrect) {
            el.classList.add('incorrect');
        }
    });
    
    setTimeout(() => {
        if (isCorrect) {
            audioManager.play('correct');
        } else if (selectedOption !== null) {
            audioManager.play('wrong');
        }
    }, 200);
}

// Load question (add progress update)
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;
    optionsEl.innerHTML = '';
    optionsEl.classList.add('options-list');

    currentQuestion.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.classList.add('option');
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => selectOption(index, optionEl));
        optionsEl.appendChild(optionEl);
    });

    nextBtn.disabled = true;
    selectedOption = null;
    startTimer();
    updateProgress();
}

// Select option (same)
function selectOption(index, optionEl) {
    if (timeLeft <= 0) return;
    
    document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
    optionEl.classList.add('selected');
    selectedOption = index;
    nextBtn.disabled = false;
}

// Next question (same)
function nextQuestion() {
    clearInterval(timerInterval);
    
    let isCorrect = false;
    if (selectedOption === quizData[currentQuestionIndex].correct) {
        isCorrect = true;
        score++;
    }
    
    showFeedback(isCorrect);
    
    setTimeout(() => {
        // Reset options for next
        document.querySelectorAll('.option').forEach(el => {
            el.style.pointerEvents = 'auto';
            el.classList.remove('selected', 'correct', 'incorrect');
        });
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showScore();
        }
    }, 1500);
}

// Show score with confetti
function showScore() {
    questionContainer.style.display = 'none';
    scoreContainer.style.display = 'block';
    scoreEl.textContent = score;
    totalEl.textContent = quizData.length;
    drawConfetti();
}

// Simple confetti animation
function drawConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    const colors = ['#ff6b6b', '#4ecdc4', '#667eea', '#ffd700'];
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 5 + 5;
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillRect(x, y, size, size);
        }
        setTimeout(animate, 100);
    }
    setTimeout(() => animate(), 500);  // Start after score shows
}

// Cancel quiz
function cancelQuiz() {
    if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
        currentQuestionIndex = 0;
        score = 0;
        selectedOption = null;
        if (timerInterval) clearInterval(timerInterval);
        questionContainer.style.display = 'none';
        subjectContainer.style.display = 'block';
        startQuizBtn.disabled = true;
        selectedSubject = null;
        quizData = [];
        document.querySelectorAll('.option').forEach(el => {
            el.style.pointerEvents = 'auto';
            el.classList.remove('selected', 'correct', 'incorrect');
        });
        document.querySelectorAll('.subject').forEach(el => el.classList.remove('selected'));
        subjectsEl.innerHTML = '';
        loadSubjects();
    }
}

// Restart quiz (same)
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    if (timerInterval) clearInterval(timerInterval);
    scoreContainer.style.display = 'none';
    questionContainer.style.display = 'none';
    subjectContainer.style.display = 'block';
    startQuizBtn.disabled = true;
    selectedSubject = null;
    quizData = [];
    document.querySelectorAll('.option').forEach(el => {
        el.style.pointerEvents = 'auto';
        el.classList.remove('selected', 'correct', 'incorrect');
    });
    document.querySelectorAll('.subject').forEach(el => el.classList.remove('selected'));
    subjectsEl.innerHTML = '';
    loadSubjects();
}

// Event listeners
startQuizBtn.addEventListener('click', fetchQuizData);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
muteBtn.addEventListener('click', toggleMute);
cancelBtn.addEventListener('click', cancelQuiz);

// Initialize
loadSubjects();