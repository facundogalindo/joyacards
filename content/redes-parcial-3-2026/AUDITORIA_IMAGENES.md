# Auditoría visual de imágenes — Redes, parcial 3 de 2026

La fotografía original es la fuente de verdad. Las reconstrucciones solo se ofrecen cuando cada texto y elemento relevante se pudo verificar. Las claves, preguntas, justificaciones e imágenes incrustadas del Word se compararon con la línea base previa a estos cambios.

## Integridad del cuestionario

- Word importado: `Redes_Parcial_3_2026_JoyaCards_Auditado.docx`.
- 30 preguntas; 30 puntuables; 0 sin puntaje.
- 9 apariciones de imágenes en 5 imágenes únicas.
- 32 justificaciones y 0 advertencias de importación.
- SHA-256 semántico antes y después: `9e9efc0a2741bdc58fcb04bb34a80f3aa9128706d1ccf72c5e9ac071968eeb3e`.
- Se mantuvieron intactas las preguntas, opciones, claves, justificaciones y bytes de las imágenes incrustadas. La vista ampliada no cambia las respuestas ni el puntaje.

## Resultado por ejercicio

| Ejercicio | Original y recorte | Mejora | Reconstrucción | Estado y revisión |
| --- | --- | --- | --- | --- |
| Firewall / Telnet | [Foto #11](assets/originales-completas/foto-11-firewall-completa-original.jpg), [recorte #22](assets/foto-11-firewall-telnet-origen-22.jfif) | [Versión mejorada](assets/mejoradas/foto-11-firewall-telnet-origen-22-mejorada.jpg) | [SVG aprobado](assets/reconstrucciones/reconstruccion-firewall-telnet.svg) | **APROBADA.** Se verificaron consigna, opciones, orden de las cinco reglas, protocolos, fuentes, destinos, checks y política. La consigna muestra `.155`, mientras que las reglas muestran `.33`; se preservó esa diferencia. Los íconos pequeños se redibujaron como detalle cosmético. [Comparación original/reconstrucción](assets/comparaciones/firewall-original-vs-reconstruccion.jpg); [original/mejora](assets/comparaciones/firewall-original-vs-mejorada.jpg). |
| TFTP | [Foto #2](assets/originales-completas/foto-02-tftp-completa-original.jpg), [recorte #31](assets/foto-02-tftp-recorte-31.jfif) | [Versión mejorada](assets/mejoradas/foto-02-tftp-recorte-31-mejorada.jpg) | [SVG aprobado](assets/reconstrucciones/reconstruccion-tftp.svg) | **APROBADA.** Se cotejaron consigna y cinco opciones. La foto tiene seleccionada visualmente la opción D; esa selección se conservó como estado de pantalla y no se interpretó como clave. La clave existente B no cambió. [Comparación original/reconstrucción](assets/comparaciones/tftp-original-vs-reconstruccion.jpg); [original/mejora](assets/comparaciones/tftp-original-vs-mejorada.jpg). |
| `nslookup` / Instagram | [Foto #3](assets/originales-completas/foto-14-nslookup-completa-original.jpg), [recorte #30](assets/foto-14-nslookup-instagram-original-abierta-30.jfif) | Sin mejora | [SVG aprobado](assets/reconstrucciones/reconstruccion-nslookup-instagram.svg) | **APROBADA.** Se cotejó `instagram.com`, la instrucción de no agregar texto ni espacios y el campo de respuesta vacío. La reconstrucción conserva el campo vacío; no se agregó una respuesta. [Comparación original/reconstrucción](assets/comparaciones/nslookup-original-vs-reconstruccion.jpg). |
| `show ip route` | [Foto #12](assets/originales-completas/foto-12-show-ip-route-completa-original.jpg), [recorte #21](assets/foto-12-show-ip-route-recorte-21.jfif) | No aplicada: no aporta lectura fiable | No creada | **NO RECONSTRUIBLE.** La imagen se comparte entre cuatro preguntas. Varios rótulos de IP/interfaz, filas de tabla y conexiones no se pueden confirmar. Se preservan la foto y el recorte con zoom; no se inventaron rutas ni etiquetas. |
| `netstat` | [Foto #8](assets/originales-completas/foto-08-netstat-completa-original.jpg), [recorte #25](assets/pendiente-foto-08-netstat-25.jfif) | No aplicada: no aporta lectura fiable | No creada | **NO RECONSTRUIBLE.** Es compartida por las preguntas puntuables 29 y 30. No se pueden confirmar todas las filas, direcciones, puertos y estados, especialmente la última. Se mantienen las claves existentes; no se completaron valores por intuición. |

## Procesamiento y límites

Las cinco fotografías completas se extrajeron sin recomprimir del ZIP de fotos. Los SHA-256 de originales, recortes, mejoras y el baseline semántico están registrados en [`AUDITORIA_IMAGENES.json`](AUDITORIA_IMAGENES.json). Las mejoras de TFTP y Firewall usan ajustes moderados de contraste, color y enfoque; las comparaciones permiten cotejarlas con las capturas sin procesar. No se aplicó mejora automática a Netstat ni a routing porque no revelaba caracteres verificables. No se modificaron ni borraron las imágenes que ya estaban incrustadas en el Word.

La aplicación abre cada imagen en un visor con pantalla completa, rueda/controles de zoom, arrastre, gestos táctiles, cierre con Escape y selector de versiones. Solo las reconstrucciones **APROBADAS** aparecen como opción; las imágenes no reconstruibles conservan la foto original, el recorte del Word y el zoom.
