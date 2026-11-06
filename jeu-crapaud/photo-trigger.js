/* Surprise de l'album Animaux : clic, flèches et retour à la bonne page. */
(function () {
  'use strict';
  var key = 'au-fil-des-nuits.crapaud.completed.v1';
  var entering = false;
  var completed = false;
  function read() { try { return sessionStorage.getItem(key) === '1'; } catch (e) { return completed; } }
  function clear() { completed = false; try { sessionStorage.removeItem(key); } catch (e) {} }
  try { if (performance.getEntriesByType('navigation')[0]?.type === 'reload') clear(); } catch (e) {}
  window.addEventListener('pageshow',function(){entering=false;});
  function secret(src) {
    try { return decodeURIComponent(new URL(src, location.href).pathname).endsWith('/photos/nature/animaux/02 Juillet 2026.jpg'); }
    catch (e) { return false; }
  }
  function canPlay() {
    var n = navigator;
    if (n.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Mobile/i.test(n.userAgent || '')) return false;
    // iPadOS peut annoncer un navigateur Mac lorsqu'il affiche la version ordinateur.
    if (n.platform === 'MacIntel' && n.maxTouchPoints > 1) return false;
    return !(window.matchMedia && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(any-pointer: fine)').matches);
  }
  window.CrapaudSurprise = {
    isSecret: secret,
    canPlay: canPlay,
    completed: read,
    reset: clear,
    // true : cette photo est traitée ici, ne pas ouvrir la visionneuse normale.
    enter: function (src, returnState, gameUrl) {
      if (!secret(src) || read() || !canPlay()) return false;
      if (entering) return true;
      entering = true;
      try {
        sessionStorage.setItem('crapaud_return_url', location.href);
        sessionStorage.setItem('crapaud_return_state', JSON.stringify(returnState || {}));
      } catch (e) {}
      location.assign(new URL(gameUrl || 'jeu-crapaud/index.html', location.href).href);
      return true;
    },
    // Après la partie, la photo reprend sa place normale dans la visionneuse.
    nextIndex: function (photos, current, direction) {
      if (!photos.length) return -1;
      return ((current + direction) % photos.length + photos.length) % photos.length;
    },
    takeReturnState: function () {
      try { var value = sessionStorage.getItem('crapaud_return_state'); sessionStorage.removeItem('crapaud_return_state'); return value ? JSON.parse(value) : null; }
      catch (e) { return null; }
    }
  };
})();
