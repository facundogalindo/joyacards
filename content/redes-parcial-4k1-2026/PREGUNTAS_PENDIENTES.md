# Preguntas pendientes de revisión

Hay 40 preguntas sin clave verificada: 32 provisionales y 8 ambiguas. No se marcan como correctas en el DOCX. En las provisionales se conserva una candidata de trabajo solo para revisión; no equivale a una clave confirmada.

Los identificadores corresponden al orden estable de extracción. El análisis completo de todas las alternativas permanece en el JSON.

## Pregunta 9 — PROVISIONAL — confianza MEDIA

**ID:** `q-b4f6558008f4dfa586fb09893bc179edb92ed42f305e65e7be77c65e2cab2b28`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿A qué dispositivo pertenece la tabla de enrutamiento?

**Candidata provisional (sin puntuar en el DOCX):** Router3

**Análisis:** [Respuesta] La tabla corresponde a Router3: sus redes conectadas incluyen 192.168.30.0/24 y .50.0/24, asociadas a sus enlaces en la topología; la tabla además muestra una ruta directa .70. [Fundamento] Las rutas C identifican redes conectadas. [Reserva] La propia nota del cuestionario indica que la topología se mejoró con IA y puede diferir del original.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 2: Router3 — correct. Correcta: .50 está conectada a Router3 y la tabla registra su interfaz LAN, junto con sus enlaces hacia Router1/Router2.

**Fuentes consultadas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: RIP; distancia administrativa
- Imagen del cuestionario: assets/image-fb74a0786354509729acea92.png

---

## Pregunta 10 — PROVISIONAL — confianza MEDIA

**ID:** `q-5bc77dc7d963f7cb49f73471465ffb9d2496b296da1aaccc7f2cd2408d68a916`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.50.0/24?

**Candidata provisional (sin puntuar en el DOCX):** Porque se encuentra directamente conectada al equipo

**Análisis:** [Respuesta] La letra C y is directly connected indican que 192.168.50.0/24 está directamente conectada a una interfaz del router. [Reserva] Es una topología de práctica mejorada con IA, no una fotografía original; el dato visible es claro pero su fidelidad al parcial no puede certificarse.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 3: Porque se encuentra directamente conectada al equipo — correct. Correcta: la entrada C indica red directamente conectada.

**Fuentes consultadas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: RIP; distancia administrativa
- Imagen del cuestionario: assets/image-fb74a0786354509729acea92.png

---

## Pregunta 11 — PROVISIONAL — confianza MEDIA

**ID:** `q-3238984be8eaf2ef50f7f0ba153bd7c326f88ff5d81a847681ff69f2477a1a35`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.10.0/24?

**Candidata provisional (sin puntuar en el DOCX):** Por enrutamiento dinámico RIP

**Análisis:** [Respuesta] La ruta a 192.168.10.0/24 está marcada R, código de ruta aprendida mediante RIP; [120/1] coincide con AD 120 y una métrica RIP de un salto. [Reserva] La tabla/topología son una reconstrucción de práctica mejorada con IA.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 5: Por enrutamiento dinámico RIP — correct. Correcta: código R indica RIP; 120/1 es consistente con una ruta RIP de un salto.

**Fuentes consultadas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: RIP; distancia administrativa
- Imagen del cuestionario: assets/image-fb74a0786354509729acea92.png

---

## Pregunta 12 — PROVISIONAL — confianza MEDIA

**ID:** `q-449de4d71d5958146d9e2ec0de5eb04efe00c33cd15b6d1e79e6b1128984cdfa`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. Para llegar a la red 192.168.40.0/24, ¿a qué router le pasa el paquete?

**Candidata provisional (sin puntuar en el DOCX):** Router2 (192.168.70.1)

**Análisis:** [Respuesta] Para llegar a 192.168.40.0/24 la tabla indica via 192.168.70.1; en la topología, esa dirección es la interfaz de Router2 en la red 192.168.70.0/24. [Reserva] Tabla y topología son reconstruidas.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 1: Router2 (192.168.70.1) — correct. 192.168.70.1 pertenece a Router2, no a un destino conectado directamente.

**Fuentes consultadas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: RIP; distancia administrativa
- Imagen del cuestionario: assets/image-fb74a0786354509729acea92.png

---

## Pregunta 13 — PROVISIONAL — confianza MEDIA

**ID:** `q-818f4bfaa4b32d14d8966ec2a374ab1978b5ee4b5f523bc06d65fac50120ddcb`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. La red 192.168.20.0/24 aparece con dos líneas «via». ¿Por qué?

**Candidata provisional (sin puntuar en el DOCX):** Porque hay dos caminos de igual costo (1 salto): por Router1 y por Router2

**Análisis:** [Respuesta] La ruta .20 tiene dos próximos saltos distintos con la misma métrica de RIP, ambos de un salto; el router puede balancear entre rutas de igual costo. [Reserva] La tabla fue reconstruida/mejorada con IA.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 1: Porque hay dos caminos de igual costo (1 salto): por Router1 y por Router2 — correct. Correcta: dos entradas con métrica igual por Router1 y Router2 son rutas RIP de igual costo.

**Fuentes consultadas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: RIP; distancia administrativa
- Imagen del cuestionario: assets/image-fb74a0786354509729acea92.png

---

## Pregunta 14 — PROVISIONAL — confianza MEDIA

**ID:** `q-a576a047f711f3e475ec759164477625bf8224d838cc457068208f5a32fdcf42`

**Enunciado literal:**

> La máquina A envía datos a la máquina B a 8 Mbps, tasa determinada por su ventana de congestión. En un ACK, B informa una ventana de recepción de 6000 bytes. ¿Qué hará A?

**Candidata provisional (sin puntuar en el DOCX):** Reducirá la transmisión hacia B a 6000 bytes

**Análisis:** [Respuesta] La ventana de recepción de 6000 bytes limita los datos que pueden permanecer sin confirmar; el emisor debe respetar el mínimo entre esa ventana y su ventana de congestión. [Reserva] La alternativa expresa ese límite como reducir la transmisión a 6000 bytes, aunque técnicamente no fija una tasa de 6000 bytes/s ni obliga a enviar exactamente ese volumen.

**Qué falta:** completar un segundo cotejo académico del alcance de la afirmación y confirmar que no haya otra interpretación defendible antes de fijar la clave.

**Alternativas aún defendibles o por revisar:**
- 1: Reducirá la transmisión hacia B a 6000 bytes — correct. Es la única alternativa que reconoce el límite anunciado de recepción; con precisión, limita bytes pendientes de ACK, no la tasa instantánea ni obliga a llenar toda la ventana.

**Fuentes consultadas:**
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, pp. 8–28 (visor) — sección: TCP/UDP; cabecera, control de flujo, banderas y conexiones

---

## Pregunta 16 — PROVISIONAL — confianza MEDIA

**ID:** `q-803c881e8e578cb106e2afe3198e57979ccde49e6b7e39e4b0a158afb2b85700`

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63241. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué equipo es el destinatario?

**Candidata provisional (sin puntuar en el DOCX):** Sala-07

**Análisis:** [Respuesta] El puerto público de destino 63241 corresponde en la tabla a 172.20.35.57, Sala-07; el router deshace PAT y entrega el flujo a ese host. [Reserva] La tabla es reconstruida, no original.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 1: Sala-07 — correct. Correcta: la entrada pública :63241 se traduce al host privado 172.20.35.57, Sala-07.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–14 (visor) — sección: NAT estática/dinámica y PAT
- Imagen del cuestionario: assets/image-77d62ab302bace2d878c00c2.png

---

## Pregunta 17 — PROVISIONAL — confianza MEDIA

**ID:** `q-fbe64bafcfd90ec0394334e5b54b914be74fd86815a8eef47396ce64c9cca1bd`

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63241. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué IP de destino tiene en la LAN?

**Candidata provisional (sin puntuar en el DOCX):** 172.20.35.57

**Análisis:** [Respuesta] La entrada para el puerto externo 63241 traduce la IP pública 192.0.2.92 a la IP interna 172.20.35.57. [Reserva] Tabla reconstruida.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 2: 172.20.35.57 — correct. Correcta: la fila asociada al puerto externo 63241 señala 172.20.35.57.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–14 (visor) — sección: NAT estática/dinámica y PAT
- Imagen del cuestionario: assets/image-77d62ab302bace2d878c00c2.png

---

## Pregunta 18 — PROVISIONAL — confianza MEDIA

**ID:** `q-1481ddfad5d1075a474bf3f6f0518cded17db231e18a95421fde9adb6e0e1acb`

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63241. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué puerto de destino tiene en la LAN?

**Candidata provisional (sin puntuar en el DOCX):** 53740

**Análisis:** [Respuesta] El mapeo externo 63241 corresponde al puerto interno 53740; PAT restaura el puerto de destino LAN según la tabla. [Reserva] Tabla reconstruida.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 3: 53740 — correct. Correcta: el puerto interno consignado en la fila externa 63241 es 53740.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–14 (visor) — sección: NAT estática/dinámica y PAT
- Imagen del cuestionario: assets/image-77d62ab302bace2d878c00c2.png

---

## Pregunta 19 — PROVISIONAL — confianza MEDIA

**ID:** `q-52b078e45df80583e2aab432ec106003328b9862c2e1c8f8a39250186de64146`

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63242. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué equipo es el destinatario?

**Candidata provisional (sin puntuar en el DOCX):** Sala-04

**Análisis:** [Respuesta] El destino público :63242 se mapea en la tabla a 172.20.35.44, Sala-04. [Reserva] Tabla reconstruida.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 1: Sala-04 — correct. Correcta: la fila con puerto externo 63242 corresponde a Sala-04.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–14 (visor) — sección: NAT estática/dinámica y PAT
- Imagen del cuestionario: assets/image-77d62ab302bace2d878c00c2.png

---

## Pregunta 20 — PROVISIONAL — confianza MEDIA

**ID:** `q-5393f346dff446ddf380e131dbfc6045f824da23ee4f2102b32a3d4ebec4b046`

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63242. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué IP de destino tiene en la LAN?

**Candidata provisional (sin puntuar en el DOCX):** 172.20.35.44

**Análisis:** [Respuesta] La fila PAT de puerto externo 63242 traduce 192.0.2.92 a 172.20.35.44 en la LAN. [Reserva] Tabla reconstruida.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 3: 172.20.35.44 — correct. Correcta: 63242 se asocia al host interno 172.20.35.44.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–14 (visor) — sección: NAT estática/dinámica y PAT
- Imagen del cuestionario: assets/image-77d62ab302bace2d878c00c2.png

---

## Pregunta 21 — PROVISIONAL — confianza MEDIA

**ID:** `q-09d4b7d94d836fa24d613d85c8d956dfb2b2f9a22ae0f98906a7c8de753aac9c`

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63242. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué puerto de destino tiene en la LAN?

**Candidata provisional (sin puntuar en el DOCX):** 53740

**Análisis:** [Respuesta] El puerto externo 63242 se traduce al puerto interno 53740 antes de entregar el segmento en LAN. [Reserva] Tabla reconstruida.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 4: 53740 — correct. Correcta: el mapeo 63242 restaura puerto interno 53740.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–14 (visor) — sección: NAT estática/dinámica y PAT
- Imagen del cuestionario: assets/image-77d62ab302bace2d878c00c2.png

---

## Pregunta 22 — PROVISIONAL — confianza MEDIA

**ID:** `q-49d9c5545b13870e53bb15082e185eb7cfa59d8bae8bae1936a61b7a99df52de`

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. ¿Qué pasaría si R-Sala asignara el puerto externo 63242 a ambas conexiones?

**Candidata provisional (sin puntuar en el DOCX):** Los encabezados de las respuestas serían idénticos y R-Sala no podría distinguir las conexiones

**Análisis:** [Respuesta] Si las dos conexiones usan la misma IP pública, protocolo y puerto externo, una respuesta con el mismo servidor y puerto de origen produce una tupla externa indistinguible; PAT no puede identificar qué destino privado corresponde. [Reserva] La imagen muestra la situación de dos flujos.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 3: Los encabezados de las respuestas serían idénticos y R-Sala no podría distinguir las conexiones — correct. Correcta: si se repite el mismo puerto externo para el mismo protocolo/IP y servidor, el flujo de retorno es indistinguible.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–14 (visor) — sección: NAT estática/dinámica y PAT
- Imagen del cuestionario: assets/image-77d62ab302bace2d878c00c2.png

---

## Pregunta 25 — PROVISIONAL — confianza MEDIA

**ID:** `q-294ef613a28d817241c07cc97c6b3dbbfd1a8165cb637113206ee88c57d87cd2`

**Enunciado literal:**

> Me encuentro ubicado en el equipo con IP 192.168.50.102/24 (VERDE) y necesito hacer ping al equipo 172.16.170.33/24 (ROJO) pasando por el firewall que tiene la configuración de la imagen. ¿Qué sucederá?

**Candidata provisional (sin puntuar en el DOCX):** El ping será bloqueado debido a la regla 3

**Análisis:** [Respuesta] El origen .102, destino .33 y protocolo ICMP coinciden con regla 3; también coincidiría regla 4, pero la evaluación indicada prioriza la primera coincidencia. La captura marca la fila 3 como bloqueo. [Reserva] No hay leyenda de acciones explícita en esta imagen; la interpretación del color de la fila es necesaria.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 2: El ping será bloqueado debido a la regla 3 — correct. Correcta bajo la lectura de color/acción de la captura: regla 3 es la primera coincidencia específica y bloquea; regla 4 no llega a evaluarse.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-4d11058301d9e14f5dd7d5e5.png
- Lectura de reglas del firewall IPFire.pdf, pp. 2–4 (visor) — sección: Lectura de reglas IPFire

---

## Pregunta 26 — AMBIGUA — confianza BAJA

**ID:** `q-112b2a2e0ecdac1f974abb399af42b3c64c07a4fdf7ac81b0b7edf744726ddfa`

**Enunciado literal:**

> Me encuentro ubicado en el equipo con IP 192.168.50.20/24 (VERDE) y necesito hacer ping al equipo 172.16.170.33/24 (ROJO) pasando por el firewall que tiene la configuración de la imagen. ¿Qué sucederá?

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** [Respuesta] La dirección de origen 192.168.50.20 pertenece a Green y coincide con la regla 4 (ICMP desde Green hacia 172.16.170.33); la regla 3 limita el origen a 192.168.50.102. [Reserva] La captura no identifica de forma legible la acción de la regla 4. Por eso no se puede confirmar si el ping se permite o bloquea.

**Observaciones:** La regla coincidente puede identificarse, pero falta evidencia legible de su acción.
**Problemas registrados:** No se asigna clave mientras la acción de la regla 4 no pueda comprobarse.

**Alternativas aún defendibles o por revisar:**
- 4: El ping será exitoso debido a la regla 4 — ambiguous. Coincide el protocolo, la red Green y el destino de la regla 4, pero la captura no permite confirmar su acción.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-4d11058301d9e14f5dd7d5e5.png
- Lectura de reglas del firewall IPFire.pdf, pp. 2–4 (visor) — sección: Colores de acciones y evaluación de reglas

---

## Pregunta 37 — AMBIGUA — confianza MEDIA

**ID:** `q-4e90e92ad7fb323f76cee91952bb22ddb463b606e49c5226c8235b32695944e1`

**Enunciado literal:**

> ¿Cuáles de las siguientes afirmaciones son correctas a partir de la captura de Wireshark de la imagen? (seleccione dos opciones)

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** [Observación] La captura muestra un SYN+ACK desde el puerto 443 del servidor hacia el puerto efímero 52086 de la PC, con MSS y escalado de ventana anunciados. Esto confirma la opción 4 y que se responde al SYN inicial. Sin embargo, el intercambio todavía requiere el ACK final de la PC: con esta sola trama no se puede afirmar que la conexión fue aceptada/establecida según TCP. La pregunta exige dos opciones y no ofrece una segunda afirmación rigurosamente correcta.

**Observaciones:** Una segunda alternativa solo sería defendible usando “acepta” como abreviatura coloquial de “responde al SYN”; técnicamente no equivale a estado ESTABLISHED/accept completado.
**Problemas registrados:** No se asigna una clave de dos opciones porque solo una afirmación está comprobada sin esa simplificación.

**Alternativas aún defendibles o por revisar:**
- 1: El servidor web acepta la conexión e inicia un nuevo socket hacia la PC — ambiguous. Ambigua: un SYN+ACK responde al SYN de apertura, pero no completa por sí solo el establecimiento TCP ni prueba que la aplicación haya aceptado el socket.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-55e91291c9b4c2c62ca9ed43.png
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, pp. 24–25 (visor) — sección: Opciones TCP y establecimiento de conexión

---

## Pregunta 41 — PROVISIONAL — confianza MEDIA

**ID:** `q-422034e0c1a0064f10d4d5bc0de40e26a0a86c3089b377e3fcc8877973ec86d2`

**Enunciado literal:**

> Observe las reglas del firewall de la imagen: se evalúan de arriba hacia abajo y se aplica la primera coincidencia. Desde el equipo 192.168.10.25 se inicia una conexión HTTP al servidor 203.0.113.10. ¿Qué ocurre? ¿Y si la conexión es HTTPS?

**Candidata provisional (sin puntuar en el DOCX):** HTTP se permite por la regla 1 y HTTPS se bloquea por la regla 2

**Análisis:** [Respuesta propuesta] La regla 1 permite HTTP desde 192.168.10.0/24 a 203.0.113.10:80; HTTPS coincide con la regla 2, que aparece como rechazo en la representación. [Reserva] La imagen es una reconstrucción y no trae leyenda local de colores/acciones; por eso se conserva como provisional aunque la interpretación coincide con la guía IPFire.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 1: HTTP se permite por la regla 1 y HTTPS se bloquea por la regla 2 — correct. Correcta bajo la lectura de colores de la regla: HTTP/80 coincide con la primera fila de aceptación; HTTPS/443 coincide con la siguiente fila de rechazo.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-45e7d914a71370868ac4d5ad.png
- Lectura de reglas del firewall IPFire.pdf, pp. 2–4 (visor) — sección: Acciones de reglas y primera coincidencia

---

## Pregunta 42 — AMBIGUA — confianza BAJA

**ID:** `q-137100768d5b78bcd0abb2008128fbe4fd3c7e7e1bb0618b1b46e992a538b2e9`

**Enunciado literal:**

> Observe las reglas del firewall de la imagen: se evalúan de arriba hacia abajo y se aplica la primera coincidencia. Desde el equipo 192.168.10.25 se hace ping a 203.0.113.10. ¿Qué hace el firewall con la solicitud de eco?

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** [Problema] La solicitud ICMP sí coincide con la regla 3 por origen, destino y protocolo. En la reconstrucción, la fila 3 aparece con el color que la guía asocia a rechazo; en ese caso, ninguna alternativa dice que la regla 3 rechaza el ping. La opción 2 afirma lo contrario y no puede marcarse. Sin una leyenda en la propia imagen, el resultado no se puede fijar con plena certeza.

**Observaciones:** No hay alternativa para “rechazado por la regla 3” si la lectura de color es correcta; si la acción fuera permitir, la opción 2 sería correcta.
**Problemas registrados:** No se asigna clave por discordancia entre acción visible inferida y opciones ofrecidas.

**Alternativas aún defendibles o por revisar:**
- 2: Lo permite por la regla 3, porque es ICMP y coinciden origen y destino — ambiguous. Ambigua/incorrecta: coincide con regla 3 pero la imagen no acredita que se permita; según la guía, su color corresponde a rechazo.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-45e7d914a71370868ac4d5ad.png
- Lectura de reglas del firewall IPFire.pdf, pp. 2–4 (visor) — sección: Acciones de reglas y primera coincidencia

---

## Pregunta 43 — PROVISIONAL — confianza MEDIA

**ID:** `q-04a250a445a6d5f2d860fe301886e6070b266c57c89975aee07e343e8ba87231`

**Enunciado literal:**

> Observe las reglas del firewall de la imagen: se evalúan de arriba hacia abajo y se aplica la primera coincidencia. Desde el equipo 192.168.10.25 se abre una conexión Telnet a 203.0.113.10. ¿Qué ocurre?

**Candidata provisional (sin puntuar en el DOCX):** Se deniega por la regla 5, porque ninguna regla anterior coincide por completo

**Análisis:** [Respuesta propuesta] El flujo TCP/23 desde 192.168.10.25 no coincide con las reglas 1–4 (destino 80, 443, ICMP o red 192.168.20.0/24); alcanza la regla 5, cuyo color rojo se interpreta como DROP según la guía. [Reserva] La imagen es una reconstrucción y no trae leyenda de acciones propia.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 3: Se deniega por la regla 5, porque ninguna regla anterior coincide por completo — correct. Correcta bajo la lectura visual: no hay coincidencia anterior y la regla 5 general del origen Green al servidor está codificada como DROP.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-45e7d914a71370868ac4d5ad.png
- Lectura de reglas del firewall IPFire.pdf, pp. 2–4 (visor) — sección: Acciones de reglas y primera coincidencia

---

## Pregunta 54 — PROVISIONAL — confianza MEDIA

**ID:** `q-61bd685683282b21f44486da78f63c93639e9982836a22c2a9ce29cae66032c3`

**Enunciado literal:**

> Observe la topología de la imagen. Ambas PCs abren conexiones TCP al servidor web. La PC 1 ya tiene asignado el puerto público 48200 y el router asigna el 48201 a la conexión de la PC 2. ¿Cómo sale a Internet el paquete de la PC 2 después de aplicar PAT?

**Candidata provisional (sin puntuar en el DOCX):** Origen 203.0.113.5:48201, destino 198.51.100.10:80

**Análisis:** [Respuesta propuesta] PAT cambia el origen de PC2 a 203.0.113.5:48201, manteniendo como destino el servidor 198.51.100.10:80. El valor externo 48201 está dado por el escenario.

**Observaciones:** El puerto 48201 depende del escenario dibujado/reconstruido.

**Alternativas aún defendibles o por revisar:**
- 3: Origen 203.0.113.5:48201, destino 198.51.100.10:80 — correct. Correcta: origen público del router y puerto PAT de PC2; destino web/80.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-ab56179d8357f41aeba62aff.png
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 11–13 (visor) — sección: PAT y traducción de puertos

---

## Pregunta 55 — PROVISIONAL — confianza MEDIA

**ID:** `q-148f9cfac577f528f025ca3665b594a6cf789428427e37b253c7fc7eecf62bfe`

**Enunciado literal:**

> Observe la topología de la imagen. Ambas PCs abren conexiones TCP al servidor web. La PC 1 ya tiene asignado el puerto público 48200 y el router asigna el 48201 a la conexión de la PC 2. ¿A qué puerto de destino va la respuesta del servidor en Internet y a qué puerto local la entrega el router PAT a la PC 2?

**Candidata provisional (sin puntuar en el DOCX):** Puerto público 48201 y puerto local 48200

**Análisis:** [Respuesta propuesta] El servidor dirige la respuesta al puerto público 48201. PAT consulta el mapeo y la entrega al puerto local 48200 de PC2.

**Qué falta:** cotejar de forma independiente los datos de la imagen con la fotografía o recorte original legible y confirmar que la reconstrucción no introduzca valores no observados.

**Alternativas aún defendibles o por revisar:**
- 2: Puerto público 48201 y puerto local 48200 — correct. Correcta: puerto exterior 48201 y traducción al puerto local 48200.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-ab56179d8357f41aeba62aff.png
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 11–14 (visor) — sección: Mapeo de respuestas PAT

---

## Pregunta 57 — PROVISIONAL — confianza MEDIA

**ID:** `q-1c1f96d089b6a579862c5361c437308c4e426c30ead91bee32eea0b61112f9de`

**Enunciado literal:**

> Una empresa reemplaza un enlace dedicado por una VPN que utiliza conectividad a Internet. Posteriormente observa que la capacidad disponible no presenta siempre el mismo comportamiento que tenía el enlace exclusivo. ¿Qué característica explica esta diferencia?

**Candidata provisional (sin puntuar en el DOCX):** La organización no controla completamente los recursos subyacentes de Internet, por lo que el rendimiento puede variar con la conectividad utilizada

**Análisis:** [Respuesta propuesta] La VPN crea un túnel lógico sobre Internet, pero no convierte la infraestructura de terceros en un enlace dedicado ni garantiza capacidad constante. La empresa no controla completamente los recursos de tránsito. [Límite] La fuente de cátedra describe el uso de Internet/ISP, pero no detalla una variación concreta de rendimiento.

**Observaciones:** La selección se infiere del carácter público y compartido de la red; la filmina no formula explícitamente una garantía de rendimiento.

**Alternativas aún defendibles o por revisar:**
- 2: La organización no controla completamente los recursos subyacentes de Internet, por lo que el rendimiento puede variar con la conectividad utilizada — correct. Correcta como inferencia del uso de infraestructura pública/ISP; no se afirma control de recursos por la empresa.

**Fuentes consultadas:**
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, pp. 42–45 (visor) — sección: VPN sobre Internet e infraestructura pública

---

## Pregunta 60 — AMBIGUA — confianza MEDIA

**ID:** `q-c2f920289cc283442fc3da7767aeb2bc58ab211d2a8776260dff04def1ee1459`

**Enunciado literal:**

> La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo. ¿Qué servicios puede asegurar que están corriendo en el servidor?

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** [Problema] La salida muestra TCP/23 en LISTEN (Telnet) y UDP/53 (servicio asociado a DNS). El ítem está configurado como opción única aunque hay dos respuestas plausibles; además, UDP/53 no identifica por sí solo el proceso.

**Observaciones:** Se observan al menos dos respuestas plausibles (DNS y Telnet), pese a la configuración de selección única.
**Problemas registrados:** No se asigna una clave única.

**Alternativas aún defendibles o por revisar:**
- 2: DNS — ambiguous. UDP/53 es el puerto de servicio DNS y aparece en la salida.
- 7: Telnet — ambiguous. Telnet/TCP 23 aparece en LISTEN.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-43a7851536808316264f8bea.png
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, pp. 31–33 (visor) — sección: Puertos y netstat

---

## Pregunta 66 — PROVISIONAL — confianza MEDIA

**ID:** `q-51e6e38f8e2f6c0556bf28bd53ee536ed72a4d25c4477d4b58fa3c4346e47d8d`

**Enunciado literal:**

> Observe la topología de la imagen. PC1 y luego PC2 se conectan al servidor web usando el mismo puerto de origen 48200 y el router realiza PAT. ¿Qué información tiene el paquete de PC1 hacia el servidor capturado en el switch (red privada)?

**Candidata provisional (sin puntuar en el DOCX):** Origen 192.168.1.101:48200 – Destino 152.0.10.5:80

**Análisis:** [Respuesta propuesta] En la red privada, antes de PAT, PC1 envía desde 192.168.1.101:48200 al servidor 152.0.10.5:80.

**Observaciones:** Topología reconstruida; los valores se leen en la ilustración y el enunciado.

**Alternativas aún defendibles o por revisar:**
- 4: Origen 192.168.1.101:48200 – Destino 152.0.10.5:80 — correct. Correcta: captura de LAN previa a PAT, con la dirección privada de PC1 y el servidor web/80.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-2c8bbd2ccf3db927605682c5.png
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 11–13 (visor) — sección: PAT antes y después de traducción

---

## Pregunta 67 — PROVISIONAL — confianza MEDIA

**ID:** `q-9fdfb475f1fc9cea407a1a0365af224e2d59519e2ec022e83f1ebc6364b66496`

**Enunciado literal:**

> Observe la topología de la imagen. PC1 y luego PC2 se conectan al servidor web usando el mismo puerto de origen 48200 y el router realiza PAT. ¿Qué información tiene el paquete de PC2 hacia el servidor capturado en el switch (red privada)?

**Candidata provisional (sin puntuar en el DOCX):** Origen 192.168.1.102:48200 – Destino 152.0.10.5:80

**Análisis:** [Respuesta propuesta] Antes de PAT, PC2 conserva origen privado 192.168.1.102:48200 y destino 152.0.10.5:80. La traducción pública a 48201 ocurre en el router.

**Observaciones:** Topología reconstruida; los valores se leen en la ilustración y el enunciado.

**Alternativas aún defendibles o por revisar:**
- 2: Origen 192.168.1.102:48200 – Destino 152.0.10.5:80 — correct. Correcta: dirección local PC2 y puerto original 48200 hacia web/80.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-2c8bbd2ccf3db927605682c5.png
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 11–13 (visor) — sección: PAT antes y después de traducción

---

## Pregunta 72 — PROVISIONAL — confianza MEDIA

**ID:** `q-eb9100f0c6306feda616f3f51a023ac4e97a0da72a98a7d18a1587d8104c67a8`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿A qué dispositivo pertenece la tabla de enrutamiento?

**Candidata provisional (sin puntuar en el DOCX):** Router1

**Análisis:** [Respuesta propuesta] La topología sitúa a Router1 junto a las redes .10, .20 y .30; la tabla incluye C para ellas y L 192.168.10.1/32. Corresponde a Router1. [Reserva] Es una reconstrucción.

**Observaciones:** Tabla reconstruida; los datos se cotejaron visualmente con la topología.

**Alternativas aún defendibles o por revisar:**
- 2: Router1 — correct. Correcta bajo la topología y tabla reconstruidas.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-bc41ff13990cee57d1e3945e.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: Códigos de rutas conectadas y locales

---

## Pregunta 73 — PROVISIONAL — confianza MEDIA

**ID:** `q-a03eac4aa5e021ce54edd7573cb49f32e2181335f135545ca67436611dd84e75`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.30.0/24?

**Candidata provisional (sin puntuar en el DOCX):** Porque se encuentra directamente conectada al equipo

**Análisis:** [Respuesta propuesta] La red .30 aparece con código C, que identifica una red directamente conectada.

**Observaciones:** Lectura de tabla reconstruida.

**Alternativas aún defendibles o por revisar:**
- 1: Porque se encuentra directamente conectada al equipo — correct. Correcta: C significa conectada directamente.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-bc41ff13990cee57d1e3945e.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: Códigos C, L y R

---

## Pregunta 74 — PROVISIONAL — confianza MEDIA

**ID:** `q-5f799619336c84d5718b730e2773f001bfd3327edd9cd63ab907cba37fd7a45a`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.60.0/24?

**Candidata provisional (sin puntuar en el DOCX):** Por enrutamiento dinámico RIP

**Análisis:** [Respuesta propuesta] La red .60 aparece con código R y [120/1], además de dos próximos saltos. R identifica aprendizaje por RIP; el valor 120 corresponde a AD y 1 a métrica.

**Observaciones:** Lectura de tabla reconstruida; sus dos próximos saltos se cotejaron visualmente.

**Alternativas aún defendibles o por revisar:**
- 4: Por enrutamiento dinámico RIP — correct. Correcta: R identifica RIP, aunque se muestren dos próximos saltos de igual costo.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-bc41ff13990cee57d1e3945e.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: RIP, distancia administrativa y métrica

---

## Pregunta 75 — PROVISIONAL — confianza MEDIA

**ID:** `q-a16ba4d412ab02030db1269a1d759a79f85cb3e017e24635bee0043d217d8fe6`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Qué indica el valor 120 en la notación [120/1]?

**Candidata provisional (sin puntuar en el DOCX):** Indica la distancia administrativa de la ruta

**Análisis:** [Respuesta propuesta] En [120/1], el primer campo es la distancia administrativa y el segundo la métrica; RIP tiene AD 120.

**Observaciones:** La notación se lee en una tabla reconstruida.

**Alternativas aún defendibles o por revisar:**
- 4: Indica la distancia administrativa de la ruta — correct. Correcta: 120 es la distancia administrativa.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-bc41ff13990cee57d1e3945e.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: AD y métrica RIP

---

## Pregunta 79 — AMBIGUA — confianza MEDIA

**ID:** `q-bc25ccc6854ea5211b58b91767fb5c64184c68ecefb1cfc612647f7a8b14b7cc`

**Enunciado literal:**

> La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo. ¿Qué servicios puede asegurar que están corriendo en el servidor?

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** [Problema] La salida muestra listeners TCP en puertos 22, 443 y 8080. Se reconocen SSH y HTTPS; 8080 es alternativo y por sí solo no demuestra que el proceso sea HTTP. El ítem exige una sola respuesta aunque contiene dos servicios identificables.

**Observaciones:** Se leen dos servicios de la lista en una pregunta configurada de opción única.
**Problemas registrados:** No se asigna clave única.

**Alternativas aún defendibles o por revisar:**
- 1: SSH — ambiguous. TCP/22 LISTEN identifica SSH.
- 7: HTTPS — ambiguous. TCP/443 LISTEN identifica HTTPS.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-2ce63dd5cad3d702e14de445.png
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, pp. 31–33 (visor) — sección: Puertos de servicios y netstat

---

## Pregunta 83 — AMBIGUA — confianza MEDIA

**ID:** `q-ad81b98133518664126342919f01b3763cff2e9dfde234dc14623fe4c1eb8476`

**Enunciado literal:**

> ¿Qué contiene la envoltura de un mensaje SMTP?

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** [Problema] El sobre SMTP incluye los comandos MAIL FROM y RCPT TO: remitente y destinatario de transporte. Ninguna alternativa los incluye a ambos. “Remitente y versión de SMTP” es parcial y omite destinatario.

**Observaciones:** La alternativa completa “remitente y destinatario” no aparece.
**Problemas registrados:** Ninguna opción describe completamente la envoltura SMTP; se deja sin clave.

**Alternativas aún defendibles o por revisar:**
- 4: Remitente y versión de SMTP — ambiguous. Parcial: contiene remitente pero omite destinatario y agrega una versión que no es parte del sobre.

**Fuentes consultadas:**
- 3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf, pp. 30–32 (visor) — sección: Sobre SMTP y contenido del mensaje
- RFC 5321 — Simple Mail Transfer Protocol — §§3.3, 4.1.1.2–4.1.1.3 — https://www.rfc-editor.org/rfc/rfc5321.html

---

## Pregunta 108 — PROVISIONAL — confianza MEDIA

**ID:** `q-3d06c1b3702e6b2de6d6ee3bbb7f6516c1779d7dc778c22b08133b67d3b4160c`

**Enunciado literal:**

> ¿Cuáles de las siguientes afirmaciones sobre las banderas del encabezado TCP son correctas? (seleccione dos opciones)

**Candidata provisional (sin puntuar en el DOCX):** PSH le pide al receptor que entregue los datos de inmediato a la aplicación / CWR lo activa el emisor para avisar al receptor que ya redujo la tasa de transferencia

**Análisis:** PSH solicita entrega pronta de datos; CWR avisa que el emisor reaccionó a ECN reduciendo cwnd. “De inmediato”/“tasa” son simplificaciones.

**Observaciones:** PSH no garantiza latencia cero; CWR reporta reacción/reducción de cwnd, no una tasa específica.

**Alternativas aún defendibles o por revisar:**
- 3: PSH le pide al receptor que entregue los datos de inmediato a la aplicación — correct. Correcta en el modelo docente: PSH solicita entrega pronta a aplicación.
- 6: CWR lo activa el emisor para avisar al receptor que ya redujo la tasa de transferencia — correct. Correcta en esencia; RFC 3168 relaciona CWR con reducción de ventana.

**Fuentes consultadas:**
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, pp. 17–26 (visor) — sección: Flags TCP/ECN
- RFC 3168 — ECN — §6.1.2 — https://www.rfc-editor.org/rfc/rfc3168.html

---

## Pregunta 111 — PROVISIONAL — confianza MEDIA

**ID:** `q-a9917d13b3303eecbf7bae092de767f6a7801211b09904df0f54dae5916de9e9`

**Enunciado literal:**

> En un gateway que aplica PAT y filtrado con estado, ¿qué efecto podría observarse al aumentar mucho la cantidad de conexiones simultáneas?

**Candidata provisional (sin puntuar en el DOCX):** Puede aumentar el consumo de CPU y memoria por las traducciones, el filtrado y el seguimiento de conexiones

**Análisis:** Más conexiones aumentan potencialmente las entradas PAT/stateful y el uso de memoria/CPU; inferencia sin métrica cuantitativa local.

**Observaciones:** Efecto razonable inferido; la fuente no cuantifica recursos por conexión.

**Alternativas aún defendibles o por revisar:**
- 1: Puede aumentar el consumo de CPU y memoria por las traducciones, el filtrado y el seguimiento de conexiones — correct. Correcta como efecto posible de tablas mayores.

**Fuentes consultadas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, pp. 4–13 (visor) — sección: PAT y mapeos
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, pp. 30–31 (visor) — sección: Firewall con estado

---

## Pregunta 117 — PROVISIONAL — confianza MEDIA

**ID:** `q-89e1ab54fbea82abb3b84653fd80a12c926799de3f2713736ff55fcca4898e14`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿A qué dispositivo pertenece la tabla de enrutamiento?

**Candidata provisional (sin puntuar en el DOCX):** Router2

**Análisis:** La topología y las interfaces .20, .40, .60 y .70 identifican la tabla de Router2; la tabla es reconstruida.

**Observaciones:** Tabla reconstruida; q119 muestra una duplicidad inconsistente.

**Alternativas aún defendibles o por revisar:**
- 1: Router2 — correct. Correcta bajo la topología observada.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-42a2abb1e63652c10014ce21.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: Rutas conectadas y locales

---

## Pregunta 118 — PROVISIONAL — confianza MEDIA

**ID:** `q-54e01ccad9675aa4eee19d381856ed2fbfbfdccc61f8f28b0d454f19afadeaa0`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.30.0/24?

**Candidata provisional (sin puntuar en el DOCX):** Mediante el protocolo RIP

**Análisis:** La red .30 aparece marcada R, es decir, RIP.

**Observaciones:** Tabla reconstruida, cotejada visualmente.

**Alternativas aún defendibles o por revisar:**
- 2: Mediante el protocolo RIP — correct. Correcta: R = RIP.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-42a2abb1e63652c10014ce21.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: Código RIP

---

## Pregunta 119 — AMBIGUA — confianza BAJA

**ID:** `q-d464c1c8de0b704fc84ce85c760f824c1abb241eb352cb0420a8ef64dd2b4a43`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.70.0/24?

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** La reconstrucción muestra .70/24 como R vía .20.2 y también C conectada por Serial0/1/1. Una misma tabla no debería instalar ambos caminos al mismo prefijo; C tiene preferencia frente a RIP. No puede determinarse la clave pretendida.

**Observaciones:** La tabla reconstruida contiene simultáneamente R y C para 192.168.70.0/24.
**Problemas registrados:** No se asigna clave hasta corregir/verificar la tabla fuente.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-42a2abb1e63652c10014ce21.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: Códigos C y R

---

## Pregunta 120 — PROVISIONAL — confianza MEDIA

**ID:** `q-c469b1a3f9e57c4a9c86b46c65b5629fd32d92bce919e6768084f495359ed717`

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Qué indica el valor 1 en la notación [120/1]?

**Candidata provisional (sin puntuar en el DOCX):** La métrica de RIP: la cantidad de saltos hasta la red destino

**Análisis:** El segundo valor de [120/1] es métrica RIP; 1 significa un salto.

**Observaciones:** Dato leído en tabla reconstruida.

**Alternativas aún defendibles o por revisar:**
- 3: La métrica de RIP: la cantidad de saltos hasta la red destino — correct. Correcta: métrica en saltos.

**Fuentes consultadas:**
- Imagen del cuestionario: assets/image-42a2abb1e63652c10014ce21.png
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, pp. 8–9 (visor) — sección: AD y métrica RIP

---

## Pregunta 122 — PROVISIONAL — confianza MEDIA

**ID:** `q-b379f7cd8f4a541cd21dd1899658e3338f8f79484593b0bb27426232414d579e`

**Enunciado literal:**

> ¿Qué comando consulta cualquier tipo de registro que tenga asociado el dominio miempresa.com.ar?

**Candidata provisional (sin puntuar en el DOCX):** nslookup -type=ANY miempresa.com.ar

**Análisis:** El comando envía QTYPE=ANY. No garantiza recibir todos los RRsets: servidores actuales pueden responder de forma mínima o no responder según política.

**Observaciones:** “Consulta cualquier tipo” se interpreta como enviar QTYPE=ANY, no como obtener todos los tipos existentes.

**Alternativas aún defendibles o por revisar:**
- 3: nslookup -type=ANY miempresa.com.ar — correct. Correcta: `-type=ANY` formula esa consulta, sin garantizar respuesta exhaustiva.

**Fuentes consultadas:**
- 3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf, pp. 20–21 (visor) — sección: Consulta nslookup por tipo
- RFC 8482 — Minimal Responses for DNS Queries with QTYPE=ANY — §§1–2 — https://www.rfc-editor.org/rfc/rfc8482.html

---

## Pregunta 123 — PROVISIONAL — confianza MEDIA

**ID:** `q-6a366dfa2883a2bcfac9476fd14d2e31d38ee7cc6bad1937114471647d83c3f9`

**Enunciado literal:**

> Ana le envía a Juan CJ(CA(P)), donde CA es la clave privada de Ana y CJ la clave pública de Juan. ¿Qué aporta cada capa y cómo recupera Juan el texto?

**Candidata provisional (sin puntuar en el DOCX):** La interna (privada de Ana) da autenticación y no repudio, y la externa (pública de Juan) confidencialidad. Juan descifra con su privada y luego con la pública de Ana

**Análisis:** La capa interna firma con la privada de Ana (autenticación/integridad/no repudio); la externa cifra con la pública de Juan (confidencialidad). Juan quita la capa exterior con su privada y verifica con la pública de Ana.

**Observaciones:** Modelo simbólico RSA didáctico; la verificación moderna de firma es una operación específica, no descifrado general.

**Alternativas aún defendibles o por revisar:**
- 4: La interna (privada de Ana) da autenticación y no repudio, y la externa (pública de Juan) confidencialidad. Juan descifra con su privada y luego con la pública de Ana — correct. Correcta en el esquema didáctico; “verifica”, no necesariamente descifra genéricamente la firma.

**Fuentes consultadas:**
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, pp. 19–22 (visor) — sección: Firma y cifrado asimétrico

---

## Pregunta 127 — AMBIGUA — confianza MEDIA

**ID:** `q-96f1748132d556ec2f1315a373676a5e53a184be89347f30dab24877f53ccd79`

**Enunciado literal:**

> Una sucursal envía órdenes de pago a casa central por un enlace cifrado. Un atacante no puede leerlas, pero modifica algunos bits y casa central procesa datos distintos. ¿Qué tipo de amenaza ocurrió y qué faltó?

**Clave:** no se confirma una respuesta única con la evidencia disponible.

**Análisis:** El ataque es modificación/integridad, pero cifrado sin autenticación y hash simple no bastan frente a atacante activo que puede recalcularlo. Hace falta MAC/HMAC, firma o AEAD; ninguna opción lo especifica.

**Observaciones:** Opción 1 parece esperada por la filmina, pero no alcanza para modificar datos maliciosamente y recalcular un hash simple.
**Problemas registrados:** No se asigna clave suficiente; falta MAC/firma/AEAD.

**Alternativas aún defendibles o por revisar:**
- 1: Modificación, ataca la integridad. El cifrado solo da confidencialidad y faltaba un hash para detectar la alteración — ambiguous. Categoría de ataque correcta, pero hash sin autenticación puede recalcularse; opción incompleta.

**Fuentes consultadas:**
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, pp. 16–17 (visor) — sección: Integridad y hash
- RFC 5116 — Authenticated Encryption — §1, Introduction — https://www.rfc-editor.org/rfc/rfc5116.html

---
