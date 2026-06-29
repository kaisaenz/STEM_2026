// ============================================================
//  hardware.js — integración con hardware real
//  Web Serial API (Arduino por USB) + lectura WiFi del ESP32/NodeMCU.
//  Si se conecta hardware real, se detiene el modo demostración.
// ============================================================

let port, reader;

async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    if (typeof stopDemo === 'function') stopDemo();      // exclusión mutua con la demo
    if (typeof setMode === 'function') setMode('hardware');
    document.getElementById('serial-status').textContent = 'Conectado — 9600 baud';
    termLog('✅ Arduino conectado exitosamente.', 'ok');
    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) { reader.releaseLock(); break; }
      buffer += value;
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (let line of lines) {
        line = line.trim();
        if (line) processSerialData(line);
      }
    }
  } catch (err) {
    termLog('❌ Error Serial: ' + err.message, 'er');
  }
}

function processSerialData(data) {
  termLog('>> ' + data, 'pr');
  try {
    const parts = data.split(',');
    if (parts.length >= 4) {
      const r = {
        ts: new Date().toISOString(),
        ph: parseFloat(parts[0]), tds: parseInt(parts[1]), turb: parseFloat(parts[2]), temp: parseFloat(parts[3]),
        vol: 150, stage: 'arena', claridad: 'cristalina', olor: 'ninguno', sensor: 'arduino', obs: '', status: ''
      };
      r.status = computeStatus(r);
      readings.push(r);
      saveReadings();
      updCards(r.ph, r.temp, r.tds, r.turb, r.vol);
      renderTable();
      updateChartsWithNewData(r);
      checkAlerts(r);

      // Autocompletar el panel de llenado de datos
      if (document.getElementById('f-ph')) document.getElementById('f-ph').value = r.ph;
      if (document.getElementById('f-tds')) document.getElementById('f-tds').value = r.tds;
      if (document.getElementById('f-turb')) document.getElementById('f-turb').value = r.turb;
      if (document.getElementById('f-temp')) document.getElementById('f-temp').value = r.temp;
      notif('Sensores leídos', `Datos actualizados en el formulario (${r.temp}°C, ${r.tds}ppm)`);
    }
  } catch (e) { }
}

// Lectura por WiFi: pide JSON a http://<ip>/data del NodeMCU/ESP32.
async function leerDesdeHardware() {
  const ipInput = document.getElementById('hw-ip');
  let ip = ipInput.value.trim();

  if (!ip) {
    notif('Error', 'Por favor ingresa la dirección IP del NodeMCU.');
    return;
  }

  if (!ip.startsWith('http')) {
    ip = 'http://' + ip;
  }

  const url = ip + '/data';
  notif('Conectando...', 'Intentando leer sensores en ' + ip);

  try {
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!response.ok) throw new Error('Error de red o IP incorrecta');

    const data = await response.json();

    if (data.temperatura !== undefined) {
      document.getElementById('f-temp').value = data.temperatura.toFixed(1);
    }
    if (data.turbidez_ntu !== undefined) {
      document.getElementById('f-turb').value = data.turbidez_ntu;
    }

    // Valores por defecto para sensores aún no cableados (pH/TDS)
    document.getElementById('f-ph').value = '7.00';
    document.getElementById('f-tds').value = '50';
    document.getElementById('f-vol').value = '500';

    notif('Éxito', '¡Datos leídos del sensor correctamente!');
  } catch (error) {
    notif('Fallo de conexión', 'No se pudo conectar al NodeMCU. Verifica la IP y que estés en la misma red Wi-Fi.');
    console.error(error);
  }
}
