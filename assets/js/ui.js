// ============================================================
//  ui.js — interfaz: tabla, modales, formulario, pestañas,
//  importación/exportación de archivos, terminal y notificaciones.
// ============================================================

// ======= TABLA =======
function statusPill(s) {
  const m = { optimal: ['ÓPTIMO', 'ok'], warn: ['REVISAR', 'warn'], alert: ['ALERTA', 'bad'] };
  const [l, c] = m[s] || ['?', 'warn'];
  return `<span class="pill ${c}">${l}</span>`;
}

function renderTable() {
  const rows = [...readings].reverse();
  document.getElementById('t-body').innerHTML = rows.map((r, i) => `<tr style="cursor:pointer;" onclick="openRecordModal(${readings.length - 1 - i})">
    <td style="color:var(--text-muted)">${rows.length - i}</td>
    <td>${new Date(r.ts).toLocaleString('es-BO')}</td>
    <td style="color:var(--green-pure)">${r.ph}</td>
    <td style="color:var(--nasa-red)">${r.temp}</td>
    <td style="color:var(--aqua)">${r.tds}</td>
    <td style="color:var(--amber)">${r.turb}</td>
    <td>${r.vol}</td>
    <td>${etapaMap[r.stage] || r.stage}</td>
    <td>${r.claridad || '—'}</td>
    <td>${statusPill(r.status)}</td>
  </tr>`).join('');
  document.getElementById('total-rec').textContent = readings.length + ' registros';

  const sel = document.getElementById('sel-export-pdf');
  if (sel) {
    sel.innerHTML = rows.map((r, i) => `<option value="${readings.length - 1 - i}">Medición #${readings.length - i} — ${new Date(r.ts).toLocaleString('es-BO')}</option>`).join('');
  }
}

function openRecordModal(idx) {
  try {
    window.currentRecordIdx = idx;
    const r = readings[idx];
    if (!r) { alert('No se encontró el registro: ' + idx); return; }

    document.getElementById('rm-title').textContent = `Medición #${idx + 1} — ${new Date(r.ts).toLocaleString('es-BO')}`;

    document.getElementById('rm-body').innerHTML = `
      <div class="rec-grid">
        <div class="rec-item"><div class="rec-lbl">pH del Agua</div><div class="rec-val" style="color:var(--green-pure)">${r.ph}</div></div>
        <div class="rec-item"><div class="rec-lbl">Temperatura</div><div class="rec-val" style="color:var(--nasa-red)">${r.temp} °C</div></div>
        <div class="rec-item"><div class="rec-lbl">TDS (Sólidos)</div><div class="rec-val" style="color:var(--aqua)">${r.tds} ppm</div></div>
        <div class="rec-item"><div class="rec-lbl">Turbidez</div><div class="rec-val" style="color:var(--amber)">${r.turb} NTU</div></div>
        <div class="rec-item"><div class="rec-lbl">Volumen</div><div class="rec-val">${r.vol} mL</div></div>
        <div class="rec-item"><div class="rec-lbl">Etapa del Filtro</div><div class="rec-val">${etapaMap[r.stage] || r.stage}</div></div>
        <div class="rec-item"><div class="rec-lbl">Claridad Visual</div><div class="rec-val" style="text-transform:capitalize;">${r.claridad || '—'}</div></div>
        <div class="rec-item"><div class="rec-lbl">Olor</div><div class="rec-val" style="text-transform:capitalize;">${r.olor || '—'}</div></div>
        <div class="rec-item"><div class="rec-lbl">Sensor de Origen</div><div class="rec-val" style="text-transform:capitalize;">${r.sensor || '—'}</div></div>
        <div class="rec-item"><div class="rec-lbl">Estado de Calidad</div><div class="rec-val">${statusPill(r.status)}</div></div>
      </div>
      ${r.obs ? `<div class="rec-item" style="grid-column: 1 / -1;"><div class="rec-lbl">Observaciones Extra</div><div class="rec-val" style="font-size:12px;color:var(--text-secondary);">${r.obs}</div></div>` : ''}
    `;
    document.getElementById('recordModal').classList.add('show');
  } catch (err) {
    alert('Error al abrir: ' + err.message);
  }
}

function closeRecordModal(e) {
  if (e) e.preventDefault();
  document.getElementById('recordModal').classList.remove('show');
}

// Carga una imagen del propio sitio y la devuelve como dataURL (para el PDF).
function loadImageData(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        resolve({ data: c.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight });
      } catch (e) { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Genera el PDF directamente con jsPDF (texto + logo) — fiable y con texto seleccionable.
async function exportarRegistroPDF() {
  if (window.currentRecordIdx === undefined) return;
  const r = readings[window.currentRecordIdx];
  if (!r) return;

  const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF ||
    (window.jspdf && window.jspdf.default);
  if (!jsPDFCtor) { notif('Error', 'No se pudo cargar el generador de PDF (revisa tu conexión).'); return; }

  notif('Generando PDF...', 'Creando el reporte de la medición.');

  const statusText = r.status === 'optimal' ? 'ÓPTIMO' : (r.status === 'warn' ? 'REVISAR' : 'ALERTA');
  const statusColor = r.status === 'optimal' ? [0, 150, 80] : (r.status === 'alert' ? [200, 40, 25] : [200, 140, 0]);

  const doc = new jsPDFCtor({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = 210;
  const left = 24;
  let y = 18;

  // Logo (centrado)
  const logo = await loadImageData('/assets/img/logo_aquanube.png');
  if (logo) {
    const w = 32, h = w * (logo.h / logo.w);
    doc.addImage(logo.data, 'PNG', (pageW - w) / 2, y, w, h);
    y += h + 4;
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(11, 61, 145);
  doc.text('REPORTE DE MEDICIÓN — AQUANUBE', pageW / 2, y, { align: 'center' }); y += 7;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(110);
  doc.text('Guardianes de la Ciencia · Olimpiadas STEM+ Bolivia 2026', pageW / 2, y, { align: 'center' }); y += 10;

  // Línea separadora
  doc.setDrawColor(200); doc.line(left, y, pageW - left, y); y += 9;

  const rows = [
    ['Número de registro', '#' + (window.currentRecordIdx + 1)],
    ['Fecha y hora', new Date(r.ts).toLocaleString('es-BO')],
    ['pH del agua', String(r.ph)],
    ['Temperatura', r.temp + ' °C'],
    ['TDS (sólidos)', r.tds + ' ppm'],
    ['Turbidez', r.turb + ' NTU'],
    ['Volumen procesado', r.vol + ' mL'],
    ['Etapa del filtro', etapaMap[r.stage] || r.stage],
    ['Claridad visual', r.claridad || '—'],
    ['Olor', r.olor || '—'],
    ['Sensor de origen', r.sensor || '—']
  ];

  doc.setFontSize(11);
  const labelX = left, valueX = left + 60, lineH = 8.5;
  rows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(120); doc.text(k + ':', labelX, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(25); doc.text(String(v), valueX, y);
    y += lineH;
  });

  // Estado de calidad (resaltado)
  doc.setFont('helvetica', 'bold'); doc.setTextColor(120); doc.text('Estado de calidad:', labelX, y);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]); doc.text(statusText, valueX, y); y += lineH + 2;

  if (r.obs) {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(120); doc.text('Observaciones:', labelX, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(25);
    doc.text(doc.splitTextToSize(String(r.obs), pageW - 2 * left), labelX, y);
  }

  doc.setFontSize(8); doc.setTextColor(150);
  doc.text('Generado automáticamente por AquaNube · ' + new Date().toLocaleString('es-BO'), pageW / 2, 287, { align: 'center' });

  doc.save('AQUANUBE_Reporte_' + Date.now() + '.pdf');
  notif('Descarga completa', 'Reporte exportado a PDF.');
}

function generarPDFIndividual() {
  const sel = document.getElementById('sel-export-pdf');
  if (!sel || sel.value === '') {
    notif('Aviso', 'No hay registros para exportar.');
    return;
  }
  window.currentRecordIdx = parseInt(sel.value);
  exportarRegistroPDF();
}

// ======= FORMULARIO =======
function stepInput(id, dir) {
  const el = document.getElementById(id);
  const step = parseFloat(el.getAttribute('step')) || 1;
  const min = el.hasAttribute('min') ? parseFloat(el.getAttribute('min')) : -Infinity;
  const max = el.hasAttribute('max') ? parseFloat(el.getAttribute('max')) : Infinity;
  let val = parseFloat(el.value) || 0;
  val += dir * step;
  const dec = (step.toString().split('.')[1] || '').length;
  val = parseFloat(val.toFixed(dec));
  if (val < min) val = min;
  if (val > max) val = max;
  el.value = val;
}

function submitManual(e) {
  e.preventDefault();
  const r = {
    ts: document.getElementById('f-fecha').value ? new Date(document.getElementById('f-fecha').value).toISOString() : new Date().toISOString(),
    ph: parseFloat(document.getElementById('f-ph').value),
    temp: parseFloat(document.getElementById('f-temp').value),
    tds: parseInt(document.getElementById('f-tds').value),
    turb: parseFloat(document.getElementById('f-turb').value) || 0,
    vol: parseInt(document.getElementById('f-vol').value) || 0,
    stage: document.getElementById('f-etapa').value,
    claridad: document.getElementById('f-claridad').value,
    olor: document.getElementById('f-olor').value,
    sensor: document.getElementById('f-sensor').value,
    obs: document.getElementById('f-obs').value,
    status: ''
  };
  r.status = computeStatus(r);
  readings.push(r);
  saveReadings();
  updCards(r.ph, r.temp, r.tds, r.turb, r.vol);
  renderTable();
  updateChartsWithNewData(r);
  checkAlerts(r);
  termLog(`Medición: pH ${r.ph} | TDS ${r.tds}ppm | Turb ${r.turb}NTU | ${etapaMap[r.stage]}`, 'ok');
  notif('Medición registrada', `pH ${r.ph} | TDS ${r.tds} ppm | ${etapaMap[r.stage]}`);
  e.target.reset();
  document.getElementById('f-fecha').value = new Date().toISOString().slice(0, 16);
}

// Anima un número desde su valor actual hasta el objetivo (efecto "contador").
function countTo(el, target, decimals) {
  if (!el) return;
  const end = parseFloat(target);
  if (isNaN(end)) { el.textContent = target; return; }
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { el.textContent = end.toFixed(decimals); return; }
  const start = parseFloat(el.textContent) || 0;
  const dur = 450, t0 = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = (start + (end - start) * p).toFixed(decimals);
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
}

function updCards(ph, temp, tds, turb, vol) {
  countTo(document.getElementById('c-ph'), ph, 2);
  countTo(document.getElementById('c-temp'), temp, 1);
  countTo(document.getElementById('c-tds'), tds, 0);
  countTo(document.getElementById('c-turb'), turb, 2);

  // Veredicto de aptitud + visual de claridad en vivo
  if (typeof renderVerdict === 'function') renderVerdict(+ph, +tds, +turb);
  if (typeof renderClarity === 'function') renderClarity(+turb);

  // Micro-interacción: parpadeo de las tarjetas al recibir un valor nuevo
  document.querySelectorAll('.metrics-grid .mc').forEach(el => {
    el.classList.remove('flash');
    void el.offsetWidth; // reinicia la animación
    el.classList.add('flash');
  });
}

// ======= PESTAÑAS =======
function switchTab(name, btn) {
  document.querySelectorAll('.tp').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('on'));
  document.getElementById('tp-' + name).classList.add('on');
  btn.classList.add('on');
}

// ======= ARCHIVOS (importar) =======
let pendingImport = null; // { name, text } del último archivo cargado

function dragOver(e) { e.preventDefault(); document.getElementById('dropzone').classList.add('over'); }
function dragLeave() { document.getElementById('dropzone').classList.remove('over'); }
function dropFile(e) { e.preventDefault(); dragLeave(); if (e.dataTransfer.files[0]) procFile(e.dataTransfer.files[0]); }
function handleFile(e) { if (e.target.files[0]) procFile(e.target.files[0]); }

function procFile(f) {
  const r = new FileReader();
  r.onload = e => {
    const text = e.target.result;
    pendingImport = { name: f.name, text };
    document.getElementById('fpreview').style.display = 'block';
    document.getElementById('fprev-content').textContent = text.substring(0, 800) + (text.length > 800 ? '\n...' : '');
    notif('Archivo cargado', f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)');
  };
  r.readAsText(f);
}

// Normaliza un objeto JSON arbitrario al formato de lectura interno.
function normalizeReading(o) {
  if (!o || typeof o !== 'object') return null;
  const r = {
    ts: o.ts || o.timestamp || new Date().toISOString(),
    ph: parseFloat(o.ph),
    temp: parseFloat(o.temp ?? o.temperatura),
    tds: parseInt(o.tds),
    turb: parseFloat(o.turb ?? o.turbidez ?? o.turbidez_ntu),
    vol: parseInt(o.vol ?? o.volumen) || 0,
    stage: o.stage || o.etapa || 'arena',
    claridad: o.claridad || '',
    olor: o.olor || '',
    sensor: o.sensor || 'importado',
    obs: o.obs || '',
    status: o.status || ''
  };
  if (isNaN(r.ph)) return null;
  if (isNaN(r.temp)) r.temp = 0;
  if (isNaN(r.tds)) r.tds = 0;
  if (isNaN(r.turb)) r.turb = 0;
  if (!r.status) r.status = computeStatus(r);
  return r;
}

// Convierte el texto del archivo en lecturas. Acepta JSON (array o {lecturas}),
// CSV con el encabezado exportado, o líneas estilo Arduino "pH,TDS,Turb,Temp".
function parseImport(name, text) {
  const lower = (name || '').toLowerCase();
  const txt = text.trim();
  let added = 0;

  if (lower.endsWith('.json') || txt.startsWith('{') || txt.startsWith('[')) {
    const data = JSON.parse(txt);
    const arr = Array.isArray(data) ? data : (data.lecturas || data.readings || []);
    arr.forEach(o => {
      const r = normalizeReading(o);
      if (r) { readings.push(r); added++; }
    });
    return added;
  }

  const lines = txt.split(/\r?\n/).filter(l => l.trim());
  lines.forEach((line, idx) => {
    const c = line.split(',').map(s => s.trim());
    // Saltar encabezado (primera fila con texto no numérico)
    if (idx === 0 && c[0] && isNaN(parseFloat(c[0]))) return;
    let r = null;
    if (c.length >= 11) {
      r = { ts: c[0] || new Date().toISOString(), ph: +c[1], temp: +c[2], tds: +c[3], turb: +c[4] || 0, vol: +c[5] || 0, stage: c[6] || 'arena', claridad: c[7] || '', olor: c[8] || '', sensor: c[9] || 'importado', obs: '', status: c[10] || '' };
    } else if (c.length >= 4) {
      // Formato del Serial Monitor de Arduino: pH,TDS,Turbidez,Temperatura
      r = { ts: new Date().toISOString(), ph: +c[0], tds: +c[1], turb: +c[2] || 0, temp: +c[3], vol: 0, stage: 'arena', claridad: '', olor: '', sensor: 'importado', obs: '', status: '' };
    }
    if (r && !isNaN(r.ph)) {
      if (!r.status) r.status = computeStatus(r);
      readings.push(r);
      added++;
    }
  });
  return added;
}

function importData() {
  if (!pendingImport) { notif('Sin archivo', 'Primero carga un archivo CSV o JSON.'); return; }
  try {
    const added = parseImport(pendingImport.name, pendingImport.text);
    if (!added) { notif('Nada que importar', 'No se reconocieron lecturas en el archivo.'); return; }
    saveReadings();
    renderTable();
    const last = readings[readings.length - 1];
    if (last) {
      updCards(last.ph, last.temp, last.tds, last.turb, last.vol);
      updateChartsWithNewData(last);
      checkAlerts(last);
    }
    notif('Datos importados', added + ' lecturas añadidas');
    termLog('Importación completada: ' + added + ' lecturas', 'ok');
    document.getElementById('fpreview').style.display = 'none';
    pendingImport = null;
  } catch (err) {
    notif('Error al importar', err.message);
    termLog('Error de importación: ' + err.message, 'er');
  }
}

// ======= EXPORTAR =======
function exportCSV() {
  const h = 'Timestamp,pH,Temperatura,TDS,Turbidez,Volumen_mL,Etapa,Claridad,Olor,Sensor,Estado\n';
  const rows = readings.map(r => `${r.ts},${r.ph},${r.temp},${r.tds},${r.turb},${r.vol},${r.stage},${r.claridad},${r.olor},${r.sensor},${r.status}`).join('\n');
  dl('aquanube_datos.csv', h + rows, 'text/csv');
  notif('CSV exportado', readings.length + ' registros');
}

function exportJSON() {
  dl('aquanube_datos.json', JSON.stringify({ proyecto: 'AQUANUBE', equipo: 'Guardianes de la Ciencia', exportado: new Date().toISOString(), total: readings.length, lecturas: readings }, null, 2), 'application/json');
  notif('JSON exportado', readings.length + ' registros');
}

function dl(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
}

// ======= EJEMPLOS DE LLENADO =======
const EJEMPLOS = [
  { ph: 7.1, temp: 23.0, tds: 120, turb: 0.4, vol: 800, stage: 'hervida', claridad: 'cristalina', olor: 'ninguno', sensor: 'manual', obs: 'Agua de lluvia tras filtración completa y hervido.' },
  { ph: 7.3, temp: 22.4, tds: 180, turb: 0.6, vol: 750, stage: 'arena', claridad: 'cristalina', olor: 'ninguno', sensor: 'manual', obs: 'Agua de río filtrada con lienzo, carbón y arena.' },
  { ph: 7.0, temp: 23.5, tds: 210, turb: 0.5, vol: 700, stage: 'carbon', claridad: 'cristalina', olor: 'ninguno', sensor: 'laboratorio', obs: 'Salida tras carbón activado.' },
  { ph: 7.6, temp: 24.2, tds: 340, turb: 0.9, vol: 600, stage: 'arena', claridad: 'ligeramente_turbia', olor: 'leve', sensor: 'manual', obs: 'Agua de pozo; TDS algo elevado, revisar.' },
  { ph: 6.0, temp: 26.1, tds: 720, turb: 4.8, vol: 500, stage: 'sin_filtro', claridad: 'turbia', olor: 'notable', sensor: 'manual', obs: 'Agua gris cruda sin tratar (entrada del sistema).' }
];

function cargarEjemplos() {
  const base = Date.now();
  EJEMPLOS.forEach((e, i) => {
    // timestamps repartidos hacia atrás (una hora entre cada uno)
    const r = { ...e, ts: new Date(base - (EJEMPLOS.length - 1 - i) * 3600000).toISOString(), status: '' };
    r.status = computeStatus(r);
    readings.push(r);
  });
  saveReadings();
  renderTable();
  const last = readings[readings.length - 1];
  updCards(last.ph, last.temp, last.tds, last.turb, last.vol);
  updateChartsWithNewData(last);
  checkAlerts(last);
  notif('Ejemplos cargados', EJEMPLOS.length + ' mediciones añadidas a la base de datos');
  termLog('Cargados ' + EJEMPLOS.length + ' ejemplos en la base de datos', 'ok');
}

// ======= EXPORTAR TODO A PDF =======
async function exportarTodoPDF() {
  if (!readings.length) { notif('Sin datos', 'No hay mediciones para exportar.'); return; }
  const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if (!jsPDFCtor) { notif('Error', 'No se pudo cargar el generador de PDF (revisa tu conexión).'); return; }

  notif('Generando PDF...', 'Creando el reporte de todas las mediciones.');
  const doc = new jsPDFCtor({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = 210, left = 14;
  let y = 16;

  const logo = await loadImageData('/assets/img/logo_aquanube.png');
  if (logo) {
    const w = 24, h = w * (logo.h / logo.w);
    doc.addImage(logo.data, 'PNG', left, y, w, h);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(11, 61, 145);
    doc.text('AQUANUBE — Registro de mediciones', left + w + 6, y + 8);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(110);
    doc.text('Guardianes de la Ciencia · ' + new Date().toLocaleString('es-BO'), left + w + 6, y + 14);
    y += h + 4;
  } else { y += 6; }

  doc.setFontSize(8); doc.setTextColor(120);
  doc.text('Total de mediciones: ' + readings.length, left, y); y += 5;

  // Cabecera de tabla
  const cols = [
    ['#', 10], ['Fecha', 40], ['pH', 14], ['T°C', 14], ['TDS', 16],
    ['Turb', 16], ['Vol', 16], ['Etapa', 30], ['Estado', 26]
  ];
  const estadoTxt = s => s === 'optimal' ? 'OPTIMO' : (s === 'alert' ? 'ALERTA' : 'REVISAR');

  function header() {
    doc.setFillColor(11, 61, 145); doc.rect(left, y, pageW - 2 * left, 7, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255);
    let x = left + 2;
    cols.forEach(([t, w]) => { doc.text(t, x, y + 5); x += w; });
    y += 7;
  }
  header();

  doc.setFont('helvetica', 'normal'); doc.setTextColor(30);
  readings.forEach((r, i) => {
    if (y > 282) { doc.addPage(); y = 16; header(); doc.setFont('helvetica', 'normal'); doc.setTextColor(30); }
    if (i % 2 === 0) { doc.setFillColor(244, 247, 250); doc.rect(left, y, pageW - 2 * left, 6, 'F'); }
    const vals = [
      String(i + 1),
      new Date(r.ts).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' }),
      String(r.ph), String(r.temp), String(r.tds), String(r.turb), String(r.vol),
      (etapaMap[r.stage] || r.stage), estadoTxt(r.status)
    ];
    let x = left + 2;
    doc.setFontSize(8);
    vals.forEach((v, c) => {
      if (c === 8) { const col = r.status === 'optimal' ? [0, 140, 70] : (r.status === 'alert' ? [200, 40, 25] : [200, 140, 0]); doc.setTextColor(col[0], col[1], col[2]); }
      else doc.setTextColor(30);
      doc.text(String(v).substring(0, 24), x, y + 4.3);
      x += cols[c][1];
    });
    y += 6;
  });

  doc.setFontSize(8); doc.setTextColor(150);
  doc.text('Generado automáticamente por AquaNube', pageW / 2, 290, { align: 'center' });
  doc.save('AQUANUBE_Mediciones_' + Date.now() + '.pdf');
  notif('Descarga completa', readings.length + ' mediciones exportadas a PDF.');
}

// ======= TERMINAL =======
function termLog(msg, type = 'pr') {
  const t = document.getElementById('terminal');
  if (!t) return; // la sección/terminal puede no estar presente
  const ts = new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const d = document.createElement('div'); d.className = 'tl';
  d.innerHTML = `<span class="ts">[${ts}]</span> <span class="${type}">${msg}</span>`;
  t.appendChild(d); t.scrollTop = t.scrollHeight;
}

function termKey(e) {
  if (e.key !== 'Enter') return;
  const c = e.target.value.trim();
  if (!c) return;
  e.target.value = '';
  termLog('$ ' + c, 'pr');
  procCmd(c.toUpperCase());
}

function cmd(c) { termLog('$ ' + c, 'pr'); procCmd(c); }

function procCmd(c) {
  setTimeout(() => {
    const l = readings.length > 0 ? readings[readings.length - 1] : { ph: 0, tds: 0, turb: 0, temp: 0, vol: 0 };
    if (c.includes('READ')) termLog(`pH: ${l.ph} | TDS: ${l.tds}ppm | Turb: ${l.turb}NTU | Temp: ${l.temp}°C | Vol: ${l.vol}mL`, 'vl');
    else if (c.includes('STATUS')) termLog('AQUANUBE: ACTIVO | Sensores: OK', 'ok');
    else if (c.includes('DEMO')) { if (typeof toggleDemo === 'function') toggleDemo(); }
    else if (c.includes('FILTRO ON')) {
      termLog('Secuencia de filtración activada...', 'ok');
      document.getElementById('flow-diagram')?.classList.add('anim-active', 'live');
    }
    else if (c.includes('FILTRO OFF')) {
      termLog('Sistema de filtración detenido', 'er');
      document.getElementById('flow-diagram')?.classList.remove('anim-active', 'live');
    }
    else if (c.includes('RESET')) termLog('Sistema reiniciado', 'ok');
    else if (c.includes('HELP')) termLog('Comandos: READ, STATUS, DEMO, FILTRO ON/OFF, RESET, HELP', 'pr');
    else termLog('Comando no reconocido', 'er');
  }, 280);
}

// ======= ALERTAS =======
function checkAlerts(r) {
  const toxic = r.tds > 500 || r.ph < 6.5 || r.ph > 8.5;
  if (toxic) {
    document.body.classList.add('toxic-alert');
    notif('🚨 ALERTA DE TOXICIDAD', 'Valores de agua fuera de rango seguro.');
    termLog('PELIGRO: Agua no apta. Filtración requerida.', 'er');
  } else {
    document.body.classList.remove('toxic-alert');
  }
}

// ======= INTERVALO DE LECTURA =======
function updInterval(v) {
  const lbl = document.getElementById('iv-lbl');
  if (lbl) lbl.textContent = v + ' seg';
  termLog('Intervalo actualizado: ' + v + ' segundos', 'vl');
  if (typeof restartDemoIfActive === 'function') restartDemoIfActive();
}

// ======= NOTIFICACIONES =======
function notif(title, sub) {
  document.getElementById('n-title').textContent = title;
  document.getElementById('n-sub').textContent = sub;
  const n = document.getElementById('notif');
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3500);
}

// ======= MODAL DE MATERIALES =======
const matData = {
  'fuente': { icon: '💧', title: 'Fuente de Agua', info: 'El sistema procesa cualquier tipo de agua no potable: residual, grises domésticas o lluvia. El objetivo es dar un segundo uso al agua reduciendo el estrés hídrico.' },
  'lienzo': { icon: '🧵', title: 'Lienzo / Gasa', info: 'Primera barrera física. Su tejido atrapa las partículas sólidas más grandes (polvo, insectos, pelusas) evitando que los siguientes filtros finos se saturen rápidamente.' },
  'carbon': { icon: '⚫', title: 'Carbón Activado', info: 'Componente químico clave. Atrapa toxinas, metales pesados y compuestos orgánicos. Además, neutraliza eficazmente olores y sabores indeseados.' },
  'arena': { icon: '🏖️', title: 'Arena Fina', info: 'Filtro mecánico de alta eficiencia. El agua pasa por minúsculos espacios, eliminando partículas finas en suspensión y mejorando drásticamente la turbidez.' },
  'pecera': { icon: '🪣', title: 'Pecera / Vidrio', info: 'Recipientes contenedores transparentes. Permiten observar directamente el proceso de purificación y la mejora visual del agua capa por capa de forma experimental.' },
  'hervido': { icon: '🔥', title: 'Hervido Final', info: 'Tratamiento térmico final. Hervir el agua asegura la eliminación total de patógenos, bacterias y virus que hayan pasado la filtración física.' },
  'sensor': { icon: '🔬', title: 'Sensor pH/TDS', info: 'Instrumental electrónico de precisión para medir el Potencial de Hidrógeno y los Sólidos Disueltos Totales (TDS). Determinan de forma cuantitativa la calidad del agua.' },
  'arduino': { icon: '⚡', title: 'Arduino', info: 'El cerebro del sistema. Recopila los datos analógicos de los sensores, los convierte a digital y los transmite a este Dashboard mediante conexión Serial.' }
};

function openMatModal(id) {
  const d = matData[id];
  document.getElementById('m-title').textContent = d.title.toUpperCase();
  document.getElementById('m-body').innerHTML = `
    <div class="m-img">${d.icon}</div>
    <div class="m-info">${d.info}</div>
  `;
  document.getElementById('matModal').classList.add('show');
}

function closeMatModal(e) {
  if (e) e.preventDefault();
  document.getElementById('matModal').classList.remove('show');
}
