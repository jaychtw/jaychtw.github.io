// All content/navigation is prerendered. This module only saves offscreen work
// and replaces a failed optional image with an honest typographic fallback.
for (const image of document.querySelectorAll("[data-thumbnail]")) {
  const fallback = () =>
    image.closest(".work-media")?.classList.add("is-fallback");
  image.addEventListener("error", fallback, { once: true });
  if (image.complete && image.naturalWidth === 0) fallback();
}
const scene = document.querySelector(".landing-scene");
const daylight = document.querySelector(".daylight");
if (scene && daylight && "IntersectionObserver" in window) {
  let visible = true;
  const update = () => {
    daylight.dataset.paused = String(!visible || document.hidden);
  };
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      update();
    },
    { threshold: 0 },
  ).observe(scene);
  document.addEventListener("visibilitychange", update);
}
