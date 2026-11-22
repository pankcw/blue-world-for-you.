/* A Little Blue World Just For You 💙 — vanilla JS */
(() => {
'use strict';
const PASSWORD = '25 juli'; // ← ganti di sini kalau perlu (huruf kecil)
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const pages = $$('.page'), fx = $('#fx');
let cur = 0, raf = 0, timers = [], opened = false;

/* ---------- AUDIO (file asli jika ada, kalau tidak: nada sintetis Web Audio) ---------- */
const AC = window.AudioContext || window.webkitAudioContext; let ctx;
const files = {}, ok = {};
['click', 'success', 'error', 'complete'].forEach(n => {
  const a = new Audio('assets/sounds/' + n + '.mp3'); a.preload = 'auto';
  a.addEventListener('canplaythrough', () => ok[n] = 1);
  a.addEventListener('error', () => ok[n] = 0); files[n] = a;
});
const TONES = { click: [[660, .07]], pop: [[880, .06]], error: [[260, .14], [200, .2]],
  success: [[523, .1], [659, .1], [784, .2]], open: [[440, .09], [587, .1], [880, .22]],
  complete: [[523, .1], [659, .1], [784, .1], [1047, .35]] };
function sfx(n) {
  try {
    if (ok[n]) { const a = files[n].cloneNode(); a.volume = .7; a.play().catch(() => {}); return; }
    if (!AC) return; ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
    let t = ctx.currentTime;
    (TONES[n] || TONES.click).forEach(([f, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.16, t + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + d + .03); t += d * .9;
    });
  } catch (e) {}
}
const bgm = new Audio('assets/music/background.mp3'); bgm.loop = true; bgm.volume = .5;
let want = true;
const playM = () => { if (want) bgm.play().catch(() => {}); };
bgm.addEventListener('error', () => { $('#mus').style.opacity = .4; $('#mus').title = 'Musik belum ditambahkan'; });
$('#mus').onclick = () => { want = !want; if (want) playM(); else bgm.pause(); $('#mus').textContent = want ? '🎵' : '🔇'; };
$('#vol').oninput = e => bgm.volume = +e.target.value;
$('#music2').onclick = () => { want = true; $('#mus').textContent = '🎵'; bgm.currentTime = 0; playM(); };
let first = true;
document.addEventListener('pointerdown', e => {
  if (first) { first = false; playM(); }
  spark(e.clientX, e.clientY, 5);
  if (e.target.closest('.btn:not(.nos)')) sfx('click');
}, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) bgm.pause(); else playM(); });

/* ---------- EFEK VISUAL ---------- */
function spark(x, y, n = 6) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i'), a = rnd(6.28), d = rnd(28, 70);
    s.className = 'sp'; s.textContent = pick(['✦', '✧', '💙', '✨']);
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;font-size:${rnd(12, 22)}px`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 850);
  }
}
const sky = $('#sky');
for (let i = 0; i < 28; i++) { const s = document.createElement('i'); s.className = 'star'; s.style.cssText = `left:${rnd(100)}%;top:${rnd(100)}%;animation-delay:${rnd(3)}s;transform:scale(${rnd(.6, 1.2)})`; sky.appendChild(s); }
for (let i = 0; i < 5; i++) { const c = document.createElement('i'); c.className = 'cloud'; c.style.cssText = `top:${8 + i * 17}%;animation-duration:${50 + rnd(40)}s;animation-delay:-${rnd(60)}s;scale:${rnd(.7, 1.5)}`; sky.appendChild(c); }
['⭐', '🎀', '🌸', '☁️', '✨', '🦋'].forEach((e, i) => { const s = document.createElement('i'); s.className = 'stk'; s.textContent = e; s.style.cssText = `font-style:normal;font-size:${20 + rnd(14)}px;left:${(i * 19 + 4) % 92}%;top:${(i * 37 + 10) % 85}%;animation-delay:-${rnd(4)}s`; sky.appendChild(s); });
setInterval(() => {
  if (document.hidden) return;
  const h = document.createElement('i'); h.className = 'fl'; h.textContent = pick(['💙', '🤍', '✨', '💎']);
  h.style.cssText = `left:${rnd(100)}%;font-style:normal;font-size:${rnd(14, 30)}px;--d:${rnd(8, 14)}s`;
  fx.appendChild(h); setTimeout(() => h.remove(), 14000);
}, 1500);

const cf = $('#cf'), cc = cf.getContext('2d'); let cp = [], cr = 0;
function sizeCf() { cf.width = innerWidth; cf.height = innerHeight; }
sizeCf(); addEventListener('resize', () => { if (!cr) sizeCf(); });
function confetti(n = 100) {
  const cols = ['#7ec0ff', '#ffffff', '#bfe3ff', '#3f7fd6', '#dfe8f2'];
  for (let i = 0; i < n; i++) cp.push({ x: rnd(cf.width), y: -rnd(20, cf.height * .5), vx: rnd(-1.5, 1.5), vy: rnd(2, 5), w: rnd(6, 12), h: rnd(4, 8), r: rnd(6), vr: rnd(-.25, .25), c: cols[i % 5] });
  if (!cr) cr = requestAnimationFrame(cfLoop);
}
function cfLoop() {
  cc.clearRect(0, 0, cf.width, cf.height);
  cp = cp.filter(p => p.y < cf.height + 30);
  cp.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; cc.save(); cc.translate(p.x, p.y); cc.rotate(p.r); cc.fillStyle = p.c; cc.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cc.restore(); });
  cr = cp.length ? requestAnimationFrame(cfLoop) : 0;
}

/* ---------- NAVIGASI ---------- */
function clearT() { timers.forEach(t => { clearInterval(t); clearTimeout(t); }); timers = []; }
function go(n) {
  clearT(); if (n !== 0) cancelAnimationFrame(raf);
  cur = n;
  pages.forEach((p, i) => { p.classList.toggle('on', i === n); p.classList.toggle('past', i < n); });
  $('#nav').hidden = n < 3; $('#bk').hidden = n < 3; $('#nx').hidden = n < 3 || n > 7;
  $('#mc').hidden = n === 0;
  pages[n].scrollTop = 0;
  if (n === 3) setTimeout(() => confetti(70), 400);
  if (n === 4) { const w = $('#wish'); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go'); }
  if (n === 6) gMenu();
  if (n === 8) { setTimeout(() => confetti(160), 400); sfx('complete'); }
}
$('#nx').onclick = () => cur < 8 && go(cur + 1);
$('#bk').onclick = () => cur > 3 && go(cur - 1);
$$('#wish p').forEach((p, i) => p.style.setProperty('--i', i));

/* ---------- LOADING: partikel membentuk hati ---------- */
const cv = $('#hc'), c = cv.getContext('2d');
function startLoad() {
  $('#lt').classList.remove('show'); resetAll(); go(0);
  const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const N = W < 500 ? 100 : 150, sc = Math.min(W, H * .8) / 36, cx = W / 2, cy = H * .44, cols = ['#9fd3ff', '#ffffff', '#c9d3de', '#7ec0ff', '#ffffff'];
  const P = Array.from({ length: N }, (_, i) => {
    const t = rnd(6.2832), k = i < N * .45 ? 1 : Math.sqrt(rnd(.05, 1));
    const hx = 16 * Math.sin(t) ** 3, hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x0: rnd(W), y0: rnd(H), tx: cx + hx * sc * k, ty: cy + hy * sc * k, r: rnd(1.5, 3.6), col: cols[i % 5], ph: rnd(6.28), v: rnd(.4, 1) };
  });
  const t0 = performance.now(); let shown = false;
  const ease = x => x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
  (function frame(now) {
    const e = (now - t0) / 1000, p = ease(Math.min(Math.max((e - .8) / 2.4, 0), 1)), beat = e > 3.2 ? 1 + .03 * Math.sin(e * 6) : 1;
    c.clearRect(0, 0, W, H);
    P.forEach(q => {
      const dx = Math.sin(e * q.v + q.ph) * 14 * (1 - p), dy = Math.cos(e * q.v + q.ph) * 14 * (1 - p);
      let x = q.x0 + (q.tx - q.x0) * p + dx, y = q.y0 + (q.ty - q.y0) * p + dy;
      x = cx + (x - cx) * beat; y = cy + (y - cy) * beat;
      const tw = .6 + .4 * Math.sin(e * 3 + q.ph);
      c.globalAlpha = .18 * tw; c.fillStyle = q.col; c.beginPath(); c.arc(x, y, q.r * 3.2, 0, 6.2832); c.fill();
      c.globalAlpha = .6 + .4 * tw; c.beginPath(); c.arc(x, y, q.r, 0, 6.2832); c.fill();
    });
    c.globalAlpha = 1;
    if (e > 3.3 && !shown) { shown = true; $('#lt').classList.add('show'); sfx('pop'); }
    if (e > 5.2) { go(1); return; }
    raf = requestAnimationFrame(frame);
  })(t0);
}

/* ---------- PASSWORD ---------- */
const pw = $('#pw'), pm = $('#pm'), pc = $('#pc'); let lockedIn = false;
function check() {
  if (lockedIn) return;
  const v = pw.value.trim().toLowerCase();
  if (v === PASSWORD) {
    lockedIn = true; sfx('success'); pm.className = 'pm ok'; pm.textContent = 'Yeay! Kamu berhasil masuk! 💙';
    const r = pc.getBoundingClientRect(); [0, 200, 400].forEach(d => setTimeout(() => spark(r.left + r.width / 2, r.top + r.height / 2, 14), d));
    setTimeout(() => go(2), 1500);
  } else {
    sfx('error'); pm.className = 'pm no'; pm.textContent = 'Hehe, masih belum tepat. Coba ingat-ingat lagi yaa!';
    pc.classList.remove('shake'); void pc.offsetWidth; pc.classList.add('shake');
  }
}
$('#pb').onclick = check; pw.onkeydown = e => { if (e.key === 'Enter') check(); };
$('#start').onclick = e => { const r = e.target.getBoundingClientRect(); spark(r.left + r.width / 2, r.top, 12); setTimeout(() => go(3), 450); };

/* ---------- GALERI ---------- */
const caps = ['Penari paling berkilau ✨', 'Senyum yang bikin hari cerah 💙', 'Percaya diri level maksimal 🚀', 'Gerakan kecil, usaha besar 🌸', 'Keren banget, serius! 🌟', 'Satu panggung, satu bintang 💫'];
const stk = ['🎀', '💙', '⭐', '🌸', '☁️', '✨'], rot = [-4, 3, -2, 4, -3, 2];
const ph = i => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe9ff"/><stop offset="1" stop-color="#8fc7ff"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><path d="M200 300C110 235 80 190 80 150C80 112 108 90 140 90C165 90 188 105 200 128C212 105 235 90 260 90C292 90 320 112 320 150C320 190 290 235 200 300Z" fill="#fff" opacity=".85"/><text x="200" y="365" font-family="sans-serif" font-size="26" fill="#1d3a6e" text-anchor="middle">Foto ${i} • ganti foto${i}.jpg</text></svg>`);
const gal = $('#gal'), lb = $('#lb');
caps.forEach((cap, i) => {
  const f = document.createElement('figure'); f.className = 'pol'; f.style.setProperty('--r', rot[i] + 'deg');
  f.innerHTML = `<img src="assets/images/foto${i + 1}.jpg" alt="Foto ${i + 1}" loading="lazy"><span class="st">${stk[i]}</span><figcaption class="hand">${cap}</figcaption>`;
  const im = f.querySelector('img'); im.onerror = () => { im.onerror = null; im.src = ph(i + 1); };
  f.onclick = () => { lb.querySelector('img').src = im.src; lb.querySelector('p').textContent = cap; lb.classList.add('on'); };
  gal.appendChild(f);
});
lb.onclick = () => lb.classList.remove('on');

/* ---------- MINI GAMES ---------- */
const g = $('#g');
function gMenu() {
  clearT();
  g.innerHTML = `<h2>Mini Games 🎮</h2><p class="small">Pilih satu, atau mainkan semuanya!</p><div class="menu"><button class="btn" data-g="1">1 • Seberapa Kenal Kamu? 💭</button><button class="btn" data-g="2">2 • Tangkap Hati! 💙</button><button class="btn" data-g="3">3 • Susun Puzzle Love 🧩</button></div>`;
  g.querySelectorAll('[data-g]').forEach(b => b.onclick = () => [0, quiz, catchG, puzzle][b.dataset.g]());
}
const back = `<div class="row"><button class="btn alt" id="gm">← Menu game</button></div>`;
const bindBack = () => { const b = $('#gm'); if (b) b.onclick = gMenu; };

const Q = [
  ['Kalau lagi gugup sebelum tampil, hal terbaik yang harus dilakukan adalah…', [['Tarik napas dan percaya diri 😌', 'Betul banget! Kamu udah paham triknya 💙', 1], ['Kabur lewat pintu belakang 🏃', 'Hehe, nggak boleh, nanti penonton sedih 😆', 0], ['Pura-pura jadi patung 🗿', 'Patung yang cantik, tapi tetap harus menari yaa 😂', 0]]],
  ['Setelah capek latihan tari, yang paling kamu butuhkan adalah…', [['Istirahat dan camilan enak 🍪', 'Tepat! Penari juga butuh isi tenaga 💙', 1], ['Latihan lagi sampai subuh 🌙', 'Jangan dong, nanti ngantuk besok 🥱', 0], ['Ngambek sama cermin 🪞', 'Cerminnya nggak salah kok, dia cuma jujur: kamu keren 😄', 0]]],
  ['Siapa yang paling bangga sama kamu hari ini?', [['Tetangga sebelah 🏠', 'Mereka bangga juga, tapi bukan yang paling 😅', 0], ['Seseorang yang bikin website ini 💙', 'Jawaban paling benar sedunia! 🥰', 1], ['Kucing yang lewat 🐈', 'Meong. Dia juga bangga, tapi tetap kalah 😹', 0]]],
  ['Kalau ada gerakan yang salah sedikit, kamu harus…', [['Senyum dan lanjut, nggak ada yang tahu 😁', 'Yap, penari sejati! Percaya diri itu kuncinya ✨', 1], ['Nangis di tempat 😭', 'Jangan dong, kamu terlalu keren buat nangis 🥺', 0], ['Salahin lantainya 🧱', 'Lantainya memang licin, tapi kamu tetap hebat 😂', 0]]],
  ['Julukan yang paling cocok buat kamu hari ini?', [['Penari Hebat 💃', 'Setuju seribu persen! 💙', 1], ['Bintang Panggung 🌟', 'Bersinar banget memang! ⭐', 1], ['Penonton biasa 🙈', 'Hmm, bukan. Kamu tuh bintangnya, bukan penonton 😤', 0]]]
];
function quiz() {
  let i = 0, s = 0;
  const show = () => {
    if (i >= 5) {
      const m = s === 5 ? 'Sempurna! Kamu emang paling ngerti diri sendiri 💙' : s >= 3 ? 'Hampir sempurna! Kamu hebat banget 🌟' : 'Hehe, nggak apa-apa. Apa pun skornya, kamu tetap yang terbaik buat aku 🥰';
      g.innerHTML = `<h2>Hasil kamu</h2><div class="score">${s}/5</div><p class="resp">${m}</p><div class="row"><button class="btn" id="re">Main lagi</button></div>${back}`;
      sfx('success'); if (s >= 3) confetti(60); $('#re').onclick = quiz; bindBack(); return;
    }
    const [q, o] = Q[i];
    g.innerHTML = `<p class="small">Pertanyaan ${i + 1} dari 5</p><h3>${q}</h3><div class="qa">${o.map((x, k) => `<button class="q" data-k="${k}">${x[0]}</button>`).join('')}</div><p class="resp" id="rs"></p>`;
    g.querySelectorAll('.q').forEach(b => b.onclick = () => {
      const x = o[b.dataset.k]; g.querySelectorAll('.q').forEach(z => z.disabled = true); b.classList.add('pick');
      s += x[2]; sfx(x[2] ? 'pop' : 'click'); $('#rs').textContent = x[1]; i++; timers.push(setTimeout(show, 1700));
    });
  };
  show();
}
function catchG() {
  let sc = 0, left = 20;
  g.innerHTML = `<div class="hud"><span>Skor: <b id="sc">0</b></span><span>⏱ <b id="tm">20</b>s</span></div><div class="arena" id="ar"></div><p class="small" style="margin-top:8px">Ketuk hati sebanyak-banyaknya!</p>`;
  const ar = $('#ar');
  timers.push(setInterval(() => {
    const h = document.createElement('span'); h.className = 'fh'; h.textContent = pick(['💙', '💙', '🩵', '🤍']);
    h.style.left = rnd(2, Math.max(10, ar.clientWidth - 50)) + 'px'; h.style.animationDuration = rnd(2.2, 3.8) + 's';
    h.addEventListener('pointerdown', e => { e.stopPropagation(); if (h.classList.contains('pop')) return; sc++; $('#sc').textContent = sc; sfx('pop'); h.classList.add('pop'); const r = h.getBoundingClientRect(); spark(r.left + 20, r.top + 20, 4); setTimeout(() => h.remove(), 260); });
    h.addEventListener('animationend', () => h.remove()); ar.appendChild(h);
  }, 480));
  timers.push(setInterval(() => {
    $('#tm').textContent = --left;
    if (left <= 0) {
      clearT(); const m = sc >= 25 ? 'Wow, tangan super cepat! 🚀' : sc >= 12 ? 'Keren! Hatinya banyak yang ketangkap 💙' : 'Lumayan! Coba lagi biar lebih banyak yaa 😊';
      g.innerHTML = `<h2>Waktu habis! ⏰</h2><div class="score">${sc} 💙</div><p class="resp">${m}</p><div class="row"><button class="btn" id="re">Main lagi</button></div>${back}`;
      sfx('success'); if (sc >= 12) confetti(60); $('#re').onclick = catchG; bindBack();
    }
  }, 1000));
}
function puzzle() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf6ff"/><stop offset="1" stop-color="#a9d8ff"/></linearGradient><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ec0ff"/><stop offset="1" stop-color="#2f66c0"/></linearGradient></defs><rect width="300" height="300" fill="url(#b)"/><circle cx="40" cy="45" r="5" fill="#fff"/><circle cx="262" cy="70" r="4" fill="#fff"/><circle cx="50" cy="255" r="4" fill="#fff"/><circle cx="255" cy="250" r="6" fill="#fff"/><path d="M150 265C60 195 30 150 30 105C30 65 60 40 95 40C120 40 140 55 150 75C160 55 180 40 205 40C240 40 270 65 270 105C270 150 240 195 150 265Z" fill="url(#h)"/><path d="M95 75C75 80 65 100 70 118" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none" opacity=".7"/></svg>`;
  const url = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  let ord = [0, 1, 2, 3, 4, 5, 6, 7, 8], sel = -1, done = false;
  do { for (let i = 8; i > 0; i--) { const j = Math.floor(rnd(i + 1)); [ord[i], ord[j]] = [ord[j], ord[i]]; } } while (ord.every((v, i) => v === i));
  g.innerHTML = `<h2>Susun Puzzle Love 🧩</h2><p class="small">Ketuk dua kepingan untuk menukarnya sampai hatinya utuh.</p><div class="pz" id="pz"></div><p class="resp" id="pr"></p>${back}`;
  bindBack();
  const pz = $('#pz');
  const draw = () => {
    pz.innerHTML = '';
    ord.forEach((v, i) => {
      const t = document.createElement('div'); t.className = 'tile' + (i === sel ? ' sel' : '');
      t.style.backgroundImage = url; t.style.backgroundPosition = `${(v % 3) * 50}% ${Math.floor(v / 3) * 50}%`;
      t.onclick = () => {
        if (done) return; sfx('click');
        if (sel < 0) sel = i; else { [ord[sel], ord[i]] = [ord[i], ord[sel]]; sel = -1; }
        draw();
        if (ord.every((x, k) => x === k)) { done = true; sfx('success'); confetti(90); $('#pr').textContent = 'Yeay! Hati birunya sudah utuh 💙'; }
      };
      pz.appendChild(t);
    });
  };
  draw();
}

/* ---------- SURAT ---------- */
const env = $('#env'), letter = $('#letter');
$('#ob').onclick = () => {
  if (opened) return; opened = true; sfx('open'); $('#ob').style.display = 'none'; env.classList.add('open');
  setTimeout(() => env.classList.add('gone'), 1900);
  setTimeout(() => { letter.classList.add('show'); void letter.offsetWidth; letter.classList.add('in'); sfx('success'); }, 2500);
};

/* ---------- PENUTUP & RESET ---------- */
function resetAll() {
  opened = false; lockedIn = false; pw.value = ''; pm.textContent = ''; pm.className = 'pm';
  env.classList.remove('open', 'gone'); letter.classList.remove('show', 'in'); $('#ob').style.display = '';
}
$('#again').onclick = () => { cp = []; startLoad(); };

addEventListener('error', () => {}); // tidak ada crash walau aset hilang
startLoad();
})();
