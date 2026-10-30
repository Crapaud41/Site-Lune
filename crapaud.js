/* Easter egg : un clic sur un élément portant l'attribut data-crapaud
   fait traverser l'écran à un chat qui porte un crapaud sur son dos.
   Utilisation : <script src="crapaud.js"></script> + <span data-crapaud>🐸</span> */
(function () {
  if (window.__crapaudEgg) return;
  window.__crapaudEgg = true;

  var CSS = [
    '.cx-wrap{position:fixed;left:0;bottom:1.5vh;z-index:2147483000;pointer-events:none;width:var(--cx-w);will-change:transform}',
    '.cx-wrap svg{display:block;width:100%;height:auto;overflow:visible}',
    '.cx-leg{animation:cx-swing var(--cx-step) ease-in-out infinite}',
    '.cx-b{animation-delay:calc(var(--cx-step) / -2)}',
    '@keyframes cx-swing{0%,100%{transform:rotate(-17deg)}50%{transform:rotate(17deg)}}',
    '.cx-bob{animation:cx-bob calc(var(--cx-step) / 2) ease-in-out infinite}',
    '@keyframes cx-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}',
    '.cx-tail{transform-origin:58px 88px;animation:cx-tail 1.6s ease-in-out infinite}',
    '@keyframes cx-tail{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(9deg)}}',
    '.cx-frog{animation:cx-frog calc(var(--cx-step) / 2) ease-in-out infinite;animation-delay:calc(var(--cx-step) / -8)}',
    '@keyframes cx-frog{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}',
    '.cx-eye{transform-box:fill-box;transform-origin:center;animation:cx-blink 3.2s infinite}',
    '@keyframes cx-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}',
    '.cx-say{position:absolute;left:36%;top:12%;transform:translate(-50%,-100%) scale(.6);opacity:0;',
    'transition:opacity .25s ease,transform .25s ease;white-space:nowrap;',
    "font:italic 600 clamp(14px,2.2vmin,22px)/1 'Cormorant Garamond',Georgia,serif;color:#f0d9a8;",
    'background:rgba(6,8,20,.88);border:1px solid rgba(232,193,122,.4);padding:.35em .75em;border-radius:999px}',
    '.cx-say.on{opacity:1;transform:translate(-50%,-100%) scale(1)}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* Une patte : pivote autour de la hanche (x, 104) */
  function leg(x, far, phase) {
    var fur = far ? '#12142a' : '#1a1d33';
    var rim = far ? '.35' : '.65';
    return '<g class="cx-leg cx-' + phase + '" style="transform-origin:' + x + 'px 104px">' +
      '<path d="M' + (x - 8.5) + ' 100 L' + (x + 8.5) + ' 100 L' + (x + 7) + ' 146 Q' + (x + 7) + ' 155 ' + x + ' 155 Q' + (x - 7) + ' 155 ' + (x - 7) + ' 146 Z" ' +
      'fill="' + fur + '" stroke="#f0d9a8" stroke-opacity="' + rim + '" stroke-width="1.2"/>' +
      '<ellipse cx="' + x + '" cy="149.5" rx="8.2" ry="5.6" fill="' + (far ? '#cfcdc4' : '#f4f2ea') + '"/></g>';
  }

  var SVG =
    '<svg viewBox="0 0 320 170" aria-hidden="true">' +
    '<defs><clipPath id="cx-bodyclip"><ellipse cx="124" cy="92" rx="72" ry="34"/></clipPath></defs>' +
    /* pattes (derrière le corps) : paires diagonales */
    leg(162, true, 'b') + leg(88, true, 'a') + leg(104, false, 'b') + leg(180, false, 'a') +
    '<g class="cx-bob">' +
      /* queue */
      '<g class="cx-tail">' +
        '<path d="M58 88 C26 90 14 58 36 36" fill="none" stroke="#f0d9a8" stroke-opacity=".5" stroke-width="12.5" stroke-linecap="round"/>' +
        '<path d="M58 88 C26 90 14 58 36 36" fill="none" stroke="#1a1d33" stroke-width="9.5" stroke-linecap="round"/>' +
      '</g>' +
      /* corps + plastron blanc */
      '<ellipse cx="124" cy="92" rx="72" ry="34" fill="#1a1d33" stroke="#f0d9a8" stroke-opacity=".55" stroke-width="2.2"/>' +
      '<ellipse cx="180" cy="106" rx="24" ry="26" fill="#f4f2ea" clip-path="url(#cx-bodyclip)"/>' +
      /* tête */
      '<path d="M195 56 L197 29 L213 47 Z" fill="#1a1d33" stroke="#f0d9a8" stroke-opacity=".55" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M223 47 L239 29 L241 58 Z" fill="#1a1d33" stroke="#f0d9a8" stroke-opacity=".55" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<circle cx="218" cy="73" r="27" fill="#1a1d33" stroke="#f0d9a8" stroke-opacity=".55" stroke-width="2"/>' +
      '<ellipse cx="218" cy="86" rx="15" ry="11" fill="#f4f2ea"/>' +
      '<ellipse cx="208" cy="71" rx="4.4" ry="5.4" fill="#e8c17a"/><ellipse cx="208" cy="71" rx="1.4" ry="4.2" fill="#1a1d33"/>' +
      '<ellipse cx="228" cy="71" rx="4.4" ry="5.4" fill="#e8c17a"/><ellipse cx="228" cy="71" rx="1.4" ry="4.2" fill="#1a1d33"/>' +
      '<path d="M215.5 80 L220.5 80 L218 83.5 Z" fill="#e9a3a8"/>' +
      '<path d="M218 83.5 Q214 88 210.5 86 M218 83.5 Q222 88 225.5 86" fill="none" stroke="#6b6f88" stroke-width="1.1" stroke-linecap="round"/>' +
      '<path d="M203 84 L186 80 M203 87 L186 90 M233 84 L250 80 M233 87 L250 90" stroke="#f4f2ea" stroke-opacity=".7" stroke-width="1" stroke-linecap="round"/>' +
      /* le crapaud, assis sur le dos */
      '<g class="cx-frog">' +
        '<ellipse cx="101" cy="62" rx="11" ry="6" fill="#3f8f55" transform="rotate(-22 101 62)"/>' +
        '<ellipse cx="118" cy="50" rx="20" ry="13" fill="#5db36f"/>' +
        '<ellipse cx="124" cy="55" rx="11" ry="6.5" fill="#b9e2a2"/>' +
        '<circle cx="110" cy="46" r="2.2" fill="#3f8f55"/><circle cx="116" cy="42" r="1.8" fill="#3f8f55"/><circle cx="106" cy="52" r="1.6" fill="#3f8f55"/>' +
        '<circle cx="109" cy="38" r="6.6" fill="#5db36f"/><circle cx="127" cy="38" r="6.6" fill="#5db36f"/>' +
        '<g class="cx-eye"><circle cx="109" cy="37" r="4.6" fill="#fff"/><circle cx="110.6" cy="37.5" r="2.2" fill="#1a1d33"/></g>' +
        '<g class="cx-eye"><circle cx="127" cy="37" r="4.6" fill="#fff"/><circle cx="128.6" cy="37.5" r="2.2" fill="#1a1d33"/></g>' +
        '<path d="M106 50 Q116 56 130 49" fill="none" stroke="#2f6f43" stroke-width="1.5" stroke-linecap="round"/>' +
        '<ellipse cx="131" cy="61" rx="6" ry="3.4" fill="#4ea062" transform="rotate(20 131 61)"/>' +
      '</g>' +
    '</g>' +
    '</svg>';

  var running = false;

  function start() {
    if (running) return;
    running = true;
    var W = window.innerWidth, H = window.innerHeight;
    var w = Math.max(190, Math.min(420, Math.min(W, H) * 0.30));       // taille du chat
    var dur = Math.max(5500, Math.min(10000, W * 4));                  // durée de la traversée (ms)
    var speed = (W + w) / (dur / 1000);                                // px par seconde
    var step = Math.max(0.4, Math.min(1.2, (0.75 * w) / speed));       // cadence des pas (pas de glissade)

    var el = document.createElement('div');
    el.className = 'cx-wrap';
    el.style.setProperty('--cx-w', w + 'px');
    el.style.setProperty('--cx-step', step + 's');
    el.style.transform = 'translateX(' + (-w) + 'px)';
    el.innerHTML = SVG + '<span class="cx-say">croâ</span>';
    document.body.appendChild(el);

    var say = el.querySelector('.cx-say');
    setTimeout(function () { say.classList.add('on'); }, dur * 0.3);
    setTimeout(function () { say.classList.remove('on'); }, dur * 0.3 + 1600);

    var anim = el.animate(
      [{ transform: 'translateX(' + (-w) + 'px)' }, { transform: 'translateX(' + W + 'px)' }],
      { duration: dur, easing: 'linear', fill: 'forwards' }
    );
    anim.onfinish = function () { el.remove(); running = false; };
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('[data-crapaud]')) start();
  });
})();
