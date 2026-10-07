const themeMap = {
  main:         { color: '#1a0508', track: 'songs/aria.mp3', song: 'Aria of The Soul', artist: 'Shoji Meguro' },
  stats:        { color: '#2a0a0d', track: 'songs/specialist.mp3', song: 'specialist', artist: 'ATLUS Sound Team' },
  work:         { color: '#34090f', track: 'songs/beneath-the-mask-rain.mp3', song: 'Beneath the Mask -rain-', artist: 'Lyn' },
  edu:          { color: '#400f14', track: 'songs/iwatodai_dorm.mp3', song: 'Iwatodai Dorm', artist: 'Shoji Meguro' },
  equip:        { color: '#24080a', track: 'songs/last_surprise.mp3', song: 'Last Surprise', artist: 'Lyn' },
  quests:       { color: '#3a0d12', track: 'songs/triumph.mp3', song: 'Triumph', artist: 'ATLUS Sound Team' },
  system:       { color: '#2e0b0e', track: 'songs/signs-of-love.mp3', song: 'Signs Of Love', artist: 'Shihoko Hirata' },
  subscription: { color: '#3d0d10', track: 'songs/Heartbeat_Heartbreak.mp3', song: 'Heartbeat, Heartbreak', artist: 'Shihoko Hirata' },
  quit:         { color: '#150304', track: 'songs/time-of-joy.mp3', song: 'Time of Joy', artist: 'SEGA' },
};

const bgm = document.getElementById('bgm');
bgm.volume = 0.7; 
const audioToggleBtn = document.getElementById('audio-toggle');
const trackInfoDiv = document.getElementById('track-info');
let audioOn = true; 
let suppressAudioStateEvents = false; 

bgm.addEventListener('play', () => {
  if (suppressAudioStateEvents) return;
  audioOn = true;
  audioToggleBtn.textContent = '🔊';
});

bgm.addEventListener('pause', () => {
  if (suppressAudioStateEvents) return;
  audioOn = false;
  audioToggleBtn.textContent = '🔇';
});

function applyTheme(id) {
  const theme = themeMap[id];
  if (!theme) return;

  document.body.style.backgroundColor = theme.color;
  
  if (trackInfoDiv) {
    trackInfoDiv.textContent = `♪ ${theme.song} - ${theme.artist}`;
  }

  if (bgm.getAttribute('data-current') !== theme.track) {
    suppressAudioStateEvents = true;
    bgm.setAttribute('data-current', theme.track);
    bgm.src = theme.track;

    if (audioOn) {
      bgm.play()
        .then(() => { suppressAudioStateEvents = false; })
        .catch(() => {
          suppressAudioStateEvents = false;
          console.log("Tarayıcı autoplay engeli: İlk tıklamayı bekliyor.");
        });
    } else {
      suppressAudioStateEvents = false;
    }
  }
}

document.body.addEventListener('click', () => {
  if (audioOn && bgm.paused) {
     bgm.play().catch(() => {});
  }
}, {once: true});

function toggleAudio() {
  if (bgm.paused) {
    bgm.play().catch(() => {});
  } else {
    bgm.pause();
  }
}

// IGOR İNTERAKTİF SOHBET SİSTEMİ (görsel tabanlı)
let hasLeftMainScreen = false; 

function showChoices() {
  playSelectSound();
  const choicesContainer = document.getElementById('p5-choices');
  if (choicesContainer) {
    choicesContainer.style.display = 'flex';
  }
}

function selectChoice(choice, event) {
  event.stopPropagation(); 
  playSelectSound();

  document.getElementById('p5-choices').style.display = 'none';
  const scene = document.getElementById('igor-scene');

  if (choice === 'gtk') {
    scene.src = 'speech/igor-as-you-wish.png';
    scene.onclick = () => { showScreen('gtk'); };
  } else if (choice === 'quit') {
    scene.src = 'speech/igor-not-recommend.png';
    scene.onclick = () => { showScreen('quit'); };
  } else if (choice === 'subscription') {
    scene.src = 'speech/igor-interesting-choice.png';
    scene.onclick = () => { showScreen('subscription'); };
  }
}

function resetDialogue() {
  const scene = document.getElementById('igor-scene');
  if (!scene) return;

  scene.src = hasLeftMainScreen ? 'speech/igor-welcome-back.png' : 'speech/igor-welcome.png';
  scene.onclick = showChoices;

  const choicesContainer = document.getElementById('p5-choices');
  if (choicesContainer) choicesContainer.style.display = 'none';
}

// ÖMER'İN SUBSCRIPTION DİYALOĞU
let omerDialogueStep = 0;

function advanceOmerDialogue() {
  if (omerDialogueStep !== 0) return;
  playSelectSound();
  document.getElementById('omer-scene').src = 'speech/omer-subscribe-pitch.png';
  document.getElementById('subscribe-actions').classList.add('visible');
  omerDialogueStep = 1;
}

function resetOmerDialogue() {
  omerDialogueStep = 0;
  const scene = document.getElementById('omer-scene');
  const actions = document.getElementById('subscribe-actions');
  if (scene) scene.src = 'speech/omer-hello.png';
  if (actions) actions.classList.remove('visible');
}

// ekran geçişleri
function showScreen(screenId) {
  playSelectSound();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) target.classList.add('active');

  if (screenId === 'main') {
    resetDialogue(); 
  } else {
    hasLeftMainScreen = true;
  }

  if (screenId === 'subscription') {
    resetOmerDialogue();
  }

  if (screenId === 'gtk') {
    const activeInner = document.querySelector('#screen-gtk .section-content.active');
    applyTheme(activeInner ? activeInner.id : 'stats');
  } else {
    applyTheme(screenId);
  }
}

function showSection(sectionId) {
  playSelectSound();
  document.querySelectorAll('.section-content').forEach(el => {
    el.classList.remove('active');
  });
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add('active');
  }
  applyTheme(sectionId);
}

function flipCard() {
  playSelectSound();
  const card = document.querySelector('.quest-card-inner');
  if (card) {
    card.classList.toggle('is-flipped');
  }
}

function openModal(imgSrc) {
  document.getElementById('modal-img').src = imgSrc;
  document.getElementById('cert-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('cert-modal').classList.remove('active');
}

function attemptQuit() {
  const messages = [
    "You shall not pass!",
    "You really thought it'd be that easy?",
    "Quitting requires a boss key. You don't have one. Or do you??",
    "Error 404: exit not found."
  ];
  document.getElementById('quit-message').textContent = messages[Math.floor(Math.random() * messages.length)];
  try { window.close(); } catch (e) {}
}

function playHoverSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch(e) {}
}

function playSelectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch(e) {}
}

document.querySelectorAll('.menu-item, .p5-choice-btn').forEach(item => {
  item.addEventListener('mouseenter', playHoverSound);
});

// ZA WARUDO efekti
function playTimeStopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const duration = 3; 

    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(70, now);
    bassGain.gain.setValueAtTime(0.35, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    bass.start(now);
    bass.stop(now + duration);

    const tickInterval = 1; 
    const tickCount = Math.floor(duration / tickInterval);
    for (let i = 0; i < tickCount; i++) {
      const t = now + i * tickInterval;
      const isTick = i % 2 === 0; 
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tickOsc.type = 'square';
      tickOsc.frequency.setValueAtTime(isTick ? 1400 : 1000, t);
      tickGain.gain.setValueAtTime(0.12, t);
      tickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      tickOsc.connect(tickGain);
      tickGain.connect(ctx.destination);
      tickOsc.start(t);
      tickOsc.stop(t + 0.05);
    }
  } catch (e) {}
}

let timeStopAudioInstance = null;
let timeStopAudioStopTimer = null;

function playTimeStopAudioFile() {
  try {
    const timeStopAudio = new Audio('songs/timestop2.mp3');
    timeStopAudio.volume = 1;
    timeStopAudioInstance = timeStopAudio;
    timeStopAudio.play().catch(() => {});

    if (timeStopAudioStopTimer) clearTimeout(timeStopAudioStopTimer);
    timeStopAudioStopTimer = setTimeout(() => {
      timeStopAudio.pause();
      timeStopAudio.currentTime = 0;
      timeStopAudioStopTimer = null;
    }, 17000);
  } catch (e) {}
}

let timeStopVisualTimeout = null;
let timeStopVisualDelayTimer = null;
let timeStopMusicPrevVolume = null;

function triggerTimeStopEffect() {
  const jojoText = document.getElementById('jojo-text');

  if (timeStopAudioStopTimer) clearTimeout(timeStopAudioStopTimer);
  if (timeStopAudioInstance) {
    timeStopAudioInstance.pause();
    timeStopAudioInstance.currentTime = 0;
  }

  playTimeStopAudioFile();

  if (timeStopVisualDelayTimer) clearTimeout(timeStopVisualDelayTimer);
  if (timeStopVisualTimeout) clearTimeout(timeStopVisualTimeout);
  document.body.classList.remove('time-stop-invert');
  if (jojoText) jojoText.classList.remove('visible');

  if (timeStopMusicPrevVolume === null) {
    timeStopMusicPrevVolume = bgm.volume;
  }
  bgm.volume = 0;

  timeStopVisualDelayTimer = setTimeout(() => {
    document.body.classList.add('time-stop-invert');
    if (jojoText) jojoText.classList.add('visible');

    timeStopVisualTimeout = setTimeout(() => {
      document.body.classList.remove('time-stop-invert');
      if (jojoText) jojoText.classList.remove('visible');

      if (timeStopMusicPrevVolume !== null) {
        bgm.volume = timeStopMusicPrevVolume;
        timeStopMusicPrevVolume = null;
      }
      sudoMode = false;
      timeStopVisualTimeout = null;
    }, 15650);

    timeStopVisualDelayTimer = null;
  }, 1000);
}

// "sudo quit" ve ":q"
let keyBuffer = "";
let sudoMode = false;

document.addEventListener('keydown', (e) => {
  if(!e.key) return; 
  keyBuffer += e.key.toLowerCase();
  if (keyBuffer.length > 20) keyBuffer = keyBuffer.slice(-20);

  if (keyBuffer.endsWith("theworld") || keyBuffer.endsWith("zawarudo") || keyBuffer.endsWith("the world") || keyBuffer.endsWith("za warudo")) {
    sudoMode = true;
    triggerTimeStopEffect();
  }
  
if (keyBuffer.endsWith("sudo quit") || keyBuffer.endsWith(":q")) {
  document.body.innerHTML = "<h1 style='color: white; text-align: center; margin-top: 20vh;'>[Process Completed]</h1>";
  document.body.style.backgroundColor = "black";
  document.head.innerHTML = "<title>Closed</title>"; 
}
});

// Daraltılmış Kaçış Alanı 
let trollBtnX = 0;
let trollBtnY = 0;
let dodgeCount = 0;

function updateQuitMessage(count) {
  const msgEl = document.getElementById('quit-message');
  if (!msgEl) return;

  if (count === 2112) {
    msgEl.textContent = "Did you know Rush has an album called 2112 which is exactly the same amount you have been dealing with this button? Stop it.";
  } else if (count === 1903) {
    msgEl.textContent = "En Büyük Beşiktaş";
  } else if (count === 987) {
    msgEl.textContent = "Did you know TOOL have used Fibonacci Sequence in their song Lateralus?";
  } else if (count > 55) {
    msgEl.textContent = "Eine halbe Tasse Staubzucker, Einen Viertel Teelöffel Salz, Eine Messerspitze türkisches Haschisch, Ein halbes Pfund Butter, Ein'n Teelöffel Vanillenzucker, Ein halbes Pfund Mehl, Einhundertfünfzig Gramm gemahlene Nüsse, Ein wenig extra Staubzucker, Und keine Eier";
  } else if (count > 46) {
    msgEl.textContent = "...Bite my tongue, I wait my turn. I waited for a century. Waste my breath, no lessons learned...";
  } else if (count > 30) {
    msgEl.textContent = "Just write 'sudo quit' to quit if you don't have a stand to stop the button.";
  } else if (count > 20) {
    msgEl.textContent = "Stop messing around.";
  } else if (count > 10) {
    msgEl.textContent = "Quitting may require a certain command. You don't have one. Or do you??";
  } else if (count > 5) {
    const pool = ["You shall not pass!"];
    msgEl.textContent = pool[Math.floor(Math.random() * pool.length)];
  }
}

const trollBtn = document.querySelector('.btn-troll-yes');
if (trollBtn) {
  trollBtn.addEventListener('mouseenter', function() {
    if (sudoMode) return; 

    dodgeCount++;
    updateQuitMessage(dodgeCount);

    const randomX = Math.floor(Math.random() * 400) - 200; 
    const randomY = Math.floor(Math.random() * 300) - 150;
    
    this.style.transition = 'none'; 
    this.style.position = 'relative';
    this.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    playHoverSound();
  });
}

applyTheme('main');
