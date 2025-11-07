/* © 2025 Genaro Carrasco Ozuna — CC BY 4.0 (texto) / MIT (código) */
const $ = sel => document.querySelector(sel);
const btn = $('#fetchBtn'), list = $('#listado'), sum = $('#summary');
const btnCat = $('#dlCatalogo'), btnLD = $('#dlJSONLD');

function downloadJSON(obj, filename){
  const blob = new Blob([JSON.stringify(obj,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = filename; document.body.appendChild(a); a.click(); a.remove();
}

async function fetchRepos(owner){
  const url = `https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=100`;
  const r = await fetch(url, {headers:{'Accept':'application/vnd.github+json'}});
  if(!r.ok) throw new Error(`GitHub API ${r.status}`);
  return r.json();
}

function buildCatalogo(repos){
  return repos.map(x=>({
    name: x.name, full_name: x.full_name, html_url: x.html_url,
    description: x.description, language: x.language, default_branch: x.default_branch,
    fork: x.fork, created_at: x.created_at, updated_at: x.updated_at, pushed_at: x.pushed_at,
    license: x.license||{}, homepage: x.homepage, has_pages: !!x.has_pages, topics: x.topics||[]
  }));
}

function buildJSONLD(repos, owner){
  const date = new Date().toISOString().slice(0,10);
  return {
    "@context":"https://schema.org",
    "@type":"DataCatalog",
    "name":"Catálogo TCDS — Convergencia",
    "creator":{"@type":"Person","name":"Genaro Carrasco Ozuna","identifier":"ORCID:0009-0005-6358-9910"},
    "license":[
      "https://creativecommons.org/licenses/by/4.0/",
      "https://opensource.org/licenses/MIT"
    ],
    "dateCreated": date,
    "dataset": repos.map(x=>({
      "@type":"CreativeWork",
      "name": x.name,
      "description": x.description,
      "codeRepository": x.html_url,
      "url": x.has_pages ? `https://${owner}.github.io/${x.name}/` : (x.homepage||null),
      "programmingLanguage": x.language,
      "license": (x.license && x.license.spdx_id && x.license.spdx_id!=="NOASSERTION") ? x.license.spdx_id : null,
      "keywords": x.topics||[]
    }))
  };
}

function card(owner, x){
  const pagesURL = x.has_pages ? `https://${owner}.github.io/${x.name}/` : '';
  return `<article class="card">
    <h3>${x.name}</h3>
    <div><a class="btn btn-outline" href="${x.html_url}" target="_blank" rel="noopener">Repo</a>
      ${x.has_pages?` <a class="btn btn-outline" href="${pagesURL}" target="_blank" rel="noopener">Pages</a>`:''}
      ${x.homepage?` <a class="btn btn-outline" href="${x.homepage}" target="_blank" rel="noopener">Homepage</a>`:''}
    </div>
    <p style="margin-top:8px">${x.description||''}</p>
    <p class="meta">Lang: ${x.language||'n/d'} · Topics: ${(x.topics||[]).join(', ')}</p>
  </article>`;
}

function render(repos, owner){
  list.innerHTML = repos.map(x=>card(owner,x)).join('');
}

btn.addEventListener('click', async ()=>{
  btn.disabled = true; btn.textContent = 'Cargando…';
  list.innerHTML = ''; sum.textContent = '';
  btnCat.disabled = btnLD.disabled = true;

  const owner = $('#owner').value.trim();
  try{
    const raw = await fetchRepos(owner);
    const catalogo = buildCatalogo(raw);
    const jsonld  = buildJSONLD(raw, owner);
    const pagesCount = catalogo.filter(x=>x.has_pages).length;

    sum.textContent = `Repos: ${catalogo.length} · Pages: ${pagesCount} · Fecha: ${new Date().toISOString().slice(0,10)}`;
    render(catalogo, owner);

    btnCat.disabled = false; btnCat.onclick = ()=>downloadJSON(catalogo, 'catalogo.json');
    btnLD.disabled  = false; btnLD.onclick  = ()=>downloadJSON(jsonld,  'tcds_convergencia.jsonld');
    btn.textContent = 'Reconstruir';
  }catch(e){
    sum.textContent = 'Error: ' + e.message;
    btn.textContent = 'Reintentar';
  }finally{
    btn.disabled = false;
  }
});
