(function () {
  const api = window.turoasisAdmin;
  const root = document.getElementById('turoasis-admin-app');
  const state = { tours: [], selected: null };
  const fields = ['resumen', 'precio', 'codigo_del_tour', 'categoria', 'duracion', 'tarifas', 'nota_de_precio', 'fechas_disponibles', 'incluye', 'no_incluye', 'itinerario'];

  const request = async (path, options = {}) => {
    const response = await fetch(`${api.apiRoot}${path}`, { ...options, headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': api.nonce, ...(options.headers || {}) } });
    if (!response.ok) throw new Error(await response.text());
    return response.status === 204 ? null : response.json();
  };
  const esc = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  const input = (label, name, value = '', type = 'text') => `<label>${label}<input type="${type}" name="${name}" value="${esc(value)}"></label>`;
  const area = (label, name, value = '') => `<label>${label}<textarea name="${name}">${esc(value)}</textarea></label>`;

  function render() {
    const tour = state.selected;
    root.innerHTML = `<div class="ta-shell"><header class="ta-header"><div><span class="ta-kicker">TUROASIS</span><h1>Panel de tours</h1></div><button class="ta-primary" data-action="new">Nuevo tour</button></header><div class="ta-layout"><aside class="ta-list"><input class="ta-search" placeholder="Buscar tours..." data-search>${state.tours.map((item) => `<button class="ta-list-item ${tour?.id === item.id ? 'is-active' : ''}" data-id="${item.id}"><strong>${esc(item.title.rendered)}</strong><small>${esc(item.acf?.codigo_del_tour || 'Sin código')}</small></button>`).join('')}</aside><main class="ta-editor">${tour ? editor(tour) : '<div class="ta-empty"><span>✦</span><h2>Selecciona un tour</h2><p>Administra fechas, precios e itinerarios desde este panel.</p></div>'}</main></div></div>`;
  }

  function editor(tour) {
    const values = tour.acf || {};
    const days = Array.from({ length: Math.max(1, Math.min(20, tour.itineraryDays?.length || 1)) }, (_, index) => { const day = index + 1; return `<div class="ta-day"><span>Día ${day}</span>${input('Título', `dia_${day}_titulo`, values[`dia_${day}_titulo`] || tour.itineraryDays?.[index]?.title || '')}${area('Descripción', `dia_${day}_descripcion`, values[`dia_${day}_descripcion`] || tour.itineraryDays?.[index]?.description || '')}</div>` }).join('');
    return `<form class="ta-form" data-form><div class="ta-editor-head"><div><span class="ta-kicker">FICHA EDITABLE</span><h2>${esc(tour.title.rendered || 'Nuevo tour')}</h2></div><div class="ta-actions"><button type="button" data-action="delete" class="ta-danger">Papelera</button><button class="ta-primary">Guardar cambios</button></div></div><section class="ta-card"><h3>Información principal</h3><div class="ta-grid">${input('Nombre del tour','title',tour.title.rendered)}${input('Código','codigo_del_tour',values.codigo_del_tour)}${input('Categoría','categoria',values.categoria)}${input('Duración','duracion',values.duracion)}${input('Precio doble','precio',values.precio,'number')}${input('Nivel (1-4)','nivel_actividad',values.nivel_actividad || '3','number')}</div>${area('Descripción','resumen',values.resumen)}${area('Tarifas','tarifas',values.tarifas)}${area('Fechas disponibles','fechas_disponibles',values.fechas_disponibles)}${area('Incluye','incluye',values.incluye)}${area('No incluye','no_incluye',values.no_incluye)}</section><section class="ta-card"><div class="ta-section-head"><div><h3>Itinerario</h3><p>Agrega hasta 20 días con título y descripción propios.</p></div><button type="button" class="ta-secondary" data-action="add-day">+ Agregar día</button></div><div class="ta-days">${days}</div></section></form>`;
  }

  async function load() { state.tours = await request('tourtour&per_page=100&_embed=1'); render(); }
  async function save(form) {
    const data = new FormData(form); const title = data.get('title'); const id = state.selected?.id; const acf = {};
    fields.forEach((field) => { acf[field] = data.get(field) || ''; });
    for (let day = 1; day <= 20; day++) { acf[`dia_${day}_titulo`] = data.get(`dia_${day}_titulo`) || ''; acf[`dia_${day}_descripcion`] = data.get(`dia_${day}_descripcion`) || ''; }
    const updated = await request(id ? `tourtour/${id}` : 'tourtour', { method: 'POST', body: JSON.stringify({ title, status: 'publish', acf }) });
    state.selected = updated; await load(); state.selected = state.tours.find((item) => item.id === updated.id) || updated; render();
  }
  root.addEventListener('click', async (event) => { const action = event.target.closest('[data-action]')?.dataset.action; const item = event.target.closest('[data-id]'); if (item) { state.selected = state.tours.find((tour) => tour.id === Number(item.dataset.id)); render(); } if (action === 'new') { state.selected = { id: null, title: { rendered: '' }, acf: {} }; render(); } if (action === 'add-day') { const days = root.querySelectorAll('.ta-day').length; if (days < 20) { root.querySelector('.ta-days').insertAdjacentHTML('beforeend', `<div class="ta-day"><span>Día ${days + 1}</span>${input('Título', `dia_${days + 1}_titulo`)}${area('Descripción', `dia_${days + 1}_descripcion`)}</div>`); } } if (action === 'delete' && state.selected?.id && confirm('¿Enviar este tour a la papelera?')) { await request(`tourtour/${state.selected.id}`, { method: 'DELETE' }); state.selected = null; await load(); } });
  root.addEventListener('submit', async (event) => { if (!event.target.matches('[data-form]')) return; event.preventDefault(); const button = event.target.querySelector('button[type=submit]'); button.disabled = true; try { await save(event.target); } catch (error) { alert('No se pudo guardar el tour.'); console.error(error); } finally { button.disabled = false; } });
  load().catch((error) => { console.error(error); state.tours = []; render(); });
}());