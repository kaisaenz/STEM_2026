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

function exportarRegistroPDF() {
  if (window.currentRecordIdx === undefined) return;
  const r = readings[window.currentRecordIdx];
  if (!r) return;

  notif('Generando PDF...', 'Capturando registro individual.');

  const statusText = r.status === 'optimal' ? 'ÓPTIMO' : (r.status === 'warn' ? 'REVISAR' : 'ALERTA');

  const htmlContent = `
    <div style="padding: 40px; font-family: 'Helvetica', 'Arial', sans-serif; color: #000; background: #fff; width: 600px; line-height: 1.6;">
      <h2 style="color: #333; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px;">
        REPORTE DE MEDICIÓN — AQUANUBE
      </h2>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Número de Registro:</strong> #${window.currentRecordIdx + 1}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Fecha y Hora:</strong> ${new Date(r.ts).toLocaleString('es-BO')}</p>
      <br>
      <p style="margin: 5px 0; font-size: 14px;"><strong>pH del Agua:</strong> ${r.ph}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Temperatura:</strong> ${r.temp} °C</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>TDS (Sólidos):</strong> ${r.tds} ppm</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Turbidez:</strong> ${r.turb} NTU</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Volumen Procesado:</strong> ${r.vol} mL</p>
      <br>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Etapa del Filtro:</strong> ${etapaMap[r.stage] || r.stage}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Claridad Visual:</strong> <span style="text-transform: capitalize;">${r.claridad || '—'}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Olor:</strong> <span style="text-transform: capitalize;">${r.olor || '—'}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Sensor de Origen:</strong> <span style="text-transform: capitalize;">${r.sensor || '—'}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Estado de Calidad:</strong> ${statusText}</p>
      <br>
      ${r.obs ? `<div style="margin-top: 10px; padding: 15px; border: 1px solid #ccc; background: #f9f9f9;">
        <strong>Observaciones Extra:</strong><br><span style="font-size: 13px;">${r.obs}</span>
      </div>` : ''}
      <div style="margin-top: 40px; font-size: 10px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
        Generado automáticamente por el Sistema AQUANUBE
      </div>
    </div>
  `;

  const opt = {
    margin: 10,
    filename: 'AQUANUBE_Reporte_' + Date.now() + '.pdf',
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(htmlContent).save().then(() => {
    notif('Descarga completa', 'Registro exportado a PDF.');
  }).catch(() => {
    notif('Error', 'No se pudo generar el PDF.');
  });
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

// ======= TERMINAL =======
function termLog(msg, type = 'pr') {
  const t = document.getElementById('terminal');
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
      document.getElementById('flow-diagram').classList.add('anim-active', 'live');
    }
    else if (c.includes('FILTRO OFF')) {
      termLog('Sistema de filtración detenido', 'er');
      document.getElementById('flow-diagram').classList.remove('anim-active', 'live');
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
  document.getElementById('iv-lbl').textContent = v + ' seg';
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
