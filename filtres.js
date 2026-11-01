(() => {
  'use strict';
  const trigger = document.getElementById('open-filters');
  if (!trigger) return;
  const root = 'assets/materiel/';
  const filters = [
    {id:'bleu',name:'Bleu',color:'#5275e0',description:'Une dominante froide pour explorer les détails de la surface lunaire. Voici le rendu obtenu avec mon filtre bleu.'},
    {id:'vert-clair',name:'Vert clair',color:'#9ebc70',description:'Un filtre vert plus clair, utilisé pour faire ressortir les détails de la surface. À comparer avec le vert plus soutenu.'},
    {id:'vert',name:'Vert',color:'#3d875b',description:'Une teinte verte plus soutenue qui modifie le contraste et atténue davantage la lumière que le vert clair.'},
    {id:'jaune',name:'Jaune',color:'#e5c34c',description:'Une teinte chaude qui peut accentuer le contraste des formations lunaires. Une autre façon de parcourir les mers et les cratères.'},
    {id:'orange',name:'Orange',color:'#da8042',description:'Un rendu plus chaud, utilisé pour souligner les formations de la surface lunaire. Cette photo montre mon résultat au télescope.'},
    {id:'rouge',name:'Rouge',color:'#bd5360',description:'Un filtre qui atténue fortement la lumière et favorise les tons rouges. Il offre une lecture différente des reliefs lunaires.'},
    {id:'lunaire',name:'Lunaire',color:'#a5adb3',description:'Un filtre destiné à réduire l’éclat de la Lune pour rendre l’observation plus confortable, notamment lorsqu’elle est très lumineuse.'},
    {id:'sans-filtre',name:'Sans filtre',color:'#e8e3d5',description:'La Lune photographiée sans filtre lors de la même séance. Une image de référence pour découvrir les différences entre mes prises de vue.'}
  ];
  const gallery = document.createElement('dialog');
  gallery.className = 'filter-gallery';
  gallery.setAttribute('aria-labelledby','filter-gallery-title');
  gallery.innerHTML = `
    <header class="gallery-header">
      <div><p class="gallery-eyebrow">Une même nuit, plusieurs regards</p><h2 id="filter-gallery-title">À travers mes filtres</h2><p class="gallery-date">Mes photographies · 31 octobre 2026</p></div>
      <button type="button" class="gallery-close" aria-label="Fermer la galerie">×</button>
    </header>
    <div class="filter-choices" role="group" aria-label="Choisir un filtre"></div>
    <div class="filter-layout">
      <section class="filter-description" aria-labelledby="filter-name">
        <div class="filter-product"><img class="filter-png" alt="" width="1254" height="1254"><span class="unfiltered-symbol" aria-hidden="true" hidden>◯</span></div>
        <div><p class="filter-type"></p><h3 id="filter-name"></h3><p class="filter-copy"></p></div>
      </section>
      <div class="moon-stage" data-loading="true" aria-busy="true">
        <img class="moon-photo" alt="" decoding="async">
        <span class="photo-status" role="status">Chargement de la photographie…</span>
        <span class="photo-label"></span>
        <button type="button" class="compare-filter" aria-pressed="false">Voir sans filtre</button>
      </div>
    </div>
    <footer class="gallery-footer">
      <p class="gallery-source">7 filtres · 8 prises de vue<br><a href="https://www.celestron.com/blogs/knowledgebase/what-are-the-different-types-of-eyepiece-filters-colored-neutral-density-and-polarizing" target="_blank" rel="noopener noreferrer">À propos des filtres ↗</a></p>
      <div class="gallery-paging"><button type="button" class="filter-previous" aria-label="Filtre précédent">←</button><span class="gallery-count" aria-live="polite" aria-atomic="true"></span><button type="button" class="filter-next" aria-label="Filtre suivant">→</button></div>
    </footer>`;
  document.body.append(gallery);
  const get = selector => gallery.querySelector(selector);
  const choices = get('.filter-choices');
  const product = get('.filter-png');
  const symbol = get('.unfiltered-symbol');
  const photo = get('.moon-photo');
  const stage = get('.moon-stage');
  const status = get('.photo-status');
  const compare = get('.compare-filter');
  let current = 0, comparing = false, revision = 0;
  const photoCache = new Map();
  // Position du disque dans chaque photographie, pour cadrer sans retoucher les images.
  const framing = {
    'bleu':[.517,.540,.441,.232], 'vert-clair':[.535,.482,.476,.220],
    'vert':[.535,.532,.462,.224], 'jaune':[.513,.588,.490,.232],
    'orange':[.499,.548,.519,.248], 'rouge':[.495,.554,.469,.220],
    'lunaire':[.584,.526,.476,.204], 'sans-filtre':[.563,.632,.476,.240]
  };
  function framePhoto() {
    if (!photo.naturalWidth || !stage.clientWidth || !stage.clientHeight) return;
    const [cx,cy,w,h] = framing[photo.dataset.filter || 'bleu'];
    const scale = Math.min(stage.clientWidth * .84 / (w * photo.naturalWidth),stage.clientHeight * .8 / (h * photo.naturalHeight));
    const width = photo.naturalWidth * scale, height = photo.naturalHeight * scale;
    Object.assign(photo.style,{width:`${width}px`,height:`${height}px`,left:`${stage.clientWidth / 2 - cx * width}px`,top:`${stage.clientHeight / 2 - cy * height}px`});
  }
  new ResizeObserver(framePhoto).observe(stage);

  function loadPhoto(src) {
    if (!photoCache.has(src)) {
      const pending = new Promise((resolve,reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => { photoCache.delete(src); reject(new Error('Photographie indisponible')); };
        image.src = src;
      });
      photoCache.set(src,pending);
    }
    return photoCache.get(src);
  }

  filters.forEach((filter,index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-choice';
    button.style.setProperty('--filter-color',filter.color);
    button.setAttribute('aria-pressed','false');
    const dot = document.createElement('span');
    dot.className = 'filter-dot';
    dot.setAttribute('aria-hidden','true');
    button.append(dot,document.createTextNode(filter.name));
    button.addEventListener('click',() => select(index));
    choices.append(button);
  });

  async function render() {
    const ticket = ++revision;
    const filter = filters[current];
    const unfiltered = filter.id === 'sans-filtre';
    Array.from(choices.children).forEach((button,index) => button.setAttribute('aria-pressed',String(index === current)));
    get('#filter-name').textContent = unfiltered ? 'Sans filtre' : `Filtre ${filter.name.toLowerCase()}`;
    get('.filter-type').textContent = unfiltered ? 'La prise de référence' : filter.id === 'lunaire' ? 'Observation lunaire' : 'Filtre de couleur';
    get('.filter-copy').textContent = filter.description;
    get('.gallery-count').textContent = `${String(current + 1).padStart(2,'0')} / 08`;
    product.hidden = unfiltered;
    symbol.hidden = !unfiltered;
    if (!unfiltered) {
      product.alt = `Mon filtre ${filter.name.toLowerCase()} détouré`;
      product.src = `${root}filtre-${filter.id}.png`;
    }
    compare.hidden = unfiltered;
    compare.setAttribute('aria-pressed',String(comparing));
    compare.textContent = comparing ? 'Revenir au filtre' : 'Voir sans filtre';
    const shown = comparing || unfiltered ? 'sans-filtre' : filter.id;
    const label = shown === 'sans-filtre' ? 'Sans filtre' : `Avec le filtre ${filter.name.toLowerCase()}`;
    get('.photo-label').textContent = label;
    stage.dataset.loading = 'true';
    stage.setAttribute('aria-busy','true');
    status.textContent = 'Chargement de la photographie…';
    status.hidden = false;
    try {
      const image = await loadPhoto(`${root}lune-${shown}.jpg`);
      if (ticket !== revision || !gallery.open) return;
      photo.src = image.src;
      photo.dataset.filter = shown;
      photo.alt = `La Lune du 31 octobre 2026 — ${label.toLowerCase()}`;
      if (photo.decode) await photo.decode().catch(() => {});
      if (ticket !== revision || !gallery.open) return;
      framePhoto();
      status.hidden = true;
      stage.dataset.loading = 'false';
      stage.setAttribute('aria-busy','false');
      loadPhoto(`${root}lune-sans-filtre.jpg`).catch(() => {});
    } catch {
      if (ticket !== revision || !gallery.open) return;
      status.textContent = 'Cette photographie ne s’est pas chargée. Sélectionne à nouveau le filtre pour réessayer.';
      stage.setAttribute('aria-busy','false');
    }
  }

  function select(index) {
    current = (index + filters.length) % filters.length;
    comparing = false;
    render();
  }

  trigger.addEventListener('click',() => {
    gallery.showModal();
    select(0);
    get('.gallery-close').focus();
  });
  get('.gallery-close').addEventListener('click',() => gallery.close());
  gallery.addEventListener('close',() => { revision++; trigger.focus(); });
  gallery.addEventListener('click',event => { if (event.target === gallery) {
    const box = gallery.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) gallery.close();
  }});
  gallery.addEventListener('keydown',event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      select(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  compare.addEventListener('click',() => { comparing = !comparing; render(); });
  get('.filter-previous').addEventListener('click',() => select(current - 1));
  get('.filter-next').addEventListener('click',() => select(current + 1));
})();
