// ============================================================
//  ai.js — Análisis del agua por foto (IA)
//  Envía la imagen al backend (/api/analyze-water), que a su vez consulta
//  la API de visión con la clave guardada en el servidor.
// ============================================================

let aiImage = null; // { base64, mediaType }

function aiHandleFile(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    aiImage = { base64: dataUrl.split(',')[1], mediaType: f.type || 'image/jpeg' };
    const img = document.getElementById('ai-preview');
    img.src = dataUrl;
    img.style.display = 'block';
    document.getElementById('ai-analyze').disabled = false;
    document.getElementById('ai-result').innerHTML = '';
  };
  reader.readAsDataURL(f);
}

async function aiAnalyze() {
  if (!aiImage) return;
  const btn = document.getElementById('ai-analyze');
  const out = document.getElementById('ai-result');
  const prev = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ANALIZANDO…';
  out.innerHTML = '<div class="ai-loading"><i class="fa-solid fa-spinner fa-spin"></i> Enviando la foto a la IA…</div>';
  try {
    const r = await fetch('/api/analyze-water', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: aiImage.base64, mediaType: aiImage.mediaType })
    });
    const data = await r.json();
    if (!r.ok) {
      out.innerHTML = `<div class="ai-error"><i class="fa-solid fa-triangle-exclamation"></i> ${data.error || 'No se pudo analizar.'}</div>`;
      return;
    }
    aiRenderResult(data);
    if (typeof termLog === 'function') termLog('[IA] ' + (data.titulo || 'Análisis por foto completado'), 'vl');
  } catch (e) {
    out.innerHTML = '<div class="ai-error"><i class="fa-solid fa-plug-circle-xmark"></i> No se pudo conectar con el servidor de análisis.</div>';
  } finally {
    btn.disabled = false;
    btn.innerHTML = prev;
  }
}

function aiRenderResult(d) {
  const lvl = ['potable', 'no_potable', 'alerta'].includes(d.nivel) ? d.nivel : 'alerta';
  const usos = (d.usos || []).map(u => `<li><i class="fa-solid fa-check"></i>${u}</li>`).join('') || '<li><i class="fa-solid fa-minus"></i>—</li>';
  const filtros = (d.filtros || []).map(f => `<li><i class="fa-solid fa-filter"></i>${f}</li>`).join('') || '<li><i class="fa-solid fa-minus"></i>—</li>';
  document.getElementById('ai-result').innerHTML = `
    <div class="card verdict ${lvl}" style="margin-top:1.1rem;">
      <div class="verdict-head">
        <div class="verdict-icon"><i class="fa-solid fa-eye"></i></div>
        <div>
          <div class="verdict-title">${d.titulo || 'Resultado del análisis'}</div>
          <div class="verdict-detail">${d.detalle || ''}${d.confianza ? ` · confianza ${d.confianza}` : ''}</div>
        </div>
      </div>
      <div class="verdict-cols">
        <div><div class="vd-sub">Usos recomendados</div><ul>${usos}</ul></div>
        <div><div class="vd-sub">Filtración sugerida</div><ul>${filtros}</ul></div>
      </div>
    </div>`;
}
