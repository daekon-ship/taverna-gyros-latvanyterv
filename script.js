/* ============================================================
   TAVERNA GYROS — LÁTVÁNYTERV v2 (2026) · script.js
   Óra-jelző (élő Nyitva/Zárva), menü-fülek, drawer, header.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Élő nyitvatartás-jelző ---------- */
  // Hétfő–Szombat: 11:00–21:00 (rendelésfelvétel 20:30-ig), Vasárnap: zárva.
  var OPEN_HOUR = 11;
  var CLOSE_HOUR = 21;
  var LAST_ORDER_HOUR = 20;
  var LAST_ORDER_MIN = 30;

  var hbDot = document.getElementById("hbDot");
  var hbText = document.getElementById("hbText");

  function updateHours() {
    var now = new Date();
    var day = now.getDay(); // 0 = vasárnap
    var mins = now.getHours() * 60 + now.getMinutes();
    var openMins = OPEN_HOUR * 60;
    var lastOrderMins = LAST_ORDER_HOUR * 60 + LAST_ORDER_MIN;
    var closeMins = CLOSE_HOUR * 60;

    var open = day !== 0 && mins >= openMins && mins < closeMins;

    if (hbDot && hbText) {
      if (open) {
        hbDot.classList.remove("is-closed");
        if (mins >= lastOrderMins) {
          hbText.textContent = "Rendelésfelvétel lezárult ma — holnap 11:00-tól nyitva";
        } else {
          var remaining = lastOrderMins - mins;
          var h = Math.floor(remaining / 60);
          var m = remaining % 60;
          hbText.textContent =
            "Most nyitva · rendelésfelvételig " + (h > 0 ? h + " óra " : "") + m + " perc";
        }
      } else {
        hbDot.classList.add("is-closed");
        if (day === 0) {
          hbText.textContent = "Ma zárva · hétfő 11:00-tól nyitva";
        } else if (mins < openMins) {
          hbText.textContent = "Ma még zárva · 11:00-tól nyitva";
        } else {
          hbText.textContent = day === 6 ? "Ma zárva · hétfő 11:00-tól nyitva" : "Jelenleg zárva · holnap 11:00–21:00-ig nyitva";
        }
      }
    }
  }

  updateHours();
  setInterval(updateHours, 30000);

  /* ---------- Header scroll állapot ---------- */
  var header = document.getElementById("siteHeader");
  var scrolled = false;
  function onScroll() {
    var should = window.scrollY > 24;
    if (should !== scrolled) {
      scrolled = should;
      if (header) header.classList.toggle("is-scrolled", scrolled);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobil drawer ---------- */
  var toggle = document.getElementById("navToggle");
  var drawer = document.getElementById("mobileDrawer");

  function setDrawer(open) {
    if (!drawer || !toggle) return;
    drawer.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Menü bezárása" : "Menü megnyitása");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setDrawer(false);
    });
    var links = drawer.querySelectorAll(".js-drawer-link");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () { setDrawer(false); });
    }
  }

  /* ---------- Étlap fülek ---------- */
  var tabs = document.querySelectorAll(".menu-tab");
  var panels = document.querySelectorAll(".menu-panel");

  function activateTab(tab) {
    var target = tab.getAttribute("data-panel");
    for (var i = 0; i < tabs.length; i++) {
      var active = tabs[i] === tab;
      tabs[i].classList.toggle("is-active", active);
      tabs[i].setAttribute("aria-selected", active ? "true" : "false");
    }
    for (var j = 0; j < panels.length; j++) {
      var match = panels[j].id === "panel-" + target;
      panels[j].classList.toggle("is-active", match);
      if (match) {
        panels[j].removeAttribute("hidden");
      } else {
        panels[j].setAttribute("hidden", "");
      }
    }
  }

  for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function () { activateTab(this); });
  }

  /* ---------- Évszám a láblécben ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Scroll reveal (prémium belépő animációk) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-group]");

  // Assign stagger indices for grouped children
  var groups = document.querySelectorAll("[data-reveal-group]");
  for (var g = 0; g < groups.length; g++) {
    var children = groups[g].children;
    for (var c = 0; c < children.length; c++) {
      children[c].style.setProperty("--stagger", c);
    }
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("is-visible");
          io.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    for (var r = 0; r < revealEls.length; r++) io.observe(revealEls[r]);
  } else {
    for (var f = 0; f < revealEls.length; f++) revealEls[f].classList.add("is-visible");
  }

  /* ---------- Menu rows stagger index — per panel, so the animation
     restarts cleanly on every tab switch ---------- */
  var menuPanels = document.querySelectorAll(".menu-panel");
  for (var p = 0; p < menuPanels.length; p++) {
    var rows = menuPanels[p].querySelectorAll(".menu-row");
    for (var n = 0; n < rows.length; n++) {
      rows[n].style.setProperty("--i", n);
    }
  }

  /* ---------- Hero parallax ( Transform/opacity only, rAF-throttled ) ---------- */
  var heroMedia = document.querySelector(".hero-media");
  var heroBlur = document.querySelector(".hero-blur");
  var ticking = false;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function parallax() {
    var y = window.scrollY;
    if (y < window.innerHeight * 1.2 && heroMedia) {
      // Negative translate moves image slower than scroll = depth
      heroMedia.style.transform = "translateY(" + y * 0.24 + "px)";
      if (heroBlur) heroBlur.style.transform = "translateY(" + y * 0.12 + "px) scale(1.18)";
    }
    ticking = false;
  }
  if (!reduceMotion && heroMedia) {
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(parallax);
        ticking = true;
      }
    }, { passive: true });
  }
})();
