// Meta Pixel for unblandapp.com (the home page and the builder), so ads can learn who signs up and pays.
// Off until PIXEL_ID is filled in. Pages call window.ubTrack("Lead") etc.; it does nothing while off.
(function () {
  var PIXEL_ID = "2311194579612426";
  window.ubTrack = function (event, params) { try { if (window.fbq) window.fbq("track", event, params || {}); } catch (e) {} };
  if (!PIXEL_ID) return;
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
})();

// Our own visitor counts for the owner page (/admin): one count per page view, sorted by where the visitor came from,
// plus the signup steps above. No cookies and nothing personal is sent. Browsers that opened /admin are ours and aren't counted.
(function () {
  var API = "https://clssxldrgtpiajwqgghl.supabase.co/rest/v1/rpc/track_app";
  window.ubStep = function () {};
  var team = false;
  try { team = localStorage.getItem("ub_team") === "1"; } catch (e) {}
  if (team || /bot|crawl|spider|slurp|headless|lighthouse|facebookexternalhit/i.test(navigator.userAgent)) return;
  function post(body) {
    fetch(API, { method: "POST", keepalive: true, headers: { "Content-Type": "application/json", apikey: "sb_publishable_tSFjjjClxBrIPpc3j0gFyA_JuQhSiJS" }, body: JSON.stringify(body) }).catch(function () {});
  }
  // Builder steps (typed, tapped an example, clicked Build…): counted once per visit, so the numbers are people, not clicks.
  window.ubStep = function (event) {
    var seen = {};
    try { seen = JSON.parse(sessionStorage.getItem("ub_steps") || "{}"); } catch (e) {}
    if (seen[event]) return;
    seen[event] = 1;
    try { sessionStorage.setItem("ub_steps", JSON.stringify(seen)); } catch (e) {}
    post({ p_page: null, p_source: null, p_new: false, p_event: event });
    // The steps that show real interest also go to Meta, so ads can be aimed at people who build, not people who tap.
    if (/^(DemoTry|ExampleTap|Typed|BuildClick|GiftClaimClick)$/.test(event)) { try { if (window.fbq) window.fbq("trackCustom", event); } catch (e) {} }
  };
  var counted = { Lead: 1, CompleteRegistration: 1, InitiateCheckout: 1, Subscribe: 1, Purchase: 1 };
  var pixel = window.ubTrack;
  window.ubTrack = function (event, params) { pixel(event, params); if (counted[event]) post({ p_page: null, p_source: null, p_new: false, p_event: event }); };

  var q = new URLSearchParams(location.search), med = (q.get("utm_medium") || "").toLowerCase(), ref = "";
  try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : ""; } catch (e) {}
  var inside = ref === location.hostname.replace(/^www\./, "");
  if (inside) ref = "";
  var src = "direct", kept = null;
  try { kept = sessionStorage.getItem("ub_src"); } catch (e) {}
  if (q.get("gclid") || q.get("fbclid") && /paid|cpc|ads?/.test(med) || /^(cpc|ppc|paid|paidsocial|paid_social|ads?|display)$/.test(med)) src = "ads";
  else if (/(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|yandex|baidu|chatgpt|openai|perplexity|claude|gemini|copilot)\./.test(ref + ".")) src = "search";
  else if (/(^|\.)(facebook|fb|instagram|tiktok|t\.co|twitter|x|linkedin|lnkd|pinterest|reddit|youtube|threads|snapchat)\./.test(ref + ".") || /social/.test(med)) src = "social";
  else if (ref) src = "referral";
  if (inside && kept) src = kept;
  try { sessionStorage.setItem("ub_src", src); } catch (e) {}
  var fresh = false, today = new Date().toDateString();
  try { if (localStorage.getItem("ub_seen") !== today) { localStorage.setItem("ub_seen", today); fresh = true; } } catch (e) { fresh = true; }
  var page = location.pathname === "/" || location.pathname === "/index.html" ? "home" : /^\/build/.test(location.pathname) ? "build" : "other";
  post({ p_page: page, p_source: src, p_new: fresh, p_event: null });
})();

// Microsoft Clarity session recordings for unblandapp.com, so we can watch (anonymously) what visitors do.
// Off until CLARITY_ID is filled in. Our own browsers (any that opened /admin) are never recorded.
(function () {
  var CLARITY_ID = "z2eom71ckc";
  var team = false;
  try { team = localStorage.getItem("ub_team") === "1"; } catch (e) {}
  if (!CLARITY_ID || team) return;
  (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, "clarity", "script", CLARITY_ID);
})();
