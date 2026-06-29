// ============================================================
//  evaluation.js — Aptitud del agua y escenarios de demostración
//  - evaluateWater(): decide si el agua es apta para consumo, y si no,
//    sugiere usos alternativos y el filtrado recomendado.
//  - renderVerdict() / renderClarity(): actualizan los paneles en vivo.
//  - injectScenario(): inyecta lecturas de ejemplo para la exposición.
// ============================================================

// Clasifica el agua a partir de pH, TDS y turbidez.
// Devuelve nivel (potable / no_potable / alerta), veredicto, usos y filtrado.
function evaluateWater(ph, tds, turb) {
  const phOk = ph >= 6.5 && ph <= 8.5;
  const tdsOk = tds < 300;
  const turbOk = turb < 1;

  let level, titulo, detalle, icon, usos = [], filtros = [];

  if (phOk && tdsOk && turbOk) {
    level = 'potable';
    icon = 'fa-droplet';
    titulo = 'APTA PARA CONSUMO';
    detalle = 'El agua cumple los parámetros de calidad. Se recomienda hervirla como precaución final antes de beber.';
    usos = ['Consumo (hervida)', 'Cocina', 'Riego', 'Limpieza'];
  } else if (turb < 5 && tds < 1000 && ph >= 5.5 && ph <= 9) {
    level = 'no_potable';
    icon = 'fa-recycle';
    titulo = 'NO APTA PARA BEBER — Reutilizable';
    detalle = 'No se recomienda para consumo directo, pero es aprovechable en usos no potables para evitar su desperdicio.';
    usos = ['Riego de plantas', 'Limpieza de pisos', 'Inodoros / sanitarios', 'Lavado de vehículos'];
  } else {
    level = 'alerta';
    icon = 'fa-triangle-exclamation';
    titulo = 'NO APTA — Requiere tratamiento';
    detalle = 'Valores fuera del rango seguro. Necesita un proceso de filtración completo antes de cualquier reutilización.';
    usos = ['Solo tras tratamiento completo', 'Uso industrial limitado'];
  }

  // Filtrado recomendado según los parámetros que estén fuera de rango
  if (!turbOk) filtros.push('Lienzo / gasa + arena fina — reduce la turbidez');
  if (!tdsOk) filtros.push('Carbón activado — reduce los sólidos disueltos (TDS)');
  if (!phOk) filtros.push('Carbón activado — ayuda a regular el pH');
  filtros.push('Hervido final — elimina microorganismos');

  return { level, titulo, detalle, icon, usos, filtros };
}

// Pinta el panel de veredicto a partir de los valores actuales.
function renderVerdict(ph, tds, turb) {
  const panel = document.getElementById('verdict');
  if (!panel) return;
  const v = evaluateWater(ph, tds, turb);

  panel.classList.remove('potable', 'no_potable', 'alerta');
  panel.classList.add(v.level);

  document.getElementById('vd-icon').innerHTML = `<i class="fa-solid ${v.icon}"></i>`;
  document.getElementById('vd-title').textContent = v.titulo;
  document.getElementById('vd-detail').textContent = v.detalle;
  document.getElementById('vd-usos').innerHTML = v.usos.map(u => `<li><i class="fa-solid fa-check"></i>${u}</li>`).join('');
  document.getElementById('vd-filtros').innerHTML = v.filtros.map(f => `<li><i class="fa-solid fa-filter"></i>${f}</li>`).join('');
}

// Color del agua del vaso "salida" según la turbidez (NTU).
function turbColor(turb) {
  if (turb < 1) return 'linear-gradient(180deg, rgba(0,212,255,0.35), rgba(0,212,255,0.6))';   // cristalina
  if (turb < 3) return 'linear-gradient(180deg, rgba(120,150,90,0.5), rgba(90,120,70,0.7))';    // turbia verdosa
  return 'linear-gradient(180deg, rgba(150,107,63,0.6), rgba(110,75,45,0.85))';                 // muy turbia / marrón
}

// Actualiza el visual antes/después con la turbidez actual de salida.
function renderClarity(turb) {
  const out = document.getElementById('clarity-out');
  if (!out) return;
  out.style.background = turbColor(turb);
  out.style.filter = `blur(${Math.min(turb * 0.8, 3)}px)`;
  const val = document.getElementById('clarity-out-val');
  if (val) {
    val.textContent = (+turb).toFixed(2) + ' NTU';
    val.style.color = turb < 1 ? 'var(--aqua)' : (turb < 3 ? 'var(--amber)' : 'var(--nasa-red)');
  }
}

// ======= ESCENARIOS DE DEMOSTRACIÓN =======
const scenarios = {
  crudo:  { ph: 6.1, temp: 25.5, tds: 680, turb: 4.6, stage: 'sin_filtro', claridad: 'turbia',              olor: 'notable', label: 'Agua cruda (sin filtrar)' },
  satur:  { ph: 6.8, temp: 24.2, tds: 430, turb: 1.9, stage: 'arena',      claridad: 'ligeramente_turbia', olor: 'leve',    label: 'Filtro saturado' },
  ph:     { ph: 5.3, temp: 24.0, tds: 240, turb: 0.7, stage: 'carbon',     claridad: 'cristalina',         olor: 'leve',    label: 'Alerta de pH' },
  limpia: { ph: 7.1, temp: 23.4, tds: 128, turb: 0.3, stage: 'hervida',    claridad: 'cristalina',         olor: 'ninguno', label: 'Agua filtrada' }
};

function injectScenario(name) {
  const s = scenarios[name];
  if (!s) return;
  const r = {
    ts: new Date().toISOString(),
    ph: s.ph, temp: s.temp, tds: s.tds, turb: s.turb, vol: 200,
    stage: s.stage, claridad: s.claridad, olor: s.olor,
    sensor: 'escenario', obs: 'Escenario de demostración: ' + s.label, status: ''
  };
  r.status = computeStatus(r);
  readings.push(r);
  if (readings.length > 500) readings.shift();
  saveReadings();
  updCards(r.ph, r.temp, r.tds, r.turb, r.vol);
  renderTable();
  updateChartsWithNewData(r);
  checkAlerts(r);
  termLog(`[ESCENARIO] ${s.label}: pH ${r.ph} | TDS ${r.tds}ppm | Turb ${r.turb}NTU`, name === 'limpia' ? 'ok' : 'vl');
  notif('Escenario: ' + s.label, `pH ${r.ph} · TDS ${r.tds} ppm · Turbidez ${r.turb} NTU`);
}
