/* ================= CONTACTS =================
   Fill in WhatsApp (digits only, e.g. "998901234567") and Telegram username.
   While empty, those links fall back to Instagram Direct. */
const CONTACTS = {
  instagram: "shaxnoz_rashidovna_doula",
  whatsapp: "",
  telegram: "shaxnoza_doula"
};

/* ================= DIPLOMAS =================
   Add files to assets/certs/ and list them here. `img` empty = placeholder frame.
   title/meta can be a string or { ru, uz, en }. */
const CERTS = {
  birth: [
    { title: { ru: "Сертификат родовой доулы", uz: "Tug‘ruq doulasi sertifikati", en: "Birth Doula Certificate" }, meta: "—", img: "" },
    { title: { ru: "Обучение родовой доулы", uz: "Tug‘ruq doulasi kursi", en: "Birth Doula Training" }, meta: "—", img: "" }
  ],
  postpartum: [
    { title: { ru: "Сертификат послеродовой доулы", uz: "Tug‘ruqdan keyingi doula sertifikati", en: "Postpartum Doula Certificate" }, meta: "—", img: "" }
  ],
  continuing: [
    { title: { ru: "Повышение квалификации", uz: "Malaka oshirish", en: "Continuing Education" }, meta: "—", img: "" },
    { title: { ru: "Повышение квалификации", uz: "Malaka oshirish", en: "Continuing Education" }, meta: "—", img: "" },
    { title: { ru: "Повышение квалификации", uz: "Malaka oshirish", en: "Continuing Education" }, meta: "—", img: "" }
  ],
  conferences: [
    { title: { ru: "Международная конференция", uz: "Xalqaro konferensiya", en: "International Conference" }, meta: "—", img: "" }
  ]
};

/* ================= CONFERENCES =================
   { title, place: "Country • Year", img } — empty strings show placeholders. */
const CONFERENCES = [
  { title: "", place: "", img: "" },
  { title: "", place: "", img: "" },
  { title: "", place: "", img: "" }
];

/* ============================================ */

const LANGS = ["uz", "ru", "en"];
let lang = "ru";
let activeCat = "birth";

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
  renderConferences();
}

function renderCerts() {
  const box = document.getElementById("certs");
  const items = CERTS[activeCat] || [];
  box.innerHTML = items.map((c, i) => `
    <button class="cert" data-i="${i}">
      <span class="cert__img ${c.img ? "" : "ph"}">
        ${c.img ? `<img src="${esc(c.img)}" alt="${esc(pick(c.title))}" loading="lazy">` : `<span class="ph__label">${esc(t("edu.soon"))}</span>`}
      </span>
      <span class="cert__title">${esc(pick(c.title))}</span>
      <span class="cert__meta">${esc(pick(c.meta))}</span>
    </button>`).join("");
}

function renderConferences() {
  document.getElementById("conferences").innerHTML = CONFERENCES.map((c) => `
    <div class="conf reveal is-in">
      <div class="conf__img ${c.img ? "" : "ph"}">
        ${c.img ? `<img src="${esc(c.img)}" alt="" loading="lazy">` : `<span class="ph__label">${esc(t("intl.phImg"))}</span>`}
      </div>
      <div>
        <p class="conf__title">${esc(pick(c.title) || t("intl.phTitle"))}</p>
        <p class="conf__meta">${esc(pick(c.place) || t("intl.phMeta"))}</p>
      </div>
    </div>`).join("");
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
document.getElementById("certs").addEventListener("click", (e) => {
  const btn = e.target.closest(".cert");
  if (btn) openCert(CERTS[activeCat][+btn.dataset.i]);
});
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.closest(".lightbox__close")) lightbox.close();
});

/* Education tabs */
document.getElementById("eduTabs").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-cat]");
  if (!b) return;
  activeCat = b.dataset.cat;
  document.querySelectorAll("#eduTabs button").forEach((x) => x.classList.toggle("is-active", x === b));
  renderCerts();
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

/* Reveal on scroll */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
}

document.getElementById("year").textContent = new Date().getFullYear();

/* Initial language: ?lang= → saved choice → Uzbek browser → ru */
(function init() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  const nav = (navigator.language || "").slice(0, 2);
  setLang(fromUrl || saved || (nav === "uz" ? "uz" : "ru"));
})();
