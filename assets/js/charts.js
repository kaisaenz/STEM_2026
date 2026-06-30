// ============================================================
//  charts.js — gráficos Chart.js del dashboard
//  Requiere: Chart.js (CDN) + state.js. Crea los gráficos al cargar,
//  por eso este script va al final del <body> (los <canvas> ya existen).
// ============================================================

const L24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

function getChartData(key) {
  const arr = L24.map(() => 0);
  const r24 = readings.slice(-24);
  for (let i = 0; i < r24.length; i++) {
    arr[arr.length - r24.length + i] = r24[i][key] || 0;
  }
  return arr;
}

const phD = getChartData('ph');
const tdsD = getChartData('tds');
const turbD = getChartData('turb');
const tempD = getChartData('temp');
const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const volD = days.map(() => 0);

const co = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(26,47,74,0.4)' }, ticks: { color: '#4A6A8A', font: { family: "'JetBrains Mono'", size: 9 } } },
    y: { grid: { color: 'rgba(26,47,74,0.4)' }, ticks: { color: '#4A6A8A', font: { family: "'JetBrains Mono'", size: 9 } } }
  }
};

// Se crean solo si Chart.js (CDN) cargó. Si no, quedan undefined y el resto
// del dashboard (veredicto, tabla, IA…) sigue funcionando igual.
let chartMain, chartVol, chartTurb, chartMejora, chartTemp;

if (typeof Chart !== 'undefined') {
  chartMain = new Chart('cMain', {
    type: 'line', data: {
      labels: L24, datasets: [
        { data: phD, borderColor: '#00FF88', backgroundColor: 'rgba(0,255,136,0.05)', borderWidth: 2, pointRadius: 1, tension: 0.4, fill: true },
        { data: tdsD.map(v => +(v / 10).toFixed(1)), borderColor: '#00D4FF', backgroundColor: 'rgba(0,212,255,0.04)', borderWidth: 2, pointRadius: 1, tension: 0.4, borderDash: [5, 3], fill: true }
      ]
    }, options: co
  });

  chartVol = new Chart('cVol', {
    type: 'bar', data: {
      labels: days, datasets: [
        { data: volD, backgroundColor: 'rgba(255,184,0,0.18)', borderColor: '#FFB800', borderWidth: 2, borderRadius: 4 }
      ]
    }, options: co
  });

  chartTurb = new Chart('cTurb', {
    type: 'line', data: {
      labels: L24, datasets: [
        { data: turbD, borderColor: '#FFB800', backgroundColor: 'rgba(255,184,0,0.06)', borderWidth: 2, pointRadius: 0, tension: 0.4, fill: true }
      ]
    }, options: { ...co, scales: { ...co.scales, y: { ...co.scales.y, min: 0, max: 1.5 } } }
  });

  chartMejora = new Chart('cMejora', {
    type: 'bar', data: {
      labels: ['Lienzo', 'C.Activ.', 'Arena', 'Hervida'], datasets: [
        { data: [0, 0, 0, 0], backgroundColor: ['rgba(0,212,255,0.2)', 'rgba(0,212,255,0.35)', 'rgba(0,255,136,0.2)', 'rgba(0,255,136,0.4)'], borderColor: ['#00D4FF', '#00D4FF', '#00FF88', '#00FF88'], borderWidth: 2, borderRadius: 4 }
      ]
    }, options: { ...co, scales: { ...co.scales, y: { ...co.scales.y, min: 0, max: 100 } } }
  });

  chartTemp = new Chart('cTemp', {
    type: 'line', data: {
      labels: L24, datasets: [
        { data: tempD, borderColor: '#FC3D21', backgroundColor: 'rgba(252,61,33,0.06)', borderWidth: 2, pointRadius: 0, tension: 0.4, fill: true }
      ]
    }, options: co
  });
}

// Desliza la ventana de 24 puntos e inserta la última lectura.
function updateChartsWithNewData(r) {
  if (!chartMain || !r) return;
  chartMain.data.datasets[0].data.shift(); chartMain.data.datasets[0].data.push(r.ph);
  chartMain.data.datasets[1].data.shift(); chartMain.data.datasets[1].data.push(r.tds / 10);
  chartMain.update();
  chartTurb.data.datasets[0].data.shift(); chartTurb.data.datasets[0].data.push(r.turb);
  chartTurb.update();
  chartTemp.data.datasets[0].data.shift(); chartTemp.data.datasets[0].data.push(r.temp);
  chartTemp.update();
}
