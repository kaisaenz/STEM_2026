# 🌊 AquaNube

## Sistema inteligente de análisis y reutilización del agua

> **Olimpiadas STEM+ Bolivia 2026** · Categoría: Ciencia, Salud y Sostenibilidad
> **Equipo:** Guardianes de la Ciencia · Categoría Juveniles
> **Ubicación:** Santa Cruz de la Sierra, Bolivia

> *Lo que el ojo humano no puede ver… AquaNube lo convierte en información.*

---

## 🎯 ¿Qué es AquaNube?

**AquaNube** es un sistema inteligente capaz de analizar cualquier tipo de agua midiendo su
**pH, temperatura y turbidez**. A través de una página web muestra los resultados y ayuda a
identificar si el agua es **apta para el consumo** o si necesita algún tipo de tratamiento.

Además, si el agua no es recomendable para beber, AquaNube **propone nuevos usos** —como el
riego de plantas o tareas de limpieza— para evitar desperdiciarla, y recomienda qué tipo de
**filtración** necesita (lienzo/gasa, arena, carbón activado, hervido).

Con AquaNube no solo buscamos más seguridad al consumir agua, sino también promover el
**uso responsable del agua**.

---

## ✨ Funcionalidades

| Función | Descripción |
|---|---|
| **Monitoreo de sensores** | pH, temperatura y turbidez (más TDS y volumen como datos adicionales) en tarjetas y gráficos en vivo. |
| **Veredicto de aptitud** | Clasifica el agua en *apta para consumo*, *no apta pero reutilizable* o *requiere tratamiento*, con usos alternativos y filtración recomendada. |
| **Análisis por foto (IA)** | Sube o toma una foto del agua y la inteligencia artificial (Google Gemini) recomienda su uso según lo que se ve. |
| **Modo Demostración** | Genera lecturas de sensores simuladas en vivo para exponer el dashboard sin hardware conectado. |
| **Escenarios de demostración** | Botones que inyectan situaciones (agua cruda, filtro saturado, alerta de pH, agua filtrada) para mostrar la reacción del sistema. |
| **De turbio a cristalino** | Comparación visual del agua de entrada vs. la salida según la turbidez medida. |
| **Hardware real** | Conexión por USB (Web Serial · Arduino) o WiFi (ESP32/NodeMCU). |
| **Datos** | Registro manual, importación de CSV/JSON, historial y exportación a CSV/JSON/PDF (persiste en el navegador). |

---

## 📁 Estructura del Proyecto

```
AquaNube/
├── index.html                 ← Página principal (estructura)
├── server/
│   ├── server.js              ← Servidor Node/Express: sirve el sitio y hace
│   │                            de proxy seguro hacia la IA (Gemini)
│   └── package.json           ← Dependencias del servidor (express)
├── assets/
│   ├── css/styles.css         ← Estilos (tema espacial)
│   ├── js/
│   │   ├── state.js           ← Datos y persistencia (localStorage)
│   │   ├── charts.js          ← Gráficos Chart.js
│   │   ├── hardware.js        ← Web Serial (Arduino) + lectura WiFi (ESP32)
│   │   ├── simulation.js      ← Modo Demostración (sensores simulados)
│   │   ├── evaluation.js      ← Veredicto de aptitud + escenarios + visual claridad
│   │   ├── ai.js              ← Análisis del agua por foto (llama al backend)
│   │   ├── ui.js              ← Tabla, formulario, importar/exportar, terminal
│   │   └── main.js            ← Arranque e inicialización
│   └── img/                   ← logo_aquanube.png, logo_stem.png, equipo.png
├── Dockerfile                 ← Imagen Node para servir el sitio + API
├── docker-compose.yml         ← Levanta el servicio en http://localhost:8080
├── render.yaml                ← Blueprint para desplegar en Render
├── README.md                  ← Este archivo
├── ARQUITECTURA.md            ← Estructura técnica y arquitectura
├── HARDWARE_INTEGRACION.md    ← Componentes, conexiones y código de hardware
└── GUIA_USO.md                ← Manual de uso del dashboard
```

---

## ▶️ Cómo Ejecutar

### Opción A — Node directamente

```bash
cd server && npm install && cd ..
GEMINI_API_KEY=tu_clave PORT=8080 node server/server.js
# Abre http://localhost:8080
```

### Opción B — Docker

```bash
GEMINI_API_KEY=tu_clave docker compose up --build
# Abre http://localhost:8080
```

> El sitio funciona completo sin la clave; solo el botón **«Analizar con IA»** pedirá
> configurar `GEMINI_API_KEY` mientras no esté definida.

---

## 🤖 Configurar la IA (análisis por foto)

El análisis por foto usa la **API gratuita de Google (Gemini)**. La clave vive solo en el
servidor (variable de entorno) y **nunca se expone al navegador**.

1. Consigue una clave gratuita en **https://aistudio.google.com/app/apikey**.
2. Defínela como variable de entorno `GEMINI_API_KEY` (local, en `docker-compose` o en Render).
3. (Opcional) Cambia el modelo con `GEMINI_MODEL` (por defecto `gemini-2.0-flash`).

---

## 🚀 Publicar en Render

1. Sube el repositorio a GitHub.
2. En **Render → New → Blueprint**, conecta el repositorio. Render detecta `render.yaml`
   y crea el servicio web (Docker).
3. En el servicio, define la variable **`GEMINI_API_KEY`** (Settings → Environment).
4. Render te dará una URL pública (ej. `https://aquanube.onrender.com`).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3 (variables, glassmorphism, animaciones), JavaScript (módulos), Chart.js 4.4.1, html2pdf, Font Awesome 6.5, Google Fonts |
| **Backend** | Node.js + Express (sirve el sitio y hace de proxy seguro hacia la IA) |
| **IA (visión)** | Google Gemini (`gemini-2.0-flash`, free tier) |
| **Hardware** | Arduino UNO R3 (USB/Serial), ESP32/NodeMCU (WiFi/HTTP), sensores de pH, temperatura y turbidez |
| **Despliegue** | Docker · Render |

---

## 📊 Parámetros que mide

| Parámetro | Rango óptimo | Unidad | Sensor |
|---|---|---|---|
| pH | 6.5 – 8.5 | — | PH-4502C |
| Temperatura | 20 – 30 | °C | DS18B20 |
| Turbidez | < 1 | NTU | SEN0189 |

*(El sistema también admite TDS y volumen como datos adicionales.)*

---

## 🌍 Impacto

- **Social:** brinda mayor seguridad al consumir agua y ayuda a las personas a tomar mejores
  decisiones sobre su tratamiento y uso.
- **Económico:** permite aprovechar mejor el agua disponible, reduciendo gastos en agua
  embotellada y ayudando a prevenir costos por problemas de salud causados por agua de mala calidad.
- **Ambiental:** favorece la reutilización del agua y ayuda a reducir el uso de botellas
  plásticas y el desperdicio de este recurso.

---

## 👥 Equipo

**Guardianes de la Ciencia** — Olimpiadas STEM+ Bolivia 2026, Santa Cruz de la Sierra.

---

## 📄 Licencia

Proyecto desarrollado para las **Olimpiadas STEM+ Bolivia 2026** — Categoría Ciencia, Salud y Sostenibilidad.

© 2026 AquaNube · Guardianes de la Ciencia · Santa Cruz, Bolivia
