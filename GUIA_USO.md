# 📖 AQUANUBE — Guía de Uso del Dashboard

## Manual Completo del Dashboard Web de Monitoreo

> [!NOTE]
> Esta guía explica paso a paso cómo usar todas las funcionalidades del dashboard web de AQUANUBE: registrar datos, importar archivos, exportar reportes, usar la terminal y navegar por las secciones del sistema.

---

## 📋 Tabla de Contenidos

- [Requisitos](#-requisitos)
- [Abrir el Dashboard](#-abrir-el-dashboard)
- [Navegación General](#-navegación-general)
- [Sección: Dashboard](#-sección-dashboard)
- [Sección: Datos](#-sección-datos)
  - [Entrada Manual](#1-entrada-manual)
  - [Importar CSV/JSON](#2-importar-csvjson)
  - [Historial](#3-historial)
  - [Exportar](#4-exportar)
- [Sección: Sistema y Terminal](#-sección-sistema-y-terminal)
- [Sección: Materiales](#-sección-materiales)
- [Sección: Impacto](#-sección-impacto)
- [Sección: Misión](#-sección-misión)
- [Preguntas Frecuentes](#-preguntas-frecuentes)

---

## 💻 Requisitos

| Requisito | Detalle |
|---|---|
| **Navegador** | Chrome, Firefox, Safari o Edge (versión reciente) |
| **Conexión a internet** | Solo para cargar fuentes e iconos la primera vez |
| **Servidor** | ❌ No necesario — se abre directamente desde el archivo |
| **Dispositivo** | PC, laptop, tablet o celular (responsive) |

---

## 🚀 Abrir el Dashboard

1. Localiza el archivo `AQUANUBE_sitio_web.html` en la carpeta del proyecto
2. **Doble clic** sobre el archivo — se abrirá en tu navegador predeterminado
3. El dashboard se cargará con **datos simulados** de demostración
4. ¡Listo! Ya puedes explorar todas las secciones

> [!TIP]
> Para la mejor experiencia, usa **Google Chrome** en pantalla completa (F11). Si planeas conectar hardware real, Chrome es obligatorio para la Web Serial API.

---

## 🧭 Navegación General

La barra de navegación fija en la parte superior permite acceder rápidamente a todas las secciones:

| Enlace | Sección | Qué contiene |
|---|---|---|
| **Inicio** | Hero principal | Presentación del proyecto y métricas generales |
| **Dashboard** | Panel de control | Gráficos en tiempo real, tarjetas de métricas |
| **Datos** | Gestión de datos | Formulario manual, importar, historial, exportar |
| **Sistema** | Terminal y flujo | Terminal de comandos, diagrama de filtración, controles |
| **Impacto** | Impacto del proyecto | Social, económico, ambiental + resultados |
| **Misión** | Sobre el proyecto | Problema, solución, metodología |
| **Contacto** | Equipo | Información del equipo Guardianes de la Ciencia |

### Indicadores del sistema

- **Punto verde pulsante** (esquina derecha del nav): indica que el sistema está en línea
- **Reloj del sistema**: muestra la hora actual en tiempo real

---

## 📊 Sección: Dashboard

El panel de control muestra los datos de monitoreo en tiempo real mediante **5 gráficos interactivos** y **4 tarjetas de métricas**.

### Tarjetas de Métricas

| Tarjeta | Color | Parámetro | Rango Óptimo |
|---|---|---|---|
| 🟢 pH del Agua | Verde | Nivel de acidez/alcalinidad | 6.5 – 8.5 |
| 🔴 Temperatura | Rojo | Grados Celsius del agua | 20 – 30 °C |
| 🔵 TDS (Sólidos) | Aqua | Sólidos disueltos totales | < 500 ppm |
| 🟡 Turbidez | Ámbar | Claridad del agua | < 1 NTU |

Cada tarjeta muestra:
- **Valor actual** en grande
- **Rango óptimo** como referencia
- **Indicador de estado** (✓ cuando está en rango)

### Gráficos

| Gráfico | Tipo | Datos |
|---|---|---|
| **pH y TDS 24h** | Líneas | Últimas 24 lecturas horarias de pH y TDS |
| **Volumen Diario** | Barras | Litros recuperados por día de la semana |
| **Turbidez** | Línea | Evolución de turbidez en las últimas 24 horas |
| **Mejora por Etapa** | Barras | Porcentaje de mejora en cada etapa del filtro |
| **Temperatura** | Línea | Evolución de temperatura en 24 horas |

> [!NOTE]
> Los gráficos se actualizan automáticamente cada **30 segundos** con nuevas lecturas (simuladas o reales si hay hardware conectado).

---

## 📝 Sección: Datos

Esta sección tiene **4 pestañas** para gestionar las mediciones del sistema:

### 1. Entrada Manual

Permite registrar manualmente una medición del agua filtrada.

**Campos del formulario:**

| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| pH del agua filtrada | Número (0–14, paso 0.01) | ✅ Sí | 7.1 |
| Temperatura (°C) | Número (paso 0.1) | ✅ Sí | 24.0 |
| TDS (ppm) | Número entero | ✅ Sí | 135 |
| Turbidez (NTU) | Número (paso 0.01) | No | 0.4 |
| Volumen recolectado (mL) | Número entero | No | 420 |
| Etapa del filtro activa | Selector | No | Carbón Activado |
| Claridad visual | Selector | No | Cristalina |
| Olor | Selector | No | Sin olor |
| Fuente del dato | Selector | No | Medición manual |
| Fecha y hora | Fecha/hora | No | (auto si vacío) |
| Observaciones | Texto libre | No | "Agua más clara" |

**Pasos:**
1. Completar al menos pH, Temperatura y TDS
2. Seleccionar la etapa del filtro activa
3. Clic en **"REGISTRAR MEDICIÓN"**
4. Aparecerá una notificación confirmando el registro
5. Los gráficos y la tabla se actualizan automáticamente

### 2. Importar CSV/JSON

Permite cargar datos desde archivos externos.

**Formatos compatibles:**
- **CSV** — archivos separados por comas (compatible con Excel)
- **JSON** — arrays de objetos con campos del sistema
- **TXT** — salida del Serial Monitor de Arduino

**Cómo importar:**
1. Clic en la pestaña **"Importar CSV/JSON"**
2. **Arrastrar y soltar** el archivo sobre la zona de upload, o clic en **"BUSCAR ARCHIVO"**
3. Se mostrará una **previsualización** de los datos
4. Clic en **"IMPORTAR"** para agregar los datos al sistema

**Formato CSV esperado:**

```csv
ph,temp,tds,turb,vol,stage
7.1,24.2,134,0.4,420,carbon
7.0,23.8,140,0.5,380,arena
```

**Formato JSON esperado:**

```json
[
  {"ph": 7.1, "temp": 24.2, "tds": 134, "turb": 0.4, "vol": 420, "stage": "carbon"},
  {"ph": 7.0, "temp": 23.8, "tds": 140, "turb": 0.5, "vol": 380, "stage": "arena"}
]
```

### 3. Historial

Muestra una **tabla completa** con todas las mediciones registradas (manuales, importadas y automáticas).

**Columnas de la tabla:**

| Columna | Descripción |
|---|---|
| # | Número de registro |
| Fecha/Hora | Timestamp de la lectura |
| pH | Valor de pH medido |
| Temp°C | Temperatura en grados Celsius |
| TDS | Sólidos disueltos totales (ppm) |
| Turb NTU | Turbidez en NTU |
| Vol mL | Volumen recolectado |
| Etapa | Etapa del filtro activa |
| Claridad | Evaluación visual del agua |
| Estado | Pill de estado: 🟢 Óptimo / 🟡 Advertencia / 🔴 Alerta |

### 4. Exportar

Permite descargar todos los datos registrados en diferentes formatos:

| Formato | Uso recomendado | Cómo |
|---|---|---|
| **CSV** | Abrir en Excel, análisis con Python/R | Clic en tarjeta "EXPORTAR CSV" |
| **JSON** | APIs, Firebase, integración web | Clic en tarjeta "EXPORTAR JSON" |
| **PDF** | Reportes para presentaciones STEM | Clic en tarjeta "INFORME PDF" (usa imprimir del navegador) |

---

## 🖥️ Sección: Sistema y Terminal

### Terminal de Comandos

Emulador visual de terminal que simula la comunicación con el Arduino. Muestra logs del sistema en tiempo real.

**Comandos disponibles:**

| Comando | Acción | Ejemplo de respuesta |
|---|---|---|
| `READ` | Muestra la última lectura de sensores | `pH 7.1 │ TDS 134ppm │ Turb 0.4 NTU` |
| `READ ALL` | Lectura completa con todos los detalles | Todos los parámetros + estado |
| `STATUS` | Estado general del sistema y filtros | Filtros activos, estado de sensores |
| `FILTRO ON` | Activa la filtración | `Filtración ACTIVADA` |
| `FILTRO OFF` | Detiene la filtración | `Filtración DETENIDA` |
| `RESET` | Reinicia el sistema | Reinicio completo |
| `HELP` | Lista todos los comandos disponibles | Muestra esta tabla |

**Cómo usar la terminal:**
1. Clic en el campo de texto en la parte inferior de la terminal (donde dice `$`)
2. Escribir un comando (ej: `STATUS`)
3. Presionar **Enter**
4. La respuesta aparece en la terminal

### Diagrama de Flujo

Visualización interactiva del flujo de filtración AQUANUBE:

```
❄️ Aire Acond. → 🪣 Pecera → 🧵 Lienzo → ⚫ Carbón → 🏖️ Arena → 🔥 Hervida → 💧 Agua Limpia → 🌿 Reutilización
```

### Controles del Sistema

| Botón | Función |
|---|---|
| **LEER** | Ejecuta `READ ALL` — lectura completa |
| **STATUS** | Estado del sistema |
| **FILTRO ON** | Activa filtración |
| **FILTRO OFF** | Desactiva filtración |
| **REINICIAR SISTEMA** | Reset completo |
| **Slider de intervalo** | Ajusta cada cuántos segundos se toma una lectura (5–120 seg) |

---

## 🧱 Sección: Materiales

Muestra las tarjetas interactivas de los 8 componentes principales del sistema AQUANUBE:

1. 💧 **Fuente de Agua** — Cualquier tipo de agua residual, lluvia o grises
2. 🧵 **Lienzo / Gasa** — 1ª etapa de filtración
3. ⚫ **Carbón Activado** — 2ª etapa de filtración
4. 🏖️ **Arena Fina** — 3ª etapa de filtración
5. 🪣 **Pecera / Vidrio** — Recipiente de recolección
6. 🔥 **Hervido Final** — Eliminación de microorganismos
7. 🔬 **Sensor pH/TDS** — Monitoreo de calidad
8. ⚡ **Arduino** — Microcontrolador central

---

## 🌍 Sección: Impacto

### Tarjetas de Impacto

| Tipo | Color | Descripción |
|---|---|---|
| 🤝 **Social** | Púrpura | Conciencia ambiental, cultura científica |
| 💰 **Económico** | Ámbar | Bajo costo, reducción de desperdicio |
| 🌿 **Ambiental** | Verde | Materiales reutilizables, sostenibilidad |

### Resultados Observados

| Criterio | Resultado |
|---|---|
| 🔵 **Claridad visual** | Cristalina — agua transparente tras filtración |
| 👃 **Control de olor** | Sin olor — carbón activado elimina residuos |
| 🧼 **Limpieza general** | Apta para riego, limpieza e industrial |

---

## 🎯 Sección: Misión

Contiene la descripción completa del proyecto:
- **Problema**: Desperdicio de agua que podría ser reutilizada y purificada
- **Solución**: Sistema de 4 etapas de filtración con materiales accesibles
- **Metodología**: Recolección, filtración, hervido y monitoreo digital
- **Próximos pasos**: Mejoras del sistema y pruebas avanzadas

---

## 🔔 Sistema de Notificaciones

Las notificaciones tipo toast aparecen en la esquina inferior derecha cuando:
- Se registra una medición manual
- Se importan datos desde un archivo
- Se conecta/desconecta hardware
- Se exportan datos

Las notificaciones desaparecen automáticamente después de 3 segundos.

---

## 📱 Uso en Dispositivos Móviles

El dashboard es completamente **responsive** y se adapta a diferentes tamaños de pantalla:

| Dispositivo | Adaptaciones |
|---|---|
| **Desktop** (>960px) | Vista completa con todas las columnas |
| **Tablet** (580–960px) | Gráficos apilados, métricas en 1 columna, nav simplificada |
| **Móvil** (<580px) | Métricas en 2 columnas, formulario en 1 columna |

> [!TIP]
> En móvil, los enlaces de navegación se ocultan. Puedes hacer scroll manualmente o usar los botones del hero para navegar.

---

## ❓ Preguntas Frecuentes

### ¿Necesito internet para usar el dashboard?
Solo se necesita internet la primera vez para cargar las fuentes (Google Fonts), los iconos (Font Awesome) y Chart.js desde CDN. Después, el navegador los guarda en caché.

### ¿Los datos se guardan al cerrar la página?
**No**. Los datos se mantienen en memoria durante la sesión. Al cerrar o recargar la página, se pierden. **Exporta tus datos** antes de cerrar si quieres conservarlos.

### ¿Puedo usar el dashboard sin Arduino?
**Sí**. El dashboard funciona de forma independiente con datos simulados o ingresados manualmente. El hardware es opcional.

### ¿Qué navegador es el mejor?
**Google Chrome** es el recomendado, especialmente si planeas conectar un Arduino por USB (Web Serial API). Para uso sin hardware, cualquier navegador moderno funciona.

### ¿Cómo conecto un Arduino real?
Consulta el documento [HARDWARE_INTEGRACION.md](HARDWARE_INTEGRACION.md) para la guía completa de componentes, conexiones y código.

### ¿Puedo modificar el intervalo de lectura automática?
Sí, en la sección **Sistema**, usa el **slider de intervalo** para ajustar entre 5 y 120 segundos.

### ¿El informe PDF se genera automáticamente?
El botón "INFORME PDF" abre el diálogo de impresión del navegador. Selecciona **"Guardar como PDF"** como destino para generar el archivo.

---

## 🔑 Atajos Rápidos

| Acción | Cómo |
|---|---|
| Registrar medición rápida | Ir a Datos → Entrada Manual → Llenar pH, Temp, TDS → Registrar |
| Ver última lectura | Ir a Sistema → Terminal → Escribir `READ` → Enter |
| Exportar todo a CSV | Ir a Datos → Exportar → Clic "EXPORTAR CSV" |
| Ver estado del sistema | Ir a Sistema → Terminal → Escribir `STATUS` → Enter |
| Imprimir reporte | Ir a Datos → Exportar → Clic "INFORME PDF" |

---

© 2026 AQUANUBE · Guardianes de la Ciencia · Olimpiadas STEM Bolivia 2026
