const themeButton = document.querySelector(".theme-toggle");
if (themeButton) {
  const label = () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    themeButton.setAttribute("aria-label", `Switch to ${next} theme`);
    themeButton.setAttribute("title", `Switch to ${next} theme`);
  };
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
    const count = cards.filter((card) => !card.hidden).length;
    document.querySelector("[data-filter-status]").textContent =
      `${count} ${count === 1 ? "project" : "projects"}${tag === "All" ? "" : ` tagged ${tag}`}.`;
  });
}
for (const image of document.querySelectorAll("[data-image]")) {
  const fallback = () => {
    if (image.dataset.fallback) {
      const source = image.dataset.fallback;
      if (image.dataset.fallbackAlt) image.alt = image.dataset.fallbackAlt;
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
