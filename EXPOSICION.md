# 🏆 Gran Guión Oficial de Exposición: Proyecto AQUANUBE
**Equipo:** Guardianes de la Ciencia | **Evento:** Olimpiadas STEM Bolivia 2026

Este documento contiene la versión **extendida, técnica y profesional** del guión de exposición. Cada integrante tiene un discurso completo dividido en: **Gancho (Introducción), Desarrollo Técnico (El núcleo del trabajo), Superación de Retos y Pase al siguiente compañero.** 

*Nota: Lean el texto, compréndanlo y adáptenlo a sus propias palabras. No es necesario memorizarlo como robots, pero sí mantener la estructura y los datos técnicos.*

---

## 💻 1️⃣ Página Web y Experiencia de Usuario (Persona 1)

**Tu rol:** Eres el Director de Interfaz (Frontend). Tu misión es demostrar que el proyecto no es solo un experimento escolar, sino un producto tecnológico listo para el mundo real con un diseño profesional.

**🗣️ Guión Extendido:**
> **[Gancho]** "Muy buenos días al honorable jurado calificador y al público presente. Nosotros somos el equipo *Guardianes de la Ciencia*, y es un honor presentarles **AQUANUBE**: nuestro Sistema Ecológico de Filtración y Purificación de Agua.
> 
> **[Desarrollo Técnico]** En un mundo digital, la mejor tecnología no sirve de nada si las personas no pueden entenderla. Por eso, mi rol en AQUANUBE fue desarrollar la interfaz gráfica, es decir, el 'Dashboard' o panel de control que ven proyectado. Para que este sistema fuera profesional, diseñamos una arquitectura web centrada en el usuario (UX/UI) utilizando una estética moderna, limpia y altamente responsiva, lo que significa que un agricultor, un conserje de colegio o un operario puede revisarla desde un celular antiguo o una computadora de escritorio sin perder funcionalidad.
>
> En el panel principal visualizamos en tiempo real los cuatro parámetros vitales de nuestra agua residual: **pH, Temperatura, Sólidos Disueltos (TDS) y Turbidez**. No solo mostramos números; incorporamos un sistema inteligente de alertas visuales. Por ejemplo, si el sensor de turbidez marca menos de 1 NTU, la tarjeta se ilumina en verde indicando 'Agua Cristalina'. Además, integramos gráficos evolutivos que permiten ver el comportamiento del agua en las últimas 24 horas, y un módulo para registrar datos manualmente o exportarlos a PDF y CSV para análisis de laboratorio.
>
> **[Reto y Conclusión]** El mayor reto fue lograr que datos científicos complejos se vieran amigables. Logramos transformar números crudos en semáforos visuales de colores, asegurando que cualquier persona pueda saber instantáneamente si el agua es apta para su reutilización."

**🔄 Pase al compañero:** *"Pero detrás de este diseño visual hay un motor invisible de cálculos matemáticos y lógicos. Para que la página analice y cambie de colores automáticamente, necesitamos programación pura. A continuación, mi compañero/a les explicará el código que da vida a AQUANUBE."*

---

## ⚙️ 2️⃣ Códigos, Lógica de Programación y Datos (Persona 2)

**Tu rol:** Eres el Ingeniero de Software. Debes impresionar al jurado hablando de lenguajes de programación, manipulación de datos (DOM) y cómo el sistema toma decisiones automatizadas sin ayuda humana.

**🗣️ Guión Extendido:**
> **[Gancho]** "Muchas gracias. La interfaz que acaban de ver es hermosa, pero es solo el caparazón. Yo me encargué de programar el 'cerebro lógico' de la plataforma web.
>
> **[Desarrollo Técnico]** Nuestra plataforma no usa plantillas prefabricadas; está construida desde cero utilizando **HTML5** para la estructura, **CSS3** para los estilos y, lo más importante, **JavaScript Vanilla** para la lógica de programación.
>
> Desarrollé algoritmos que realizan lo que llamamos 'Manipulación del DOM' (Document Object Model). Esto significa que el código JavaScript escucha los datos que llegan (por ejemplo, 134 ppm de Sólidos Disueltos) y, mediante sentencias lógicas condicionales (*if/else*), toma decisiones. Si el TDS es menor a 500, el código inyecta dinámicamente un ícono de aprobación y cambia el estado a 'Limpio'. 
>
> Además, programé una sección interactiva llamada 'Terminal del Sistema'. En esta sección, el usuario puede enviar comandos como 'STATUS' o 'FILTRO ON', y el sistema web los procesa, preparándose para enviar la orden al hardware físico. También implementé funciones para la gestión de datos, permitiendo que el historial de filtrado se guarde localmente y se pueda descargar en formato JSON, lo cual es fundamental para el método científico.
>
> **[Reto y Conclusión]** Nuestro principal desafío fue asegurar que la plataforma actualizara los gráficos en tiempo real sin recargar la página. Lo resolvimos estructurando un código limpio y eficiente, logrando un dashboard que reacciona en milisegundos."

**🔄 Pase al compañero:** *"Sin embargo, todo el código del mundo es inútil si no tenemos información real de la naturaleza. ¿Cómo logramos que el software sienta el agua? De esa conexión física y electrónica se encarga nuestra arquitectura de Hardware, que mi compañero/a detallará ahora."*

---

## 🔌 3️⃣ Hardware, Electrónica y Arduino (Persona 3)

**Tu rol:** Eres el Ingeniero de Hardware. Tu objetivo es explicar la ingeniería del prototipo, de dónde viene el agua y cómo los sensores le hablan a la computadora.

**🗣️ Guión Extendido:**
> **[Gancho]** "Así es, el software necesita ojos y manos. Yo tuve la responsabilidad de diseñar el puente entre el mundo digital y la realidad física de AQUANUBE.
>
> **[Desarrollo Técnico]** Todo nuestro proyecto nace de un problema físico: los miles de litros de agua residual, de lluvia o grises que se desperdician todos los días. Nosotros recolectamos esa agua mediante tuberías o mangueras hacia un depósito primario (una pecera de vidrio).
>
> Pero no podemos usar esa agua a ciegas. Para auditarla, instalamos el corazón de nuestro hardware: un microcontrolador **Arduino**. El Arduino actúa como nuestro traductor. A esta placa le conectamos módulos electrónicos de precisión:
> 1. Un **Sensor de pH**, que mide el nivel de acidez del condensado.
> 2. Un **Sensor de TDS/Turbidez**, que usa luz infrarroja para detectar partículas suspendidas en el agua.
>
> El Arduino lee los voltajes analógicos de estos sensores, los convierte a valores digitales (como 7.1 de pH) y los transmite por comunicación serial a una velocidad de 9600 baudios hacia nuestro sistema de monitoreo. No solo leemos datos, también actuamos: configuramos pines de salida conectados a relés electrónicos que nos permiten encender bombas de agua de forma automática cuando el tanque se llena.
>
> **[Reto y Conclusión]** El mayor obstáculo fue la calibración de los sensores. Al tratar aguas residuales de distintas fuentes, las lecturas fluctuaban. Tuvimos que programar filtros matemáticos en el código del Arduino para estabilizar la señal y obtener datos 100% confiables para el jurado."

**🔄 Pase al compañero:** *"Ya recolectamos el agua y la medimos, pero descubrimos que el agua residual trae polvo, sedimentos y microorganismos. Para purificarla, diseñamos un núcleo de filtración física y química, que mi compañero/a procederá a explicar."*

---

## 💧 4️⃣ La Química y Física del Filtrado (Persona 4)

**Tu rol:** Eres el Especialista Ambiental / Químico. Tienes que convencer al jurado de que el método que usan es científicamente correcto, seguro y elimina todas las impurezas.

**🗣️ Guión Extendido:**
> **[Gancho]** "El agua nos llega con datos precisos, pero sucia. Mi misión en AQUANUBE fue desarrollar el método de purificación, aplicando principios físicos y químicos para garantizar que el agua sea reutilizable y segura.
>
> **[Desarrollo Técnico]** Al analizar el agua residual, notamos que arrastra esporas, polvo y bacterias del ambiente. Para solucionar esto, diseñamos un Filtro Multicapa Escalonado, utilizando materiales económicos y sustentables:
> 
> *   **Fase 1: Filtración Mecánica Gruesa (Lienzo / Gasa).** Es la primera barrera. Retiene los macro-residuos como insectos, tierra y partículas grandes que el agua arrastró.
> *   **Fase 2: Adsorción Química (Carbón Activado).** Este es el paso más crucial. El carbón activado tiene una estructura extremadamente porosa a nivel microscópico. A través de un proceso físico-químico llamado 'adsorción', el carbón atrapa metales pesados, toxinas, y neutraliza por completo los olores extraños que trae el agua estancada.
> *   **Fase 3: Filtración Mecánica Fina (Arena).** Funciona como un colador de alta densidad, reteniendo la micro-turbidez que haya escapado de las capas superiores.
> 
> Finalmente, como paso de bioseguridad, el sistema indica un proceso de **hervido final** o pasteurización térmica. Esto destruye cualquier agente patógeno o bacteria que los filtros físicos no hayan podido retener.
>
> **[Reto y Conclusión]** El desafío fue encontrar las proporciones correctas de cada material para que el agua fluyera a un buen ritmo sin perder calidad de filtrado. Hoy podemos garantizar que logramos transformar un agua gris de descarte en un líquido cristalino, inodoro y mecánicamente puro."

**🔄 Pase al compañero:** *"Tenemos un software brillante, sensores precisos y un filtro eficiente. Pero, ¿para qué sirve todo este esfuerzo en el mundo real? Mi compañero/a cerrará nuestra presentación explicando el impacto trascendental de nuestro proyecto."*

---

## 🌍 5️⃣ Impacto, Sostenibilidad y Conclusión (Persona 5)

**Tu rol:** Eres el Visionario / Líder de Proyecto. Debes hacer que el jurado se emocione con el potencial de AQUANUBE. Tu enfoque es la economía circular, la crisis del agua y el futuro.

**🗣️ Guión Extendido:**
> **[Gancho]** "Hemos escuchado sobre códigos, arduinos y carbón activado. Pero todo este despliegue de tecnología STEM se reduce a una sola palabra: **Supervivencia**. 
>
> **[Desarrollo Técnico]** Bolivia y el mundo enfrentan una crisis hídrica sin precedentes. Sequías, racionamiento de agua y cambio climático. Al mismo tiempo, en oficinas, colegios y casas, se desperdician grandes cantidades de agua residual al día. Agua que tiramos directamente a la basura. 
>
> AQUANUBE no es solo un prototipo escolar; es una propuesta de **Economía Circular**. El impacto de nuestro proyecto se divide en tres ejes:
> 1. **Ambiental:** Evitamos que el agua se desperdicie y reducimos la extracción de agua potable de las redes públicas para tareas donde no es necesaria.
> 2. **Económico:** Al filtrar esta agua, colegios, instituciones e industrias pueden usarla gratuitamente para el riego de jardines, limpieza de pisos o descarga de inodoros, reduciendo drásticamente su factura de agua.
> 3. **Social:** Demostramos que la tecnología para salvar el planeta no requiere inversiones millonarias. Usamos arena, lienzo y microcontroladores accesibles para democratizar el cuidado del agua.
>
> **[Conclusión Final]** Creemos firmemente que la ciencia no debe quedarse en los laboratorios, debe resolver problemas reales. Hoy, AQUANUBE convierte el desperdicio en recurso. Nosotros somos los Guardianes de la Ciencia, y con este proyecto, aportamos nuestro grano de arena tecnológica para proteger el futuro de nuestra agua. 
>
> Muchísimas gracias por su atención. Estamos a su entera disposición para cualquier pregunta técnica o demostración del sistema."
