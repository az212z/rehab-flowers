/* ===== رحاب للورد والهدايا — main.js ===== */
(function () {
  "use strict";

  /* ---- Preloader (hard fallback) ---- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hidden");
    setTimeout(function () { if (preloader) preloader.style.display = "none"; }, 550);
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 1200); // fallback if load never fires

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Full-screen mobile menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  var mmClose = document.getElementById("mmClose");
  function openMenu() { if (menu) { menu.classList.add("open"); document.body.style.overflow = "hidden"; } }
  function closeMenu() { if (menu) { menu.classList.remove("open"); document.body.style.overflow = ""; } }
  if (burger) burger.addEventListener("click", openMenu);
  if (mmClose) mmClose.addEventListener("click", closeMenu);
  document.querySelectorAll(".mm-link").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---- Smooth-scroll for in-page anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---- Scroll reveal (with fallback) ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    // Safety fallback: reveal everything after 1.5s no matter what
    setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("visible"); });
    }, 1500);
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbClose = document.getElementById("lbClose");
  document.querySelectorAll(".gal-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var src = item.getAttribute("data-img");
      if (src && lbImg && lightbox) {
        lbImg.setAttribute("src", src);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });
  });
  function closeLb() {
    if (lightbox) { lightbox.classList.remove("open"); document.body.style.overflow = ""; }
  }
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeLb(); closeMenu(); }
  });

  /* ---- Toast ---- */
  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");
  function showToast(msg) {
    if (!toast) return;
    if (toastMsg && msg) toastMsg.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }

  /* ---- Order form -> WhatsApp + localStorage ---- */
  var form = document.getElementById("orderForm");
  var WA = "966539586997";
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("name") || {}).value || "";
      var phone = (document.getElementById("phone") || {}).value || "";
      var type = (document.getElementById("type") || {}).value || "";
      var occasion = (document.getElementById("occasion") || {}).value || "";
      var date = (document.getElementById("date") || {}).value || "";
      var notes = (document.getElementById("notes") || {}).value || "";

      var lines = [
        "السلام عليكم، أرغب بطلب من رحاب للورد والهدايا 🌸",
        "",
        "الاسم: " + name,
        "الجوال: " + phone,
        "نوع الطلب: " + type
      ];
      if (occasion) lines.push("المناسبة: " + occasion);
      if (date) lines.push("تاريخ التسليم: " + date);
      if (notes) lines.push("ملاحظات: " + notes);

      var text = encodeURIComponent(lines.join("\n"));

      // Save to localStorage (demo)
      try {
        var store = JSON.parse(localStorage.getItem("rehab_orders") || "[]");
        store.push({ name: name, phone: phone, type: type, occasion: occasion, date: date, notes: notes, at: new Date().toISOString() });
        localStorage.setItem("rehab_orders", JSON.stringify(store));
      } catch (err) {}

      showToast("تم تجهيز طلبك! جارٍ فتح واتساب…");
      form.reset();
      setTimeout(function () {
        window.open("https://wa.me/" + WA + "?text=" + text, "_blank");
      }, 700);
    });
  }

  /* ---- Footer year safety (static 2026 already in DOM) ---- */
})();
