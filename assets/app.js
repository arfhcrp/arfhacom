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

// Banner: WE <kata bergerak 1> YOUR <kata bergerak 2>
//   - "WE" (lede) dan "YOUR" (kata tetap tengah) tidak bergerak dan tidak kena efek
//     ketik/hapus selama siklus; warnanya warna teks banner.
//   - Hanya dua kata bergerak yang diketik maju lalu dihapus mundur, dan hanya keduanya
//     berwarna hijau merek; saat frasa lengkap keduanya menyala sedikit lebih terang.
//   - Setelah pasangan terakhir: semuanya dihapus mundur sampai menyisakan "WE", lalu diketik
//     kalimat penutup TAHAN 5 detik, lalu dihapus mundur lagi sampai "WE" dan rotasi diulang.
//     Di kalimat penutup, "WE" ikut hijau dan bagian-bagian yang ditandai * di berkas teks
//     juga hijau (mis. WE ARE hijau - your putih - TRUSTED hijau - partners putih).
// Teks per bahasa dari content/<lang>.txt: hero.lede, hero.mid, hero.cycle1..N, hero.final
//
// Kokoh: semua kelanjutan lewat nanti(g,...) yang memeriksa generasi SAAT TIMER MENYALA, jadi
// mesin lama (mis. habis ganti bahasa) tidak bisa lagi menyentuh DOM -> tak ada tulisan beku.
(function(){
  var el=document.getElementById('typewrite');
  if(!el) return;
  var lede=document.getElementById('twLede'), v=document.getElementById('twV'),
      mid=document.getElementById('twMid'), n=document.getElementById('twN'),
      buntut=document.getElementById('twTail'),
      akhir=document.getElementById('twFinal'), caret=el.querySelector('.caret');
  if(!v||!mid||!n||!buntut||!akhir) return;
  var gen=0, timers=[];
  var td=85, ed=34, jedaKata=320, jedaFrasa=1800, tahanPenutup=5000, jedaUlang=560;

  function nanti(g,fn,ms){ var id=setTimeout(function(){ if(g!==gen) return; fn() }, ms||0); timers.push(id) }
  function tulis(e,t){ if(e) e.textContent=t }
  function sorot(a){ if(caret&&a) a.insertAdjacentElement('afterend',caret) }
  function berhenti(){ gen++; timers.forEach(clearTimeout); timers=[]; el.classList.remove('tw-sorot','tw-penutup') }

  function data(t){
    var out={lede:'We', mid:'Your', tail:'', final:[{t:'are',k:1},{t:'your',k:0},{t:'trusted',k:1},{t:'partners',k:0}], daftar:[]};
    if(t){
      var l=t('hero.lede'), m=t('hero.mid'), tl=t('hero.tail'), f=t('hero.final');
      if(typeof l==='string') out.lede=l;
      if(typeof m==='string') out.mid=m;
      if(typeof tl==='string') out.tail=tl;
      if(f){
        var bagian=String(f).split('|').map(function(s){ s=s.trim(); return {t:s.replace(/^\*/,''), k:s.charAt(0)==='*'?1:0} })
                                 .filter(function(b){ return b.t.length });
        if(bagian.length) out.final=bagian;
      }
      for(var i=1;i<=12;i++){
        var baris=t('hero.cycle'+i); if(!baris) break;
        var bagi=String(baris).split('|').map(function(s){ return s.trim() });
        if(bagi[0]&&bagi[1]) out.daftar.push([bagi[0],bagi[1]]);
      }
    }
    if(!out.daftar.length) out.daftar=[['Help','IT'],['Secure','Data']];
    return out;
  }

  // bangun ulang bagian kalimat penutup sesuai bahasa aktif (spannya dibuat di sini)
  function siapkanBagian(d){
    while(akhir.firstChild) akhir.removeChild(akhir.firstChild);
    var arr=[];
    d.final.forEach(function(b){
      var sp=document.createElement('span');
      if(b.k) sp.className='tw-kunci';
      if(arr.length) akhir.appendChild(document.createTextNode(' '));   // pemisah antar bagian
      akhir.appendChild(sp);
      arr.push(sp);
    });
    return arr;
  }

  function mulai(t){
    berhenti();
    var g=gen, d=data(t), i=0, akhirPasangan=d.daftar.length-1;
    var bagian=siapkanBagian(d);
    tulis(lede,d.lede); tulis(mid,d.mid); tulis(buntut,d.tail);

    function ketik(e,teks,selesai){
      tulis(e,''); sorot(e);
      var c=0, s=String(teks);
      (function maju(){ if(g!==gen) return;
        c++; tulis(e,s.slice(0,c));
        if(c>=s.length){ nanti(g,selesai,0); return }
        nanti(g,maju,td) })();
    }
    function hapus(e,selesai){
      sorot(e); var s=String(e.textContent||'');
      (function mundur(){ if(g!==gen) return;
        s=s.slice(0,-1); tulis(e,s);
        if(!s.length){ nanti(g,selesai,0); return }
        nanti(g,mundur,ed) })();
    }
    function ketikBagian(idx,selesai){
      if(idx>=d.final.length){ selesai(); return }
      ketik(bagian[idx],d.final[idx].t,function(){ nanti(g,function(){ ketikBagian(idx+1,selesai) },120) });
    }
    function hapusBagian(idx,selesai){
      if(idx<0){ selesai(); return }
      hapus(bagian[idx],function(){ nanti(g,function(){ hapusBagian(idx-1,selesai) },0) });
    }
    // semua yang di belakang "WE" dihapus mundur (benda -> penambat belakang -> penambat tengah -> kata kerja)
    function bersihkanSampaiWe(lanjut){
      hapus(n,function(){ nanti(g,function(){
        hapus(buntut,function(){ nanti(g,function(){
          hapus(mid,function(){ nanti(g,function(){
            hapus(v,function(){ nanti(g,lanjut,jedaKata) });
          }, 0) });
        }, 0) });
      }, 0) });
    }

    function penutup(){
      bersihkanSampaiWe(function(){                      // tersisa "WE" saja
        el.classList.add('tw-penutup');                  // "WE" ikut hijau
        ketikBagian(0,function(){ nanti(g,function(){
          nanti(g,function(){                            // TAHAN 5 detik
            hapusBagian(bagian.length-1,function(){ nanti(g,function(){
              el.classList.remove('tw-penutup');         // "WE" kembali putih
              tulis(mid,d.mid); tulis(buntut,d.tail); i=0;
              nanti(g,putaran,jedaUlang);
            }, jedaKata) });
          }, tahanPenutup);
        }, 240) });
      });
    }

    function putaran(){
      if(g!==gen) return;
      var p=d.daftar[i];
      tulis(mid,d.mid);                     // kata tetap "YOUR" selalu di tempatnya
      sorot(v);
      ketik(v,p[0],function(){ nanti(g,function(){          // kata bergerak 1
        ketik(n,p[1],function(){ nanti(g,function(){        // kata bergerak 2 -> frasa lengkap
          el.classList.add('tw-sorot');                      // kata kunci menyala terang
          nanti(g,function(){
            el.classList.remove('tw-sorot');
            hapus(n,function(){ nanti(g,function(){
              hapus(v,function(){ nanti(g,function(){
                if(i<akhirPasangan){ i++; nanti(g,putaran,jedaUlang) }
                else penutup();                          // pasangan terakhir -> kalimat penutup
              }, jedaUlang) });
            }, 0) });
          }, jedaFrasa);
        }, jedaKata) });
      }, jedaKata) });
    }

    nanti(g,putaran,400);
  }

  window.__bannerMulai=mulai;   // dipanggil ulang tiap ganti bahasa
  mulai(null);                  // teks awal sampai i18n siap
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
    // email TIDAK dimasukkan ke isi pesan: alamat pengirim diambil otomatis oleh
    // aplikasi email user (mailto: tidak boleh menetapkan header From, lihat RFC 6068)
    const nl='%0D%0A';
    const body='Name: '+encodeURIComponent(name)+nl
      +'Company: '+encodeURIComponent(company)+nl
      +'Timeline: '+encodeURIComponent(timeline)+nl+nl
      +'Project Summary:'+nl+encodeURIComponent(project);
    window.location.href=`mailto:hello@arfhacorp.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
})();

// no right-click
(function(){document.addEventListener('contextmenu',e=>e.preventDefault())})();

// preloader: garis progres + catatan loading + persentase
(function(){
  const pl=document.getElementById('preloader'); if(!pl) return;
  const isi=pl.querySelector('.pl-line i'), pct=pl.querySelector('.pl-pct');
  const T=1400;   // performance.now() dihitung dari awal navigasi, jadi progres ikut sejak halaman mulai dimuat
  let muat=null, selesai=false;
  const lancar=t=>1-Math.pow(1-t,2.2);
  function sembunyi(){
    pl.style.opacity='0'; pl.style.transition='opacity .35s ease';
    setTimeout(function(){ pl.style.display='none'; },380);
  }
  function langkah(){
    const kini=performance.now(); let p;
    if(muat===null){ p=lancar(Math.min(1,kini/T))*0.92; }        // sebelum load: sampai 92%
    else { p=0.92+0.08*Math.min(1,(kini-muat)/260); }            // sesudah load: tuntaskan ke 100%
    if(isi) isi.style.transform='scaleX('+p.toFixed(4)+')';
    if(pct) pct.textContent=Math.round(p*100)+'%';
    if(p>=1){ if(!selesai){ selesai=true; setTimeout(sembunyi,200); } return; }
    requestAnimationFrame(langkah);
  }
  window.addEventListener('load', function(){ if(muat===null) muat=performance.now(); });
  requestAnimationFrame(langkah);
})();

// header logo underscore on scroll
(function(){
  const THRESHOLD = 8;
  function apply(){ if(window.scrollY>THRESHOLD){document.body.classList.add('scrolled')}else{document.body.classList.remove('scrolled')} }
  window.addEventListener('scroll', apply, {passive:true});
  window.addEventListener('load', apply);
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

    // Mesin tik banner: mulai ulang dengan teks bahasa yang aktif
    if(window.__bannerMulai){ window.__bannerMulai(function(key){ return t(key, lang) }); }

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

// scroll progress + active nav (desain baru)
(function(){
  var bar=document.getElementById('progress');
  var nav=[].slice.call(document.querySelectorAll('.mainnav a'));
  function prog(){
    var h=document.documentElement, max=h.scrollHeight-window.innerHeight;
    var y=window.pageYOffset||h.scrollTop||0;
    var p=max>0?Math.min(1,Math.max(0,y/max)):0;
    if(bar) bar.style.transform='scaleX('+p.toFixed(4)+')';
  }
  function act(){
    var y=window.innerHeight*0.35, cur=null;
    nav.forEach(function(a){
      var id=a.getAttribute('href');
      if(!id||id.charAt(0)!=='#') return;
      var s=document.querySelector(id);
      if(s && s.getBoundingClientRect().top<=y) cur=id;
    });
    nav.forEach(function(a){ a.classList.toggle('is-active', a.getAttribute('href')===cur); });
  }
  function on(){ prog(); act(); }
  window.addEventListener('scroll', on, {passive:true});
  window.addEventListener('resize', on);
  window.addEventListener('load', on);
  on();
})();

// animasi gulir (kepala bagian + anak berurutan) pakai IntersectionObserver, tanpa library
(function(){
  var target=[];
  document.querySelectorAll('.sec-head').forEach(function(el){target.push(el)});
  ['.cards3','.svc-grid','.contact-grid','.quote-grid','.foot'].forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){el.classList.add('stagger');target.push(el)});
  });
  if(!('IntersectionObserver' in window)){target.forEach(function(el){el.classList.add('in')});return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  target.forEach(function(el){io.observe(el)});
})();

// tandai halaman siap: memicu animasi hero (panel, grafik, batang)
(function(){
  function go(){document.body.classList.add('loaded')}
  if(document.readyState==='complete'){setTimeout(go,120)}else{window.addEventListener('load',function(){setTimeout(go,120)})}
})();

// (kartu layanan tidak lagi memakai sorotan yang mengikuti kursor: lapisan itu
// menutupi pola latar ikon sehingga polanya tampak berubah saat kartu disorot)

// titik data di banner: tiap titik berkedip sendiri (bukan satu blok), pause saat banner tak terlihat
(function(){
  var wrap=document.querySelector('.hero-leds'); if(!wrap) return;
  // lapisan menutupi seluruh pita banner; ukuran & pemantauan pakai induknya (.hero)
  var hero=wrap.parentElement || document.querySelector('.hero');
  var redusir=window.matchMedia('(prefers-reduced-motion: reduce)');
  var TILE_W=228, TILE_H=168, CW=12, CH=24;      // CW/CH = satu sel angka (228/19 x 168/7)
  function bikin(){
    if(redusir.matches) return;
    var w=hero.clientWidth, h=hero.clientHeight; if(!w||!h) return;
    var jumlah=Math.max(26, Math.min(120, Math.round(w*h/7000)));
    var frag=document.createDocumentFragment();
    for(var n=0;n<jumlah;n++){
      var i=document.createElement('i');
      var x=Math.round(Math.random()*(w-CW)/CW)*CW;   // snap ke kolom angka
      var y=Math.round(Math.random()*(h-CH)/CH)*CH;   // snap ke baris angka
      i.style.cssText='left:'+x+'px;top:'+y+'px;width:'+CW+'px;height:'+CH+'px;'
        +'background-position:'+(-(x%TILE_W))+'px '+(-(y%TILE_H))+'px;'
        +'--dur:'+(6+Math.random()*10).toFixed(2)+'s;'
        +'--delay:'+(-(Math.random()*16).toFixed(2))+'s';
      frag.appendChild(i);
    }
    wrap.appendChild(frag);
  }
  bikin();
  var tampak=false;
  function main(){ wrap.classList.remove('paused'); }
  function jeda(){ wrap.classList.add('paused'); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){ tampak=e.isIntersecting; tampak ? main() : jeda(); });
    },{threshold:0.06}).observe(hero);
  }
  document.addEventListener('visibilitychange', function(){ document.hidden ? jeda() : (tampak && main()); });
})();

// bismillah: efek ketik dari kanan ke kiri (RTL), sekali per kemunculan, tidak diulang
(function(){
  var el=document.querySelector('.bismillah-ar'); if(!el) return;
  var redusir=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var LANGKAH=34, DURASI=3000;   // 34 potongan huruf, total 3 detik → lambat
  var raf=null, tampak=false;
  function tulis(f){ el.style.setProperty('--reveal',(100-f*100).toFixed(3)+'%'); }
  function batal(){ if(raf){ cancelAnimationFrame(raf); raf=null } }
  function mulai(){
    batal();
    if(redusir && redusir.matches){ el.classList.remove('rtl-type'); tulis(1); return; }
    el.classList.add('rtl-type'); tulis(0);
    var t0=null;
    function frame(t){
      if(t0===null) t0=t;
      var p=(t-t0)/DURASI; if(p>1) p=1;
      tulis(Math.floor(p*LANGKAH)/LANGKAH);   // maju per huruf, bukan mengalir rata
      if(p<1){ raf=requestAnimationFrame(frame) }
      else { raf=null; el.classList.remove('rtl-type'); tulis(1); }
    }
    raf=requestAnimationFrame(frame);
  }
  function sembunyi(){ batal(); el.classList.add('rtl-type'); tulis(0); }
  if(!('IntersectionObserver' in window)){ el.classList.remove('rtl-type'); tulis(1); return; }
  sembunyi();   // kondisi awal: belum terlihat → belum ada huruf
  // diamati = pembungkus .bismillah, bukan elemen teksnya: elemen yang di-clip-path
  // dilaporkan tidak berpotongan oleh IntersectionObserver (ratio 0) → animasi tak pernah mulai
  var pemicu=el.parentElement||el;
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ if(!tampak){ tampak=true; mulai() } }   // masuk viewport → ketik ulang dari kanan
      else if(tampak){ tampak=false; sembunyi() }                   // keluar viewport → reset, siap ketik lagi
    });
  },{threshold:.8}).observe(pemicu);
})();

// testimoni: penggeser satu kutipan per layar (pola referensi)
// titik & panah diisi dari sini supaya markup tetap ringkas; isi kutipan tetap dari content/*.txt
(function(){
  var track=document.getElementById('tstTrack'); if(!track) return;
  var slides=[].slice.call(track.querySelectorAll('.quote'));
  if(slides.length<2) return;
  var dotsBox=document.getElementById('tstDots');
  var prev=document.getElementById('tstPrev'), next=document.getElementById('tstNext');
  var redusir=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var aktif=0, jam=null, JEDA=12000;   // jeda ganti kutipan (sebelumnya 7 dtk, dibuat lebih lama)

  var dots=slides.map(function(s,n){
    var b=document.createElement('button');
    b.type='button'; b.className='tst-dot';
    b.setAttribute('aria-label','Testimonial '+(n+1));
    b.addEventListener('click',function(){ ke(n,true) });
    if(dotsBox) dotsBox.appendChild(b);
    return b;
  });

  function tandai(n){
    aktif=n;
    dots.forEach(function(d,k){
      d.classList.toggle('active',k===n);
      d.setAttribute('aria-current',k===n?'true':'false');
    });
  }
  function ke(n,manual){
    n=(n+slides.length)%slides.length;
    tandai(n);
    var s=slides[n]; if(!s) return;
    // geser LANGSUNG di dalam trek (scrollBy), bukan scrollIntoView:
    // scrollIntoView ikut menggulir HALAMAN ke bagian testimoni tiap 7 detik.
    // Delta dihitung dari selisih kotak (bukan offsetLeft) supaya arah RTL benar.
    var delta=Math.round(s.getBoundingClientRect().left - track.getBoundingClientRect().left);
    var opsi={left:delta,behavior:(redusir&&redusir.matches)?'auto':'smooth'};
    if(track.scrollBy){ track.scrollBy(opsi) } else { track.scrollLeft=track.scrollLeft+delta }
    if(manual) mulai();
  }
  function mulai(){ if(redusir&&redusir.matches) return; henti(); jam=setInterval(function(){ ke(aktif+1) },JEDA); }
  function henti(){ if(jam){ clearInterval(jam); jam=null } }

  // geser manual (swipe/scroll) tetap memperbarui titik aktif
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ var n=slides.indexOf(e.target); if(n>-1) tandai(n) } });
    },{root:track,threshold:.6});
    slides.forEach(function(s){ io.observe(s) });
  }
  track.addEventListener('mouseenter',henti);
  track.addEventListener('mouseleave',mulai);
  track.addEventListener('focusin',henti);
  track.addEventListener('focusout',mulai);
  document.addEventListener('visibilitychange',function(){ document.hidden?henti():mulai() });
  if(prev) prev.addEventListener('click',function(){ ke(aktif-1,true) });
  if(next) next.addEventListener('click',function(){ ke(aktif+1,true) });
  tandai(0);
  mulai();
})();
