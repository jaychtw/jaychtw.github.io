'use strict';
// Review variants live in URLs rather than adding controls to the composition.
const choices = new URLSearchParams(location.search);
const light = ['diffuse', 'window'].includes(choices.get('light')) ? choices.get('light') : 'diffuse';
const pattern = ['drift', 'cadence'].includes(choices.get('pattern')) ? choices.get('pattern') : 'drift';
document.body.dataset.light = light;
document.body.dataset.pattern = pattern;
for (const link of document.querySelectorAll('[data-route]')) {
  const target = new URL(link.dataset.route, location.href);
  target.search = new URLSearchParams({ light, pattern }).toString();
  link.href = target.href;
}
