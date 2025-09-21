let voicesReady = false;

function loadVoices(callback) {
  let voices = speechSynthesis.getVoices();
  if (voices.length !== 0) {
    voicesReady = true;
    callback(voices);
  } else {
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      voicesReady = true;
      callback(voices);
    };
  }
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
    return;
  }

  loadVoices((voices) => {
    const voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.voice = voice;
    speechSynthesis.speak(utter);
  });
}

function filterWords() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const cards = document.querySelectorAll('.word-card');
  let firstVisible = null;
  cards.forEach(card => {
    const en = card.querySelector('h2').textContent.toLowerCase();
    const ko = card.querySelector('p').textContent;
    if (!query || en.includes(query) || ko.includes(query)) {
      card.style.display = '';
      if (!firstVisible) firstVisible = card;
    } else {
      card.style.display = 'none';
    }
  });
  if (firstVisible) {
    const grid = document.querySelector('.word-grid');
    const cardTop = firstVisible.offsetTop;
    grid.scrollTo({ top: cardTop, behavior: 'smooth' });
  }
}

document.getElementById('searchInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    filterWords();
  }
}); 