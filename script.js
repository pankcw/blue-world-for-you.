(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const pageIds = ["loadingPage","passwordPage","welcomePage","congratsPage","appreciationPage","galleryPage","gamesPage","letterPage","finalPage"];
  let currentPage = "loadingPage";
  const dots = $$(".dot");
  const music = $("#backgroundMusic");
  let musicStarted = false;
  let selectedPuzzle = null;
  let catchTimer = null, catchSpawner = null, catchScore = 0, catchRemaining = 20, catchRunning = false;
  let photoIndex = 0;

  function sound(id) {
    const audio = document.getElementById(id);
    if (!audio) return;
    try { audio.currentTime = 0; const p = audio.play(); if (p && p.catch) p.catch(()=>{}); } catch (_) {}
  }
  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    music.volume = Number($("#volumeControl").value);
    music.play().then(()=>updateMusicButton()).catch(()=>updateMusicButton());
  }
  function updateMusicButton(){ $("#musicToggle").innerHTML = (music.paused ? "♫" : "♫") + " <span>" + (music.paused ? "Music off" : "Music on") + "</span>"; }
  $("#musicToggle").addEventListener("click", () => {
    startMusic();
    if (music.paused) music.play().catch(()=>{}); else music.pause();
    updateMusicButton(); sound("soundClick");
  });
  $("#volumeControl").addEventListener("input", e => { music.volume = Number(e.target.value); });
  $("#replayMusicBtn").addEventListener("click", () => { startMusic(); music.currentTime=0; music.play().catch(()=>{}); updateMusicButton(); sound("soundClick"); });

  function goTo(id, withSound=true) {
    if (!pageIds.includes(id) || id===currentPage) return;
    const old = document.getElementById(currentPage);
    const next = document.getElementById(id);
    if (!next) return;
    if (withSound) sound("soundClick");
    old.classList.add("leaving");
    window.setTimeout(() => {
      old.classList.remove("active","leaving");
      next.classList.add("active");
      currentPage = id;
      const idx = pageIds.indexOf(id);
      dots.forEach((d,i)=>d.classList.toggle("active",i===idx));
      if (id === "finalPage") { confetti(); sound("soundComplete"); }
      if (id === "gamesPage") { initQuiz(); renderPuzzle(); }
    }, 220);
  }
  $$("[data-next]").forEach(btn => btn.addEventListener("click", () => goTo(btn.dataset.next)));
  $$("[data-back]").forEach(btn => btn.addEventListener("click", () => {
    const i=pageIds.indexOf(currentPage); if(i>2) goTo(pageIds[i-1]);
  }));

  // Lightweight particles and the opening heart moment.
  const layer=$("#particle-layer");
  function addParticle(x=Math.random()*100,y=100,size=2+Math.random()*4,duration=5+Math.random()*6){
    const p=document.createElement("i"); p.className="particle"; p.style.left=x+"%"; p.style.top=y+"%"; p.style.width=size+"px"; p.style.height=size+"px"; p.style.animationDuration=duration+"s"; layer.appendChild(p); setTimeout(()=>p.remove(),duration*1000);
  }
  const particleInterval=setInterval(()=>{ if(document.hidden)return; addParticle(); },450);
  const loader=$("#heartLoader");
  for(let i=0;i<30;i++){ const p=document.createElement("i");p.className="particle";p.style.left=(15+Math.random()*70)+"%";p.style.top=(15+Math.random()*70)+"%";p.style.width=(3+Math.random()*5)+"px";p.style.height=p.style.width;p.style.animationDuration=(2+Math.random()*3)+"s";loader.appendChild(p); }
  setTimeout(()=>{ goTo("passwordPage",false); },2900);

  $("#showPassword").addEventListener("click",()=>{const input=$("#passwordInput");input.type=input.type==="password"?"text":"password";});
  $("#passwordForm").addEventListener("submit", e=>{
    e.preventDefault(); const value=$("#passwordInput").value.trim().toLowerCase();
    const feedback=$("#passwordFeedback");
    if(value==="25 juli"){
      feedback.textContent="Yeay! Kamu berhasil masuk! 💙";feedback.style.color="#5b9ec5";sound("soundSuccess");startMusic();
      $("#passwordForm").classList.remove("shake"); setTimeout(()=>goTo("welcomePage",false),900);
    }else{
      feedback.textContent="Hehe, masih belum tepat. Coba ingat-ingat lagi yaa!";sound("soundError");
      const form=$("#passwordForm");form.classList.remove("shake");void form.offsetWidth;form.classList.add("shake");
      $("#passwordInput").select();
    }
  });
  const shakeStyle=document.createElement("style");shakeStyle.textContent="@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}.shake{animation:shake .35s ease}";document.head.appendChild(shakeStyle);

  // Gallery: missing / invalid files gracefully fall back to the included photo placeholders.
  const captions=["my favorite smile ♡","pretty little moment","look at you shine ✨","a day to remember","cutie alert!","always be you"];
  const placeholder="assets/images/placeholder.jpg";
  $$(".photo-frame img").forEach(img=>img.addEventListener("error",()=>{if(!img.dataset.fallback){img.dataset.fallback="1";img.src=placeholder;}}));
  function showPhoto(i){photoIndex=(i+6)%6;const img=$$(".photo-frame img")[photoIndex];$("#lightboxImage").src=img.src;$("#lightboxCaption").textContent=captions[photoIndex];$("#lightbox").classList.add("open");$("#lightbox").setAttribute("aria-hidden","false");}
  $$(".photo-frame").forEach(b=>b.addEventListener("click",()=>showPhoto(Number(b.dataset.photo))));
  function closeLightbox(){$("#lightbox").classList.remove("open");$("#lightbox").setAttribute("aria-hidden","true");}
  $("#closeLightbox").addEventListener("click",closeLightbox);$("#lightbox").addEventListener("click",e=>{if(e.target.id==="lightbox")closeLightbox();});
  $("#prevPhoto").addEventListener("click",()=>showPhoto(photoIndex-1));$("#nextPhoto").addEventListener("click",()=>showPhoto(photoIndex+1));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();if($("#lightbox").classList.contains("open")&&e.key==="ArrowRight")showPhoto(photoIndex+1);if($("#lightbox").classList.contains("open")&&e.key==="ArrowLeft")showPhoto(photoIndex-1);});

  // Quiz data: simple, playful questions about this surprise.
  const questions=[
    {q:"Acara spesial yang dirayakan di website ini adalah...",a:["Hari Guru","Hari Kartini","Ulang tahun sekolah","Hari Kemerdekaan"],c:0,why:"Yap! Kamu ingat, ini buat merayakan penampilan Hari Guru 💙"},
    {q:"Kegiatan hebat yang berhasil kamu lakukan adalah...",a:["Lomba lari","Penampilan tari","Pidato","Menyanyi solo"],c:1,why:"Betul! Penari hebat harus dapat tepuk tangan!"},
    {q:"Warna utama dunia kecil ini adalah...",a:["Merah muda","Ungu","Biru","Kuning"],c:2,why:"Biru, karena dunia kecil ini dibuat khusus buat kamu 💙"},
    {q:"Apa yang paling penting dari sebuah penampilan?",a:["Harus sempurna","Usaha dan keberanian","Baju paling mahal","Tidak boleh gugup"],c:1,why:"Benar! Proses dan keberanian kamu jauh lebih berarti."},
    {q:"Setelah tampil, kamu pantas untuk...",a:["Meremehkan diri sendiri","Lupa istirahat","Bangga sama diri sendiri","Langsung latihan 10 jam"],c:2,why:"YES! Jangan lupa bangga sama diri sendiri, yaa!"}
  ];
  let quizIndex=0,quizScore=0,quizLocked=false;
  function initQuiz(){quizIndex=0;quizScore=0;quizLocked=false;renderQuiz();}
  function renderQuiz(){
    const root=$("#quizContent");
    if(quizIndex>=questions.length){root.innerHTML=`<div class="quiz-question">Selesai! Skor kamu: ${quizScore}/5 💙</div><p class="quiz-feedback">${quizScore===5?"Wahh, perfect score! Kamu jago banget! 🥳":quizScore>=3?"Yeay, kamu hebat! Makasih udah main yaa. 💗":"Hehe, masih ada yang bisa dipelajari. Yang penting seru-seruan! 💙"}</p><button class="soft-btn quiz-next" id="retryQuiz">Main lagi ↻</button>`;$("#retryQuiz").onclick=initQuiz;return;}
    const q=questions[quizIndex];root.innerHTML=`<div class="quiz-question">Pertanyaan ${quizIndex+1}/5 · ${q.q}</div><div class="quiz-options">${q.a.map((a,i)=>`<button class="quiz-option" data-answer="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join("")}</div><p class="quiz-feedback" id="quizFeedback"></p><button class="primary-btn small-btn quiz-next" id="quizNext" hidden>${quizIndex===4?"Lihat hasil":"Lanjut →"}</button>`;
    $$("[data-answer]",root).forEach(btn=>btn.addEventListener("click",()=>{if(quizLocked)return;quizLocked=true;const correct=Number(btn.dataset.answer)===q.c;if(correct){quizScore++;sound("soundSuccess");}else sound("soundError");$$("[data-answer]",root).forEach(b=>{b.disabled=true;if(Number(b.dataset.answer)===q.c)b.style.borderColor="#81c7a8";});$("#quizFeedback").textContent=correct?q.why:"Belum tepat, nggak apa-apa! Jawabannya: "+q.a[q.c]+" 💙";$("#quizNext").hidden=false;}));
    $("#quizNext").onclick=()=>{quizIndex++;quizLocked=false;renderQuiz();};
  }
  $$(".game-tab").forEach(tab=>tab.addEventListener("click",()=>{$$(".game-tab").forEach(t=>t.classList.toggle("selected",t===tab));$$(".game-panel").forEach(p=>p.classList.toggle("active",p.id===tab.dataset.game+"Game"));sound("soundClick");}));
  initQuiz();

  // Catch hearts: one interval for the round, removed on completion.
  function finishCatch(){catchRunning=false;clearInterval(catchSpawner);clearInterval(catchTimer);$("#catchArena").innerHTML='<div class="arena-start"><p>Waktunya habis! Kamu mengumpulkan <b>'+catchScore+'</b> hati 💙</p><button class="primary-btn small-btn" id="startCatch">Main lagi</button></div>';$("#catchResult").textContent=catchScore>=15?"Wah, penangkap hati profesional! 🏆":"Makasih sudah mengumpulkan hati-hati kecil ini!";$("#startCatch").onclick=startCatch;sound("soundComplete");}
  function startCatch(){if(catchRunning)return;catchRunning=true;catchScore=0;catchRemaining=20;$("#catchScore").textContent="0";$("#catchTime").textContent="20";$("#catchResult").textContent="";$("#catchArena").innerHTML="";catchSpawner=setInterval(()=>{if(!catchRunning)return;const h=document.createElement("button");h.className="falling-heart";h.type="button";h.textContent=Math.random()>.2?"💙":"♡";h.style.left=(Math.random()*88)+"%";h.style.top="-30px";h.style.animationDuration=(1.8+Math.random()*1.1)+"s";h.addEventListener("click",()=>{if(!catchRunning)return;catchScore++;$("#catchScore").textContent=catchScore;h.remove();sound("soundSuccess");});$("#catchArena").appendChild(h);setTimeout(()=>h.remove(),3200);},450);catchTimer=setInterval(()=>{catchRemaining--;$("#catchTime").textContent=catchRemaining;if(catchRemaining<=0)finishCatch();},1000);}
  $("#startCatch").onclick=startCatch;

  // Tap-to-swap 8-tile puzzle, solvable state is 1..8 followed by blank.
  let puzzle=[1,2,3,4,5,6,7,8,0];
  function shufflePuzzle(){puzzle=[1,2,3,4,5,6,7,8,0];for(let i=0;i<100;i++){const blank=puzzle.indexOf(0),neighbors=[blank-3,blank+3,...(blank%3?[blank-1]:[]),...(blank%3!==2?[blank+1]:[])].filter(n=>n>=0&&n<9);const n=neighbors[Math.floor(Math.random()*neighbors.length)];[puzzle[blank],puzzle[n]]=[puzzle[n],puzzle[blank]];}selectedPuzzle=null;$("#puzzleResult").textContent="";renderPuzzle();}
  function renderPuzzle(){const board=$("#puzzleBoard");if(!board)return;board.innerHTML="";puzzle.forEach((n,i)=>{const b=document.createElement("button");b.className="puzzle-tile"+(n===0?" empty":"")+(selectedPuzzle===i?" selected":"");b.textContent=n===0?"":n;b.setAttribute("aria-label",n===0?"Kotak kosong":"Potongan "+n);b.onclick=()=>{if(selectedPuzzle===null){if(n!==0){selectedPuzzle=i;renderPuzzle();}}else if(selectedPuzzle===i){selectedPuzzle=null;renderPuzzle();}else{[puzzle[selectedPuzzle],puzzle[i]]=[puzzle[i],puzzle[selectedPuzzle]];selectedPuzzle=null;renderPuzzle();if(puzzle.every((v,j)=>v===j+1||j===8&&v===0)){ $("#puzzleResult").textContent="Yeay! Puzzle love berhasil disusun! Kamu keren! 💙";sound("soundComplete");}}};board.appendChild(b);});}
  $("#shufflePuzzle").onclick=()=>{shufflePuzzle();sound("soundClick");};shufflePuzzle();

  $("#openLetter").addEventListener("click",()=>{const scene=$("#envelopeScene");if(!scene.classList.contains("opened")){scene.classList.add("opened");$("#letterHint").textContent="Dari hati kecilku, khusus buat kamu. 💙";$("#openLetter").textContent="Suratnya sudah terbuka ♡";sound("soundSuccess");}else{scene.classList.remove("opened");$("#letterHint").textContent="Kamu bisa buka lagi kapan saja.";$("#openLetter").textContent="Buka suratnya 💌";}});
  function confetti(){for(let i=0;i<35;i++){const c=document.createElement("i");c.className="particle";c.style.left=Math.random()*100+"%";c.style.top="-5%";c.style.width=(4+Math.random()*5)+"px";c.style.height=(4+Math.random()*7)+"px";c.style.borderRadius=Math.random()>.5?"50%":"2px";c.style.background=["#fff","#8dcdf0","#b9e5fa","#6eaed4"][i%4];c.style.animationDuration=(3+Math.random()*3)+"s";layer.appendChild(c);setTimeout(()=>c.remove(),6500);}}
  $("#restartBtn").addEventListener("click",()=>{closeLightbox();$("#passwordInput").value="";$("#passwordFeedback").textContent="";goTo("passwordPage",false);});
  updateMusicButton();
})();