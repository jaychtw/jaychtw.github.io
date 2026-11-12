const main = document.querySelector('main');
const toggle = document.querySelector('#language');
function read(key) {
  try { return JSON.parse(localStorage.getItem('comics.' + key)); } catch { return null; }
}
function save(key, value) {
  try { localStorage.setItem('comics.' + key, JSON.stringify(value)); } catch {}
}
let language = read('language') === 1 ? 1 : 0;
const tr = (en, zh) => language ? zh : en;
const local = value => value[language];
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function link(text, href, cls) {
  const node = element('a', text, cls);
  node.href = href;
  return node;
}
function picture(src, alt, cls) {
  const image = element('img', '', cls);
  image.src = src;
  image.alt = local(alt);
  return image;
}
function shelf() {
  main.append(element('h1', tr('The bookshelf','書架')));
  const grid = element('section', '', 'shelf');
  for (const story of stories) {
    const card = link('', '#/' + story.id, 'card');
    card.append(picture(story.cover, story.coverAlt), element('p',local(story.kind),'kind'), element('h2',local(story.title)), element('p',local(story.description)));
    grid.append(card);
  }
  main.append(grid);
}
function detail(story) {
  const base = '#/' + story.id + '/';
  const progress = read(story.id);
  main.append(link(tr('← Bookshelf','← 書架'),'#/'), element('p',local(story.kind),'kind'),element('h1',local(story.title)),picture(story.cover,story.coverAlt,'hero'),element('p',local(story.description),'intro'));
  if (progress && story.episodes.some(e => e.id === progress.episode)) {
    main.append(link(tr('Resume reading','繼續閱讀'),base + progress.episode + (progress.choice ? '/' + progress.choice : '') + '?panel=' + progress.panel,'cta'));
  }
  story.episodes.forEach(ep => main.append(link(local(ep.title) + ' →',base + ep.id,'cta')));
}
function panels(groups, parent) {
  for (const group of groups) {
    const row = element('div','',group.length === 2 ? 'group pair' : 'group');
    for (const p of group) {
      const frame = element('figure');
      frame.id = p.id;
      const wrapper = element('div','', p.crop ? 'crop ' + p.crop : '');
      wrapper.append(picture(p.image,p.alt));
      frame.append(wrapper,element('figcaption',local(p.words)));
      row.append(frame);
    }
    parent.append(row);
  }
}
let active, ready = false;
function remember() {
  if (!active || !ready) return;
  const panel = [...main.querySelectorAll('figure')].find(p => p.getBoundingClientRect().bottom > 20) || Array.from(main.querySelectorAll('figure')).at(-1);
  if (panel) save(active.story.id,{episode:active.ep.id,choice:active.choice?.id,panel:panel.id});
}
function episode(story,ep,choice) {
  const strip = element('article','','strip');
  const base = '#/' + story.id + '/' + ep.id;
  strip.append(link('← ' + local(story.title),'#/' + story.id),element('h1',local(ep.title)));
  panels(ep.groups,strip);
  if (ep.choices) {
    const controls = element('section','','choices');
    controls.id = 'decision';
    controls.append(element('h2',tr('What does Alex do?','艾力克斯要怎麼做？')));
    ep.choices.forEach(c => {
      const a = link(local(c.label),base + '/' + c.id,'cta');
      if (choice === c) a.setAttribute('aria-current','true');
      controls.append(a);
    });
    strip.append(controls);
  }
  if (choice) panels(choice.groups,strip);
  const foot = element('footer');
  if (choice) foot.append(link(tr('Continue in Zero Sum ↗','前往 Zero Sum 繼續閱讀 ↗'),choice.continueURL,'cta'));
  if (!ep.choices || choice) foot.append(link(tr('Back to bookshelf','返回書架'),'#/','cta'));
  strip.append(foot);
  main.append(strip);
  active = {story,ep,choice};
}
function render(anchor) {
  remember();
  ready = false;
  active = null;
  const [path,query] = location.hash.slice(1).split('?');
  const [id,chapter,route] = path.split('/').filter(Boolean);
  const story = stories.find(s => s.id === id);
  const ep = story?.episodes.find(e => e.id === chapter);
  const choice = ep?.choices?.find(c => c.id === route);
  main.replaceChildren();
  document.body.className = ep ? story.theme : '';
  document.documentElement.lang = language ? 'zh-Hant' : 'en';
  toggle.textContent = tr('繁體中文','English');
  toggle.lang = tr('zh-Hant','en');
  if (ep) episode(story,ep,choice);
  else if (story) detail(story);
  else shelf();
  document.title = main.querySelector('h1').textContent + ' · Possibility Comics';
  const target = document.getElementById(anchor?.id || new URLSearchParams(query).get('panel') || choice?.groups[0][0].id);
  if (target) window.scrollBy(0,target.getBoundingClientRect().top - (anchor?.offset ?? 18));
  else window.scrollTo(0,anchor?.y || 0);
  ready = true;
  remember();
}
toggle.onclick = () => {
  const p = [...main.querySelectorAll('figure')].find(el => el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < innerHeight);
  const anchor = p ? {id:p.id,offset:p.getBoundingClientRect().top} : {y:scrollY};
  language = 1-language;
  save('language',language);
  render(anchor);
};
window.addEventListener('scroll',remember,{passive:true});
window.addEventListener('hashchange',() => render());
render();
