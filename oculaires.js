(() => {
  'use strict';
  const trigger = document.getElementById('open-eyepieces');
  if (!trigger) return;
  const telescopeFocalLength = 1250;
  const eyepieces = [
    {focal:32,favorite:true,description:'C’est celui que j’utilise le plus souvent pour mes photos de la Lune : son cadrage me convient particulièrement. Son usure prononcée raconte ses nombreuses séances à mes côtés.'},
    {focal:25,description:'Un grossissement modéré pour découvrir la Lune avec un cadrage assez large, avant de passer aux détails.'},
    {focal:17,description:'Une étape intermédiaire pour se rapprocher des formations lunaires et explorer une zone plus précise.'},
    {focal:13,description:'Un cadrage plus serré pour observer les cratères et les reliefs proches de la frontière entre l’ombre et la lumière.'},
    {focal:9,description:'Un grossissement plus fort pour examiner une portion de la surface, lorsque la stabilité de l’image le permet.'},
    {focal:8,description:'Pour se concentrer sur une petite région lunaire. À ce grossissement, la stabilité de l’atmosphère devient particulièrement importante.'},
    {focal:6,description:'Le grossissement le plus élevé de ma série. Il agrandit davantage l’image, sans garantir plus de détails si les conditions d’observation ne suivent pas.'}
  ];
  const gallery = document.createElement('dialog');
  gallery.className = 'filter-gallery eyepiece-gallery';
  gallery.setAttribute('aria-labelledby','eyepiece-gallery-title');
  gallery.innerHTML = `
    <header class="gallery-header">
      <div><p class="gallery-eyebrow">Du champ aux détails</p><h2 id="eyepiece-gallery-title">Mes oculaires</h2><p class="gallery-date">Les compagnons de mes observations</p></div>
      <button type="button" class="gallery-close" aria-label="Fermer les oculaires">×</button>
    </header>
    <div class="filter-choices eyepiece-choices" role="group" aria-label="Choisir un oculaire"></div>
    <div class="eyepiece-layout">
      <div class="eyepiece-stage" data-loading="true" aria-busy="true">
        <img class="eyepiece-photo" alt="" width="1254" height="1254" decoding="async">
        <span class="eyepiece-status" role="status">Chargement de l’oculaire…</span>
        <span class="eyepiece-stage-label">Mon matériel, au fil des nuits</span>
      </div>
      <section class="eyepiece-details" aria-labelledby="eyepiece-name">
        <span class="eyepiece-favorite">Mon plus utilisé</span>
        <p class="eyepiece-kicker">Focale de l’oculaire</p>
        <h3 id="eyepiece-name"></h3>
        <p class="eyepiece-description"></p>
        <div class="eyepiece-magnification"><span>Grossissement avec mon télescope</span><strong></strong></div>
        <p class="eyepiece-formula"></p>
        <p class="eyepiece-setup">Celestron NexStar 90 · focale de 1 250 mm<br>Grossissement optique, sans lentille de Barlow.</p>
      </section>
    </div>
    <footer class="gallery-footer">
      <p class="gallery-source">7 oculaires · mes propres photographies<br><a href="https://www.celestron.com/blogs/knowledgebase/what-is-magnification-power-as-it-pertains-to-telescopes" target="_blank" rel="noopener noreferrer">Comprendre le grossissement ↗</a></p>
      <div class="gallery-paging"><button class="eyepiece-previous" type="button" aria-label="Oculaire précédent">←</button><span class="gallery-count" aria-live="polite" aria-atomic="true"></span><button class="eyepiece-next" type="button" aria-label="Oculaire suivant">→</button></div>
    </footer>`;
  document.body.append(gallery);
  const get = selector => gallery.querySelector(selector);
  const choices = get('.eyepiece-choices');
  const stage = get('.eyepiece-stage');
  const photo = get('.eyepiece-photo');
  const status = get('.eyepiece-status');
  let current = 0, revision = 0;

  eyepieces.forEach((eyepiece,index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-choice';
    button.setAttribute('aria-pressed','false');
    if (eyepiece.favorite) button.setAttribute('aria-label',`${eyepiece.focal} mm — mon plus utilisé`);
    button.textContent = `${eyepiece.focal} mm`;
    button.addEventListener('click',() => select(index));
    choices.append(button);
  });

  async function select(index) {
    current = (index + eyepieces.length) % eyepieces.length;
    const eyepiece = eyepieces[current];
    const ticket = ++revision;
    const magnification = Math.round(telescopeFocalLength / eyepiece.focal);
    Array.from(choices.children).forEach((button,i) => button.setAttribute('aria-pressed',String(i === current)));
    get('#eyepiece-name').textContent = `${eyepiece.focal} mm`;
    get('.eyepiece-description').textContent = eyepiece.description;
    get('.eyepiece-favorite').hidden = !eyepiece.favorite;
    get('.eyepiece-magnification strong').textContent = `≈ ${magnification}×`;
    get('.eyepiece-formula').textContent = `1 250 mm ÷ ${eyepiece.focal} mm ≈ ${magnification}×`;
    get('.gallery-count').textContent = `${String(current + 1).padStart(2,'0')} / 07`;
    stage.dataset.loading = 'true';
    stage.setAttribute('aria-busy','true');
    status.hidden = false;
    status.textContent = 'Chargement de l’oculaire…';
    try {
      const src = `assets/materiel/oculaire-${eyepiece.focal}mm.png`;
      await new Promise((resolve,reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = src;
      });
      if (ticket !== revision || !gallery.open) return;
      photo.src = src;
      photo.alt = `Mon oculaire de ${eyepiece.focal} mm détouré`;
      if (photo.decode) await photo.decode().catch(() => {});
      if (ticket !== revision || !gallery.open) return;
      stage.dataset.focal = String(eyepiece.focal);
      stage.dataset.loading = 'false';
      stage.setAttribute('aria-busy','false');
      status.hidden = true;
    } catch {
      if (ticket !== revision || !gallery.open) return;
      status.textContent = 'L’image ne s’est pas chargée. Sélectionne à nouveau cet oculaire pour réessayer.';
      stage.setAttribute('aria-busy','false');
    }
  }
  trigger.addEventListener('click',() => {
    gallery.showModal();
    select(0);
    get('.gallery-close').focus();
  });
  get('.gallery-close').addEventListener('click',() => gallery.close());
  gallery.addEventListener('close',() => { revision++; trigger.focus(); });
  gallery.addEventListener('click',event => {
    if (event.target !== gallery) return;
    const box = gallery.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) gallery.close();
  });
  gallery.addEventListener('keydown',event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  get('.eyepiece-previous').addEventListener('click',() => select(current - 1));
  get('.eyepiece-next').addEventListener('click',() => select(current + 1));
})();
