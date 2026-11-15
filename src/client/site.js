const isChinese = () => document.documentElement.lang === "zh-TW";
function initialLanguage() {
  try {
    const saved = window.localStorage.getItem("possibility:language");
    if (saved === "zh-TW" || saved === "en") return saved;
    const legacy = window.localStorage.getItem("comics.language");
    if (legacy === "1") return "zh-TW";
    if (legacy === "0") return "en";
  } catch {
    /* Browser preferences also work when storage is unavailable. */
  }
  for (const language of window.navigator.languages) {
    if (/^en(?:-|$)/i.test(language)) return "en";
    if (/^zh(?:$|-(?:Hant|TW|HK|MO)(?:-|$))/i.test(language)) return "zh-TW";
  }
  return "en";
}
const languageButton = document.querySelector(".language-toggle");
const localized = [...document.querySelectorAll("[data-zh]")].map((node) => ({
  node,
  english: node.textContent,
}));
const labelNodes = document.querySelectorAll("[data-zh-label]");
const labels = [...labelNodes].map((node) => ({
  node,
  english: node.getAttribute("aria-label"),
}));
const images = [...document.querySelectorAll("[data-zh-alt]")];
for (const image of images) image.dataset.enAlt = image.alt;
function setLanguage(language) {
  document.documentElement.lang = language;
  for (const { node, english } of localized) {
    node.textContent = isChinese() ? node.dataset.zh : english;
    if (node.hasAttribute("lang")) node.lang = language;
  }
  for (const { node, english } of labels) {
    const label = isChinese() ? node.dataset.zhLabel : english;
    node.setAttribute("aria-label", label);
  }
  for (const image of images) {
    image.alt = isChinese() ? image.dataset.zhAlt : image.dataset.enAlt;
  }
  languageButton.textContent = isChinese() ? "En" : "繁";
  languageButton.lang = isChinese() ? "en" : "zh-TW";
  languageButton.title = isChinese() ? "Switch to English" : "切換至繁體中文";
  languageButton.setAttribute("aria-label", languageButton.title);
  window.dispatchEvent(new window.Event("possibility:language"));
}
if (languageButton) {
  setLanguage(initialLanguage());
  languageButton.hidden = false;
  languageButton.addEventListener("click", () => {
    const language = isChinese() ? "en" : "zh-TW";
    try {
      window.localStorage.setItem("possibility:language", language);
    } catch {
      /* Keep the selection for the current page. */
    }
    setLanguage(language);
  });
}
const themeButton = document.querySelector(".theme-toggle");
if (themeButton) {
  const label = () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    const name = isChinese()
      ? `切換為${next === "dark" ? "深色" : "淺色"}主題`
      : `Switch to ${next} theme`;
    themeButton.setAttribute("aria-label", name);
    themeButton.title = name;
  };
  window.addEventListener("possibility:language", label);
  label();
  themeButton.hidden = false;
  themeButton.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#202120" : "#f7f6f2");
    try {
      window.localStorage.setItem("possibility:theme", next);
    } catch {
      /* Browsing works without persistent storage. */
    }
    label();
  });
}
const filters = document.querySelector(".filters");
if (filters) {
  const cards = [...document.querySelectorAll("[data-project]")];
  function announce(button) {
    const tag = button.dataset.filter;
    const count = cards.filter((card) => !card.hidden).length;
    document.querySelector("[data-filter-status]").textContent = isChinese()
      ? `${tag === "All" ? "" : `「${button.textContent}」標籤下`}共有 ${count} 件作品。`
      : `${count} ${count === 1 ? "project" : "projects"}${tag === "All" ? "" : ` tagged ${tag}`}.`;
  }
  window.addEventListener("possibility:language", () => {
    announce(filters.querySelector('[aria-pressed="true"]'));
  });
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const tag = button.dataset.filter;
    for (const pill of filters.querySelectorAll("[data-filter]"))
      pill.setAttribute("aria-pressed", String(pill === button));
    for (const card of cards)
      card.hidden =
        tag !== "All" && !JSON.parse(card.dataset.tags).includes(tag);
    announce(button);
  });
}
for (const image of document.querySelectorAll("[data-image]")) {
  const fallback = () => {
    if (image.dataset.fallback) {
      const source = image.dataset.fallback;
      if (image.dataset.fallbackAlt) {
        image.dataset.enAlt = image.dataset.fallbackAlt;
        image.dataset.zhAlt = image.dataset.fallbackZh;
        image.alt = isChinese() ? image.dataset.zhAlt : image.dataset.enAlt;
      }
      delete image.dataset.fallback;
      image.removeAttribute("srcset");
      image.src = source;
    } else {
      image.hidden = true;
      image.closest(".work-media")?.classList.add("is-fallback");
    }
  };
  image.addEventListener("error", fallback);
  if (image.complete && image.naturalWidth === 0) fallback();
}
