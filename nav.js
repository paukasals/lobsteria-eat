/* LOBSTERIA sticky menu bar for lobsteria.co (Square Online).
   Loaded from Square custom code: <script src="https://paukasals.github.io/lobsteria-eat/nav.js"></script>
   Shows after the visitor starts scrolling: category chips + profile + cart (hover = mini cart). */
(function () {
  if (window.__lnv) return; window.__lnv = 1;
  var d = document, NAVY = '#1E3A5F', RED = '#D8552E';
  var USER = '133566987', SITE = '120632100416958499';
  var q = function (s) { return d.querySelector(s); };
  var heads = function () { return [].slice.call(d.querySelectorAll('.category__subtitle')).filter(function (e) { return e.offsetHeight; }); };
  var label = function (e) { return e.innerText.split(' —')[0].trim(); };
  var top = function (e) { return e.getBoundingClientRect().top; };

  d.head.insertAdjacentHTML('beforeend', '<style>' +
    '.order-online-background .bg-sticky{display:none!important}' +
    '#lnv{position:fixed;left:0;right:0;z-index:1;display:none;align-items:center;height:52px;padding-left:8px;background:#EBDDB8;box-shadow:0 2px 6px #0002;font-family:Chivo,sans-serif}' +
    '#lnv.on{display:flex}' +
    '#lnv .c{flex:1;min-width:0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-right:8px;-webkit-overflow-scrolling:touch}' +
    '#lnv .c::-webkit-scrollbar{display:none}' +
    '#lnv a{flex:none;padding:8px 12px;border:1px solid ' + NAVY + '55;border-radius:99px;color:' + NAVY + ';font:700 12px Chivo,sans-serif;white-space:nowrap;cursor:pointer;text-decoration:none}' +
    '#lnv a.a{background:' + NAVY + ';color:#fff}' +
    '#lnv button{flex:none;position:relative;width:48px;height:52px;border:0;border-left:1px solid ' + NAVY + '33;background:0;color:' + NAVY + ';cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
    '#lnv svg{width:24px;height:24px}' +
    '#lnv i{position:absolute;top:7px;right:5px;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:9px;background:' + RED + ';color:#fff;font:700 10px/17px Chivo,sans-serif;font-style:normal;text-align:center}' +
    '#lnv i:empty{display:none}' +
    '#lnc{position:fixed;right:8px;z-index:2;width:320px;max-width:calc(100vw - 16px);display:none;background:#FBF1E1;color:' + NAVY + ';border-radius:12px;box-shadow:0 8px 28px #0003;padding:16px;font:14px/1.4 "Source Sans 3",sans-serif;box-sizing:border-box}' +
    '#lnc.on{display:block}' +
    '#lnc h4{margin:0 0 10px;font:700 16px Chivo,sans-serif}' +
    '#lnc ul{list-style:none;margin:0 0 12px;padding:0;max-height:260px;overflow:auto}' +
    '#lnc li{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid ' + NAVY + '1f}' +
    '#lnc li b{flex:none;min-width:22px}' +
    '#lnc .t{display:flex;justify-content:space-between;font-weight:700;margin-bottom:12px}' +
    '#lnc .k{display:block;text-align:center;background:' + RED + ';color:#fff;border-radius:99px;padding:10px;font:700 14px Chivo,sans-serif;text-decoration:none}' +
    '</style>');

  var ICON_USER = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M14 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM8 7a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm10 14h2a8 8 0 0 0-16 0h2a6 6 0 0 1 12 0Z"/></svg>';
  var ICON_CART = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M7 14a1 1 0 0 0 0 2h13v2H7a3 3 0 0 1-1.33-5.67L4 4H2V2h6v2h12l-2 10H7Zm9.36-2 1.2-6H6.44l1.2 6h8.72ZM7.5 22a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>';

  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 2a5 5 0 0 1 5 5c0 3.2-3.4 7.9-5 9.9C10.4 16.9 7 12.2 7 9a5 5 0 0 1 5-5Zm0 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>';

  var N, C, P, chipsKey = '', tIdx = -1, fix = 0, lastActive = -1, store = null, names = {}, hideT;

  function getStore() {
    if (store) return store;
    var el = [].slice.call(d.querySelectorAll('body *')).find(function (e) { return e.__vue__; });
    store = el && el.__vue__.$root.$store;
    return store;
  }
  function order() {
    var s = getStore();
    try { return s.state.shoppingCart.cartModel.order; } catch (e) { return null; }
  }
  function count() {
    var o = order();
    if (o && o.items) return o.items.reduce(function (n, i) { return n + (+i.quantity || 0); }, 0);
    var b = q('.mini-cart-icon .nav-icon__cart-number');
    return b ? +b.innerText.trim() || 0 : 0;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function name(id) {
    if (names[id]) return Promise.resolve(names[id]);
    return fetch('https://cdn5.editmysite.com/app/store/api/v28/editor/users/' + USER + '/sites/' + SITE + '/products/' + id)
      .then(function (r) { return r.json(); })
      .then(function (j) { return (names[id] = (j.data || j).name || 'Item'); })
      .catch(function () { return 'Item'; });
  }

  function renderCart() {
    var o = order(), items = (o && o.items) || [];
    if (!items.length) {
      P.innerHTML = '<h4>Your cart</h4><p style="margin:0 0 12px">Your cart is empty.</p>';
      return;
    }
    Promise.all(items.map(function (i) { return name(i.site_product_id); })).then(function (ns) {
      P.innerHTML = '<h4>Your cart (' + count() + ')</h4><ul>' +
        items.map(function (i, k) { return '<li><b>' + esc(i.quantity) + '×</b><span>' + esc(ns[k]) + '</span></li>'; }).join('') +
        '</ul><div class="t"><span>Subtotal</span><span>$' + esc(o.order_subtotal) + '</span></div>' +
        '<a class="k" href="/s/cart">View cart &amp; checkout</a>';
    });
  }
  function showCart() { clearTimeout(hideT); if (V) V.className = ''; if (!N.classList.contains('on')) return; renderCart(); P.style.top = (N.getBoundingClientRect().bottom + 6) + 'px'; P.className = 'on'; }
  function hideCart() { hideT = setTimeout(function () { P.className = ''; }, 250); }

  function buildChips(hs) {
    var key = hs.map(label).join('|');
    if (key === chipsKey) return;
    chipsKey = key; lastActive = -1;
    N.firstChild.innerHTML = hs.map(function (e, i) { return '<a data-i="' + i + '">' + esc(label(e)) + '</a>'; }).join('');
  }

  function init() {
    var hs = heads();
    if (!hs.length) return setTimeout(init, 500);
    N = d.createElement('div'); N.id = 'lnv';
    N.innerHTML = '<div class="c"></div><button type="button" data-v="1" aria-label="Visit and contact">' + ICON_PIN + '</button><button type="button" aria-label="My account and Lobster Points">' + ICON_USER + '</button>' +
      '<button type="button" aria-label="Cart">' + ICON_CART + '<i></i></button>';
    d.body.prepend(N);
    C = N.lastChild;
    P = d.createElement('div'); P.id = 'lnc'; d.body.appendChild(P);
    buildChips(hs);

    N.addEventListener('click', function (ev) {
      var a = ev.target.closest('a,button'); if (!a) return;
      if (a.dataset.i != null) {
        tIdx = +a.dataset.i; var h = heads()[tIdx]; if (!h) return;
        fix = 12; scrollBy(0, top(h) - barBottom() - 12);
      } else if (a.dataset.v) {
        if (HOVER) location.href = '/visit-and-contact';
        else if (V.className) V.className = ''; else showVisit(a);
      } else if (a === C) {
        location.href = '/s/cart';
      } else {
        var acc = q('[aria-label="Customer account"]');
        if (acc) acc.click(); else location.href = '/s/account';
      }
    });
    if (HOVER) {
      var pin = N.querySelector('[data-v]');
      pin.addEventListener('mouseenter', function () { showVisit(pin); }); pin.addEventListener('mouseleave', hideVisit);
      C.addEventListener('mouseenter', showCart); C.addEventListener('mouseleave', hideCart);
      P.addEventListener('mouseenter', function () { clearTimeout(hideT); }); P.addEventListener('mouseleave', hideCart);
    }
    ['wheel', 'touchmove', 'keydown'].forEach(function (t) { addEventListener(t, function () { fix = 0; }, { passive: true }); });
    setInterval(tick, 150);
  }

  function barBottom() { return N.offsetTop + 52; }

  function tick() {
    var b = q('#lrb'), t = b ? b.offsetHeight : 0, hs = heads();
    N.style.top = t + 'px';
    var on = scrollY > 60;
    N.className = on ? 'on' : '';
    if (!on) P.className = '';
    buildChips(hs);
    if (fix > 0 && hs[tIdx]) {
      fix--;
      var dy = top(hs[tIdx]) - (t + 52) - 12;
      if (Math.abs(dy) > 6) scrollBy(0, dy);
    }
    var j = 0;
    hs.forEach(function (e, i) { if (top(e) < t + 52 + 60) j = i; });
    var L = N.querySelectorAll('a');
    L.forEach(function (x, i) { x.className = i === j ? 'a' : ''; });
    if (on && j !== lastActive && L[j]) { lastActive = j; N.firstChild.scrollLeft = L[j].offsetLeft - 40; }
    var n = count(), badge = C.lastChild.textContent, want = n ? String(n) : '';
    if (badge !== want) C.lastChild.textContent = want;
  }

  /* Visit & Contact card: hover on the header link and on the pin in the sticky bar; tap the pin on phones. */
  var HOVER = matchMedia('(hover:hover)').matches, V, vt;
  var MAPS = 'https://www.google.com/maps/search/?api=1&query=LOBSTERIA%2C%20144%20NE%2027th%20St%2C%20Miami%2C%20FL%2033137';
  function buildVisit() {
    d.head.insertAdjacentHTML('beforeend', '<style>' +
      '#lvc{position:fixed;z-index:30;width:300px;display:none;background:#FBF1E1;color:' + NAVY + ';border-radius:12px;box-shadow:0 8px 28px #0003;padding:18px;font:14px/1.45 "Source Sans 3",sans-serif;box-sizing:border-box;text-align:left}' +
      '#lvc.on{display:block}' +
      '#lvc h4{margin:0 0 12px;font:700 15px Chivo,sans-serif;letter-spacing:.04em}' +
      '#lvc .r{display:flex;gap:10px;margin-bottom:10px}' +
      '#lvc .r>span:first-child{flex:none;width:20px;font-size:16px;line-height:1.3}' +
      '#lvc a{color:' + NAVY + ';font-weight:600}' +
      '#lvc .b{display:flex;gap:8px;margin:14px 0 10px}' +
      '#lvc .b a{flex:1;text-align:center;border-radius:99px;padding:9px 6px;font:700 13px Chivo,sans-serif;text-decoration:none}' +
      '#lvc .p{background:' + RED + ';color:#fff}' +
      '#lvc .s{border:1px solid ' + NAVY + '55}' +
      '#lvc .m{font-size:13px}' +
      '</style>');
    V = d.createElement('div'); V.id = 'lvc';
    V.innerHTML = '<h4>LOBSTERIA · WYNWOOD</h4>' +
      '<div class="r"><span>📍</span><span><a href="' + MAPS + '" target="_blank" rel="noopener">144 NE 27th St<br>Miami, FL 33137</a><br>Look for the 1976 Airstream</span></div>' +
      '<div class="r"><span>🕒</span><span>Open nightly <b>5pm–2am</b><br>Pickup &amp; delivery on lobsteria.co</span></div>' +
      '<div class="r"><span>📞</span><span><a href="tel:+17868507848">(786) 850-7848</a><br>Call, text or <a href="https://wa.me/17868507848" target="_blank" rel="noopener">WhatsApp</a></span></div>' +
      '<div class="b"><a class="p" href="' + MAPS + '" target="_blank" rel="noopener">Directions</a><a class="s" href="tel:+17868507848">Call</a></div>' +
      '<a class="m" href="/visit-and-contact">Map &amp; full contact details →</a>';
    d.body.appendChild(V);
    V.addEventListener('mouseenter', function () { clearTimeout(vt); });
    V.addEventListener('mouseleave', hideVisit);
    addEventListener('scroll', function () { V.className = ''; }, { passive: true });
    d.addEventListener('click', function (e) { if (!e.target.closest('#lvc,[data-v]')) V.className = ''; });
  }
  function showVisit(el) {
    clearTimeout(vt);
    if (P) P.className = '';
    var r = el.getBoundingClientRect();
    V.style.top = (r.bottom + 8) + 'px';
    V.style.left = Math.max(8, Math.min(innerWidth - 308, r.left + r.width / 2 - 150)) + 'px';
    V.className = 'on';
  }
  function hideVisit() { vt = setTimeout(function () { V.className = ''; }, 250); }
  function headerLink() {
    if (!HOVER) return;
    var link = [].slice.call(d.querySelectorAll('a.nav__link[href*="visit-and-contact"]')).find(function (a) { return a.offsetHeight; });
    if (!link) return setTimeout(headerLink, 700);
    link.addEventListener('mouseenter', function () { showVisit(link); });
    link.addEventListener('mouseleave', hideVisit);
  }

  /* Homepage: Google rating line under the hero text (the hero has no buttons to anchor to since 2026-11-21). */
  var revBusy = 0;
  function heroReviews() {
    if (location.pathname.replace(/\/$/, '') !== '' || revBusy || d.querySelector('.lgl') || !window.LGRF || !window.LGRS) return;
    var h = [].slice.call(d.querySelectorAll('h1')).find(function (e) { return e.offsetHeight && e.closest('.element-group'); });
    if (!h) return;
    var g = h.closest('.element-group');
    revBusy = 1;
    LGRF().then(function (r) {
      revBusy = 0;
      if (!r.rating || d.querySelector('.lgl')) return;
      var l = d.createElement('div'); l.className = 'lgl'; l.style.justifyContent = 'center';
      l.innerHTML = LGRS(r.rating) + '<b>' + r.rating.toFixed(1) + '</b>&middot;<a href="' + r.googleMapsUri + '" target="_blank" rel="noopener">' + r.userRatingCount + ' Google reviews</a>';
      g.after(l);
    }, function () { revBusy = 0; });
  }


  /* Menu area polish (2026-11-21): hide "Available items" filter, menu switch as pill buttons,
     friendlier menu titles, MOST POPULAR tag, and the "lower price than the apps" line under the hero. */
  d.head.insertAdjacentHTML('beforeend', '<style>' +
    '.order-online-background .time-based-dropdown__wrapper{display:none!important}' +
    'ul.lmt{display:flex!important;flex-wrap:wrap;gap:10px;align-items:center}' +
    'ul.lmt>li{margin:0!important;padding:0!important}' +
    'ul.lmt>li>:not(a){display:none!important}' +
    'ul.lmt a.lmb{display:inline-block!important;padding:11px 22px!important;margin:0!important;border:1.5px solid ' + NAVY + '!important;border-radius:99px!important;font:700 14px/1.2 Chivo,sans-serif!important;letter-spacing:.02em!important;text-transform:none!important;color:' + NAVY + '!important;background:transparent;text-decoration:none!important;white-space:nowrap}' +
    'ul.lmt a.lmb:hover{background:' + NAVY + '14}' +
    'ul.lmt a.lmb.p{background:' + NAVY + '!important;color:#fff!important}' +
    '.lmp{position:absolute;top:10px;left:10px;z-index:1;background:' + RED + ';color:#fff;font:700 11px/1 Chivo,sans-serif;letter-spacing:.06em;padding:6px 10px;border-radius:99px;pointer-events:none}' +
    '.lsv{text-align:center;margin-top:10px;font:600 14px/1.4 "Source Sans 3",sans-serif;color:' + NAVY + '}' +
    '.lsv b{color:' + RED + '}' +
    '</style>');
  var RENAME = { 'LOBSTERIA': 'Menu', 'LOBSTERIA Event Boxes': 'Event Boxes · 24h notice' };
  var H2NAME = { 'LOBSTERIA': 'Menu', 'LOBSTERIA Event Boxes': 'Event Boxes' };
  function setText(el, t) { if (el.textContent.trim() !== t) el.textContent = t; }
  function polish() {
    var root = q('.order-online-background'); if (!root) return;
    [].forEach.call(root.querySelectorAll('ul.nav__main'), function (ul) {
      if (ul.closest('.bg-sticky')) return;
      ul.classList.add('lmt');
      [].forEach.call(ul.children, function (li) {
        var a = li.querySelector('a.nav__link'); if (!a) return;
        var t = a.textContent.trim();
        if (t === 'More') { li.style.display = 'none'; return; }
        a.classList.add('lmb');
        if (RENAME[t]) { a.classList.toggle('p', t === 'LOBSTERIA'); setText(a, RENAME[t]); }
      });
    });
    [].forEach.call(root.querySelectorAll('h2'), function (h) { var t = h.textContent.trim(); if (H2NAME[t]) setText(h, H2NAME[t]); });
    [].forEach.call(root.querySelectorAll('.item__card'), function (c) {
      var t = c.querySelector('.w-product-title');
      if (!t || !/^WARM CONNECTICUT LOBSTER ROLL$/i.test(t.textContent.trim()) || c.querySelector('.lmp')) return;
      var img = c.querySelector('img'); var box = img ? img.parentElement : c;
      if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
      var b = d.createElement('span'); b.className = 'lmp'; b.textContent = 'MOST POPULAR'; box.appendChild(b);
    });
    var l = q('.lgl');
    if (l && location.pathname.replace(/\/$/, '') === '' && !q('.lsv')) {
      var v = d.createElement('div'); v.className = 'lsv';
      v.innerHTML = 'Same roll, lower price: <b>$30 here</b> vs $34 on delivery apps';
      l.after(v);
    }
  }

  function start() { buildVisit(); init(); headerLink(); setInterval(function () { heroReviews(); polish(); }, 1000); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();
