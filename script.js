// 获取当前语言，默认en
function getLang() {
  const stored = localStorage.getItem('lang');
  return stored === 'zh' ? 'zh' : 'en';
}

// 设置语言并渲染
function setLang(lang) {
  localStorage.setItem('lang', lang);
  renderI18n(lang);
}

// 渲染所有 data-i18n 文本
function renderI18n(lang) {
  const fallback = window.i18n.en || {};
  const dict = window.i18n[lang] || fallback;
  document.documentElement.setAttribute('lang', lang); 
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key] || fallback[key];
    if (value) {
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        el.textContent = value;
      } else {
        el.innerHTML = value;
      }
    }
  });

  // 渲染 Manifesto
  const manifestoContainer = document.querySelector('.manifesto-list');
  if (manifestoContainer && dict.manifesto) {
    manifestoContainer.innerHTML = '';
    dict.manifesto.forEach(([title, desc]) => {
      const div = document.createElement('div');
      div.className = 'manifesto-item';
      div.innerHTML = `<span class="text-primary-500 text-xl">💜</span>
        <span><strong>${title}</strong> – ${desc}</span>`;
      manifestoContainer.appendChild(div);
    });
  }

  // 渲染 Principles
  const principlesList = document.querySelector('.principles-list');
  if (principlesList && dict.principles) {
    principlesList.innerHTML = '';
    dict.principles.forEach(([title, desc]) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong class="text-primary-600 dark:text-primary-400">${title}</strong> ${desc}`;
      principlesList.appendChild(li);
    });
  }
}

// 语言切换按钮
document.addEventListener('DOMContentLoaded', () => {
  // 挂载 Manifesto 和 Principles 容器
  const manifestoDiv = document.querySelector('.manifesto-list');
  if (!manifestoDiv) {
    const container = document.querySelector('.prose .mt-0.mb-8');
    if (container) {
      const div = document.createElement('div');
      div.className = 'manifesto-list';
      container.parentNode.replaceChild(div, container);
    }
  }
  const principlesOl = document.querySelector('.principles-list');
  if (!principlesOl) {
    const ol = document.querySelector('.prose ol');
    if (ol) {
      ol.classList.add('principles-list');
    }
  }

  // 渲染初始语言
  renderI18n(getLang());

  // 绑定切换
  const btn = document.getElementById('lang-switch');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = getLang() === 'en' ? 'zh' : 'en';
      setLang(next);
    });
  }
});

// Check for system dark mode preference
document.addEventListener('DOMContentLoaded', () => {
  // Only set dark mode from system preference if user hasn't manually set a preference
  if (localStorage.getItem('darkMode') === null) {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      document.body.__x.$data.darkMode = true;
    }
  }

  // Add subtle animations to manifest items
  const manifestoItems = document.querySelectorAll('.manifesto-item');
  manifestoItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(10px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 200 + (index * 150));
  });
});

