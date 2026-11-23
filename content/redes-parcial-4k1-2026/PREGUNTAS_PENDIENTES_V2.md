# Preguntas que siguen pendientes — Iteración 4

Quedan 9 sin clave puntuable: 3 provisionales y 6 ambiguas. Se pueden practicar sin contarlas como correctas/incorrectas y sin incluirlas en el denominador. Las nueve no tienen selectedOptionIds ni asterisco de correcta.

**Provisionales:** #41, #66, #67.  
**Ambiguas:** #37, #60, #79, #83, #119, #127.

## Detalle por pregunta

### Pregunta 37 — AMBIGUA

**ID:** `q-4e90e92ad7fb323f76cee91952bb22ddb463b606e49c5226c8235b32695944e1`  
**Estado anterior:** AMBIGUA.  
**Enunciado:** ¿Cuáles de las siguientes afirmaciones son correctas a partir de la captura de Wireshark de la imagen? (seleccione dos opciones)

**Por qué permanece sin clave:** [Hallazgo] La captura es un SYN+ACK del servidor TCP/443 al puerto efímero 52086 de la PC, con MSS y Window Scale en opciones. La alternativa 4 es correcta. La alternativa 1 puede reflejar la simplificación de la filmina de la cátedra, que describe la respuesta SYN+ACK como aceptación y apertura de un socket; sin embargo, el handshake aún requiere el ACK final y el servidor no está en estado ESTABLISHED. Como el ítem exige dos respuestas y una de ellas depende de esa formulación imprecisa, se conserva sin clave.

**Evidencia que falta:** Una captura íntegra con SYN inicial, SYN+ACK y ACK final, y precisión de cátedra sobre qué significa «acepta/inicia un socket». La captura sola no completa el handshake y el ítem exige dos opciones.

**Imagen/es:** `assets/image-55e91291c9b4c2c62ca9ed43.png` (downloaded_original).

**Fuentes revisadas:**
- Imagen del cuestionario `assets/image-55e91291c9b4c2c62ca9ed43.png`. La imagen muestra la configuración específica usada para interpretar esta pregunta; se conserva su estatus si la reconstrucción no se puede confirmar independientemente.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 24–25 — Opciones TCP y establecimiento de conexión. La captura muestra el intercambio inicial; la secuencia de tres vías requiere SYN, SYN/ACK y ACK final.
- RFC 9293 — Transmission Control Protocol, §§3.5, 3.8.3 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc9293.html)). SYN inicia y SYN+ACK responde con reconocimiento; el tercer ACK completa el three-way handshake.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. Captura SYN+ACK legible; el registro procede de los recursos del cuestionario y no se cotejó con una foto original del examen.

---

### Pregunta 41 — PROVISIONAL

**ID:** `q-422034e0c1a0064f10d4d5bc0de40e26a0a86c3089b377e3fcc8877973ec86d2`  
**Estado anterior:** PROVISIONAL.  
**Enunciado:** Observe las reglas del firewall de la imagen: se evalúan de arriba hacia abajo y se aplica la primera coincidencia. Desde el equipo 192.168.10.25 se inicia una conexión HTTP al servidor 203.0.113.10. ¿Qué ocurre? ¿Y si la conexión es HTTPS?

**Por qué permanece sin clave:** La fila 1 (HTTP/80) tiene indicador verde, pero la fila 2 (HTTPS/443) aparece gris. La guía local define verde=aceptar, rojo=descartar y negro=rechazar; no define este gris. La imagen no permite decidir la acción de la regla 2. La afirmación de la alternativa que HTTPS se bloquea sigue sin verificarse.

**Evidencia que falta:** Una fotografía original legible o documentación que asigne una acción al indicador gris de la regla HTTPS. La guía define verde, rojo y negro, no gris.

**Imagen/es:** `assets/image-45e7d914a71370868ac4d5ad.png` (downloaded_original).

**Fuentes revisadas:**
- Imagen del cuestionario `assets/image-45e7d914a71370868ac4d5ad.png`. La imagen muestra la configuración específica usada para interpretar esta pregunta; se conserva su estatus si la reconstrucción no se puede confirmar independientemente.
- Lectura de reglas del firewall IPFire.pdf, visor pp. 2–4 — Acciones de reglas y primera coincidencia. La guía da el código visual de ACCEPT/DROP/REJECT y la prioridad de reglas. La lectura de color de la captura debe confirmarse porque la imagen es una reconstrucción.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. La fila 2 de HTTPS es gris y la guía no define gris como una acción; no es posible confirmar el bloqueo.

---

### Pregunta 60 — AMBIGUA

**ID:** `q-c2f920289cc283442fc3da7767aeb2bc58ab211d2a8776260dff04def1ee1459`  
**Estado anterior:** AMBIGUA.  
**Enunciado:** La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo. ¿Qué servicios puede asegurar que están corriendo en el servidor?

**Por qué permanece sin clave:** [Problema] La imagen muestra TCP/23 en LISTEN y un socket UDP local en el puerto 53. Ambos son puertos convencionales de Telnet y DNS, respectivamente, pero netstat informa sockets/puertos y no identifica por sí solo el proceso o aplicación. La consigna está configurada como opción única y no aporta dato para descartar una de las dos asociaciones.

**Evidencia que falta:** Identificación del proceso/servicio o contexto explícito que descarte uno de los listeners TCP/23 y UDP/53. Los puertos convencionales no identifican por sí solos la aplicación.

**Imagen/es:** `assets/image-43a7851536808316264f8bea.png` (downloaded_original).

**Fuentes revisadas:**
- Imagen del cuestionario `assets/image-43a7851536808316264f8bea.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 31–33 — Puertos y netstat. La filmina permite interpretar listeners y puertos conocidos.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. La salida muestra TCP/23 en LISTEN y UDP/53; no identifica procesos ni la versión histórica del examen.

---

### Pregunta 66 — PROVISIONAL

**ID:** `q-51e6e38f8e2f6c0556bf28bd53ee536ed72a4d25c4477d4b58fa3c4346e47d8d`  
**Estado anterior:** PROVISIONAL.  
**Enunciado:** Observe la topología de la imagen. PC1 y luego PC2 se conectan al servidor web usando el mismo puerto de origen 48200 y el router realiza PAT. ¿Qué información tiene el paquete de PC1 hacia el servidor capturado en el switch (red privada)?

**Por qué permanece sin clave:** La imagen identifica PC1 192.168.1.101:48200 y servidor 152.0.10.5, pero no especifica el puerto del servidor. La opción que usa puerto 80 presupone HTTP y la que usa 443 presupone HTTPS; el texto solo dice “servidor web”. Ambas son posibles antes de PAT, por lo que no se establece una clave única.

**Evidencia que falta:** La topología fuente y el puerto de destino del servidor (HTTP/80 o HTTPS/443), preferentemente una fotografía/recorte original. El dibujo no indica el servicio/puerto.

**Imagen/es:** `assets/image-2c8bbd2ccf3db927605682c5.png` (downloaded_original).

**Fuentes revisadas:**
- Imagen del cuestionario `assets/image-2c8bbd2ccf3db927605682c5.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 11–13 — PAT antes y después de traducción. La filmina explica traducción de puertos y asociaciones privadas/públicas.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. No se muestra el puerto del servidor; la procedencia del gráfico es reconstruida y no se cotejó con una fotografía original.

---

### Pregunta 67 — PROVISIONAL

**ID:** `q-9fdfb475f1fc9cea407a1a0365af224e2d59519e2ec022e83f1ebc6364b66496`  
**Estado anterior:** PROVISIONAL.  
**Enunciado:** Observe la topología de la imagen. PC1 y luego PC2 se conectan al servidor web usando el mismo puerto de origen 48200 y el router realiza PAT. ¿Qué información tiene el paquete de PC2 hacia el servidor capturado en el switch (red privada)?

**Por qué permanece sin clave:** La imagen identifica PC2 192.168.1.102 y el servidor 152.0.10.5; el texto da el puerto de origen 48200. Ninguno especifica si el servidor web atiende por HTTP/80 o HTTPS/443. La alternativa con puerto destino 80 depende de una suposición no declarada; queda sin puntuar.

**Evidencia que falta:** La topología fuente y el puerto de destino del servidor (HTTP/80 o HTTPS/443), preferentemente una fotografía/recorte original. Sin ese dato, ambas opciones son posibles.

**Imagen/es:** `assets/image-2c8bbd2ccf3db927605682c5.png` (downloaded_original).

**Fuentes revisadas:**
- Imagen del cuestionario `assets/image-2c8bbd2ccf3db927605682c5.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 11–13 — PAT antes y después de traducción. La filmina distingue el puerto local del puerto exterior asignado por PAT.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. No se muestra el puerto del servidor; la procedencia del gráfico es reconstruida y no se cotejó con una fotografía original.

---

### Pregunta 79 — AMBIGUA

**ID:** `q-bc25ccc6854ea5211b58b91767fb5c64184c68ecefb1cfc612647f7a8b14b7cc`  
**Estado anterior:** AMBIGUA.  
**Enunciado:** La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo. ¿Qué servicios puede asegurar que están corriendo en el servidor?

**Por qué permanece sin clave:** [Problema] La salida muestra listeners TCP en 22, 443 y 8080. SSH/22 y HTTPS/443 son dos asociaciones convencionales plausibles; 8080 también puede alojar HTTP, aunque el puerto no identifica la aplicación. Netstat no acredita qué proceso está detrás y la pregunta pide una única respuesta.

**Evidencia que falta:** Identificación de los procesos que escuchan o contexto que descarte SSH/22, HTTPS/443 y el servicio en 8080. Netstat no demuestra la aplicación y la consigna pide una.

**Imagen/es:** `assets/image-2ce63dd5cad3d702e14de445.png` (downloaded_original).

**Fuentes revisadas:**
- Imagen del cuestionario `assets/image-2ce63dd5cad3d702e14de445.png`. Captura/topología que contiene los valores observados; el estado de reconstrucción consta en observaciones.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 31–33 — Puertos de servicios y netstat. La filmina permite asociar TCP/22 a SSH y TCP/443 a HTTPS; 8080 no identifica un protocolo estándar único.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. La captura muestra puertos 22, 443 y 8080; no identifica procesos ni el servicio realmente asociado.

---

### Pregunta 83 — AMBIGUA

**ID:** `q-ad81b98133518664126342919f01b3763cff2e9dfde234dc14623fe4c1eb8476`  
**Estado anterior:** AMBIGUA.  
**Enunciado:** ¿Qué contiene la envoltura de un mensaje SMTP?

**Por qué permanece sin clave:** [Problema] El sobre SMTP se compone de la dirección de retorno (MAIL FROM) y los destinatarios (RCPT TO). Ninguna opción describe ambos. La alternativa “remitente y versión de SMTP” es incompleta y agrega un dato que no pertenece al sobre. El ítem no ofrece una respuesta válida.

**Evidencia que falta:** Fotografía independiente del enunciado y una opción que incluya tanto MAIL FROM como RCPT TO. Ninguna alternativa actual cubre ambos componentes sin añadir un dato ajeno.

**Fuentes revisadas:**
- 3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf, visor pp. 30–32 — Sobre SMTP y contenido del mensaje. La filmina diferencia sobre de transporte, cabeceras y cuerpo.
- RFC 5321 — Simple Mail Transfer Protocol, §§3.3, 4.1.1.2–4.1.1.3 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc5321.html)). MAIL FROM y RCPT TO identifican remitente y destinatarios de la transacción SMTP.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.

---

### Pregunta 119 — AMBIGUA

**ID:** `q-d464c1c8de0b704fc84ce85c760f824c1abb241eb352cb0420a8ef64dd2b4a43`  
**Estado anterior:** AMBIGUA.  
**Enunciado:** Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.70.0/24?

**Por qué permanece sin clave:** [Problema] La tabla de la imagen asigna simultáneamente 192.168.70.0/24 a rutas R por RIP y a una ruta C directamente conectada. La misma tabla indica una ruta local L 192.168.70.1/32 en Serial0/1/1. En una tabla instalada, la ruta conectada (AD 0) debe prevalecer sobre RIP (AD 120); la coexistencia mostrada es inconsistente. La topología y tabla son de una reconstrucción y las fotos disponibles reproducen la pantalla del cuestionario, no una fuente de examen independiente. No se infiere qué fila fue transcrita mal.

**Evidencia que falta:** Foto original nítida o tabla corregida/autorizada que resuelva la coexistencia R/C para 192.168.70.0/24 y confirme la dirección local de Serial0/1/1. No inferir cuál fila es errónea.

**Imagen/es:** `assets/image-42a2abb1e63652c10014ce21.png` (downloaded_original).

**Fuentes revisadas:**
- Imagen del cuestionario `assets/image-42a2abb1e63652c10014ce21.png`. Captura/topología examinada visualmente; véanse observaciones sobre reconstrucciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — Códigos C y R. La filmina diferencia códigos de rutas y AD; la reconstrucción muestra rutas duplicadas.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. La tabla contiene R y C para el mismo /24; foto de examen original no hallada.

---

### Pregunta 127 — AMBIGUA

**ID:** `q-96f1748132d556ec2f1315a373676a5e53a184be89347f30dab24877f53ccd79`  
**Estado anterior:** AMBIGUA.  
**Enunciado:** Una sucursal envía órdenes de pago a casa central por un enlace cifrado. Un atacante no puede leerlas, pero modifica algunos bits y casa central procesa datos distintos. ¿Qué tipo de amenaza ocurrió y qué faltó?

**Por qué permanece sin clave:** [Problema] La amenaza descrita es modificación y afecta integridad. Sin embargo, un hash sin clave o autenticación puede recalcularse por el atacante activo; la alternativa 1 es insuficiente como solución de seguridad. Haría falta un MAC/HMAC, una firma digital verificable o cifrado autenticado (AEAD), pero ninguna opción lo ofrece.

**Evidencia que falta:** Una opción con MAC/HMAC, firma o AEAD y precisión del modelo de atacante, o aclaración docente de que se busca solo el nombre de la amenaza. Un hash simple se puede recalcular tras una alteración.

**Fuentes revisadas:**
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, visor pp. 16–17 — Integridad y hash. La diapositiva trata hash como integridad, pero no cubre autenticación contra recálculo adversarial.
- RFC 5116 — Authenticated Encryption, §1, Introduction ([fuente primaria](https://www.rfc-editor.org/rfc/rfc5116.html)). La autenticación de mensajes protege integridad frente a alteración; puede usarse MAC o AEAD.
- RFC 5116 — An Interface and Algorithms for Authenticated Encryption, §1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc5116.html)). AEAD combina confidencialidad con autenticación del ciphertext y datos asociados.
- RFC 2104 — HMAC: Keyed-Hashing for Message Authentication, §1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc2104.html)). Un MAC basado en hash y clave compartida valida integridad y autenticidad, a diferencia de un hash simple.

**Escenario mostrado:** INCOMPLETA. **Fidelidad histórica:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.

---

## Condiciones para cerrar los pendientes

Una reauditoría debe aportar el dato faltante y reevaluar todas las alternativas. No basta con que una opción sea plausible: debe coincidir con el tipo de pregunta y el número de respuestas exigido. No usar respuestas marcadas en el test online como fuente de claves.
