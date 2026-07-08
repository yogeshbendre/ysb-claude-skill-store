let allSkills = [];
let repo = { owner: 'yogeshbendre', name: 'ysb-claude-skill-store' };
let searchQuery = '';

const FACETS = [
  { key: 'domain',  label: 'Domain',  getValues: s => [s.domain || 'Uncategorized'] },
  { key: 'author',  label: 'Author',  getValues: s => [s.author || 'Unknown'] },
  { key: 'tags',    label: 'Area',    getValues: s => (s.tags && s.tags.length) ? s.tags : ['Uncategorized'] },
  { key: 'license', label: 'License', getValues: s => [s.license || 'Unspecified'] },
  { key: 'version', label: 'Version', getValues: s => [s.version || 'Unspecified'] },
];

const selected = Object.fromEntries(FACETS.map(f => [f.key, new Set()]));
const collapsedFacets = new Set();

async function init() {
  try {
    const data = await fetch('./skills-index.json').then(r => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    });
    allSkills = data.skills || [];
    repo.owner = data.repoOwner || repo.owner;
    repo.name  = data.repoName  || repo.name;

    renderAll();
  } catch (e) {
    document.getElementById('grid').innerHTML =
      '<p class="empty">Could not load skills index. Please try again later.</p>';
    console.error(e);
  }
}

function rawUrl(id) {
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/main/skills/${id}/skill.md`;
}

function folderUrl(id) {
  return `https://github.com/${repo.owner}/${repo.name}/tree/main/skills/${id}`;
}

function installCmd(s) {
  return `mkdir -p .claude/commands && curl -o .claude/commands/${s.id}.md "${rawUrl(s.id)}"`;
}

function matchesSearch(s, q) {
  if (!q) return true;
  return s.name.toLowerCase().includes(q) ||
         s.description.toLowerCase().includes(q) ||
         (s.tags || []).some(t => t.toLowerCase().includes(q));
}

function matchesFacets(s, excludeKey) {
  return FACETS.every(f => {
    if (f.key === excludeKey) return true;
    const sel = selected[f.key];
    if (!sel.size) return true;
    return f.getValues(s).some(v => sel.has(v));
  });
}

function visibleSkills() {
  return allSkills.filter(s => matchesSearch(s, searchQuery) && matchesFacets(s, null));
}

function hasActiveFilters() {
  return Boolean(searchQuery) || FACETS.some(f => selected[f.key].size);
}

function buildFacets() {
  const body = document.getElementById('filter-body');
  body.innerHTML = FACETS.map(f => {
    const baseline = allSkills.filter(s => matchesSearch(s, searchQuery) && matchesFacets(s, f.key));
    const counts = new Map();
    baseline.forEach(s => f.getValues(s).forEach(v => counts.set(v, (counts.get(v) || 0) + 1)));
    if (!counts.size) return '';

    const options = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const isOpen = !collapsedFacets.has(f.key);

    return `
<details class="facet-group" data-facet-key="${f.key}" ${isOpen ? 'open' : ''}>
  <summary class="facet-title">${esc(f.label)}</summary>
  <div class="facet-options">
    ${options.map(([val, count]) => `
    <label class="facet-option">
      <input type="checkbox" data-facet="${f.key}" value="${esc(val)}" ${selected[f.key].has(val) ? 'checked' : ''}>
      <span class="facet-label">${esc(val)}</span>
      <span class="facet-count">${count}</span>
    </label>`).join('')}
  </div>
</details>`;
  }).join('');
}

function renderActiveFilters() {
  const chips = [];
  FACETS.forEach(f => selected[f.key].forEach(v => chips.push({ key: f.key, label: f.label, value: v })));
  document.getElementById('active-filters').innerHTML = chips.map(c => `
    <span class="chip" data-facet="${esc(c.key)}" data-value="${esc(c.value)}">
      ${esc(c.label)}: ${esc(c.value)} <button type="button" aria-label="Remove filter">×</button>
    </span>`).join('');
}

function renderCount(visible) {
  const total = allSkills.length;
  document.getElementById('count').textContent = hasActiveFilters()
    ? `${visible.length} of ${total} skill${total !== 1 ? 's' : ''}`
    : `${total} skill${total !== 1 ? 's' : ''}`;
}

function renderFilterCountBadge() {
  const n = FACETS.reduce((sum, f) => sum + selected[f.key].size, 0);
  const badge = document.getElementById('filter-count-badge');
  badge.hidden = n === 0;
  badge.textContent = n;
}

function renderGrid(visible) {
  document.getElementById('grid').innerHTML = visible.length
    ? visible.map(card).join('')
    : '<p class="empty">No matching skills.</p>';
}

function renderAll() {
  const visible = visibleSkills();
  buildFacets();
  renderActiveFilters();
  renderCount(visible);
  renderFilterCountBadge();
  renderGrid(visible);
}

function card(s) {
  const cmd = installCmd(s);
  return `
<article class="card">
  <div class="card-body">
    <div class="card-top">
      <h3 class="card-name">${esc(s.name)}</h3>
      <span class="card-ver">v${esc(s.version || '1.0.0')}</span>
    </div>
    <p class="card-desc">${esc(s.description)}</p>
    <div class="card-tags">${(s.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
  </div>
  <div class="card-foot">
    <span class="card-author">by <a href="${esc(s.authorUrl || '#')}" target="_blank" rel="noopener noreferrer">${esc(s.author || 'unknown')}</a></span>
    <div class="card-btns">
      <button class="btn-copy" data-cmd="${esc(cmd)}" title="Copy one-line install command">Copy install</button>
      <a class="btn-raw" href="${esc(rawUrl(s.id))}" target="_blank" rel="noopener noreferrer">Raw</a>
      <a class="btn-src" href="${esc(folderUrl(s.id))}" target="_blank" rel="noopener noreferrer">Source</a>
    </div>
  </div>
</article>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Search
document.getElementById('search').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderAll();
});

// Facet checkboxes (event delegation — options rendered dynamically)
document.getElementById('filter-body').addEventListener('change', e => {
  const input = e.target.closest('input[data-facet]');
  if (!input) return;
  const set = selected[input.dataset.facet];
  if (input.checked) set.add(input.value); else set.delete(input.value);
  renderAll();
});

// Remember which facet groups the user collapsed/expanded across re-renders
// ('toggle' doesn't bubble, so listen during the capture phase)
document.getElementById('filter-body').addEventListener('toggle', e => {
  const details = e.target;
  if (!details.dataset || !details.dataset.facetKey) return;
  if (details.open) collapsedFacets.delete(details.dataset.facetKey);
  else collapsedFacets.add(details.dataset.facetKey);
}, true);

// Remove a single filter via its chip
document.getElementById('active-filters').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  selected[chip.dataset.facet].delete(chip.dataset.value);
  renderAll();
});

// Clear all filters
document.getElementById('clear-filters').addEventListener('click', () => {
  FACETS.forEach(f => selected[f.key].clear());
  renderAll();
});

// Mobile filter drawer
const filterPanel = document.getElementById('filter-panel');
const filterOverlay = document.getElementById('filter-overlay');

function openFilterPanel() {
  filterPanel.classList.add('open');
  filterOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFilterPanel() {
  filterPanel.classList.remove('open');
  filterOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('filter-toggle').addEventListener('click', openFilterPanel);
document.getElementById('filter-close').addEventListener('click', closeFilterPanel);
filterOverlay.addEventListener('click', closeFilterPanel);

// Copy install (event delegation — cards rendered dynamically)
document.getElementById('grid').addEventListener('click', e => {
  const btn = e.target.closest('.btn-copy');
  if (!btn) return;
  // dataset.cmd is auto-decoded by the browser from the HTML-escaped attribute
  navigator.clipboard.writeText(btn.dataset.cmd).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2200);
  }).catch(() => {
    prompt('Copy this command:', btn.dataset.cmd);
  });
});

// Theme toggle (light/dark)
const THEME_KEY = 'claude-skills-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// Inline head script already set data-theme early to avoid a flash; sync the icon to it
applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

init();
