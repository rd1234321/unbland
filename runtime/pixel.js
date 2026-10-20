// Meta Pixel for unblandapp.com (the home page and the builder), so ads can learn who signs up and pays.
// Off until PIXEL_ID is filled in. Pages call window.ubTrack("Lead") etc.; it does nothing while off.
(function () {
  var PIXEL_ID = "";
  window.ubTrack = function (event, params) { try { if (window.fbq) window.fbq("track", event, params || {}); } catch (e) {} };
  if (!PIXEL_ID) return;
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
})();
