(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PASS='25 juli';
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);

/* ===== AUDIO ===== */
const S={};['click','success','pop','open-letter','wrong'].forEach(n=>{const a=new Audio(`./assets/sounds/${n}.mp3`);a.preload='auto';a.volume=.6;S[n]=a});
let muted=false,music=false;const bgm=new Audio('./assets/music/background.mp3');bgm.loop=true;bgm.volume=.5;
const sfx=n=>{if(muted||!S[n])return;try{S[n].currentTime=0;const p=S[n].play();p&&p.catch(()=>{})}catch(e){}};
function playMusic(){try{const p=bgm.play();p&&p.then(()=>{music=true;$('#musicBtn').style.opacity=1}).catch(()=>{})}catch(e){}}
$('#musicBtn').onclick=()=>{if(music){bgm.pause();music=false;$('#musicBtn').style.opacity=.45}else playMusic()};
$('#muteBtn').onclick=()=>{muted=!muted;bgm.muted=muted;$('#muteBtn').textContent=muted?'🔇':'🔊'};
$('#vol').oninput=e=>{bgm.volume=e.target.value/100;Object.values(S).forEach(a=>a.volume=Math.min(1,e.target.value/100+.2))};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.dataset.q)sfx('click')});

/* ===== UTIL ===== */
function burst(x,y,n,em){for(let i=0;i<n;i++){const el=document.createElement('span');el.className='fly';el.textContent=em[i%em.length];el.style.left=x+'px';el.style.top=y+'px';document.body.appendChild(el);const a=Math.random()*6.28,d=60+Math.random()*140;el.animate([{transform:'translate(0,0) scale(.5)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(1.3)`,opacity:0}],{duration:RM?10:1100,easing:'ease-out'}).onfinish=()=>el.remove()}}
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3200)}
const screens=id=>$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));

/* ===== PARTIKEL BG ===== */
(function(){const c=$('#bg'),x=c.getContext('2d');let W,H;const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener('resize',rs);
const P=Array.from({length:RM?20:55},()=>({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*3,s:8+Math.random()*22,a:Math.random()*6}));let l=performance.now();
(function f(t){const dt=Math.min(.05,(t-l)/1000);l=t;x.clearRect(0,0,W,H);x.fillStyle='#fff';for(const p of P){p.y-=p.s*dt;p.a+=dt;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}x.globalAlpha=.3+.4*Math.sin(p.a*2)**2;x.beginPath();x.arc(p.x+Math.sin(p.a)*10,p.y,p.r,0,6.283);x.fill()}requestAnimationFrame(f)})(l)})();
addEventListener('pointermove',e=>{if(RM)return;const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;$$('.cloud').forEach(c=>{const d=+c.dataset.d;c.style.translate=`${-x*d}px ${-y*d}px`})});

/* ===== HEART PARTICLES ===== */
function heartFX(c,o){const x=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),W=c.clientWidth||c.width,H=c.clientHeight||c.height;c.width=W*dpr;c.height=H*dpr;x.scale(dpr,dpr);
const s=Math.min(W,H*.95)/36,cx=W/2,cy=H/2+s,P=[],N=o.n;
for(let i=0;i<N;i++){const t=Math.random()*6.2832,r=i<N*.55?1:Math.sqrt(Math.random())*.92,hx=16*Math.sin(t)**3,hy=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
P.push({sx:Math.random()*W,sy:Math.random()*H,tx:hx*s*r,ty:-hy*s*r,ph:Math.random()*6.28,d:Math.random()*.25,z:1+Math.random()*1.8,c:['#fff','#d4ebff','#e2d9ff'][i%3]})}
const st=performance.now(),E=u=>u<0?0:u>1?1:u*u*(3-2*u);let run=true,id;
function f(t){if(!run)return;const e=(t-st)/1000,gl=E((e-o.gather)/1.2),pu=1+.03*Math.sin(e*3)*gl;x.clearRect(0,0,W,H);
if(gl>0){const g=x.createRadialGradient(cx,cy,0,cx,cy,s*20);g.addColorStop(0,`rgba(255,255,255,${.35*gl})`);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H)}
x.shadowBlur=gl*16;x.shadowColor='#8ec9ff';
for(const p of P){const g=E((e-p.d*o.gather)/(o.gather*.75)),w=1-g,px=p.sx+(cx+p.tx*pu-p.sx)*g+Math.sin(e*1.5+p.ph)*w*18+Math.sin(e*2+p.ph)*1.3*g,py=p.sy+(cy+p.ty*pu-p.sy)*g+Math.cos(e*1.3+p.ph)*w*18+Math.cos(e*2+p.ph)*1.3*g;x.fillStyle=p.c;x.globalAlpha=.55+.45*g;x.beginPath();x.arc(px,py,p.z,0,6.283);x.fill()}
o.onFrame&&o.onFrame(e);id=requestAnimationFrame(f)}
id=requestAnimationFrame(f);return{stop(){run=false;cancelAnimationFrame(id)}}}

/* ===== LOADING ===== */
let fxLoad;
function startLoading(){screens('loading');const c=$('#heartCanvas'),D=RM?2.5:5,T=D+2.5;let done=false;c.classList.remove('fade');$('#loadText').classList.remove('on');$('#barFill').style.width='0';
fxLoad&&fxLoad.stop();
fxLoad=heartFX(c,{n:RM?90:170,gather:D,onFrame(e){const p=Math.min(1,e/T);$('#barFill').style.width=p*100+'%';$('#pct').textContent=Math.round(p*100)+'%';if(e>D*.75)$('#loadText').classList.add('on');
if(e>=T&&!done){done=true;c.classList.add('fade');setTimeout(()=>{fxLoad.stop();screens('password');$('#pcard').classList.remove('open');$('#pw').value='';$('#pmsg').textContent='';$('#lock').textContent='🔒'},1500)}}})}

/* ===== PASSWORD ===== */
const WRONG=['Ups, bukan itu 🥺 Coba ingat-ingat lagi ya…','Pintunya bilang: "bukan aku yang kamu cari" 🚪💙','Hampir! Eh, nggak deng 😆 coba lagi, sayang','Petunjuknya ada di bawah lho 👀','Hihi, salah! Tapi tetap lucu kok 🫶'];
$('#eye').onclick=()=>{const i=$('#pw'),h=i.type==='password';i.type=h?'text':'password';$('#eye').textContent=h?'🙈':'👁️'};
function tryPass(){const v=$('#pw').value,m=$('#pmsg'),card=$('#pcard');
if(v===PASS){sfx('success');m.textContent='Yeay, benar! 🎉';$('#lock').textContent='🔓';const r=card.getBoundingClientRect();burst(r.left+r.width/2,r.top+60,26,['💙','🩵','✨','🤍','💜']);card.classList.add('open');
setTimeout(()=>{screens(null);fxLoad&&fxLoad.stop();$('#app').hidden=false;requestAnimationFrame(()=>$('#app').classList.add('in'));playMusic();go(0)},1000)}
else{sfx('wrong');m.textContent=v.toLowerCase().replace(/\s/g,'')==='25juli'?'Dikit lagi! Formatnya: angka, spasi, bulan (huruf kecil) 🤏':WRONG[Math.floor(Math.random()*WRONG.length)];card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake')}}
$('#pgo').onclick=tryPass;$('#pw').addEventListener('keydown',e=>{if(e.key==='Enter')tryPass()});

/* ===== NAVIGASI ===== */
const pages=$$('.page'),names=pages.map(p=>p.dataset.name);let cur=0;
names.forEach((n,i)=>{const d=document.createElement('button');d.setAttribute('aria-label',n);d.dataset.q=1;d.onclick=()=>{sfx('click');go(i)};$('#dots').appendChild(d);const m=document.createElement('button');m.textContent=n;m.onclick=()=>{$('#menu').hidden=true;go(i)};$('#menuList').appendChild(m)});
function go(i){if(i<0||i>=pages.length)return;pages[cur].classList.remove('on');leave(cur);cur=i;pages[i].classList.add('on');pages[i].scrollTop=0;enter(i);$('#pageName').textContent=names[i];$('#prev').disabled=i===0;$('#next').style.visibility=i===pages.length-1?'hidden':'visible';$$('#dots button').forEach((d,k)=>d.classList.toggle('on',k===i))}
$('#prev').onclick=()=>go(cur-1);$('#next').onclick=()=>go(cur+1);$$('[data-next]').forEach(b=>b.onclick=()=>go(cur+1));
$('#menuBtn').onclick=()=>$('#menu').hidden=false;$('#menuClose').onclick=()=>$('#menu').hidden=true;
function enter(i){if(i===1)wishes();if(i===3)tab(0);if(i===4)letterReset();if(i===5)closeStart()}
function leave(i){if(i===1)wT++;if(i===3)stopCatch();if(i===5)closeStop()}

/* ===== UCAPAN ===== */
const WL=['Selamat yaaa, kamu berhasil mengikuti penampilan tari di acara Hari Guru! 🎉','Aku bangga banget sama kamu. Beneran. 💙','Terima kasih sudah berusaha dan memberikan yang terbaik.','Aku tahu mungkin ada rasa gugup, capek, atau hal-hal yang nggak mudah selama persiapan. Tapi kamu sudah berhasil melewati semuanya.','Jangan terlalu keras sama diri sendiri, ya. Kamu pantas mendapatkan apresiasi atas semua usaha kamu. 🤍','Semoga kamu selalu punya semangat untuk mencoba hal-hal baru.','Dan jangan pernah meremehkan kemampuan diri sendiri. Kamu bisa lebih dari yang kamu kira. ✨'];
let wT=0;
function wishes(){const b=$('#wishBox'),id=++wT;b.innerHTML='';$('#wishSkip').hidden=false;let i=0;
const next=()=>{if(id!==wT)return;if(i>=WL.length){$('#wishSkip').hidden=true;return}const p=document.createElement('p');p.className='wl';b.appendChild(p);const t=WL[i++];let k=0;(function ty(){if(id!==wT)return;k+=RM?t.length:2;p.textContent=t.slice(0,k);if(k<t.length)setTimeout(ty,28);else setTimeout(next,450)})()};next()}
$('#wishSkip').onclick=()=>{wT++;$('#wishBox').innerHTML=WL.map(t=>`<p class="wl" style="animation:none;opacity:1">${t}</p>`).join('');$('#wishSkip').hidden=true};

/* ===== GALERI ===== */
const CAP=['Senyum kamu, favoritku✨','Cantiknya kebangetan🫶🏻','Tetap semangat latihan!','Kamu & buket biru💙','Momen kecil yang berharga','Gaya andalan kamu😝','Tawa yang bikin cerah','Siap narii!','wanita kebanggaanku💃','Hari Guru yang spesial','Terus bersinar yaa🌟','Selalu ada di pikiranku🤍'],ROT=[-4,3,-2,4,-3,2,3,-4,2,-3,4,-2];
const src=i=>`./assets/images/foto${i+1}.jpg`;
const ph=i=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe0ff"/><stop offset="1" stop-color="#e2d9ff"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><text x="400" y="500" font-size="200" text-anchor="middle">💙</text><text x="400" y="640" font-size="48" text-anchor="middle" fill="#1f3b63" font-family="sans-serif">Foto ${i+1}</text></svg>`);
const fb=(img,i)=>{img.onerror=()=>{img.onerror=null;img.src=ph(i)}};
CAP.forEach((c,i)=>{const f=document.createElement('figure');f.className='pola';f.tabIndex=0;f.setAttribute('role','button');f.style.cssText=`--r:${ROT[i]}deg;--i:${i}`;const im=new Image();im.loading='lazy';im.alt=c;fb(im,i);im.src=src(i);const fc=document.createElement('figcaption');fc.textContent=c;f.append(im,fc);f.onclick=()=>lb(i);f.onkeydown=e=>{if(e.key==='Enter')lb(i)};$('#grid').appendChild(f)});
let li=0;function lb(i){li=(i+12)%12;const im=$('#lbImg');im.style.opacity=0;fb(im,li);im.onload=()=>im.style.opacity=1;im.src=src(li);$('#lbCap').textContent=CAP[li];$('#lb').hidden=false;sfx('pop')}
$('#lbClose').onclick=()=>$('#lb').hidden=true;$('#lbPrev').onclick=()=>lb(li-1);$('#lbNext').onclick=()=>lb(li+1);
$('#lb').addEventListener('click',e=>{if(e.target.id==='lb')$('#lb').hidden=true});
addEventListener('keydown',e=>{if($('#lb').hidden)return;if(e.key==='Escape')$('#lb').hidden=true;if(e.key==='ArrowLeft')lb(li-1);if(e.key==='ArrowRight')lb(li+1)});
let tx=0;$('#lb').addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});$('#lb').addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)lb(li+(d<0?1:-1))});

/* ===== GAMES ===== */
function tab(n){stopCatch();$$('.tab').forEach(t=>t.classList.toggle('on',+t.dataset.t===n));$$('.panel').forEach((p,i)=>p.classList.toggle('on',i===n));if(n===0)catchReset();if(n===1)qReset()}
$$('.tab').forEach(t=>t.onclick=()=>tab(+t.dataset.t));

/* Game 1 */
let cg=null;
function catchReset(){$('#field').querySelectorAll('.h,.plus').forEach(e=>e.remove());$('#cScore').textContent=0;$('#cTime').textContent=30;$('#cMsg').textContent='Tangkap sebanyak mungkin hati yang jatuh dalam 30 detik. Kumpulkan 10 hati untuk kejutan!';$('#cStart').textContent='Mulai!';$('#cOver').hidden=false}
function stopCatch(){if(cg){cg.stop();cg=null}}
$('#cStart').onclick=()=>{stopCatch();const f=$('#field');f.querySelectorAll('.h,.plus').forEach(e=>e.remove());$('#cOver').hidden=true;
let sc=0,tl=30,sp=0,hs=[],run=true,id,hit=false,last=performance.now();const H=f.clientHeight,W=f.clientWidth,upd=()=>{$('#cScore').textContent=sc;$('#cTime').textContent=Math.max(0,Math.ceil(tl))};upd();
const down=e=>{const el=e.target.closest('.h');if(!el||!el._h)return;const h=el._h;hs.splice(hs.indexOf(h),1);el._h=null;sc++;sfx('pop');const r=f.getBoundingClientRect(),p=document.createElement('span');p.className='plus';p.textContent='+1';p.style.cssText=`left:${h.x+10}px;top:${h.y}px`;f.appendChild(p);p.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-40px)',opacity:0}],{duration:600}).onfinish=()=>p.remove();el.remove();upd();
if(sc===10&&!hit){hit=true;sfx('success');toast('10 hati! Kamu menangkap hatiku juga 💙');burst(r.left+r.width/2,r.top+r.height/2,18,['💙','✨','🤍'])}};
f.addEventListener('pointerdown',down);
function end(){stopCatch();$('#cMsg').textContent=sc>=10?`Skor ${sc}! 🥳 Hebat banget, kamu memang jago menangkap hal-hal baik, termasuk hatiku. 💙`:`Skor ${sc}. Seru kan? Coba lagi, pasti bisa lebih banyak! 💪`;if(sc>=10)sfx('success');$('#cStart').textContent='Main lagi';$('#cOver').hidden=false}
function tick(t){if(!run)return;const dt=Math.min(.05,(t-last)/1000);last=t;tl-=dt;sp-=dt;
if(sp<=0){sp=Math.max(.28,.6-(30-tl)*.01);const el=document.createElement('span'),h={el,x:Math.random()*(W-50),y:-50,v:H/4+Math.random()*H/4};el.className='h';el.textContent=['💙','🩵','🤍','💜'][Math.random()*4|0];el._h=h;f.appendChild(el);hs.push(h)}
for(let i=hs.length-1;i>=0;i--){const h=hs[i];h.y+=h.v*dt;h.el.style.transform=`translate3d(${h.x}px,${h.y}px,0)`;if(h.y>H){h.el.remove();hs.splice(i,1)}}
upd();if(tl<=0){end();return}id=requestAnimationFrame(tick)}
cg={stop(){run=false;cancelAnimationFrame(id);f.removeEventListener('pointerdown',down);f.querySelectorAll('.h').forEach(e=>e.remove())}};id=requestAnimationFrame(tick)};

/* Game 2 */
const Q=[{q:'Apa yang paling bikin aku senyum hari ini?',o:['Ngelihat kamu tampil menari 💃','Diskon gede-gedean','Tidur seharian','Hujan deras'],ok:'Tepat banget! 🥹'},
{q:'Kapan ulang tahun orang yang bikin website ini?',o:['25 Juli 🎂','1 Januari','17 Agustus','31 Desember'],ok:'Yeay, kamu ingat! 🎉'},
{q:'Kalau kamu tampil di panggung, aku ada di mana?',o:['Paling depan, paling semangat 📣','Di kantin','Tidur di rumah','Pura-pura nggak kenal 😆'],ok:'Betul! Fans nomor satu kamu 💙'},
{q:'Apa warna favorit website ini?',o:['Biru, kayak langit 💙','Hitam','Oranye neon','Hijau stabilo'],ok:'Benar! Biru itu kamu banget ☁️'},
{q:'Apa yang paling aku banggakan dari kamu?',o:['Usaha dan keberanian kamu ✨','Jago ngambek','Suka telat bangun','Rahasia dong'],ok:'Iya, itu dia! 🥺💙'}];
let qi=0,qs=0,qo=[],ql=false;
function qReset(){qi=0;qs=0;qRender()}
function qRender(){const b=$('#quizBox');if(qi>=Q.length){const m=qs===5?'Sempurna! Kamu benar-benar kenal aku 🥹💙':qs>=3?'Wah, kamu kenal aku lumayan banget! 💙':'Skornya mungil, tapi nggak apa-apa. Artinya masih banyak hal seru yang bisa kita cari tahu bareng 🤍';b.innerHTML=`<div class="qprog"><i style="width:100%"></i></div><h3>Skor kamu: ${qs}/5 🎉</h3><p>${m}</p><p>Apa pun skornya, kamu tetap juara di hatiku.</p><button class="btn" id="qAgain">Main lagi</button>`;$('#qAgain').onclick=qReset;if(qs>=3)sfx('success');return}
const q=Q[qi];qo=shuffle(q.o.map((t,i)=>({t,c:i===0})));ql=false;
b.innerHTML=`<div class="qprog"><i style="width:${qi/5*100}%"></i></div><small>Pertanyaan ${qi+1} dari ${Q.length}</small><h3>${q.q}</h3><div class="opts">${qo.map((o,i)=>`<button class="opt" data-q="1" data-i="${i}">${o.t}</button>`).join('')}</div><p class="qfb"></p>`}
$('#quizBox').addEventListener('click',e=>{const o=e.target.closest('.opt');if(o&&!ql){ql=true;const i=+o.dataset.i,fb=$('.qfb'),q=Q[qi];$$('.opt').forEach((x,k)=>{x.disabled=true;if(qo[k].c)x.classList.add('good')});
if(qo[i].c){qs++;sfx('success');fb.textContent=q.ok}else{o.classList.add('meh');sfx('wrong');fb.textContent='Hampir! 😆 Tapi tetap lucu kok. Jawaban yang aku maksud sudah ditandai hijau.'}
const n=document.createElement('button');n.className='btn';n.textContent=qi===Q.length-1?'Lihat hasil →':'Lanjut →';n.onclick=()=>{qi++;qRender()};fb.after(n)}});

/* Game 3 */
const MSG=['Kamu itu penari paling manis yang pernah aku lihat 💃','Aku bangga banget sama kamu hari ini 💙','Setiap gerakanmu punya cerita, dan aku suka ceritamu ✨','Capekmu hari ini terbayar lunas, lho 🤍','Kamu hebat dengan caramu sendiri 🌟','Terima kasih sudah jadi kamu 🥹','Kamu pantas banget dapat tepuk tangan paling meriah 👏','Jangan ragu coba hal baru lagi, aku selalu dukung 💪','Senyummu bikin hariku cerah, serius ☀️','Kalau lelah, istirahat ya. Aku di sini 🫶','Kamu bisa lebih dari yang kamu kira 💜','Peluk virtual buat kamu! 🤗'];
let pool=[];
for(let i=0;i<6;i++){const b=document.createElement('button');b.className='env';b.dataset.q=1;b.setAttribute('aria-label','Amplop '+(i+1));b.innerHTML=`<span>${['💌','💙','✉️','🩵','💜','🤍'][i]}</span>`;b.onclick=()=>{sfx('open-letter');$$('.env').forEach(e=>e.classList.remove('open'));b.classList.add('open');if(!pool.length)pool=shuffle(MSG);const m=$('#envMsg');m.classList.remove('pop');void m.offsetWidth;m.textContent=pool.pop();m.classList.add('pop');const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top+10,8,['💙','✨'])};$('#envGrid').appendChild(b)}

/* ===== SURAT ===== */
function letterReset(){$('#lenv').classList.remove('open');$('#paper').classList.remove('show','up');$('#sealHint').hidden=false}
$('#seal').onclick=()=>{sfx('open-letter');$('#lenv').classList.add('open');$('#sealHint').hidden=true;const p=$('#paper');p.classList.add('show');setTimeout(()=>{p.classList.add('up');p.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})},500)};

/* ===== PENUTUP ===== */
let fxC,rainId,rainRun=false;
function closeStart(){closeStop();fxC=heartFX($('#closingHeart'),{n:RM?70:120,gather:2.5});setTimeout(()=>{if(cur===5)burst(innerWidth/2,innerHeight/3,24,['💙','✨','🩵','🤍'])},1800);
const c=$('#rain'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;rainRun=true;x.textAlign='center';const P=Array.from({length:RM?14:38},()=>({x:Math.random()*c.width,y:Math.random()*c.height-c.height,v:40+Math.random()*80,s:14+Math.random()*18,a:Math.random()*6,e:['💙','🩵','💙','🤍'][Math.random()*4|0]}));let l=performance.now();
(function f(t){if(!rainRun)return;const dt=Math.min(.05,(t-l)/1000);l=t;x.clearRect(0,0,c.width,c.height);for(const p of P){p.y+=p.v*dt;p.a+=dt;if(p.y>c.height+30){p.y=-30;p.x=Math.random()*c.width}x.globalAlpha=.8;x.font=p.s+'px serif';x.fillText(p.e,p.x+Math.sin(p.a*1.5)*14,p.y)}rainId=requestAnimationFrame(f)})(l)}
function closeStop(){rainRun=false;cancelAnimationFrame(rainId);fxC&&fxC.stop()}
$('#replay').onclick=()=>{closeStop();$('#app').classList.remove('in');setTimeout(()=>{$('#app').hidden=true;pages[cur].classList.remove('on');cur=0;bgm.pause();music=false;startLoading()},700)};

startLoading();
})();
