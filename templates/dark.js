// "Dark and kinetic" template. render(content) returns a complete standalone HTML page.
// Every section is optional; a section is left out when its content is missing.

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const words = text => esc(text).split(/\s+/).filter(Boolean).map((w, i) => `<span class="w"><span style="--i:${i}">${w}</span></span>`).join(" ");
const img = (photo, cls = "") => photo?.src ? `<img class="${cls}" loading="lazy" src="${esc(photo.src)}" alt="${esc(photo.alt)}">` : "";
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")";

// Colour schemes for this template. Each keeps the same layout and motion.
export const PALETTES = {
  glacier:  { label: "Glacier",  bg: "#090D10", surface: "#111920", text: "#EAF1F4", muted: "#8C9BA5", line: "#22303A", accent: "#7FE7F2" },
  volt:     { label: "Volt",     bg: "#0B0B0C", surface: "#151517", text: "#F2F0EB", muted: "#9B988F", line: "#2A2A2D", accent: "#E8FF47" },
  ember:    { label: "Ember",    bg: "#0F0B09", surface: "#1A1411", text: "#F6EEE4", muted: "#A3978A", line: "#2E2520", accent: "#FF5A1F" },
  crimson:  { label: "Crimson",  bg: "#0A0A0A", surface: "#161616", text: "#F4F4F2", muted: "#9A9A96", line: "#2B2B2B", accent: "#F0282D" },
  forest:   { label: "Forest",   bg: "#0A0F0C", surface: "#121A15", text: "#EFEDE4", muted: "#94A096", line: "#243028", accent: "#E9B949" },
  mono:     { label: "Mono",     bg: "#0C0C0C", surface: "#171717", text: "#F5F5F5", muted: "#9C9C9C", line: "#2C2C2C", accent: "#FFFFFF" }
};

export function render(c) {
  const pal = { ...PALETTES.glacier, ...(typeof c.palette === "string" ? PALETTES[c.palette] : c.palette) };
  const out = [];
  let n = 0;
  const head = (label, title) => `<div class="s-head"><span class="num">${pad(++n)}</span><span class="tag">${esc(label)}</span></div>${title ? `<h2 class="reveal">${esc(title)}</h2>` : ""}`;

  if (c.facts?.length) out.push(`
  <div class="facts">${c.facts.map(f => `<div class="reveal"><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join("")}</div>`);

  if (c.about) out.push(`
  <section id="about">${head(c.about.label || "About")}
    <div class="about">
      <figure class="about-img reveal">${img(c.about.photo, "par")}${c.about.photo?.caption ? `<figcaption>${esc(c.about.photo.caption)}</figcaption>` : ""}</figure>
      <div>
        <p class="lead reveal">${esc(c.about.heading)}</p>
        <div class="cols">${(c.about.paragraphs || []).map(p => `<p class="reveal">${esc(p)}</p>`).join("")}</div>
        ${c.about.points?.length ? `<ul class="points">${c.about.points.map(p => `<li class="reveal">${esc(p)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>
  </section>`);

  if (c.marquee) out.push(`<div class="marquee" aria-hidden="true"><div>${Array(8).fill(`<span>${esc(c.marquee)}</span>`).join("")}</div></div>`);

  if (c.items?.list?.length) out.push(`
  <section id="items">${head(c.items.label || "Featured", c.items.heading)}
    ${c.items.intro ? `<p class="intro reveal">${esc(c.items.intro)}</p>` : ""}
    <div class="rail" tabindex="0" aria-label="${esc(c.items.heading || "Featured")}">
      ${c.items.list.map((it, i) => `
      <article class="card">
        <div class="card-img">${img(it.photo)}<span>${pad(i + 1)}</span>${it.badge ? `<em>${esc(it.badge)}</em>` : ""}</div>
        <div class="card-body">
          <div class="card-top"><span>${esc(it.kicker)}</span><b>${esc(it.price)}</b></div>
          <h3>${esc(it.name)}</h3>
          <p>${esc(it.description)}</p>
          ${it.includes?.length ? `<ul>${it.includes.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        </div>
      </article>`).join("")}
    </div>
    <p class="hint" aria-hidden="true">Drag or scroll sideways →</p>
  </section>`);

  if (c.steps?.list?.length) out.push(`
  <section id="process">${head(c.steps.label || "Process", c.steps.heading)}
    <ol class="steps">${c.steps.list.map((s, i) => `<li class="reveal" style="--d:${i * 90}ms"><span>${pad(i + 1)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </section>`);

  if (c.gallery?.photos?.length) out.push(`
  <section id="work">${head(c.gallery.label || "Work", c.gallery.heading)}
    <div class="gallery">${c.gallery.photos.map(p => `<figure class="reveal">${img(p, "par")}<figcaption><span>${esc(p.caption)}</span><span>${esc(p.meta)}</span></figcaption></figure>`).join("")}</div>
  </section>`);

  if (c.quotes?.length) out.push(`
  <section id="words">${head("Customers")}
    <div class="quotes">${c.quotes.map(q => `<blockquote class="reveal"><p>${esc(q.text)}</p><footer><b>${esc(q.name)}</b><span>${esc(q.detail)}</span></footer></blockquote>`).join("")}</div>
  </section>`);

  if (c.faq?.list?.length) out.push(`
  <section id="faq">${head(c.faq.label || "Questions")}
    <div class="faq-wrap"><h2 class="reveal">${esc(c.faq.heading)}</h2>
    <div class="faq">${c.faq.list.map(f => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div></div>
  </section>`);

  if (c.visit) out.push(`
  <section id="visit">${head(c.visit.label || "Visit", c.visit.heading)}
    <div class="visit">
      <div class="reveal"><span class="tag">${esc(c.visit.placeLabel || "Location")}</span><p class="big">${(c.visit.address || []).map(esc).join("<br>")}</p>${c.visit.note ? `<p class="note">${esc(c.visit.note)}</p>` : ""}</div>
      <div class="reveal"><span class="tag">${esc(c.visit.hoursLabel || "Hours")}</span><dl>${(c.visit.hours || []).map(h => `<div><dt>${esc(h.days)}</dt><dd>${esc(h.time)}</dd></div>`).join("")}</dl></div>
    </div>
  </section>`);

  if (c.contact) out.push(`
  <section id="contact">${head(c.contact.label || "Contact")}
    <div class="contact">
      <div><h2 class="reveal">${esc(c.contact.heading)}</h2><p class="reveal">${esc(c.contact.text)}</p>
        ${c.contact.direct?.length ? `<ul class="direct">${c.contact.direct.map(d => `<li><span class="tag">${esc(d.label)}</span>${esc(d.value)}</li>`).join("")}</ul>` : ""}</div>
      <form class="reveal" onsubmit="event.preventDefault();this.querySelector('button').textContent='Sent. Thank you.'">
        <label>Your name<input name="name" autocomplete="name" required></label>
        <label>Email address<input name="email" type="email" autocomplete="email" required></label>
        <label>${esc(c.contact.messageLabel || "Message")}<textarea name="message" rows="3" required></textarea></label>
        <button type="submit">${esc(c.contact.button || "Send message")} <i>→</i></button>
      </form>
    </div>
  </section>`);

  const nav = [c.items?.list?.length && ["#items", c.items.nav || "Work"], c.steps && ["#process", "Process"], c.gallery && ["#work", c.gallery.nav || "Work"], c.about && ["#about", "About"]].filter(Boolean).slice(0, 4);
  const badge = c.hero.badge ? `<a class="badge" href="#contact" aria-label="${esc(c.hero.badge)}"><svg viewBox="0 0 120 120"><defs><path id="ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#ring">${esc((c.hero.badge + " · ").repeat(3))}</textPath></text></svg><span>→</span></a>` : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.name)}${c.hero?.label ? " | " + esc(c.hero.label) : ""}</title>
<meta name="description" content="${esc(c.hero?.sub)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:${esc(pal.bg)};--surface:${esc(pal.surface)};--text:${esc(pal.text)};--muted:${esc(pal.muted)};--line:${esc(pal.line)};--accent:${esc(pal.accent)};--veil:color-mix(in srgb,var(--bg) 78%,transparent);--display:"Space Grotesk",system-ui,sans-serif;--body:"Inter",system-ui,sans-serif;--gut:clamp(20px,4vw,56px)}
*{box-sizing:border-box;margin:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font:400 17px/1.6 var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
body::after{content:"";position:fixed;inset:0;background:${GRAIN};opacity:.07;pointer-events:none;z-index:30;mix-blend-mode:overlay}
a{color:inherit;text-decoration:none}
img{display:block;width:100%;height:100%;object-fit:cover}
ul,ol{list-style:none;padding:0}
.tag{font:700 12px/1.3 var(--display);letter-spacing:.14em;text-transform:uppercase}
header{position:fixed;inset:0 0 auto 0;z-index:10;display:flex;justify-content:space-between;align-items:flex-start;padding:26px var(--gut);mix-blend-mode:difference}
.brand{font:700 15px/1.25 var(--display);letter-spacing:.08em;text-transform:uppercase;max-width:10ch}
nav{display:flex;gap:32px}
nav a,.cta{font:700 12px var(--display);letter-spacing:.14em;text-transform:uppercase}
.cta{border-bottom:2px solid var(--accent);padding-bottom:6px}
.bar{position:fixed;top:0;left:0;height:3px;width:100%;background:var(--accent);transform-origin:left;transform:scaleX(0);z-index:11}

.hero{min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;padding:140px var(--gut) 36px;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:-6% 0;z-index:0}
.hero-bg img{filter:grayscale(.35) contrast(1.05);animation:zoom 2.4s cubic-bezier(.2,.75,.1,1) both}
@keyframes zoom{from{transform:scale(1.14)}}
.hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,var(--veil) 0,color-mix(in srgb,var(--bg) 22%,transparent) 34%,color-mix(in srgb,var(--bg) 88%,transparent) 76%,var(--bg) 100%)}
.hero>*:not(.hero-bg){position:relative;z-index:1}
.hero-meta{position:absolute!important;top:120px;right:var(--gut);text-align:right;display:grid;gap:6px;font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--text)}
.hero-meta span:first-child{color:var(--accent)}
.hero .tag{color:var(--accent);margin-bottom:18px}
h1{font:500 clamp(48px,11.5vw,188px)/.9 var(--display);letter-spacing:-.045em;text-wrap:balance}
h1.lg{font-size:clamp(42px,8.2vw,132px)}
h1.xl{font-size:clamp(36px,6.2vw,100px);line-height:.94}
.w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}
.w>span{display:inline-block;transform:translateY(110%);animation:up .9s cubic-bezier(.2,.75,.1,1) forwards;animation-delay:calc(var(--i)*90ms + 250ms)}
@keyframes up{to{transform:none}}
.hero-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;border-top:1px solid color-mix(in srgb,var(--text) 25%,transparent);margin-top:36px;padding-top:24px}
.hero-foot p{max-width:44ch;color:color-mix(in srgb,var(--text) 82%,transparent)}
.hero-actions{display:flex;gap:14px;align-items:center;flex:none}
.btn{display:inline-flex;gap:14px;align-items:center;background:var(--accent);color:var(--bg);font:700 13px var(--display);letter-spacing:.14em;text-transform:uppercase;padding:19px 26px}
.btn i,button i{font-style:normal;transition:transform .25s}
.btn:hover i,button:hover i{transform:translateX(6px)}
.ghost{font:700 13px var(--display);letter-spacing:.14em;text-transform:uppercase;padding:18px 22px;border:1px solid color-mix(in srgb,var(--text) 40%,transparent)}
.badge{position:absolute!important;right:var(--gut);top:196px;width:132px;height:132px;display:grid;place-items:center}
.badge svg{position:absolute;inset:0;animation:spin 18s linear infinite}
.badge text{font:700 10.5px var(--display);letter-spacing:.2em;text-transform:uppercase;fill:var(--text)}
.badge span{width:56px;height:56px;border-radius:50%;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-size:22px;transition:transform .3s}
.badge:hover span{transform:rotate(-45deg) scale(1.1)}
@keyframes spin{to{transform:rotate(360deg)}}

.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));border-top:1px solid var(--line)}
.facts div{padding:36px var(--gut);border-right:1px solid var(--line)}
.facts div:last-child{border-right:0}
.facts b{display:block;font:500 clamp(36px,4.4vw,64px)/1 var(--display);letter-spacing:-.03em}
.facts span{font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);display:block;margin-top:10px}

section{border-top:1px solid var(--line);padding:clamp(64px,9vw,128px) var(--gut)}
.s-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:48px}
.num{font:500 clamp(48px,7vw,104px)/.8 var(--display);color:var(--accent);letter-spacing:-.04em}
.s-head .tag{color:var(--muted)}
h2{font:500 clamp(36px,6vw,92px)/.95 var(--display);letter-spacing:-.035em;margin-bottom:40px;max-width:16ch}
.intro{max-width:52ch;color:var(--muted);margin:-16px 0 40px}

.about{display:grid;grid-template-columns:5fr 7fr;gap:clamp(32px,5vw,80px);align-items:start}
.about-img{position:relative;aspect-ratio:4/5;overflow:hidden;margin-top:48px}
.about-img figcaption{position:absolute;left:0;bottom:0;background:var(--accent);color:var(--bg);font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase;padding:10px 14px}
.lead{font:500 clamp(30px,4.6vw,72px)/1 var(--display);letter-spacing:-.035em}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:32px;border-top:1px solid var(--line);margin-top:36px;padding-top:28px;color:var(--muted)}
.points{margin-top:36px;border-top:1px solid var(--line)}
.points li{display:flex;gap:18px;align-items:baseline;border-bottom:1px solid var(--line);padding:16px 0;font:500 19px var(--display)}
.points li::before{content:"";width:8px;height:8px;background:var(--accent);flex:none;transform:translateY(-2px)}

.marquee{overflow:hidden;border-top:1px solid var(--line);padding:26px 0;white-space:nowrap}
.marquee div{display:inline-block;animation:slide 42s linear infinite}
.marquee span{font:500 clamp(28px,4vw,56px)/1 var(--display);letter-spacing:-.02em;margin-right:40px;-webkit-text-stroke:1px var(--text);color:transparent}
.marquee span::after{content:"✳";margin-left:40px;color:var(--accent);-webkit-text-stroke:0}
@keyframes slide{to{transform:translateX(-50%)}}

.rail{display:flex;gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(-1*var(--gut));padding:4px var(--gut) 24px;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
.card{flex:0 0 min(80vw,460px);scroll-snap-align:start;background:var(--surface);border:1px solid var(--line);display:flex;flex-direction:column;position:relative;overflow:hidden;transition:transform .25s ease-out;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))}
.card::after{content:"";position:absolute;inset:auto 0 0 0;height:4px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.2,.75,.1,1)}
.card:hover::after{transform:scaleX(1)}
.card-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--surface)}
.card-img img{filter:grayscale(1) contrast(1.05);transition:filter .5s,transform .8s cubic-bezier(.2,.75,.1,1)}
.card:hover .card-img img{filter:none;transform:scale(1.05)}
.card-img span{position:absolute;left:16px;top:14px;font:700 12px var(--display);letter-spacing:.14em}
.card-img em{position:absolute;right:0;top:0;background:var(--accent);color:var(--bg);font:700 10.5px var(--display);font-style:normal;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px}
.card-body{padding:24px 26px 30px}
.card-top{display:flex;justify-content:space-between;align-items:baseline;font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.card-top b{font:700 22px var(--display);letter-spacing:0;color:var(--text)}
.card h3{font:500 clamp(30px,3.4vw,44px)/1 var(--display);letter-spacing:-.03em;margin:18px 0 10px}
.card p{color:var(--muted);font-size:15px}
.card ul{margin-top:18px;border-top:1px solid var(--line)}
.card li{font-size:14px;padding:9px 0;border-bottom:1px solid var(--line);display:flex;gap:10px}
.card li::before{content:"+";color:var(--accent);font-weight:700}
.hint{font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);text-align:right}

.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));counter-reset:s}
.steps li{border-top:2px solid var(--line);padding:26px 28px 0 0;position:relative;transition-delay:var(--d)}
.steps li::before{content:"";position:absolute;top:-7px;left:0;width:12px;height:12px;background:var(--accent)}
.steps span{font:700 12px var(--display);letter-spacing:.14em;color:var(--muted)}
.steps h3{font:500 26px/1.1 var(--display);letter-spacing:-.02em;margin:14px 0 10px}
.steps p{color:var(--muted);font-size:15px}

.gallery{display:grid;grid-template-columns:repeat(12,1fr);gap:20px}
.gallery figure{position:relative;overflow:hidden;grid-column:span 4;aspect-ratio:4/5}
.gallery figure:nth-child(4n+1){grid-column:span 7;aspect-ratio:16/11}
.gallery figure:nth-child(4n+2){grid-column:span 5;aspect-ratio:auto}
.gallery figure:nth-child(4n+3){grid-column:span 5;aspect-ratio:auto}
.gallery figure:nth-child(4n+4){grid-column:span 7;aspect-ratio:16/11}
.gallery img{transition:transform .9s cubic-bezier(.2,.75,.1,1)}
.gallery figure:hover img{transform:scale(1.05)}
.gallery figcaption{position:absolute;inset:auto 0 0 0;display:flex;justify-content:space-between;gap:16px;padding:40px 18px 14px;background:linear-gradient(transparent,var(--veil));font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase}
.gallery figcaption span:last-child{color:var(--accent)}

.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
blockquote{border:1px solid var(--line);padding:32px;display:flex;flex-direction:column;justify-content:space-between;gap:36px;min-height:280px}
blockquote p{font:500 clamp(22px,2.2vw,30px)/1.2 var(--display);letter-spacing:-.02em}
blockquote p::before{content:"“";color:var(--accent);display:block;font-size:64px;line-height:.6;margin-bottom:8px}
blockquote footer{display:flex;justify-content:space-between;font-size:14px;color:var(--muted);border-top:1px solid var(--line);padding-top:16px}
blockquote b{color:var(--text)}

.faq-wrap{display:grid;grid-template-columns:5fr 7fr;gap:48px}
details{border-bottom:1px solid var(--line);padding:22px 0}
details:first-child{border-top:1px solid var(--line)}
summary{font:500 22px var(--display);cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:24px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";color:var(--accent);font-size:26px;line-height:1}
details[open] summary::after{content:"–"}
details p{color:var(--muted);margin-top:12px;max-width:60ch}

.visit{display:grid;grid-template-columns:1fr 1fr;gap:48px}
.visit .tag{color:var(--muted);display:block;margin-bottom:16px}
.big{font:500 clamp(24px,2.6vw,36px)/1.2 var(--display);letter-spacing:-.02em}
.note{color:var(--muted);margin-top:16px;max-width:36ch}
dl div{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:14px 0}
dd{color:var(--muted)}

.contact{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,80px)}
.contact h2{margin-bottom:24px}
.contact p{color:var(--muted);max-width:40ch}
.direct{margin-top:36px;border-top:1px solid var(--line)}
.direct li{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--line);padding:14px 0;font:500 19px var(--display)}
.direct .tag{color:var(--muted)}
form{display:grid;gap:26px;background:var(--surface);border:1px solid var(--line);padding:clamp(24px,3vw,40px)}
label{font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);display:grid;gap:8px}
input,textarea{background:none;border:0;border-bottom:1px solid var(--line);color:var(--text);font:400 17px var(--body);padding:10px 0;border-radius:0;resize:vertical}
input:focus,textarea:focus{outline:0;border-color:var(--accent)}
button{justify-self:start;display:inline-flex;gap:14px;background:var(--accent);color:var(--bg);border:0;font:700 13px var(--display);letter-spacing:.14em;text-transform:uppercase;padding:19px 28px;cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:4px}

.closer{display:block;border-top:1px solid var(--line);padding:clamp(48px,7vw,104px) var(--gut);font:500 clamp(56px,14vw,240px)/.86 var(--display);letter-spacing:-.05em;transition:background .35s,color .35s}
.closer:hover{background:var(--accent);color:var(--bg)}
.closer small{display:block;font:700 12px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:24px}
.closer:hover small{color:var(--bg)}
footer{border-top:1px solid var(--line);padding:28px var(--gut) 36px;display:flex;justify-content:space-between;gap:24px;font:700 11px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}

.js .reveal{opacity:0;transform:translateY(40px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.75,.1,1)}
.js .reveal.in{opacity:1;transform:none}
.dot{position:fixed;top:0;left:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:40;mix-blend-mode:difference;transition:width .2s,height .2s,margin .2s;display:none}
.dot.on{display:block}.dot.grow{width:44px;height:44px;margin:-22px 0 0 -22px}
@media(max-width:820px){
  nav,.hero-meta{display:none}
  .badge{width:104px;height:104px;top:96px}
  .badge span{width:44px;height:44px;font-size:18px}
  .about,.visit,.contact,.faq-wrap{grid-template-columns:1fr;gap:32px}
  .about-img{margin-top:0;aspect-ratio:4/3}
  .cols{grid-template-columns:1fr}
  .hero-foot{flex-direction:column;align-items:flex-start}
  .facts{grid-template-columns:1fr 1fr}
  .facts div:nth-child(2n){border-right:0}
  .facts div{border-bottom:1px solid var(--line)}
  .gallery{gap:12px}
  .gallery figure,.gallery figure:nth-child(n){grid-column:span 12;aspect-ratio:4/3}
  .steps li{padding-bottom:32px}
  .s-head{margin-bottom:32px}
  footer{flex-direction:column}
}
@media(min-width:821px) and (max-height:760px){.badge{display:none}}
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .w>span,.hero-bg img,.badge svg,.marquee div{animation:none;transform:none}
  .reveal{opacity:1;transform:none;transition:none}
  .card{transition:none;transform:none}
}
</style>
</head>
<body>
<div class="bar" aria-hidden="true"></div>
<header>
  <a class="brand" href="#top">${esc(c.name)}</a>
  <nav>${nav.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join("")}</nav>
  ${c.contact ? `<a class="cta" href="#contact">${esc(c.contact.nav || "Say hello")}</a>` : "<span></span>"}
</header>
<main id="top">
  <div class="hero">
    ${c.hero.photo?.src ? `<div class="hero-bg">${img(c.hero.photo).replace('loading="lazy" ', "")}</div>` : ""}
    ${c.hero.meta?.length ? `<div class="hero-meta">${c.hero.meta.map(m => `<span>${esc(m)}</span>`).join("")}</div>` : ""}
    ${badge}
    <span class="tag">${esc(c.hero.label)}</span>
    <h1 class="${String(c.hero.heading || "").length > 44 ? "xl" : String(c.hero.heading || "").length > 26 ? "lg" : ""}">${words(c.hero.heading)}</h1>
    <div class="hero-foot"><p>${esc(c.hero.sub)}</p>
      <div class="hero-actions">${c.contact ? `<a class="btn" href="#contact">${esc(c.contact.nav || "Get in touch")} <i>→</i></a>` : ""}${c.items?.list?.length ? `<a class="ghost" href="#items">${esc(c.items.nav || "See more")}</a>` : ""}</div>
    </div>
  </div>
  ${out.join("")}
  ${c.contact ? `<a class="closer" href="#contact"><small>${esc(c.closer?.label || "Ready when you are")}</small>${esc(c.closer?.text || c.contact.nav || "Get in touch")} →</a>` : ""}
</main>
<footer><span>${esc(c.name)} © ${new Date().getFullYear()}</span><span>${esc(c.footer || "")}</span><a href="#top">Back to top ↑</a></footer>
<div class="dot" aria-hidden="true"></div>
<script>
(() => {
  document.documentElement.classList.add("js");
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const pending = new Set(document.querySelectorAll(".reveal"));
  const show = () => { for (const el of pending) { const r = el.getBoundingClientRect(); if (r.top < innerHeight * .92 && r.bottom > 0) { el.classList.add("in"); pending.delete(el); } } };
  addEventListener("scroll", show, { passive: true }); addEventListener("resize", show); addEventListener("load", show);
  show(); setTimeout(show, 400);
  const bar = document.querySelector(".bar"), heroBg = document.querySelector(".hero-bg"), pars = [...document.querySelectorAll("img.par")];
  let tick = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    if (calm) return;
    if (heroBg) heroBg.style.transform = "translateY(" + scrollY * .18 + "px)";
    pars.forEach(im => { const r = im.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) im.style.transform = "scale(1.12) translateY(" + ((r.top + r.height / 2 - innerHeight / 2) * -.05) + "px)"; });
    tick = false;
  };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !calm) {
    const dot = document.querySelector(".dot");
    addEventListener("mousemove", e => { dot.classList.add("on"); dot.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)"; });
    document.querySelectorAll("a,button,summary,.card").forEach(el => {
      el.addEventListener("mouseenter", () => dot.classList.add("grow"));
      el.addEventListener("mouseleave", () => dot.classList.remove("grow"));
    });
    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 6 + "deg");
        card.style.setProperty("--rx", (.5 - (e.clientY - r.top) / r.height) * 6 + "deg");
      });
      card.addEventListener("mouseleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    });
  }
})();
</script>
</body>
</html>`;
}
