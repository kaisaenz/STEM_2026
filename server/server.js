// ============================================================
//  server.js — Servidor de AquaNube
//  1) Sirve el sitio estático (index.html + assets) y resuelve rutas
//     limpias como /dashboard, /datos, etc. → index.html.
//  2) Expone /api/analyze-water: recibe una FOTO del agua y la envía a
//     la API GRATUITA de Google (Gemini, visión) para recomendar su uso.
//     La clave de la API vive solo en el servidor (variable de entorno)
//     — nunca llega al navegador.
//
//  Consigue una clave gratis en: https://aistudio.google.com/app/apikey
// ============================================================

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..'); // raíz del repo: index.html y assets/

const app = express();
app.use(express.json({ limit: '15mb' }));

const PORT = process.env.PORT || 8080;
// Acepta GEMINI_API_KEY o GOOGLE_API_KEY
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'; // modelo de visión (free tier)

// ---- Prompt para el análisis del agua por foto ----
const SYSTEM_PROMPT = `Eres AquaNube, un asistente que evalúa AGUA a partir de una fotografía.
Observa color, turbidez, partículas, espuma, sedimentos y cualquier signo visible.
Decide si el agua parece apta para el consumo o si necesita tratamiento, y si no es
potable, sugiere usos alternativos para no desperdiciarla y qué filtración necesitaría
(lienzo/gasa, arena, carbón activado, hervido).
Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, con esta forma:
{
  "nivel": "potable" | "no_potable" | "alerta",
  "titulo": "frase corta de veredicto",
  "detalle": "1-2 frases explicando lo que se observa en la foto",
  "usos": ["uso recomendado", "..."],
  "filtros": ["filtración recomendada", "..."],
  "confianza": "alta" | "media" | "baja"
}`;

// Extrae el primer objeto JSON de un texto (por si el modelo agrega prosa).
function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try { return JSON.parse(text.slice(start, end + 1)); }
  catch { return null; }
}

app.post('/api/analyze-water', async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({
      error: 'El servidor no tiene configurada la clave de IA (GEMINI_API_KEY). Consíguela gratis en aistudio.google.com/app/apikey'
    });
  }
  const { imageBase64, mediaType } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{
        parts: [
          { inline_data: { mime_type: mediaType || 'image/jpeg', data: imageBase64 } },
          { text: 'Analiza esta agua y responde solo con el JSON indicado.' }
        ]
      }],
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    if (!r.ok) {
      const msg = (j && j.error && j.error.message) || ('HTTP ' + r.status);
      return res.status(502).json({ error: 'La API de Google rechazó la solicitud: ' + msg });
    }

    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const data = extractJson(text);
    if (!data) {
      return res.status(502).json({ error: 'La IA respondió en un formato inesperado.', raw: text.slice(0, 300) });
    }
    res.json(data);
  } catch (err) {
    console.error('Error IA:', err.message);
    res.status(500).json({ error: 'No se pudo analizar la imagen: ' + err.message });
  }
});

// ---- Estáticos + rutas limpias (página única) ----
app.use(express.static(ROOT));
// Cualquier ruta que no sea /api ni un archivo existente → index.html
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AquaNube escuchando en http://localhost:${PORT}`);
  if (!API_KEY) console.log('⚠️  GEMINI_API_KEY no configurada: el análisis por foto responderá 503.');
});
