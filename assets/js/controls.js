// ============================================================
//  controls.js — Consola de parámetros
//  Mini-terminal sobre las tarjetas: comandos ficticios que suben/bajan
//  pH, temperatura, TDS y turbidez de forma gradual (animada), actualizando
//  las tarjetas, el veredicto de aptitud y el visual de claridad en vivo.
// ============================================================

let paramState = null;
const ptTimers = {};
const ptStep = { ph: 0.4, temp: 3, tds: 60, turb: 0.4 };       // paso por defecto
const ptDecimals = { ph: 2, temp: 1, tds: 0, turb: 2 };
const ptNames = { ph: 'pH', temp: 'temperatura', tds: 'TDS', turb: 'turbidez' };
const ptLimits = { ph: [0, 14], temp: [0, 60], tds: [0, 2000], turb: [0, 10] };

function ptInit() {
  const last = (typeof readings !== 'undefined' && readings.length) ? readings[readings.length - 1] : null;
  paramState = last
    ? { ph: +last.ph, temp: +last.temp, tds: +last.tds, turb: +last.turb }
    : { ph: 7.1, temp: 23.4, tds: 128, turb: 0.4 };
}

function ptClamp(key, v) {
  const [lo, hi] = ptLimits[key];
  return Math.min(hi, Math.max(lo, v));
}

// Refleja paramState en las tarjetas + veredicto + claridad (sin parpadeo).
function ptApply() {
  const set = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; };
  set('c-ph', paramState.ph.toFixed(2));
  set('c-temp', paramState.temp.toFixed(1));
  set('c-tds', String(Math.round(paramState.tds)));
  set('c-turb', paramState.turb.toFixed(2));
  if (typeof renderVerdict === 'function') renderVerdict(+paramState.ph, +paramState.tds, +paramState.turb);
  if (typeof renderClarity === 'function') renderClarity(+paramState.turb);
}

// Anima un parámetro hasta el objetivo (cambio lento y gradual).
function ptAnimate(key, target, ms = 2600) {
  if (!paramState) ptInit();
  target = ptClamp(key, target);
  if (ptTimers[key]) clearInterval(ptTimers[key]);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { paramState[key] = target; ptApply(); return; }
  const start = paramState[key];
  const t0 = performance.now();
  ptTimers[key] = setInterval(() => {
    const p = Math.min((performance.now() - t0) / ms, 1);
    paramState[key] = start + (target - start) * p;
    ptApply();
    if (p >= 1) { clearInterval(ptTimers[key]); ptTimers[key] = null; paramState[key] = target; ptApply(); }
  }, 80);
}

function ptLog(msg, type = 'pr') {
  const o = document.getElementById('mt-out');
  if (!o) return;
  const d = document.createElement('div');
  d.innerHTML = `<span class="${type}">${msg}</span>`;
  o.appendChild(d);
  o.scrollTop = o.scrollHeight;
}

function ptChange(key, dir, amount) {
  if (!paramState) ptInit();
  const step = (amount != null && !isNaN(amount)) ? amount : ptStep[key];
  const target = ptClamp(key, paramState[key] + dir * step);
  ptAnimate(key, target);
  ptLog(`${dir > 0 ? '▲ subiendo' : '▼ bajando'} ${ptNames[key]} → ${target.toFixed(ptDecimals[key])}`, dir > 0 ? 'vl' : 'ok');
}

function ptParam(word) {
  word = (word || '').toLowerCase();
  if (/^(ph)$/.test(word)) return 'ph';
  if (/^(temp|temperatura|temperature|t)$/.test(word)) return 'temp';
  if (/^(tds|solidos|sólidos|s)$/.test(word)) return 'tds';
  if (/^(turb|turbidez|turbiedad)$/.test(word)) return 'turb';
  return null;
}

// Atajos ficticios temáticos
const ptAliases = {
  calienta: () => ptChange('temp', 1),
  enfria: () => ptChange('temp', -1),
  'enfría': () => ptChange('temp', -1),
  acidifica: () => ptChange('ph', -1),
  alcaliniza: () => ptChange('ph', 1),
  turbia: () => ptChange('turb', 1),
  aclara: () => ptChange('turb', -1),
  contamina: () => { ptChange('tds', 1); ptChange('turb', 1); ptLog('el agua se está contaminando…', 'er'); },
  purifica: () => { ptChange('tds', -1); ptChange('turb', -1); ptLog('el agua se está purificando…', 'ok'); }
};

function ptHelp() {
  ptLog('Comandos disponibles:', 'pr');
  ptLog('&nbsp;&nbsp;subir &lt;param&gt; [n]&nbsp;&nbsp;·&nbsp;&nbsp;bajar &lt;param&gt; [n]', 'vl');
  ptLog('&nbsp;&nbsp;param: ph · temp · tds · turbidez', 'pr');
  ptLog('&nbsp;&nbsp;atajos: calienta · enfria · acidifica · alcaliniza', 'pr');
  ptLog('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;turbia · aclara · contamina · purifica · reset', 'pr');
  ptLog('&nbsp;&nbsp;ej: subir temp&nbsp;&nbsp;·&nbsp;&nbsp;bajar ph 0.5&nbsp;&nbsp;·&nbsp;&nbsp;purifica', 'vl');
}

function ptRun(raw) {
  const cmd = (raw || '').trim().toLowerCase();
  if (!cmd) return;
  ptLog('&gt; ' + raw, 'pr');
  if (cmd === 'help' || cmd === 'ayuda') { ptHelp(); return; }
  if (cmd === 'reset') { ptInit(); ptApply(); ptLog('parámetros reiniciados', 'ok'); return; }
  if (cmd === 'clear' || cmd === 'limpiar') { const o = document.getElementById('mt-out'); if (o) o.innerHTML = ''; return; }
  if (ptAliases[cmd]) { ptAliases[cmd](); return; }

  const parts = cmd.split(/\s+/);
  if (/^(subir|sube|aumenta|sub)$/.test(parts[0]) || /^(bajar|baja|reduce|disminuye|baj)$/.test(parts[0])) {
    const dir = /^(subir|sube|aumenta|sub)$/.test(parts[0]) ? 1 : -1;
    const key = ptParam(parts[1]);
    if (!key) { ptLog('parámetro no reconocido. usa: ph, temp, tds, turbidez', 'er'); return; }
    const amt = parts[2] != null ? parseFloat(parts[2]) : null;
    ptChange(key, dir, amt);
    return;
  }
  ptLog('comando no reconocido — escribe HELP', 'er');
}

function ptKey(e) {
  if (e.key !== 'Enter') return;
  const v = e.target.value;
  e.target.value = '';
  ptRun(v);
}
