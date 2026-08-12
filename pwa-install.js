(() => {
  let installPrompt = null;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const buttons = () => [...document.querySelectorAll('[data-pwa-install], #pwaInstallBtn')];
  const promos = () => [...document.querySelectorAll('[data-pwa-promo]')];

  function notify(message) {
    if (typeof window.toast === 'function') window.toast(message);
    const status = document.querySelector('[data-install-status]');
    if (status) status.textContent = message;
  }

  function refresh() {
    const installed = standalone();
    buttons().forEach(button => {
      button.classList.toggle('hidden', installed || (!installPrompt && !ios && button.id === 'pwaInstallBtn'));
      button.disabled = installed;
      if (installed) button.textContent = `✓ ${I18n.t('installed')}`;
    });
    promos().forEach(promo => promo.classList.toggle('hidden', installed));
    document.documentElement.classList.toggle('pwa-standalone', installed);
  }

  async function requestInstall() {
    if (standalone()) {
      notify(I18n.t('alreadyInstalled'));
      return;
    }
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      installPrompt = null;
      if (result.outcome === 'accepted') notify(I18n.t('installStarted'));
      refresh();
      return;
    }
    const guide = ios ? '/installa.html#iphone' : '/installa.html#istruzioni';
    if (location.pathname !== '/installa.html') location.href = guide;
    else document.querySelector(ios ? '#iphone' : '#istruzioni')?.scrollIntoView({behavior:'smooth'});
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    refresh();
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    try { localStorage.setItem('meteo-ai-installed', new Date().toISOString()); } catch (_) {}
    notify(I18n.t('installComplete'));
    refresh();
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-pwa-install], #pwaInstallBtn');
    if (button) {
      event.preventDefault();
      requestInstall();
    }
  });
  window.addEventListener('DOMContentLoaded', refresh);
  document.addEventListener('meteo:languagechange', refresh);
  window.meteoInstallPWA = requestInstall;
})();
