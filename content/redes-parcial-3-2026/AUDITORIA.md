# Auditoría de fidelidad Redes tercer parcial 2026

Fecha: 22/11/2026 | Repositorio: `facundogalindo/joyacards`
Base de esta iteración: commit `b5b787f`

## Resultado

Se recuperaron las cuatro subpreguntas de `show ip route` como tarjetas calificables con la foto original y opciones reconstruidas identificadas como tales. TFTP también se incorporó con su enunciado, opciones y recorte originales; la opción **Públicos** está respaldada como práctica frecuente de configuración, no como una limitación propia del protocolo. `netstat` conserva la consigna, las siete opciones, la foto y la variante recordada en un cuadernillo separado sin puntuación.

El cuestionario principal contiene **28 tarjetas calificables** y el cuadernillo auxiliar **2 versiones pendientes de netstat**. No se asigna una clave a la consola que la foto no deja leer. La consulta A de `www.cadena3.com.ar` queda separada de la consulta A testimonial de `www.lavoz.com.ar`.

## Conteos

| Métrica | Cantidad | Criterio |
|---|---:|---|
| Consignas fuente fotografiadas | 16 | 16 preguntas/ejercicios originales; `show ip route` tiene cuatro subpreguntas. |
| Recuerdos y testimonios puntuables | 10 | 6 recuerdos y 4 testimonios. |
| Variante recordada adicional | 1 | `netstat` con una fila que no mostraba `LISTEN`; pendiente. |
| Unidades de práctica individualizadas | 30 | 16 fuentes fotográficas + 10 recuerdos/testimonios + 1 variante netstat + 3 subpreguntas adicionales al desglosar route. |
| Tarjetas calificables en JoyaCards | 28 | 18 derivadas de fotos, más 10 de recuerdos/testimonios. |
| Versiones pendientes | 2 | `netstat` original y la variante recordada; ambas apuntan al mismo ejercicio. |
| Recreaciones puntuables | 10 | Los 6 recuerdos y 4 testimonios; se identifican en cada tarjeta. |
| Imágenes insertadas en el cuestionario puntuable | 7 | 4 apariciones de la imagen route, más Telnet, Instagram y TFTP. |
| Archivos de imagen únicos en el cuestionario puntuable | 4 | La imagen route se reutiliza en sus cuatro subpreguntas. |
| Imágenes en el cuadernillo pendiente | 2 | Se repite la captura netstat original en ambas versiones; es 1 archivo único. |

Las 26 fuentes base son 16 ejercicios fotografiados más 10 recuerdos/testimonios. La variante de netstat se conserva como una versión adicional, no como duplicado. El desglose de la foto route en cuatro preguntas agrega tres unidades al total de práctica.

## Fuentes consultadas para TFTP

Se siguió el orden solicitado:

1. **Resumen Final RIN (Camila Bermejo), PDF p. 120:** describe TFTP como protocolo liviano sobre UDP, puerto 69, para transferir archivos. No establece qué directorios debe compartir.
2. **Tanenbaum, Feamster y Wetherall (2023):** no se encontró una sección ni una mención a TFTP en el PDF disponible; no se inventa una página.
3. **Filminas oficiales de Unidad 5, Capa de aplicación, segunda parte, PDF pp. 7–8:** describen UDP/69 y usos de TFTP, pero no una regla de directorios.
4. **RFC 1350, sección “Security Considerations”, PDF p. 11:** advierte que TFTP no incorpora inicio de sesión ni control de acceso y que es habitual configurar el servidor para exponer por TFTP archivos con permiso de lectura pública y deshabilitar escrituras. [RFC Editor: RFC 1350](https://www.rfc-editor.org/info/rfc1350/)

La opción **B) Públicos** se califica como la mejor respuesta a “suele limitarse”, con confianza media. La restricción proviene de permisos y configuración del servidor; no es una propiedad impuesta por TFTP. La RFC habla de archivos legibles públicamente, no define una categoría protocolaria de “directorios públicos”. La marca de opción que aparece en la foto no se usó como evidencia.

## Revisión de las fotos

El ZIP contiene 50 archivos: 48 JFIF y 2 PDF de referencia. De las fotos, 1–16 son vistas completas; 17–32 son recortes ampliados y 33–48 son copias binarias de esos recortes. Se verificaron los 16 pares SHA-256: 17=33, 18=34, 19=35, 20=36, 21=37, 22=38, 23=39, 24=40, 25=41, 26=42, 27=43, 28=44, 29=45, 30=46, 31=47 y 32=48. La vista completa y el recorte de cada ejercicio son dos encuadres, no duplicados binarios.

Mapa vista completa → recorte: 1→32 (servicio orientado a conexión), 2→31 (TFTP), 3→30 (nslookup/Instagram), 4→29 (TLD), 5→28 (terminal H.323), 6→27 (URL/https), 7→26 (firewall perimetral), 8→25 (netstat), 9→24 (VPN y rendimiento), 10→23 (firma digital), 11→22 (firewall/Telnet), 12→21 (show ip route), 13→20 (puertos de transporte), 14→19 (SIP/RTP), 15→18 (duplicados TCP), 16→17 (ACK acumulativo).

Las respuestas se verificaron contra la tabla o las fuentes; las selecciones de las fotos no se trataron como clave. Route reutiliza el recorte original que contiene topología, tabla y desplegables. TFTP y netstat conservan sus recortes originales.

## Comparación tarjeta por tarjeta con el Word de 30 preguntas

El archivo `Preguntero/Recuperatorio/Redes_Parcial_3_JoyaCards_Auditado_Fidelidad.docx` sí estaba disponible. La auditoría anterior informó erróneamente que faltaba por un filtro de búsqueda incompleto; esta tabla corrige esa conclusión. El documento de referencia se importó con el conversor real de JoyaCards: 30 tarjetas, 30 justificaciones y cero advertencias. Que importe sin advertencias no valida por sí solo sus claves: P12 tiene dos opciones correctas marcadas y las respuestas de route, TFTP y netstat se reexaminaron con sus fuentes.

| Word 30 | Integración en esta iteración | Enunciado y opciones frente a la referencia | Imagen final | Respuesta y justificación |
|---:|---|---|---|---|
| 1 | Conservada | Enunciado y opciones coinciden; sin cambios sustantivos. | No | ACK acumulativo; verificado con RIN pp. 99–102 y filminas U5 Transporte pp. 14–15. |
| 2 | Conservada | Enunciado y opciones coinciden. | No | Números de secuencia; verificado con RIN pp. 99–100 y filminas U5 Transporte pp. 14–15. |
| 3 | Conservada | Misma consigna y opciones; se normaliza capitalización. | No | Funciones SIP frente a RTP/RTCP; Tanenbaum pp. 724–725 y filminas U5 Voz IP pp. 17–18. |
| 4 | Conservada | Enunciado y opciones coinciden. | No | Puertos identifican procesos; RIN pp. 98–100 y filminas U5 Transporte p. 5. |
| 5 | Recuperada como route 1/4 | Se usa la pregunta breve de la foto; se quitaron notas explicativas del stem. Opciones Router0–Router3 reconstruidas, no literales. | Sí, original reutilizada | Router2, confirmado por el estudiante; la foto no aporta una selección legible. |
| 6 | Recuperada como route 2/4 | Se conserva red 192.168.30.0/24; opciones reconstruidas porque el menú está vacío. | Sí, original reutilizada | RIP; la tabla muestra código R y [120/1]. RIN pp. 78–80. |
| 7 | Recuperada como route 3/4 | Se conserva red 192.168.70.0/24; opciones reconstruidas. | Sí, original reutilizada | Conectada directamente; la tabla marca C y Serial0/1/1. |
| 8 | Recuperada como route 4/4 | La pregunta se enfoca en el valor 1 de [120/1]; opciones reconstruidas. | Sí, original reutilizada | Métrica RIP de un salto; RIN pp. 78–80 y tabla original. |
| 9 | Conservada | Se prioriza la redacción de la foto sobre la paráfrasis del Word; opciones conservadas. | Sí | Bloqueada por regla 5; foto, RIN p. 128 y guía IPFire pp. 2 y 4. |
| 10 | Conservada | Enunciado y opciones coinciden con la tarjeta previa. | No | Comprobación de firma con la clave pública de Ana; RIN pp. 126–127 y filminas U6 pp. 19–23. |
| 11 | Conservada | Enunciado y opciones conservados. | No | Rendimiento VPN: respuesta D, inferencia de confianza media sobre recursos de Internet no controlados; RIN p. 129 y filminas U6 pp. 42–45. |
| 12 | Conservada como pendiente | Stem y siete opciones SSH/FTP/DNS/HTTPS/DHCP/HTTP/Telnet se conservan; las dos marcas SSH/HTTPS del Word no se aceptan como clave. | Sí, original en cuadernillo | Sin respuesta calificable: la consola no deja comprobar protocolo y estado de cada fila. |
| 13 | Conservada | Opciones y respuesta se mantienen. | No | Un firewall perimetral puede no ver tráfico malicioso interno; RIN pp. 127–128 y TP28 p. 1. |
| 14 | Conservada | Stem y opciones conservados. | No | `https` es el esquema; filminas U5 Aplicación, segunda parte, pp. 25–26. |
| 15 | Conservada | Stem y opciones conservados. | No | El terminal H.323 origina o recibe comunicaciones multimedia; Tanenbaum pp. 720–723 y filminas U5 Voz IP pp. 5–6. |
| 16 | Conservada | Stem y opciones conservados. | No | TLD genéricos y de código de país; RIN p. 111 y filminas U5 p. 5. |
| 17 | Conservada y documentada como adaptación | El original de la foto es abierto; la referencia 30 aportó distractores reconstruidos. Se conserva el texto de la foto, se incorpora la foto original y se usan opciones adaptadas/reordenadas. | Sí, foto original | NS es una interpretación de “información sobre el servidor de resolución”; confianza media. RIN p. 113 y filminas U5 pp. 16 y 19–22. |
| 18 | Recuperada y puntuada | Se conserva el stem y las cinco opciones fotografiadas. El Word 30 tenía B marcada, pero sin la comprobación de fuente requerida; se agregó la foto original. | Sí, TFTP original | B) Públicos, con la salvedad de configuración descrita arriba; RFC 1350 § Security Considerations, p. 11. |
| 19 | Conservada | Enunciado y opciones conservados. | No | Un servicio orientado a conexión no requiere circuito físico dedicado; RIN pp. 98–99. |
| 20 | Conservada como recuerdo | Se conservan las dos alternativas recordadas. El stem especifica modo activo para que los puertos tengan una respuesta inequívoca; el modo no fue confirmado literal del examen. | No | Control TCP 21 y datos TCP 20 en modo activo; RIN p. 119 y filminas U5 pp. 3–5. |
| 21 | Corregida según decisión del usuario | Se conserva `www.cadena3.com.ar`, pero se reemplaza la consulta NS inferida en el Word por la práctica IPv4/registro A solicitada. No se fusiona con La Voz. | No | `nslookup -type=A www.cadena3.com.ar`. La elección A es para practicar y no está confirmada como dato literal del parcial. |
| 22 | Conservada como recuerdo | Se usa el stem breve “¿Qué puerto utiliza IMAP?”; opciones reconstruidas. | No | TCP 143 para IMAP; se aclara que 993 corresponde a IMAPS. RIN p. 118 y filminas U5 p. 34. |
| 23 | Conservada como recreación | Se mantiene AH frente a ESP; no se afirma que ese fuera el enunciado literal porque el recuerdo no identifica la contraparte. | No | AH aporta autenticación/integridad; ESP puede cifrar. Tanenbaum pp. 845–846 y filminas U6 p. 39. |
| 24 | Retirada como pregunta conceptual independiente | El Word proponía “¿qué significa LISTEN?” como recreación. Se elimina esa sustitución y se conserva el recuerdo como variante pendiente de la consigna fotográfica P12. | Sí, captura original sin editar en el cuadernillo | Sin clave: no se conoce fila, protocolo ni estado de la variante. |
| 25 | Conservada como recuerdo | Se mantiene la versión de establecimiento posterior a la admisión, marcada como fase inferida. | No | SETUP es correcto para esa fase; Tanenbaum p. 723 y filminas U5 p. 11. La fase no está confirmada como literal. |
| 26 | Conservada como recuerdo | Redacción alineada al escenario recordado de empleados conectados desde afuera; opciones reconstruidas. | No | VPN de acceso remoto; RIN p. 129 y filminas U6 pp. 44–46. |
| 27 | Conservada como testimonio | Se preserva la palabra “protocolo” recordada y RSA/PKA/MD5/SHA-2; AES se identifica como opción agregada. | No | AES puede ofrecer confidencialidad en ESP; RIN pp. 125–126, Tanenbaum pp. 843–846 y filminas U6 pp. 37 y 39. |
| 28 | Conservada como testimonio | Se conserva “¿Cómo se llaman los teléfonos…?” y las tres opciones recordadas. La cuarta opción desconocida se omite; no se inventa DNS como en el Word 30. | No | Terminales; Tanenbaum p. 721 y filminas U5 pp. 5–6. |
| 29 | Conservada como testimonio | Enunciado cercano al recuerdo de abrir oficinas sin instalar mucha infraestructura; opciones reconstruidas. | No | Escalabilidad; RIN p. 129 y filminas U6 p. 43. |
| 30 | Conservada separada de Cadena 3 | El testimonio de `www.lavoz.com.ar` permanece independiente; se conserva el objetivo IPv4 del recuerdo. | No | Registro A: `nslookup -type=A www.lavoz.com.ar`; RIN p. 113 y filminas U5 pp. 14 y 19–22. |

Las preguntas 5–8 de la referencia son las cuatro partes de un solo ejercicio fotografiado. Las dos tarjetas netstat de la referencia no se convirtieron en dos preguntas conceptuales: se conserva la foto y su variante recordada con la fila sin `LISTEN`, sin alterar la imagen. No se eliminaron variantes DNS de Cadena 3 y La Voz.

## Netstat pendiente y compatibilidad con JoyaCards

El importador actual exige al menos una respuesta correcta para una pregunta de opción única. El parser del formato de varios desplegables también exige una opción correcta por desplegable; el modo de cuestionario luego califica la selección como correcta o incorrecta. Por eso no puede representar una consigna pendiente sin asignarle una clave o cambiar la arquitectura.

La solución reutilizable sin tocar el comportamiento general es `Pendientes_Redes_Parcial_3_2026_Practica_Sin_Puntuar.docx`, generado por el mismo script fuente. Incluye la pregunta original de netstat, sus siete opciones y la misma captura original en dos ejercicios. La variante recordada muestra inmediatamente debajo de la captura una aclaración sobre el campo ESTADO vacío; no modifica la imagen ni atribuye el cambio a una fila concreta. El documento no es importable ni puntuable y no contiene claves.

## Cambios respecto del commit anterior

- Se mantuvieron las 23 tarjetas puntuables de `b5b787f`.
- Se agregaron cuatro tarjetas de `show ip route` con la imagen original repetida y opciones reconstruidas para la limitación del formato.
- Se agregó TFTP con foto y opciones originales; la respuesta se verifica mediante RFC 1350.
- Se agregó el cuadernillo auxiliar con las versiones original y recordada de netstat, ambas pendientes y sin clave.
- Cadena 3 se corrigió de la consulta NS que se había inferido a la variante IPv4/A indicada por el usuario. La Voz sigue separada.
- Se recuperó el stem más cercano al recuerdo para IMAP, H.323 y VPN; se conservan las palabras recordadas aunque requieran una aclaración técnica en la justificación.
- Se quitó la pregunta conceptual independiente sobre `LISTEN` y el distractor DNS inventado como cuarta alternativa de H.323.
- Se renombraron los assets route y TFTP al integrarlos como preguntas verificadas/reconstruidas, sin modificar sus bytes.
- El generador calcula el total desde las tarjetas fuente; ya no fija 23.
- No se modificó la arquitectura de la aplicación ni el importador general.

## Correcciones finales — 22/11/2026

- IMAP conserva la etiqueta `[RECUERDO | RECREACIÓN; OPCIONES RECONSTRUIDAS]`, la pregunta y TCP 143.
- H.323 usa la etiqueta `[TESTIMONIO | RECREACIÓN; CUARTA OPCIÓN DESCONOCIDA]`; sus alternativas visibles son `A) Terminales.`, `B) Gatekeepers.` y `C) Puertas de enlace.`. `A) Terminales.` sigue siendo la clave y la cuarta alternativa desconocida no se inventa.
- El cuadernillo presenta `Ejercicio 1 — Captura original del parcial` y `Ejercicio 2 — Variante recordada`. Ambos conservan el mismo enunciado, opciones y archivo de imagen. La segunda versión incorpora, justo debajo de la imagen y antes de las opciones, la aclaración del recuerdo sobre el campo ESTADO vacío. Sigue pendiente y sin respuesta asignada.
- No se modificaron otras preguntas ni respuestas del cuestionario.

## Formato e importación

El cuestionario puntuable se regenera con el formato nativo que consume JoyaCards: `@@` para opción única, asterisco en la opción correcta, `[[IMAGEN]]` para imágenes y bloques `[[JUSTIFICACION]]` / `[[FIN_JUSTIFICACION]]` con procedencia, razonamiento, fuente, confianza y nota de reconstrucción. `cards-pendientes.json` alimenta el cuadernillo auxiliar, sin claves ni marcadores de pregunta puntuable.

Se inspeccionaron el parser real `backend/src/services/wordToJson.service.js` y el flujo de respuesta en `frontend/src/App.jsx`. No admiten preguntas no calificables como tarjetas de evaluación: el importador descarta opción única sin clave y el juego siempre compara una respuesta contra la clave. La solución elegida mantiene intacto ese contrato.

## Control de calidad

Resultados de la nueva iteración:

- El conversor real importó **28 preguntas**, con **28 justificaciones**, **0 advertencias**, 7 apariciones de imagen (4 archivos únicos), 28 enunciados distintos y una sola respuesta correcta por pregunta.
- El cuadernillo auxiliar mantuvo sus **2 versiones pendientes** y sus 2 apariciones de la captura original. El conversor importó 0 preguntas desde ese documento, como se espera: no contiene claves ni formato puntuable.
- Tests: backend **22/22** y frontend **8/8** aprobados. Lint y build del frontend aprobados.
- El build muestra el aviso habitual de Vite porque el bundle JavaScript principal supera 500 kB (581,38 kB); no impidió la compilación.
- Se renderizaron las 13 páginas del cuestionario y las 2 del cuadernillo pendiente. La revisión visual confirmó H.323 y ambos ejercicios netstat; la comparación con el render anterior muestra solo el cambio previsto en la página 13 del cuestionario y ningún cambio visual en el cuadernillo. La conversión a PDF se hizo con LibreOffice y la rasterización con PyMuPDF, porque el entorno no tiene Poppler.
- `git diff --check` y la validación de sintaxis de los cuatro JSON fuente pasan.

La regeneración final mantuvo la importación y las claves auditadas. La comparación entre el DOCX previo y el actual confirma que en H.323 solo cambiaron la etiqueta y la capitalización visible A/B/C; la respuesta y la justificación no variaron. El resto de las preguntas, respuestas y justificaciones quedó igual. El cuadernillo auxiliar conserva ambas versiones de netstat sin asignar respuestas.

## Corrección final — netstat integrado al cuestionario principal (22/11/2026)

- El Word principal se regenera desde las fuentes auditadas y ahora contiene **30 tarjetas: 28 calificables y 2 de práctica sin puntuación**. El cuadernillo auxiliar se conserva como material adicional.
- Las tarjetas netstat se agregan con `@@@` (selección múltiple), la misma consigna, las siete opciones originales y la misma captura. Sus rótulos son `[FOTO | NETSTAT ORIGINAL | SIN PUNTUAR]` y `[RECUERDO | VARIANTE NETSTAT | SIN PUNTUAR]`.
- El Word usa `[[SIN_PUNTUAR]]` explícitamente. El importador solo acepta preguntas de selección múltiple marcadas, con alternativas y sin ninguna respuesta correcta. Una pregunta ordinaria sin clave sigue descartándose. La nota de la variante viaja con `[[TEXTO_POST_IMAGEN]]` y queda debajo de la imagen y antes de las opciones.
- JoyaCards presenta ambas como práctica sin puntuación, permite elegir varias alternativas y ofrece **Continuar sin puntuar**. No muestra resultado ni clave para esas tarjetas y no las suma al puntaje. El resumen y el denominador se calculan según las tarjetas calificables incluidas en la sesión.
- El conversor real importó **30 preguntas**, **28 justificaciones**, **0 advertencias**, con **28 calificables y 2 sin puntuar**. Ambas tarjetas importan siete opciones, una imagen JPEG y ninguna respuesta; las imágenes son idénticas y la aclaración aparece únicamente en la variante.
- La comparación semántica entre el Word de `5b902c9` y el regenerado confirma que las 28 preguntas calificables, sus opciones, justificaciones, imágenes y claves se mantienen sin cambios.
- Tests: backend **25/25**, frontend **11/11**; lint aprobado. El build de Vite aprobado con el aviso existente de bundle principal mayor a 500 kB (**582,34 kB**). `git diff --check` aprobado.

## Corrección obligatoria — netstat con claves de práctica puntuables (22/11/2026)

- Las preguntas 29 y 30 ahora son preguntas @@@ calificables del cuestionario principal. Se eliminaron de ambas el marcador y los rótulos SIN PUNTUAR.
- La clave reconstruida para ambas es **A) SSH** y **D) HTTPS**. FTP, DNS, DHCP, HTTP y Telnet quedan incorrectas. La interfaz existente compara la selección múltiple como conjunto: exige ambas respuestas y rechaza selecciones faltantes o adicionales.
- La pregunta 29 conserva la captura original, el enunciado y las siete opciones. La justificación aclara que la clave es de práctica y reconstruida: la imagen no permite verificar todos los caracteres. Se interpreta TCP/22 en LISTEN como SSH y TCP/443 en LISTEN como HTTPS; el número 8280 no demuestra por sí solo que sea HTTP.
- La pregunta 30 conserva la misma captura, el enunciado y las opciones. Debajo de la imagen aparece la variante exacta que supone que la última fila es UDP/8280 con ESTADO vacío, mientras TCP/22 y TCP/443 permanecen en LISTEN. La justificación indica que UDP no usa el estado TCP LISTEN y que esa fila modificada es un supuesto de práctica, no una recuperación literal del recuperatorio.
- El importador real reconoció **30 tarjetas, 30 calificables, 0 sin puntuar, 32 justificaciones y 0 advertencias**. Cada netstat tiene tipo multiple_choice, respuestas A y D, siete opciones y la imagen original. La prueba verifica A+D correcta; solo SSH, solo HTTPS y SSH+HTTPS+HTTP incorrectas. El resumen final incluye las 30 tarjetas.
- La comparación semántica contra el Word del commit 656f966 confirma que las otras 28 preguntas, opciones, justificaciones, imágenes y claves permanecen iguales.
- Tests: backend **26/26**, frontend **11/11**; lint y build aprobados. Vite conserva el aviso de bundle principal mayor a 500 kB (**582,34 kB**).
