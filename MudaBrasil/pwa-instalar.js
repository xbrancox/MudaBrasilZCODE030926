/* VotaBrasil PWA installer v8 - registra SW, botao Instalar App, dica iOS */
(function () {
  'use strict';

  /* 1. Registra o Service Worker */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        console.log('[VotaBrasil] SW ativo:', reg.scope);
      }).catch(function (e) {
        console.warn('[VotaBrasil] SW falhou:', e);
      });
    });
  }

  /* 2. Botao Instalar App (Android/Chrome/Edge) */
  var deferred = null;

  function showBtn() {
    if (document.querySelector('#vb-install-btn')) return;
    var b = document.createElement('button');
    b.id = 'vb-install-btn';
    b.type = 'button';
    b.textContent = 'Instalar App';
    b.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9999;padding:12px 18px;background:#009739;color:#fff;border:0;border-radius:24px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.45)';
    b.onclick = function () {
      if (deferred) {
        deferred.prompt();
        deferred.userChoice.then(function () {
          b.remove();
          deferred = null;
        });
      } else {
        alert('Use o menu do navegador: Adicionar a tela inicial / Instalar app');
      }
    };
    document.body.appendChild(b);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    showBtn();
  });

  window.addEventListener('appinstalled', function () {
    var b = document.querySelector('#vb-install-btn');
    if (b) b.remove();
  });

  /* Mostra o botao tambem apos 5s se o navegador nao disparar o evento */
  setTimeout(function () {
    var standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    if (!standalone && !document.querySelector('#vb-install-btn')) showBtn();
  }, 5000);

  /* 3. Dica para iPhone/iPad */
  var ua = window.navigator.userAgent || '';
  var ios = /iphone|ipad|ipod/i.test(ua);
  var standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  if (ios && !standalone && !localStorage.getItem('vb_ios_hint')) {
    setTimeout(function () {
      var d = document.createElement('div');
      d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;background:#0B132B;color:#fff;padding:12px 16px;font-size:14px;z-index:9999;border-top:2px solid #FFD700';
      d.innerHTML = 'No iPhone: toque em Compartilhar e depois em Adicionar a Tela de Inicio. ' +
        '<button id="vb-ios-ok" style="margin-left:8px;padding:6px 10px;border:0;border-radius:6px;background:#FFD700;color:#0B132B;font-weight:700">OK</button>';
      document.body.appendChild(d);
      var ok = document.querySelector('#vb-ios-ok');
      if (ok) ok.onclick = function () {
        localStorage.setItem('vb_ios_hint', '1');
        d.remove();
      };
    }, 3000);
  }
})();
