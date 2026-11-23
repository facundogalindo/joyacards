# Auditoría independiente de las 40 preguntas pendientes — Iteración 4

## Alcance y criterio

Se revisaron individualmente las 40 posiciones que en preguntas-resueltas.json estaban PROVISIONAL o AMBIGUA. preguntas-sin-resolver.json fija IDs, enunciados, opciones, orden, tipos e imágenes; la resolución previa se trató como hipótesis. No se consultaron claves de la página del test ni selecciones marcadas por estudiantes.

Se exploró recursivamente F:\Facundo - Facultad\4to año\REDES buscando filminas, guías, resúmenes, libro, TPs, ZIP, capturas y fotografías. Se revisaron las filminas de Routing, Transporte, Aplicación, NAT/PAT y Seguridad; la guía IPFire; actividades de routing/NAT; Fotos del parcial.zip (48 entradas), TPs.zip (14 entradas), filminas.zip, el archivo de chat (101 entradas) y los recursos visuales del repositorio. No apareció fotografía independiente del examen 4K1 que valide las reconstrucciones. Fotos del parcial.zip contiene capturas de interfaz del cuestionario; selecciones de alumnos no se usaron. TPs y filminas explican conceptos pero no reproducen de manera verificable estos escenarios. La filmina de Seguridad disponible es de 2024; no se halló una edición 2026 en el material revisado.

La fidelidad al escenario mostrado y la fidelidad histórica al examen se registran por separado. Una clave se promueve solo si es defendible con el texto, alternativas y datos visibles del banco. Las imágenes reconstruidas no certifican fidelidad histórica. Las nueve preguntas restantes no tienen clave final ni puntuación.

## Resultado agregado

| Estado | Antes | Después |
|---|---:|---:|
| VERIFICADA | 92 | 123 |
| PROVISIONAL | 32 | 3 |
| AMBIGUA | 8 | 6 |
| Sin clave puntuable | 40 | 9 |
| Alternativas | 585 | 585 |

Promovidas individualmente (31): 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 25, 26, 42, 43, 54, 55, 57, 72, 73, 74, 75, 108, 111, 117, 118, 120, 122, 123. Permanecen provisionales: 41, 66, 67. Permanecen ambiguas: 37, 60, 79, 83, 119, 127. Las 92 resoluciones anteriormente VERIFICADAS son idénticas al JSON de referencia. Los campos de extracción de las 132 preguntas no cambiaron.

## Cotejo visual de tablas y capturas

Las notas transcriben lo legible en el recurso asociado a cada pregunta. Verifican el escenario que presenta el cuestionario, no la autenticidad histórica de una reconstrucción.

### Routing — preguntas 9–13 y 72–75

En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

### Routing — preguntas 117–120

En image-42a2abb1e63652c10014ce21.png se lee R 192.168.30.0/24 por 192.168.20.1 y 192.168.70.2; las redes C incluyen 192.168.20.0/24, 40.0/24, 60.0/24, 70.0/24 y 80.0/24, con rutas locales L de interfaz, incluida 192.168.70.1/32 en Serial0/1/1. La fila R y la C para 192.168.70.0/24 coexisten en la reconstrucción y hacen que q119 no tenga una resolución segura; no se deduce qué fila fue transcrita mal.

### NAT/PAT — preguntas 16–22

La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

### Firewall — preguntas 25–26

En image-4d11058301d9e14f5dd7d5e5.png la regla 3 ICMP desde 192.168.50.102 a 172.16.170.33 tiene indicador rojo; la regla 4 ICMP desde Green tiene indicador verde. La guía IPFire local identifica rojo como DROP y verde como ACCEPT; prevalece la primera regla coincidente. q25 coincide con regla 3 y se bloquea; q26 llega a regla 4 y se acepta. Esto describe la imagen visible, no una foto histórica independiente.

### Firewall — preguntas 41–43

En image-45e7d914a71370868ac4d5ad.png las reglas 3 y 4 tienen indicadores verdes y la regla 5 rojo; la fila 2 HTTPS aparece gris. La guía local define verde, rojo y negro, no gris. Por eso q42 y q43 se resuelven por reglas verde/roja que coinciden; q41 queda provisional porque no se conoce la acción de la fila HTTPS gris.

### Netstat y TCP

image-43a7851536808316264f8bea.png lista TCP 0.0.0.0:9999 LISTEN, TCP 0.0.0.0:23 LISTEN y UDP 0.0.0.0:53. Los puertos 23 y 53 son convencionales para Telnet y DNS, pero la captura no identifica procesos ni asegura qué aplicación corre; la opción única queda ambigua.

image-2ce63dd5cad3d702e14de445.png lista TCP 0.0.0.0:22, :443 y :8080, todos en LISTEN. 22 suele asociarse a SSH y 443 a HTTPS; el estado del socket no identifica el proceso ni demuestra que use el servicio convencional. Hay más de una opción plausible.

image-55e91291c9b4c2c62ca9ed43.png muestra origen TCP 443 y destino efímero 52086 de la PC; flags SYN+ACK, segmento de longitud 0, window 65535 y opciones MSS/Window Scale. No aparece el ACK final de la PC, así que no prueba un handshake completado. Solo la afirmación sobre MSS/escalado (opción d) es inequívoca, mientras el ítem pide dos y la alternativa de aceptación depende de una simplificación docente; no se marca clave.

### PAT — preguntas 54–55 y 66–67

image-ab56179d8357f41aeba62aff.png presenta PC1 192.168.1.101 y PC2 192.168.1.102, ambos con puerto origen 48200; router PAT público 203.0.113.5; servidor 198.51.100.10:80. Para diferenciar flujos simultáneos, el escenario asigna un puerto público distinto a PC2 (48201).

image-2c8bbd2ccf3db927605682c5.png identifica PC1 192.168.1.101, PC2 192.168.1.102, interfaz interna del router 192.168.1.1, pública 200.40.20.1 y servidor 152.0.10.5. No indica si es HTTP/80 o HTTPS/443; “servidor web” no fija el puerto.

## Revisión individual

### Pregunta 9 — PROVISIONAL → VERIFICADA

**ID:** `q-b4f6558008f4dfa586fb09893bc179edb92ed42f305e65e7be77c65e2cab2b28`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Tabla y topología leídas en la imagen descargada desde el cuestionario. AUDITORIA_EXTRACCION.md señala que la topología fue mejorada; no hay fotografía del examen que la valide.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿A qué dispositivo pertenece la tabla de enrutamiento?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — Router3.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Router2 | INCORRECTA | Router2 conecta .20/.40/.70, no la red .50 que identifica la LAN de Router3. |
| 2 | Router3 **(clave puntuable)** | CORRECTA | Correcta: .50 está conectada a Router3 y la tabla registra su interfaz LAN, junto con sus enlaces hacia Router1/Router2. |
| 3 | Router1 | INCORRECTA | Router1 conecta la LAN .10 y los enlaces .20/.30, no la LAN .50. |

**Fundamento general registrado:**

[Respuesta] La tabla pertenece a Router3: la topología muestra que conecta las redes .30, .50 y .70; la tabla incluye esas redes como conectadas y rutas hacia las demás. [Procedencia] Los valores se leen en el diagrama presentado. La auditoría de extracción identifica esta topología como mejorada; la fidelidad al examen original no está acreditada.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-fb74a0786354509729acea92.png` — SHA-256 `fb74a0786354509729acea92b1737ee1378f992b5b512b7bd9ac4e76d8d2ec16`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — RIP; distancia administrativa. RIP usa distancia administrativa 120 y métrica de saltos; compara confiabilidad de protocolos.
- Imagen del cuestionario `assets/image-fb74a0786354509729acea92.png`. La topología y la tabla de rutas de práctica usadas en las preguntas 9–13; la nota de extracción indica que fue mejorada con IA.

---

### Pregunta 10 — PROVISIONAL → VERIFICADA

**ID:** `q-5bc77dc7d963f7cb49f73471465ffb9d2496b296da1aaccc7f2cd2408d68a916`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.50.0/24?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — Porque se encuentra directamente conectada al equipo.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Por loopback | INCORRECTA | Loopback se representa como una interfaz lógica local; no es la entrada C para la LAN .50 mostrada. |
| 2 | Por enrutamiento dinámico RIP | INCORRECTA | No se marca con S ni aparece como ruta estática. |
| 3 | Porque se encuentra directamente conectada al equipo **(clave puntuable)** | CORRECTA | Correcta: la entrada C indica red directamente conectada. |
| 4 | Por enrutamiento estático | INCORRECTA | Una ruta RIP aparecería con código R; la línea de .50 está marcada C. |
| 5 | Por enrutamiento dinámico OSPF | INCORRECTA | Una ruta OSPF aparecería con código O; la línea de .50 está marcada C. |

**Fundamento general registrado:**

[Respuesta] La ruta 192.168.50.0/24 aparece con código C y la frase is directly connected: está conectada directamente a una interfaz del router. [Procedencia] Verificada para la tabla mostrada; el gráfico fue mejorado y no se cotejó con una foto del examen.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-fb74a0786354509729acea92.png` — SHA-256 `fb74a0786354509729acea92b1737ee1378f992b5b512b7bd9ac4e76d8d2ec16`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — RIP; distancia administrativa. RIP usa distancia administrativa 120 y métrica de saltos; compara confiabilidad de protocolos.
- Imagen del cuestionario `assets/image-fb74a0786354509729acea92.png`. La topología y la tabla de rutas de práctica usadas en las preguntas 9–13; la nota de extracción indica que fue mejorada con IA.

---

### Pregunta 11 — PROVISIONAL → VERIFICADA

**ID:** `q-3238984be8eaf2ef50f7f0ba153bd7c326f88ff5d81a847681ff69f2477a1a35`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.10.0/24?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 5 — Por enrutamiento dinámico RIP.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Por loopback | INCORRECTA | Loopback no explica una ruta R hacia la LAN .10. |
| 2 | Por enrutamiento estático | INCORRECTA | Una ruta estática no lleva el código R de RIP. |
| 3 | Porque se encuentra directamente conectada al equipo | INCORRECTA | No es una red conectada a este router: la tabla la marca R y muestra via. |
| 4 | Por enrutamiento dinámico OSPF | INCORRECTA | La imagen no muestra código O para esa ruta; OSPF tiene AD 110 en la tabla docente. |
| 5 | Por enrutamiento dinámico RIP **(clave puntuable)** | CORRECTA | Correcta: código R indica RIP; 120/1 es consistente con una ruta RIP de un salto. |

**Fundamento general registrado:**

[Respuesta] La ruta 192.168.10.0/24 aparece con código R y un siguiente salto, por lo que la tabla la identifica como aprendida por RIP. [Fundamento] Las filminas de la cátedra describen RIP y su distancia administrativa 120. [Procedencia] Verificada para la tabla mostrada; no acredita fidelidad histórica del gráfico.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-fb74a0786354509729acea92.png` — SHA-256 `fb74a0786354509729acea92b1737ee1378f992b5b512b7bd9ac4e76d8d2ec16`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — RIP; distancia administrativa. RIP usa distancia administrativa 120 y métrica de saltos; compara confiabilidad de protocolos.
- Imagen del cuestionario `assets/image-fb74a0786354509729acea92.png`. La topología y la tabla de rutas de práctica usadas en las preguntas 9–13; la nota de extracción indica que fue mejorada con IA.

---

### Pregunta 12 — PROVISIONAL → VERIFICADA

**ID:** `q-449de4d71d5958146d9e2ec0de5eb04efe00c33cd15b6d1e79e6b1128984cdfa`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. Para llegar a la red 192.168.40.0/24, ¿a qué router le pasa el paquete?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Router2 (192.168.70.1).
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Router2 (192.168.70.1) **(clave puntuable)** | CORRECTA | 192.168.70.1 pertenece a Router2, no a un destino conectado directamente. |
| 2 | A ninguno, está conectada | INCORRECTA | La red .40 no aparece como C en la tabla; está aprendida y tiene próximo salto. |
| 3 | Router1 (192.168.30.1) | INCORRECTA | 192.168.30.1 es el siguiente salto de otras entradas, no de la ruta a .40 mostrada. |

**Fundamento general registrado:**

[Respuesta] Para 192.168.40.0/24 la tabla muestra via 192.168.70.1. En el enlace .70, la propia tabla identifica al router local como .70.2; la topología muestra a Router2 como el vecino de ese enlace, por lo que .70.1 es el próximo salto hacia Router2. [Procedencia] Verificada para el gráfico y la tabla presentados; no cotejados con foto del examen.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-fb74a0786354509729acea92.png` — SHA-256 `fb74a0786354509729acea92b1737ee1378f992b5b512b7bd9ac4e76d8d2ec16`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — RIP; distancia administrativa. RIP usa distancia administrativa 120 y métrica de saltos; compara confiabilidad de protocolos.
- Imagen del cuestionario `assets/image-fb74a0786354509729acea92.png`. La topología y la tabla de rutas de práctica usadas en las preguntas 9–13; la nota de extracción indica que fue mejorada con IA.

---

### Pregunta 13 — PROVISIONAL → VERIFICADA

**ID:** `q-818f4bfaa4b32d14d8966ec2a374ab1978b5ee4b5f523bc06d65fac50120ddcb`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. La red 192.168.20.0/24 aparece con dos líneas «via». ¿Por qué?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Porque hay dos caminos de igual costo (1 salto): por Router1 y por Router2.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Porque hay dos caminos de igual costo (1 salto): por Router1 y por Router2 **(clave puntuable)** | CORRECTA | Correcta: dos entradas con métrica igual por Router1 y Router2 son rutas RIP de igual costo. |
| 2 | Porque la red 20.0 está conectada directamente a Router3 | INCORRECTA | La tabla muestra rutas R con próximos saltos, no una entrada C directamente conectada. |
| 3 | Porque una ruta es RIP y la otra OSPF | INCORRECTA | No se muestra una ruta OSPF alternativa; ambas líneas usan la forma RIP [120/1]. |
| 4 | Porque una de las rutas está caída y la otra es de respaldo | INCORRECTA | No se marca una ruta caída/de respaldo: ambas entradas aparecen instaladas con métrica equivalente. |

**Fundamento general registrado:**

[Respuesta] La tabla presenta dos rutas RIP a 192.168.20.0/24 con la misma distancia y métrica [120/1], una vía Router1 y otra vía Router2. Son rutas de igual costo según la topología. [Procedencia] Valores verificados en la reconstrucción; fidelidad al examen original no establecida.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-fb74a0786354509729acea92.png` — SHA-256 `fb74a0786354509729acea92b1737ee1378f992b5b512b7bd9ac4e76d8d2ec16`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — RIP; distancia administrativa. RIP usa distancia administrativa 120 y métrica de saltos; compara confiabilidad de protocolos.
- Imagen del cuestionario `assets/image-fb74a0786354509729acea92.png`. La topología y la tabla de rutas de práctica usadas en las preguntas 9–13; la nota de extracción indica que fue mejorada con IA.

---

### Pregunta 14 — PROVISIONAL → VERIFICADA

**ID:** `q-a576a047f711f3e475ec759164477625bf8224d838cc457068208f5a32fdcf42`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> La máquina A envía datos a la máquina B a 8 Mbps, tasa determinada por su ventana de congestión. En un ACK, B informa una ventana de recepción de 6000 bytes. ¿Qué hará A?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Reducirá la transmisión hacia B a 6000 bytes.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Reducirá la transmisión hacia B a 6000 bytes **(clave puntuable)** | CORRECTA | Es la única alternativa que reconoce el límite anunciado de recepción; con precisión, limita bytes pendientes de ACK, no la tasa instantánea ni obliga a llenar toda la ventana. |
| 2 | Detendrá la transmisión porque el búfer de B está lleno | INCORRECTA | Una ventana anunciada de 6000 no implica que el búfer esté lleno; el cero es el caso que detiene temporalmente el envío. |
| 3 | Seguirá a 8 Mbps hasta que B informe ventana 0 | INCORRECTA | El emisor no puede ignorar una ventana de recepción positiva; debe combinarla con la ventana de congestión. |
| 4 | Seguirá a 8 Mbps porque eso indica la ventana de congestión | INCORRECTA | 6000 bytes describe la ventana de recepción, no la ventana de congestión ni una orden de mantener 8 Mbps. |

**Fundamento general registrado:**

[Respuesta] La ventana anunciada por B limita los datos que pueden permanecer sin confirmación. Si la ventana de congestión lo permite, A no puede mantener más de 6000 bytes pendientes de ACK. [Precisión] 6000 es un límite de bytes en vuelo, no una tasa de 6000 bytes/s ni una orden de enviar exactamente ese volumen; el emisor combina la ventana anunciada con su ventana de congestión.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Fuentes específicas:**
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 8–28 — TCP/UDP; cabecera, control de flujo, banderas y conexiones. Fiabilidad, entrega ordenada, puertos y sockets, seq/ACK, flags, ventanas, establecimiento/liberación, opciones TCP y servicio UDP.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 21–27 — Ventana de recepción y ventana de congestión. La ventana anunciada limita bytes pendientes de asentimiento; la ventana de congestión limita bytes en la red.
- RFC 9293 — Transmission Control Protocol, §3.8.6 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc9293.html)). La ventana del receptor indica el rango que acepta; la emisión debe ajustarse a la ventana vigente.

---

### Pregunta 16 — PROVISIONAL → VERIFICADA

**ID:** `q-803c881e8e578cb106e2afe3198e57979ccde49e6b7e39e4b0a158afb2b85700`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63241. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué equipo es el destinatario?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Sala-07.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Sala-07 **(clave puntuable)** | CORRECTA | Correcta: la entrada pública :63241 se traduce al host privado 172.20.35.57, Sala-07. |
| 2 | Sala-04 | INCORRECTA | La fila de Sala-04 utiliza puerto público 63242, no 63241. |

**Fundamento general registrado:**

[Respuesta] En la tabla PAT, el puerto externo TCP 63241 traduce la respuesta a la dirección interna 172.20.35.57, Sala-07. El paquete entrante se entrega a ese equipo.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-77d62ab302bace2d878c00c2.png` — SHA-256 `77d62ab302bace2d878c00c25408520f630959e83f2967efd48f4f85a66b1d02`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–14 — NAT estática/dinámica y PAT. Traducción de direcciones, estado, mapeos, NAT 1:1, pool dinámico y multiplexación por puertos PAT.
- Imagen del cuestionario `assets/image-77d62ab302bace2d878c00c2.png`. Tabla PAT reconstruida.
- RFC 3022 — Traditional IP Network Address Translator, §4.1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3022.html)). NAPT traduce dirección y puerto TCP/UDP para el flujo de ida y revierte la traducción en el retorno.

---

### Pregunta 17 — PROVISIONAL → VERIFICADA

**ID:** `q-fbe64bafcfd90ec0394334e5b54b914be74fd86815a8eef47396ce64c9cca1bd`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63241. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué IP de destino tiene en la LAN?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — 172.20.35.57.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | 192.0.2.92 | INCORRECTA | La IP pública es destino antes de la traducción; después de aplicar PAT en LAN cambia. |
| 2 | 172.20.35.57 **(clave puntuable)** | CORRECTA | Correcta: la fila asociada al puerto externo 63241 señala 172.20.35.57. |
| 3 | 172.20.35.44 | INCORRECTA | 172.20.35.44 corresponde al mapeo 63242, no al 63241. |

**Fundamento general registrado:**

[Respuesta] La entrada cuyo puerto externo es 63241 mapea a la IP interna 172.20.35.57; esa es la dirección de destino después de deshacer PAT.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-77d62ab302bace2d878c00c2.png` — SHA-256 `77d62ab302bace2d878c00c25408520f630959e83f2967efd48f4f85a66b1d02`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–14 — NAT estática/dinámica y PAT. Traducción de direcciones, estado, mapeos, NAT 1:1, pool dinámico y multiplexación por puertos PAT.
- Imagen del cuestionario `assets/image-77d62ab302bace2d878c00c2.png`. Tabla PAT reconstruida.
- RFC 3022 — Traditional IP Network Address Translator, §4.1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3022.html)). NAPT traduce dirección y puerto TCP/UDP para el flujo de ida y revierte la traducción en el retorno.

---

### Pregunta 18 — PROVISIONAL → VERIFICADA

**ID:** `q-1481ddfad5d1075a474bf3f6f0518cded17db231e18a95421fde9adb6e0e1acb`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63241. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué puerto de destino tiene en la LAN?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — 53740.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | 80 | INCORRECTA | 80 es el puerto de origen del servidor web; no el puerto interno del cliente. |
| 2 | 63241 | INCORRECTA | 63241 es el puerto externo de la traducción, no el puerto del host LAN. |
| 3 | 53740 **(clave puntuable)** | CORRECTA | Correcta: el puerto interno consignado en la fila externa 63241 es 53740. |
| 4 | 63242 | INCORRECTA | 63242 pertenece a la otra conexión del mismo router. |

**Fundamento general registrado:**

[Respuesta] La entrada externa TCP 63241 traduce al puerto interno 53740. El puerto de destino en el segmento que sale por la LAN es 53740.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-77d62ab302bace2d878c00c2.png` — SHA-256 `77d62ab302bace2d878c00c25408520f630959e83f2967efd48f4f85a66b1d02`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–14 — NAT estática/dinámica y PAT. Traducción de direcciones, estado, mapeos, NAT 1:1, pool dinámico y multiplexación por puertos PAT.
- Imagen del cuestionario `assets/image-77d62ab302bace2d878c00c2.png`. Tabla PAT reconstruida.
- RFC 3022 — Traditional IP Network Address Translator, §4.1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3022.html)). NAPT traduce dirección y puerto TCP/UDP para el flujo de ida y revierte la traducción en el retorno.

---

### Pregunta 19 — PROVISIONAL → VERIFICADA

**ID:** `q-52b078e45df80583e2aab432ec106003328b9862c2e1c8f8a39250186de64146`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63242. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué equipo es el destinatario?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Sala-04.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Sala-04 **(clave puntuable)** | CORRECTA | Correcta: la fila con puerto externo 63242 corresponde a Sala-04. |
| 2 | Sala-07 | INCORRECTA | Sala-07 utiliza el puerto externo 63241, por lo que no recibe esta respuesta. |

**Fundamento general registrado:**

[Respuesta] La tabla asigna el puerto externo 63242 a 172.20.35.44, Sala-04. La respuesta dirigida a ese puerto público se traduce hacia ese equipo.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-77d62ab302bace2d878c00c2.png` — SHA-256 `77d62ab302bace2d878c00c25408520f630959e83f2967efd48f4f85a66b1d02`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–14 — NAT estática/dinámica y PAT. Traducción de direcciones, estado, mapeos, NAT 1:1, pool dinámico y multiplexación por puertos PAT.
- Imagen del cuestionario `assets/image-77d62ab302bace2d878c00c2.png`. Tabla PAT reconstruida.
- RFC 3022 — Traditional IP Network Address Translator, §4.1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3022.html)). NAPT traduce dirección y puerto TCP/UDP para el flujo de ida y revierte la traducción en el retorno.

---

### Pregunta 20 — PROVISIONAL → VERIFICADA

**ID:** `q-5393f346dff446ddf380e131dbfc6045f824da23ee4f2102b32a3d4ebec4b046`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63242. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué IP de destino tiene en la LAN?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — 172.20.35.44.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | 192.0.2.92 | INCORRECTA | 192.0.2.92 es la IP pública antes de la traducción. |
| 2 | 172.20.35.57 | INCORRECTA | 172.20.35.57 corresponde a la otra conexión (63241). |
| 3 | 172.20.35.44 **(clave puntuable)** | CORRECTA | Correcta: 63242 se asocia al host interno 172.20.35.44. |

**Fundamento general registrado:**

[Respuesta] La entrada TCP con puerto externo 63242 mapea a la dirección interna 172.20.35.44.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-77d62ab302bace2d878c00c2.png` — SHA-256 `77d62ab302bace2d878c00c25408520f630959e83f2967efd48f4f85a66b1d02`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–14 — NAT estática/dinámica y PAT. Traducción de direcciones, estado, mapeos, NAT 1:1, pool dinámico y multiplexación por puertos PAT.
- Imagen del cuestionario `assets/image-77d62ab302bace2d878c00c2.png`. Tabla PAT reconstruida.
- RFC 3022 — Traditional IP Network Address Translator, §4.1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3022.html)). NAPT traduce dirección y puerto TCP/UDP para el flujo de ida y revierte la traducción en el retorno.

---

### Pregunta 21 — PROVISIONAL → VERIFICADA

**ID:** `q-09d4b7d94d836fa24d613d85c8d956dfb2b2f9a22ae0f98906a7c8de753aac9c`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. Por la WAN llega una respuesta TCP desde 203.0.113.108:80 con destino 192.0.2.92:63242. Después de aplicar PAT se captura en SW-Sala (LAN). ¿Qué puerto de destino tiene en la LAN?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 4 — 53740.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | 63242 | INCORRECTA | 63242 es el puerto externo público del mapeo. |
| 2 | 80 | INCORRECTA | 80 identifica el servicio web remoto. |
| 3 | 63241 | INCORRECTA | 63241 identifica la otra traducción PAT. |
| 4 | 53740 **(clave puntuable)** | CORRECTA | Correcta: el mapeo 63242 restaura puerto interno 53740. |

**Fundamento general registrado:**

[Respuesta] La entrada TCP con puerto externo 63242 traduce el puerto de destino público al puerto interno 53740.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-77d62ab302bace2d878c00c2.png` — SHA-256 `77d62ab302bace2d878c00c25408520f630959e83f2967efd48f4f85a66b1d02`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–14 — NAT estática/dinámica y PAT. Traducción de direcciones, estado, mapeos, NAT 1:1, pool dinámico y multiplexación por puertos PAT.
- Imagen del cuestionario `assets/image-77d62ab302bace2d878c00c2.png`. Tabla PAT reconstruida.
- RFC 3022 — Traditional IP Network Address Translator, §4.1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3022.html)). NAPT traduce dirección y puerto TCP/UDP para el flujo de ida y revierte la traducción en el retorno.

---

### Pregunta 22 — PROVISIONAL → VERIFICADA

**ID:** `q-49d9c5545b13870e53bb15082e185eb7cfa59d8bae8bae1936a61b7a99df52de`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la tabla NAT de R-Sala en la imagen. ¿Qué pasaría si R-Sala asignara el puerto externo 63242 a ambas conexiones?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — Los encabezados de las respuestas serían idénticos y R-Sala no podría distinguir las conexiones.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | R-Sala las distinguiría por el puerto de origen del servidor | INCORRECTA | El puerto de origen del servidor es igual en los dos flujos planteados; no diferencia esas respuestas. |
| 2 | R-Sala le asignaría otra IP pública a una de ellas | INCORRECTA | Asignar otra IP pública sería una posibilidad de diseño, pero no es lo que se pregunta ni lo que hace inevitablemente el router. |
| 3 | Los encabezados de las respuestas serían idénticos y R-Sala no podría distinguir las conexiones **(clave puntuable)** | CORRECTA | Correcta: si se repite el mismo puerto externo para el mismo protocolo/IP y servidor, el flujo de retorno es indistinguible. |
| 4 | R-Sala las distinguiría por el puerto interno de cada equipo | INCORRECTA | El router necesita distinguir la traducción antes de conocer el puerto interno; ese dato no existe en el paquete de vuelta. |

**Fundamento general registrado:**

[Respuesta] En el escenario mostrado ambas conexiones TCP comparten dirección pública y tienen el mismo servidor remoto 203.0.113.108:80. Si ambas usaran también el mismo puerto externo 63242, la tupla de retorno sería indistinguible para PAT; por eso se asignan puertos externos diferentes.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-77d62ab302bace2d878c00c2.png` — SHA-256 `77d62ab302bace2d878c00c25408520f630959e83f2967efd48f4f85a66b1d02`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** La tabla reconstruida muestra TCP 172.20.35.44:53740 ↔ 192.0.2.92:63242 → 203.0.113.108:80 y TCP 172.20.35.57:53740 ↔ 192.0.2.92:63241 → 203.0.113.108:80. Para tráfico entrante a 192.0.2.92:63241, el destino tras deshacer PAT es 172.20.35.57:53740; para :63242 es 172.20.35.44:53740. Reutilizar un puerto externo para mapeos indistinguibles al mismo destino no permite identificar el host de retorno.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–14 — NAT estática/dinámica y PAT. Traducción de direcciones, estado, mapeos, NAT 1:1, pool dinámico y multiplexación por puertos PAT.
- Imagen del cuestionario `assets/image-77d62ab302bace2d878c00c2.png`. Tabla PAT reconstruida; la pregunta plantea una hipótesis sobre reutilizar un puerto externo.
- RFC 3022 — Traditional IP Network Address Translator, §4.1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3022.html)). NAPT traduce dirección y puerto TCP/UDP para el flujo de ida y revierte la traducción en el retorno.

---

### Pregunta 25 — PROVISIONAL → VERIFICADA

**ID:** `q-294ef613a28d817241c07cc97c6b3dbbfd1a8165cb637113206ee88c57d87cd2`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Acciones de la tabla cotejadas visualmente con la leyenda de la guía local de IPFire; la imagen no es una fotografía del examen.  

**Enunciado literal:**

> Me encuentro ubicado en el equipo con IP 192.168.50.102/24 (VERDE) y necesito hacer ping al equipo 172.16.170.33/24 (ROJO) pasando por el firewall que tiene la configuración de la imagen. ¿Qué sucederá?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — El ping será bloqueado debido a la regla 3.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | El ping será exitoso por la política | INCORRECTA | La regla 5 es TCP a Telnet y no aplica a ICMP. |
| 2 | El ping será bloqueado debido a la regla 3 **(clave puntuable)** | CORRECTA | Correcta bajo la lectura de color/acción de la captura: regla 3 es la primera coincidencia específica y bloquea; regla 4 no llega a evaluarse. |
| 3 | El ping será bloqueado debido a la regla 2 | INCORRECTA | La regla 2 es TCP a .33:443; protocolo y puerto no coinciden con ping. |
| 4 | El ping será exitoso debido a la regla 4 | INCORRECTA | La regla 4 es una coincidencia más general pero queda posterior a la regla 3; no puede prevalecer si esta primera regla decide el tráfico. |

**Fundamento general registrado:**

[Respuesta] El origen 192.168.50.102, destino 172.16.170.33 y protocolo ICMP coinciden primero con la regla 3. La guía de lectura asigna el fondo rojo del indicador a descartar; la regla 4 no se evalúa después de esa coincidencia.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-4d11058301d9e14f5dd7d5e5.png` — SHA-256 `4d11058301d9e14f5dd7d5e5bfdd7100255ebbad4aece25a0922a36e364ac384`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-4d11058301d9e14f5dd7d5e5.png la regla 3 ICMP desde 192.168.50.102 a 172.16.170.33 tiene indicador rojo; la regla 4 ICMP desde Green tiene indicador verde. La guía IPFire local identifica rojo como DROP y verde como ACCEPT; prevalece la primera regla coincidente. q25 coincide con regla 3 y se bloquea; q26 llega a regla 4 y se acepta. Esto describe la imagen visible, no una foto histórica independiente.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-4d11058301d9e14f5dd7d5e5.png`. Captura de reglas del firewall y política por defecto permitida.
- Lectura de reglas del firewall IPFire.pdf, visor pp. 2–4 — Lectura de reglas IPFire. Acciones verde aceptar, rojo descartar, negro rechazar; protocolos, origen/destino y evaluación desde arriba hasta la primera coincidencia.

---

### Pregunta 26 — AMBIGUA → VERIFICADA

**ID:** `q-112b2a2e0ecdac1f974abb399af42b3c64c07a4fdf7ac81b0b7edf744726ddfa`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. La regla 4 se distingue como verde en la imagen y la guía local interpreta verde como aceptar; la escena de examen original no está disponible.  

**Enunciado literal:**

> Me encuentro ubicado en el equipo con IP 192.168.50.20/24 (VERDE) y necesito hacer ping al equipo 172.16.170.33/24 (ROJO) pasando por el firewall que tiene la configuración de la imagen. ¿Qué sucederá?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 4 — El ping será exitoso debido a la regla 4.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | El ping será bloqueado debido a la regla 5 | INCORRECTA | La regla 5 solo afecta TCP y Telnet, no ICMP. |
| 2 | El ping será bloqueado por la política | INCORRECTA | La política inferior dice permitido para Green hacia Internet, pero no resuelve la acción explícita de esta coincidencia al destino ROJO. |
| 3 | El ping será bloqueado debido a la regla 3 | INCORRECTA | La regla 3 restringe el origen a .102 y no coincide con .20. |
| 4 | El ping será exitoso debido a la regla 4 **(clave puntuable)** | CORRECTA | La regla 4 coincide con el origen Green, ICMP y destino 172.16.170.33. Su indicador verde significa aceptar según la guía local; la regla 3 no coincide con el origen .20. |

**Fundamento general registrado:**

[Respuesta] El origen 192.168.50.20 no coincide con la regla 3, que limita el host de origen a 192.168.50.102. El ping ICMP sí coincide con la regla 4 (Green hacia 172.16.170.33), cuyo indicador verde significa aceptar según la guía local. [Cambio] Esta evidencia corrige la ambigüedad anterior: el color de la acción se puede identificar en la imagen y está definido por la guía.

**Observaciones:**
- La regla coincidente puede identificarse, pero falta evidencia legible de su acción.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-4d11058301d9e14f5dd7d5e5.png` — SHA-256 `4d11058301d9e14f5dd7d5e5bfdd7100255ebbad4aece25a0922a36e364ac384`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-4d11058301d9e14f5dd7d5e5.png la regla 3 ICMP desde 192.168.50.102 a 172.16.170.33 tiene indicador rojo; la regla 4 ICMP desde Green tiene indicador verde. La guía IPFire local identifica rojo como DROP y verde como ACCEPT; prevalece la primera regla coincidente. q25 coincide con regla 3 y se bloquea; q26 llega a regla 4 y se acepta. Esto describe la imagen visible, no una foto histórica independiente.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-4d11058301d9e14f5dd7d5e5.png`. La imagen muestra la configuración específica usada para interpretar esta pregunta; se conserva su estatus si la reconstrucción no se puede confirmar independientemente.
- Lectura de reglas del firewall IPFire.pdf, visor pp. 2–4 — Colores de acciones y evaluación de reglas. La guía explica ACCEPT/DROP/REJECT y la prioridad de la primera regla coincidente; la acción concreta de la fila 4 no queda legible en la captura.

---

### Pregunta 37 — AMBIGUA → AMBIGUA

**ID:** `q-4e90e92ad7fb323f76cee91952bb22ddb463b606e49c5226c8235b32695944e1`  
**Tipo y cantidad exigida:** `multiple`; 2 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Captura SYN+ACK legible; el registro procede de los recursos del cuestionario y no se cotejó con una foto original del examen.  

**Enunciado literal:**

> ¿Cuáles de las siguientes afirmaciones son correctas a partir de la captura de Wireshark de la imagen? (seleccione dos opciones)

**Decisión y clave:**

Permanece AMBIGUA. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | El servidor web acepta la conexión e inicia un nuevo socket hacia la PC | AMBIGUA | El SYN+ACK responde al SYN inicial. La filmina de la cátedra lo simplifica como aceptación/apertura de socket, pero el handshake TCP aún necesita el ACK final; “acepta la conexión” es impreciso si significa ESTABLISHED. |
| 2 | El servidor va a finalizar la conexión | INCORRECTA | El paquete no lleva FIN; es parte de la apertura, no del cierre. |
| 3 | Es un segmento destinado a un servidor HTTPS | INCORRECTA | El destino es el puerto efímero 52086 de la PC; HTTPS es el servicio de origen (443), no el destino de esta trama. |
| 4 | El servidor le informa a la PC su MSS y su escalado de ventana | CORRECTA | La captura muestra la opción MSS y Window Scale anunciadas en el SYN+ACK enviado por el servidor. |
| 5 | El servidor web recibió correctamente datos de la PC hasta el byte 65534 | INCORRECTA | El campo mostrado es window size 65535, no prueba recepción de datos hasta ese byte; además el segmento no lleva datos. |
| 6 | Una PC desea iniciar una conexión con un servidor web | INCORRECTA | La trama es SYN+ACK del servidor en respuesta al SYN de la PC, no la solicitud inicial de la PC. |

**Fundamento general registrado:**

[Hallazgo] La captura es un SYN+ACK del servidor TCP/443 al puerto efímero 52086 de la PC, con MSS y Window Scale en opciones. La alternativa 4 es correcta. La alternativa 1 puede reflejar la simplificación de la filmina de la cátedra, que describe la respuesta SYN+ACK como aceptación y apertura de un socket; sin embargo, el handshake aún requiere el ACK final y el servidor no está en estado ESTABLISHED. Como el ítem exige dos respuestas y una de ellas depende de esa formulación imprecisa, se conserva sin clave.

**Observaciones:**
- Una segunda alternativa solo sería defendible usando “acepta” como abreviatura coloquial de “responde al SYN”; técnicamente no equivale a estado ESTABLISHED/accept completado.
- La decisión no resuelve una clave; la pregunta debe permanecer sin puntuación.

**Problemas y límites:**
- [Hallazgo] La captura es un SYN+ACK del servidor TCP/443 al puerto efímero 52086 de la PC, con MSS y Window Scale en opciones. La alternativa 4 es correcta. La alternativa 1 puede reflejar la simplificación de la filmina de la cátedra, que describe la respuesta SYN+ACK como aceptación y apertura de un socket; sin embargo, el handshake aún requiere el ACK final y el servidor no está en estado ESTABLISHED. Como el ítem exige dos respuestas y una de ellas depende de esa formulación imprecisa, se conserva sin clave.

**Evidencia visual asociada:**
- `assets/image-55e91291c9b4c2c62ca9ed43.png` — SHA-256 `55e91291c9b4c2c62ca9ed431c7d08f4a4b08f261bf5403a042d17c3e7450111`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** image-55e91291c9b4c2c62ca9ed43.png muestra origen TCP 443 y destino efímero 52086 de la PC; flags SYN+ACK, segmento de longitud 0, window 65535 y opciones MSS/Window Scale. No aparece el ACK final de la PC, así que no prueba un handshake completado. Solo la afirmación sobre MSS/escalado (opción d) es inequívoca, mientras el ítem pide dos y la alternativa de aceptación depende de una simplificación docente; no se marca clave.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-55e91291c9b4c2c62ca9ed43.png`. La imagen muestra la configuración específica usada para interpretar esta pregunta; se conserva su estatus si la reconstrucción no se puede confirmar independientemente.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 24–25 — Opciones TCP y establecimiento de conexión. La captura muestra el intercambio inicial; la secuencia de tres vías requiere SYN, SYN/ACK y ACK final.
- RFC 9293 — Transmission Control Protocol, §§3.5, 3.8.3 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc9293.html)). SYN inicia y SYN+ACK responde con reconocimiento; el tercer ACK completa el three-way handshake.

---

### Pregunta 41 — PROVISIONAL → PROVISIONAL

**ID:** `q-422034e0c1a0064f10d4d5bc0de40e26a0a86c3089b377e3fcc8877973ec86d2`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. La fila 2 de HTTPS es gris y la guía no define gris como una acción; no es posible confirmar el bloqueo.  

**Enunciado literal:**

> Observe las reglas del firewall de la imagen: se evalúan de arriba hacia abajo y se aplica la primera coincidencia. Desde el equipo 192.168.10.25 se inicia una conexión HTTP al servidor 203.0.113.10. ¿Qué ocurre? ¿Y si la conexión es HTTPS?

**Decisión y clave:**

Permanece PROVISIONAL. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | HTTP se permite por la regla 1 y HTTPS se bloquea por la regla 2 | AMBIGUA | HTTP coincide con la regla 1 verde. HTTPS coincide con la regla 2, pero el indicador de esa fila aparece gris y la guía no establece qué acción representa ese color. |
| 2 | Ambos flujos se bloquean por la regla 5 | INCORRECTA | La regla 5 no se evalúa porque ya hay reglas específicas coincidentes para HTTP/HTTPS. |
| 3 | HTTP se bloquea por la regla 2 y HTTPS se permite por la regla 1 | INCORRECTA | Invierte la relación entre las reglas específicas para los dos puertos. |
| 4 | Ambos flujos se permiten por la regla 1 | INCORRECTA | La regla 1 limita el destino al puerto 80, por lo que no cubre HTTPS/443. |

**Fundamento general registrado:**

La fila 1 (HTTP/80) tiene indicador verde, pero la fila 2 (HTTPS/443) aparece gris. La guía local define verde=aceptar, rojo=descartar y negro=rechazar; no define este gris. La imagen no permite decidir la acción de la regla 2. La afirmación de la alternativa que HTTPS se bloquea sigue sin verificarse.

**Observaciones:**
- La clave no se incorpora al simulacro mientras falte el dato indicado.

**Problemas y límites:**
- La fila 1 (HTTP/80) tiene indicador verde, pero la fila 2 (HTTPS/443) aparece gris. La guía local define verde=aceptar, rojo=descartar y negro=rechazar; no define este gris. La imagen no permite decidir la acción de la regla 2. La afirmación de la alternativa que HTTPS se bloquea sigue sin verificarse.

**Evidencia visual asociada:**
- `assets/image-45e7d914a71370868ac4d5ad.png` — SHA-256 `45e7d914a71370868ac4d5ad92f140215635cff75208460b7e59c48b7019d632`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-45e7d914a71370868ac4d5ad.png las reglas 3 y 4 tienen indicadores verdes y la regla 5 rojo; la fila 2 HTTPS aparece gris. La guía local define verde, rojo y negro, no gris. Por eso q42 y q43 se resuelven por reglas verde/roja que coinciden; q41 queda provisional porque no se conoce la acción de la fila HTTPS gris.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-45e7d914a71370868ac4d5ad.png`. La imagen muestra la configuración específica usada para interpretar esta pregunta; se conserva su estatus si la reconstrucción no se puede confirmar independientemente.
- Lectura de reglas del firewall IPFire.pdf, visor pp. 2–4 — Acciones de reglas y primera coincidencia. La guía da el código visual de ACCEPT/DROP/REJECT y la prioridad de reglas. La lectura de color de la captura debe confirmarse porque la imagen es una reconstrucción.

---

### Pregunta 42 — AMBIGUA → VERIFICADA

**ID:** `q-137100768d5b78bcd0abb2008128fbe4fd3c7e7e1bb0618b1b46e992a538b2e9`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Indicador verde en la regla ICMP, interpretado como aceptar conforme a la guía de IPFire. La imagen de examen original no está disponible.  

**Enunciado literal:**

> Observe las reglas del firewall de la imagen: se evalúan de arriba hacia abajo y se aplica la primera coincidencia. Desde el equipo 192.168.10.25 se hace ping a 203.0.113.10. ¿Qué hace el firewall con la solicitud de eco?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — Lo permite por la regla 3, porque es ICMP y coinciden origen y destino.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Lo bloquea por la regla 5, porque ping no usa un puerto TCP | INCORRECTA | No coincide la regla 5, que es la última regla y está representada como acción de caída; además existe antes una regla ICMP específica. |
| 2 | Lo permite por la regla 3, porque es ICMP y coinciden origen y destino **(clave puntuable)** | CORRECTA | La regla 3 coincide con ICMP, origen 192.168.10.0/24 y destino 203.0.113.10. El indicador verde representa aceptar según la guía local. |
| 3 | Lo bloquea por la regla 2, porque no usa el puerto 80 | INCORRECTA | La regla 2 es TCP/443 y no aplica a ICMP. |
| 4 | Lo permite por la regla 1, porque el servidor coincide | INCORRECTA | La regla 1 es TCP/80 y no aplica a ICMP. |

**Fundamento general registrado:**

[Respuesta] El ping coincide con la regla 3 (ICMP desde 192.168.10.0/24 a 203.0.113.10). El indicador de acción de esa fila es verde, que la guía local define como aceptar. La primera coincidencia permite la solicitud. [Cambio] La evaluación previa leyó incorrectamente la acción de esa fila.

**Observaciones:**
- No hay alternativa para “rechazado por la regla 3” si la lectura de color es correcta; si la acción fuera permitir, la opción 2 sería correcta.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-45e7d914a71370868ac4d5ad.png` — SHA-256 `45e7d914a71370868ac4d5ad92f140215635cff75208460b7e59c48b7019d632`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-45e7d914a71370868ac4d5ad.png las reglas 3 y 4 tienen indicadores verdes y la regla 5 rojo; la fila 2 HTTPS aparece gris. La guía local define verde, rojo y negro, no gris. Por eso q42 y q43 se resuelven por reglas verde/roja que coinciden; q41 queda provisional porque no se conoce la acción de la fila HTTPS gris.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-45e7d914a71370868ac4d5ad.png`. La imagen muestra la configuración específica usada para interpretar esta pregunta; se conserva su estatus si la reconstrucción no se puede confirmar independientemente.
- Lectura de reglas del firewall IPFire.pdf, visor pp. 2–4 — Acciones de reglas y primera coincidencia. La guía permite interpretar acciones por color y explica el orden de evaluación; la reconstrucción carece de leyenda local de la acción.

---

### Pregunta 43 — PROVISIONAL → VERIFICADA

**ID:** `q-04a250a445a6d5f2d860fe301886e6070b266c57c89975aee07e343e8ba87231`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Regla 5 y su indicador rojo se leen claramente; la clave corresponde a esta escena reconstruida.  

**Enunciado literal:**

> Observe las reglas del firewall de la imagen: se evalúan de arriba hacia abajo y se aplica la primera coincidencia. Desde el equipo 192.168.10.25 se abre una conexión Telnet a 203.0.113.10. ¿Qué ocurre?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — Se deniega por la regla 5, porque ninguna regla anterior coincide por completo.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Se deniega por la regla 2, porque Telnet usa TCP | INCORRECTA | La regla 2 es específica a TCP/443, no Telnet/23. |
| 2 | Se permite por la regla 4, porque el puerto es 23 | INCORRECTA | La regla 4 limita el origen a 192.168.20.0/24, no incluye 192.168.10.25. |
| 3 | Se deniega por la regla 5, porque ninguna regla anterior coincide por completo **(clave puntuable)** | CORRECTA | Correcta bajo la lectura visual: no hay coincidencia anterior y la regla 5 general del origen Green al servidor está codificada como DROP. |
| 4 | Se permite por la regla 1, porque el origen pertenece a 192.168.10.0/24 | INCORRECTA | La regla 1 es específica a TCP/80, no basta con coincidir solo el origen. |

**Fundamento general registrado:**

[Respuesta] La conexión TCP/23 desde 192.168.10.25 no coincide con las reglas anteriores: las reglas 1 y 2 son para puertos 80 y 443, la 3 es ICMP, y la 4 exige origen 192.168.20.0/24. Coincide con la regla 5 (Green a 203.0.113.10), cuyo indicador rojo corresponde a descartar.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-45e7d914a71370868ac4d5ad.png` — SHA-256 `45e7d914a71370868ac4d5ad92f140215635cff75208460b7e59c48b7019d632`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-45e7d914a71370868ac4d5ad.png las reglas 3 y 4 tienen indicadores verdes y la regla 5 rojo; la fila 2 HTTPS aparece gris. La guía local define verde, rojo y negro, no gris. Por eso q42 y q43 se resuelven por reglas verde/roja que coinciden; q41 queda provisional porque no se conoce la acción de la fila HTTPS gris.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-45e7d914a71370868ac4d5ad.png`. La imagen muestra la configuración específica usada para interpretar esta pregunta; se conserva su estatus si la reconstrucción no se puede confirmar independientemente.
- Lectura de reglas del firewall IPFire.pdf, visor pp. 2–4 — Acciones de reglas y primera coincidencia. La guía define colores de acción y evaluación secuencial; la lectura de color de esta reconstrucción se mantiene provisional.

---

### Pregunta 54 — PROVISIONAL → VERIFICADA

**ID:** `q-61bd685683282b21f44486da78f63c93639e9982836a22c2a9ce29cae66032c3`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología de la imagen. Ambas PCs abren conexiones TCP al servidor web. La PC 1 ya tiene asignado el puerto público 48200 y el router asigna el 48201 a la conexión de la PC 2. ¿Cómo sale a Internet el paquete de la PC 2 después de aplicar PAT?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — Origen 203.0.113.5:48201, destino 198.51.100.10:80.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Origen 203.0.113.5:80, destino 198.51.100.10:48201 | INCORRECTA | Invierte el sentido y asigna el puerto web como origen. |
| 2 | Origen 203.0.113.5:48200, destino 198.51.100.10:48201 | INCORRECTA | 48200 está asignado a PC1. |
| 3 | Origen 203.0.113.5:48201, destino 198.51.100.10:80 **(clave puntuable)** | CORRECTA | Correcta: origen público del router y puerto PAT de PC2; destino web/80. |
| 4 | Origen 198.51.100.10:80, destino 203.0.113.5:48201 | INCORRECTA | Describe una respuesta del servidor, no la solicitud de PC2. |

**Fundamento general registrado:**

[Respuesta] La PC2 inicia una conexión al servidor 198.51.100.10:80. Después de PAT, el paquete sale con origen público 203.0.113.5:48201 y conserva como destino el servidor en el puerto 80.

**Observaciones:**
- El puerto 48201 depende del escenario dibujado/reconstruido.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-ab56179d8357f41aeba62aff.png` — SHA-256 `ab56179d8357f41aeba62affcd73a0496617ecd0b0336163ba257fd097105605`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** image-ab56179d8357f41aeba62aff.png presenta PC1 192.168.1.101 y PC2 192.168.1.102, ambos con puerto origen 48200; router PAT público 203.0.113.5; servidor 198.51.100.10:80. Para diferenciar flujos simultáneos, el escenario asigna un puerto público distinto a PC2 (48201).

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-ab56179d8357f41aeba62aff.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 11–13 — PAT y traducción de puertos. PAT traduce dirección y puerto de origen y mantiene mapeos para sesiones simultáneas.

---

### Pregunta 55 — PROVISIONAL → VERIFICADA

**ID:** `q-148f9cfac577f528f025ca3665b594a6cf789428427e37b253c7fc7eecf62bfe`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología de la imagen. Ambas PCs abren conexiones TCP al servidor web. La PC 1 ya tiene asignado el puerto público 48200 y el router asigna el 48201 a la conexión de la PC 2. ¿A qué puerto de destino va la respuesta del servidor en Internet y a qué puerto local la entrega el router PAT a la PC 2?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — Puerto público 48201 y puerto local 48200.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Puerto público 80 y puerto local 48201 | INCORRECTA | El servidor responde al puerto PAT, no al 80 como puerto de destino. |
| 2 | Puerto público 48201 y puerto local 48200 **(clave puntuable)** | CORRECTA | Correcta: puerto exterior 48201 y traducción al puerto local 48200. |
| 3 | Puerto público 48200 y puerto local 80 | INCORRECTA | 48200 es local de PC2, no el puerto público de esta conexión. |
| 4 | Puerto público 48201 y puerto local 48201 | INCORRECTA | No conserva el puerto exterior como puerto local sin traducir. |

**Fundamento general registrado:**

[Respuesta] La respuesta llega al puerto público 48201 asignado a la conexión de PC2. El diagrama muestra que PC2 inició desde el puerto local 48200, por lo que PAT traduce el destino de vuelta a ese puerto.

**Observaciones:**
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-ab56179d8357f41aeba62aff.png` — SHA-256 `ab56179d8357f41aeba62affcd73a0496617ecd0b0336163ba257fd097105605`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** image-ab56179d8357f41aeba62aff.png presenta PC1 192.168.1.101 y PC2 192.168.1.102, ambos con puerto origen 48200; router PAT público 203.0.113.5; servidor 198.51.100.10:80. Para diferenciar flujos simultáneos, el escenario asigna un puerto público distinto a PC2 (48201).

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-ab56179d8357f41aeba62aff.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 11–14 — Mapeo de respuestas PAT. PAT usa la tabla de traducciones para llevar respuestas a la pareja interna correspondiente.

---

### Pregunta 57 — PROVISIONAL → VERIFICADA

**ID:** `q-1c1f96d089b6a579862c5361c437308c4e426c30ead91bee32eea0b61112f9de`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> Una empresa reemplaza un enlace dedicado por una VPN que utiliza conectividad a Internet. Posteriormente observa que la capacidad disponible no presenta siempre el mismo comportamiento que tenía el enlace exclusivo. ¿Qué característica explica esta diferencia?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — La organización no controla completamente los recursos subyacentes de Internet, por lo que el rendimiento puede variar con la conectividad utilizada.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Una VPN reserva capacidad fija en Internet, pero la distribuye entre todas las aplicaciones de la organización | INCORRECTA | La VPN sobre Internet no reserva capacidad fija por sí misma. |
| 2 | La organización no controla completamente los recursos subyacentes de Internet, por lo que el rendimiento puede variar con la conectividad utilizada **(clave puntuable)** | CORRECTA | Correcta como inferencia del uso de infraestructura pública/ISP; no se afirma control de recursos por la empresa. |
| 3 | La utilización de una VPN elimina la variación de rendimiento de Internet mediante la virtualización de los enlaces | INCORRECTA | Virtualizar no elimina las variaciones de la red subyacente. |
| 4 | El túnel convierte la capacidad pública disponible en una capacidad física constante durante toda la comunicación | INCORRECTA | El túnel no crea capacidad física constante. |
| 5 | La VPN controla los recursos de todos los proveedores atravesados, aunque no controla las aplicaciones que generan tráfico | INCORRECTA | La VPN no controla todos los recursos de los proveedores. |

**Fundamento general registrado:**

[Respuesta] La VPN forma un túnel lógico sobre una red pública que atraviesa Internet y proveedores externos; no convierte esa infraestructura compartida en un enlace dedicado ni reserva por sí misma una capacidad fija. El propio enunciado indica que se observa variación.

**Observaciones:**
- La selección se infiere del carácter público y compartido de la red; la filmina no formula explícitamente una garantía de rendimiento.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Fuentes específicas:**
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, visor pp. 42–45 — VPN sobre Internet e infraestructura pública. La VPN conecta sedes/usuarios usando Internet e infraestructura de ISP, frente a redes privadas dedicadas.

---

### Pregunta 60 — AMBIGUA → AMBIGUA

**ID:** `q-c2f920289cc283442fc3da7767aeb2bc58ab211d2a8776260dff04def1ee1459`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. La salida muestra TCP/23 en LISTEN y UDP/53; no identifica procesos ni la versión histórica del examen.  

**Enunciado literal:**

> La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo. ¿Qué servicios puede asegurar que están corriendo en el servidor?

**Decisión y clave:**

Permanece AMBIGUA. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | SSH | INCORRECTA | SSH usa TCP/22, que no aparece. |
| 2 | DNS | AMBIGUA | UDP/53 suele asociarse a DNS, pero el socket no demuestra qué aplicación lo abrió. Además, la captura también muestra TCP/23 en LISTEN, asociación convencional con Telnet. |
| 3 | HTTPS | INCORRECTA | HTTPS/443 no aparece. |
| 4 | DHCP | INCORRECTA | DHCP usa UDP/67–68, que no aparecen. |
| 5 | HTTP | INCORRECTA | HTTP/TCP 80 no aparece. |
| 6 | FTP | INCORRECTA | FTP/TCP 20–21 no aparece. |
| 7 | Telnet | AMBIGUA | TCP/23 en LISTEN es el puerto convencional de Telnet, aunque netstat no identifica por sí solo el proceso. UDP/53 también admite una asociación plausible con DNS. |

**Fundamento general registrado:**

[Problema] La imagen muestra TCP/23 en LISTEN y un socket UDP local en el puerto 53. Ambos son puertos convencionales de Telnet y DNS, respectivamente, pero netstat informa sockets/puertos y no identifica por sí solo el proceso o aplicación. La consigna está configurada como opción única y no aporta dato para descartar una de las dos asociaciones.

**Observaciones:**
- Se observan al menos dos respuestas plausibles (DNS y Telnet), pese a la configuración de selección única.
- La decisión no resuelve una clave; la pregunta debe permanecer sin puntuación.

**Problemas y límites:**
- [Problema] La imagen muestra TCP/23 en LISTEN y un socket UDP local en el puerto 53. Ambos son puertos convencionales de Telnet y DNS, respectivamente, pero netstat informa sockets/puertos y no identifica por sí solo el proceso o aplicación. La consigna está configurada como opción única y no aporta dato para descartar una de las dos asociaciones.

**Evidencia visual asociada:**
- `assets/image-43a7851536808316264f8bea.png` — SHA-256 `43a7851536808316264f8bea9a0b2805be355b99605cffb1cbce882eaad1490d`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** image-43a7851536808316264f8bea.png lista TCP 0.0.0.0:9999 LISTEN, TCP 0.0.0.0:23 LISTEN y UDP 0.0.0.0:53. Los puertos 23 y 53 son convencionales para Telnet y DNS, pero la captura no identifica procesos ni asegura qué aplicación corre; la opción única queda ambigua.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-43a7851536808316264f8bea.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 31–33 — Puertos y netstat. La filmina permite interpretar listeners y puertos conocidos.

---

### Pregunta 66 — PROVISIONAL → PROVISIONAL

**ID:** `q-51e6e38f8e2f6c0556bf28bd53ee536ed72a4d25c4477d4b58fa3c4346e47d8d`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. No se muestra el puerto del servidor; la procedencia del gráfico es reconstruida y no se cotejó con una fotografía original.  

**Enunciado literal:**

> Observe la topología de la imagen. PC1 y luego PC2 se conectan al servidor web usando el mismo puerto de origen 48200 y el router realiza PAT. ¿Qué información tiene el paquete de PC1 hacia el servidor capturado en el switch (red privada)?

**Decisión y clave:**

Permanece PROVISIONAL. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Origen 192.168.1.101:48200 – Destino 152.0.10.5:443 | AMBIGUA | La combinación privada y puerto origen es posible si el servicio web remoto usa HTTPS/443, pero el prompt y la imagen no declaran HTTP ni HTTPS. |
| 2 | Origen 192.168.1.101:48200 – Destino 192.168.1.1:80 | INCORRECTA | Ese destino es la interfaz LAN del router. |
| 3 | Origen 200.40.20.1:48200 – Destino 152.0.10.5:80 | INCORRECTA | Es el paquete después de traducir el origen a la IP pública. |
| 4 | Origen 192.168.1.101:48200 – Destino 152.0.10.5:80 | AMBIGUA | La combinación privada y puerto origen es posible si el servicio web remoto usa HTTP/80, pero el prompt y la imagen no declaran HTTP ni HTTPS. |
| 5 | Origen 192.168.1.101:48201 – Destino 152.0.10.5:80 | INCORRECTA | 48201 es la asignación externa para otra asociación; PC1 usa 48200. |

**Fundamento general registrado:**

La imagen identifica PC1 192.168.1.101:48200 y servidor 152.0.10.5, pero no especifica el puerto del servidor. La opción que usa puerto 80 presupone HTTP y la que usa 443 presupone HTTPS; el texto solo dice “servidor web”. Ambas son posibles antes de PAT, por lo que no se establece una clave única.

**Observaciones:**
- Topología reconstruida; los valores se leen en la ilustración y el enunciado.
- La clave no se incorpora al simulacro mientras falte el dato indicado.

**Problemas y límites:**
- La imagen identifica PC1 192.168.1.101:48200 y servidor 152.0.10.5, pero no especifica el puerto del servidor. La opción que usa puerto 80 presupone HTTP y la que usa 443 presupone HTTPS; el texto solo dice “servidor web”. Ambas son posibles antes de PAT, por lo que no se establece una clave única.

**Evidencia visual asociada:**
- `assets/image-2c8bbd2ccf3db927605682c5.png` — SHA-256 `2c8bbd2ccf3db927605682c536e2170505bc3301e5164f39fc28e6afd0280b6d`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** image-2c8bbd2ccf3db927605682c5.png identifica PC1 192.168.1.101, PC2 192.168.1.102, interfaz interna del router 192.168.1.1, pública 200.40.20.1 y servidor 152.0.10.5. No indica si es HTTP/80 o HTTPS/443; “servidor web” no fija el puerto.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-2c8bbd2ccf3db927605682c5.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 11–13 — PAT antes y después de traducción. La filmina explica traducción de puertos y asociaciones privadas/públicas.

---

### Pregunta 67 — PROVISIONAL → PROVISIONAL

**ID:** `q-9fdfb475f1fc9cea407a1a0365af224e2d59519e2ec022e83f1ebc6364b66496`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. No se muestra el puerto del servidor; la procedencia del gráfico es reconstruida y no se cotejó con una fotografía original.  

**Enunciado literal:**

> Observe la topología de la imagen. PC1 y luego PC2 se conectan al servidor web usando el mismo puerto de origen 48200 y el router realiza PAT. ¿Qué información tiene el paquete de PC2 hacia el servidor capturado en el switch (red privada)?

**Decisión y clave:**

Permanece PROVISIONAL. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Origen 200.40.20.1:48201 – Destino 152.0.10.5:80 | INCORRECTA | Describe el paquete después de PAT, no el capturado en LAN. |
| 2 | Origen 192.168.1.102:48200 – Destino 152.0.10.5:80 | AMBIGUA | La combinación privada y puerto origen es coherente antes de PAT si el servicio remoto usa HTTP/80; el enunciado no especifica ese puerto y no excluye HTTPS. |
| 3 | Origen 192.168.1.102:48201 – Destino 152.0.10.5:80 | INCORRECTA | 48201 es el puerto exterior asignado por PAT. |
| 4 | Origen 192.168.1.101:48200 – Destino 152.0.10.5:80 | INCORRECTA | Esa dirección es PC1. |
| 5 | Origen 192.168.1.102:48200 – Destino 200.40.20.1:80 | INCORRECTA | El destino interno es el servidor web, no el router. |

**Fundamento general registrado:**

La imagen identifica PC2 192.168.1.102 y el servidor 152.0.10.5; el texto da el puerto de origen 48200. Ninguno especifica si el servidor web atiende por HTTP/80 o HTTPS/443. La alternativa con puerto destino 80 depende de una suposición no declarada; queda sin puntuar.

**Observaciones:**
- Topología reconstruida; los valores se leen en la ilustración y el enunciado.
- La clave no se incorpora al simulacro mientras falte el dato indicado.

**Problemas y límites:**
- La imagen identifica PC2 192.168.1.102 y el servidor 152.0.10.5; el texto da el puerto de origen 48200. Ninguno especifica si el servidor web atiende por HTTP/80 o HTTPS/443. La alternativa con puerto destino 80 depende de una suposición no declarada; queda sin puntuar.

**Evidencia visual asociada:**
- `assets/image-2c8bbd2ccf3db927605682c5.png` — SHA-256 `2c8bbd2ccf3db927605682c536e2170505bc3301e5164f39fc28e6afd0280b6d`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** image-2c8bbd2ccf3db927605682c5.png identifica PC1 192.168.1.101, PC2 192.168.1.102, interfaz interna del router 192.168.1.1, pública 200.40.20.1 y servidor 152.0.10.5. No indica si es HTTP/80 o HTTPS/443; “servidor web” no fija el puerto.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-2c8bbd2ccf3db927605682c5.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 11–13 — PAT antes y después de traducción. La filmina distingue el puerto local del puerto exterior asignado por PAT.

---

### Pregunta 72 — PROVISIONAL → VERIFICADA

**ID:** `q-eb9100f0c6306feda616f3f51a023ac4e97a0da72a98a7d18a1587d8104c67a8`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿A qué dispositivo pertenece la tabla de enrutamiento?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — Router1.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Router2 | INCORRECTA | Las conectadas y dirección local representadas corresponden a Router1. |
| 2 | Router1 **(clave puntuable)** | CORRECTA | Correcta bajo la topología y tabla reconstruidas. |
| 3 | Router3 | INCORRECTA | No corresponde a Router3, conectado a .30 y .50. |

**Fundamento general registrado:**

[Respuesta] La tabla pertenece a Router1: la topología lo conecta a las redes .10, .20 y .30, y esas mismas redes aparecen directamente conectadas (C) en la tabla. [Procedencia] La identificación se refiere al diagrama presentado; la topología fue mejorada y no se cotejó con una fotografía original del examen.

**Observaciones:**
- Tabla reconstruida; los datos se cotejaron visualmente con la topología.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-bc41ff13990cee57d1e3945e.png` — SHA-256 `bc41ff13990cee57d1e3945e77bd6b6374cb650b42cb857ae76b75191e7f1992`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-bc41ff13990cee57d1e3945e.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — Códigos de rutas conectadas y locales. La filmina explica códigos de ruta y direcciones conectadas/locales; la identidad se coteja con la topología.

---

### Pregunta 73 — PROVISIONAL → VERIFICADA

**ID:** `q-a03eac4aa5e021ce54edd7573cb49f32e2181335f135545ca67436611dd84e75`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.30.0/24?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Porque se encuentra directamente conectada al equipo.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Porque se encuentra directamente conectada al equipo **(clave puntuable)** | CORRECTA | Correcta: C significa conectada directamente. |
| 2 | Por enrutamiento estático | INCORRECTA | Una ruta estática se marcaría S. |
| 3 | Por enrutamiento dinámico OSPF | INCORRECTA | OSPF se identificaría con O. |
| 4 | Por loopback | INCORRECTA | No es una ruta local L/loopback. |
| 5 | Por enrutamiento dinámico RIP | INCORRECTA | RIP se marca R. |

**Fundamento general registrado:**

[Respuesta] 192.168.30.0/24 aparece con código C, que indica red directamente conectada al router.

**Observaciones:**
- Lectura de tabla reconstruida.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-bc41ff13990cee57d1e3945e.png` — SHA-256 `bc41ff13990cee57d1e3945e77bd6b6374cb650b42cb857ae76b75191e7f1992`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-bc41ff13990cee57d1e3945e.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — Códigos C, L y R. La filmina distingue rutas conectadas de rutas aprendidas dinámicamente.

---

### Pregunta 74 — PROVISIONAL → VERIFICADA

**ID:** `q-5f799619336c84d5718b730e2773f001bfd3327edd9cd63ab907cba37fd7a45a`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.60.0/24?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 4 — Por enrutamiento dinámico RIP.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Por enrutamiento dinámico OSPF | INCORRECTA | OSPF usaría el código O. |
| 2 | Por loopback | INCORRECTA | No es loopback; la ruta apunta a próximos saltos remotos. |
| 3 | Por enrutamiento estático | INCORRECTA | Una estática se marcaría S. |
| 4 | Por enrutamiento dinámico RIP **(clave puntuable)** | CORRECTA | Correcta: R identifica RIP, aunque se muestren dos próximos saltos de igual costo. |
| 5 | Porque se encuentra directamente conectada al equipo | INCORRECTA | No es directamente conectada (C). |

**Fundamento general registrado:**

[Respuesta] 192.168.60.0/24 aparece con código R y distancia/métrica [120/1]; el código R identifica una ruta aprendida por RIP.

**Observaciones:**
- Lectura de tabla reconstruida; sus dos próximos saltos se cotejaron visualmente.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-bc41ff13990cee57d1e3945e.png` — SHA-256 `bc41ff13990cee57d1e3945e77bd6b6374cb650b42cb857ae76b75191e7f1992`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-bc41ff13990cee57d1e3945e.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — RIP, distancia administrativa y métrica. La filmina asigna R/AD 120 a RIP y explica métrica por saltos.

---

### Pregunta 75 — PROVISIONAL → VERIFICADA

**ID:** `q-a16ba4d412ab02030db1269a1d759a79f85cb3e017e24635bee0043d217d8fe6`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Qué indica el valor 120 en la notación [120/1]?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 4 — Indica la distancia administrativa de la ruta.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Indica el valor del mejor camino | INCORRECTA | No es un valor unitario de mejor camino. |
| 2 | Indica la métrica de la ruta | INCORRECTA | La métrica es el segundo campo (1). |
| 3 | Indica la prioridad de la ruta | INCORRECTA | La prioridad aquí corresponde a distancia administrativa, no a otro campo. |
| 4 | Indica la distancia administrativa de la ruta **(clave puntuable)** | CORRECTA | Correcta: 120 es la distancia administrativa. |

**Fundamento general registrado:**

[Respuesta] En [120/1], 120 es la distancia administrativa de RIP y 1 es su métrica. Las filminas de la cátedra muestran AD 120 para RIP.

**Observaciones:**
- La notación se lee en una tabla reconstruida.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-bc41ff13990cee57d1e3945e.png` — SHA-256 `bc41ff13990cee57d1e3945e77bd6b6374cb650b42cb857ae76b75191e7f1992`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-fb74a0786354509729acea92.png se leen rutas R a 192.168.10.0/24 vía 192.168.30.1; 192.168.20.0/24 vía 192.168.30.1 y 192.168.70.1; 192.168.40.0/24 vía 192.168.70.1; y 192.168.60.0/24 vía 192.168.70.1. La tabla muestra C para 192.168.30.0/24 (Serial0/1/0), 192.168.50.0/24 (GigabitEthernet0/0/0) y 192.168.70.0/24 (Serial0/1/1). Las direcciones L observadas son 192.168.30.2/32, 192.168.50.1/32 y 192.168.70.2/32. Las dos rutas de igual costo a 192.168.20.0/24 se conservan como dos líneas. Esto verifica el escenario mostrado, no su procedencia histórica.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-bc41ff13990cee57d1e3945e.png`. Aporta la topología, captura o tabla específica; el tipo de reconstrucción se declara en observaciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — AD y métrica RIP. La filmina muestra AD 120 para RIP y la notación AD/métrica.

---

### Pregunta 79 — AMBIGUA → AMBIGUA

**ID:** `q-bc25ccc6854ea5211b58b91767fb5c64184c68ecefb1cfc612647f7a8b14b7cc`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. La captura muestra puertos 22, 443 y 8080; no identifica procesos ni el servicio realmente asociado.  

**Enunciado literal:**

> La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo. ¿Qué servicios puede asegurar que están corriendo en el servidor?

**Decisión y clave:**

Permanece AMBIGUA. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | SSH | AMBIGUA | TCP/22 es el puerto convencional de SSH, pero el listener no identifica la aplicación y la captura también muestra TCP/443. |
| 2 | DNS | INCORRECTA | No aparece DNS/53. |
| 3 | DHCP | INCORRECTA | No aparecen puertos DHCP. |
| 4 | HTTP | AMBIGUA | TCP/8080 puede alojar HTTP, pero el puerto no identifica el proceso ni el servicio; la salida no permite asegurarlo. |
| 5 | Telnet | INCORRECTA | No aparece Telnet/23. |
| 6 | FTP | INCORRECTA | No aparecen puertos FTP/20–21. |
| 7 | HTTPS | AMBIGUA | TCP/443 es el puerto convencional de HTTPS, pero el listener no identifica la aplicación y la captura también muestra TCP/22. |

**Fundamento general registrado:**

[Problema] La salida muestra listeners TCP en 22, 443 y 8080. SSH/22 y HTTPS/443 son dos asociaciones convencionales plausibles; 8080 también puede alojar HTTP, aunque el puerto no identifica la aplicación. Netstat no acredita qué proceso está detrás y la pregunta pide una única respuesta.

**Observaciones:**
- Se leen dos servicios de la lista en una pregunta configurada de opción única.
- La decisión no resuelve una clave; la pregunta debe permanecer sin puntuación.

**Problemas y límites:**
- [Problema] La salida muestra listeners TCP en 22, 443 y 8080. SSH/22 y HTTPS/443 son dos asociaciones convencionales plausibles; 8080 también puede alojar HTTP, aunque el puerto no identifica la aplicación. Netstat no acredita qué proceso está detrás y la pregunta pide una única respuesta.

**Evidencia visual asociada:**
- `assets/image-2ce63dd5cad3d702e14de445.png` — SHA-256 `2ce63dd5cad3d702e14de445aea4aa59247712f226aba95b8d29ae0e87b99168`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** image-2ce63dd5cad3d702e14de445.png lista TCP 0.0.0.0:22, :443 y :8080, todos en LISTEN. 22 suele asociarse a SSH y 443 a HTTPS; el estado del socket no identifica el proceso ni demuestra que use el servicio convencional. Hay más de una opción plausible.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-2ce63dd5cad3d702e14de445.png`. Captura/topología que contiene los valores observados; el estado de reconstrucción consta en observaciones.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 31–33 — Puertos de servicios y netstat. La filmina permite asociar TCP/22 a SSH y TCP/443 a HTTPS; 8080 no identifica un protocolo estándar único.

---

### Pregunta 83 — AMBIGUA → AMBIGUA

**ID:** `q-ad81b98133518664126342919f01b3763cff2e9dfde234dc14623fe4c1eb8476`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> ¿Qué contiene la envoltura de un mensaje SMTP?

**Decisión y clave:**

Permanece AMBIGUA. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Asunto y cuerpo del mensaje | INCORRECTA | Asunto y cuerpo son contenido del mensaje, no el sobre de transporte. |
| 2 | Prioridad y nivel de seguridad | INCORRECTA | No describe el sobre. |
| 3 | Versión de POP y versión de SMTP | INCORRECTA | El sobre no contiene versiones de POP/SMTP. |
| 4 | Remitente y versión de SMTP | INCORRECTA | Menciona remitente, pero omite los destinatarios RCPT TO y agrega una versión de SMTP que no integra el sobre; como alternativa completa es incorrecta. |

**Fundamento general registrado:**

[Problema] El sobre SMTP se compone de la dirección de retorno (MAIL FROM) y los destinatarios (RCPT TO). Ninguna opción describe ambos. La alternativa “remitente y versión de SMTP” es incompleta y agrega un dato que no pertenece al sobre. El ítem no ofrece una respuesta válida.

**Observaciones:**
- La alternativa completa “remitente y destinatario” no aparece.
- La decisión no resuelve una clave; la pregunta debe permanecer sin puntuación.

**Problemas y límites:**
- [Problema] El sobre SMTP se compone de la dirección de retorno (MAIL FROM) y los destinatarios (RCPT TO). Ninguna opción describe ambos. La alternativa “remitente y versión de SMTP” es incompleta y agrega un dato que no pertenece al sobre. El ítem no ofrece una respuesta válida.

**Fuentes específicas:**
- 3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf, visor pp. 30–32 — Sobre SMTP y contenido del mensaje. La filmina diferencia sobre de transporte, cabeceras y cuerpo.
- RFC 5321 — Simple Mail Transfer Protocol, §§3.3, 4.1.1.2–4.1.1.3 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc5321.html)). MAIL FROM y RCPT TO identifican remitente y destinatarios de la transacción SMTP.

---

### Pregunta 108 — PROVISIONAL → VERIFICADA

**ID:** `q-3d06c1b3702e6b2de6d6ee3bbb7f6516c1779d7dc778c22b08133b67d3b4160c`  
**Tipo y cantidad exigida:** `multiple`; 2 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> ¿Cuáles de las siguientes afirmaciones sobre las banderas del encabezado TCP son correctas? (seleccione dos opciones)

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — PSH le pide al receptor que entregue los datos de inmediato a la aplicación; 6 — CWR lo activa el emisor para avisar al receptor que ya redujo la tasa de transferencia.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | ECE lo usa el cliente para iniciar el cierre de la sesión | INCORRECTA | ECE refleja ECN, no cierre. |
| 2 | URG indica que el número de ACK tiene prioridad máxima | INCORRECTA | URG marca datos urgentes, no el ACK. |
| 3 | PSH le pide al receptor que entregue los datos de inmediato a la aplicación **(clave puntuable)** | CORRECTA | Correcta en el modelo docente: PSH solicita entrega pronta a aplicación. |
| 4 | FIN se usa para reestablecer una conexión o rechazar un segmento inválido | INCORRECTA | FIN cierra; RST reinicia. |
| 5 | ACK está en 0 en todos los segmentos una vez establecida la conexión | INCORRECTA | ACK suele estar activo tras establecerse, no en 0. |
| 6 | CWR lo activa el emisor para avisar al receptor que ya redujo la tasa de transferencia **(clave puntuable)** | CORRECTA | Correcta en esencia; RFC 3168 relaciona CWR con reducción de ventana. |

**Fundamento general registrado:**

[Respuesta] PSH marca datos que la aplicación solicita entregar prontamente al receptor; CWR informa que el emisor ya reaccionó a la señal de congestión reduciendo su ventana. [Precisión] La expresión “tasa de transferencia” sigue el vocabulario de la filmina de la cátedra; en TCP estricto CWR señala la reacción ECN, no un caudal numérico ni una tasa concreta.

**Observaciones:**
- PSH no garantiza latencia cero; CWR reporta reacción/reducción de cwnd, no una tasa específica.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Fuentes específicas:**
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 17–26 — Flags TCP/ECN. PSH, FIN, URG y CWR.
- RFC 3168 — ECN, §6.1.2 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3168.html)). El emisor reduce cwnd y activa CWR tras ECE.
- 3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf, visor pp. 17–19 — Banderas TCP. La filmina asocia PSH con entrega a la aplicación y CWR con la reacción de reducción del emisor.
- RFC 9293 — Transmission Control Protocol, §§3.1.1, 3.9.1.2 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc9293.html)). Define PSH como función push y CWR como Congestion Window Reduced.
- RFC 3168 — The Addition of Explicit Congestion Notification to IP, §6.1.4 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc3168.html)). El emisor establece CWR después de reaccionar a una notificación ECN.

---

### Pregunta 111 — PROVISIONAL → VERIFICADA

**ID:** `q-a9917d13b3303eecbf7bae092de767f6a7801211b09904df0f54dae5916de9e9`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> En un gateway que aplica PAT y filtrado con estado, ¿qué efecto podría observarse al aumentar mucho la cantidad de conexiones simultáneas?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Puede aumentar el consumo de CPU y memoria por las traducciones, el filtrado y el seguimiento de conexiones.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Puede aumentar el consumo de CPU y memoria por las traducciones, el filtrado y el seguimiento de conexiones **(clave puntuable)** | CORRECTA | Correcta como efecto posible de tablas mayores. |
| 2 | El firewall deja de distinguir TCP de UDP porque ambos usan números de puerto | INCORRECTA | TCP y UDP siguen diferenciándose. |
| 3 | Cada conexión pasa a requerir una dirección IP pública propia | INCORRECTA | PAT multiplica sesiones mediante puertos, no direcciones por conexión. |
| 4 | PAT cifra cada paquete antes de que el firewall evalúe sus reglas | INCORRECTA | PAT no cifra. |

**Fundamento general registrado:**

[Respuesta] Más conexiones simultáneas pueden crear más entradas de traducción y seguimiento con estado, aumentando el trabajo de CPU y la memoria utilizada. Las filminas advierten que NAT puede ser un cuello de botella y que el router mantiene estado; el enunciado pregunta por un efecto posible, no por una cantidad fija.

**Observaciones:**
- Efecto razonable inferido; la fuente no cuantifica recursos por conexión.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Fuentes específicas:**
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–13 — PAT y mapeos. Mantiene asociaciones de traducción.
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, visor pp. 30–31 — Firewall con estado. Mantiene tabla dinámica de conexiones.
- 3 - 03 - RDD - Unidad 5 - NAT - PAT.pdf, visor pp. 4–11 — Estado NAT/PAT y posible cuello de botella. El router mantiene tablas/tracking de traducción; NAT puede ser un cuello de botella.

---

### Pregunta 117 — PROVISIONAL → VERIFICADA

**ID:** `q-89e1ab54fbea82abb3b84653fd80a12c926799de3f2713736ff55fcca4898e14`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿A qué dispositivo pertenece la tabla de enrutamiento?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 1 — Router2.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Router2 **(clave puntuable)** | CORRECTA | Correcta bajo la topología observada. |
| 2 | Router1 | INCORRECTA | Router1 se conecta con .10/.20/.30. |
| 3 | Switch2 | INCORRECTA | Switch no muestra esta tabla. |
| 4 | AccessPoint0 | INCORRECTA | AP no es el router. |
| 5 | Router3 | INCORRECTA | Router3 se conecta .30/.50/.70, no .40/.60. |

**Fundamento general registrado:**

[Respuesta] La tabla pertenece a Router2: sus redes conectadas .20, .40, .60 y .70 coinciden con los enlaces de Router2 en la topología. [Procedencia] Se verificó la tabla presentada; el material de extracción identifica el gráfico como reconstruido. No se acredita fidelidad histórica.

**Observaciones:**
- Tabla reconstruida; q119 muestra una duplicidad inconsistente.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-42a2abb1e63652c10014ce21.png` — SHA-256 `42a2abb1e63652c10014ce21e81588a799bdc138bd69fac91c92b98485f61fd0`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-42a2abb1e63652c10014ce21.png se lee R 192.168.30.0/24 por 192.168.20.1 y 192.168.70.2; las redes C incluyen 192.168.20.0/24, 40.0/24, 60.0/24, 70.0/24 y 80.0/24, con rutas locales L de interfaz, incluida 192.168.70.1/32 en Serial0/1/1. La fila R y la C para 192.168.70.0/24 coexisten en la reconstrucción y hacen que q119 no tenga una resolución segura; no se deduce qué fila fue transcrita mal.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-42a2abb1e63652c10014ce21.png`. Captura/topología examinada visualmente; véanse observaciones sobre reconstrucciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — Rutas conectadas y locales. C/L cotejadas con topología.

---

### Pregunta 118 — PROVISIONAL → VERIFICADA

**ID:** `q-54e01ccad9675aa4eee19d381856ed2fbfbfdccc61f8f28b0d454f19afadeaa0`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.30.0/24?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 2 — Mediante el protocolo RIP.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Está directamente conectada | INCORRECTA | C sería conectada. |
| 2 | Mediante el protocolo RIP **(clave puntuable)** | CORRECTA | Correcta: R = RIP. |
| 3 | Mediante el protocolo OSPF | INCORRECTA | OSPF se marca O. |
| 4 | Mediante una ruta estática | INCORRECTA | Estática se marca S. |

**Fundamento general registrado:**

[Respuesta] La entrada 192.168.30.0/24 está marcada R, por lo que se aprendió mediante RIP.

**Observaciones:**
- Tabla reconstruida, cotejada visualmente.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-42a2abb1e63652c10014ce21.png` — SHA-256 `42a2abb1e63652c10014ce21e81588a799bdc138bd69fac91c92b98485f61fd0`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-42a2abb1e63652c10014ce21.png se lee R 192.168.30.0/24 por 192.168.20.1 y 192.168.70.2; las redes C incluyen 192.168.20.0/24, 40.0/24, 60.0/24, 70.0/24 y 80.0/24, con rutas locales L de interfaz, incluida 192.168.70.1/32 en Serial0/1/1. La fila R y la C para 192.168.70.0/24 coexisten en la reconstrucción y hacen que q119 no tenga una resolución segura; no se deduce qué fila fue transcrita mal.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-42a2abb1e63652c10014ce21.png`. Captura/topología examinada visualmente; véanse observaciones sobre reconstrucciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — Código RIP. R identifica RIP, AD 120.

---

### Pregunta 119 — AMBIGUA → AMBIGUA

**ID:** `q-d464c1c8de0b704fc84ce85c760f824c1abb241eb352cb0420a8ef64dd2b4a43`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. La tabla contiene R y C para el mismo /24; foto de examen original no hallada.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Cómo aprendió este router la red 192.168.70.0/24?

**Decisión y clave:**

Permanece AMBIGUA. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Está directamente conectada | AMBIGUA | La tabla sí muestra una ruta C para 192.168.70.0/24, pero también dos rutas R al mismo prefijo, inconsistencia que impide decidir qué fila se transcribió mal. |
| 2 | Mediante una ruta estática | INCORRECTA | No aparece una ruta estática S; la contradicción visible es entre las entradas C y R. |
| 3 | Mediante el protocolo RIP | AMBIGUA | La tabla sí muestra rutas R para 192.168.70.0/24, pero también una ruta C al mismo prefijo, inconsistencia que impide establecer cuál se pretendía evaluar. |
| 4 | Mediante el protocolo OSPF | INCORRECTA | La tabla no muestra código O de OSPF para ese prefijo. |

**Fundamento general registrado:**

[Problema] La tabla de la imagen asigna simultáneamente 192.168.70.0/24 a rutas R por RIP y a una ruta C directamente conectada. La misma tabla indica una ruta local L 192.168.70.1/32 en Serial0/1/1. En una tabla instalada, la ruta conectada (AD 0) debe prevalecer sobre RIP (AD 120); la coexistencia mostrada es inconsistente. La topología y tabla son de una reconstrucción y las fotos disponibles reproducen la pantalla del cuestionario, no una fuente de examen independiente. No se infiere qué fila fue transcrita mal.

**Observaciones:**
- La tabla reconstruida contiene simultáneamente R y C para 192.168.70.0/24.
- La decisión no resuelve una clave; la pregunta debe permanecer sin puntuación.

**Problemas y límites:**
- [Problema] La tabla de la imagen asigna simultáneamente 192.168.70.0/24 a rutas R por RIP y a una ruta C directamente conectada. La misma tabla indica una ruta local L 192.168.70.1/32 en Serial0/1/1. En una tabla instalada, la ruta conectada (AD 0) debe prevalecer sobre RIP (AD 120); la coexistencia mostrada es inconsistente. La topología y tabla son de una reconstrucción y las fotos disponibles reproducen la pantalla del cuestionario, no una fuente de examen independiente. No se infiere qué fila fue transcrita mal.

**Evidencia visual asociada:**
- `assets/image-42a2abb1e63652c10014ce21.png` — SHA-256 `42a2abb1e63652c10014ce21e81588a799bdc138bd69fac91c92b98485f61fd0`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-42a2abb1e63652c10014ce21.png se lee R 192.168.30.0/24 por 192.168.20.1 y 192.168.70.2; las redes C incluyen 192.168.20.0/24, 40.0/24, 60.0/24, 70.0/24 y 80.0/24, con rutas locales L de interfaz, incluida 192.168.70.1/32 en Serial0/1/1. La fila R y la C para 192.168.70.0/24 coexisten en la reconstrucción y hacen que q119 no tenga una resolución segura; no se deduce qué fila fue transcrita mal.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-42a2abb1e63652c10014ce21.png`. Captura/topología examinada visualmente; véanse observaciones sobre reconstrucciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — Códigos C y R. La filmina diferencia códigos de rutas y AD; la reconstrucción muestra rutas duplicadas.

---

### Pregunta 120 — PROVISIONAL → VERIFICADA

**ID:** `q-c469b1a3f9e57c4a9c86b46c65b5629fd32d92bce919e6768084f495359ed717`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Valores de la imagen cotejados visualmente contra la pregunta. La imagen pertenece a los recursos del cuestionario; su fidelidad al examen original no se verificó.  

**Enunciado literal:**

> Observe la topología y la tabla de enrutamiento de la imagen. ¿Qué indica el valor 1 en la notación [120/1]?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — La métrica de RIP: la cantidad de saltos hasta la red destino.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | La cantidad de rutas disponibles hacia la red destino | INCORRECTA | No es cantidad de rutas. |
| 2 | La distancia administrativa del protocolo RIP | INCORRECTA | 120 es AD, no el segundo valor. |
| 3 | La métrica de RIP: la cantidad de saltos hasta la red destino **(clave puntuable)** | CORRECTA | Correcta: métrica en saltos. |
| 4 | El número de la interfaz de salida | INCORRECTA | La interfaz se especifica aparte. |
| 5 | Los minutos transcurridos desde la última actualización | INCORRECTA | El tiempo es otro campo. |

**Fundamento general registrado:**

[Respuesta] En la ruta RIP [120/1], el segundo valor es la métrica; en RIP representa el número de saltos, aquí un salto.

**Observaciones:**
- Dato leído en tabla reconstruida.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Evidencia visual asociada:**
- `assets/image-42a2abb1e63652c10014ce21.png` — SHA-256 `42a2abb1e63652c10014ce21e81588a799bdc138bd69fac91c92b98485f61fd0`; tipo: `downloaded_original`; Imagen de la pregunta.

**Cotejo de la imagen:** En image-42a2abb1e63652c10014ce21.png se lee R 192.168.30.0/24 por 192.168.20.1 y 192.168.70.2; las redes C incluyen 192.168.20.0/24, 40.0/24, 60.0/24, 70.0/24 y 80.0/24, con rutas locales L de interfaz, incluida 192.168.70.1/32 en Serial0/1/1. La fila R y la C para 192.168.70.0/24 coexisten en la reconstrucción y hacen que q119 no tenga una resolución segura; no se deduce qué fila fue transcrita mal.

**Fuentes específicas:**
- Imagen del cuestionario `assets/image-42a2abb1e63652c10014ce21.png`. Captura/topología examinada visualmente; véanse observaciones sobre reconstrucciones.
- 2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf, visor pp. 8–9 — AD y métrica RIP. 120 AD; 1 salto.

---

### Pregunta 122 — PROVISIONAL → VERIFICADA

**ID:** `q-b379f7cd8f4a541cd21dd1899658e3338f8f79484593b0bb27426232414d579e`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> ¿Qué comando consulta cualquier tipo de registro que tenga asociado el dominio miempresa.com.ar?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 3 — nslookup -type=ANY miempresa.com.ar.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | nslookup -type=CUALQ miempresa.com.ar | INCORRECTA | CUALQ no es tipo estándar. |
| 2 | nslookup miempresa.com.ar | INCORRECTA | No pide ANY. |
| 3 | nslookup -type=ANY miempresa.com.ar **(clave puntuable)** | CORRECTA | Correcta: `-type=ANY` formula esa consulta, sin garantizar respuesta exhaustiva. |
| 4 | nslookup -type=NONE miempresa.com.ar | INCORRECTA | NONE no es el tipo pretendido. |

**Fundamento general registrado:**

[Respuesta] `nslookup -type=ANY miempresa.com.ar` formula una consulta DNS con QTYPE=ANY. [Precisión] ANY no garantiza que el servidor entregue todos los conjuntos de registros; la clave se refiere al tipo de consulta que solicita el comando.

**Observaciones:**
- “Consulta cualquier tipo” se interpreta como enviar QTYPE=ANY, no como obtener todos los tipos existentes.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Fuentes específicas:**
- 3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf, visor pp. 20–21 — Consulta nslookup por tipo. La filmina enseña consultas tipadas.
- RFC 8482 — Minimal Responses for DNS Queries with QTYPE=ANY, §§1–2 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc8482.html)). ANY es QTYPE válido; no garantiza la devolución de todos los RRsets.
- RFC 8482 — Providing Minimal-Sized Responses to DNS Queries That Have QTYPE=ANY, §§1, 4, 7 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc8482.html)). ANY es QTYPE válido, pero una respuesta puede ser mínima o incluir un subconjunto de RRsets.

---

### Pregunta 123 — PROVISIONAL → VERIFICADA

**ID:** `q-6a366dfa2883a2bcfac9476fd14d2e31d38ee7cc6bad1937114471647d83c3f9`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** MEDIA.  
**Fidelidad al escenario mostrado:** VERIFICADA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> Ana le envía a Juan CJ(CA(P)), donde CA es la clave privada de Ana y CJ la clave pública de Juan. ¿Qué aporta cada capa y cómo recupera Juan el texto?

**Decisión y clave:**

Se puntúa para el escenario documentado. Clave: 4 — La interna (privada de Ana) da autenticación y no repudio, y la externa (pública de Juan) confidencialidad. Juan descifra con su privada y luego con la pública de Ana.
Cambio: promovida a VERIFICADA tras cotejar enunciado y alternativas con datos legibles de la imagen/tabla y fuentes de cátedra. Esta promoción se limita al escenario presentado; no certifica fidelidad histórica al examen.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | La externa autentica a Juan y la interna da integridad. Juan descifra con la pública de Ana y después con su privada | INCORRECTA | Funciones/llaves están intercambiadas. |
| 2 | Las dos capas solo dan confidencialidad. Juan descifra ambas con la privada de Ana | INCORRECTA | No aporta solo confidencialidad; privada de Ana no se usa para descifrar ambas capas. |
| 3 | La interna da confidencialidad y la externa no repudio. Juan descifra con la pública de Ana y después con su propia pública | INCORRECTA | Confidencialidad externa sí, pero la verificación no usa pública de Juan. |
| 4 | La interna (privada de Ana) da autenticación y no repudio, y la externa (pública de Juan) confidencialidad. Juan descifra con su privada y luego con la pública de Ana **(clave puntuable)** | CORRECTA | Correcta en el esquema didáctico; “verifica”, no necesariamente descifra genéricamente la firma. |

**Fundamento general registrado:**

[Respuesta] En el modelo simbólico enseñado en la filmina, Ana aplica su clave privada al mensaje (firma) y envuelve el resultado con la clave pública de Juan (confidencialidad). Juan quita la capa externa con su clave privada y verifica la firma usando la clave pública de Ana. [Precisión] En criptografía moderna esa última operación se denomina verificar la firma, no descifrar datos arbitrarios con una clave pública; la alternativa describe el modelo de la cátedra.

**Observaciones:**
- Modelo simbólico RSA didáctico; la verificación moderna de firma es una operación específica, no descifrado general.
- La clave se verificó para el escenario y el texto que muestra el cuestionario. La fidelidad histórica al examen no se presume; véase evidenceAssessment.

**Fuentes específicas:**
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, visor pp. 19–22 — Firma y cifrado asimétrico. Firma con privada de Ana y verificación pública; confidencialidad para destinatario.
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, visor pp. 19–23 — Firma digital de clave pública y resumen de mensajes. La filmina de la cátedra describe la capa privada de Ana y el cifrado con la clave pública de Juan.

---

### Pregunta 127 — AMBIGUA → AMBIGUA

**ID:** `q-96f1748132d556ec2f1315a373676a5e53a184be89347f30dab24877f53ccd79`  
**Tipo y cantidad exigida:** `single`; 1 respuesta(s).  
**Confianza registrada:** ALTA.  
**Fidelidad al escenario mostrado:** INCOMPLETA.  
**Fidelidad histórica al examen:** NO_VERIFICABLE. Texto cotejado contra las filminas indicadas; no se halló fotografía independiente del examen para confirmar su redacción histórica.  

**Enunciado literal:**

> Una sucursal envía órdenes de pago a casa central por un enlace cifrado. Un atacante no puede leerlas, pero modifica algunos bits y casa central procesa datos distintos. ¿Qué tipo de amenaza ocurrió y qué faltó?

**Decisión y clave:**

Permanece AMBIGUA. selectedOptionIds está vacío: no hay clave puntuable ni respuesta correcta revelada por la aplicación.

**Evaluación de todas las alternativas:**

| Opción | Texto literal | Evaluación | Fundamento individual |
|---|---|---|---|
| 1 | Modificación, ataca la integridad. El cifrado solo da confidencialidad y faltaba un hash para detectar la alteración | AMBIGUA | La categoría modificación/integridad es correcta, pero un hash sin clave o autenticación puede ser recalculado por el atacante activo; la solución propuesta no alcanza. |
| 2 | Interceptación, ataca la confidencialidad. Faltaba una clave más larga | INCORRECTA | No es solo interceptación/confidencialidad. |
| 3 | Interrupción, ataca la disponibilidad. Faltaba un firewall con estado | INCORRECTA | No afecta disponibilidad. |
| 4 | Invención, ataca la autenticidad. Faltaba cifrar dos veces | INCORRECTA | No es invención y doble cifrado no garantiza integridad. |

**Fundamento general registrado:**

[Problema] La amenaza descrita es modificación y afecta integridad. Sin embargo, un hash sin clave o autenticación puede recalcularse por el atacante activo; la alternativa 1 es insuficiente como solución de seguridad. Haría falta un MAC/HMAC, una firma digital verificable o cifrado autenticado (AEAD), pero ninguna opción lo ofrece.

**Observaciones:**
- Opción 1 parece esperada por la filmina, pero no alcanza para modificar datos maliciosamente y recalcular un hash simple.
- La decisión no resuelve una clave; la pregunta debe permanecer sin puntuación.

**Problemas y límites:**
- [Problema] La amenaza descrita es modificación y afecta integridad. Sin embargo, un hash sin clave o autenticación puede recalcularse por el atacante activo; la alternativa 1 es insuficiente como solución de seguridad. Haría falta un MAC/HMAC, una firma digital verificable o cifrado autenticado (AEAD), pero ninguna opción lo ofrece.

**Fuentes específicas:**
- 3 - 06 - RRD - Unidad 6 - Seguridad.pdf, visor pp. 16–17 — Integridad y hash. La diapositiva trata hash como integridad, pero no cubre autenticación contra recálculo adversarial.
- RFC 5116 — Authenticated Encryption, §1, Introduction ([fuente primaria](https://www.rfc-editor.org/rfc/rfc5116.html)). La autenticación de mensajes protege integridad frente a alteración; puede usarse MAC o AEAD.
- RFC 5116 — An Interface and Algorithms for Authenticated Encryption, §1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc5116.html)). AEAD combina confidencialidad con autenticación del ciphertext y datos asociados.
- RFC 2104 — HMAC: Keyed-Hashing for Message Authentication, §1 ([fuente primaria](https://www.rfc-editor.org/rfc/rfc2104.html)). Un MAC basado en hash y clave compartida valida integridad y autenticidad, a diferencia de un hash simple.

---

## Integridad y no-regresión

- No se editaron preguntas-sin-resolver.json, preguntas-resueltas.json, los DOCX originales, los assets originales ni el código de JoyaCards.
- Los campos fuente de extracción, por pregunta, coinciden con el JSON original.
- Las 92 resoluciones verificadas de referencia se conservaron exactamente.
- Las 585 alternativas tienen evaluación en JSON V2. Solo 123 preguntas se puntúan; las otras nueve conservan sus alternativas y análisis sin clave.
- Las 40 referencias a imágenes permanecen; los 15 archivos únicos pasan cotejo SHA-256.
