// ============================================================
//  main.js — arranque del dashboard
//  Se carga al final: el DOM y el resto de módulos ya existen.
// ============================================================

// Render inicial de la tabla y estado base
renderTable();
setMode('off');
document.getElementById('f-fecha').value = new Date().toISOString().slice(0, 16);

// Mostrar la última lectura guardada en las tarjetas (si hay historial)
if (readings.length) {
  const last = readings[readings.length - 1];
  updCards(last.ph, last.temp, last.tds, last.turb, last.vol);
}

// Permite URLs tipo /dashboard o /datos (además de #dashboard):
// si la ruta coincide con el id de una sección, se desplaza hasta ella.
(function scrollFromPath() {
  const seg = location.pathname.replace(/^\/+|\/+$/g, '');
  const target = seg && document.getElementById(seg);
  if (target) {
    requestAnimationFrame(() => target.scrollIntoView());
  }
})();

// Reloj del sistema en el nav
setInterval(() => {
  document.getElementById('sys-time').textContent = 'SISTEMA EN LÍNEA · ' + new Date().toLocaleTimeString('es-BO');
}, 1000);

// Reveal de secciones al hacer scroll
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('v');
}), { threshold: 0.07 });
document.querySelectorAll('.fi').forEach(el => obs.observe(el));

// Resaltar el enlace de navegación de la sección visible
window.addEventListener('scroll', () => {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) cur = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur)
  );
});
