const pads = document.querySelectorAll('.pad');
const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const statusText = document.getElementById('status-text');

let gameSequence = [];
let playerSequence = [];
let score = 0;
let highScore = localStorage.getItem('cyberSimonHighScore') || 0;
let isPlaying = false;
let canClick = false;
let currentSpeed = 600;

highScoreEl.textContent = highScore;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const frequencies = {
    green: 329.63,
    red: 261.63,
    yellow: 220.00,
    blue: 164.81
};

function playTone(color, duration = 0.4) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequencies[color], audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

function playErrorSound() {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

function flashPad(color, isError = false) {
    const pad = document.querySelector(`.pad.${color}`);
    if (!pad) return;
    
    if (isError) {
        pad.classList.add('error');
        setTimeout(() => pad.classList.remove('error'), 400);
    } else {
        pad.classList.add('active');
        playTone(color);
        setTimeout(() => pad.classList.remove('active'), currentSpeed / 2);
    }
}

function playSequence() {
    canClick = false;
    statusText.textContent = "WATCH";
    statusText.classList.remove('hidden');
    startBtn.classList.add('hidden');

    let i = 0;
    const interval = setInterval(() => {
        flashPad(gameSequence[i]);
        i++;
        if (i >= gameSequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                canClick = true;
                statusText.textContent = "YOUR TURN";
            }, currentSpeed);
        }
    }, currentSpeed);
}

function nextSequence() {
    playerSequence = [];
    const colors = ['green', 'red', 'yellow', 'blue'];
    const randomColor = colors[Math.floor(Math.random() * 4)];
    gameSequence.push(randomColor);
    
    score = gameSequence.length - 1;
    scoreEl.textContent = score;
    
    if (score > 5) currentSpeed = Math.max(200, 600 - (score * 30));
    
    playSequence();
}

function handlePadClick(e) {
    if (!canClick || !isPlaying) return;
    
    const color = e.target.dataset.color;
    playerSequence.push(color);
    
    flashPad(color);
    
    const currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
        gameOver();
        return;
    }
    
    if (playerSequence.length === gameSequence.length) {
        canClick = false;
        statusText.textContent = "GOOD!";
        setTimeout(nextSequence, 1000);
    }
}

function gameOver() {
    isPlaying = false;
    canClick = false;
    playErrorSound();
    
    document.body.style.animation = 'shake 0.5s';
    setTimeout(() => document.body.style.animation = '', 500);
    
    statusText.textContent = "GAME OVER";
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('cyberSimonHighScore', highScore);
        highScoreEl.textContent = highScore;
    }
    
    setTimeout(() => {
        startBtn.classList.remove('hidden');
        startBtn.textContent = "RETRY";
        statusText.classList.add('hidden');
    }, 1500);
}

function startGame() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    gameSequence = [];
    playerSequence = [];
    score = 0;
    currentSpeed = 600;
    isPlaying = true;
    
    scoreEl.textContent = score;
    startBtn.classList.add('hidden');
    
    setTimeout(nextSequence, 500);
}

pads.forEach(pad => pad.addEventListener('click', handlePadClick));
startBtn.addEventListener('click', startGame);

const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`;
document.head.appendChild(style);