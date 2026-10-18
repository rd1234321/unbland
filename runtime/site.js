// Added to every published Unbland site. Makes the site's forms (contact, quote, booking request) actually send:
// each message goes to the owner's inbox in Unbland, and on to their email and connected apps.
// The page sets window.__unbland = { site: "<slug>" } or { host: "<custom domain>" } before this runs,
// or { preview: true } inside the builder, where forms only say they will work once published.
(function () {
  var cfg = window.__unbland || {};
  var API = "https://clssxldrgtpiajwqgghl.supabase.co/functions/v1/site-form";

  function labelFor(el) {
    var t = "";
    if (el.id) { var l = document.querySelector('label[for="' + el.id.replace(/"/g, '\\"') + '"]'); if (l) t = l.textContent; }
    if (!t && el.closest("label")) t = el.closest("label").textContent;
    if (!t) t = el.getAttribute("aria-label") || el.placeholder || el.name || el.type || "Field";
    return t.replace(/\s+/g, " ").replace(/[*:]+\s*$/, "").trim().slice(0, 60);
  }

  function note(form, text, ok) {
    var p = form.querySelector(".ub-note");
    if (!p) { p = document.createElement("p"); p.className = "ub-note"; p.setAttribute("role", "status"); p.style.cssText = "margin:12px 0 0;font:inherit;font-size:.95em"; form.appendChild(p); }
    p.textContent = text;
    p.style.color = ok ? "inherit" : "#c62828";
  }

  function done(form) {
    var box = document.createElement("div");
    box.className = "ub-sent";
    box.setAttribute("role", "status");
    box.style.cssText = "padding:28px 4px;font:inherit;text-align:inherit";
    box.innerHTML = '<p style="margin:0 0 6px;font-size:1.35em;font-weight:700">Thank you.</p><p style="margin:0;opacity:.8">Your message was sent. We\'ll get back to you soon.</p>';
    form.replaceWith(box);
  }

  function setup(form) {
    if (form.dataset.ub || form.getAttribute("role") === "search" || (form.method || "").toLowerCase() === "get" && /search/i.test(form.action)) return;
    form.dataset.ub = "1";
    form.removeAttribute("action");
    var hp = document.createElement("input");
    hp.type = "text"; hp.name = "_hp"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0";
    form.appendChild(hp);
  }

  // Listens on the window in the capture phase, so it runs before any submit script the page itself has
  // (older sites faked a thank-you message) and stops that script from running.
  window.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || !form.dataset || !form.dataset.ub) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    send(form);
  }, true);

  function send(form) {
    if (cfg.preview) { note(form, "Forms send messages once the site is published. Messages go to your Unbland inbox and email.", true); return; }
    if (!cfg.site && !cfg.host) { note(form, "This form isn't connected yet.", false); return; }
    if (!form.reportValidity()) return;
    var fields = {}, trap = "";
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name && !el.id || el.disabled || /^(submit|button|reset|file|image)$/i.test(el.type)) return;
      if (el.name === "_hp") { trap = el.value; return; }
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
      var key = el.type === "radio" ? (el.name || labelFor(el)) : labelFor(el);
      var val = el.type === "checkbox" && (!el.value || el.value === "on") ? "Yes" : el.value;
      if (!val) return;
      fields[key] = fields[key] ? fields[key] + ", " + val : val;
    });
    var btn = form.querySelector('[type="submit"],button:not([type])');
    var label = btn && btn.textContent;
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: cfg.site, host: cfg.host, page: (form.closest("main[data-page]") && form.closest("main[data-page]").getAttribute("data-page")) || (location.hash || "").replace(/^#\/?/, "") || "home", fields: fields, _hp: trap }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok && res.d.ok) return done(form);
        throw new Error(res.d && res.d.error || "Couldn't send. Please try again.");
      })
      .catch(function (err) {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        note(form, err.message || "Couldn't send. Please try again, or call instead.", false);
      });
  }

  function scan() { Array.prototype.forEach.call(document.querySelectorAll("form"), setup); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
