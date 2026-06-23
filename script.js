document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const nameGroup = document.getElementById('nameGroup');
  const submitBtn = document.getElementById('submitBtn');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const stocksGrid = document.getElementById('stocksGrid');
  const newsList = document.getElementById('newsList');
  const openProModalButtons = [document.getElementById('openProModal'), document.getElementById('openProModal2')].filter(Boolean);
  const closeProModal = document.getElementById('closeProModal');
  const proModal = document.getElementById('proModal');
  const proModalBackdrop = document.getElementById('proModalBackdrop');
  const planButtons = document.querySelectorAll('.plan-btn');
  const proPrice = document.getElementById('proPrice');
  const proPeriod = document.getElementById('proPeriod');
  const saveBadge = document.getElementById('saveBadge');

  const routeMap = {
    home: 'index.html',
    markets: 'market.html',
    portfolio: 'portfolio.html',
    profile: 'auth.html',
    detail: 'detail.html',
    pro: 'pro.html'
  };

  const setActiveNav = () => {
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('[data-nav]').forEach((el) => {
      const key = el.dataset.nav;
      const href = routeMap[key];
      const isActive = href && href.toLowerCase() === current;
      el.classList.toggle('active', isActive);
    });
  };

  const go = (key) => {
    const target = routeMap[key];
    if (target) window.location.href = target;
  };

  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const key = el.dataset.nav;
      if (routeMap[key]) {
        e.preventDefault();
        go(key);
      }
    });
  });

  document.querySelectorAll('[data-link]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.link;
      if (routeMap[target]) {
        e.preventDefault();
        go(target);
      }
    });
  });

  setActiveNav();

  const setTheme = (theme) => {
    body.classList.remove('theme-dark', 'theme-light');
    body.classList.add(theme);
    if (themeToggle) themeToggle.textContent = theme === 'theme-dark' ? '☼' : '☾';
  };

  const savedTheme = localStorage.getItem('stockpulse-theme') || 'theme-dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = body.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
      setTheme(next);
      localStorage.setItem('stockpulse-theme', next);
    });
  }

  const setMode = (mode) => {
    const isRegister = mode === 'register';
    loginTab?.classList.toggle('active', !isRegister);
    registerTab?.classList.toggle('active', isRegister);
    nameGroup?.classList.toggle('d-none', !isRegister);
    if (submitBtn) submitBtn.textContent = isRegister ? 'Create Account' : 'Log in';
  };

  loginTab?.addEventListener('click', () => setMode('login'));
  registerTab?.addEventListener('click', () => setMode('register'));
  setMode('register');

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      if (stocksGrid && newsList) {
        const showStocks = mode === 'stocks';
        stocksGrid.classList.toggle('d-none', !showStocks);
        newsList.classList.toggle('d-none', showStocks);
      }
    });
  });

  const openModal = () => {
    proModal?.classList.remove('d-none');
    proModalBackdrop?.classList.remove('d-none');
  };
  const closeModal = () => {
    proModal?.classList.add('d-none');
    proModalBackdrop?.classList.add('d-none');
  };

  openProModalButtons.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  closeProModal?.addEventListener('click', closeModal);
  proModalBackdrop?.addEventListener('click', closeModal);

  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      planButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const plan = btn.dataset.plan;
      if (plan === 'annual') {
        proPrice.textContent = '$99.99';
        proPeriod.textContent = 'per year';
        saveBadge?.classList.remove('d-none');
      } else {
        proPrice.textContent = '$12.99';
        proPeriod.textContent = 'per month';
        saveBadge?.classList.add('d-none');
      }
    });
  });
});