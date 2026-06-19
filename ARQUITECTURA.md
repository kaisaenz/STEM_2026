# 🏗️ AQUANUBE — Arquitectura y Estructura Técnica

## Documentación completa de la estructura, arquitectura y funcionamiento del sistema

> [!NOTE]
> Este documento describe en detalle cómo está construido el dashboard web de AQUANUBE, su organización interna, los patrones de diseño utilizados y el flujo de datos completo del sistema.

---

## 📐 Visión General de la Arquitectura

```mermaid
graph TB
    subgraph "🌐 CAPA DE PRESENTACIÓN — Frontend"
        HTML["HTML5<br/>Estructura Semántica"]
        CSS["CSS3<br/>Variables + Animaciones"]
        JS["JavaScript<br/>Lógica + Interactividad"]
        CHART["Chart.js 4.4.1<br/>Gráficos en Tiempo Real"]
    end

    subgraph "⚡ CAPA DE DATOS — Motor Local"
        STORE["Array readings[]<br/>Almacén de Mediciones"]
        GEN["Generador de Datos<br/>Simulados (demo)"]
        IMPORT["Importador<br/>CSV / JSON / TXT"]
        EXPORT["Exportador<br/>CSV / JSON / PDF"]
    end

    subgraph "🔌 CAPA DE HARDWARE — Sensores Físicos"
        SENSORS["Sensores<br/>pH + TDS + Turb + Temp"]
        MCU["Arduino / ESP32<br/>Microcontrolador"]
        SERIAL["Web Serial API<br/>(USB)"]
        WIFI["HTTP Fetch<br/>(WiFi ESP32)"]
    end

    HTML --> CSS
    CSS --> JS
    JS --> CHART
    JS --> STORE
    GEN --> STORE
    IMPORT --> STORE
    STORE --> EXPORT
    SENSORS --> MCU
    MCU --> SERIAL
    MCU --> WIFI
    SERIAL --> JS
    WIFI --> JS
```

---

## 📁 Estructura del Archivo Principal

El proyecto está contenido en un **archivo HTML único** (`AQUANUBE_sitio_web.html`) con CSS y JavaScript embebidos, para máxima portabilidad. Se puede abrir directamente en cualquier navegador sin servidor.

```
AQUANUBE_sitio_web.html (59 KB, 1016 líneas)
│
├── <head> ..................... Líneas 1-356
│   ├── Meta tags + SEO
│   ├── Google Fonts (Orbitron, Space Grotesk, JetBrains Mono)
│   ├── Font Awesome 6.5 (iconos)
│   ├── Chart.js 4.4.1 CDN
│   └── <style> ............... Líneas 10-355
│       ├── Variables CSS (:root)
│       ├── Reset + Base
│       ├── Navegación (nav)
│       ├── Hero Section
│       ├── Secciones comunes
│       ├── Tarjetas (cards)
│       ├── Métricas (mc)
│       ├── Gráficos (charts)
│       ├── Alertas
│       ├── Tablas
│       ├── Formularios
│       ├── Upload zone
│       ├── Tabs
│       ├── Terminal
│       ├── Diagrama de flujo
│       ├── Impacto
│       ├── Materiales
│       ├── Resultados
│       ├── Misión
│       ├── Exportar
│       ├── Contacto
│       ├── Notificaciones
│       ├── Footer
│       ├── Animaciones
│       └── Media Queries (@960px, @580px)
│
├── <body> .................... Líneas 357-818
│   ├── Notificación flotante (id="notif")
│   ├── Navegación fija (nav)
│   ├── HERO (id="inicio")
│   ├── DASHBOARD (id="dashboard")
│   │   ├── Alerta de estado
│   │   ├── Métricas grid (pH, Temp, TDS, Turb)
│   │   ├── Gráfico línea: pH y TDS 24h
│   │   ├── Gráfico barras: Volumen diario
│   │   ├── Gráfico línea: Turbidez
│   │   ├── Gráfico barras: Mejora por etapa
│   │   └── Gráfico línea: Temperatura
│   ├── DATOS (id="datos")
│   │   ├── Tab: Entrada Manual (formulario)
│   │   ├── Tab: Importar CSV/JSON
│   │   ├── Tab: Historial (tabla)
│   │   └── Tab: Exportar (CSV, JSON, PDF)
│   ├── SISTEMA (id="sistema")
│   │   ├── Terminal simulada
│   │   ├── Diagrama de flujo visual
│   │   └── Controles del sistema
│   ├── MATERIALES (id="materiales")
│   ├── IMPACTO (id="impacto")
│   │   ├── Social, Económico, Ambiental
│   │   └── Resultados observados
│   ├── MISIÓN (id="mision")
│   ├── CONTACTO (id="contacto")
│   └── FOOTER
│
└── <script> .................. Líneas 820-1013
    ├── DATA: Array readings[] + generador
    ├── CHARTS: Configuración de 5 gráficos
    ├── TABLE: Renderizado de historial
    ├── FORM: Registro manual de mediciones
    ├── TABS: Navegación por pestañas
    ├── FILE: Drag & drop + importación
    ├── EXPORT: CSV, JSON, PDF
    ├── TERMINAL: Emulador de comandos
    ├── NOTIF: Sistema de notificaciones
    ├── CLOCK: Reloj en tiempo real
    ├── AUTO-UPDATE: Lecturas automáticas
    ├── INIT: Configuración inicial
    ├── SCROLL ANIM: IntersectionObserver
    └── NAV ACTIVE: Scroll spy
```

---

## 🎨 Sistema de Diseño (Design System)

### Paleta de Colores

| Variable | Valor | Uso |
|---|---|---|
| `--nasa-blue` | `#0B3D91` | Acento institucional, elementos NASA |
| `--nasa-red` | `#FC3D21` | Temperatura, alertas |
| `--space-dark` | `#060B17` | Fondo principal |
| `--space-card` | `#111D2E` | Fondo de tarjetas |
| `--space-border` | `#1A2F4A` | Bordes de elementos |
| `--aqua` | `#00D4FF` | Color primario, TDS, enlaces activos |
| `--green-pure` | `#00FF88` | pH, estados óptimos, éxito |
| `--amber` | `#FFB800` | Turbidez, advertencias |
| `--purple` | `#B57BFF` | Impacto social, badges |
| `--text-primary` | `#E8F4FF` | Texto principal |
| `--text-secondary` | `#8BACC8` | Texto secundario |
| `--text-muted` | `#4A6A8A` | Texto atenuado, etiquetas |

### Tipografías

| Font | Variable | Uso |
|---|---|---|
| **Orbitron** | `--font-display` | Títulos, valores numéricos, branding |
| **Space Grotesk** | `--font-body` | Texto de cuerpo, descripciones |
| **JetBrains Mono** | `--font-mono` | Terminal, etiquetas, datos técnicos |

### Componentes Visuales

| Componente | Clase CSS | Descripción |
|---|---|---|
| Tarjeta base | `.card` | Fondo oscuro con borde sutil, hover interactivo |
| Métrica | `.mc` | Tarjeta con barra de color superior, icono, valor grande |
| Badge | `.badge` | Etiqueta redondeada con variantes `.blue`, `.green`, `.purple` |
| Botón primario | `.btn-p` | Fondo aqua, texto oscuro |
| Botón secundario | `.btn-s` | Transparente con borde |
| Pill de estado | `.pill` | Variantes `.ok`, `.warn`, `.bad` |
| Terminal | `.term-wrap` | Emulador visual con barra de dots macOS |
| Nodo de flujo | `.fnode` | Variantes `.src`, `.act`, `.out` |

---

## ⚙️ Arquitectura JavaScript

### Modelo de Datos

```javascript
// Estructura de una lectura/medición
{
  ts: "2026-05-18T19:00:00.000Z",  // ISO timestamp
  ph: 7.1,                          // pH (0-14)
  temp: 24.2,                       // Temperatura °C
  tds: 134,                         // Sólidos disueltos (ppm)
  turb: 0.4,                        // Turbidez (NTU)
  vol: 420,                         // Volumen recolectado (mL)
  stage: "carbon",                   // Etapa: sin_filtro|lienzo|carbon|arena|hervida
  claridad: "cristalina",           // Evaluación visual
  olor: "ninguno",                   // Evaluación olfativa
  sensor: "arduino",                 // Fuente: arduino|manual|laboratorio
  status: "optimal",                 // Estado: optimal|warn|alert
  obs: "Observaciones opcionales"    // Notas del operador
}
```

### Flujo de Datos

```mermaid
flowchart LR
    A["📝 Entrada Manual"] --> D["readings[]"]
    B["📂 Importación CSV/JSON"] --> D
    C["⚡ Auto-generación (demo)"] --> D
    H["🔌 Hardware Real"] --> D

    D --> E["📊 Gráficos Chart.js"]
    D --> F["📋 Tabla de Historial"]
    D --> G["🖥️ Tarjetas de Métricas"]
    D --> I["📤 Exportación CSV/JSON/PDF"]
    D --> J["💻 Terminal de Log"]
```

### Módulos Funcionales

| Módulo | Funciones | Líneas | Responsabilidad |
|---|---|---|---|
| **Data** | `gen()` | 826-837 | Generador de datos simulados |
| **Charts** | — (inicialización) | 839-876 | 5 gráficos Chart.js (pH/TDS, Vol, Turb, Mejora, Temp) |
| **Table** | `statusPill()`, `renderTable()` | 878-896 | Renderizado del historial con pills de estado |
| **Form** | `submitManual()`, `updCards()` | 898-934 | Captura y validación de formulario manual |
| **Tabs** | `switchTab()` | 936-942 | Navegación entre pestañas |
| **File** | `dragOver()`, `dropFile()`, `handleFile()`, `procFile()`, `importData()` | 944-950 | Drag & drop y procesamiento de archivos |
| **Export** | `exportCSV()`, `exportJSON()`, `dl()` | 952-955 | Generación y descarga de archivos |
| **Terminal** | `termLog()`, `termKey()`, `cmd()`, `procCmd()`, `updInterval()` | 957-979 | Emulador de comandos del sistema |
| **Notif** | `notif()` | 981-988 | Notificaciones flotantes tipo toast |
| **Clock** | `setInterval()` | 990-991 | Reloj del sistema en la barra nav |
| **Auto-Update** | `setInterval()` | 993-998 | Lectura automática cada 30 segundos |
| **Scroll** | `IntersectionObserver` | 1003-1005 | Animaciones fade-in al scroll |
| **Nav** | `scroll` event | 1007-1012 | Highlight del enlace activo en nav |

### Comandos de Terminal Disponibles

| Comando | Acción |
|---|---|
| `READ` / `READ ALL` | Muestra la última lectura de sensores |
| `STATUS` | Estado general del sistema y filtros |
| `FILTRO ON` | Activa la filtración |
| `FILTRO OFF` | Detiene la filtración |
| `RESET` | Reinicia el sistema |
| `HELP` | Lista comandos disponibles |

---

## 📊 Gráficos del Dashboard

| Gráfico | Tipo | Canvas ID | Datos | Colores |
|---|---|---|---|---|
| pH y TDS 24h | Line | `cMain` | 24 puntos horarios | Verde (#00FF88), Aqua (#00D4FF) |
| Volumen Diario | Bar | `cVol` | 7 días de la semana | Amber (#FFB800) |
| Turbidez | Line | `cTurb` | 24 puntos horarios | Amber (#FFB800) |
| Mejora por Etapa | Bar | `cMejora` | 4 etapas del filtro | Aqua → Verde gradiente |
| Temperatura | Line | `cTemp` | 24 puntos horarios | Rojo (#FC3D21) |

---

## 📱 Diseño Responsive

### Breakpoints

| Breakpoint | Cambios |
|---|---|
| `≤ 960px` | Métricas a 1 columna, gráficos apilados, nav links ocultos, misión 1 col |
| `≤ 580px` | Métricas a 2 columnas, formulario a 1 col, materiales a 2 col |

### Grid Systems Utilizados

| Sección | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero Metrics | 4 columnas | 2 columnas | 2 columnas |
| Metric Cards | 4 columnas | 1 columna | 1 columna |
| Charts Principal | 2fr 1fr | 1 columna | 1 columna |
| Charts Secundarios | 1fr 1fr 1fr | 1 columna | 1 columna |
| Formulario | 3 columnas | 2 columnas | 1 columna |
| Impacto | 3 columnas | 1 columna | 1 columna |
| Materiales | 4 columnas | 2 columnas | 2 columnas |
| Misión | 1.4fr 1fr | 1 columna | 1 columna |
| Exportar | 3 columnas | 1 columna | 1 columna |

---

## 🔄 Ciclo de Vida del Sistema

```mermaid
stateDiagram-v2
    [*] --> Inicialización: Carga de página
    Inicialización --> DatosSimulados: Genera 20 lecturas iniciales
    DatosSimulados --> ChartsActivos: Renderiza gráficos
    ChartsActivos --> TablaRenderizada: Renderiza historial
    TablaRenderizada --> RelojActivo: Inicia reloj
    RelojActivo --> AutoUpdate: setInterval cada 30s

    AutoUpdate --> NuevaLectura: Genera lectura simulada
    NuevaLectura --> ActualizarCards: updCards()
    NuevaLectura --> ActualizarTerminal: termLog()
    ActualizarCards --> AutoUpdate

    state "Interacción Usuario" as IU {
        EntradaManual --> readings
        ImportarArchivo --> readings
        ComandoTerminal --> procCmd
        Exportar --> DescargarArchivo
    }

    AutoUpdate --> IU: Usuario interactúa
    IU --> AutoUpdate: Vuelve al ciclo
```

---

## 🔒 Consideraciones Técnicas

### Sin Backend
El sistema opera **100% client-side**. No hay servidor ni base de datos. Los datos se mantienen en memoria durante la sesión y se pierden al cerrar la página (a menos que se exporten).

### CDN Dependencies
| Dependencia | CDN | Versión |
|---|---|---|
| Chart.js | cdnjs.cloudflare.com | 4.4.1 |
| Font Awesome | cdnjs.cloudflare.com | 6.5.0 |
| Google Fonts | fonts.googleapis.com | Orbitron, Space Grotesk, JetBrains Mono |

### Compatibilidad de Navegador
| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| Dashboard web | ✅ | ✅ | ✅ | ✅ |
| Web Serial API (Arduino) | ✅ | ❌ | ❌ | ✅ |
| Fetch HTTP (ESP32) | ✅ | ✅ | ✅ | ✅ |
| Drag & Drop archivos | ✅ | ✅ | ✅ | ✅ |
| IntersectionObserver | ✅ | ✅ | ✅ | ✅ |

### Rendimiento
- Archivo HTML único de ~59 KB
- Sin framework pesado — vanilla JS
- Animaciones CSS hardware-accelerated (`transform`, `opacity`)
- Datos limitados a 100 lecturas en memoria (buffer circular)

---

## 🚀 Roadmap de Evolución

| Fase | Estado | Descripción |
|---|---|---|
| **v1.0** Dashboard web con datos simulados | ✅ Completado | Dashboard funcional con gráficos, formularios, terminal |
| **v1.1** Integración hardware Arduino/ESP32 | 🔄 En desarrollo | Sensores reales conectados al dashboard |
| **v2.0** Persistencia de datos | 📋 Planificado | LocalStorage o IndexedDB para guardar datos entre sesiones |
| **v2.1** Backend con API | 📋 Planificado | Servidor Node.js/Python para almacenamiento permanente |
| **v3.0** IoT cloud + alertas | 📋 Futuro | Firebase/AWS IoT con notificaciones push |
