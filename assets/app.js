// menu (mobile-only drawer)
(function(){
  const b=document.getElementById('menuBtn'),d=document.getElementById('drawer'),k=document.getElementById('backdrop');
  if(!b||!d||!k) return;
  function show(o){d.classList.toggle('show',o);k.classList.toggle('show',o);b.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':''}
  const toggle=()=>show(!d.classList.contains('show'));
  b.addEventListener('click',toggle);
  k.addEventListener('click',()=>show(false));
  d.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>show(false)));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')show(false)});
})();

// theme: default LIGHT; respect saved choice
(function(){
  const w=document.getElementById('switch');
  const saved=localStorage.getItem('theme');
  if(saved==='dark'){
    document.body.classList.remove('light'); w.classList.remove('on'); w.setAttribute('aria-checked','false');
  }else{
    document.body.classList.add('light'); w.classList.add('on'); w.setAttribute('aria-checked','true');
  }
  function set(l){document.body.classList.toggle('light',l);w.classList.toggle('on',l);w.setAttribute('aria-checked',l?'true':'false');localStorage.setItem('theme',l?'light':'dark')}
  w.addEventListener('click',()=>set(!document.body.classList.contains('light')));
  w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();set(!document.body.classList.contains('light'))}});
})();

// typewriter EN

(function(){
  const el=document.getElementById('typewrite'); if(!el) return;
  const P=["We provide end-to-end IT solutions","We ensure your security protections","We keep your systems steady","We simplify your everyday IT","We are your trusted digital transformation partner"];
  const td=110,ed=55,hd=1600,pre=2000,glow=5000,post=2000;let pi=0,ci=0,w=true;
  function r(t){el.textContent=t;el.insertAdjacentHTML('beforeend','<span class="caret" aria-hidden="true"></span>')}
  function x(){const L=P.length-1,tx=P[pi];if(w){ci++;r(tx.slice(0,ci));if(ci===tx.length){if(pi===L){w=false;setTimeout(()=>{el.classList.add('glow');setTimeout(()=>{el.classList.remove('glow');setTimeout(()=>{x()},post)},glow)},pre);return}else{w=false;setTimeout(x,hd);return}}setTimeout(x,td)}else{ci--;r(tx.slice(0,ci));if(ci===0){w=true;pi=(pi+1)%P.length;setTimeout(x,450);return}setTimeout(x,ed)}}
  x();
})();

// reveal
(function(){
  const E=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver'in window){
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})
    },{threshold:.12});
    E.forEach(el=>io.observe(el));
  }else{E.forEach(el=>el.classList.add('show'))}
})();

// top button
(function(){
  const b=document.getElementById('toTop'); const y=420;
  function f(){ if(window.scrollY>y){b.classList.add('show')}else{b.classList.remove('show')} }
  window.addEventListener('scroll',f,{passive:true});
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  f();
})();

// WhatsApp FAB gentle nudge
(function(){
  const f=document.querySelector('.fab'); if(!f) return;
  const m=window.matchMedia('(prefers-reduced-motion: reduce)');
  function n(){ if(m.matches) return; f.classList.add('nudging'); setTimeout(()=>f.classList.remove('nudging'),1200) }
  const T=5*60*1000; setTimeout(n,T); setInterval(n,T);
})();

// mailto composer
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

// no right-click
(function(){document.addEventListener('contextmenu',e=>e.preventDefault())})();

// preloader hide
(function(){
  const pl=document.getElementById('preloader');
  function hide(){ if(!pl) return; pl.style.opacity='0'; pl.style.transition='opacity .35s ease'; setTimeout(()=>pl.style.display='none',380); }
  window.addEventListener('load', ()=> setTimeout(hide, 450));
})();

// header logo underscore on scroll
(function(){
  const THRESHOLD = 8;
  function apply(){ if(window.scrollY>THRESHOLD){document.body.classList.add('scrolled')}else{document.body.classList.remove('scrolled')} }
  window.addEventListener('scroll', apply, {passive:true});
  window.addEventListener('load', apply);
})();

// typewriter ID
(function(){
  const el=document.getElementById('typewrite-id'); if(!el) return;
  const P=["Kami menghadirkan solusi IT yang andal","Kami memastikan perlindungan keamanan Anda","Kami menjaga sistem Anda tetap stabil","Kami menyederhanakan IT harian Anda","Kami membimbing teknologi dengan penuh perhatian"];
  const td=110,ed=55,hd=1600,pre=2000,glow=5000,post=2000;let pi=0,ci=0,w=true;
  function r(t){el.textContent=t;el.insertAdjacentHTML('beforeend','<span class="caret" aria-hidden="true"></span>')}
  function loop(){const L=P.length-1,tx=P[pi];if(w){ci++;r(tx.slice(0,ci));if(ci===tx.length){if(pi===L){w=false;setTimeout(()=>{el.classList.add('glow');setTimeout(()=>{el.classList.remove('glow');setTimeout(()=>{loop()},post)},glow)},pre);return}else{w=false;setTimeout(loop,hd);return}}setTimeout(loop,td)}else{ci--;r(tx.slice(0,ci));if(ci===0){w=true;pi=(pi+1)%P.length;setTimeout(loop,450);return}setTimeout(loop,ed)}}
  loop();
})();

/* =========================
   I18N loader (content/*.txt)
   - Loads en, id, ar, fr, es, ru
   - Per-key fallback to English
   - Skips WhatsApp tooltip (local EN/ID only)
   ========================= */
(function(){
  const html=document.documentElement;
  const langBtn=document.getElementById('langBtn');
  const langMenu=document.getElementById('langMenu');
  const typeEN=document.getElementById('typewrite');
  const typeID=document.getElementById('typewrite-id');
  const waTooltip=document.getElementById('waTooltip');
  const waFab=document.getElementById('waFab');

  // in-memory dictionaries
  const I18N = {};

  function parseKV(text){
    const out={};
    text.split(/\r?\n/).forEach(line=>{
      if(!line || /^\s*#/.test(line)) return;
      const m=line.split('=');
      if(m.length<2) return;
      const key=m.shift().trim();
      const val=m.join('=').trim().replace(/\\n/g,'\n');
      if(key) out[key]=val;
    });
    return out;
  }

  async function fetchLang(lang){
    if(I18N[lang]) return I18N[lang];
    try{
      const res=await fetch(`content/${lang}.txt`, {cache:'no-store'});
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const txt=await res.text();
      I18N[lang]=parseKV(txt);
      return I18N[lang];
    }catch(err){
      console.warn(`[i18n] Failed to load ${lang}.txt:`, err);
      I18N[lang]=I18N[lang]||{};
      return I18N[lang];
    }
  }

  function t(key, lang){
    return (I18N[lang] && I18N[lang][key]) ?? (I18N.en && I18N.en[key]) ?? '';
  }

  function labelFor(lang){
    switch(lang){
      case 'id': return '🇮🇩 ID';
      case 'ar': return '🇸🇦 AR';
      case 'fr': return '🇫🇷 FR';
      case 'es': return '🇪🇸 ES';
      case 'ru': return '🇷🇺 RU';
      default: return '🇬🇧 EN';
    }
  }

  function applyLang(lang){
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang==='ar' ? 'rtl' : 'ltr');

    // Text/attr from content files (skip WhatsApp tooltip)
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      if(el.id === 'waTooltip') return; // keep tooltip local (EN/ID only)
      const key=el.getAttribute('data-i18n');
      const attr=el.getAttribute('data-i18n-attr');
      const val=t(key, lang);
      if(!val){ console.warn('[i18n] Missing key', key, 'for', lang); }
      if(attr){ el.setAttribute(attr, val); }
      else { el.innerHTML = val; }
    });

    // WhatsApp tooltip: local EN/ID only
    if(waTooltip){
      waTooltip.textContent = (lang==='id')
        ? (waTooltip.getAttribute('data-id') || 'Chat di WhatsApp')
        : (waTooltip.getAttribute('data-en') || 'Chat on WhatsApp');
    }

    // WhatsApp href still from content (falls back to EN)
    if(waFab){
      const hrefVal=t('wa.href', lang);
      if(hrefVal) waFab.setAttribute('href', hrefVal);
    }

    // Toggle which typewriter is visible
    if(typeEN && typeID){
      if(lang==='id'){ typeEN.classList.add('hidden'); typeID.classList.remove('hidden'); }
      else { typeID.classList.add('hidden'); typeEN.classList.remove('hidden'); }
    }

    // Button label
    langBtn.textContent = labelFor(lang);
  }

  async function ensureAndApply(lang){
    // Always have English as fallback
    if(!I18N.en) await fetchLang('en');
    // Load target language (fr/ru now supported)
    if(lang!=='en') await fetchLang(lang);
    applyLang(lang);
    localStorage.setItem('lang', lang);
  }

  // initial language
  const saved=localStorage.getItem('lang')||'en';
  ensureAndApply(saved);

  // open/close dropdown
  langBtn.addEventListener('click',()=>{
    const open=langMenu.style.display==='block';
    langMenu.style.display=open?'none':'block';
    langBtn.setAttribute('aria-expanded', open?'false':'true');
  });
  document.addEventListener('click',(e)=>{
    if(!e.target.closest('#langDropdown')){ langMenu.style.display='none'; langBtn.setAttribute('aria-expanded','false'); }
  });

  // choose language
  langMenu.querySelectorAll('li').forEach(li=>{
    li.addEventListener('click',()=>{
      const lang=li.getAttribute('data-lang');
      ensureAndApply(lang);
      langMenu.style.display='none';
      langBtn.setAttribute('aria-expanded','false');
    });
  });
})();
