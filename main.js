/* ================= CONTACTS =================
   Fill in WhatsApp (digits only, e.g. "998901234567") and Telegram username.
   While empty, those links fall back to Instagram Direct. */
const CONTACTS = {
  instagram: "shaxnoz_rashidovna_doula",
  whatsapp: "",
  telegram: "shaxnoza_doula"
};

/* ================= DIPLOMAS =================
   Files live in assets/certs/. `img` = full-size image opened on click,
   `thumb` = card preview (can differ, e.g. a cover photo). title/meta: string or { ru, uz, en }. */
const C = "assets/certs/";
const CONF_PAIN = {
  title: "Childbirth: From Pain to Power",
  meta: { ru: "Doula Link • 6–9 февраля 2026 • 25 CPD-часов", uz: "Doula Link • 2026-yil 6–9 fevral • 25 CPD soat", en: "Doula Link • 6–9 February 2026 • 25 CPD hours" },
  img: C + "conf-pain-to-power-2026.jpg", thumb: C + "conf-pain-to-power-2026-thumb.jpg"
};
const CONF_MAPS = {
  title: "Maps and Territory of Childbirth and Motherhood",
  meta: { ru: "Doula Link • 4–7 сентября 2026 • 20 CPD-часов", uz: "Doula Link • 2026-yil 4–7 sentyabr • 20 CPD soat", en: "Doula Link • 4–7 September 2026 • 20 CPD hours" },
  img: C + "conf-maps-territory-2026.jpg", thumb: C + "conf-maps-territory-2026-thumb.jpg"
};

const CERTS = {
  higher: [
    {
      title: { ru: "Диплом магистра", uz: "Magistr diplomi", en: "Master’s Degree Diploma" },
      meta: { ru: "Узбекистан", uz: "O‘zbekiston", en: "Uzbekistan" },
      img: C + "masters-diploma.jpg", thumb: C + "masters-diploma-thumb.jpg"
    }
  ],
  birth: [
    {
      title: { ru: "«Профессиональная доула — помощница в родах»", uz: "«Professional doula — tug‘ruqda yordamchi»", en: "“Professional Doula — Birth Assistant”" },
      meta: { ru: "Doula+ • Сертификат • Май 2024", uz: "Doula+ • Sertifikat • 2024-yil may", en: "Doula+ • Certificate • May 2024" },
      img: C + "birth-doula-plus-2024.jpg", thumb: C + "birth-doula-plus-2024-thumb.jpg"
    },
    {
      title: { ru: "Диплом «Professional doula»", uz: "«Professional doula» diplomi", en: "Diploma “Professional Doula”" },
      meta: { ru: "Open European Academy of Economics & Politics, Прага • 2024", uz: "Open European Academy of Economics & Politics, Praga • 2024", en: "Open European Academy of Economics & Politics, Prague • 2024" },
      img: C + "birth-oeaep-diploma-2024.jpg", thumb: C + "birth-oeaep-cover-thumb.jpg"
    }
  ],
  postpartum: [
    {
      title: { ru: "Postpartum Doula — послеродовая доула", uz: "Postpartum Doula — tug‘ruqdan keyingi doula", en: "Postpartum Doula Certification" },
      meta: { ru: "Doula Link / Институт перинатальной поддержки • Сентябрь 2026", uz: "Doula Link / Perinatal qo‘llab-quvvatlash instituti • 2026-yil sentyabr", en: "Doula Link / Institute for Perinatal Support • September 2026" },
      img: C + "postpartum-doulalink-2026.jpg", thumb: C + "postpartum-doulalink-2026-thumb.jpg"
    }
  ],
  conferences: [CONF_PAIN, CONF_MAPS]
};

/* ============================================ */

const LANGS = ["uz", "ru", "en"];
let lang = "ru";

const t = (key) => (I18N[lang] && I18N[lang][key]) ?? I18N.ru[key] ?? "";
const pick = (v) => (v && typeof v === "object") ? (v[lang] || v.ru || "") : (v || "");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function contactUrl(kind) {
  const ig = `https://www.instagram.com/${CONTACTS.instagram}/`;
  const dm = `https://ig.me/m/${CONTACTS.instagram}`;
  if (kind === "instagram") return ig;
  if (kind === "whatsapp") return CONTACTS.whatsapp ? `https://wa.me/${CONTACTS.whatsapp}` : dm;
  if (kind === "telegram") return CONTACTS.telegram ? `https://t.me/${CONTACTS.telegram}` : dm;
  return dm;
}

function setLang(next) {
  lang = LANGS.includes(next) ? next : "ru";
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').setAttribute("content", t("meta.desc"));
  document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
  try { localStorage.setItem("lang", lang); } catch (e) {}
  renderCerts();
  renderReviews();
  if (svcDialog.open) renderService(currentSvc);
}

/* Certificates: each `.certs[data-cat]` block on the page shows CERTS[cat] */
function renderCerts() {
  document.querySelectorAll(".certs[data-cat]").forEach((box) => {
    box.innerHTML = (CERTS[box.dataset.cat] || []).map((c, i) => `
      <button class="cert" data-i="${i}">
        <span class="cert__img ${c.img ? "" : "ph"}">
          ${c.img ? `<img src="${esc(c.thumb || c.img)}" alt="${esc(pick(c.title))}" loading="lazy">` : `<span class="ph__label">${esc(t("edu.soon"))}</span>`}
        </span>
        <span class="cert__title">${esc(pick(c.title))}</span>
        <span class="cert__meta">${esc(pick(c.meta))}</span>
      </button>`).join("");
  });
}

/* Lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
function openCert(c) {
  lightboxContent.innerHTML = c.img
    ? `<img src="${esc(c.img)}" alt="${esc(pick(c.title))}"><p>${esc(pick(c.title))}</p>`
    : `<div class="ph"><span class="ph__label">${esc(t("edu.soon"))}</span></div><p>${esc(pick(c.title))}</p>`;
  lightbox.showModal();
}
document.querySelectorAll(".certs[data-cat]").forEach((box) => box.addEventListener("click", (e) => {
  const btn = e.target.closest(".cert");
  if (btn) openCert(CERTS[box.dataset.cat][+btn.dataset.i]);
}));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.closest(".lightbox__close")) lightbox.close();
});

/* Service details dialog */
const svcDialog = document.getElementById("svcDialog");
const svcContent = document.getElementById("svcContent");
let currentSvc = 1;
function renderService(n) {
  svcContent.innerHTML = `
    <p class="svc-dialog__n">0${n}</p>
    <h3 class="h3">${t(`sv${n}.t`)}</h3>
    <div class="svc-dialog__text">${t(`sv${n}.d`)}</div>
    <a class="btn btn--accent" href="${contactUrl("telegram")}" target="_blank" rel="noopener">${t(`sv${n}.cta`)} →</a>`;
}
document.querySelectorAll(".svc").forEach((b) => b.addEventListener("click", () => {
  currentSvc = +b.dataset.svc;
  renderService(currentSvc);
  svcDialog.showModal();
}));
svcDialog.addEventListener("click", (e) => {
  if (e.target === svcDialog || e.target.closest(".svc-dialog__close")) svcDialog.close();
});

/* Reviews: short excerpt on the card, full text in a dialog */
const reviewDialog = document.getElementById("reviewDialog");
const reviewContent = document.getElementById("reviewContent");
const paragraphs = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean)
  .map((l) => l === "—" ? "<hr>" : `<p>${esc(l)}</p>`).join("");
function renderReviews() {
  document.getElementById("reviewsList").innerHTML = REVIEWS.map((r, i) => `
    <button class="review" data-i="${i}">
      <span class="review__quote">${esc(r.quote)}</span>
      <span class="review__name">${esc(r.name)}</span>
      <span class="review__more">${t("rev.more")} +</span>
    </button>`).join("");
}
document.getElementById("reviewsList").addEventListener("click", (e) => {
  const btn = e.target.closest(".review");
  if (!btn) return;
  const r = REVIEWS[+btn.dataset.i];
  reviewContent.innerHTML = `<h3 class="h3">${esc(r.name)}</h3><div class="review-dialog__text">${paragraphs(r.text)}</div>`;
  reviewDialog.showModal();
  reviewDialog.scrollTop = 0;
});
reviewDialog.addEventListener("click", (e) => {
  if (e.target === reviewDialog || e.target.closest(".svc-dialog__close")) reviewDialog.close();
});

/* Language switch */
document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

/* Mobile nav */
document.getElementById("burger").addEventListener("click", () => document.body.classList.toggle("nav-open"));
document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));

/* Header border on scroll */
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Contact links */
document.querySelectorAll("[data-contact]").forEach((a) => { a.href = contactUrl(a.dataset.contact); });


document.getElementById("year").textContent = new Date().getFullYear();

/* Initial language: ?lang= → saved choice → Uzbek browser → ru */
(function init() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  const nav = (navigator.language || "").slice(0, 2);
  setLang(fromUrl || saved || (nav === "uz" ? "uz" : "ru"));
})();
