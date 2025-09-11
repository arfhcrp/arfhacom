/* ===========================
   Mobile menu (drawer)
=========================== */
(function(){
  const b=document.getElementById('menuBtn'),
        d=document.getElementById('drawer'),
        k=document.getElementById('backdrop');
  if(!b||!d||!k) return;
  function show(o){
    d.classList.toggle('show',o);
    k.classList.toggle('show',o);
    b.setAttribute('aria-expanded', o?'true':'false');
    document.body.style.overflow = o?'hidden':'';
  }
  const toggle = ()=>show(!d.classList.contains('show'));
  b.addEventListener('click', toggle);
  k.addEventListener('click', ()=>show(false));
  d.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>show(false)));
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') show(false) });
})();

/* ===========================
   Theme toggle
=========================== */
(function(){
  const w=document.getElementById('switch');
  if(!w) return;
  const saved=localStorage.getItem('theme'); // null => default light
  if(saved==='dark'){
    document.body.classList.remove('light');
    w.classList.remove('on');
    w.setAttribute('aria-checked','false');
  }else{
    document.body.classList.add('light');
    w.classList.add('on');
    w.setAttribute('aria-checked','true');
  }
  function set(light){
    document.body.classList.toggle('light', light);
    w.classList.toggle('on', light);
    w.setAttribute('aria-checked', light?'true':'false');
    localStorage.setItem('theme', light?'light':'dark');
  }
  w.addEventListener('click', ()=>set(!document.body.classList.contains('light')));
  w.addEventListener('keydown', e=>{
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); set(!document.body.classList.contains('light')) }
  });
})();

/* ===========================
   I18N (loads from /content/{lang}.txt)
   The .txt contains JSON (see examples)
=========================== */
const I18N = (function(){
  let dict = {};
  let lang = localStorage.getItem('lang') || 'en';

  const targetsText = [...document.querySelectorAll('[data-i18n]')];
  const targetsAttr = [...document.querySelectorAll('[data-i18n-attr]')];

  async function load(l){
    const res = await fetch(`content/${l}.txt`, {cache:'no-store'});
    const txt = await res.text();
    // file is JSON inside .txt
    dict = JSON.parse(txt);
    lang = l;
    localStorage.setItem('lang', l);
    apply();
    applyTypewriter(); // refresh hero lines
  }

  function t(key, fallback){
    const v = key.split('.').reduce((o,k)=> (o && k in o)? o[k] : undefined, dict);
    return (v==null)? (fallback ?? key) : v;
  }

  function apply(){
    // text nodes (avoid changing input/textarea content)
    targetsText.forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      // If it's an input/textarea with placeholder attr defined by data-i18n-attr, skip here
      if(el.matches('input, textarea, select')) return;
      if(val!=null) el.innerHTML = val; // innerHTML to keep <br/> in address
    });

    // attribute nodes
    targetsAttr.forEach(el=>{
      const attr = el.getAttribute('data-i18n-attr');
      const key  = el.getAttribute('data-i18n');
      const val  = t(key);
      if(val!=null) el.setAttribute(attr, val);
    });

    // update lang button
    const langBtn = document.getElementById('langBtn');
    if(langBtn) langBtn.textContent = lang==='id' ? '🇮🇩 ID' : '🇬🇧 EN';

    // <html lang>
    document.documentElement.setAttribute('lang', lang);
  }

  // public
  return {
    load, t,
    get lang(){ return lang; }
  };
})();

/* ===========================
   Language dropdown behavior
=========================== */
(function(){
  const langBtn=document.getElementById('langBtn');
  const langMenu=document.getElementById('langMenu');
  if(!langBtn || !langMenu) return;

  // init with saved language
  I18N.load(localStorage.getItem('lang') || 'en').catch(()=>{});

  langBtn.addEventListener('click',()=>{
    const open = langMenu.style.display==='block';
    langMenu.style.display = open ? 'none' : 'block';
    langBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  document.addEventListener('click',(e)=>{
    if(!e.target.closest('#langDropdown')){
      langMenu.style.display='none';
      langBtn.setAttribute('aria-expanded','false');
    }
  });
  langMenu.querySelectorAll('li').forEach(li=>{
    li.addEventListener('click',()=>{
      const lang=li.getAttribute('data-lang');
      I18N.load(lang).catch(()=>{});
      langMenu.style.display='none';
      langBtn.setAttribute('aria-expanded','false');
    });
  });
})();

/* ===========================
   Typewriter (uses i18n lines)
=========================== */
let TYPEWRITER_READY = false;
function applyTypewriter(){
  const el=document.getElementById('typewrite');
  if(!el) return;
  // Pull lines from i18n
  const P = I18N.t('typewriter.lines', [
    "We bring you a reliable IT solutions",
    "We ensure your security protections",
    "We keep your systems steady",
    "We simplify your daily IT",
    "We Guiding Technology with Care"
  ]);

  // Ensure array
  const LINES = Array.isArray(P) ? P : String(P).split('|');

  // Prevent multiple timers
  if(TYPEWRITER_READY){ return; }
  TYPEWRITER_READY = true;

  const td=110, ed=55, hd=1600, pre=2000, glow=5000, post=2000;
  let pi=0, ci=0, w=true;

  function render(t){
    el.textContent=t;
    el.insertAdjacentHTML('beforeend','<span class="caret" aria-hidden="true"></span>');
  }
  function loop(){
    const L=LINES.length-1, tx=LINES[pi];
    if(w){
      ci++; render(tx.slice(0,ci));
      if(ci===tx.length){
        if(pi===L){
          w=false;
          setTimeout(()=>{
            el.classList.add('glow');
            setTimeout(()=>{
              el.classList.remove('glow');
              setTimeout(()=>{ loop() }, post);
            }, glow);
          }, pre);
          return;
        }else{
          w=false; setTimeout(loop, hd); return;
        }
      }
      setTimeout(loop, td);
    }else{
      ci--; render(tx.slice(0,ci));
      if(ci===0){ w=true; pi=(pi+1)%LINES.length; setTimeout(loop,450); return }
      setTimeout(loop, ed);
    }
  }
  loop();
}

/* ===========================
   Reveal on scroll
=========================== */
(function(){
  const E=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target) }
      })
    },{threshold:.12});
    E.forEach(el=>io.observe(el));
  }else{
    E.forEach(el=>el.classList.add('show'));
  }
})();

/* ===========================
   Back to top button
=========================== */
(function(){
  const b=document.getElementById('toTop'); const y=420;
  function f(){ if(window.scrollY>y){ b.classList.add('show') } else { b.classList.remove('show') } }
  window.addEventListener('scroll',f,{passive:true});
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  f();
})();

/* ===========================
   FAB nudge
=========================== */
(function(){
  const f=document.querySelector('.fab'); if(!f) return;
  const m=window.matchMedia('(prefers-reduced-motion: reduce)');
  function n(){ if(m.matches) return; f.classList.add('nudging'); setTimeout(()=>f.classList.remove('nudging'),1200) }
  const T=5*60*1000; setTimeout(n,T); setInterval(n,T);
})();

/* ===========================
   Mailto composer (localized)
=========================== */
(function(){
  const form=document.getElementById('quoteForm');
  if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const fd=new FormData(form);
    const name=fd.get('name')||'', email=fd.get('email')||'';
    const company=fd.get('company')||'', project=fd.get('project')||'';
    const timeline=fd.get('timeline')||'';
    const subjectPrefix = I18N.t('mail.subject_prefix', 'Quote request from');
    const projectLabel  = I18N.t('mail.project_label', 'Project Summary');

    const subject = `${subjectPrefix} ${name}`;
    const body =
      `Name: ${name}%0D%0A`+
      `Email: ${email}%0D%0A`+
      `Company: ${company}%0D%0A`+
      `Timeline: ${timeline}%0D%0A%0D%0A`+
      `${projectLabel}:%0D%0A${encodeURIComponent(project)}`;

    window.location.href=`mailto:hello@arfhacorp.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });

  // UX: ensure project textarea stays empty for typing
  const ta=form.querySelector('textarea[name="project"]');
  if(ta){
    ta.addEventListener('focus', ()=>{
      const ph=ta.getAttribute('placeholder')||'';
      if(ta.value.trim()===ph) ta.value='';
    });
    form.addEventListener('reset', ()=>{ setTimeout(()=>{ ta.value=''; }, 0); });
  }
})();

/* ===========================
   Right-click block (keep)
=========================== */
(function(){ document.addEventListener('contextmenu', e=>e.preventDefault()); })();

/* ===========================
   Preloader hide on load
=========================== */
(function(){
  const pl=document.getElementById('preloader');
  function hide(){ if(!pl) return; pl.style.opacity='0'; pl.style.transition='opacity .35s ease'; setTimeout(()=>pl.style.display='none',380); }
  window.addEventListener('load', ()=> setTimeout(hide, 450));
})();

/* ===========================
   Header logo underscore on scroll
=========================== */
(function(){
  const THRESHOLD = 8;
  function apply(){
    if(window.scrollY > THRESHOLD){ document.body.classList.add('scrolled'); }
    else{ document.body.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', apply, {passive:true});
  window.addEventListener('load', apply);
})();
