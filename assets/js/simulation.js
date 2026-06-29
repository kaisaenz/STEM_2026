// ============================================================
//  simulation.js — Modo Demostración
//  Genera un flujo de lecturas realistas (sin hardware conectado)
//  y las inyecta en el mismo pipeline que los datos reales.
//  Pensado para exponer el dashboard "en vivo" durante la olimpiada.
// ============================================================

let demoTimer = null;
let demoActive = false;

// Estado base alrededor del cual oscilan los sensores simulados
let demoState = { ph: 7.1, tds: 134, turb: 0.4, temp: 24 };

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

// Genera una lectura nueva con un "random walk" suave (valores creíbles
// que se mueven poco a poco, como sensores reales).
function genReading() {
  demoState.ph = +clamp(demoState.ph + (Math.random() - 0.5) * 0.25, 6.6, 7.8).toFixed(2);
  demoState.tds = Math.round(clamp(demoState.tds + (Math.random() - 0.5) * 22, 90, 230));
  demoState.turb = +clamp(demoState.turb + (Math.random() - 0.5) * 0.2, 0.1, 1.2).toFixed(2);
  demoState.temp = +clamp(demoState.temp + (Math.random() - 0.5) * 0.8, 21, 27).toFixed(1);

  const inc = Math.round(80 + Math.random() * 120); // mL recolectados este ciclo
  const stages = ['lienzo', 'carbon', 'arena', 'hervida'];

  const r = {
    ts: new Date().toISOString(),
    ph: demoState.ph,
    temp: demoState.temp,
    tds: demoState.tds,
    turb: demoState.turb,
    vol: inc,
    stage: stages[Math.floor(Math.random() * stages.length)],
    claridad: demoState.turb < 0.6 ? 'cristalina' : 'ligeramente_turbia',
    olor: 'ninguno',
    sensor: 'demo',
    obs: 'Lectura simulada (modo demostración)',
    status: ''
  };
  r.status = computeStatus(r);
  return r;
}

function demoTick() {
  const r = genReading();
  readings.push(r);
  if (readings.length > 500) readings.shift(); // evita crecer sin límite
  saveReadings();
  updCards(r.ph, r.temp, r.tds, r.turb, r.vol);
  renderTable();
  updateChartsWithNewData(r);
  checkAlerts(r);
  termLog(`[DEMO] pH ${r.ph} | TDS ${r.tds}ppm | Turb ${r.turb}NTU | ${r.temp}°C`, 'vl');
}

// Intervalo tomado del control deslizante "Intervalo de lectura".
function demoIntervalMs() {
  const el = document.getElementById('iv-range');
  const sec = el ? parseInt(el.value) : 3;
  return Math.max(1, sec) * 1000;
}

// Actualiza el badge de estado del sistema (demo / hardware / desconectado).
function setMode(mode) {
  const b = document.getElementById('mode-badge');
  if (!b) return;
  b.classList.remove('demo', 'hardware');
  if (mode === 'demo') { b.classList.add('demo'); b.textContent = 'DEMO EN VIVO'; }
  else if (mode === 'hardware') { b.classList.add('hardware'); b.textContent = 'HARDWARE CONECTADO'; }
  else { b.textContent = 'DESCONECTADO'; }
}

function startDemo() {
  if (demoActive) return;
  demoActive = true;
  setMode('demo');
  document.getElementById('flow-diagram').classList.add('live');
  const btn = document.getElementById('demo-btn');
  if (btn) {
    btn.classList.add('is-on');
    btn.innerHTML = '<i class="fa-solid fa-stop"></i> DETENER DEMOSTRACIÓN';
  }
  termLog('▶ Modo demostración iniciado — generando lecturas en vivo.', 'ok');
  notif('Modo demostración', 'Generando datos de sensores en vivo.');
  demoTick();
  demoTimer = setInterval(demoTick, demoIntervalMs());
}

function stopDemo() {
  if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
  if (!demoActive) return;
  demoActive = false;
  document.getElementById('flow-diagram').classList.remove('live');
  const btn = document.getElementById('demo-btn');
  if (btn) {
    btn.classList.remove('is-on');
    btn.innerHTML = '<i class="fa-solid fa-play"></i> MODO DEMOSTRACIÓN';
  }
  termLog('⏹ Modo demostración detenido.', 'er');
  setMode('off');
}

function toggleDemo() {
  if (demoActive) stopDemo();
  else startDemo();
}

// Si cambia el intervalo mientras la demo corre, reinicia el temporizador.
function restartDemoIfActive() {
  if (!demoActive || !demoTimer) return;
  clearInterval(demoTimer);
  demoTimer = setInterval(demoTick, demoIntervalMs());
}
