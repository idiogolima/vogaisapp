// Global state variables
let currentLang = localStorage.getItem("vogaisapp_lang") || "pt";
let currentCategory = localStorage.getItem("vogaisapp_category") || "vogais";
let stars = parseInt(localStorage.getItem("vogaisapp_stars") || "0");

let currentLearnIndex = 0;
let quizCorrectItem = null;
let memoryCards = [];
let memoryFlippedCards = [];
let memoryLock = false;
let memoryMatches = 0;
let installPromptEvent = null;

// Drawing state
let drawCanvas, drawCtx;
let isDrawing = false;
let drawColor = "#FF6B6B";
let selectedDrawItem = "A";

// Confetti state
let confettiCanvas, confettiCtx;
let confettiActive = false;
let confettiParticles = [];

// Content Data Model for Vowels, Numbers (1-10), and Colors with Phrases
const CONTENT_DATA = {
  pt: {
    vogais: [
      { char: 'A', name: 'Abelha', type: 'image', value: 'imgs/a.png', color: 'var(--color-a)', phrase: 'A de Abelha' },
      { char: 'E', name: 'Elefante', type: 'image', value: 'imgs/e.png', color: 'var(--color-e)', phrase: 'E de Elefante' },
      { char: 'I', name: 'Iguana', type: 'image', value: 'imgs/i.png', color: 'var(--color-i)', phrase: 'I de Iguana' },
      { char: 'O', name: 'Ovelha', type: 'image', value: 'imgs/o.png', color: 'var(--color-o)', phrase: 'O de Ovelha' },
      { char: 'U', name: 'Urso', type: 'image', value: 'imgs/u.png', color: 'var(--color-u)', phrase: 'U de Urso' }
    ],
    numeros: [
      { char: '1', name: 'Uma Maçã', type: 'emoji', value: '🍎', color: '#FFEBF0' },
      { char: '2', name: 'Duas Bananas', type: 'emoji', value: '🍌🍌', color: '#FFFDF0' },
      { char: '3', name: 'Três Peixes', type: 'emoji', value: '🐟🐟🐟', color: '#E3F2FD' },
      { char: '4', name: 'Quatro Estrelas', type: 'emoji', value: '⭐⭐⭐⭐', color: '#FFFDE7' },
      { char: '5', name: 'Cinco Flores', type: 'emoji', value: '🌸🌸🌸🌸🌸', color: '#FCE7F3' },
      { char: '6', name: 'Seis Borboletas', type: 'emoji', value: '🦋🦋🦋🦋🦋🦋', color: '#EAFDF5' },
      { char: '7', name: 'Sete Bolas', type: 'emoji', value: '⚽⚽⚽⚽⚽⚽⚽', color: '#F3F4F6' },
      { char: '8', name: 'Oito Balões', type: 'emoji', value: '🎈🎈🎈🎈🎈🎈🎈🎈', color: '#FFF1F2' },
      { char: '9', name: 'Nove Carros', type: 'emoji', value: '🚗🚗🚗🚗🚗🚗🚗🚗🚗', color: '#ECFDF5' },
      { char: '10', name: 'Dez Doces', type: 'emoji', value: '🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬', color: '#FDF2F8' }
    ],
    cores: [
      { char: 'Vermelho', name: 'Coração', type: 'color', value: '#FF3B30', emoji: '❤️', color: '#FFEBEE', phrase: 'O coração é vermelho' },
      { char: 'Verde', name: 'Folha', type: 'color', value: '#2ECC71', emoji: '🍃', color: '#E8F5E9', phrase: 'A folha é verde' },
      { char: 'Azul', name: 'Nuvem', type: 'color', value: '#4DABF7', emoji: '☁️', color: '#E3F2FD', phrase: 'A nuvem é azul' },
      { char: 'Amarelo', name: 'Sol', type: 'color', value: '#FFD32D', emoji: '☀️', color: '#FFFDE7', phrase: 'O sol é amarelo' },
      { char: 'Roxo', name: 'Uva', type: 'color', value: '#9B59B6', emoji: '🍇', color: '#F3E5F5', phrase: 'A uva é roxa' }
    ]
  },
  en: {
    vogais: [
      { char: 'A', name: 'Apple', type: 'emoji', value: '🍎', color: 'var(--color-a)', phrase: 'A for Apple' },
      { char: 'E', name: 'Elephant', type: 'emoji', value: '🐘', color: 'var(--color-e)', phrase: 'E for Elephant' },
      { char: 'I', name: 'Iguana', type: 'emoji', value: '🦎', color: 'var(--color-i)', phrase: 'I for Iguana' },
      { char: 'O', name: 'Octopus', type: 'emoji', value: '🐙', color: 'var(--color-o)', phrase: 'O for Octopus' },
      { char: 'U', name: 'Unicorn', type: 'emoji', value: '🦄', color: 'var(--color-u)', phrase: 'U for Unicorn' }
    ],
    numeros: [
      { char: '1', name: 'One Apple', type: 'emoji', value: '🍎', color: '#FFEBF0' },
      { char: '2', name: 'Two Bananas', type: 'emoji', value: '🍌🍌', color: '#FFFDF0' },
      { char: '3', name: 'Three Fish', type: 'emoji', value: '🐟🐟🐟', color: '#E3F2FD' },
      { char: '4', name: 'Four Stars', type: 'emoji', value: '⭐⭐⭐⭐', color: '#FFFDE7' },
      { char: '5', name: 'Five Flowers', type: 'emoji', value: '🌸🌸🌸🌸🌸', color: '#FCE7F3' },
      { char: '6', name: 'Six Butterflies', type: 'emoji', value: '🦋🦋🦋🦋🦋🦋', color: '#EAFDF5' },
      { char: '7', name: 'Seven Balls', type: 'emoji', value: '⚽⚽⚽⚽⚽⚽⚽', color: '#F3F4F6' },
      { char: '8', name: 'Eight Balloons', type: 'emoji', value: '🎈🎈🎈🎈🎈🎈🎈🎈', color: '#FFF1F2' },
      { char: '9', name: 'Nine Cars', type: 'emoji', value: '🚗🚗🚗🚗🚗🚗🚗🚗🚗', color: '#ECFDF5' },
      { char: '10', name: 'Ten Candies', type: 'emoji', value: '🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬', color: '#FDF2F8' }
    ],
    cores: [
      { char: 'Red', name: 'Heart', type: 'color', value: '#FF3B30', emoji: '❤️', color: '#FFEBEE', phrase: 'The heart is red' },
      { char: 'Green', name: 'Leaf', type: 'color', value: '#2ECC71', emoji: '🍃', color: '#E8F5E9', phrase: 'The leaf is green' },
      { char: 'Blue', name: 'Cloud', type: 'color', value: '#4DABF7', emoji: '☁️', color: '#E3F2FD', phrase: 'The cloud is blue' },
      { char: 'Yellow', name: 'Sun', type: 'color', value: '#FFD32D', emoji: '☀️', color: '#FFFDE7', phrase: 'The sun is yellow' },
      { char: 'Purple', name: 'Grape', type: 'color', value: '#9B59B6', emoji: '🍇', color: '#F3E5F5', phrase: 'The grape is purple' }
    ]
  }
};

// UI translation text keys
const UI_TRANSLATIONS = {
  pt: {
    subtitle: "Aprender Brincando!",
    learn: "Aprender",
    quiz: "Adivinhe",
    memory: "Memória",
    draw: "Desenhar",
    install: "📲 Instalar Aplicativo",
    back: "🏠 Voltar ao Menu",
    quizPromptvogais: "Qual vogal você ouviu?",
    quizPromptnumeros: "Qual número você ouviu?",
    quizPromptcores: "Qual cor você ouviu?",
    winTitle: "⭐ Incrível! ⭐",
    winBody: "Você encontrou todos os pares!",
    playAgain: "Jogar de Novo",
    vowelsBtn: "📖 Vogais",
    numbersBtn: "🔢 Números",
    colorsBtn: "🎨 Cores",
    drawClear: "Limpar",
    de: "de"
  },
  en: {
    subtitle: "Learn and Play!",
    learn: "Learn",
    quiz: "Guess",
    memory: "Memory",
    draw: "Draw",
    install: "📲 Install App",
    back: "🏠 Back to Menu",
    quizPromptvogais: "Which vowel did you hear?",
    quizPromptnumeros: "Which number did you hear?",
    quizPromptcores: "Which color did you hear?",
    winTitle: "⭐ Amazing! ⭐",
    winBody: "You matched all cards!",
    playAgain: "Play Again",
    vowelsBtn: "📖 Vowels",
    numbersBtn: "🔢 Numbers",
    colorsBtn: "🎨 Colors",
    drawClear: "Clear",
    de: "for"
  }
};

// Initialize Application
window.addEventListener("load", () => {
  initConfetti();
  updateStarUI();
  setupLanguage();
  setupCategorySelector();
  setupNavigation();
  setupLearnMode();
  setupQuizMode();
  setupMemoryMode();
  setupDrawingMode();
  setupPWA();
  
  // Render initial translations
  applyTranslations();
  
  // Back to menu buttons
  document.querySelectorAll(".btn-back-nav").forEach(btn => {
    btn.addEventListener("click", () => {
      showScreen("screen-menu");
      stopConfetti();
    });
  });
});

// Update localStorage and UI stars
function updateStarUI() {
  localStorage.setItem("vogaisapp_stars", stars);
  document.getElementById("stars-count").textContent = stars;
}

// Language Toggle Setup
function setupLanguage() {
  const langToggle = document.getElementById("btn-lang-toggle");
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "pt" ? "en" : "pt";
    localStorage.setItem("vogaisapp_lang", currentLang);
    
    applyTranslations();
    refreshActiveScreenGame();
  });
}

function applyTranslations() {
  const t = UI_TRANSLATIONS[currentLang];
  
  // Header flag
  document.getElementById("lang-flag").textContent = currentLang === "pt" ? "🇧🇷" : "🇺🇸";
  document.getElementById("lang-label").textContent = currentLang.toUpperCase();
  
  // Subtitle & Dashboard Cards
  document.getElementById("menu-subtitle").textContent = t.subtitle;
  document.getElementById("title-card-learn").textContent = t.learn;
  document.getElementById("title-card-quiz").textContent = t.quiz;
  document.getElementById("title-card-memory").textContent = t.memory;
  document.getElementById("title-card-draw").textContent = t.draw;
  document.getElementById("label-install-btn").textContent = t.install;
  
  // Shared back buttons
  document.querySelectorAll(".btn-back-text").forEach(btn => {
    btn.textContent = t.back;
  });
  
  // Memory Game UI
  document.getElementById("win-banner-title").textContent = t.winTitle;
  document.getElementById("win-banner-body").textContent = t.winBody;
  document.getElementById("btn-memory-restart").textContent = t.playAgain;
  
  // Drawing clean button
  document.getElementById("btn-draw-clear").textContent = t.drawClear;
  
  // Category tabs text
  document.getElementById("btn-cat-vogais").textContent = t.vowelsBtn;
  document.getElementById("btn-cat-numeros").textContent = t.numbersBtn;
  document.getElementById("btn-cat-cores").textContent = t.colorsBtn;
}

// Category selection row management
function setupCategorySelector() {
  document.querySelectorAll(".btn-category").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-category").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      currentCategory = btn.dataset.category;
      localStorage.setItem("vogaisapp_category", currentCategory);
      
      refreshActiveScreenGame();
    });
  });
  
  // Activate initial category tab
  const initialTab = document.querySelector(`.btn-category[data-category="${currentCategory}"]`);
  if (initialTab) {
    document.querySelectorAll(".btn-category").forEach(b => b.classList.remove("active"));
    initialTab.classList.add("active");
  }
}

// Refresh whatever game mode is currently running on screen
function refreshActiveScreenGame() {
  const activeScreen = document.querySelector(".screen.active");
  if (!activeScreen) return;
  
  const id = activeScreen.id;
  if (id === "screen-learn") {
    currentLearnIndex = 0;
    renderLearnSlide();
  } else if (id === "screen-quiz") {
    startNewQuizQuestion();
  } else if (id === "screen-memory") {
    startNewMemoryGame();
  } else if (id === "screen-draw") {
    const items = CONTENT_DATA[currentLang][currentCategory];
    changeDrawingItem(items[0].char);
    setupLetterDrawingMenu();
  }
}

// Navigation screen control
function setupNavigation() {
  const cards = {
    "card-learn": "screen-learn",
    "card-quiz": "screen-quiz",
    "card-memory": "screen-memory",
    "card-draw": "screen-draw"
  };
  
  const categorySelector = document.getElementById("category-selector");
  
  Object.keys(cards).forEach(cardId => {
    document.getElementById(cardId).addEventListener("click", () => {
      showScreen(cards[cardId]);
      categorySelector.style.display = "flex"; // Show category switcher inside games
      refreshActiveScreenGame();
    });
  });

  document.getElementById("app-title").addEventListener("click", () => {
    showScreen("screen-menu");
    categorySelector.style.display = "none";
    stopConfetti();
  });
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(scr => scr.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
  
  if (screenId === "screen-menu") {
    document.getElementById("category-selector").style.display = "none";
  }
}

// ----------------------------------------------------
// Text to Speech & Audio Engine (With Studio MP3 files)
// ----------------------------------------------------
function playAudioOrSpeech(charVal, lang, category) {
  // Construct filename pointing to Google TTS downloaded high quality MP3
  const filename = `./sounds/${lang}_${category}_${charVal.toString().toLowerCase()}.mp3`;
  const audio = new Audio(filename);
  
  audio.play().catch(err => {
    console.warn("High-quality local audio file play failed, using fallback SpeechSynthesis:", filename, err);
    // Find the item in CONTENT_DATA
    const items = CONTENT_DATA[lang][category];
    const item = items.find(x => x.char.toString().toLowerCase() === charVal.toString().toLowerCase());
    if (item) {
      const speechVal = category === "vogais" ? item.phrase : (category === "numeros" ? item.name : item.phrase);
      speakText(speechVal, lang);
    } else {
      speakText(charVal, lang);
    }
  });
}

function speakText(text, langCode) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel(); // stop current sound
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === "en" ? "en-US" : "pt-BR";
    
    // Playful kids audio pitch and speed adjustments
    utterance.pitch = 1.25;
    utterance.rate = 0.85;
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis API not supported.");
  }
}

// ----------------------------------------------------
// UI sound effects
// ----------------------------------------------------
function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch (e) {
    console.log(e);
  }
}

function playWrongSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.log(e);
  }
}

// ----------------------------------------------------
// Mode 1: Learn Mode (Slideshow)
// ----------------------------------------------------
function setupLearnMode() {
  document.getElementById("btn-learn-prev").addEventListener("click", () => {
    const items = CONTENT_DATA[currentLang][currentCategory];
    currentLearnIndex = (currentLearnIndex - 1 + items.length) % items.length;
    renderLearnSlide();
  });
  
  document.getElementById("btn-learn-next").addEventListener("click", () => {
    const items = CONTENT_DATA[currentLang][currentCategory];
    currentLearnIndex = (currentLearnIndex + 1) % items.length;
    renderLearnSlide();
  });

  const slideImg = document.getElementById("learn-img");
  const slideEmoji = document.getElementById("learn-emoji-display");
  const playButton = document.querySelector(".slide-image-wrapper");

  const clickPlayAction = () => {
    const items = CONTENT_DATA[currentLang][currentCategory];
    const item = items[currentLearnIndex];
    
    // Play sound from high quality pre-recorded files
    playAudioOrSpeech(item.char, currentLang, currentCategory);
    
    // Mini animation
    playButton.style.transform = "scale(0.95)";
    setTimeout(() => {
      playButton.style.transform = "scale(1.02)";
      setTimeout(() => playButton.style.transform = "scale(1)", 150);
    }, 100);
  };

  slideImg.addEventListener("click", clickPlayAction);
  slideEmoji.addEventListener("click", clickPlayAction);

  // Play word description on click
  document.getElementById("learn-word").addEventListener("click", () => {
    const items = CONTENT_DATA[currentLang][currentCategory];
    const item = items[currentLearnIndex];
    playAudioOrSpeech(item.char, currentLang, currentCategory);
  });
}

function renderLearnSlide() {
  const items = CONTENT_DATA[currentLang][currentCategory];
  const item = items[currentLearnIndex];
  
  const slideImg = document.getElementById("learn-img");
  const slideEmoji = document.getElementById("learn-emoji-display");
  const slideContent = document.getElementById("slide-content");

  // Main title display
  document.getElementById("learn-vowel").textContent = item.char;
  
  // Custom layout formatting by category
  let wordHTML = "";
  if (currentCategory === "vogais") {
    const connectorText = UI_TRANSLATIONS[currentLang].de;
    wordHTML = `<span>${item.char}</span> ${connectorText} ${item.name}`;
  } else {
    // Correct format: "1 - Uma Maçã" (Numbers) or "Vermelho - Coração" (Colors)
    wordHTML = `<span>${item.char}</span> - ${item.name}`;
  }
  document.getElementById("learn-word").innerHTML = wordHTML;
  
  // Slide dynamic color
  slideContent.style.backgroundColor = item.color;

  // Type rendering check: Image vs Emoji vs Solid Color Blocks
  if (item.type === "image") {
    slideImg.src = item.value;
    slideImg.style.display = "block";
    slideEmoji.style.display = "none";
  } else if (item.type === "emoji") {
    slideImg.style.display = "none";
    slideEmoji.style.display = "flex";
    slideEmoji.textContent = item.value;
    slideEmoji.style.background = "linear-gradient(135deg, #FFF9E6 0%, #FFF3CD 100%)";
    
    // Dynamic text size depending on count of emojis
    if (item.value.length > 10) {
      slideEmoji.style.fontSize = "50px";
    } else if (item.value.length > 5) {
      slideEmoji.style.fontSize = "70px";
    } else {
      slideEmoji.style.fontSize = "110px";
    }
  } else if (item.type === "color") {
    slideImg.style.display = "none";
    slideEmoji.style.display = "flex";
    slideEmoji.textContent = item.emoji;
    slideEmoji.style.background = item.value; // Paint bucket block coloring
    slideEmoji.style.fontSize = "110px";
  }
  
  // Render Dots
  const dotsContainer = document.getElementById("learn-dots");
  dotsContainer.innerHTML = "";
  items.forEach((v, idx) => {
    const dot = document.createElement("div");
    dot.className = `dot ${idx === currentLearnIndex ? "active" : ""}`;
    dot.addEventListener("click", () => {
      currentLearnIndex = idx;
      renderLearnSlide();
    });
    dotsContainer.appendChild(dot);
  });

  // Autoplay current vowel/number/color
  setTimeout(() => {
    playAudioOrSpeech(item.char, currentLang, currentCategory);
  }, 400);
}

// ----------------------------------------------------
// Mode 2: Quiz Mode
// ----------------------------------------------------
function setupQuizMode() {
  document.getElementById("btn-quiz-audio").addEventListener("click", () => {
    if (quizCorrectItem) {
      playAudioOrSpeech(quizCorrectItem.char, currentLang, currentCategory);
    }
  });
}

function startNewQuizQuestion() {
  const balloonsArea = document.getElementById("balloons-area");
  balloonsArea.innerHTML = "";
  
  const items = CONTENT_DATA[currentLang][currentCategory];
  
  // Update question header text dynamically
  const qPrompt = UI_TRANSLATIONS[currentLang][`quizPrompt${currentCategory}`] || "Qual você ouviu?";
  document.getElementById("quiz-question-prompt").textContent = qPrompt;
  
  // Pick random target
  const randomIndex = Math.floor(Math.random() * items.length);
  quizCorrectItem = items[randomIndex];
  
  // Load choices
  let choices = [quizCorrectItem];
  while (choices.length < 3) {
    const distractor = items[Math.floor(Math.random() * items.length)];
    if (!choices.some(c => c.char === distractor.char)) {
      choices.push(distractor);
    }
  }
  
  // Shuffle choices
  choices.sort(() => Math.random() - 0.5);
  
  // Render balloons
  choices.forEach((item) => {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    
    // Adjust size and styling for double-digit numbers
    if (currentCategory === "cores") {
      balloon.innerHTML = `<span>${item.emoji}</span><div class="balloon-string"></div>`;
      balloon.style.backgroundColor = item.value;
      balloon.style.color = item.value;
    } else {
      balloon.innerHTML = `<span>${item.char}</span><div class="balloon-string"></div>`;
      if (item.char === "10") {
        balloon.style.fontSize = "26px";
      }
    }
    
    balloon.addEventListener("click", () => {
      if (item.char === quizCorrectItem.char) {
        // Correct pop
        balloon.classList.add("pop");
        playCelebrationSound();
        triggerConfetti();
        stars += 1;
        updateStarUI();
        
        document.querySelectorAll(".balloon").forEach(b => b.style.pointerEvents = "none");
        
        setTimeout(() => {
          stopConfetti();
          startNewQuizQuestion();
        }, 1800);
      } else {
        // Miss wobble
        balloon.classList.add("wobble");
        playWrongSound();
        setTimeout(() => balloon.classList.remove("wobble"), 500);
      }
    });
    
    balloonsArea.appendChild(balloon);
  });
  
  // Voice prompt play
  setTimeout(() => {
    playAudioOrSpeech(quizCorrectItem.char, currentLang, currentCategory);
  }, 400);
}

// ----------------------------------------------------
// Mode 3: Memory Game
// ----------------------------------------------------
function setupMemoryMode() {
  document.getElementById("btn-memory-restart").addEventListener("click", () => {
    document.getElementById("memory-win-banner").classList.remove("active");
    startNewMemoryGame();
  });
}

function startNewMemoryGame() {
  const grid = document.getElementById("memory-grid");
  grid.innerHTML = "";
  document.getElementById("memory-win-banner").classList.remove("active");
  stopConfetti();
  
  memoryFlippedCards = [];
  memoryLock = false;
  memoryMatches = 0;
  
  const items = CONTENT_DATA[currentLang][currentCategory];
  
  // Select a subset of 5 random items to keep memory grid at exactly 10 cards (perfect grid and difficulty for kids)
  let selectedItems = [...items];
  if (selectedItems.length > 5) {
    selectedItems.sort(() => Math.random() - 0.5);
    selectedItems = selectedItems.slice(0, 5);
  }
  
  // Create matching pairs (10 cards total)
  const listA = selectedItems.map(x => ({ type: "char", matchKey: x.char, content: x }));
  const listB = selectedItems.map(x => ({ type: "object", matchKey: x.char, content: x }));
  
  memoryCards = [...listA, ...listB];
  memoryCards.sort(() => Math.random() - 0.5);
  
  // Render card widgets
  memoryCards.forEach((cData, idx) => {
    const card = document.createElement("div");
    card.className = "memory-card-flip";
    card.dataset.matchKey = cData.matchKey;
    card.dataset.type = cData.type;
    card.dataset.index = idx;
    
    const inner = document.createElement("div");
    inner.className = "memory-card-inner";
    
    const back = document.createElement("div");
    back.className = "memory-card-back";
    back.textContent = "⭐";
    
    const front = document.createElement("div");
    front.className = "memory-card-front";
    
    // Front card content type definitions
    if (cData.type === "char") {
      front.innerHTML = `<span class="letter-content">${cData.content.char}</span>`;
    } else {
      if (cData.content.type === "image") {
        front.innerHTML = `<img src="${cData.content.value}" alt="${cData.content.name}">`;
      } else if (cData.content.type === "emoji") {
        // Adjust emoji font-size depending on counts
        const valLen = cData.content.value.length;
        const eSizeClass = valLen > 10 ? "font-size: 14px;" : valLen > 5 ? "font-size: 20px;" : "";
        front.innerHTML = `<span class="emoji-content" style="${eSizeClass}">${cData.content.value}</span>`;
      } else if (cData.content.type === "color") {
        // Colored cards matching block
        front.innerHTML = `<div class="color-content" style="background-color: ${cData.content.value};"></div>`;
      }
    }
    
    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);
    
    card.addEventListener("click", () => handleMemoryCardClick(card, cData));
    grid.appendChild(card);
  });
}

function handleMemoryCardClick(card, cData) {
  if (memoryLock) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
  
  card.classList.add("flipped");
  memoryFlippedCards.push(card);
  
  // Voice output
  playAudioOrSpeech(cData.matchKey, currentLang, currentCategory);
  
  if (memoryFlippedCards.length === 2) {
    const [c1, c2] = memoryFlippedCards;
    const isMatch = c1.dataset.matchKey === c2.dataset.matchKey;
    
    if (isMatch) {
      c1.classList.add("matched");
      c2.classList.add("matched");
      memoryMatches += 1;
      memoryFlippedCards = [];
      
      playCelebrationSound();
      
      if (memoryMatches === 5) { // Always exactly 5 pairs matched
        setTimeout(() => {
          stars += 5;
          updateStarUI();
          triggerConfetti();
          document.getElementById("memory-win-banner").classList.add("active");
        }, 800);
      }
    } else {
      memoryLock = true;
      setTimeout(() => {
        c1.classList.remove("flipped");
        c2.classList.remove("flipped");
        memoryFlippedCards = [];
        memoryLock = false;
      }, 1200);
    }
  }
}

// ----------------------------------------------------
// Mode 4: Drawing Mode
// ----------------------------------------------------
function setupDrawingMode() {
  drawCanvas = document.getElementById("drawing-canvas");
  drawCtx = drawCanvas.getContext("2d");
  
  // Wire pen canvas drawing events
  drawCanvas.addEventListener("mousedown", startDrawing);
  drawCanvas.addEventListener("mousemove", drawLine);
  window.addEventListener("mouseup", stopDrawing);
  
  drawCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    isDrawing = true;
    drawCtx.beginPath();
    drawCtx.moveTo(x * (drawCanvas.width / rect.width), y * (drawCanvas.height / rect.height));
  });
  
  drawCanvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = drawCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    drawCtx.lineWidth = 14;
    drawCtx.lineCap = "round";
    drawCtx.lineJoin = "round";
    drawCtx.strokeStyle = drawColor;
    
    drawCtx.lineTo(x * (drawCanvas.width / rect.width), y * (drawCanvas.height / rect.height));
    drawCtx.stroke();
  });
  
  drawCanvas.addEventListener("touchend", stopDrawing);

  // Pen select buttons
  document.querySelectorAll(".color-pen").forEach(pen => {
    pen.addEventListener("click", () => {
      document.querySelectorAll(".color-pen").forEach(p => p.classList.remove("active"));
      pen.classList.add("active");
      drawColor = pen.dataset.color;
    });
  });

  // Action button triggers
  document.getElementById("btn-draw-clear").addEventListener("click", () => {
    clearCanvasAndDrawGuide();
  });

  document.getElementById("btn-draw-sound").addEventListener("click", () => {
    playAudioOrSpeech(selectedDrawItem, currentLang, currentCategory);
  });
  
  window.addEventListener("resize", () => {
    if (document.getElementById("screen-draw").classList.contains("active")) {
      resizeDrawCanvas();
    }
  });
}

function getActiveDrawItemName() {
  const items = CONTENT_DATA[currentLang][currentCategory];
  const activeItem = items.find(x => x.char === selectedDrawItem) || items[0];
  return activeItem.name;
}

function getActiveDrawItemPhrase() {
  const items = CONTENT_DATA[currentLang][currentCategory];
  const activeItem = items.find(x => x.char === selectedDrawItem) || items[0];
  return activeItem.phrase;
}

function setupLetterDrawingMenu() {
  const items = CONTENT_DATA[currentLang][currentCategory];
  const letterSelector = document.getElementById("draw-letter-selector");
  letterSelector.innerHTML = "";
  
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = `btn-letter-select ${item.char === selectedDrawItem ? "active" : ""}`;
    btn.textContent = currentCategory === "cores" ? item.emoji : item.char;
    
    // Style adjustments for digit 10 selector to fit
    if (item.char === "10") {
      btn.style.width = "48px";
      btn.style.borderRadius = "20px";
    }
    
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-letter-select").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      changeDrawingItem(item.char);
    });
    
    letterSelector.appendChild(btn);
  });
}

function resizeDrawCanvas() {
  const container = document.querySelector(".canvas-container");
  const size = Math.min(container.clientWidth, 450);
  drawCanvas.width = size * 2;
  drawCanvas.height = size * 2;
  clearCanvasAndDrawGuide();
}

function changeDrawingItem(charVal) {
  selectedDrawItem = charVal;
  clearCanvasAndDrawGuide();
  
  playAudioOrSpeech(charVal, currentLang, currentCategory);
}

function clearCanvasAndDrawGuide() {
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  
  // White base
  drawCtx.fillStyle = "#FFFFFF";
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  
  const items = CONTENT_DATA[currentLang][currentCategory];
  const activeItem = items.find(x => x.char === selectedDrawItem) || items[0];

  // Draw Tracing Templates (Vowels and Numbers) or Free Painting guidelines
  drawCtx.textAlign = "center";
  drawCtx.textBaseline = "middle";
  
  let fontSize;
  if (currentCategory === "cores") {
    // Emojis for colors (e.g. Heart ❤️ for red, Grape 🍇 for purple)
    fontSize = Math.floor(drawCanvas.height * 0.45);
    drawCtx.font = `${fontSize}px ` + getComputedStyle(document.body).fontFamily;
    
    drawCtx.fillStyle = "rgba(0,0,0,0.015)";
    drawCtx.fillText(activeItem.emoji, drawCanvas.width / 2, drawCanvas.height / 2);
    
    drawCtx.strokeStyle = "rgba(0,0,0,0.06)";
    drawCtx.lineWidth = 4;
    drawCtx.setLineDash([12, 16]);
    drawCtx.strokeText(activeItem.emoji, drawCanvas.width / 2, drawCanvas.height / 2);
  } else {
    // Regular characters for letters / numbers (scaled dynamically)
    if (activeItem.char.length > 1) {
      // e.g. "10"
      fontSize = Math.floor(drawCanvas.height * 0.45);
    } else {
      // e.g. "A", "1"
      fontSize = Math.floor(drawCanvas.height * 0.65);
    }
    drawCtx.font = `800 ${fontSize}px ` + getComputedStyle(document.body).fontFamily;
    
    drawCtx.fillStyle = "rgba(0,0,0,0.025)";
    drawCtx.fillText(activeItem.char, drawCanvas.width / 2, drawCanvas.height / 2);
    
    drawCtx.strokeStyle = "rgba(0,0,0,0.08)";
    drawCtx.lineWidth = 6;
    drawCtx.setLineDash([12, 16]);
    drawCtx.strokeText(activeItem.char, drawCanvas.width / 2, drawCanvas.height / 2);
  }
  
  drawCtx.setLineDash([]);
}

function startDrawing(e) {
  isDrawing = true;
  const rect = drawCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  drawCtx.beginPath();
  drawCtx.moveTo(x * (drawCanvas.width / rect.width), y * (drawCanvas.height / rect.height));
}

function drawLine(e) {
  if (!isDrawing) return;
  const rect = drawCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  drawCtx.lineWidth = 14;
  drawCtx.lineCap = "round";
  drawCtx.lineJoin = "round";
  drawCtx.strokeStyle = drawColor;
  
  drawCtx.lineTo(x * (drawCanvas.width / rect.width), y * (drawCanvas.height / rect.height));
  drawCtx.stroke();
}

function stopDrawing() {
  if (isDrawing) {
    drawCtx.closePath();
    isDrawing = false;
  }
}

// ----------------------------------------------------
// Confetti Animation Canvas
// ----------------------------------------------------
function initConfetti() {
  confettiCanvas = document.getElementById("confetti-canvas");
  confettiCtx = confettiCanvas.getContext("2d");
  
  window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

// Particle bursts
function triggerConfetti() {
  confettiActive = true;
  confettiParticles = [];
  const colors = ["#FF8C94", "#FFAAB0", "#FFD32D", "#2ECC71", "#4DABF7", "#A8E6CF", "#D1C4E9"];
  
  for (let i = 0; i < 80; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: -10 - Math.random() * 20,
      r: 6 + Math.random() * 8,
      d: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }
  
  requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  if (!confettiActive) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  
  let remaining = false;
  confettiParticles.forEach(p => {
    p.tiltAngle += p.tiltAngleIncremental;
    p.y += p.d;
    p.x += Math.sin(p.tiltAngle);
    p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 5;
    
    if (p.y < confettiCanvas.height) {
      remaining = true;
    }
    
    confettiCtx.beginPath();
    confettiCtx.lineWidth = p.r;
    confettiCtx.strokeStyle = p.color;
    confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
    confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
    confettiCtx.stroke();
  });
  
  if (remaining) {
    requestAnimationFrame(drawConfetti);
  }
}

// Clear confetti
function stopConfetti() {
  confettiActive = false;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// ----------------------------------------------------
// Service Worker Registration & PWA setup
// ----------------------------------------------------
function setupPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
      .then((reg) => console.log("[PWA] Service Worker registrado: ", reg.scope))
      .catch((err) => console.error("[PWA] Erro ao registrar: ", err));
  }

  const installBtn = document.getElementById("btn-install-app");
  
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPromptEvent = e;
    installBtn.style.display = "flex";
  });
  
  installBtn.addEventListener("click", () => {
    if (!installPromptEvent) return;
    
    installPromptEvent.prompt();
    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        installBtn.style.display = "none";
      }
      installPromptEvent = null;
    });
  });

  window.addEventListener("appinstalled", () => {
    installBtn.style.display = "none";
  });
}
