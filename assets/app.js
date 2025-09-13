// menu (mobile-only drawer)
(function(){const b=document.getElementById('menuBtn'),d=document.getElementById('drawer'),k=document.getElementById('backdrop');if(!b||!d||!k)return;function s(o){d.classList.toggle('show',o);k.classList.toggle('show',o);b.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':''}const t=()=>s(!d.classList.contains('show'));b.addEventListener('click',t);k.addEventListener('click',()=>s(false));d.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>s(false)));window.addEventListener('keydown',e=>{if(e.key==='Escape')s(false)})})();

// theme: default LIGHT; respect saved choice
(function(){
  const w=document.getElementById('switch');
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
  function set(l){document.body.classList.toggle('light',l);w.classList.toggle('on',l);w.setAttribute('aria-checked',l?'true':'false');localStorage.setItem('theme',l?'light':'dark')}
  w.addEventListener('click',()=>set(!document.body.classList.contains('light')));
  w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();set(!document.body.classList.contains('light'))}})
})();

// type (with glow on final line + delays) [EN - original, kept]
(function(){const el=document.getElementById('typewrite');if(!el)return;const P=["We bring you a reliable IT solutions","We ensure your security protections","We keep your systems steady","We simplify your daily IT","We Guiding Technology with Care"];const td=110,ed=55,hd=1600,pre=2000,glow=5000,post=2000;let pi=0,ci=0,w=true;function r(t){el.textContent=t;el.insertAdjacentHTML('beforeend','<span class="caret" aria-hidden="true"></span>')}function x(){const L=P.length-1,tx=P[pi];if(w){ci++;r(tx.slice(0,ci));if(ci===tx.length){if(pi===L){w=false;setTimeout(()=>{el.classList.add('glow');setTimeout(()=>{el.classList.remove('glow');setTimeout(()=>{x()},post)},glow)},pre);return}else{w=false;setTimeout(x,hd);return}}setTimeout(x,td)}else{ci--;r(tx.slice(0,ci));if(ci===0){w=true;pi=(pi+1)%P.length;setTimeout(x,450);return}setTimeout(x,ed)}}x()})();

// reveal
(function(){const E=[...document.querySelectorAll('.reveal')];if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.12});E.forEach(el=>io.observe(el))}else{E.forEach(el=>el.classList.add('show'))}})();

// top
(function(){const b=document.getElementById('toTop');if(!b)return;const y=420;function f(){if(window.scrollY>y){b.classList.add('show')}else{b.classList.remove('show')}}window.addEventListener('scroll',f,{passive:true});b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));f()})();

// fab nudge
(function(){const f=document.querySelector('.fab');if(!f)return;const m=window.matchMedia('(prefers-reduced-motion: reduce)');function n(){if(m.matches)return;f.classList.add('nudging');setTimeout(()=>f.classList.remove('nudging'),1200)}const T=5*60*1000;setTimeout(n,T);setInterval(n,T)})();

// mailto composer (no insecure form post)
(function(){
  const form=document.getElementById('quoteForm');if(!form)return;
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

// preloader hide on load (with small delay for low connections)
(function(){
  const pl=document.getElementById('preloader');
  function hide(){ if(!pl) return; pl.style.opacity='0'; pl.style.transition='opacity .35s ease'; setTimeout(()=>pl.style.display='none',380); }
  window.addEventListener('load', ()=> setTimeout(hide, 450));
})();

// header logo underscore: show when scrolled, hide at top
(function(){
  const THRESHOLD = 8; // small scroll before toggling
  function apply(){
    if(window.scrollY > THRESHOLD){
      document.body.classList.add('scrolled');
    }else{
      document.body.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', apply, {passive:true});
  window.addEventListener('load', apply); // handle deep links
})();

// LANG: Indonesian typewriter (separate, non-intrusive)
(function(){
  const el=document.getElementById('typewrite-id'); if(!el) return;
  const P=["Kami menghadirkan solusi IT yang andal","Kami memastikan perlindungan keamanan Anda","Kami menjaga sistem Anda tetap stabil","Kami menyederhanakan IT harian Anda","Kami membimbing teknologi dengan penuh perhatian"];
  const td=110,ed=55,hd=1600,pre=2000,glow=5000,post=2000;let pi=0,ci=0,w=true;
  function render(t){el.textContent=t;el.insertAdjacentHTML('beforeend','<span class="caret" aria-hidden="true"></span>')}
  function loop(){const L=P.length-1,tx=P[pi];if(w){ci++;render(tx.slice(0,ci));if(ci===tx.length){if(pi===L){w=false;setTimeout(()=>{el.classList.add('glow');setTimeout(()=>{el.classList.remove('glow');setTimeout(()=>{loop()},post)},glow)},pre);return}else{w=false;setTimeout(loop,hd);return}}setTimeout(loop,td)}else{ci--;render(tx.slice(0,ci));if(ci===0){w=true;pi=(pi+1)%P.length;setTimeout(loop,450);return}setTimeout(loop,ed)}}
  loop();
})();

// LANG: Language switching (text + placeholders + hrefs) + symbols + RTL for Arabic
(function(){
  const html=document.documentElement;
  const langBtn=document.getElementById('langBtn');
  const langMenu=document.getElementById('langMenu');
  const typeEN=document.getElementById('typewrite');
  const typeID=document.getElementById('typewrite-id');
  const texts=[...document.querySelectorAll('[data-en]')];
  const attrNodes=[...document.querySelectorAll('[data-i18n-attr]')];

  // Label peta untuk tombol (ikon bendera + kode)
  const LABELS = {
    en: '🇬🇧 EN',
    id: '🇮🇩 ID',
    ar: '🇸🇦 AR',
    fr: '🇫🇷 FR',
    es: '🇪🇸 ES',
    ru: '🇷🇺 RU'
  };

  // bahasa tersedia (fallback ke 'en' bila tidak dikenali)
  const AVAILABLE = Object.keys(LABELS);

  // initial language
  let saved = localStorage.getItem('lang') || 'en';
  if(!AVAILABLE.includes(saved)) saved = 'en';
  applyLang(saved);

  // toggle menu open/close
  if(langBtn && langMenu){
    langBtn.addEventListener('click',()=> {
      const open = langMenu.style.display==='block';
      langMenu.style.display = open ? 'none' : 'block';
      langBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    document.addEventListener('click',(e)=>{
      if(!e.target.closest('#langDropdown')){ langMenu.style.display='none'; langBtn.setAttribute('aria-expanded','false'); }
    });

    // choose language (delegasi ke setiap li[data-lang])
    langMenu.querySelectorAll('li[data-lang]').forEach(li=>{
      li.addEventListener('click',()=>{
        const lang=li.getAttribute('data-lang');
        applyLang(lang);
        localStorage.setItem('lang',lang);
        // update aria-selected pada daftar
        langMenu.querySelectorAll('li[data-lang]').forEach(x=>x.setAttribute('aria-selected','false'));
        li.setAttribute('aria-selected','true');
        langMenu.style.display='none';
        langBtn.setAttribute('aria-expanded','false');
      });
    });
  }

  function applyLang(lang){
    const L = AVAILABLE.includes(lang) ? lang : 'en';

    // swap textContent berdasarkan data-{lang}
    texts.forEach(el=>{
      const v=el.getAttribute('data-'+L);
      if(v!=null) el.textContent=v;
    });

    // swap attributes (placeholder, href, dll.)
    attrNodes.forEach(el=>{
      const attr=el.getAttribute('data-i18n-attr');
      if(attr==='placeholder'){
        const v=el.getAttribute('data-'+L);
        if(v!=null) el.setAttribute('placeholder', v);
      }else if(attr==='href'){
        const v=el.getAttribute('data-'+L+'-href');
        if(v!=null) el.setAttribute('href', v);
      }
    });

    // tooltip text
    const tip=document.querySelector('.tooltip');
    if(tip){ const v=tip.getAttribute('data-'+L); if(v!=null) tip.textContent=v; }

    // typewriter visibility: ID khusus; selain itu pakai EN
    if(typeEN && typeID){
      if(L==='id'){ typeEN.classList.add('hidden'); typeID.classList.remove('hidden'); }
      else { typeID.classList.add('hidden'); typeEN.classList.remove('hidden'); }
    }

    // html lang & direction (RTL untuk Arab)
    html.setAttribute('lang', L);
    html.dir = (L === 'ar') ? 'rtl' : 'ltr';

    // label tombol
    if(langBtn) langBtn.textContent = LABELS[L] || '🌐';
  }
})();
