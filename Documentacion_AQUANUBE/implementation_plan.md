# Integración de Hardware: AQUANUBE Sensor Network

¡Excelente! Pasamos a la fase de electrónica y hardware. Analizando tu foto, tienes un kit muy completo y perfecto para este proyecto.

## Análisis de los Componentes (Foto)
1.  **Arduino UNO**: Microcontrolador principal de 5V. Excelente para leer sensores analógicos con precisión.
2.  **NodeMCU ESP8266 (Módulo Wi-Fi)**: *Nota: Aunque mencionaste ESP32, visualmente por el chip y la antena, parece ser un ESP8266 (NodeMCU).* Este es el cerebro que conectará tu proyecto a internet/red local.
3.  **Sensor de Temperatura DS18B20**: Es la sonda negra con punta de metal. Es un sensor digital (protocolo 1-Wire) de alta precisión.
4.  **Sensor de Turbidez (SKU SEN0189)**: Compuesto por la pieza de plástico azul (el lector óptico) y su módulo adaptador negro con pines.
5.  **Protoboard y Cables Jumper**: Para realizar las conexiones sin soldar.
6.  **Resistencias**: Tienes 3 resistencias. Necesitaremos obligatoriamente una de **4.7kΩ** para el sensor de temperatura.

---

## ⚠️ Preguntas Abiertas (User Review Required)

> [!IMPORTANT]
> **Decisión de Arquitectura: ¿Cómo conectamos los cerebros?**
> Tenemos dos opciones principales para armar esto. Por favor, indícame cuál prefieres:
> 
> **OPCIÓN 1: Usar SOLO el ESP8266 (Recomendado por simplicidad)**
> El módulo Wi-Fi (ESP8266) es un microcontrolador completo. Podemos conectar los sensores directamente a él y dejar el Arduino UNO guardado. 
> * *Pros*: Menos cables, código más simple (todo en un solo chip), menor consumo de energía.
> * *Contras*: El ESP8266 trabaja a 3.3V. El sensor de turbidez suele trabajar mejor a 5V, por lo que tal vez requiera una pequeña adaptación (divisor de voltaje) para no quemar el pin analógico del ESP.
> 
> **OPCIÓN 2: Usar Arduino UNO + ESP8266 (Recomendado por robustez)**
> El Arduino UNO lee los sensores a 5V sin problemas. Luego, le envía los datos por cable (Puerto Serial) al ESP8266, y el ESP8266 se encarga de enviarlos por Wi-Fi a tu computadora/página web.
> * *Pros*: Lecturas muy precisas a 5V, no hay riesgo de quemar pines.
> * *Contras*: Requiere escribir dos códigos distintos (uno para el Arduino y otro para el ESP) y cruzar más cables entre ambas placas.

> [!NOTE]
> **Método de envío de datos:**
> ¿Cómo te gustaría que los datos lleguen a la página web que creamos?
> A) **Red Local (Web Socket / Local IP)**: El ESP crea una IP en tu red Wi-Fi y la página web lee los datos en vivo. (No requiere base de datos externa).
> B) **Base de Datos (Firebase)**: El ESP sube los datos a internet (Google Firebase), y la página los descarga de ahí. (Requiere configurar Firebase).

---

## Cambios Propuestos

### 1. Diagrama de Conexiones Físicas (Wiring)
Una vez elijas la Opción 1 o 2, te proporcionaré un diagrama exacto (Pin por Pin) de cómo conectar los cables en la Protoboard.

### 2. Código C++ (Arduino IDE)
Crearemos el script de lectura para los sensores. Utilizaremos las siguientes librerías:
*   `OneWire.h` y `DallasTemperature.h` para el DS18B20.
*   `ESP8266WiFi.h` y `ESP8266WebServer.h` para el módulo Wi-Fi.

### 3. Actualización de AQUANUBE_sitio_web.html
Si elegimos transmitir por red local, añadiremos un botón en la interfaz web de "CONECTAR SENSOR EN VIVO" que lea directamente desde la IP del ESP8266 y llene la tabla automáticamente.

## Plan de Verificación

### Pruebas Manuales
1.  **Test de Temperatura**: Sostener la sonda DS18B20 con la mano para ver si la temperatura sube a ~36°C en el monitor serial.
2.  **Test de Turbidez**: Sumergir la sonda azul en un vaso con agua limpia, y luego echarle unas gotas de leche o tierra para ver cómo cambia el valor analógico.
3.  **Test de Wi-Fi**: Conectar el celular/PC a la red del ESP para verificar la transmisión de datos JSON.
