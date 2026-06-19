// ====================================================================
//                   PROYECTO STEM: AQUANUBE (v1.1)
//                 Olimpiadas STEM Bolivia 2026
//
//       FIRMWARE PRINCIPAL ARDUINO UNO (LECTOR DE SENSORES - 5V)
// ====================================================================
//
// Este programa lee todos los sensores de calidad de agua a 5V:
// 1. Temperatura (DS18B20) -> Pin Digital 2 (con Resistencia 4.7kΩ a 5V)
// 2. Turbidez (SKU SEN0189) -> Pin Analógico A1
// 3. pH (Módulo PH-4502C)  -> Pin Analógico A0 (Si está conectado)
// 4. TDS (Sólidos Disueltos)-> Pin Analógico A2 (Si está conectado)
//
// Envía los datos recolectados al NodeMCU ESP8266 a través de
// SoftwareSerial para que se publiquen en la red local Wi-Fi.
//
// ====================================================================

#include <SoftwareSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// --- PINES DE COMUNICACIÓN SERIE (Para conectar al NodeMCU) ---
// Pin 10 (RX del Arduino) -> Conectar al pin D8 (TX) del NodeMCU
// Pin 11 (TX del Arduino) -> Conectar al pin D7 (RX) del NodeMCU
SoftwareSerial serialNodeMCU(10, 11);

// --- PINES DE LOS SENSORES ---
const int PIN_TEMP = 2;       // DS18B20 en el pin Digital 2
const int PIN_PH = A0;        // Sensor de pH en Analógico 0
const int PIN_TURBIDEZ = A1;  // Sensor de Turbidez SEN0189 en Analógico 1
const int PIN_TDS = A2;       // Sensor de TDS en Analógico 2

// --- INSTANCIAS DE LIBRERÍAS (Sensor Temperatura) ---
OneWire oneWire(PIN_TEMP);
DallasTemperature sensors(&oneWire);

// --- VARIABLES GLOBALES ---
float temperatura = 25.0;
float valor_ph = 7.0;
float valor_turbidez = 0.0;
float valor_tds = 50.0;

void setup() {
  // Iniciar puerto serial USB para depuración con la computadora
  Serial.begin(9600);
  Serial.println(F("========================================="));
  Serial.println(F("   AQUANUBE - Firmware Arduino UNO v1.1   "));
  Serial.println(F("========================================="));

  // Iniciar comunicación serial con el NodeMCU ESP8266
  serialNodeMCU.begin(9600);

  // Iniciar sensor de temperatura DS18B20
  sensors.begin();

  Serial.println(F("-> Sistema listo. Leyendo sensores cada 2 segundos..."));
}

void loop() {
  // ------------------------------------------------------------------
  // 1. LEER SENSOR DE TEMPERATURA (DS18B20)
  // ------------------------------------------------------------------
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  
  // Validar si la lectura es correcta (si no está conectado marca -127)
  if (tempC != DEVICE_DISCONNECTED_C) {
    temperatura = tempC;
  } else {
    // Si falla, dejamos el valor anterior o un valor por defecto seguro
    Serial.println(F("⚠️ Error: Sensor DS18B20 no detectado. Revisa el pin D2 y la resistencia."));
  }

  // ------------------------------------------------------------------
  // 2. LEER SENSOR DE TURBIDEZ (SKU SEN0189)
  // ------------------------------------------------------------------
  int lectura_turb = analogRead(PIN_TURBIDEZ);
  float voltaje_turb = lectura_turb * (5.0 / 1023.0);
  
  // Conversión de voltaje a NTU (Unidades Nefelométricas de Turbidez)
  // Agua limpia tiene alrededor de 4.2V o superior (0 NTU).
  if (voltaje_turb < 2.5) {
    valor_turbidez = 3000.0; // Muy turbia
  } else {
    valor_turbidez = -1120.4 * (voltaje_turb * voltaje_turb) + 5742.3 * voltaje_turb - 4352.9;
    if (valor_turbidez < 0) valor_turbidez = 0.0;
  }

  // ------------------------------------------------------------------
  // 3. LEER SENSOR DE pH (Opcional - PH-4502C)
  // ------------------------------------------------------------------
  int lectura_ph = analogRead(PIN_PH);
  float voltaje_ph = lectura_ph * (5.0 / 1023.0);
  // Fórmula de conversión típica (pH 7 es aprox 2.5V con calibración a 5V)
  valor_ph = 3.5 * voltaje_ph; 
  if (valor_ph > 14.0) valor_ph = 14.0;
  if (valor_ph < 0.0) valor_ph = 0.0;

  // ------------------------------------------------------------------
  // 4. LEER SENSOR DE TDS (Opcional - Sólidos Disueltos Totales)
  // ------------------------------------------------------------------
  int lectura_tds = analogRead(PIN_TDS);
  float voltaje_tds = lectura_tds * (5.0 / 1023.0);
  // Compensación básica de temperatura para precisión en TDS
  float coeficiente_compensacion = 1.0 + 0.02 * (temperatura - 25.0);
  float voltaje_compensado = voltaje_tds / coeficiente_compensacion;
  // Conversión típica a ppm (partes por millón)
  valor_tds = (133.42 * pow(voltaje_compensado, 3) - 255.86 * pow(voltaje_compensado, 2) + 857.39 * voltaje_compensado) * 0.5;
  if (valor_tds < 0) valor_tds = 0;

  // ------------------------------------------------------------------
  // 5. ENVIAR DATOS A NODEMCU ESP8266 (Serie Software)
  // ------------------------------------------------------------------
  // Enviamos los datos en formato CSV separados por comas:
  // pH, TDS, Turbidez, Temperatura
  serialNodeMCU.print(valor_ph, 2);
  serialNodeMCU.print(F(","));
  serialNodeMCU.print((int)valor_tds);
  serialNodeMCU.print(F(","));
  serialNodeMCU.print(valor_turbidez, 2);
  serialNodeMCU.print(F(","));
  serialNodeMCU.println(temperatura, 1); // Envía salto de línea \n al final

  // ------------------------------------------------------------------
  // 6. MOSTRAR EN MONITOR USB PARA LA COMPUTADORA
  // ------------------------------------------------------------------
  Serial.print(F("[ENVIO SERIE] -> pH: ")); Serial.print(valor_ph, 2);
  Serial.print(F(" | TDS: ")); Serial.print((int)valor_tds); Serial.print(F(" ppm"));
  Serial.print(F(" | Turbidez: ")); Serial.print(valor_turbidez, 2); Serial.print(F(" NTU"));
  Serial.print(F(" | Temp: ")); Serial.print(temperatura, 1); Serial.println(F(" °C"));

  // Esperar 2 segundos antes de la siguiente lectura
  delay(2000);
}
