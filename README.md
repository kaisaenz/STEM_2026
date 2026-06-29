# 🌊 AQUANUBE

## Sistema Ecológico de Filtración y Purificación de Agua

> **Olimpiadas STEM Bolivia 2026** · Categoría: Ciencia, Salud y Sostenibilidad
> **Equipo:** Guardianes de la Ciencia · Categoría Juveniles
> **Ubicación:** Santa Cruz de la Sierra, Bolivia

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Problema que Resuelve](#-problema-que-resuelve)
- [Solución Propuesta](#-solución-propuesta)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)
- [Stack Tecnológico](#-stack-tecnológico)
- [Métricas del Sistema](#-métricas-del-sistema)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

## 🎯 Descripción del Proyecto

**AQUANUBE** es un sistema ecológico que recolecta, filtra y purifica cualquier tipo de agua residual o desperdiciada, utilizando materiales accesibles como **lienzo/gasa, carbón activado y arena fina**. El sistema transforma el desperdicio hídrico en agua reutilizable para riego, limpieza e industria, acompañado de un **dashboard web interactivo** que monitorea la calidad del agua en tiempo real.

### Flujo del Sistema

```
💧 Fuente de Agua (Cualquier tipo de agua residual)
    │
    ▼
🪣 Recipiente de Recolección (Pecera/Vidrio)
    │
    ▼
🧵 Etapa 1: Filtro de Lienzo/Gasa
    │           └── Retiene partículas sólidas grandes
    ▼
⚫ Etapa 2: Carbón Activado
    │           └── Absorbe impurezas químicas, elimina olores
    ▼
🏖️ Etapa 3: Arena Fina
    │           └── Filtro mecánico, elimina partículas en suspensión
    ▼
🔥 Etapa 4: Hervido Final
    │           └── Eliminación de microorganismos
    ▼
💧 Agua Limpia → 🌿 Lista para Reutilización
```

---

## 🔴 Problema que Resuelve

- Gran cantidad de agua residual o de lluvia es **desperdiciada diariamente**
- Muchas personas enfrentan **escasez de agua potable**
- El agua residual o desperdiciada contiene impurezas y microorganismos que impiden su consumo directo
- En Santa Cruz, Bolivia, existen grandes volúmenes de agua que podrían ser reutilizados pero que simplemente se desechan

---

## 💡 Solución Propuesta

AQUANUBE captura y trata esta agua mediante un sistema de **4 etapas de filtración** con materiales económicos y reutilizables, monitoreado digitalmente por sensores conectados a un microcontrolador (Arduino/ESP32) y visualizado en un dashboard web en tiempo real.

### Resultados Observados

| Criterio | Resultado |
|---|---|
| **Claridad visual** | Cristalina — agua transparente tras 3 etapas |
| **Control de olor** | Sin olor — el carbón activado elimina residuos |
| **Limpieza general** | Apta para riego, limpieza e industrial |
| **pH promedio** | 7.1 (rango óptimo: 6.5 – 8.5) |
| **TDS promedio** | 134 ppm (aceptable: <500 ppm) |
| **Turbidez** | 0.4 NTU (cristalina: <1 NTU) |
| **Volumen diario** | ~11.8 litros/día |

---

## 📁 Estructura del Proyecto

```
ESTEM )!/
├── index.html                    ← Dashboard web (página principal)
├── assets/
│   ├── css/
│   │   └── styles.css            ← Estilos del dashboard (tema espacial)
│   ├── js/
│   │   ├── state.js              ← Datos y persistencia (localStorage)
│   │   ├── charts.js             ← Gráficos Chart.js
│   │   ├── hardware.js           ← Web Serial (Arduino) + lectura WiFi (ESP32)
│   │   ├── simulation.js         ← Modo Demostración (sensores simulados en vivo)
│   │   ├── ui.js                 ← Tabla, formulario, importar/exportar, terminal
│   │   └── main.js               ← Arranque e inicialización
│   └── img/                      ← logo_stem.png, equipo.png
├── README.md                     ← Este archivo
├── ARQUITECTURA.md               ← Estructura técnica y arquitectura del sistema
├── HARDWARE_INTEGRACION.md       ← Componentes, conexiones y código para hardware
├── GUIA_USO.md                   ← Manual de uso del dashboard web
├── Dockerfile                    ← Imagen nginx para servir el sitio
└── docker-compose.yml            ← Levanta el sitio en http://localhost:8080
```

> El dashboard pasó de un único archivo HTML a una estructura con CSS y JavaScript
> separados por responsabilidad, más fácil de mantener.

---

## ▶️ Cómo Ejecutar

**Opción rápida:** abre `index.html` directamente en el navegador (doble clic).

**Con Docker (servidor nginx):**

```bash
docker-compose up --build
# luego abre http://localhost:8080
```

Para ver el dashboard funcionando sin hardware, pulsa **«Modo Demostración»**
(o el botón «Iniciar demostración en vivo» del inicio): el sistema genera lecturas
de sensores simuladas y actualiza tarjetas, gráficos y el diagrama de filtración en vivo.

---

## 📚 Documentación

| Documento | Descripción |
|---|---|
| [ARQUITECTURA.md](ARQUITECTURA.md) | Arquitectura completa del sistema: frontend, backend simulado, flujo de datos, diagramas, componentes CSS, estructura JavaScript |
| [HARDWARE_INTEGRACION.md](HARDWARE_INTEGRACION.md) | Guía exhaustiva de componentes de hardware para todos los casos, diagramas de conexión, código Arduino/ESP32, calibración, BOM completo |
| [GUIA_USO.md](GUIA_USO.md) | Manual de usuario del dashboard: cómo registrar datos, importar archivos, exportar reportes, usar la terminal y controlar el sistema |

---

## 🛠️ Stack Tecnológico

### Frontend (Dashboard Web)

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica del dashboard |
| **CSS3** | Diseño visual con variables CSS, glassmorphism, animaciones, responsive |
| **JavaScript (Vanilla)** | Lógica del dashboard en módulos (`state`, `charts`, `hardware`, `simulation`, `ui`, `main`) |
| **Modo Demostración** | Simulación de sensores en vivo para exponer el dashboard sin hardware conectado |
| **Chart.js 4.4.1** | Gráficos interactivos (pH, TDS, turbidez, temperatura, volumen) |
| **Font Awesome 6.5** | Iconografía del sistema |
| **Google Fonts** | Tipografías: Orbitron, Space Grotesk, JetBrains Mono |

### Hardware (Sistema Físico)

| Tecnología | Uso |
|---|---|
| **Arduino UNO R3** | Microcontrolador para conexión USB Serial |
| **ESP32 DevKit** | Microcontrolador con WiFi integrado |
| **Web Serial API** | Comunicación directa navegador ↔ Arduino |
| **HTTP/JSON** | Comunicación WiFi ESP32 ↔ navegador |
| **Sensores** | pH (PH-4502C), TDS (V1.0), Turbidez (SEN0189), Temperatura (DS18B20) |

---

## 📊 Métricas del Sistema

| Parámetro | Valor Óptimo | Unidad | Sensor |
|---|---|---|---|
| pH | 6.5 – 8.5 | — | PH-4502C |
| TDS | < 500 | ppm | TDS Meter V1.0 |
| Turbidez | < 1 | NTU | SEN0189 |
| Temperatura | 20 – 30 | °C | DS18B20 |
| Volumen | variable | mL/día | Medición manual |

---

## 🌍 Impacto

### Social
Promueve el aprovechamiento del agua y la conciencia ambiental, especialmente en zonas con escasez hídrica. Fomenta la cultura científica desde los jóvenes bolivianos.

### Económico
Reduce el desperdicio de agua con materiales de bajo costo y fácil acceso en Bolivia. Puede disminuir costos en usos no potables.

### Ambiental
Utiliza materiales reutilizables, reduce el desperdicio de agua y disminuye el uso de plásticos de un solo uso.

---

## 👥 Equipo

| Miembro | Rol | Contacto |
|---|---|---|
| **Juan Marcos Lopez Ortiz** | Líder del proyecto | ing.jmarcos.lopez@gmail.com |

- **Teléfono:** +591 76013722
- **Ubicación:** Santa Cruz de la Sierra, Bolivia
- **Organización:** Guardianes de la Ciencia

---

## 📄 Licencia

Proyecto desarrollado para las **Olimpiadas STEM Bolivia 2026** — Categoría Ciencia, Salud y Sostenibilidad.

© 2026 AQUANUBE · Guardianes de la Ciencia · Santa Cruz, Bolivia
