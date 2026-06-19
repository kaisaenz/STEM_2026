// ====================================================================
//                   PROYECTO STEM: AQUANUBE (v1.1)
//                 Olimpiadas STEM Bolivia 2026
//
//      FIRMWARE PRINCIPAL NODEMCU ESP8266 (SERVIDOR WEB - WI-FI)
// ====================================================================
//
// Este programa se ejecuta en el NodeMCU ESP8266. Su función es:
// 1. Conectarse a la red Wi-Fi de tu casa o celular.
// 2. Escuchar la información que envía el Arduino UNO por SoftwareSerial
//    en los pines D7 (RX) y D8 (TX).
// 3. Levantar un servidor web local en el puerto 80 que entrega los
//    datos de calidad de agua en formato JSON (en la ruta /data).
//
// ====================================================================

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>

// ==========================================
// 1. CONFIGURACIÓN DE RED WI-FI
// ==========================================
// Reemplaza con el nombre y contraseña de tu red Wi-Fi
const char* ssid = "AP_WORKSHOP_2";       
const char* password = "Post*2023"; 

// ==========================================
// 2. CONFIGURACIÓN DE PUERTOS SERIALES
// ==========================================
// Pin D7 (RX de NodeMCU) -> Conectar al pin 11 (TX) del Arduino UNO (Cable Naranja)
// Pin D8 (TX de NodeMCU) -> Conectar al pin 10 (RX) del Arduino UNO (Cable Amarillo)
SoftwareSerial serialArduino(D7, D8);

// Crear el servidor web en el puerto 80
ESP8266WebServer server(80);

// ==========================================
// VARIABLES GLOBALES DE TELEMETRÍA
// ==========================================
float valor_ph = 7.00;
int valor_tds = 50;
float valor_turbidez = 0.00;
float temperatura = 25.0;

unsigned long ultimaRecepcion = 0; // Para control de tiempo

void setup() {
  // Puerto serial USB (Para depuración con la computadora a 115200)
  Serial.begin(115200);
  delay(100);

  Serial.println(F("\n========================================="));
  Serial.println(F("    AQUANUBE - Servidor NodeMCU v1.1     "));
  Serial.println(F("========================================="));

  // Iniciar la comunicación serie de SoftwareSerial con el Arduino UNO (a 9600)
  serialArduino.begin(9600);
  Serial.println(F("-> Escuchando puerto serie del Arduino (9600 baud)..."));

  // Conectar a la red Wi-Fi
  Serial.println();
  Serial.print(F("Conectando a la red: "));
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  // Parpadear y mostrar progreso mientras se conecta
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }
  
  Serial.println(F(""));
  Serial.println(F("✅ ¡Wi-Fi Conectado con éxito!"));
  Serial.print(F("🌐 Dirección IP local: "));
  Serial.println(WiFi.localIP());
  Serial.println(F("-----------------------------------------"));
  Serial.println(F("Copia esa dirección IP y pégala en tu"));
  Serial.println(F("Dashboard Web AQUANUBE para ver los datos en vivo."));
  Serial.println(F("-----------------------------------------"));

  // Configurar las rutas del servidor web
  server.on("/", handleRoot);
  server.on("/data", handleData);
  
  // Iniciar el servidor
  server.begin();
  Serial.println(F("🚀 Servidor web HTTP en línea y escuchando."));
}

void loop() {
  // Manejar los clientes de la página web
  server.handleClient();

  // Escuchar si el Arduino UNO nos envía nuevos datos
  escucharArduino();
}

// ==========================================
// FUNCIÓN PARA LEER Y PROCESAR DATOS DE ARDUINO
// ==========================================
void escucharArduino() {
  if (serialArduino.available() > 0) {
    // Leer la línea completa enviada por el Arduino (termina en \n)
    String linea = serialArduino.readStringUntil('\n');
    linea.trim(); // Quitar espacios en blanco al inicio o final
    
    if (linea.length() > 0) {
      Serial.print(F("[RECIBIDO ARDUINO] -> "));
      Serial.println(linea);

      // El Arduino envía: "pH,TDS,Turbidez,Temperatura"
      // Ejemplo: "7.25,120,0.45,24.8"
      
      int index1 = linea.indexOf(',');
      if (index1 > 0) {
        String phStr = linea.substring(0, index1);
        
        int index2 = linea.indexOf(',', index1 + 1);
        if (index2 > index1) {
          String tdsStr = linea.substring(index1 + 1, index2);
          
          int index3 = linea.indexOf(',', index2 + 1);
          if (index3 > index2) {
            String turbStr = linea.substring(index2 + 1, index3);
            String tempStr = linea.substring(index3 + 1);
            
            // Convertir las cadenas de texto a variables reales
            valor_ph = phStr.toFloat();
            valor_tds = tdsStr.toInt();
            valor_turbidez = turbStr.toFloat();
            temperatura = tempStr.toFloat();

            ultimaRecepcion = millis(); // Registrar la última vez que llegaron datos
          }
        }
      }
    }
  }
}

// ==========================================
// CONTROLADORES DEL SERVIDOR WEB (RUTAS HTTP)
// ==========================================

// Página principal (Texto explicativo)
void handleRoot() {
  String html = "<h1>AQUANUBE IoT Gateway</h1>";
  html += "<p>Tu servidor esta funcionando correctamente en la red local.</p>";
  html += "<p>Usa la ruta <strong>/data</strong> para ver la API JSON de telemetria.</p>";
  html += "<br><p><strong>Ultimos valores recibidos del Arduino:</strong></p>";
  html += "<ul>";
  html += "<li>pH: " + String(valor_ph, 2) + "</li>";
  html += "<li>TDS: " + String(valor_tds) + " ppm</li>";
  html += "<li>Turbidez: " + String(valor_turbidez, 2) + " NTU</li>";
  html += "<li>Temperatura: " + String(temperatura, 1) + " C</li>";
  html += "</ul>";
  
  server.send(200, "text/html; charset=utf-8", html);
}

// API de Datos en formato JSON (Lo que lee el Dashboard Web)
void handleData() {
  // Crear el paquete JSON dinámico
  String json = "{";
  json += "\"temperatura\":" + String(temperatura, 1) + ",";
  json += "\"turbidez_ntu\":" + String(valor_turbidez, 2) + ",";
  json += "\"ph\":" + String(valor_ph, 2) + ",";
  json += "\"tds\":" + String(valor_tds);
  json += "}";

  // IMPORTANTE: Cabeceras para evitar bloqueos del navegador (CORS)
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET");
  server.sendHeader("Access-Control-Allow-Headers", "*");
  
  server.send(200, "application/json", json);
}
