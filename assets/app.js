// Drawer
(function(){const b=document.getElementById('menuBtn'),d=document.getElementById('drawer'),k=document.getElementById('backdrop');if(!b||!d||!k)return;function s(o){d.classList.toggle('show',o);k.classList.toggle('show',o);b.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':''}const t=()=>s(!d.classList.contains('show'));b.addEventListener('click',t);k.addEventListener('click',()=>s(false));d.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>s(false)));window.addEventListener('keydown',e=>{if(e.key==='Escape')s(false)})})();

// Theme
(function(){
  const w=document.getElementById('switch');
  const saved=localStorage.getItem('theme');
  const set=(l)=>{document.body.classList.toggle('light',l);w.classList.toggle('on',l);w.setAttribute('aria-checked',l?'true':'false');localStorage.setItem('theme',l?'light':'dark')};
  set(saved!=='dark');
  w.addEventListener('click',()=>set(!document.body.classList.contains('light')));
  w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();set(!document.body.classList.contains('light'))}})
})();

// Typewriter
(function(){
  const el=document.getElementById('typewrite'); if(!el) return;
  let lines=[], pi=0,ci=0,typing=true,active=true,timer=null;
  function render(t){ el.textContent=t; el.insertAdjacentHTML('beforeend','<span class="caret" aria-hidden="true"></span>'); }
  function loop(){
    if(!active||!lines.length) return;
    const L=lines.length-1, tx=lines[pi];
    if(typing){
      ci++; render(tx.slice(0,ci));
      if(ci===tx.length){
        typing=false;
        const last=(pi===L);
        setTimeout(()=>{ if(last){ el.classList.add('glow'); setTimeout(()=>{ el.classList.remove('glow'); setTimeout(loop,2000)},5000); } else { setTimeout(loop,1600); } },2000);
        return;
      }
      timer=setTimeout(loop,110);
    }else{
      ci--; render(tx.slice(0,ci));
      if(ci===0){ typing=true; pi=(pi+1)%lines.length; setTimeout(loop,450); return; }
      timer=setTimeout(loop,55);
    }
  }
  function start(newLines){ if(timer) clearTimeout(timer); lines=Array.isArray(newLines)?newLines:[]; pi=0; ci=0; typing=true; active=true; loop(); }
  window.__typewriterSet = start;
})();

// Reveal
(function(){const E=[...document.querySelectorAll('.reveal')];if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.12});E.forEach(el=>io.observe(el))}else{E.forEach(el=>el.classList.add('show'))}})();

// Top Button
(function(){const b=document.getElementById('toTop');const y=420;function f(){if(window.scrollY>y){b.classList.add('show')}else{b.classList.remove('show')}}window.addEventListener('scroll',f,{passive:true});b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));f()})();

// FAB Nudge
(function(){const f=document.querySelector('.fab');if(!f)return;const m=window.matchMedia('(prefers-reduced-motion: reduce)');function n(){if(m.matches)return;f.classList.add('nudging');setTimeout(()=>f.classList.remove('nudging'),1200)}const T=5*60*1000;setTimeout(n,T);setInterval(n,T)})();

// Mailto
(function(){
  const form=document.getElementById('quoteForm'); if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const fd=new FormData(form);
    const name=fd.get('name')||'', email=fd.get('email')||'', company=fd.get('company')||'', project=fd.get('project')||'', timeline=fd.get('timeline')||'';
    const subject=`Quote request from ${name}`;
    const body=`Name: ${name}%0D%0AEmail: ${email}%0D%0ACompany: ${company}%0D%0ATimeline: ${timeline}%0D%0A%0D%0AProject Summary:%0D%0A${encodeURIComponent(project)}`;
    window.location.href=`mailto:hello@arfhacorp.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
})();

// Context Menu
(function(){document.addEventListener('contextmenu',e=>e.preventDefault())})();

// Preloader
(function(){
  const pl=document.getElementById('preloader');
  function hide(){ if(!pl) return; pl.style.opacity='0'; pl.style.transition='opacity .35s ease'; setTimeout(()=>pl.style.display='none',380); }
  window.addEventListener('load', ()=> setTimeout(hide, 450));
})();

// Header underscore
(function(){
  const T=8;
  function apply(){ if(window.scrollY>T){ document.body.classList.add('scrolled'); } else { document.body.classList.remove('scrolled'); } }
  window.addEventListener('scroll', apply, {passive:true});
  window.addEventListener('load', apply);
})();

// I18N
(function(){
  const html=document.documentElement;
  const langBtn=document.getElementById('langBtn');
  const langMenu=document.getElementById('langMenu');
  const FLAG={en:'🇬🇧 EN',id:'🇮🇩 ID',ar:'🇸🇦 AR',fr:'🇫🇷 FR',es:'🇪🇸 ES',ru:'🇷🇺 RU'};
  const SUPP=['en','id','ar','fr','es','ru'];
  let base={}, pack={}, current='en';

  function parseKv(src){
    const out={};
    src.split(/\r?\n/).forEach(line=>{
      if(!line) return;
      const s=line.trim();
      if(!s || s.startsWith('#')) return;
      const i=s.indexOf('=');
      if(i<1) return;
      const k=s.slice(0,i).trim();
      const v=s.slice(i+1).trim();
      out[k]=v;
    });
    return out;
  }

  async function load(lang){
    try{
      const res=await fetch(`content/${lang}.txt`,{cache:'no-store'});
      if(!res.ok) return {};
      return parseKv(await res.text());
    }catch(_){return {}}
  }

  function t(key){ return (pack[key]??base[key]??''); }

  function applyTexts(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n');
      const htmlMode=el.hasAttribute('data-i18n-html');
      const val=t(key);
      if(htmlMode) el.innerHTML=val; else el.textContent=val;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      const key=el.getAttribute('data-i18n');
      const attr=el.getAttribute('data-i18n-attr');
      const val=t(key);
      if(val!==undefined) el.setAttribute(attr,val);
    });
  }

  function applyDir(){
    html.setAttribute('dir', current==='ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', current);
  }

  function applyHero(){
    const lines=[];
    for(let i=1;i<=5;i++){ const v=t(`hero.line${i}`); if(v) lines.push(v); }
    if(window.__typewriterSet) window.__typewriterSet(lines);
  }

  async function setLang(lang){
    if(!SUPP.includes(lang)) lang='en';
    current=lang;
    if(Object.keys(base).length===0) base=await load('en');
    pack = (lang==='en') ? {} : await load(lang);
    applyDir();
    applyTexts();
    applyHero();
    langBtn.textContent=FLAG[lang]||'EN';
    localStorage.setItem('lang', lang);
  }

  langBtn.addEventListener('click',()=>{
    const open=langMenu.style.display==='block';
    langMenu.style.display=open?'none':'block';
    langBtn.setAttribute('aria-expanded',open?'false':'true');
  });
  document.addEventListener('click',(e)=>{
    if(!e.target.closest('#langDropdown')){ langMenu.style.display='none'; langBtn.setAttribute('aria-expanded','false'); }
  });
  langMenu.querySelectorAll('li').forEach(li=>{
    li.addEventListener('click',()=>{ setLang(li.getAttribute('data-lang')); langMenu.style.display='none'; langBtn.setAttribute('aria-expanded','false'); });
  });

  const saved=localStorage.getItem('lang')||'en';
  setLang(saved);
})();

