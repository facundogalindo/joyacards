# Auditoría de fidelidad — Redes, tercer parcial 2026

- Fecha: 21/11/2026
- Repositorio: JoyaCards
Alcance: auditar el material fotográfico disponible, las recreaciones basadas en recuerdos/testimonios y su importación en el formato Word nativo de JoyaCards.

## Resultado

- 23 tarjetas puntuables en Redes_Parcial_3_2026_JoyaCards_Auditado.docx.
- 13 preguntas transcritas de fotografías y 10 tarjetas recreadas a partir de 6 recuerdos y 4 testimonios.
- 3 preguntas fotográficas quedan pendientes de puntuación: show ip route, netstat y TFTP.
- 16 consignas fotográficas originales distintas; el archivo contiene 48 imágenes porque incluye fotografías de pantalla, recortes y copias repetidas.
- El borrador de 30 tarjetas llamado Redes_Parcial_3_JoyaCards_Auditado_Fidelidad.docx no está disponible en las carpetas revisadas. La comparación se hizo contra el borrador más cercano encontrado: Preguntero/Recuperatorio/Redes_Parcial_3_29_Preguntas_Unicas_JoyaCards_IPsec_Ajustado.docx. No se lo trató como fuente de respuestas correctas.

## Material revisado

- Fotos del parcial.zip: encontrado y extraído; 48 archivos JFIF.
- Resumen Final RIN (1).pdf: fuente principal de consulta.
- Redes de Computadoras, Tanenbaum, Feamster y Wetherall (2023): fuente secundaria cuando el resumen no cubre H.323, SIP o IPsec.
- Seis filminas oficiales de las unidades 5 y 6 y materiales de TP, incluida Lectura de reglas del firewall IPFire.pdf.
- El archivo Redes_Parcial_3_JoyaCards_Auditado_Fidelidad.docx mencionado en la consigna no se encontró. El DOCX de 29 tarjetas indicado arriba es un borrador previo; no se asumió que fuera la versión auditada de 30 preguntas.

## Auditoría del ZIP

Se verificaron 48 imágenes:

- 1–16: fotografías de pantalla completa.
- 17–32: recortes ampliados correspondientes a las mismas 16 consignas.
- 33–48: duplicados binarios de los recortes 17–32. Se verificaron 16 pares SHA-256: 17=33, 18=34, 19=35, 20=36, 21=37, 22=38, 23=39, 24=40, 25=41, 26=42, 27=43, 28=44, 29=45, 30=46, 31=47 y 32=48.
- Las fotos de pantalla completa y los recortes son dos vistas de una consigna; no son duplicados binarios entre sí.

Mapa de captura completa → recorte: 1→32 (servicio orientado a conexión), 2→31 (TFTP), 3→30 (nslookup/Instagram), 4→29 (TLD), 5→28 (terminal H.323), 6→27 (URL/https), 7→26 (firewall perimetral), 8→25 (netstat), 9→24 (VPN y rendimiento), 10→23 (firma digital), 11→22 (firewall/Telnet), 12→21 (show ip route), 13→20 (puertos de transporte), 14→19 (SIP/RTP), 15→18 (duplicados TCP), 16→17 (ACK acumulativo).

Las selecciones que aparecen en las capturas no se usaron como clave de respuesta. Por ejemplo, la foto de ACK muestra marcada la opción E; la clave se verificó con la teoría y corresponde a la opción A.

## Conteo y criterio de integración

| Procedencia | Únicas | En el DOCX puntuable | Pendientes |
|---|---:|---:|---:|
| Fotos | 16 | 13 | 3 |
| Recuerdos independientes | 6 | 6 | 0 |
| Testimonios independientes | 4 | 4 | 0 |
| Total | 26 | 23 | 3 |

La variante recordada de netstat se vinculó a la foto de netstat y no se creó como una pregunta conceptual separada. Por eso no suma una tarjeta adicional. Las 23 tarjetas activas tienen una respuesta correcta y una justificación; el conversor real de JoyaCards reconoce el DOCX sin advertencias.

La foto de nslookup/Instagram es de respuesta abierta. Se conservó su enunciado y se adaptó a opción única porque el importador actual de JoyaCards no tiene una modalidad de respuesta escrita. Las opciones y la clave se identifican como reconstruidas.

## Listado de preguntas y estado

Las referencias de páginas indican páginas PDF del material citado. “Alta” se refiere a la respuesta técnica; en recreaciones también se especifica por separado la fidelidad del enunciado.

| ID | Procedencia / fuente | Fidelidad | Respuesta o estado | Fuente, confianza y reconstrucción |
|---|---|---|---|---|
| F01 | FOTO completa 16 / recorte 17 | Enunciado y opciones exactos | A: ACK acumulativo reconoce varios bytes anteriores | RIN pp. 99–102; filminas U5 Transporte pp. 14–15. Alta. Sin reconstrucción. |
| F02 | FOTO 15 / recorte 18 | Exacta | C: números de secuencia | RIN pp. 99–100; filminas U5 Transporte pp. 14–15. Alta. Sin reconstrucción. |
| F03 | FOTO 14 / recorte 19 | Exacta | A: SIP controla la sesión; RTP/RTCP se relacionan con los flujos multimedia | Tanenbaum pp. 724–725; filminas U5 Voz IP pp. 17–18. Alta. Sin reconstrucción. |
| F04 | FOTO 13 / recorte 20 | Exacta | C: números de puerto | RIN pp. 98–100; filminas U5 Transporte p. 5. Alta. Sin reconstrucción. |
| F05 | FOTO 12 / recorte 21 | Cuatro subpreguntas legibles; los menús desplegables no muestran sus alternativas | PENDIENTE de puntuación. La tabla permite identificar Router2 según una aclaración previa registrada; red 192.168.30.0/24 por RIP; 192.168.70.0/24 conectada directamente; métrica 1 = un salto. No se inventaron opciones de menú. | Foto y tabla; RIN pp. 78–80 para RIP. Confianza alta en las tres lecturas de tabla; media en el dispositivo. No se recrearon las opciones. |
| F06 | FOTO 11 / recorte 22 | Enunciado, tabla y opciones exactos | C: bloqueada por la regla 5 | Foto; RIN p. 128; guía IPFire pp. 2 y 4 para acción, orden y política. Alta. Sin reconstrucción. |
| F07 | FOTO 10 / recorte 23 | Exacta | C: verificar con la clave pública de Ana y contrastar con el documento | RIN pp. 126–127; filminas U6 Seguridad pp. 19–23. Alta. Sin reconstrucción. |
| F08 | FOTO 9 / recorte 24 | Exacta | D: la VPN usa recursos de Internet que la organización no controla completamente | RIN p. 129; filminas U6 Seguridad pp. 42–45. Media: la variación de rendimiento se infiere del uso de Internet compartida; la fuente no afirma literalmente esa variación. |
| F09 | FOTO 8 / recorte 25; recuerdo asociado sobre una fila sin LISTEN | Enunciado y opciones visibles; consola/estado no legibles | PENDIENTE. No se puntúan SSH ni HTTPS: los puertos recordados 22, 443 y 8280 no bastan para probar el servicio, protocolo y estado de escucha. No se creó otra tarjeta teórica sobre LISTEN. | RIN pp. 104–105; filminas U5 Transporte pp. 32–33. La salida exacta no se puede verificar. |
| F10 | FOTO 7 / recorte 26 | Exacta | E: el tráfico malicioso interno puede no cruzar el perímetro | RIN pp. 127–128; TP28 Diagnóstico p. 1. Alta. Sin reconstrucción. |
| F11 | FOTO 6 / recorte 27 | Exacta | C: https es el esquema/protocolo | Filminas U5 Aplicación, segunda parte, pp. 25–26. Alta. Sin reconstrucción. |
| F12 | FOTO 5 / recorte 28 | Exacta | C: originar o recibir comunicaciones multimedia | Tanenbaum pp. 720–723; filminas U5 Voz IP pp. 5–6. Alta. Sin reconstrucción. |
| F13 | FOTO 4 / recorte 29 | Exacta | E: genéricos y de código de país | RIN p. 111; filminas U5 Aplicación p. 5. Alta. Sin reconstrucción. |
| F14 | FOTO 3 / recorte 30 | Enunciado abierto exacto; opciones adaptadas a JoyaCards | nslookup -type=NS instagram.com | RIN p. 113; filminas U5 Aplicación pp. 16 y 19–22. Confianza media: opciones y clave se reconstruyeron a partir del pedido de consultar servidores de nombres. |
| F15 | FOTO 2 / recorte 31 | Enunciado y alternativas legibles; respuesta no respaldada | PENDIENTE. No se usa como evidencia la alternativa marcada en la captura. Las fuentes explican TFTP/UDP 69 y ausencia de autenticación, pero no qué directorios suelen permitirse. | RIN p. 120; filminas U5 Aplicación II p. 7. Respuesta sin verificar; sin reconstrucción. |
| F16 | FOTO 1 / recorte 32 | Exacta | D: un circuito físico dedicado no es requisito de un servicio orientado a conexión | RIN pp. 98–99; filminas U5 Transporte p. 8. Alta. Sin reconstrucción. |
| R01 | RECUERDO | Recreación de FTP activo | Control TCP 21; datos TCP 20 | RIN p. 119; filminas U5 Aplicación II pp. 3–5. Técnica alta; literalidad media. Enunciado/opciones recreados. |
| R02 | RECUERDO, dominio www.cadena3.com.ar | Variante A distinta de NS; respuesta abierta recreada | nslookup -type=A www.cadena3.com.ar | RIN pp. 110–115, especialmente p. 113; filminas U5 Aplicación pp. 14 y 19–22. Técnica alta; fidelidad media. |
| T01 | TESTIMONIO, dominio www.lavoz.com.ar | Se mantiene separado de Cadena 3; respuesta abierta recreada | nslookup -type=A www.lavoz.com.ar | Mismas fuentes DNS que R02; testimonio 21/11/2026 10:49. Técnica alta; fidelidad media. |
| R03 | RECUERDO | Recreación | IMAP sin cifrado: TCP 143 | RIN p. 118; filminas U5 Aplicación p. 34. Técnica alta; literalidad media. |
| R04 | RECUERDO de diferencia entre AH y otro elemento | Recreación; ESP inferido | AH: autenticación/integridad sin confidencialidad; ESP puede cifrar y dar autenticación/integridad | Tanenbaum pp. 845–846; filminas U6 Seguridad p. 39. Técnica alta; fidelidad literal baja. |
| R05 | RECUERDO de mensaje H.323 | Recreación; fase exacta incierta | SETUP después de la admisión de ancho de banda, bajo la fase reconstruida | Tanenbaum p. 723; filminas U5 Voz IP p. 11. Técnica alta para ese flujo; fidelidad baja. |
| R06 | RECUERDO de empleados remotos | Recreación | VPN de acceso remoto dinámica | RIN p. 129; filminas U6 Seguridad pp. 44–46. Técnica alta; literalidad media. |
| T02 | TESTIMONIO; opciones recordadas RSA, PKA, MD5 y SHA-2 | Enunciado recreado; AES añadido como quinta opción posible, no literal confirmada | AES para confidencialidad ESP | RIN pp. 125–126; Tanenbaum pp. 843–846; filminas U6 Seguridad pp. 37 y 39. Técnica alta; fidelidad literal baja. PKA se conserva sin interpretarlo. |
| T03 | TESTIMONIO sobre Terminales, Gatekeepers y Puertas de enlace | Enunciado inferido; cuarta alternativa desconocida omitida | Terminales | Tanenbaum p. 721; filminas U5 Voz IP pp. 5–6. Técnica alta; fidelidad literal baja. |
| T04 | TESTIMONIO sobre abrir sucursales con poca infraestructura | Enunciado y opciones recreados | Escalabilidad | RIN p. 129; filminas U6 Seguridad p. 43. Técnica alta; fidelidad media. |

## Pendientes que no se cargan como puntuables

El importador descarta las preguntas cerradas sin respuesta marcada y no ofrece una modalidad abierta sin clave. No se agregó una respuesta ficticia ni se modificó el código de la aplicación para disimular esa limitación.

1. **show ip route — FOTO 12/21.** La imagen con topología y tabla quedó preservada en assets. La consigna dice “Observe la siguiente topología” y “Se entrega la siguiente tabla de enrutamiento”. Las cuatro subpreguntas son: “¿A qué dispositivo pertenece?”, “¿Cómo aprendió este router la red 192.168.30.0/24?”, “¿Cómo aprendió este router la red 192.168.70.0/24?” y “¿Qué indica el valor 1 en la expresión [120/1]?”. Los desplegables están vacíos. Para integrarla fielmente faltan las alternativas originales.
2. **netstat — FOTO 8/25.** El enunciado dice: “La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo, ¿Qué servicios puede asegurar que están corriendo en el servidor?”. Las opciones visibles son SSH, FTP, DNS, HTTPS, DHCP, HTTP y Telnet. Se preservó la captura, pero no se distinguen con seguridad las columnas de protocolo, puerto y estado. La mención recordada de una fila sin LISTEN se adjunta a este caso; no demuestra por sí sola que un servicio estuviera apagado.
3. **TFTP — FOTO 2/31.** El enunciado dice: “¿A qué tipo de directorios suele limitarse el acceso mediante TFTP?”; las alternativas fotografiadas son Privados, Públicos, Públicos y privados, Sólo para el personal de la empresa y Ninguna de las opciones. Se preservó la captura, pero no se toma la selección visible como clave. Las fuentes proporcionadas no resuelven la restricción habitual de directorios.

## Duplicados y variantes preservadas

- Se detectaron 16 pares de archivos exactamente duplicados (SHA-256 idéntico): 17/33 a 32/48. No se duplicaron tarjetas por esos archivos.
- Las 16 fotos completas y sus 16 recortes representan las mismas 16 consignas; cada consigna se cuenta una sola vez.
- Cadena 3 y La Voz se conservan como variantes distintas porque cambian el dominio y provienen de dos reportes diferentes.
- La foto de netstat y el recuerdo sobre una fila sin LISTEN se agrupan; no se crea una tarjeta nueva porque el estado exacto no se conoce.
- La foto de función de un terminal H.323 y el testimonio sobre el nombre de los extremos se mantienen separados: preguntan función y denominación, respectivamente; el segundo está marcado como recreación.
- La VPN sobre rendimiento, la VPN de acceso remoto y la escalabilidad de VPN se conservan como tres objetivos distintos.
- La diferencia AH/ESP y el cifrado IPsec con AES se conservan separados; preguntan funciones distintas.

## Cambios frente al borrador de 29 tarjetas disponible

- Se restableció la redacción y el orden de opciones que se leen en las fotos, en vez de usar reformulaciones del borrador.
- Las cuatro subpreguntas de show ip route dejan de ser cuatro tarjetas cerradas inventadas. Se registran como una consigna fotográfica pendiente con sus cuatro subpreguntas, porque sus menús no se ven.
- Se quitó la clave provisional SSH/HTTPS de netstat y la tarjeta separada que infería el significado de LISTEN. Se conserva la captura y el recuerdo como pendientes asociados.
- Se quitó como correcta la opción “Públicos” de TFTP: no aparece respaldada por las fuentes teóricas consultadas y no se toma la selección de la foto como evidencia.
- La consulta DNS A de Cadena 3 y la variante testimonial de La Voz se separaron; el borrador las había consolidado en una sola.
- Se conservaron como recreaciones rotuladas los recuerdos/testimonios. AES no se presenta como opción literal confirmada; se marca como reconstruida. El par ESP de AH/ESP y la fase de SETUP H.323 también se identifican como inferidos.
- La pregunta fotográfica abierta de Instagram se adapta a opción única con aviso visible; sus alternativas no se atribuyen al examen original.
- No se pudo comparar contra el DOCX de 30 tarjetas con nombre Redes_Parcial_3_JoyaCards_Auditado_Fidelidad.docx porque no está disponible.

## Integración técnica

El cuestionario usa los marcadores nativos de JoyaCards: @@ para opción única, * en la alternativa correcta, [[IMAGEN]] para imágenes y [[JUSTIFICACION]] / [[FIN_JUSTIFICACION]] para explicación y fuente. Se insertan los recortes originales de firewall/Telnet y la pregunta abierta de nslookup. Los recortes de los tres casos pendientes se conservan en assets, pero no se incrustan en una tarjeta puntuable.

El archivo de contenido está generado desde cards-fotos-1.json, cards-fotos-2.json y cards-reconstruidas.json con frontend/scripts/build-redes-parcial3.mjs. Para regenerarlo: desde frontend, ejecutar node scripts/build-redes-parcial3.mjs. No fue necesario modificar el flujo de importación ni otras funciones de la aplicación.

## Pruebas

- Conversión del DOCX final con backend/src/services/wordToJson.service.js y shuffle desactivado: 23 tarjetas, 23 justificaciones, cero advertencias, 2 imágenes cargadas, 23 enunciados únicos y exactamente una respuesta correcta por tarjeta.
- Tests backend: 22/22 aprobados.
- Tests frontend: 8/8 aprobados.
- Lint frontend: aprobado.
- Build frontend: aprobado. Vite conserva una advertencia de tamaño: el chunk JavaScript minificado es de 581.38 kB y supera el umbral de 500 kB.
- Control visual: 9 páginas renderizadas e inspeccionadas. render_docx.py convirtió el DOCX a PDF, pero no pudo rasterizar porque Poppler no está instalado; las páginas se exportaron con LibreOffice y se renderizaron con PyMuPDF.
