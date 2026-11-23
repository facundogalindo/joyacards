# Auditoría individual de las 585 justificaciones — V3

## Alcance y conteo

Se leyeron individualmente las 585 explicaciones asociadas a alternativas en `preguntas-resueltas-v2.json`: en cada pregunta se cotejaron enunciado, alternativas, veredicto y explicación de cada opción. También se revisaron las 132 justificaciones generales y las fuentes vinculadas a los casos con discrepancias, a las seis OJO y a las imprecisiones técnicas señaladas abajo.

- **Justificaciones por alternativa auditadas:** 585.
- **Sin cambios:** 575 de 585.
- **Justificaciones por alternativa corregidas:** 10 de 585.
- **Justificaciones generales corregidas:** 1 (q119; fuera del conteo de 585).
- **Campos de justificación modificados en total:** 11.
- **Claves verificadas modificadas:** 0. Las 123 claves y los 3 estados PROVISIONAL/6 AMBIGUA no se promovieron ni degradaron en V3.
- **Bibliografía no respaldante detectada:** no se halló una cita asignada a una alternativa distinta en los diez cambios; las discrepancias descritas son de asociación, omisión de evidencia o precisión. Las fuentes restantes conservan la referencia de V2 y se cotejaron con el tema/página declarados.

Las 585 explicaciones se cotejaron contra la alternativa a la que pertenecen. Las fuentes locales se reabrieron en los casos corregidos y los estándares primarios se consultaron para los conceptos que requieren precisión. No se utilizaron claves del sitio como autoridad académica.

## Cambios puntuales

### Pregunta 10 — `q-5bc77dc7d963f7cb49f73471465ffb9d2496b296da1aaccc7f2cd2408d68a916`

**Alternativa:** Por enrutamiento dinámico RIP

**Justificación anterior:** No se marca con S ni aparece como ruta estática.

**Problema:** La explicación hablaba de S/ruta estática, aunque el texto es un distractor RIP. La ruta mostrada es C. [1, 9]

**Justificación nueva:** RIP se identifica con el código R; la línea de 192.168.50.0/24 muestra C, que significa conectada directamente.

**Fuente:** `2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf`, visor pp. 8–9; Cisco IOS `show ip route` route codes and default administrative distance (C/connected, S/static, R/RIP; connected AD 0, RIP AD 120).

---

### Pregunta 10 — `q-5bc77dc7d963f7cb49f73471465ffb9d2496b296da1aaccc7f2cd2408d68a916`

**Alternativa:** Por enrutamiento estático

**Justificación anterior:** Una ruta RIP aparecería con código R; la línea de .50 está marcada C.

**Problema:** La explicación anterior justificaba un distractor RIP, no uno estático. [1, 9]

**Justificación nueva:** Una ruta estática se identifica con el código S; la línea de 192.168.50.0/24 muestra C, no S.

**Fuente:** `2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf`, visor pp. 8–9; Cisco IOS `show ip route` route codes and default administrative distance (C/connected, S/static, R/RIP; connected AD 0, RIP AD 120).

---

### Pregunta 24 — `q-c7d3c998eb84a2e8c63699a4de4a6a3bdae3914076971d2b8f373e46c8f5ba97`

**Alternativa:** Será bloqueada por la política implementada en el firewall

**Justificación anterior:** El flujo no coincide con la regla de bloqueo de Telnet al destino RED.

**Problema:** La explicación no terminaba el razonamiento: además de no coincidir con Telnet, la política por defecto permite el flujo. La clave no cambia. [14]

**Justificación nueva:** La regla de Telnet/TCP 23 no aplica a SSH/TCP 22; no coincide otra regla y la política por defecto permite este flujo.

**Fuente:** `assets/image-4d11058301d9e14f5dd7d5e5.png` (lectura visual de origen/destino/protocolo/orden y código de acción) y `Lectura de reglas del firewall IPFire.pdf`, visor pp. 2–4 (verde=ACCEPT, rojo=DROP, negro=REJECT; primera regla coincidente termina la evaluación; la política solo cubre el tráfico no decidido).

---

### Pregunta 25 — `q-294ef613a28d817241c07cc97c6b3dbbfd1a8165cb637113206ee88c57d87cd2`

**Alternativa:** El ping será exitoso por la política

**Justificación anterior:** La regla 5 es TCP a Telnet y no aplica a ICMP.

**Problema:** La razón anterior solo descartaba una regla irrelevante y omitía la coincidencia que hace falsa la alternativa. [15, 16]

**Justificación nueva:** La regla 3 coincide antes: es ICMP desde 192.168.50.102 hacia 172.16.170.33 y lo descarta. La política por defecto no se evalúa después de esa coincidencia.

**Fuente:** `assets/image-4d11058301d9e14f5dd7d5e5.png` (lectura visual de origen/destino/protocolo/orden y código de acción) y `Lectura de reglas del firewall IPFire.pdf`, visor pp. 2–4 (verde=ACCEPT, rojo=DROP, negro=REJECT; primera regla coincidente termina la evaluación; la política solo cubre el tráfico no decidido).

---

### Pregunta 26 — `q-112b2a2e0ecdac1f974abb399af42b3c64c07a4fdf7ac81b0b7edf744726ddfa`

**Alternativa:** El ping será bloqueado por la política

**Justificación anterior:** La política inferior dice permitido para Green hacia Internet, pero no resuelve la acción explícita de esta coincidencia al destino ROJO.

**Problema:** La alternativa contradice una regla explícita ACCEPT; la explicación anterior confundía la política por defecto con una coincidencia de regla. [15, 16]

**Justificación nueva:** No: el origen 192.168.50.20 no coincide con la regla 3; la regla 4 sí coincide con ICMP Green→172.16.170.33 y lo acepta antes de que intervenga la política por defecto.

**Fuente:** `assets/image-4d11058301d9e14f5dd7d5e5.png` (lectura visual de origen/destino/protocolo/orden y código de acción) y `Lectura de reglas del firewall IPFire.pdf`, visor pp. 2–4 (verde=ACCEPT, rojo=DROP, negro=REJECT; primera regla coincidente termina la evaluación; la política solo cubre el tráfico no decidido).

---

### Pregunta 112 — `q-4d20ded7b250b2a6298d24f2002b472dcc82e4dc75becdd9b897830aa06d90c8`

**Alternativa:** Dar control y retroalimentación sobre la calidad y contribuir a sincronizar los flujos multimedia

**Justificación anterior:** Códecs se negocian por señalización, no RTCP.

**Problema:** La razón anterior explicaba otro concepto y no justificaba la función expresada por la alternativa. [17, 18]

**Justificación nueva:** RTCP aporta informes de recepción y control/sincronización asociados al flujo; no es el componente que negocia los códecs.

**Fuente:** `3 - 05 - RDD - Unidad 5 - Voz IP.pdf`, visor pp. 14–15; RFC 3550, §§6.1 y 6.4 para reportes RTCP y sincronización. RTP lleva medios; H.245 negocia capacidades en el esquema H.323 de la filmina.

---

### Pregunta 112 — `q-4d20ded7b250b2a6298d24f2002b472dcc82e4dc75becdd9b897830aa06d90c8`

**Alternativa:** Negociar los códecs y capacidades de las terminales

**Justificación anterior:** RTP lleva medios.

**Problema:** La razón anterior explicaba RTP, no la alternativa sobre negociación; la filmina asigna esta negociación a H.245. [17]

**Justificación nueva:** La negociación de códecs corresponde a la señalización de sesión (en H.323, H.245), no a RTCP.

**Fuente:** `3 - 05 - RDD - Unidad 5 - Voz IP.pdf`, visor pp. 14–15; RFC 3550, §§6.1 y 6.4 para reportes RTCP y sincronización. RTP lleva medios; H.245 negocia capacidades en el esquema H.323 de la filmina.

---

### Pregunta 112 — `q-4d20ded7b250b2a6298d24f2002b472dcc82e4dc75becdd9b897830aa06d90c8`

**Alternativa:** Transportar las muestras de audio y video

**Justificación anterior:** Correcta: RTCP es control/calidad/sincronización.

**Problema:** La razón anterior describía RTCP como correcto, aunque la alternativa propone transportar los medios. [17, 18]

**Justificación nueva:** RTCP no transporta las muestras de audio o video; RTP lleva los medios y RTCP intercambia reportes de control.

**Fuente:** `3 - 05 - RDD - Unidad 5 - Voz IP.pdf`, visor pp. 14–15; RFC 3550, §§6.1 y 6.4 para reportes RTCP y sincronización. RTP lleva medios; H.245 negocia capacidades en el esquema H.323 de la filmina.

---

### Pregunta 119 — justificación general (corrección visual)

**ID:** `q-d464c1c8de0b704fc84ce85c760f824c1abb241eb352cb0420a8ef64dd2b4a43`.

**Justificación anterior:** La tabla se describía como si contuviera simultáneamente ruta R y C para `192.168.70.0/24`.

**Problema:** [Corrección de auditoría V3] En el recurso visual actual no se confirma el conflicto R/C previamente atribuido a 192.168.70.0/24: la fila legible es C y la fila local es L 192.168.70.1/32. No se identifica una ruta R para .70. La procedencia mejorada con IA y las alternativas reconstruidas impiden concluir que ese sea el escenario original; se mantiene AMBIGUA y sin clave.

**Justificación nueva:** La imagen asociada al cuestionario muestra 192.168.70.0/24 como ruta C directamente conectada por Serial0/1/1 y 192.168.70.1/32 como ruta local L; no se observa una entrada R para ese prefijo. La ruta R visible cercana corresponde a otro destino y puede confundirse al transcribirla. No obstante, la nota de extracción indica que las opciones se reconstruyeron y que la imagen fue mejorada con IA. Sin una fotografía original independiente o las opciones originales, solo puede describirse lo que muestra esta reconstrucción; la pregunta histórica permanece sin clave y sin puntuación.

**Fuente:** `assets/image-42a2abb1e63652c10014ce21.png`, ampliada visualmente; Cisco IOS command reference para códigos C/R y AD conectada/RIP; nota de extracción que indica alternativas reconstruidas e imagen mejorada con IA.

La pregunta continúa AMBIGUA y sin clave. La imagen actual respalda C y L para .70; no se promovió la opción «directamente conectada» sin foto original y opciones originales.

## Explicaciones conservadas y errores conceptuales detectados

### Resultado de la pasada por las 585 alternativas

Las otras 575 explicaciones por alternativa no presentaron un intercambio claro de opción o una contradicción demostrable con el escenario descrito. Se conservaron para evitar cambios editoriales de preferencia. Las justificaciones generales no corregidas se mantienen sin reescritura.

### Imprecisiones o decisiones que requieren revisión humana

- **Q3 — RFC 1918, clave preservada:** la alternativa habla de «los routers del backbone descartan» paquetes privados. RFC 1918 §3 es más preciso: los paquetes con origen/destino privado no deberían reenviarse a través de enlaces interempresariales y los ISP deberían filtrar anuncios de rutas privadas. La opción es una simplificación operativa, no una afirmación universal sobre todo router. No se cambió la clave.
- **Q23 — NAT estática para servidor accesible desde sucursal, clave preservada:** el mapeo fijo puede publicar el servidor, pero conectar sucursales suele resolverse mediante routing/VPN según el escenario. La explicación de V2 ya incluye esta salvedad; falta contexto para afirmar que static NAT sea siempre la opción conveniente.
- **Q46 — IMAP, clave preservada:** la filmina local p. 34 afirma literalmente que el mensaje se descarga solo cuando se lee; esa es la simplificación de cátedra que respalda la clave. RFC 9051 §6.4.5 permite FETCH del mensaje completo o partes, a solicitud del cliente, y no impone que la descarga ocurra únicamente al abrirlo. La respuesta es cátedra-compatible, pero no una regla universal del protocolo.
- **Q69 — FIN, clave preservada:** la alternativa habla de finalizar la conexión/socket; TCP FIN cierra la mitad emisora del flujo y los extremos pueden cerrar de forma independiente. La justificación general de V2 limita correctamente el alcance; conviene mantener esa precisión.
- **Q108 — PSH/CWR, clave preservada:** la respuesta sigue la terminología docente; PSH pide un push, no asegura una entrega instantánea por decisión local. CWR comunica que el emisor reaccionó a ECN; no expresa una tasa numérica.
- **Q123 — firma digital, clave preservada:** la alternativa usa «descifrar con la clave pública» como esquema didáctico. La justificación general aclara que, en los algoritmos modernos, la operación se denomina verificar la firma.
- **Preguntas con diagramas reconstruidos:** las claves que dependen de reglas o topologías se conservan para el escenario visible; la fidelidad histórica no queda demostrada si el recurso se recreó o mejoró.

Estos puntos no alteran claves, puntuación ni alternativas en V3. Se consignan para una conversación académica posterior.

## Fuentes consultadas para los cambios y salvedades

- `2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf`, visor pp. 8–9; Cisco IOS route-code/administrative-distance reference: https://www.cisco.com/c/en/us/td/docs/ios/iproute_pi/command/reference/iri_book/iri_pi1.html y `iri_pi2.html`.
- `Lectura de reglas del firewall IPFire.pdf`, visor pp. 2–4; recurso `assets/image-4d11058301d9e14f5dd7d5e5.png`.
- `3 - 05 - RDD - Unidad 5 - Voz IP.pdf`, visor pp. 14–15; RFC 3550: https://www.rfc-editor.org/rfc/rfc3550.html.
- RFC 1918, §3: https://www.rfc-editor.org/rfc/rfc1918.html.
- `3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf`, visor pp. 33–34; RFC 9051, §6.4.5: https://www.rfc-editor.org/rfc/rfc9051.html.
- RFC 9293, §3.6.1 (half-closed connections): https://www.rfc-editor.org/rfc/rfc9293.html.
