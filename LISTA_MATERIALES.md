# 📋 AQUANUBE — Lista General de Materiales y Herramientas

Esta lista detalla **absolutamente todos** los insumos, herramientas, componentes electrónicos y requerimientos energéticos necesarios para construir el prototipo funcional completo del sistema AQUANUBE, desde el proceso de filtración física hasta la telemetría web.

---

## 💧 1. Componentes del Filtro Físico (Tratamiento de Agua)

Estos son los materiales estructurales para armar la torre de filtración que procesará el agua proveniente del aire acondicionado.

*   **Recipientes contenedores:** Botellas plásticas grandes (2L o 3L) o tubos de acrílico/PVC transparente (para que los jueces puedan ver el proceso).
*   **Mangueras o tubos de silicona:** Para guiar el agua desde el aire acondicionado hacia el filtro, y del filtro hacia los sensores.
*   **Filtro físico primario:** Tela de lienzo, gasa o algodón.
*   **Carbón activado:** Granular, para eliminar olores y químicos.
*   **Arena fina y arena gruesa:** Previamente lavadas.
*   **Grava o piedras pequeñas:** Para la base del filtro y retención de partículas mayores.
*   **Soporte estructural:** Madera, acrílico o perfiles de aluminio para mantener los recipientes de agua en su lugar de forma vertical y estable.

---

## 🧠 2. Microcontrolador (Cerebro del Sistema)

Se debe elegir **una** de las siguientes opciones según la modalidad de exhibición:

*   **Opción A (Feria presencial local):** Placa **Arduino UNO R3**. Ideal para conectar directamente a la laptop por USB y mostrar los datos en tiempo real mediante *Web Serial*.
*   **Opción B (Exhibición avanzada / IoT):** Placa **ESP32 DevKit V1**. Ideal si se quiere mostrar una arquitectura inalámbrica donde el dispositivo envía datos vía WiFi sin depender de cables conectados a la PC.

---

## 🔬 3. Sensores de Calidad de Agua

*   **Sensor de pH:** Módulo controlador PH-4502C + Sonda BNC sumergible tipo E-201-C.
*   **Sensor de TDS (Sólidos Disueltos):** Módulo tipo TDS Meter V1.0 (DFRobot o genérico) con su respectiva sonda de clavija.
*   **Sensor de Turbidez:** Módulo óptico (SKU SEN0189) que incluye el sensor de herradura y el adaptador analógico.
*   **Sensor de Temperatura:** DS18B20 (Debe ser la versión sumergible encapsulada en acero inoxidable, resistente al agua).

---

## 🔌 4. Electrónica de Conexión y Apoyo

*   **Protoboard (Placa de pruebas):** Tamaño de 400 u 800 puntos. Para montar el circuito sin necesidad de usar cautín.
*   **Cables Jumper (Dupont):**
    *   Mínimo 20 cables Macho-Macho.
    *   Mínimo 20 cables Macho-Hembra.
*   **Resistencia de 4.7kΩ (Kilo-ohmios):** Obligatoria como resistencia "Pull-up" para que el sensor de temperatura DS18B20 funcione y no devuelva errores.
*   **Cable de Datos:**
    *   Si es Arduino UNO: Cable USB Tipo A a Tipo B (Cable típico de impresora).
    *   Si es ESP32: Cable Micro-USB o USB-C (debe tener líneas de datos, no solo de carga).

---

## ⚡ 5. Alimentación y Energía (Suministro Eléctrico)

Para que el sistema funcione durante las exposiciones, se requiere energía constante. 

**Si se usa el equipo conectado a la computadora:**
*   La misma PC/Laptop alimenta la placa Arduino a través del **Cable USB (5V, 500mA max)**. Esto es suficiente para mantener los 4 sensores encendidos sin problema.

**Si se requiere que el prototipo funcione de manera autónoma (Lejos de la PC):**
*   **Power Bank (Batería portátil de celular):** Excelente opción. Se conecta mediante USB al Arduino. Una batería de 10,000 mAh puede mantener el circuito encendido durante días.
*   **Adaptador/Eliminador de Corriente (Fuente de pared):** Transformador de 9V o 12V DC (conector Jack 2.1mm de centro positivo) para enchufar directo al conector de barril del Arduino UNO, y conectarlo a la toma de corriente de la pared.
*   **Regleta eléctrica (Zapatilla / Alargador):** Fundamental para las ferias de ciencias, para conectar la laptop y cualquier otra fuente de alimentación.

---

## 🛠️ 6. Herramientas de Montaje

*   **Destornillador de precisión (plano y estrella pequeño):** Indispensable. Los módulos de los sensores (como el de pH y Turbidez) tienen pequeños potenciómetros azules que deben girarse físicamente para calibrarlos.
*   **Multímetro (Tester):** Para medir voltajes de los sensores o comprobar que no haya cables Dupont rotos internamente.
*   **Alicate de corte / Pelacables pequeños:** Por si algún cable necesita adaptación.
*   **Pistola de silicona caliente y barras de silicona:** Para impermeabilizar uniones y pegar los módulos al soporte de la maqueta de forma segura.
*   **Cinta aislante (huincha) y/o tubos termorretráctiles:** Para proteger conexiones eléctricas de la humedad.
*   **Cúter (Estilete) y tijeras.**

---

## 🧪 7. Insumos Químicos y de Calibración

Los sensores son instrumentos delicados y **deben ser calibrados** antes de programar el sistema:

*   **Sobres de solución Buffer de pH:** Necesitas soluciones de **pH 4.01** y **pH 6.86** (o 7.00). Son polvitos que se mezclan con agua destilada para crear líquidos de pH exacto y calibrar el sensor girando el destornillador.
*   **Agua Destilada (o desmineralizada):** Necesaria para limpiar las sondas entre mediciones (para no contaminar el agua con líquidos anteriores) y para calibrar la turbidez a 0.
*   **Solución salina o Medidor TDS comercial:** Para comparar y calibrar el sensor de Sólidos Disueltos.
*   **Termómetro clínico, de laboratorio o de cocina:** Para tener un valor de referencia de temperatura real y ajustar el código.
*   **Vasos de precipitado o vasos plásticos transparentes limpios:** Mínimo 4. Para preparar los buffers y probar el agua antes y después del filtro.

---

## 💻 8. Software y Hardware Informático

*   **Laptop/Computadora:** Para cargar el código, mostrar la página web y exponer.
*   **Arduino IDE:** Software oficial (gratuito) instalado en la PC.
*   **Librerías de Arduino a instalar:**
    *   `OneWire.h` (Para el sensor de temperatura)
    *   `DallasTemperature.h` (Para procesar los datos de temperatura)
*   **Navegador Web:** Google Chrome o Microsoft Edge actualizados (necesarios por compatibilidad con *Web Serial API* para que la página hable con el Arduino).

---

> [!TIP]
> **Consejo para la Olimpiada STEM:** Lleva siempre repuestos de los **cables Dupont** y ten a la mano el **destornillador de precisión**. Las conexiones sueltas son la causa #1 de fallas durante las exposiciones en vivo.
