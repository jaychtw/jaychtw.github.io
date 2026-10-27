// Blocking, same-origin, tiny head script: apply the explicit preference before CSS paints.
try {
  const saved = window.localStorage.getItem("possibility:theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.dataset.theme = saved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", saved === "dark" ? "#202120" : "#f7f6f2");
  }
} catch {
  /* Default dark theme remains usable. */
}
