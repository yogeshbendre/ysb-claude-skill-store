let allSkills = [];
let activeTag = null;
let repo = { owner: 'YOUR_USERNAME', name: 'YOUR_REPO' };

async function init() {
  try {
    const data = await fetch('./skills-index.json').then(r => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    });
    allSkills = data.skills || [];
    repo.owner = data.repoOwner || repo.owner;
    repo.name  = data.repoName  || repo.name;

    const countEl = document.getElementById('count');
    countEl.textContent = `${allSkills.length} skill${allSkills.length !== 1 ? 's' : ''}`;

    buildTagFilters();
    render(allSkills);
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

function buildTagFilters() {
  const tags = [...new Set(allSkills.flatMap(s => s.tags || []))].sort();
  document.getElementById('tag-filters').innerHTML =
    tags.map(t => `<button class="tag-btn" data-tag="${esc(t)}">${esc(t)}</button>`).join('');
}

function applyFilters() {
  const q = document.getElementById('search').value.toLowerCase().trim();
  render(allSkills.filter(s =>
    (!q || s.name.toLowerCase().includes(q) ||
           s.description.toLowerCase().includes(q) ||
           (s.tags || []).some(t => t.includes(q))) &&
    (!activeTag || (s.tags || []).includes(activeTag))
  ));
}

function render(skills) {
  document.getElementById('grid').innerHTML = skills.length
    ? skills.map(card).join('')
    : '<p class="empty">No matching skills.</p>';
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
document.getElementById('search').addEventListener('input', applyFilters);

// Tag filters (event delegation — buttons rendered dynamically)
document.getElementById('tag-filters').addEventListener('click', e => {
  const btn = e.target.closest('.tag-btn');
  if (!btn) return;
  activeTag = activeTag === btn.dataset.tag ? null : btn.dataset.tag;
  document.querySelectorAll('.tag-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tag === activeTag)
  );
  applyFilters();
});

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

init();
