// ============================================================
//  state.js — datos y persistencia compartida del dashboard
//  Carga ANTES que charts.js, hardware.js, simulation.js y ui.js.
// ============================================================

// Lecturas guardadas (persisten en el navegador con localStorage)
let readings = JSON.parse(localStorage.getItem('aquanube_data')) || [];

function saveReadings() {
  localStorage.setItem('aquanube_data', JSON.stringify(readings));
}

// Etiquetas legibles de cada etapa del filtro
const etapaMap = {
  sin_filtro: 'Sin filtrar',
  lienzo: 'Lienzo/Gasa',
  carbon: 'C. Activado',
  arena: 'Arena',
  hervida: 'Hervida'
};
const etapas = ['lienzo', 'carbon', 'carbon', 'arena', 'hervida'];

// Calcula el estado de calidad de una lectura (óptimo / revisar / alerta).
// Centralizado aquí porque lo usan la entrada manual, el serial y la simulación.
function computeStatus(r) {
  return (r.ph >= 6.5 && r.ph <= 8.5 && r.tds < 300 && r.turb < 1)
    ? 'optimal'
    : (r.tds > 400 ? 'alert' : 'warn');
}
