/* İnan Kardeşler Hotel — site etkileşimleri (bağımlılık yok) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var LANG = doc.lang === "en" ? "en" : "tr";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var T = {
    tr: {
      months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
      monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
      dows: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"],
      dowsLong: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
      night: "gece", nights: "gece", adult: "Yetişkin", adults: "Yetişkin", child: "Çocuk", children: "Çocuk",
      pickIn: "Giriş tarihinizi seçin", pickOut: "Çıkış tarihinizi seçin",
      apply: "Tamam", clear: "Temizle", age: "yaş", childAge: "Çocuk", selectDates: "Tarih seçin",
      prev: "Önceki ay", next: "Sonraki ay", guests: "Misafirler", close: "Kapat", of: "/"
    },
    en: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dows: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      dowsLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      night: "night", nights: "nights", adult: "Adult", adults: "Adults", child: "Child", children: "Children",
      pickIn: "Select your check-in date", pickOut: "Select your check-out date",
      apply: "Done", clear: "Clear", age: "yrs", childAge: "Child", selectDates: "Select dates",
      prev: "Previous month", next: "Next month", guests: "Guests", close: "Close", of: "/"
    }
  }[LANG];

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function icon(id) { return '<svg class="icon" aria-hidden="true"><use href="#i-' + id + '"></use></svg>'; }

  /* ---------------- Header: stick on scroll ---------------- */
  var masthead = $(".masthead");
  var actionbar = $(".actionbar");
  var toTop = $(".to-top");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (masthead) masthead.classList.toggle("is-stuck", y > 180);
    if (actionbar) actionbar.classList.toggle("is-visible", y > 320);
    if (toTop) toTop.classList.toggle("is-visible", y > 900);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  /* ---------------- Mega menu (touch + keyboard) ---------------- */
  var navItems = $$(".mainnav__item.has-mega");
  var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  navItems.forEach(function (item) {
    var link = $(".mainnav__link", item);
    link.addEventListener("click", function (e) {
      if (!canHover && !item.classList.contains("is-open")) {
        e.preventDefault();
        navItems.forEach(function (o) { if (o !== item) o.classList.remove("is-open"); });
        item.classList.add("is-open");
      }
    });
    item.addEventListener("mouseleave", function () { item.classList.remove("is-open"); });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".mainnav__item")) navItems.forEach(function (o) { o.classList.remove("is-open"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      navItems.forEach(function (o) { o.classList.remove("is-open"); });
      if (document.activeElement && document.activeElement.closest(".mega")) {
        var l = document.activeElement.closest(".mainnav__item").querySelector(".mainnav__link");
        l && l.focus();
      }
    }
  });

  /* ---------------- Mobile menu ---------------- */
  var mmenu = $("#mobile-menu");
  var lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    document.body.classList.add("mm-open");
    $$("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    setTimeout(function () { var c = $(".mmenu__close", mmenu); c && c.focus(); }, 60);
  }
  function closeMenu() {
    document.body.classList.remove("mm-open");
    $$("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (lastFocus) lastFocus.focus();
  }
  $$("[data-menu-open]").forEach(function (b) { b.addEventListener("click", openMenu); });
  $$("[data-menu-close]").forEach(function (b) { b.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("mm-open")) closeMenu(); });

  /* ---------------- Home hero slider ---------------- */
  var hero = $("[data-hero]");
  if (hero) {
    var slides = $$(".hero__slide", hero);
    var dots = $$(".hero__dot", hero);
    var texts = $$("[data-slide-text]", hero);
    var idx = 0, timer = null, DUR = 7000;
    function show(n) {
      if (!slides.length) return;
      slides[idx].classList.remove("is-active");
      dots[idx] && dots[idx].classList.remove("is-active");
      idx = (n + slides.length) % slides.length;
      var s = slides[idx];
      var im = $("img", s);
      if (im && im.dataset.src) { im.src = im.dataset.src; im.removeAttribute("data-src"); }
      s.classList.add("is-active");
      if (dots[idx]) { void dots[idx].offsetWidth; dots[idx].classList.add("is-active"); }
      var d = s.dataset;
      texts.forEach(function (t) {
        var key = t.getAttribute("data-slide-text");
        if (!d[key]) return;
        t.classList.add("is-swapping");
        setTimeout(function () { t.textContent = d[key]; t.classList.remove("is-swapping"); }, 350);
      });
    }
    function start() { stop(); if (!reduceMotion && slides.length > 1) timer = setInterval(function () { show(idx + 1); }, DUR); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    dots.forEach(function (d, i) { d.style.setProperty("--dur", DUR / 1000 + "s"); d.addEventListener("click", function () { show(i); start(); }); });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    // preload the rest after load
    window.addEventListener("load", function () {
      slides.forEach(function (s) { var im = $("img", s); if (im && im.dataset.src) { var p = new Image(); p.src = im.dataset.src; } });
    });
    start();
  }

  /* ---------------- Read more ---------------- */
  $$("[data-readmore]").forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute("aria-controls"));
    if (!target) return;
    var labels = [btn.textContent.trim(), btn.getAttribute("data-less") || "−"];
    btn.addEventListener("click", function () {
      var open = target.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.querySelector("span").textContent = open ? labels[1] : labels[0];
    });
  });

  /* ---------------- Rail scroll buttons ---------------- */
  $$("[data-rail-prev],[data-rail-next]").forEach(function (b) {
    b.addEventListener("click", function () {
      var rail = document.getElementById(b.getAttribute("aria-controls"));
      if (!rail) return;
      var dir = b.hasAttribute("data-rail-next") ? 1 : -1;
      rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------------- Room filters ---------------- */
  $$("[data-filters]").forEach(function (bar) {
    var grid = document.getElementById(bar.getAttribute("data-filters"));
    $$("button", bar).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", bar).forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        var f = b.getAttribute("data-filter");
        $$("[data-cat]", grid).forEach(function (c) { c.hidden = !(f === "all" || c.getAttribute("data-cat") === f); });
      });
    });
  });

  /* ---------------- Lite YouTube ---------------- */
  $$(".yt[data-id]").forEach(function (el) {
    function play() {
      if (el.querySelector("iframe")) return;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + el.dataset.id + "?autoplay=1&rel=0";
      f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      f.title = el.getAttribute("aria-label") || "YouTube";
      el.innerHTML = ""; el.appendChild(f);
    }
    el.addEventListener("click", play);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
  });

  /* ---------------- Contact form → WhatsApp / e-posta ---------------- */
  $$("form[data-contact]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || "wa";
      var g = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ""; };
      var lines = [g("name"), g("email"), g("phone"), g("subject")].filter(Boolean);
      var body = (g("message") + "\n\n" + lines.join("\n")).trim();
      if (!g("message")) { form.elements.message.focus(); return; }
      if (via === "mail") {
        var subj = g("subject") || (LANG === "tr" ? "Web sitesi mesajı" : "Website message");
        window.location.href = "mailto:inan@inankardeslerotel.com?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
      } else {
        window.open("https://api.whatsapp.com/send?phone=905327376010&text=" + encodeURIComponent(body), "_blank", "noopener");
      }
    });
  });

  /* ---------------- Lightbox ---------------- */
  var lb, lbImg, lbCap, lbCount, group = [], gi = 0, touchX = null;
  function buildLb() {
    lb = document.createElement("div");
    lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-hidden", "true");
    lb.innerHTML = '<div class="lb__top"><span class="lb__count"></span><button class="lb__btn lb__close" aria-label="' + T.close + '">' + icon("close") + '</button></div>' +
      '<div class="lb__stage"><button class="lb__btn lb__prev" aria-label="' + T.prev + '">' + icon("arrow-left") + '</button><img class="lb__img" alt=""><button class="lb__btn lb__next" aria-label="' + T.next + '">' + icon("arrow-right") + '</button></div>' +
      '<div class="lb__cap"></div>';
    document.body.appendChild(lb);
    lbImg = $(".lb__img", lb); lbCap = $(".lb__cap", lb); lbCount = $(".lb__count", lb);
    $(".lb__close", lb).addEventListener("click", closeLb);
    $(".lb__prev", lb).addEventListener("click", function () { go(gi - 1); });
    $(".lb__next", lb).addEventListener("click", function () { go(gi + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb__stage")) closeLb(); });
    lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 50) go(gi + (dx < 0 ? 1 : -1));
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") go(gi + 1);
      if (e.key === "ArrowLeft") go(gi - 1);
    });
  }
  function go(n) {
    gi = (n + group.length) % group.length;
    var a = group[gi];
    lbImg.classList.add("is-loading");
    var src = a.getAttribute("href");
    var pre = new Image();
    pre.onload = pre.onerror = function () { lbImg.src = src; lbImg.classList.remove("is-loading"); };
    pre.src = src;
    var im = a.querySelector("img");
    lbImg.alt = (im && im.alt) || "";
    lbCap.textContent = a.getAttribute("data-caption") || a.getAttribute("title") || (im && im.alt) || "";
    lbCount.textContent = (gi + 1) + " " + T.of + " " + group.length;
    [gi + 1, gi - 1].forEach(function (k) { var x = group[(k + group.length) % group.length]; if (x) { var p = new Image(); p.src = x.getAttribute("href"); } });
    var multi = group.length > 1;
    $(".lb__prev", lb).hidden = !multi; $(".lb__next", lb).hidden = !multi;
  }
  function openLb(a) {
    if (!lb) buildLb();
    var name = a.getAttribute("data-lightbox");
    group = $$('a[data-lightbox="' + name + '"]');
    lastFocus = document.activeElement;
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    go(group.indexOf(a));
    $(".lb__close", lb).focus();
  }
  function closeLb() {
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-lightbox]");
    if (!a) return;
    e.preventDefault(); openLb(a);
  });
  $$("[data-gallery-open]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var first = $('a[data-lightbox="' + b.getAttribute("data-gallery-open") + '"]');
      if (first) openLb(first);
    });
  });

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* WhatsApp hint (desktop, once per session) */
  var wa = $(".wa-float");
  if (wa) {
    var seen = false;
    try { seen = sessionStorage.getItem("ik-wa-hint") === "1"; } catch (e) {}
    if (!seen) setTimeout(function () {
      wa.classList.add("is-hinting");
      setTimeout(function () { wa.classList.remove("is-hinting"); }, 5000);
      try { sessionStorage.setItem("ik-wa-hint", "1"); } catch (e) {}
    }, 6000);
  }

  /* ==========================================================================
     BOOKING — rezervasyonal / Elektraweb widget ile aynı parametreler:
     ?currency=…&language=…&Checkin=YYYY-MM-DD&Checkout=YYYY-MM-DD&Adult=N&ChildAges=a b
     ========================================================================== */
  var STORE = "ik-booking";
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parseIso(s) { var p = (s || "").split("-"); if (p.length !== 3) return null; var d = new Date(+p[0], +p[1] - 1, +p[2]); d.setHours(0, 0, 0, 0); return isNaN(d) ? null : d; }
  function same(a, b) { return a && b && a.getTime() === b.getTime(); }
  function nightsBetween(a, b) { return Math.round((b - a) / 86400000); }
  function fmt(d) { return d.getDate() + " " + T.monthsShort[d.getMonth()]; }

  function loadState() {
    var s = { in: today(), out: addDays(today(), 1), adults: 2, ages: [] };
    try {
      var raw = JSON.parse(sessionStorage.getItem(STORE) || "null");
      if (raw) {
        var i = parseIso(raw.in), o = parseIso(raw.out);
        if (i && o && i >= today() && o > i) { s.in = i; s.out = o; }
        if (raw.adults >= 1 && raw.adults <= 10) s.adults = raw.adults;
        if (Array.isArray(raw.ages)) s.ages = raw.ages.slice(0, 4);
      }
    } catch (e) {}
    return s;
  }
  function saveState(s) {
    try { sessionStorage.setItem(STORE, JSON.stringify({ in: iso(s.in), out: iso(s.out), adults: s.adults, ages: s.ages })); } catch (e) {}
  }

  var backdrop = null;
  function ensureBackdrop(onClick) {
    if (!backdrop) { backdrop = document.createElement("div"); backdrop.className = "bk-sheet-backdrop"; }
    backdrop.onclick = onClick;
    document.body.appendChild(backdrop);
  }
  function removeBackdrop() { if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); }

  function Booking(form) {
    var st = loadState();
    var sel = { a: st.in, b: st.out, hover: null };
    var view = new Date(st.in.getFullYear(), st.in.getMonth(), 1);
    var openPop = null;
    var fIn = $("[data-bk-in]", form), fOut = $("[data-bk-out]", form), fAd = $("[data-bk-adult]", form), fAges = $("[data-bk-ages]", form);
    var lblIn = $("[data-bk-in-label]", form), lblOut = $("[data-bk-out-label]", form), lblG = $("[data-bk-guests-label]", form);
    var popDates = $('[data-bk-pop="dates"]', form), popGuests = $('[data-bk-pop="guests"]', form);
    var triggers = $$("[data-bk-open]", form);
    var maxDate = addDays(today(), 540);

    function sync() {
      st = loadState();
      sel.a = st.in; sel.b = st.out;
      render();
    }
    function render() {
      fIn.disabled = false; fOut.disabled = false;
      fIn.value = iso(st.in); fOut.value = iso(st.out); fAd.value = st.adults;
      if (st.ages.length) { fAges.disabled = false; fAges.value = st.ages.join(" "); } else { fAges.disabled = true; fAges.value = ""; }
      var n = nightsBetween(st.in, st.out);
      lblIn.innerHTML = fmt(st.in) + ' <small>' + T.dowsLong[st.in.getDay()].slice(0, 3) + '</small>';
      lblOut.innerHTML = fmt(st.out) + ' <small>' + n + " " + (n === 1 ? T.night : T.nights) + '</small>';
      var g = st.adults + " " + (st.adults === 1 ? T.adult : T.adults) + (st.ages.length ? ", " + st.ages.length + " " + (st.ages.length === 1 ? T.child : T.children) : "");
      lblG.textContent = g;
    }

    function isSheet() { return window.innerWidth < 720 || window.innerHeight < 620; }
    function close() {
      if (!openPop) return;
      openPop.hidden = true; openPop.classList.remove("is-sheet", "bk__pop--up");
      if (openPop.parentNode !== form) form.appendChild(openPop);
      triggers.forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
      openPop = null; removeBackdrop();
      document.removeEventListener("mousedown", outside, true);
      if (!document.querySelector(".modal.is-open")) document.body.style.overflow = "";
    }
    function outside(e) { if (!form.contains(e.target)) close(); }
    function open(which, part) {
      var pop = which === "dates" ? popDates : popGuests;
      if (openPop === pop && !part) { close(); return; }
      close();
      openPop = pop; pop.hidden = false;
      triggers.forEach(function (t) { t.setAttribute("aria-expanded", t.getAttribute("data-bk-open") === which && (!part || t.getAttribute("data-bk-part") === part) ? "true" : "false"); });
      if (isSheet()) { ensureBackdrop(close); document.body.appendChild(pop); pop.classList.add("is-sheet"); document.body.style.overflow = "hidden"; }
      else {
        document.addEventListener("mousedown", outside, true);
        var inModal = !!form.closest(".modal");
        var fr = form.getBoundingClientRect();
        var need = (which === "dates" ? 480 : 340) + (form.classList.contains("bk--stack") ? 90 : fr.height);
        if (window.innerHeight - fr.top < need) {
          if (inModal) { if (fr.top > need) pop.classList.add("bk__pop--up"); }
          else window.scrollTo({ top: (window.scrollY || window.pageYOffset) + fr.top - 110, behavior: reduceMotion ? "auto" : "smooth" });
        }
      }
      if (which === "dates") {
        sel.hover = null;
        if (part === "out") { sel.a = st.in; sel.b = null; } else { sel.a = null; sel.b = null; }
        view = new Date(st.in.getFullYear(), st.in.getMonth(), 1);
        drawCal();
      } else drawGuests();
      var f = pop.querySelector("button:not(:disabled)"); if (f && !isSheet()) setTimeout(function () { f.focus({ preventScroll: true }); }, 30);
    }
    triggers.forEach(function (t) {
      t.addEventListener("click", function () { open(t.getAttribute("data-bk-open"), t.getAttribute("data-bk-part")); });
    });
    [form, popDates, popGuests].forEach(function (el) {
      el.addEventListener("keydown", function (e) { if (e.key === "Escape" && openPop) { e.stopPropagation(); close(); } });
    });

    /* Calendar */
    function monthsToShow() {
      if (isSheet()) return 1;
      if (form.classList.contains("bk--stack")) return 1;
      return 2;
    }
    function drawCal() {
      var m = monthsToShow();
      var t0 = today();
      var html = '<p class="sheet-title">' + (sel.a ? T.pickOut : T.pickIn) + '</p><div class="cal" style="--months:' + m + '">';
      var canPrev = view > new Date(t0.getFullYear(), t0.getMonth(), 1);
      var lastView = new Date(view.getFullYear(), view.getMonth() + m - 1, 1);
      var canNext = lastView < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
      html += '<button type="button" class="cal__nav cal__nav--prev" data-cal-nav="-1" aria-label="' + T.prev + '"' + (canPrev ? "" : " disabled") + '>' + icon("arrow-left") + '</button>';
      html += '<button type="button" class="cal__nav cal__nav--next" data-cal-nav="1" aria-label="' + T.next + '"' + (canNext ? "" : " disabled") + '>' + icon("arrow-right") + '</button>';
      var endPreview = sel.b || (sel.a && sel.hover && sel.hover > sel.a ? sel.hover : null);
      for (var k = 0; k < m; k++) {
        var first = new Date(view.getFullYear(), view.getMonth() + k, 1);
        html += '<div class="cal__month"><div class="cal__month-title">' + T.months[first.getMonth()] + " " + first.getFullYear() + '</div><div class="cal__grid">';
        T.dows.forEach(function (d) { html += '<span class="cal__dow">' + d + "</span>"; });
        var offset = (first.getDay() + 6) % 7;
        for (var e = 0; e < offset; e++) html += "<span></span>";
        var days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
        for (var d = 1; d <= days; d++) {
          var dt = new Date(first.getFullYear(), first.getMonth(), d);
          var cls = "cal__day";
          var dis = dt < t0 || dt > maxDate;
          if (same(dt, t0)) cls += " is-today";
          if (sel.a && same(dt, sel.a)) cls += " is-start" + (endPreview ? " has-range" : "");
          if (endPreview && same(dt, endPreview)) cls += " is-end has-range";
          if (sel.a && endPreview && dt > sel.a && dt < endPreview) cls += " is-range";
          html += '<button type="button" class="' + cls + '" data-date="' + iso(dt) + '"' + (dis ? " disabled" : "") + ' aria-label="' + d + " " + T.months[dt.getMonth()] + " " + dt.getFullYear() + '">' + d + "</button>";
        }
        html += "</div></div>";
      }
      html += "</div>";
      var n = sel.a && endPreview ? nightsBetween(sel.a, endPreview) : 0;
      html += '<div class="cal__foot"><span class="cal__summary">' + (sel.a ? fmt(sel.a) : "—") + " → " + (endPreview ? fmt(endPreview) : "—") + (n ? " · <b>" + n + " " + (n === 1 ? T.night : T.nights) + "</b>" : "") + '</span>' +
        '<button type="button" class="btn btn--dark btn--sm" data-cal-done>' + T.apply + '</button></div>';
      popDates.innerHTML = html;
    }
    popDates.addEventListener("click", function (e) {
      var nav = e.target.closest("[data-cal-nav]");
      if (nav) { view = new Date(view.getFullYear(), view.getMonth() + +nav.getAttribute("data-cal-nav"), 1); drawCal(); return; }
      if (e.target.closest("[data-cal-done]")) {
        // "Tamam": seçimi her durumda uygula (yalnız giriş seçildiyse 1 gece varsay)
        if (sel.a) {
          var end = sel.b || (sel.hover && sel.hover > sel.a ? sel.hover : addDays(sel.a, 1));
          if (end > maxDate) end = maxDate;
          st.in = sel.a; st.out = end; saveState(st); render();
        }
        close(); return;
      }
      var b = e.target.closest("[data-date]");
      if (!b || b.disabled) return;
      var d = parseIso(b.getAttribute("data-date"));
      if (!sel.a || sel.b || d <= sel.a) { sel.a = d; sel.b = null; sel.hover = null; drawCal(); }
      else {
        sel.b = d; st.in = sel.a; st.out = sel.b; saveState(st); render(); drawCal();
        setTimeout(close, 260);
      }
    });
    // Aralık önizlemesi yalnızca gerçek fare için: dokunmatik ekranda (özellikle iPhone Safari)
    // üzerine-gelme sırasında takvimi yeniden çizmek dokunuşu yutar ve tarih seçilmez.
    var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    popDates.addEventListener("pointerover", function (e) {
      if (!finePointer || e.pointerType !== "mouse") return;
      if (!sel.a || sel.b) return;
      var b = e.target.closest("[data-date]");
      if (!b) return;
      var d = parseIso(b.getAttribute("data-date"));
      if (!same(d, sel.hover)) { sel.hover = d; drawCal(); }
    });

    /* Guests */
    function drawGuests() {
      var html = '<p class="sheet-title">' + T.guests + '</p>' +
        '<div class="guests__row"><div><strong>' + T.adult + '</strong><small>18+</small></div><div class="stepper">' +
        '<button type="button" data-g="ad-" aria-label="−"' + (st.adults <= 1 ? " disabled" : "") + '>' + icon("minus") + '</button><output aria-live="polite">' + st.adults + '</output>' +
        '<button type="button" data-g="ad+" aria-label="+"' + (st.adults >= 10 ? " disabled" : "") + '>' + icon("plus") + '</button></div></div>' +
        '<div class="guests__row"><div><strong>' + T.children + '</strong><small>0–12 ' + T.age + '</small></div><div class="stepper">' +
        '<button type="button" data-g="ch-" aria-label="−"' + (!st.ages.length ? " disabled" : "") + '>' + icon("minus") + '</button><output aria-live="polite">' + st.ages.length + '</output>' +
        '<button type="button" data-g="ch+" aria-label="+"' + (st.ages.length >= 4 ? " disabled" : "") + '>' + icon("plus") + '</button></div></div>';
      if (st.ages.length) {
        html += '<div class="guests__ages">';
        st.ages.forEach(function (a, i) {
          html += '<label>' + (i + 1) + ". " + T.childAge + '<select data-age="' + i + '">';
          for (var y = 0; y <= 12; y++) html += '<option value="' + y + '"' + (y === a ? " selected" : "") + ">" + y + " " + T.age + "</option>";
          html += "</select></label>";
        });
        html += "</div>";
      }
      html += '<button type="button" class="btn btn--dark btn--block guests__done" data-g="done">' + T.apply + "</button>";
      popGuests.innerHTML = html;
    }
    popGuests.addEventListener("click", function (e) {
      var b = e.target.closest("[data-g]");
      if (!b) return;
      var a = b.getAttribute("data-g");
      if (a === "done") { close(); return; }
      if (a === "ad+") st.adults = Math.min(10, st.adults + 1);
      if (a === "ad-") st.adults = Math.max(1, st.adults - 1);
      if (a === "ch+" && st.ages.length < 4) st.ages.push(6);
      if (a === "ch-") st.ages.pop();
      saveState(st); render(); drawGuests();
      var again = popGuests.querySelector('[data-g="' + a + '"]'); if (again && !again.disabled) again.focus();
    });
    popGuests.addEventListener("change", function (e) {
      var s = e.target.closest("[data-age]");
      if (!s) return;
      st.ages[+s.getAttribute("data-age")] = +s.value; saveState(st); render();
    });

    form.addEventListener("submit", function () {
      st = loadState(); render(); saveState(st);
      try { (window.dataLayer = window.dataLayer || []).push({ event: "booking_search", checkin: iso(st.in), checkout: iso(st.out), adults: st.adults, children: st.ages.length }); } catch (e) {}
    });
    form.addEventListener("bk:sync", sync);
    window.addEventListener("resize", function () { if (openPop && isSheet() !== openPop.classList.contains("is-sheet")) close(); });
    render();
  }
  var forms = $$("form[data-booking]");
  forms.forEach(function (f) { Booking(f); });

  /* ---------------- Booking modal ---------------- */
  var modal = $("#book-modal");
  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    var f = $("form[data-booking]", modal); if (f) f.dispatchEvent(new Event("bk:sync"));
    modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(function () { var b = $("[data-bk-open]", modal); b && b.focus(); }, 80);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-book]");
    if (t && modal) {
      e.preventDefault();
      if (document.body.classList.contains("mm-open")) { document.body.classList.remove("mm-open"); }
      openModal();
    }
    if (e.target.closest("[data-modal-close]")) closeModal();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal && modal.classList.contains("is-open") && !$(".bk__pop:not([hidden])", modal)) closeModal(); });
  if (/[?&#]rezervasyon|[?&#]book/i.test(location.search + location.hash)) setTimeout(openModal, 400);
})();
