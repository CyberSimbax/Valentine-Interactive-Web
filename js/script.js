// Configuration
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyrAeqqxDq7yZRAqvHoBsUEsdWIVLl69OHSN2wsEnqSjpQfhxCUpW0B9MRYt2hbhMS4/exec',
    FLOATING_HEART_INTERVAL: 1500,
    BUTTON_RESET_TIME: 1000,
    MAX_CONFETTI_COUNT: 200
};

// DOM Elements
const elements = {
    yesButton: document.querySelector('.btn-yes'),
    noButton: document.querySelector('.btn-no'),
    buttonsContainer: document.querySelector('.buttons'),
    title: document.querySelector('h1'),
    soundEffect: document.getElementById('soundEffect'),
    backgroundMusic: document.getElementById('backgroundMusic')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkPreviousResponse();
    setupEventListeners();
    initializeBackgroundMusic();
    startFloatingHearts();
});

function checkPreviousResponse() {
    if(localStorage.getItem('valentineAnswer')) {
        elements.buttonsContainer.classList.add('hidden');
        elements.title.innerHTML = "I knew you'd say yes! 💖<br>Let's celebrate! 🥂";
    }
}

function setupEventListeners() {
    elements.yesButton.addEventListener('click', handleYes);
    elements.noButton.addEventListener('mouseover', moveButton);
    elements.noButton.addEventListener('touchstart', moveButton);
    document.addEventListener('click', handleClickAnywhere);
}

function initializeBackgroundMusic() {
    document.body.addEventListener('click', () => {
        elements.backgroundMusic.play().catch(error => {
            console.log('Audio playback prevented:', error);
        });
    }, { once: true });
}

// Event Handlers
async function handleYes() {
    try {
        localStorage.setItem('valentineAnswer', 'yes');
        elements.soundEffect.play();
        
        triggerConfetti();
        await sendToGoogleSheets();
        
        elements.buttonsContainer.classList.add('hidden');
        elements.title.innerHTML = "Yay! 💖 You've made me the happiest person! 🥰";
    } catch (error) {
        console.error('Error handling yes:', error);
    }
}

function moveButton() {
    const btnNo = elements.noButton;
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    
    const maxX = containerRect.width - btnNo.offsetWidth;
    const maxY = containerRect.height - btnNo.offsetHeight;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    setTimeout(() => {
        btnNo.style.transform = 'translate(0, 0)';
    }, CONFIG.BUTTON_RESET_TIME);
}

// Confetti System
function triggerConfetti() {
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(CONFIG.MAX_CONFETTI_COUNT * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

// Google Sheets Integration
async function sendToGoogleSheets() {
    try {
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                answer: 'yes',
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });
    } catch (error) {
        console.error('Google Sheets Error:', error);
    }
}

// Floating Hearts System
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'floating-heart';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${Math.random() * 3 + 4}s`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 6000);
}

function startFloatingHearts() {
    setInterval(createFloatingHeart, CONFIG.FLOATING_HEART_INTERVAL);
}

// Click Interaction
function handleClickAnywhere(e) {
    if(e.target.closest('.btn')) return;
    
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = `${e.pageX}px`;
    heart.style.top = `${e.pageY}px`;
    heart.style.fontSize = '2rem';
    heart.style.animation = 'clickHeart 1s ease-out';
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 1000);
}