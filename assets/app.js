// Load language text from content files
async function loadLanguage(lang) {
  const res = await fetch(`content/${lang}.txt`);
  const text = await res.text();
  const lines = text.split("\n").map(l => l.trim());

  // Example mapping IDs
  document.getElementById("text-loading").textContent = lines[0];
  document.querySelector(".subtag").textContent = lines[1];
  document.getElementById("nav-home").textContent = lines[2];
  document.getElementById("nav-about").textContent = lines[3];
  document.getElementById("nav-services").textContent = lines[4];
  document.getElementById("nav-testimonials").textContent = lines[5];
  document.getElementById("nav-pastwork").textContent = lines[6];
  document.getElementById("nav-quote").textContent = lines[7];
  document.getElementById("nav-contact").textContent = lines[8];
  // Continue mapping for all texts
}
