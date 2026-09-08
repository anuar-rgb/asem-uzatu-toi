// Гугл-форма для сбора RSVP-ответов (id полей найдены в исходнике формы).
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeh3VDdYGMi0-e1C_Gu61NHqefy1v21CuAv6owygT3kxXKstw/formResponse";
const GOOGLE_FORM_ENTRIES = {
  name: "entry.692230155",
  status: "entry.797045748",
  guests: "entry.1172029627"
};

/* ===== COUNTDOWN ===== */
const TARGET_DATE = new Date("2026-10-16T18:00:00+05:00").getTime();

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMinutes = document.getElementById('cd-minutes');
const cdSeconds = document.getElementById('cd-seconds');

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const now = Date.now();
  let diff = TARGET_DATE - now;

  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  cdDays.textContent = pad(days);
  cdHours.textContent = pad(hours);
  cdMinutes.textContent = pad(minutes);
  cdSeconds.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== MUSIC ===== */
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const START = 95;  // 1:35
const END = 170;   // 2:50

function seekToStartAndPlay() {
  audio.currentTime = START;
  audio.play();
}

function toggleMusic() {
  if (audio.paused) {
    // preload="none" -> metadata may not be loaded yet, so currentTime
    // assignment is silently ignored until 'loadedmetadata' fires.
    if (audio.readyState < 1) {
      audio.addEventListener('loadedmetadata', seekToStartAndPlay, { once: true });
      audio.load();
    } else if (audio.currentTime < START || audio.currentTime >= END) {
      seekToStartAndPlay();
    } else {
      audio.play();
    }
    musicBtn.classList.add('playing');
    musicBtn.setAttribute('aria-pressed', 'true');
  } else {
    audio.pause();
    musicBtn.classList.remove('playing');
    musicBtn.setAttribute('aria-pressed', 'false');
  }
}

musicBtn.addEventListener('click', toggleMusic);

audio.addEventListener('timeupdate', () => {
  if (audio.currentTime >= END) {
    audio.pause();
    audio.currentTime = START;
    musicBtn.classList.remove('playing');
    musicBtn.setAttribute('aria-pressed', 'false');
  }
});

/* ===== RSVP FORM ===== */
const rsvpForm = document.getElementById('rsvp-form');
const rsvpThanks = document.getElementById('rsvp-thanks');
const rsvpSubmit = document.getElementById('rsvp-submit');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('rsvp-name').value.trim();
  const statusInput = rsvpForm.querySelector('input[name="status"]:checked');
  const guests = document.getElementById('rsvp-guests').value.trim();

  if (!name || !statusInput) {
    return;
  }

  const body = new URLSearchParams();
  body.set(GOOGLE_FORM_ENTRIES.name, name);
  body.set(GOOGLE_FORM_ENTRIES.status, statusInput.value);
  body.set(GOOGLE_FORM_ENTRIES.guests, guests);

  rsvpSubmit.disabled = true;
  rsvpSubmit.textContent = 'ЖІБЕРІЛУДЕ...';

  try {
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: body
    });
  } catch (err) {
    // no-cors режим не даёт прочитать ответ/ошибку сервера — считаем отправленным
  }

  rsvpForm.hidden = true;
  rsvpThanks.hidden = false;
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));
