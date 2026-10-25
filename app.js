// Edit these short descriptions and tags to match the images on each project card.
const projects = {
  one: {
    index: '01',
    title: 'Urban Fashion Style',
    summary: 'A website for browsing streetwear and clothing collections.',
    challenge: 'I wanted to make a page to show urban clothing and outfit ideas.',
    solution: 'I built a fashion page with outfit photos, navigation, and product sections.',
    role: 'I worked on the page layout and styling.',
    tags: ['Streetwear', 'Clothing', 'Fashion website'],
  },
  two: {
    index: '02',
    title: 'MovieFlix',
    summary: 'A movie site with search, genres, and movie details.',
    challenge: 'I wanted to make movie choices easier to explore.',
    solution: 'I made a movie page with search, genre filters, and movie cards.',
    role: 'I worked on the page layout and movie browsing sections.',
    tags: ['Movie catalog', 'Search', 'Genre filters'],
  },
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) document.body.classList.add('no-motion');

function getSavedImage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveImage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file.'));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error('Choose an image smaller than 12 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('This image could not be opened.'));
    reader.onload = () => {
      const source = new Image();
      source.onerror = () => reject(new Error('This image could not be opened.'));
      source.onload = () => {
        const scale = Math.min(1, 1400 / source.naturalWidth, 1000 / source.naturalHeight);
        const width = Math.round(source.naturalWidth * scale);
        const height = Math.round(source.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Your browser could not prepare this image.'));
          return;
        }
        context.fillStyle = '#11110f';
        context.fillRect(0, 0, width, height);
        context.drawImage(source, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      source.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function getImageAccent(image) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, 1, 1);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta) {
      if (max === r) hue = ((g - b) / delta) % 6;
      else if (max === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
    }
    hue = (hue * 60 + 360) % 360;
    const lightness = ((max + min) / 2) * 100;
    return `hsl(${Math.round(hue)} 72% ${Math.round(Math.min(65, Math.max(42, lightness)))}%)`;
  } catch {
    return '#d2fb67';
  }
}

const profileImage = $('#profile-image');
const profileFallback = $('.profile-fallback');
if (profileImage && profileFallback) {
  profileImage.addEventListener('error', () => {
    profileImage.hidden = true;
    profileFallback.hidden = false;
  });
}

$$('[data-project]').forEach((card) => {
  const project = projects[card.dataset.project];
  const image = $('.project-image img', card);
  const tagList = $('.project-tags', card);
  if (!project || !image) return;
  if (tagList) {
    tagList.replaceChildren(
      ...project.tags.map((tag) => {
        const chip = document.createElement('span');
        chip.textContent = tag;
        return chip;
      }),
    );
  }
  image.addEventListener('load', () => {
    card.style.setProperty('--project-accent', getImageAccent(image));
  });
  if (image.complete && image.naturalWidth) {
    card.style.setProperty('--project-accent', getImageAccent(image));
  }
  const savedProjectImage = getSavedImage(`portfolio-project-image-${card.dataset.project}`);
  if (savedProjectImage) image.src = savedProjectImage;
  const upload = $('.project-upload input', card);
  if (upload)
    upload.addEventListener('change', async (event) => {
      const [file] = event.currentTarget.files;
      if (!file) return;
      const hint = $('.image-replace-hint', card);
      hint.textContent = 'Preparing image…';
      try {
        const imageData = await compressImage(file);
        image.src = imageData;
        image.alt = `${project.title} project image`;
        hint.textContent = saveImage(`portfolio-project-image-${card.dataset.project}`, imageData)
          ? 'Image updated · saved in this browser'
          : 'Image updated for this visit';
      } catch (error) {
        hint.textContent = error.message;
      }
      event.currentTarget.value = '';
    });
});

// Reveal content only when it enters view; reduced-motion users see it immediately.
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$('.reveal').forEach((element) => revealObserver.observe(element));
  document.body.classList.add('scroll-reveals');
} else $$('.reveal').forEach((element) => element.classList.add('visible'));

// Header treatment and section-aware navigation.
const header = $('.site-header');
const navLinks = $$('.nav a[href^="#"]');
const sections = $$('main section[id]');
function updateScrollState() {
  header.classList.toggle('scrolled', window.scrollY > 16);
  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 170) current = section.id;
  });
  navLinks.forEach((link) =>
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`),
  );
}
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

// Mobile navigation closes after a choice or Escape.
const menuButton = $('.menu-toggle');
const nav = $('.nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !isOpen);
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Theme preference persists locally and is reflected accessibly.
const themeButton = $('.theme-toggle');
const savedTheme = getSavedImage('portfolio-theme');
if (savedTheme === 'light') document.body.classList.add('light-theme');
function updateThemeButton() {
  const isLight = document.body.classList.contains('light-theme');
  themeButton.setAttribute(
    'aria-label',
    isLight ? 'Switch to dark theme' : 'Switch to light theme',
  );
  themeButton.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
  $('.theme-icon', themeButton).textContent = isLight ? '☼' : '◐';
  $('meta[name="theme-color"]').content = isLight ? '#f3f0e8' : '#171715';
}
updateThemeButton();
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  saveImage('portfolio-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  updateThemeButton();
});

// Project category filters.
$$('.filter').forEach((button) =>
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    $$('.filter').forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    $$('.project').forEach((project) => {
      const visible = selected === 'all' || project.dataset.category === selected;
      project.classList.toggle('hidden', !visible);
      if (visible) requestAnimationFrame(() => project.classList.add('visible'));
    });
  }),
);

// Details use native dialog behavior, including focus management and Escape.
const dialog = $('.project-dialog');
$$('.project-image').forEach((button) =>
  button.addEventListener('click', () => {
    const card = button.closest('[data-project]');
    const project = projects[card.dataset.project];
    $('.dialog-index').textContent = project.index;
    $('#dialog-title').textContent = project.title;
    $('.dialog-summary').textContent = project.summary;
    $('.dialog-challenge').textContent = project.challenge;
    $('.dialog-solution').textContent = project.solution;
    $('.dialog-role').textContent = project.role;
    $('.dialog-tags').replaceChildren(
      ...project.tags.map((tag) => {
        const el = document.createElement('span');
        el.textContent = tag;
        return el;
      }),
    );
    dialog.showModal();
  }),
);
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

$('#year').textContent = new Date().getFullYear();

// Build a Gmail draft from the validated form; the visitor reviews and sends it in Gmail.
const contactForm = $('#contact-form');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const fields = new FormData(contactForm);
  const subject = String(fields.get('subject')).trim();
  const body = [
    `From: ${String(fields.get('name')).trim()} <${String(fields.get('email')).trim()}>`,
    '',
    String(fields.get('message')).trim(),
  ].join('\n');
  const composeUrl = new URL('https://mail.google.com/mail/');
  composeUrl.search = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: 'mizubalateria@gmail.com',
    su: subject,
    body,
  }).toString();
  const composeWindow = window.open(composeUrl.toString(), '_blank');
  const status = $('#contact-status');
  if (composeWindow) {
    composeWindow.opener = null;
    status.textContent =
      'Gmail opened with your message. Review it there, then press Send to deliver.';
  } else {
    status.textContent =
      'Your browser blocked the new tab. Email mizubalateria@gmail.com directly using the link below.';
  }
});
