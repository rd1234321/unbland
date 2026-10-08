// "Editorial" template. render(content) returns a complete standalone HTML page.
// Takes the same content shape as dark.js; every section is optional.

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const img = (photo, lazy = true) => photo?.src ? `<img ${lazy ? 'loading="lazy" ' : ""}src="${esc(photo.src)}" alt="${esc(photo.alt)}">` : "";
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export const PALETTES = {
  paper: { label: "Paper", bg: "#F6F2EA", surface: "#ECE6DA", text: "#1C1A17", muted: "#6B655C", line: "#CFC7B8", accent: "#B4532A" },
  slate: { label: "Slate", bg: "#F1F2F0", surface: "#E4E6E3", text: "#16191B", muted: "#5F676B", line: "#C6CBCB", accent: "#1F5E7A" }
};

export function render(c) {
  const pal = { ...PALETTES.paper, ...(typeof c.palette === "string" ? PALETTES[c.palette] : c.palette) };
  const out = [];
  let n = 0;
  const head = label => `<div class="s-head reveal"><span>No. ${pad(++n)}</span><span>${esc(label)}</span></div>`;

  if (c.facts?.length) out.push(`
  <div class="facts wrap">${c.facts.map(f => `<div class="reveal"><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join("")}</div>`);

  if (c.about) out.push(`
  <section id="about" class="wrap">${head(c.about.label || "About")}
    <div class="about">
      <div class="about-text">
        <h2 class="reveal">${esc(c.about.heading)}</h2>
        <div class="prose">${(c.about.paragraphs || []).map(p => `<p class="reveal">${esc(p)}</p>`).join("")}</div>
        ${c.about.points?.length ? `<ol class="points">${c.about.points.map((p, i) => `<li class="reveal"><span>${pad(i + 1)}</span>${esc(p)}</li>`).join("")}</ol>` : ""}
      </div>
      ${c.about.photo?.src ? `<figure class="about-img wipe">${img(c.about.photo)}${c.about.photo.caption ? `<figcaption>${esc(c.about.photo.caption)}</figcaption>` : ""}</figure>` : ""}
    </div>
  </section>`);

  if (c.items?.list?.length) out.push(`
  <section id="items" class="wrap">${head(c.items.label || "Featured")}
    <div class="split"><h2 class="reveal">${esc(c.items.heading)}</h2>${c.items.intro ? `<p class="reveal aside">${esc(c.items.intro)}</p>` : ""}</div>
    <div class="rows">
      ${c.items.list.map((it, i) => `
      <article class="row reveal">
        <span class="row-n">${pad(i + 1)}</span>
        ${it.photo?.src ? `<figure class="row-img">${img(it.photo)}</figure>` : "<span></span>"}
        <div class="row-main">
          <p class="kicker">${esc(it.kicker)}${it.badge ? ` <em>${esc(it.badge)}</em>` : ""}</p>
          <h3>${esc(it.name)}</h3>
          <p>${esc(it.description)}</p>
        </div>
        ${it.includes?.length ? `<ul class="row-list">${it.includes.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "<span></span>"}
        <b class="row-price">${esc(it.price)}</b>
      </article>`).join("")}
    </div>
  </section>`);

  if (c.steps?.list?.length) out.push(`
  <section id="process" class="wrap">${head(c.steps.label || "Process")}
    <h2 class="reveal">${esc(c.steps.heading)}</h2>
    <ol class="steps">${c.steps.list.map((s, i) => `<li class="reveal" style="--d:${i * 90}ms"><span>${ROMAN[i] || i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </section>`);

  if (c.gallery?.photos?.length) out.push(`
  <section id="work" class="wrap">${head(c.gallery.label || "Work")}
    <h2 class="reveal">${esc(c.gallery.heading)}</h2>
    <div class="gallery">${c.gallery.photos.map((p, i) => `<figure><div class="wipe">${img(p)}</div><figcaption><span>Fig. ${i + 1}</span><i>${esc(p.caption)}</i><span>${esc(p.meta)}</span></figcaption></figure>`).join("")}</div>
  </section>`);

  if (c.quotes?.length) out.push(`
  <section id="words" class="wrap">${head("In their words")}
    <div class="quotes">${c.quotes.map(q => `<blockquote class="reveal"><p>${esc(q.text)}</p><footer>${esc(q.name)}${q.detail ? `<span>${esc(q.detail)}</span>` : ""}</footer></blockquote>`).join("")}</div>
  </section>`);

  if (c.faq?.list?.length) out.push(`
  <section id="faq" class="wrap">${head(c.faq.label || "Questions")}
    <div class="split top"><h2 class="reveal">${esc(c.faq.heading)}</h2>
    <div class="faq">${c.faq.list.map(f => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div></div>
  </section>`);

  if (c.visit) out.push(`
  <section id="visit" class="wrap">${head(c.visit.label || "Visit")}
    <h2 class="reveal">${esc(c.visit.heading)}</h2>
    <div class="visit">
      <div class="reveal"><span class="cap">${esc(c.visit.placeLabel || "Location")}</span><p class="big">${(c.visit.address || []).map(esc).join("<br>")}</p>${c.visit.note ? `<p class="note">${esc(c.visit.note)}</p>` : ""}</div>
      <div class="reveal"><span class="cap">${esc(c.visit.hoursLabel || "Hours")}</span><dl>${(c.visit.hours || []).map(h => `<div><dt>${esc(h.days)}</dt><dd>${esc(h.time)}</dd></div>`).join("")}</dl></div>
    </div>
  </section>`);

  if (c.contact) out.push(`
  <section id="contact" class="wrap">${head(c.contact.label || "Contact")}
    <div class="contact">
      <div><h2 class="reveal">${esc(c.contact.heading)}</h2><p class="reveal lede">${esc(c.contact.text)}</p>
        ${c.contact.direct?.length ? `<dl class="direct reveal">${c.contact.direct.map(d => `<div><dt>${esc(d.label)}</dt><dd>${esc(d.value)}</dd></div>`).join("")}</dl>` : ""}</div>
      <form class="reveal" onsubmit="event.preventDefault();this.querySelector('button').textContent='Sent. Thank you.'">
        <label>Your name<input name="name" autocomplete="name" required></label>
        <label>Email address<input name="email" type="email" autocomplete="email" required></label>
        <label>${esc(c.contact.messageLabel || "Message")}<textarea name="message" rows="3" required></textarea></label>
        <button type="submit">${esc(c.contact.button || "Send message")} <i>→</i></button>
      </form>
    </div>
  </section>`);

  const nav = [c.items?.list?.length && ["#items", c.items.nav || "Work"], c.steps && ["#process", "Process"], c.gallery && ["#work", c.gallery.nav || "Work"], c.about && ["#about", "About"]].filter(Boolean).slice(0, 4);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.name)}${c.hero?.label ? " | " + esc(c.hero.label) : ""}</title>
<meta name="description" content="${esc(c.hero?.sub)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg:${esc(pal.bg)};--surface:${esc(pal.surface)};--text:${esc(pal.text)};--muted:${esc(pal.muted)};--line:${esc(pal.line)};--accent:${esc(pal.accent)};--serif:"Fraunces",Georgia,serif;--sans:"Inter",system-ui,sans-serif;--gut:clamp(20px,4.5vw,72px)}
*{box-sizing:border-box;margin:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font:400 17px/1.65 var(--sans);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;width:100%;height:100%;object-fit:cover}
ul,ol{list-style:none;padding:0}
.wrap{padding-left:var(--gut);padding-right:var(--gut)}
.cap,.s-head,.kicker,nav a,.mast span,.facts span,label,figcaption,dt,.steps span{font:500 12px/1.4 var(--sans);letter-spacing:.12em;text-transform:uppercase}
.link{background:linear-gradient(var(--accent),var(--accent)) left bottom/0 1px no-repeat;transition:background-size .4s cubic-bezier(.2,.7,.1,1);padding-bottom:3px}
.link:hover{background-size:100% 1px}

header{display:grid;grid-template-columns:1fr auto 1fr;align-items:baseline;padding:26px var(--gut) 20px;border-bottom:1px solid var(--text)}
.brand{font:500 26px/1 var(--serif);font-style:italic;letter-spacing:-.01em}
nav{display:flex;gap:34px}
.head-cta{justify-self:end;font:500 12px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
.mast{display:flex;justify-content:space-between;gap:24px;padding:12px var(--gut);border-bottom:1px solid var(--line);color:var(--muted)}

.hero{display:grid;grid-template-columns:repeat(12,1fr);gap:0 32px;padding:clamp(48px,7vw,104px) var(--gut) 0;align-items:end}
h1{grid-column:1/10;font:400 clamp(52px,9.4vw,164px)/.92 var(--serif);letter-spacing:-.035em;font-variation-settings:"opsz" 144;text-wrap:balance}
h1 .ln{display:block;overflow:hidden;padding-bottom:.12em;margin-bottom:-.12em}
h1 .ln>span{display:block;transform:translateY(105%);animation:rise 1s cubic-bezier(.2,.7,.1,1) forwards;animation-delay:calc(var(--i)*120ms + 100ms)}
h1 em{font-style:italic;color:var(--accent)}
@keyframes rise{to{transform:none}}
.hero-side{grid-column:10/13;padding-bottom:14px}
.hero-side p{color:var(--muted);margin-bottom:22px}
.btn{display:inline-flex;gap:12px;align-items:center;background:var(--accent);color:var(--bg);font:600 13px var(--sans);letter-spacing:.1em;text-transform:uppercase;padding:16px 22px;border-radius:2px}
.btn i,button i{font-style:normal;transition:transform .25s}
.btn:hover i,button:hover i{transform:translateX(5px)}
.hero-img{grid-column:1/13;margin:clamp(40px,5vw,72px) calc(-1*var(--gut)) 0;aspect-ratio:21/9;overflow:hidden}
.hero-img img{animation:wipein 1.3s cubic-bezier(.2,.7,.1,1) .35s both}
@keyframes wipein{from{clip-path:inset(100% 0 0 0);transform:scale(1.12)}to{clip-path:inset(0);transform:none}}
.hero-cap{grid-column:1/13;display:flex;justify-content:space-between;gap:24px;padding:12px 0 0;color:var(--muted);font:italic 400 15px var(--serif)}

.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin-top:clamp(48px,6vw,88px);border-top:1px solid var(--text);border-bottom:1px solid var(--line)}
.facts div{padding:28px 24px 28px 0;border-right:1px solid var(--line);margin-right:24px}
.facts div:last-child{border-right:0;margin-right:0}
.facts b{display:block;font:400 clamp(40px,4.6vw,68px)/1 var(--serif);letter-spacing:-.03em}
.facts span{display:block;color:var(--muted);margin-top:10px}

section{padding-top:clamp(72px,9vw,136px);padding-bottom:clamp(8px,1vw,16px)}
.s-head{display:flex;justify-content:space-between;border-top:1px solid var(--text);padding-top:14px;margin-bottom:clamp(36px,5vw,72px);color:var(--muted)}
.s-head span:first-child{color:var(--accent)}
h2{font:400 clamp(38px,5.6vw,88px)/.98 var(--serif);letter-spacing:-.03em;max-width:15ch;margin-bottom:clamp(32px,4vw,56px);font-variation-settings:"opsz" 144}
h3{font:400 28px/1.1 var(--serif);letter-spacing:-.02em}
.split{display:grid;grid-template-columns:7fr 5fr;gap:48px;align-items:end}
.split.top{align-items:start}
.aside{color:var(--muted);max-width:40ch;margin-bottom:clamp(32px,4vw,56px)}

.about{display:grid;grid-template-columns:7fr 5fr;gap:clamp(32px,6vw,96px);align-items:start}
.prose{columns:2;column-gap:36px;color:var(--muted)}
.prose p{break-inside:avoid;margin-bottom:18px}
.prose p:first-child::first-letter{font:400 4.2em/.8 var(--serif);float:left;padding:6px 10px 0 0;color:var(--text)}
.points{margin-top:28px;border-top:1px solid var(--line)}
.points li{display:flex;gap:22px;align-items:baseline;border-bottom:1px solid var(--line);padding:16px 0;font:400 21px var(--serif)}
.points span{font:500 12px var(--sans);letter-spacing:.12em;color:var(--accent)}
.about-img{aspect-ratio:4/5;position:relative;margin-right:calc(-1*var(--gut))}
.about-img figcaption{position:absolute;left:0;bottom:24px;background:var(--bg);color:var(--text);padding:10px 16px}

.rows{border-top:1px solid var(--text)}
.row{display:grid;grid-template-columns:48px 180px 5fr 4fr auto;gap:32px;align-items:center;padding:28px 0;border-bottom:1px solid var(--line);transition:background .3s,padding .3s}
.row:hover{background:var(--surface);padding-left:16px;padding-right:16px}
.row-n{font:500 12px var(--sans);letter-spacing:.12em;color:var(--muted)}
.row-img{aspect-ratio:4/3;overflow:hidden}
.row-img img{transition:transform .8s cubic-bezier(.2,.7,.1,1)}
.row:hover .row-img img{transform:scale(1.06)}
.kicker{color:var(--muted);margin-bottom:8px}
.kicker em{font-style:normal;color:var(--accent);margin-left:10px}
.row h3{font-size:clamp(30px,3.2vw,46px);margin-bottom:8px}
.row-main p:last-child{color:var(--muted);font-size:16px;max-width:36ch}
.row-list li{font-size:15px;padding:6px 0;border-bottom:1px dotted var(--line)}
.row-list li:last-child{border-bottom:0}
.row-price{font:400 clamp(26px,2.6vw,38px)/1 var(--serif);letter-spacing:-.02em;white-space:nowrap;justify-self:end}

.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:0 32px}
.steps li{border-top:1px solid var(--text);padding-top:18px;transition-delay:var(--d)}
.steps span{font:italic 400 40px/1 var(--serif);letter-spacing:0;text-transform:none;color:var(--accent);display:block;margin-bottom:28px}
.steps h3{margin-bottom:10px}
.steps p{color:var(--muted);font-size:16px}

.gallery{display:grid;grid-template-columns:repeat(12,1fr);gap:40px 32px;align-items:end}
.gallery figure{grid-column:span 4}
.gallery figure>div{aspect-ratio:4/5;overflow:hidden}
.gallery figure:nth-child(4n+1){grid-column:span 7}
.gallery figure:nth-child(4n+1)>div{aspect-ratio:3/2}
.gallery figure:nth-child(4n+2){grid-column:span 5}
.gallery figure:nth-child(4n+3){grid-column:2/span 4}
.gallery figure:nth-child(4n+4){grid-column:span 7}
.gallery figure:nth-child(4n+4)>div{aspect-ratio:3/2}
figcaption{display:flex;gap:18px;justify-content:space-between;padding-top:12px;color:var(--muted)}
figcaption i{font:italic 400 16px var(--serif);letter-spacing:0;text-transform:none;color:var(--text);flex:1}

.quotes{display:grid;gap:clamp(40px,5vw,72px)}
blockquote{max-width:22ch;font:italic 400 clamp(32px,4.6vw,68px)/1.06 var(--serif);letter-spacing:-.025em;max-width:none}
blockquote p{max-width:24ch}
blockquote:nth-child(even){justify-self:end;text-align:right}
blockquote:nth-child(even) p{margin-left:auto}
blockquote footer{font:500 12px var(--sans);font-style:normal;letter-spacing:.12em;text-transform:uppercase;margin-top:24px;color:var(--text)}
blockquote footer span{color:var(--muted);margin-left:14px}

details{border-bottom:1px solid var(--line);padding:22px 0}
details:first-child{border-top:1px solid var(--text)}
summary{font:400 24px/1.2 var(--serif);cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:24px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font:300 28px/1 var(--sans);color:var(--accent)}
details[open] summary::after{content:"–"}
details p{color:var(--muted);margin-top:12px;max-width:56ch}

.visit{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,96px)}
.cap{display:block;color:var(--muted);margin-bottom:16px}
.big{font:400 clamp(26px,2.8vw,40px)/1.2 var(--serif);letter-spacing:-.02em}
.note{color:var(--muted);margin-top:16px;max-width:38ch;font:italic 400 17px var(--serif)}
dl div{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line);padding:14px 0}
dl div:first-child{border-top:1px solid var(--text)}
dt{color:var(--muted)}
dd{font:400 19px var(--serif)}

.contact{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,96px);align-items:start}
.contact h2{margin-bottom:24px}
.lede{color:var(--muted);max-width:40ch;margin-bottom:32px}
form{display:grid;gap:28px}
label{display:grid;gap:8px;color:var(--muted)}
input,textarea{background:none;border:0;border-bottom:1px solid var(--text);color:var(--text);font:400 20px var(--serif);padding:8px 0;border-radius:0;resize:vertical}
input:focus,textarea:focus{outline:0;border-color:var(--accent)}
button{justify-self:start;display:inline-flex;gap:12px;background:var(--accent);color:var(--bg);border:0;font:600 13px var(--sans);letter-spacing:.1em;text-transform:uppercase;padding:17px 24px;border-radius:2px;cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:4px}

.closer{display:block;margin-top:clamp(72px,9vw,136px);padding:clamp(48px,7vw,112px) var(--gut);border-top:1px solid var(--text);font:italic 400 clamp(56px,12vw,208px)/.9 var(--serif);letter-spacing:-.04em;transition:color .3s}
.closer:hover{color:var(--accent)}
.closer small{display:block;font:500 12px var(--sans);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:22px}
.closer b{font-weight:400;display:inline-block;transition:transform .4s cubic-bezier(.2,.7,.1,1)}
.closer:hover b{transform:translateX(.15em)}
body>footer{display:flex;justify-content:space-between;gap:24px;padding:22px var(--gut) 32px;border-top:1px solid var(--line);color:var(--muted);font-size:14px}

.js .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease-out,transform .7s cubic-bezier(.2,.7,.1,1)}
.js .reveal.in{opacity:1;transform:none}
.wipe{overflow:hidden}
.wipe img{transition:clip-path 1.1s cubic-bezier(.2,.7,.1,1),transform 1.4s cubic-bezier(.2,.7,.1,1)}
.js .wipe img{clip-path:inset(100% 0 0 0);transform:scale(1.12);transition:clip-path 1.1s cubic-bezier(.2,.7,.1,1),transform 1.4s cubic-bezier(.2,.7,.1,1)}
.js .wipe.in img{clip-path:inset(0);transform:none}
@media(max-width:900px){
  header{grid-template-columns:1fr auto}
  nav{display:none}
  .mast span:nth-child(n+3){display:none}
  .hero{display:block}
  .hero-side{padding-top:24px}
  .hero-img{aspect-ratio:4/3}
  .split,.about,.visit,.contact{grid-template-columns:1fr;gap:28px}
  .prose{columns:1}
  .about-img{margin-right:0;aspect-ratio:4/3}
  .facts{grid-template-columns:1fr 1fr}
  .facts div{margin-right:0;padding-right:16px}
  .facts div:nth-child(2n){border-right:0;padding-left:16px}
  .facts div:nth-child(n+3){border-top:1px solid var(--line)}
  .row{grid-template-columns:1fr auto;gap:14px 20px;align-items:start}
  .row:hover{padding-left:0;padding-right:0;background:none}
  .row-n{display:none}
  .row-img{grid-column:1/3}
  .row-list{grid-column:1/3}
  .row-price{grid-row:2;grid-column:2}
  .gallery{gap:28px}
  .gallery figure,.gallery figure:nth-child(n){grid-column:span 12}
  .gallery figure>div,.gallery figure:nth-child(n)>div{aspect-ratio:4/3}
  blockquote:nth-child(even){text-align:left;justify-self:start}
  blockquote:nth-child(even) p{margin-left:0}
  .steps li{margin-bottom:32px}
  body>footer{flex-direction:column;gap:6px}
}
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  h1 .ln>span{animation:none;transform:none}
  .hero-img img{animation:none}
  .reveal{opacity:1;transform:none;transition:none}
  .wipe img{clip-path:none;transform:none;transition:none}
}
</style>
</head>
<body>
<header>
  <a class="brand" href="#top">${esc(c.name)}</a>
  <nav>${nav.map(([h, t]) => `<a class="link" href="${h}">${esc(t)}</a>`).join("")}</nav>
  ${c.contact ? `<a class="head-cta link" href="#contact">${esc(c.contact.nav || "Say hello")} →</a>` : "<span></span>"}
</header>
${c.hero.meta?.length ? `<div class="mast"><span>${esc(c.hero.label)}</span>${c.hero.meta.map(m => `<span>${esc(m)}</span>`).join("")}</div>` : ""}
<main id="top">
  <div class="hero">
    <h1>${headline(c.hero.heading)}</h1>
    <div class="hero-side"><p>${esc(c.hero.sub)}</p>${c.contact ? `<a class="btn" href="#contact">${esc(c.contact.nav || "Get in touch")} <i>→</i></a>` : ""}</div>
    ${c.hero.photo?.src ? `<figure class="hero-img">${img(c.hero.photo, false)}</figure><p class="hero-cap"><span>${esc(c.hero.photo.alt)}</span><span>${esc(c.hero.label)}</span></p>` : ""}
  </div>
  ${out.join("")}
  ${c.contact ? `<a class="closer" href="#contact"><small>${esc(c.closer?.label || "Ready when you are")}</small>${esc(c.closer?.text || c.contact.nav || "Get in touch")} <b>→</b></a>` : ""}
</main>
<footer><span>${esc(c.name)} © ${new Date().getFullYear()}</span><span>${esc(c.footer || "")}</span><a class="link" href="#top">Back to top ↑</a></footer>
<script>
(() => {
  document.documentElement.classList.add("js");
  const pending = new Set(document.querySelectorAll(".reveal,.wipe"));
  const show = () => { for (const el of pending) { const r = el.getBoundingClientRect(); if (r.top < innerHeight * .92 && r.bottom > 0) { el.classList.add("in"); pending.delete(el); } } };
  addEventListener("scroll", show, { passive: true }); addEventListener("resize", show); addEventListener("load", show);
  show(); setTimeout(show, 400);
})();
</script>
</body>
</html>`;
}

// Splits the headline into sentences, one per line, and sets the last one in accent italics.
function headline(text) {
  const parts = String(text ?? "").match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) || [];
  return parts.map((p, i) => `<span class="ln"><span style="--i:${i}">${i === parts.length - 1 && parts.length > 1 ? `<em>${esc(p)}</em>` : esc(p)}</span></span>`).join("");
}
