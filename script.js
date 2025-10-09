const toggleBtn = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");

toggleBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// Load menu items from menu.json and render as cards
async function loadMenu() {
  const container = document.querySelector('.menu');
  if (!container) return;

  try {
    const res = await fetch('menu.json');
    if (!res.ok) throw new Error('No se pudo cargar el menú');
    const items = await res.json();

    // Clear existing content
    container.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-item';

      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p class="price">${item.price}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<p style="padding:20px;">No se pudo cargar el menú. Intenta recargar la página.</p>';
    console.error(err);
  }
}

let allItems = [];

function renderMenu(items) {
  const container = document.querySelector('.menu');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-item';

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p class="price">${item.price}</p>
    `;

    container.appendChild(card);
  });
}

async function loadMenu() {
  try {
    const res = await fetch('menu.json');
    if (!res.ok) throw new Error('No se pudo cargar el menú');
    allItems = await res.json();
    renderMenu(allItems);
    attachCategoryHandlers();
  } catch (err) {
    const container = document.querySelector('.menu');
    if (container) container.innerHTML = '<p style="padding:20px;">No se pudo cargar el menú. Intenta recargar la página.</p>';
    console.error(err);
  }
}

function attachCategoryHandlers() {
  // build category list dynamically
  const container = document.querySelector('.categories');
  if (!container) return;

  // compute unique categories and counts
  const counts = allItems.reduce((acc, it) => {
    acc[it.category] = (acc[it.category] || 0) + 1;
    return acc;
  }, {});

  const categories = ['all', ...Object.keys(counts)];

  container.innerHTML = '';

  categories.forEach(cat => {
    const a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-category', cat);
    a.className = (cat === 'all') ? 'active' : '';
    const label = cat === 'all' ? 'Todos' : `${cat} (${counts[cat]})`;
    a.textContent = label;
    container.appendChild(a);
  });

  // attach click handlers
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-category');

      // highlight active
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      if (!cat || cat === 'all') {
        renderMenu(allItems);
        return;
      }

      const filtered = allItems.filter(it => it.category === cat);
      renderMenu(filtered);
    });
  });
}

// Load menu on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadMenu);
