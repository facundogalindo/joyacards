from __future__ import annotations

import copy
import hashlib
import json
import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
V2_PATH = ROOT / "preguntas-resueltas-v2.json"
V3_PATH = ROOT / "preguntas-resueltas-v3.json"
WORD_PATH = ROOT / "Redes_Parcial_4K1_2026_RESUELTO_V3.docx"
OJO_MD_PATH = ROOT / "AUDITORIA_PREGUNTAS_OJO.md"
OJO_DOCX_PATH = ROOT / "AUDITORIA_PREGUNTAS_OJO.docx"
JUSTIFICATION_MD_PATH = ROOT / "AUDITORIA_JUSTIFICACIONES_V3.md"
BASE_COMMIT = "acb67dfb15913469ca0866a3cb4d0fa15ef02fbc"
OJO_POSITIONS = [37, 60, 79, 83, 119, 127]


CORRECTIONS = [
    (10, "option-2", "RIP se identifica con el código R; la línea de 192.168.50.0/24 muestra C, que significa conectada directamente."),
    (10, "option-4", "Una ruta estática se identifica con el código S; la línea de 192.168.50.0/24 muestra C, no S."),
    (24, "option-1", "La regla de Telnet/TCP 23 no aplica a SSH/TCP 22; no coincide otra regla y la política por defecto permite este flujo."),
    (25, "option-1", "La regla 3 coincide antes: es ICMP desde 192.168.50.102 hacia 172.16.170.33 y lo descarta. La política por defecto no se evalúa después de esa coincidencia."),
    (26, "option-2", "No: el origen 192.168.50.20 no coincide con la regla 3; la regla 4 sí coincide con ICMP Green→172.16.170.33 y lo acepta antes de que intervenga la política por defecto."),
    (112, "option-1", "RTCP aporta informes de recepción y control/sincronización asociados al flujo; no es el componente que negocia los códecs."),
    (112, "option-2", "La negociación de códecs corresponde a la señalización de sesión (en H.323, H.245), no a RTCP."),
    (112, "option-3", "RTCP no transporta las muestras de audio o video; RTP lleva los medios y RTCP intercambia reportes de control."),
    (119, "option-1", "La imagen mejorada visible muestra C 192.168.70.0/24 directamente conectada por Serial0/1/1 y L 192.168.70.1/32. Esta alternativa coincide con el escenario dibujado, pero las opciones fueron reconstruidas y la imagen se mejoró con IA, así que no certifica la pregunta histórica ni permite fijar una clave verificada."),
    (119, "option-3", "En la tabla visible no aparece una ruta R 192.168.70.0/24. Las filas R legibles corresponden a otros prefijos; para .70 la ruta visible lleva C. La imagen mejorada no permite certificar cómo era la pregunta original."),
]


CASES = {
    37: {
        "topic": "TCP: lectura de una captura SYN+ACK",
        "evidence": "El recurso muestra un segmento TCP de origen 443 y destino 52086, flags SYN y ACK, longitud de segmento 0, ventana 65535 y opciones MSS y Window Scale. Los campos de secuencia/acknowledgment raw aparecen vacíos u ocultos. No se ve el tercer ACK de la PC.",
        "origin": "Imagen descargada como recurso original del cuestionario (`sourceKind=downloaded_original`), URL registrada: `https://cuestionario-redes.vercel.app/imagenes/captura-wireshark-syn-ack-p3.png`. Es una captura técnica incluida en el banco, no una fotografía independiente del examen. La revisión V2 no halló una foto original que pruebe la fidelidad histórica.",
        "reason": "La captura demuestra que el servidor respondió al SYN con SYN+ACK y anunció MSS/Window Scale. La alternativa 1 depende de si «acepta la conexión e inicia un nuevo socket» se usa coloquialmente para describir esa respuesta o si afirma que la conexión ya quedó establecida. El handshake requiere también el ACK final de la PC; el segmento mostrado no prueba que ese intercambio haya ocurrido. Como la pregunta exige dos selecciones, la teoría estricta deja una sola alternativa inequívoca.",
        "interpretations": "Hipótesis docente: la filmina llama a la respuesta SYN+ACK «acepta la conexión y solicita la apertura de otro socket», por lo que probablemente pretendía las alternativas 1 y 4. Teoría estricta: el SYN+ACK acusa recibo y deja al extremo pasivo esperando el ACK final; no equivale por sí solo a un handshake completado. Evidencia disponible: confirma únicamente la alternativa 4 de manera inequívoca; la imagen no contiene el tercer segmento.",
        "missing": ["La captura completa del handshake, incluido el ACK final de la PC.", "Una aclaración de la cátedra sobre si «acepta la conexión» describe la respuesta SYN+ACK o el estado ESTABLISHED.", "La fotografía original del examen, si se quiere confirmar que la captura y la redacción no fueron alteradas."],
        "discussion": "¿La alternativa 1 debe aceptarse como abreviatura docente de la respuesta SYN+ACK, o debe rechazarse porque el servidor aún no completó el handshake?",
        "decision": "Determinar si la simplificación de la filmina basta para puntuar la alternativa 1 junto con la 4.",
        "recommendation": "Mantenerla sin puntuar hasta confirmar la interpretación docente o disponer del tercer ACK; no revelar una respuesta en JoyaCards.",
        "sources": [1, 2],
        "options": {
            "option-1": ("Respuesta del servidor en el three-way handshake.", "La filmina de la cátedra describe al servidor como quien acepta y abre el socket inverso al enviar SYN+ACK [1].", "La especificación TCP muestra que el servidor aún espera el ACK final; el SYN+ACK no prueba por sí solo el estado ESTABLISHED [2].", "DEFENDIBLE PERO DISCUTIBLE"),
            "option-2": ("Cierre de la conexión TCP.", "No hay evidencia a favor en los flags visibles.", "La captura muestra SYN+ACK y no FIN; no describe un cierre [2].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-3": ("Dirección del segmento hacia el servicio HTTPS.", "El puerto 443 está asociado convencionalmente a HTTPS.", "443 es el puerto de origen y el destino es 52086; el segmento sale del servidor hacia el cliente, no se dirige al servidor HTTPS [5].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-4": ("Opciones anunciadas durante la negociación TCP.", "La captura enumera MSS y Window Scale en el segmento SYN+ACK [1, 2].", "Ninguna contradicción en los datos visibles; sí falta la foto original del examen para confirmar fidelidad histórica.", "CORRECTA SEGÚN LA EVIDENCIA"),
            "option-5": ("ACK acumulativo hasta un número de byte.", "La captura muestra ventana anunciada 65535.", "65535 es el tamaño de ventana, no un acknowledgment; el segmento tiene longitud 0 y no acredita recepción de datos hasta ese byte [2].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-6": ("Solicitud de apertura iniciada por la PC.", "Una PC inició previamente el intercambio.", "La trama visible es SYN+ACK con origen 443; es la respuesta del servidor, no el SYN inicial de la PC [2].", "INCORRECTA SEGÚN LA EVIDENCIA"),
        },
    },
    60: {
        "topic": "Netstat: sockets en escucha y puertos convencionales",
        "evidence": "La imagen enumera `tcp 0.0.0.0:9999 ... LISTEN`, `tcp 0.0.0.0:23 ... LISTEN` y `udp 0.0.0.0:53`. Las direcciones externas son comodín. La salida no incluye nombre de proceso, PID ni ejecutable.",
        "origin": "El PNG está registrado como descargado del cuestionario (`https://cuestionario-redes.vercel.app/imagenes/netstat-telnet-dns-4k1.png`), pero `sourceNotes` dice que la imagen fue recreada a partir de una reconstrucción de la pregunta. No es una fotografía original independiente del examen.",
        "reason": "El puerto 23/TCP suele asociarse a Telnet y 53/UDP a DNS, pero un socket en escucha prueba que existe un socket enlazado al puerto, no qué aplicación o servicio lo abrió. La salida no muestra `-b`, `-o` ni información de proceso. Además, dos puertos convencionales ofrecen dos asociaciones plausibles en una pregunta configurada como única; el puerto 9999 agrega un listener que las opciones no identifican.",
        "interpretations": "Hipótesis docente: identificar servicios por puertos conocidos y seleccionar Telnet o DNS. Teoría estricta: los números de puerto son convenciones/registraciones; no identifican la aplicación que realmente abrió el socket. Evidencia disponible: confirma listeners TCP en 9999 y 23 y un socket UDP en 53, pero no identifica procesos.",
        "missing": ["La salida de `netstat -b` o una asociación PID→ejecutable que identifique procesos [4].", "Una indicación de que se aceptan varias respuestas o un dato de servicio/proceso que descarte DNS o Telnet.", "La captura original no reconstruida del examen para validar el contenido histórico."],
        "discussion": "¿El ejercicio evalúa la asociación convencional entre puerto y servicio, o pide demostrar qué procesos están ejecutándose?",
        "decision": "Acordar si un puerto conocido basta para llamar al servicio «corriendo» y cómo resolver la contradicción de opción única.",
        "recommendation": "Mantenerla sin puntuar; si se conserva como práctica, reformular la consigna como «¿qué servicios suelen asociarse?» o mostrar el proceso asociado.",
        "sources": [3, 4, 5],
        "options": {
            "option-1": ("SSH, convencionalmente TCP/22.", "El puerto 22 suele asociarse a SSH [5].", "No aparece un listener TCP/22; y en cualquier caso el puerto no identifica por sí solo el proceso [4, 5].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-2": ("DNS, convencionalmente UDP/53.", "La salida muestra un socket UDP local en el puerto 53, convencional para DNS [3, 5].", "No se ve el ejecutable/proceso; otro programa puede enlazarse al puerto y la captura también permite asociar TCP/23 a Telnet [4, 5].", "DEFENDIBLE PERO DISCUTIBLE"),
            "option-3": ("HTTPS, convencionalmente TCP/443.", "443 suele asociarse a HTTPS [5].", "No aparece un listener TCP/443 [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-4": ("DHCP, convencionalmente UDP/67–68.", "DHCP utiliza los puertos UDP 67/68 [3, 5].", "No aparece ningún socket en esos puertos [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-5": ("HTTP, convencionalmente TCP/80.", "80 suele asociarse a HTTP [3, 5].", "No aparece un listener TCP/80 [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-6": ("FTP, convencionalmente TCP/20–21.", "FTP clásico usa los puertos 20/21 en su modelo de referencia [3, 5].", "No aparece un listener TCP/20 o TCP/21 [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-7": ("Telnet, convencionalmente TCP/23.", "La imagen muestra TCP/23 en LISTEN y ese puerto está asignado convencionalmente a Telnet [3, 5].", "La salida no muestra proceso/ejecutable y también muestra UDP/53, por lo que no permite asegurar que Telnet sea la aplicación [4, 5].", "DEFENDIBLE PERO DISCUTIBLE"),
        },
    },
    79: {
        "topic": "Netstat: varios listeners y asociación de servicios",
        "evidence": "La imagen muestra tres listeners: TCP `0.0.0.0:22`, `0.0.0.0:443` y `0.0.0.0:8080`, todos con estado LISTEN y dirección externa comodín. No muestra nombre de proceso, PID ni ejecutable.",
        "origin": "El PNG es el recurso servido por el sitio (`https://cuestionario-redes.vercel.app/imagenes/netstat-puertos-escucha-4k1.png`). Figura como descargado original del banco y no tiene una nota explícita de reconstrucción; aun así, no se encontró una fotografía independiente del examen que pruebe fidelidad histórica.",
        "reason": "TCP/22 suele asociarse a SSH y TCP/443 a HTTPS. TCP/8080 se usa con frecuencia para HTTP alternativo, pero puede alojar otros servicios. `netstat` en esta forma informa sockets/puertos y estado; no identifica qué aplicación los abrió. La pregunta pide una respuesta única aunque la captura tiene varias asociaciones convencionales plausibles.",
        "interpretations": "Hipótesis docente: elegir una asociación de puerto convencional, posiblemente SSH o HTTPS. Teoría estricta: un listener en un puerto registrado no demuestra por sí solo que corra el servicio asignado; la opción HTTP en 8080 tampoco es segura sin el proceso. Evidencia disponible: tres sockets TCP en escucha, sin proceso asociado.",
        "missing": ["La salida `netstat -b` o datos PID/proceso para identificar ejecutables [4].", "Una consigna de selección múltiple o un criterio que descarte dos de los tres listeners.", "La fotografía original del examen si se busca validar que la imagen y las alternativas coincidan con el parcial."],
        "discussion": "¿Debe aceptarse la asociación convencional de los puertos (22, 443 y 8080), o «puede asegurar» requiere identificar el proceso real?",
        "decision": "Definir el alcance de «servicios que funcionan» y si se esperaba una asociación de puerto o evidencia del proceso.",
        "recommendation": "Mantenerla sin puntuar y reescribir el ítem para pedir la asociación probable o añadir PID/ejecutable y selección múltiple si corresponde.",
        "sources": [3, 4, 5],
        "options": {
            "option-1": ("SSH, servicio convencional en TCP/22.", "TCP/22 está registrado/convencionalmente asociado a SSH [5].", "Un listener no prueba que el ejecutable sea SSH; además aparecen otros puertos convencionales [4, 5].", "DEFENDIBLE PERO DISCUTIBLE"),
            "option-2": ("DNS, servicio habitual en UDP/53.", "DNS usa 53, normalmente UDP para consultas ordinarias [3, 5].", "La captura muestra TCP/22, TCP/443 y TCP/8080, no UDP/53 [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-3": ("DHCP, servicio convencional en UDP/67–68.", "DHCP usa UDP/67–68 [3, 5].", "No aparece ninguno de esos puertos [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-4": ("HTTP en puerto alternativo TCP/8080.", "El listener TCP/8080 puede alojar HTTP alternativo, uso extendido en aplicaciones web [5].", "8080 no demuestra HTTP ni qué proceso escucha; un servicio arbitrario puede enlazarse allí [4, 5].", "DEFENDIBLE PERO DISCUTIBLE"),
            "option-5": ("FTP, servicio convencional TCP/20–21.", "FTP clásico usa 20/21 [3, 5].", "La captura no muestra esos puertos [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-6": ("Telnet, servicio convencional TCP/23.", "TCP/23 es el puerto asignado a Telnet [5].", "La captura no muestra TCP/23 [4].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-7": ("HTTPS, servicio convencional TCP/443.", "TCP/443 está asociado convencionalmente con HTTPS [5].", "El estado LISTEN no identifica el ejecutable ni demuestra que el servicio sea HTTPS; otros listeners también admiten asociaciones plausibles [4, 5].", "DEFENDIBLE PERO DISCUTIBLE"),
        },
    },
    83: {
        "topic": "SMTP: envoltura de transporte versus encabezado y cuerpo",
        "evidence": "No hay imagen asociada. La evidencia disponible es el enunciado literal y cuatro alternativas. La pregunta está configurada como opción única.",
        "origin": "No existe referencia visual en el JSON de extracción para esta pregunta. Se analizan el texto transcrito y las alternativas completas; no se infiere una captura ausente.",
        "reason": "El sobre (envelope) SMTP de la transacción identifica un remitente con MAIL FROM y uno o más destinatarios con RCPT TO. Ninguna alternativa incluye ambos. La opción 4 menciona remitente, pero añade «versión de SMTP» —que no es componente del sobre— y omite destinatarios. Asunto/cuerpo pertenecen al contenido del mensaje; prioridades o versiones de POP/SMTP no completan el sobre.",
        "interpretations": "Hipótesis docente: la cátedra podría haber querido que se responda «remitente» o diferenciar sobre de cuerpo, o el enunciado/opción pudo perder una parte en la transcripción. Teoría estricta: hacen falta dirección de retorno y destinatarios de la transacción SMTP [7]. Evidencia disponible: ninguna opción ofrece esa pareja completa.",
        "missing": ["La opción original completa, si se perdió una frase durante la extracción.", "Una aclaración de la cátedra sobre si «envoltura» se usó de forma abreviada para un solo campo.", "La fotografía original del enunciado y sus alternativas."],
        "discussion": "¿La opción «remitente y versión SMTP» pretendía decir «remitente y destinatario», o realmente estaba incompleta en el examen?",
        "decision": "Decidir si existe una opción original perdida o si el ítem debe mantenerse definitivamente sin respuesta.",
        "recommendation": "Mantenerla sin puntuar; corregir la alternativa para que incluya MAIL FROM y RCPT TO si se prepara una versión nueva.",
        "sources": [6, 7],
        "options": {
            "option-1": ("Campos de asunto y cuerpo del mensaje.", "Asunto y cuerpo son partes del mensaje/contenido que transporta SMTP [6].", "No describen los comandos MAIL FROM y RCPT TO que forman el sobre de transporte [7].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-2": ("Prioridad y nivel de seguridad.", "Pueden aparecer como datos/atributos de mensaje en ciertos formatos.", "No son los campos del sobre SMTP requeridos para encaminar la transacción [7].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-3": ("Versión de POP y versión de SMTP.", "Menciona dos protocolos de correo.", "El sobre identifica reverse-path y forward-path; no consiste en versiones de protocolos [7].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-4": ("Remitente y versión de SMTP.", "«Remitente» puede corresponder al reverse-path de MAIL FROM [7].", "La versión de SMTP no integra el sobre y faltan los destinatarios RCPT TO; por eso no es una respuesta completa [7].", "DEFENDIBLE PERO DISCUTIBLE"),
        },
    },
    119: {
        "topic": "Routing: lectura histórica de una tabla reconstruida",
        "evidence": "En la imagen actual, la tabla muestra `C 192.168.70.0/24 is directly connected, Serial0/1/1` y `L 192.168.70.1/32 is directly connected, Serial0/1/1`. No se observa una ruta R para el prefijo 192.168.70.0/24. La ruta R cercana visible es `192.168.50.0/24 [120/1] via 192.168.70.2`; otras filas R corresponden a 10.0/24 y 30.0/24.",
        "origin": "PNG descargado del banco como `https://cuestionario-redes.vercel.app/imagenes/topologia-tabla-ruteo-4k1.png`; SHA-256 `42a2abb1e63652c10014ce21e81588a799bdc138bd69fac91c92b98485f61fd0`. La nota de extracción indica que las opciones no eran visibles en el parcial y fueron reconstruidas, y que la imagen se mejoró con IA. No se halló una fotografía independiente del examen.",
        "reason": "El análisis V2 afirmaba que 192.168.70.0/24 aparece a la vez como R y C. Amplié visualmente el PNG: solo se lee C para ese prefijo, además de L 192.168.70.1/32; no hay fila R de .70. La fila RIP cercana anuncia .50/24 vía .70.2, lo que puede haber causado la confusión. Por el diagrama disponible, la opción «directamente conectada» coincide con la reconstrucción. Sin foto del examen ni opciones originales, no puede certificarse que la imagen mejorada represente lo que se evaluó históricamente; la razón original de ambigüedad estaba equivocada y se corrige.",
        "interpretations": "Hipótesis docente: si el ítem se basó en la tabla hoy visible, probablemente pretendía «directamente conectada» por el código C. Teoría estricta de la tabla mostrada: las rutas C y L son rutas local/conectada; una ruta R tendría código R y menor preferencia frente a una ruta conectada con distancia administrativa 0, frente a RIP 120 [8, 9]. Evidencia disponible: la reconstrucción muestra C/L para .70, no R; la fidelidad del artefacto al original y las opciones originales no se verifican.",
        "missing": ["Una fotografía original sin mejora de la tabla y del selector de respuestas del examen.", "La lista original de alternativas, que la nota de extracción dice que no pudo verse.", "Si existe, una captura independiente de la página 4K1 antes de la reconstrucción IA."],
        "discussion": "Si el PNG actual es lo único que se conserva, ¿alcanza para tratar la alternativa «directamente conectada» como clave del ejercicio de práctica, o debemos mantener la cautela histórica y no puntuar?",
        "decision": "Resolver si se puntúa el escenario dibujado o se mantiene sin puntuar por falta de evidencia de fidelidad histórica; no promover automáticamente la clave.",
        "recommendation": "Mantenerla sin puntuar y con OJO según la instrucción del proyecto. La próxima revisión debe partir de la fotografía original; retirar del historial la afirmación errónea de que el PNG muestra R/C duplicado para .70.",
        "sources": [8, 9],
        "options": {
            "option-1": ("Red directamente conectada al router.", "El PNG visible marca C para `192.168.70.0/24` y L para `192.168.70.1/32` en Serial0/1/1; C representa connected [9].", "La imagen fue mejorada y la opción fue reconstruida, así que la lectura no acredita el original histórico.", "CORRECTA SEGÚN LA EVIDENCIA DE LA RECONSTRUCCIÓN; HISTORIA NO VERIFICABLE"),
            "option-2": ("Ruta estática.", "No hay dato visual que apoye una ruta estática para .70.", "No se ve código S; la ruta de red visible está rotulada C [9].", "INCORRECTA SEGÚN LA EVIDENCIA DISPONIBLE"),
            "option-3": ("Ruta aprendida por RIP.", "El código R aparece en otras rutas de la tabla y RIP se asocia a AD 120 [8, 9].", "No hay fila R para 192.168.70.0/24 en el PNG ampliado. La entrada R visible por 192.168.70.2 corresponde a 192.168.50.0/24 [9].", "INCORRECTA SEGÚN LA RECONSTRUCCIÓN; HISTORIA NO VERIFICABLE"),
            "option-4": ("Ruta aprendida por OSPF.", "OSPF aparece como código O en el esquema Cisco [9].", "No se observa una entrada O para el prefijo .70 ni otra evidencia de OSPF [9].", "INCORRECTA SEGÚN LA EVIDENCIA DISPONIBLE"),
        },
    },
    127: {
        "topic": "Seguridad: integridad ante un atacante activo",
        "evidence": "No hay imagen asociada. El enunciado dice que la sucursal envía órdenes de pago cifradas; el atacante no las lee, modifica algunos bits y casa central procesa datos distintos. Se pide identificar amenaza y qué faltó.",
        "origin": "El caso se recibe como texto, sin captura o anexo visual. Se confronta con la filmina local sobre integridad/hash y estándares primarios sobre MAC/HMAC y cifrado autenticado.",
        "reason": "La amenaza descrita es modificación y afecta integridad. La alternativa 1 identifica correctamente esa amenaza, pero propone un hash simple como protección activa. Un atacante que puede alterar el mensaje puede recalcular un hash no autenticado; el hash por sí solo no prueba quién generó el valor. Para resistir alteración activa hace falta autenticación criptográfica —por ejemplo, MAC/HMAC, firma verificable según el modelo, o cifrado autenticado AEAD— y la pregunta no aporta ninguna de esas opciones completas [11–13]. La filmina relaciona hash con integridad, pero no distingue hash simple de autenticación contra adversario activo [10].",
        "interpretations": "Hipótesis docente: la filmina puede haber llevado a responder «hash» como mecanismo de integridad [10]. Teoría estricta: la confidencialidad del cifrado no implica autenticidad/integridad; para un atacante activo se requiere una etiqueta autenticada o firma [11–13]. Evidencia disponible: la descripción demuestra modificación; el método exacto de cifrado, ubicación del hash, existencia de clave compartida o autenticación no se especifican.",
        "missing": ["Si el esquema existente era cifrado sin integridad, cifrado con hash interno, MAC separado o AEAD.", "Qué amenaza/servicio quería nombrar la cátedra: detectar errores accidentales o resistir manipulación maliciosa.", "Una alternativa técnicamente suficiente, por ejemplo MAC/HMAC, firma digital o AEAD."],
        "discussion": "¿Debe considerarse correcta la alternativa 1 por identificar modificación/integridad en el marco simplificado de la filmina, o se la rechaza porque un hash no autenticado no protege frente a un atacante activo?",
        "decision": "Decidir si se mantiene como no puntuable o si se reescribe la alternativa con un mecanismo autenticado y una clave/modelo de confianza definidos.",
        "recommendation": "Mantenerla sin puntuar y no revelar la alternativa 1 como respuesta. Si se busca evaluar solo la categoría de amenaza, separarla de la pregunta sobre el mecanismo de protección.",
        "sources": [10, 11, 12, 13],
        "options": {
            "option-1": ("Modificación/integridad; hash para detectar alteración.", "Identifica correctamente modificación e integridad; un hash puede detectar cambios accidentales si el valor de referencia es confiable [10].", "Ante un atacante activo, un hash sin clave/autenticación puede reemplazarse o recalcularse; no garantiza autenticidad del mensaje [11, 12].", "DEFENDIBLE PERO DISCUTIBLE (diagnóstico correcto, solución insuficiente)"),
            "option-2": ("Interceptación/confidencialidad; una clave más larga.", "Una clave más fuerte puede apoyar confidencialidad.", "El escenario dice que el atacante no leyó los datos; el daño fue modificar bits. La longitud de clave no aporta por sí sola autenticación/integridad [11, 12].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-3": ("Interrupción/disponibilidad; firewall con estado.", "Un firewall con estado puede controlar flujos en ciertos escenarios.", "No se describe una interrupción del servicio; se procesaron datos modificados. Un firewall no autentica el contenido del mensaje por sí solo [11, 12].", "INCORRECTA SEGÚN LA EVIDENCIA"),
            "option-4": ("Invención/autenticidad; cifrar dos veces.", "La autenticidad es un servicio de seguridad relacionado.", "El atacante modificó un mensaje existente, no inventó uno; el doble cifrado no equivale a MAC, firma o AEAD [11–13].", "INCORRECTA SEGÚN LA EVIDENCIA"),
        },
    },
}


BIBLIOGRAPHY = {
    1: "Filminas UTN FRC, `F:\\Facundo - Facultad\\4to año\\REDES\\Tercer parcial\\Filminas\\3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf`, visor pp. 24–25. Presenta SYN, SYN+ACK, ACK final, opciones TCP y el three-way handshake.",
    2: "IETF, RFC 9293, *Transmission Control Protocol*, §3.5 (three-way handshake) y §3.10 (máquina de estados): https://www.rfc-editor.org/rfc/rfc9293.html",
    3: "Filminas UTN FRC, `F:\\Facundo - Facultad\\4to año\\REDES\\Tercer parcial\\Filminas\\3 - 01 - RRD - Unidad 5 - Capa de transporte.pdf`, visor pp. 31–33. La p. 33 define LISTEN como espera de conexiones entrantes; la p. 31 enumera servicios/puertos convencionales.",
    4: "Microsoft Learn, `netstat`: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat. Describe puertos en escucha; el modificador `-b` muestra el ejecutable que creó la conexión o listener.",
    5: "IANA, *Service Name and Transport Protocol Port Number Registry*: https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml. Incluye asignaciones 22/SSH, 23/Telnet, 53/DNS y 443/HTTPS; advierte que una asignación no prueba que el tráfico corresponda a esa aplicación.",
    6: "Filminas UTN FRC, `F:\\Facundo - Facultad\\4to año\\REDES\\Tercer parcial\\Filminas\\3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf`, visor pp. 30–32. Separa envoltura, encabezado y cuerpo; la envoltura lleva datos para la transferencia/MTA.",
    7: "IETF, RFC 5321, *Simple Mail Transfer Protocol*, §3.3 y §§4.1.1.2–4.1.1.3: `MAIL FROM` y `RCPT TO`; https://www.rfc-editor.org/rfc/rfc5321.html",
    8: "Filminas UTN FRC, `F:\\Facundo - Facultad\\4to año\\REDES\\Segundo parcial\\filminas\\2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf`, visor pp. 8–9. RIP: métrica por saltos, AD 120; conectado/estático comparados por confianza.",
    9: "Cisco, *Cisco IOS IP Routing: Protocol-Independent Command Reference*, `show ip route` route codes and default AD: C=connected, S=static, R=RIP; connected AD 0 and RIP AD 120. https://www.cisco.com/c/en/us/td/docs/ios/iproute_pi/command/reference/iri_book/iri_pi1.html and https://www.cisco.com/c/en/us/td/docs/ios/iproute_pi/command/reference/iri_book/iri_pi2.html",
    10: "Filminas UTN FRC, `F:\\Facundo - Facultad\\4to año\\REDES\\Tercer parcial\\Filminas\\3 - 06 - RRD - Unidad 6 - Seguridad.pdf`, visor pp. 16–17. Presenta integridad y hash/digest; no detalla un hash autenticado contra adversario activo.",
    11: "IETF, RFC 2104, *HMAC: Keyed-Hashing for Message Authentication*, §1. Explica que el MAC usa una clave secreta compartida para validar mensajes: https://www.rfc-editor.org/rfc/rfc2104.html",
    12: "IETF, RFC 5116, *An Interface and Algorithms for Authenticated Encryption*, §1. AE/AEAD brinda confidencialidad y una forma de comprobar integridad y autenticidad: https://www.rfc-editor.org/rfc/rfc5116.html",
    13: "NIST, FIPS 186-5, *Digital Signature Standard*, introducción. Firma con clave privada y verificación con la pública correspondiente: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf",
}


def q_by_position(data: dict, position: int) -> dict:
    return next(q for q in data["questions"] if q["extractionPosition"] == position)


def update_v3_json() -> dict:
    base = json.loads(V2_PATH.read_text(encoding="utf-8"))
    data = copy.deepcopy(base)
    correction_count = 0
    for position, option_id, rationale in CORRECTIONS:
        question = q_by_position(data, position)
        evaluation = next(e for e in question["resolution"]["optionEvaluations"] if e["optionId"] == option_id)
        evaluation["rationale"] = rationale
        correction_count += 1

    q119 = q_by_position(data, 119)
    q119["resolution"]["justification"] = (
        "La imagen asociada al cuestionario muestra 192.168.70.0/24 como ruta C directamente conectada por "
        "Serial0/1/1 y 192.168.70.1/32 como ruta local L; no se observa una entrada R para ese prefijo. "
        "La ruta R visible cercana corresponde a otro destino y puede confundirse al transcribirla. No obstante, "
        "la nota de extracción indica que las opciones se reconstruyeron y que la imagen fue mejorada con IA. "
        "Sin una fotografía original independiente o las opciones originales, solo puede describirse lo que muestra "
        "esta reconstrucción; la pregunta histórica permanece sin clave y sin puntuación."
    )
    q119["resolution"]["problems"] = [
        "[Corrección de auditoría V3] En el recurso visual actual no se confirma el conflicto R/C previamente "
        "atribuido a 192.168.70.0/24: la fila legible es C y la fila local es L 192.168.70.1/32. No se identifica "
        "una ruta R para .70. La procedencia mejorada con IA y las alternativas reconstruidas impiden concluir "
        "que ese sea el escenario original; se mantiene AMBIGUA y sin clave."
    ]
    q119["resolution"]["observations"].append(
        "Revisión V3: se amplió visualmente la tabla y se corrigió la descripción anterior que afirmaba una ruta R para 192.168.70.0/24."
    )
    correction_count += 1  # question-level general justification, outside the 585 per-option rationales

    for position in OJO_POSITIONS:
        q_by_position(data, position)["presentationSuffix"] = "(OJO: PREGUNTA AMBIGUA)"

    data["auditMetadata"] = {
        **data.get("auditMetadata", {}),
        "iteration": 5,
        "functionalValidation": "local_api_import_smoke_passed",
        "basedOnCommit": BASE_COMMIT,
        "reviewedJustificationCount": 585,
        "correctedJustificationCount": correction_count,
        "presentationWarningPositions": OJO_POSITIONS,
        "justificationAudit": (
            "Se revisaron las 585 justificaciones por alternativa y se corrigieron diez explicaciones de alternativa "
            "demostrablemente mal asociadas, incompletas o basadas en una lectura visual errónea; además se corrigió "
            "una justificación general de pregunta, fuera de esas 585. Las 123 claves verificadas se conservaron sin cambios."
        ),
        "note": (
            "Las seis advertencias de presentación se añaden mediante presentationSuffix; los enunciados de extracción "
            "y el campo prompt permanecen intactos. Las 123 claves y los estados de auditoría de V2 se conservaron."
        ),
    }
    V3_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return data


def create_quiz_docx(data: dict) -> dict:
    doc = Document()
    section = doc.sections[0]
    section.page_width, section.page_height = Inches(8.5), Inches(11)
    section.top_margin, section.bottom_margin = Inches(0.82), Inches(0.62)
    section.left_margin, section.right_margin = Inches(0.72), Inches(0.72)
    section.header_distance, section.footer_distance = Inches(0.3), Inches(0.3)
    normal = doc.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(10.2)
    normal.font.color.rgb = RGBColor.from_string("202A35")
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.line_spacing = 1.06

    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = footer.add_run()
    r.font.name, r.font.size = "Arial", Pt(8)
    field = OxmlElement("w:fldSimple")
    field.set(qn("w:instr"), "PAGE")
    r._r.addnext(field)

    option_count = image_refs = justification_count = 0
    unique_images = set()
    for question in data["questions"]:
        position = question["extractionPosition"]
        resolution = question["resolution"]
        verified = resolution["status"] == "VERIFICADA"
        marker = "@@@" if question["responseType"] == "multiple" else "@@"
        heading = doc.add_paragraph()
        heading.paragraph_format.space_before, heading.paragraph_format.space_after = Pt(8), Pt(3)
        heading.paragraph_format.keep_with_next = True
        marker_run = heading.add_run(f"{marker} ")
        marker_run.font.name, marker_run.font.size = "Arial", Pt(1)
        marker_run.font.color.rgb = RGBColor.from_string("FFFFFF")
        num = heading.add_run(f"{position}. ")
        num.font.name, num.font.size, num.bold = "Arial", Pt(7.2), True
        num.font.color.rgb = RGBColor.from_string("64748B")
        prompt = heading.add_run(question["prompt"])
        if question.get("presentationSuffix"):
            prompt.add_text(" " + question["presentationSuffix"])
        prompt.font.name, prompt.font.size, prompt.bold = "Arial", Pt(10.8), True
        prompt.font.color.rgb = RGBColor.from_string("182B45")

        if not verified:
            status = doc.add_paragraph()
            status.paragraph_format.left_indent = Inches(0.08)
            status.paragraph_format.space_after = Pt(2)
            status.paragraph_format.keep_with_next = True
            hidden = status.add_run("[[SIN_PUNTUAR]]")
            hidden.font.name, hidden.font.size = "Arial", Pt(1)
            hidden.font.color.rgb = RGBColor.from_string("FFFFFF")

        for image in question.get("images", []):
            image_path = ROOT / image["file"]
            image_bytes = image_path.read_bytes()
            if hashlib.sha256(image_bytes).hexdigest() != image["sha256"]:
                raise ValueError(f"Image hash mismatch: {image_path}")
            tag = doc.add_paragraph()
            tag.paragraph_format.space_after = Pt(1)
            hidden = tag.add_run("[[IMAGEN]]")
            hidden.font.name, hidden.font.size = "Arial", Pt(1)
            hidden.font.color.rgb = RGBColor.from_string("FFFFFF")
            picture_p = doc.add_paragraph()
            picture_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            picture_p.paragraph_format.space_after = Pt(3)
            picture_p.paragraph_format.keep_with_next = True
            picture = picture_p.add_run().add_picture(str(image_path), width=Inches(6.72))
            description = image.get("alt") or "Imagen asociada a la pregunta"
            picture._inline.docPr.set("descr", description)
            picture._inline.docPr.set("title", description)
            image_refs += 1
            unique_images.add(image["file"])

        evaluations = {evaluation["optionId"]: evaluation for evaluation in resolution.get("optionEvaluations", [])}
        for option_index, option in enumerate(question["options"]):
            option_count += 1
            correct = verified and option["id"] in resolution["selectedOptionIds"]
            row = doc.add_paragraph()
            row.paragraph_format.left_indent = Inches(0.27)
            row.paragraph_format.first_line_indent = Inches(-0.21)
            row.paragraph_format.space_after = Pt(1.5)
            row.paragraph_format.keep_together = True
            letter = chr(ord("a") + option_index)
            lr = row.add_run(f"{letter}) ")
            lr.bold, lr.font.name, lr.font.size = True, "Arial", Pt(9.8)
            lr.font.color.rgb = RGBColor.from_string("214D80")
            text = row.add_run(option["text"] + (" *" if correct else ""))
            text.font.name, text.font.size = "Arial", Pt(9.8)

            evaluation = evaluations.get(option["id"])
            if evaluation is None:
                raise ValueError(f"Missing option evaluation at question {position}, {option['id']}")
            if verified and correct:
                explanation = (
                    "Evaluación de esta alternativa: " + evaluation["rationale"] +
                    " Fundamento de la respuesta verificada: " + resolution["justification"]
                )
            elif not verified:
                explanation = (
                    f"Estado de auditoría: {resolution['status']}; esta pregunta no define una clave ni suma puntos. "
                    f"Fundamento general: {resolution['justification']} "
                    f"Evaluación de esta alternativa ({evaluation['verdict'].upper()}): {evaluation['rationale']}"
                )
            else:
                explanation = f"Evaluación de esta alternativa ({evaluation['verdict'].upper()}): {evaluation['rationale']}"
            start = doc.add_paragraph()
            start.paragraph_format.left_indent = Inches(0.27)
            start.paragraph_format.space_after = Pt(0)
            start.paragraph_format.keep_with_next = True
            hidden = start.add_run("[[JUSTIFICACION]]")
            hidden.font.name, hidden.font.size = "Arial", Pt(1)
            hidden.font.color.rgb = RGBColor.from_string("FFFFFF")
            body = doc.add_paragraph(explanation)
            body.paragraph_format.left_indent = Inches(0.27)
            body.paragraph_format.space_after = Pt(0)
            body.paragraph_format.keep_together = True
            body.paragraph_format.keep_with_next = True
            for run in body.runs:
                run.font.name, run.font.size = "Arial", Pt(8.6)
                run.font.color.rgb = RGBColor.from_string("334155")
            end = doc.add_paragraph()
            end.paragraph_format.left_indent = Inches(0.27)
            end.paragraph_format.space_after = Pt(0.5)
            hidden = end.add_run("[[FIN_JUSTIFICACION]]")
            hidden.font.name, hidden.font.size = "Arial", Pt(1)
            hidden.font.color.rgb = RGBColor.from_string("FFFFFF")
            justification_count += 1

    if (len(data["questions"]), option_count, image_refs, len(unique_images), justification_count) != (132, 585, 40, 15, 585):
        raise ValueError({"questions": len(data["questions"]), "options": option_count, "images": image_refs, "uniqueImages": len(unique_images), "justifications": justification_count})
    doc.core_properties.title = "Redes Parcial 4K1 2026 Resuelto V3"
    doc.core_properties.subject = "Versión académica V3 con seis advertencias OJO"
    doc.core_properties.author = "JoyaCards"
    doc.core_properties.keywords = "Redes, 4K1, V3, cuestionario"
    doc.save(WORD_PATH)
    return {"questions": len(data["questions"]), "options": option_count, "images": image_refs, "uniqueImages": len(unique_images), "justifications": justification_count}


def render_inline(paragraph, text: str) -> None:
    pattern = re.compile(r"(\*\*.*?\*\*|`[^`]+`)")
    for chunk in pattern.split(text):
        if not chunk:
            continue
        if chunk.startswith("**") and chunk.endswith("**"):
            run = paragraph.add_run(chunk[2:-2])
            run.bold = True
        elif chunk.startswith("`") and chunk.endswith("`"):
            run = paragraph.add_run(chunk[1:-1])
            run.font.name = "Consolas"
        else:
            paragraph.add_run(chunk)


def markdown_to_docx(markdown: str) -> None:
    doc = Document()
    section = doc.sections[0]
    section.page_width, section.page_height = Inches(8.5), Inches(11)
    section.top_margin, section.bottom_margin = Inches(0.72), Inches(0.65)
    section.left_margin, section.right_margin = Inches(0.7), Inches(0.7)
    normal = doc.styles["Normal"]
    normal.font.name, normal.font.size = "Arial", Pt(9.5)
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.paragraph_format.space_after = Pt(3)
    normal.paragraph_format.line_spacing = 1.05
    for style_name, size, color in [("Heading 1", 15, "17365D"), ("Heading 2", 12, "214D80"), ("Heading 3", 10, "334155")]:
        style = doc.styles[style_name]
        style.font.name, style.font.size, style.font.bold = "Arial", Pt(size), True
        style.font.color.rgb = RGBColor.from_string(color)
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")

    title_style = doc.styles["Title"]
    title_style.font.name, title_style.font.size, title_style.font.bold = "Arial", Pt(20), True
    title_style.font.color.rgb = RGBColor(0, 0, 0)
    title_style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    title_style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    title_style.paragraph_format.space_after = Pt(10)
    title_ppr = title_style._element.pPr
    if title_ppr is not None:
        title_border = title_ppr.find(qn("w:pBdr"))
        if title_border is not None:
            title_ppr.remove(title_border)

    lines = markdown.splitlines()
    index = 0
    while index < len(lines):
        line = lines[index]
        if line.startswith("| "):
            rows = []
            while index < len(lines) and lines[index].startswith("|"):
                cells = [cell.strip() for cell in lines[index].strip().strip("|").split("|")]
                if not all(re.fullmatch(r"[-: ]+", cell or " ") for cell in cells):
                    rows.append(cells)
                index += 1
            if rows:
                table = doc.add_table(rows=0, cols=len(rows[0]))
                table.style = "Light Shading Accent 1"
                for row_index, row_data in enumerate(rows):
                    cells = table.add_row().cells
                    for cell_index, value in enumerate(row_data):
                        cells[cell_index].text = ""
                        p = cells[cell_index].paragraphs[0]
                        p.paragraph_format.space_after = Pt(1)
                        render_inline(p, value.replace("\\|", "|"))
                        for run in p.runs:
                            run.font.name = "Arial"
                            run.font.size = Pt(7.2)
                            if row_index == 0:
                                run.bold = True
                    if row_index == 0:
                        for cell in cells:
                            shade = OxmlElement("w:shd")
                            shade.set(qn("w:fill"), "DCE6F1")
                            cell._tc.get_or_add_tcPr().append(shade)
            continue
        image_match = re.search(r"!\[(.*?)\]\((.*?)\)", line)
        if image_match:
            prefix = line[:image_match.start()].strip()
            suffix = line[image_match.end():].strip()
            if prefix:
                paragraph = doc.add_paragraph()
                render_inline(paragraph, prefix)
            image_path = ROOT / image_match.group(2)
            if not image_path.is_file():
                raise FileNotFoundError(f"Audit image not found: {image_path}")
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before, p.paragraph_format.space_after = Pt(3), Pt(3)
            p.add_run().add_picture(str(image_path), width=Inches(6.7))
            caption = doc.add_paragraph(image_match.group(1))
            caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in caption.runs:
                run.italic = True
                run.font.size = Pt(8)
            if suffix:
                paragraph = doc.add_paragraph()
                render_inline(paragraph, suffix)
            index += 1
            continue
        if line.startswith("# "):
            paragraph = doc.add_paragraph(style="Title")
            paragraph.paragraph_format.space_after = Pt(6)
            render_inline(paragraph, line[2:])
        elif line.startswith("## "):
            paragraph = doc.add_paragraph(style="Heading 1")
            render_inline(paragraph, line[3:])
        elif line.startswith("### "):
            paragraph = doc.add_paragraph(style="Heading 2")
            render_inline(paragraph, line[4:])
        elif line.startswith("#### "):
            paragraph = doc.add_paragraph(style="Heading 3")
            render_inline(paragraph, line[5:])
        elif line.startswith("- "):
            paragraph = doc.add_paragraph(style="List Bullet")
            render_inline(paragraph, line[2:])
        elif re.match(r"^\d+\. ", line):
            paragraph = doc.add_paragraph(style="List Number")
            render_inline(paragraph, re.sub(r"^\d+\. ", "", line))
        elif line.startswith("> "):
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.left_indent = Inches(0.22)
            paragraph.paragraph_format.right_indent = Inches(0.18)
            paragraph.paragraph_format.space_before = Pt(2)
            paragraph.paragraph_format.space_after = Pt(5)
            render_inline(paragraph, line[2:])
            for run in paragraph.runs:
                run.italic = True
                run.font.color.rgb = RGBColor.from_string("334155")
        elif line.strip() == "---":
            doc.add_paragraph()
        elif line.strip():
            paragraph = doc.add_paragraph()
            render_inline(paragraph, line)
        index += 1
    doc.core_properties.title = "Auditoría académica de las seis preguntas ambiguas Redes 4K1 2026"
    doc.core_properties.subject = "Documento independiente para revisión académica"
    doc.core_properties.author = "JoyaCards"
    doc.save(OJO_DOCX_PATH)


def build_ojo_report(data: dict) -> str:
    rows = [
        "# Auditoría académica independiente de las preguntas OJO Redes 4K1 2026",
        "",
        "## Alcance y criterio",
        "",
        "Este documento analiza individualmente las seis preguntas que V2 conserva como `AMBIGUA`: posiciones estables 37, 60, 79, 83, 119 y 127. Las respuestas correctas del sitio no se utilizaron como fuente. Se distinguen tres cosas: lo que enseña el material de cátedra, lo que exige la especificación técnica y lo que se puede leer en el recurso actual. Ninguna sección crea una clave puntuable.",
        "",
        "Las posiciones corresponden al orden del JSON, no al orden aleatorio de una sesión. Los enunciados y alternativas que siguen se copian literalmente de `preguntas-sin-resolver.json`; las imágenes se vinculan desde `assets/` y se describen según lo que se ve en ellas.",
        "",
        "## Resumen comparativo",
        "",
        "| Pregunta | Tema | Problema principal | Alternativas defendibles | Evidencia faltante |",
        "|---:|---|---|---|---|",
        "| 37 | TCP SYN+ACK | La pregunta exige dos respuestas, pero solo una es inequívoca según el handshake estricto. | 1 (lectura simplificada de cátedra), 4 | Tercer ACK y criterio de cátedra para «acepta». |",
        "| 60 | Netstat | TCP/23 y UDP/53 son convencionales, pero no prueban qué aplicaciones están corriendo; selección única. | 2 (DNS), 7 (Telnet), con reserva | PID/ejecutable y criterio de selección múltiple. |",
        "| 79 | Netstat | TCP/22, /443 y /8080 admiten varias asociaciones; el proceso no se identifica. | 1 (SSH), 4 (HTTP alternativo), 7 (HTTPS) | PID/ejecutable y aclaración de una o varias respuestas. |",
        "| 83 | SMTP | Ninguna alternativa enumera remitente y destinatarios del sobre. | 4 parcialmente (remitente) | Alternativa completa u original legible. |",
        "| 119 | Routing | La explicación V2 alegaba una duplicación R/C que no aparece en el PNG actual; la imagen y opciones fueron reconstruidas. | 1 según la imagen actual, no como clave histórica | Foto original y selector de respuestas original. |",
        "| 127 | Seguridad | Modificación afecta integridad, pero un hash simple no autentica contra atacante activo. | 1 parcialmente (diagnóstico correcto) | Modelo de integridad y alternativa con MAC/firma/AEAD. |",
        "",
        "## Desarrollo exhaustivo",
        "",
    ]

    for position in OJO_POSITIONS:
        question = q_by_position(data, position)
        case = CASES[position]
        count = question.get("requiredSelections") or 1
        rows += [
            f"## Pregunta {position} {case['topic'].replace(':', '').replace('+', ' ')}",
            "",
            "### A Identificación",
            "",
            f"- **Número estable:** {position} (extracción {question['extractionPosition']}).",
            f"- **ID exacto:** `{question['id']}`.",
            f"- **Tema:** {case['topic']}.",
            f"- **Tipo:** `{question['responseType']}`.",
            f"- **Respuestas solicitadas:** {count}.",
            f"- **Estado académico:** `{question['resolution']['status']}`; no tiene clave puntuable.",
            f"- **Confianza registrada:** {question['resolution']['confidence']} (respecto de la decisión de mantenerla pendiente, no de la fidelidad histórica del examen).",
            "",
            "### B Enunciado original completo",
            "",
            f"> {question['prompt']}",
            "",
            "### C Todas las alternativas originales",
            "",
        ]
        for option in question["options"]:
            rows.append(f"- **ID `{option['id']}`** — {option['text']}")
        rows += ["", "### D Evidencia de la consigna", "", case["evidence"], "", f"**Procedencia y estado de reconstrucción:** {case['origin']}", ""]
        for image in question.get("images", []):
            rows.append(f"- **Ruta exacta:** `{image['file']}`.")
            rows.append(f"- **SHA-256:** `{image['sha256']}`.")
            rows.append(f"- **URL de origen registrada:** {image['originalUrl']}.")
            rows.append(f"- **Imagen:** ![{case['topic']}]({image['file']})")
        if not question.get("images"):
            rows.append("- **Imagen:** no hay una referencia de imagen asociada en el JSON de extracción.")
        rows += [
            "",
            "### E Análisis individual de alternativas",
            "",
        ]
        for option in question["options"]:
            concept, favor, against, classification = case["options"][option["id"]]
            rows += [
                f"#### Opción {option['id'].removeprefix('option-')}",
                "",
                f"**Texto literal:** {option['text']}",
                "",
                f"**Concepto que expresa:** {concept}",
                "",
                f"**Evidencia a favor:** {favor}",
                "",
                f"**Evidencia en contra / límite:** {against}",
                "",
                f"**Fuente(s):** {', '.join(f'[{source}]' for source in case['sources'])}.",
                "",
                f"**Conclusión provisional:** {classification}.",
                "",
            ]
        rows += [
            "### F Motivo exacto del OJO",
            "",
            f"**¿Por qué no podemos marcar una respuesta correcta con seguridad?** {case['reason']}",
            "",
            "### G Interpretaciones posibles",
            "",
            case["interpretations"],
            "",
            "### H Fuentes bibliográficas",
            "",
        ]
        for source in case["sources"]:
            rows.append(f"- [{source}] {BIBLIOGRAPHY[source]}")
        rows += ["", "### I Evidencia necesaria para resolverla", ""]
        for item in case["missing"]:
            rows.append(f"- {item}")
        rows += [
            "",
            "### J Propuesta para discutir",
            "",
            f"**Pregunta concreta para nuestra revisión:** {case['discussion']}",
            "",
            f"**Decisión que falta tomar:** {case['decision']}",
            "",
            f"**Recomendación técnica:** {case['recommendation']}",
            "",
            "---",
            "",
        ]

    rows += [
        "## Bibliografía consultada",
        "",
    ]
    used_sources = sorted({source for case in CASES.values() for source in case["sources"]})
    for source in used_sources:
        rows.append(f"- [{source}] {BIBLIOGRAPHY[source]}")
    rows += [
        "",
        "## Evidencia faltante consolidada",
        "",
        "- Fotografías originales del examen para las capturas TCP/netstat/routing; los PNGs del sitio no demuestran fidelidad histórica.",
        "- Salida de proceso (`netstat -b` o PID y ejecutable) para las preguntas 60 y 79.",
        "- Captura íntegra de handshake de q37, incluido el tercer ACK.",
        "- Redacción y opciones originales de q83 y q119; en q119 el selector no se conservó.",
        "- Definición explícita del adversario y del mecanismo de integridad en q127, más una opción criptográficamente suficiente.",
        "",
        "## Plan sugerido para la revisión conjunta",
        "",
        "1. Revisar primero q119 con el PNG ampliado y buscar la fotografía del examen; no repetir la afirmación de una fila R para .70 sin comprobarla visualmente.",
        "2. Acordar si los ítems netstat preguntan por puertos convencionales o por procesos que el comando realmente identifica.",
        "3. Resolver q37 con el handshake TCP de tres vías y el texto exacto de la filmina.",
        "4. Corregir q83 para incluir MAIL FROM y RCPT TO, o confirmar si falta una alternativa original.",
        "5. Separar en q127 la identificación de amenaza de la selección del control criptográfico.",
        "",
        "**Estado de esta auditoría:** las seis posiciones continúan sin clave y sin puntuación en V3. La marca OJO se añade al enunciado visible como dato de presentación, sin alterar el enunciado original almacenado.",
        "",
    ]
    return "\n".join(rows)


def build_justification_audit(data: dict) -> str:
    q10 = q_by_position(data, 10)
    q24 = q_by_position(data, 24)
    q25 = q_by_position(data, 25)
    q26 = q_by_position(data, 26)
    q112 = q_by_position(data, 112)
    q119 = q_by_position(data, 119)
    details = [
        (10, "option-2", "Por enrutamiento dinámico RIP", "No se marca con S ni aparece como ruta estática.", "RIP se identifica con el código R; la línea de 192.168.50.0/24 muestra C, que significa conectada directamente.", "La explicación hablaba de S/ruta estática, aunque el texto es un distractor RIP. La ruta mostrada es C. [1, 9]"),
        (10, "option-4", "Por enrutamiento estático", "Una ruta RIP aparecería con código R; la línea de .50 está marcada C.", "Una ruta estática se identifica con el código S; la línea de 192.168.50.0/24 muestra C, no S.", "La explicación anterior justificaba un distractor RIP, no uno estático. [1, 9]"),
        (24, "option-1", "Será bloqueada por la política implementada en el firewall", "El flujo no coincide con la regla de bloqueo de Telnet al destino RED.", "La regla de Telnet/TCP 23 no aplica a SSH/TCP 22; no coincide otra regla y la política por defecto permite este flujo.", "La explicación no terminaba el razonamiento: además de no coincidir con Telnet, la política por defecto permite el flujo. La clave no cambia. [14]"),
        (25, "option-1", "El ping será exitoso por la política", "La regla 5 es TCP a Telnet y no aplica a ICMP.", "La regla 3 coincide antes: es ICMP desde 192.168.50.102 hacia 172.16.170.33 y lo descarta. La política por defecto no se evalúa después de esa coincidencia.", "La razón anterior solo descartaba una regla irrelevante y omitía la coincidencia que hace falsa la alternativa. [15, 16]"),
        (26, "option-2", "El ping será bloqueado por la política", "La política inferior dice permitido para Green hacia Internet, pero no resuelve la acción explícita de esta coincidencia al destino ROJO.", "No: el origen 192.168.50.20 no coincide con la regla 3; la regla 4 sí coincide con ICMP Green→172.16.170.33 y lo acepta antes de que intervenga la política por defecto.", "La alternativa contradice una regla explícita ACCEPT; la explicación anterior confundía la política por defecto con una coincidencia de regla. [15, 16]"),
        (112, "option-1", "Dar control y retroalimentación sobre calidad y ayudar a sincronizar flujos", "Códecs se negocian por señalización, no RTCP.", "RTCP aporta informes de recepción y control/sincronización asociados al flujo; no es el componente que negocia los códecs.", "La razón anterior explicaba otro concepto y no justificaba la función expresada por la alternativa. [17, 18]"),
        (112, "option-2", "Negociar los códecs y capacidades de las terminales", "RTP lleva medios.", "La negociación de códecs corresponde a la señalización de sesión (en H.323, H.245), no a RTCP.", "La razón anterior explicaba RTP, no la alternativa sobre negociación; la filmina asigna esta negociación a H.245. [17]"),
        (112, "option-3", "Transportar muestras de audio y video", "Correcta: RTCP es control/calidad/sincronización.", "RTCP no transporta las muestras de audio o video; RTP lleva los medios y RTCP intercambia reportes de control.", "La razón anterior describía RTCP como correcto, aunque la alternativa propone transportar los medios. [17, 18]"),
    ]
    lines = [
        "# Auditoría individual de las 585 justificaciones — V3",
        "",
        "## Alcance y conteo",
        "",
        "Se leyeron individualmente las 585 explicaciones asociadas a alternativas en `preguntas-resueltas-v2.json`: en cada pregunta se cotejaron enunciado, alternativas, veredicto y explicación de cada opción. También se revisaron las 132 justificaciones generales y las fuentes vinculadas a los casos con discrepancias, a las seis OJO y a las imprecisiones técnicas señaladas abajo.",
        "",
        "- **Justificaciones por alternativa auditadas:** 585.",
        "- **Sin cambios:** 575 de 585.",
        "- **Justificaciones por alternativa corregidas:** 10 de 585.",
        "- **Justificaciones generales corregidas:** 1 (q119; fuera del conteo de 585).",
        "- **Campos de justificación modificados en total:** 11.",
        "- **Claves verificadas modificadas:** 0. Las 123 claves y los 3 estados PROVISIONAL/6 AMBIGUA no se promovieron ni degradaron en V3.",
        "- **Bibliografía no respaldante detectada:** no se halló una cita asignada a una alternativa distinta en los diez cambios; las discrepancias descritas son de asociación, omisión de evidencia o precisión. Las fuentes restantes conservan la referencia de V2 y se cotejaron con el tema/página declarados.",
        "",
        "Las 585 explicaciones se cotejaron contra la alternativa a la que pertenecen. Las fuentes locales se reabrieron en los casos corregidos y los estándares primarios se consultaron para los conceptos que requieren precisión. No se utilizaron claves del sitio como autoridad académica.",
        "",
        "## Cambios puntuales",
        "",
    ]
    for position, option_id, text, old, new, problem in details:
        question = q_by_position(data, position)
        option = next(option for option in question["options"] if option["id"] == option_id)
        lines += [
            f"### Pregunta {position} — `{question['id']}`",
            "",
            f"**Alternativa:** {option['text']}",
            "",
            f"**Justificación anterior:** {old}",
            "",
            f"**Problema:** {problem}",
            "",
            f"**Justificación nueva:** {new}",
            "",
        ]
        if position == 10:
            lines.append("**Fuente:** `2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf`, visor pp. 8–9; Cisco IOS `show ip route` route codes and default administrative distance (C/connected, S/static, R/RIP; connected AD 0, RIP AD 120).")
        elif position in (24, 25, 26):
            lines.append("**Fuente:** `assets/image-4d11058301d9e14f5dd7d5e5.png` (lectura visual de origen/destino/protocolo/orden y código de acción) y `Lectura de reglas del firewall IPFire.pdf`, visor pp. 2–4 (verde=ACCEPT, rojo=DROP, negro=REJECT; primera regla coincidente termina la evaluación; la política solo cubre el tráfico no decidido).")
        else:
            lines.append("**Fuente:** `3 - 05 - RDD - Unidad 5 - Voz IP.pdf`, visor pp. 14–15; RFC 3550, §§6.1 y 6.4 para reportes RTCP y sincronización. RTP lleva medios; H.245 negocia capacidades en el esquema H.323 de la filmina.")
        lines += ["", "---", ""]

    q119_problem = q119["resolution"]["problems"][0]
    lines += [
        "### Pregunta 119 — justificación general (corrección visual)",
        "",
        "**ID:** `q-d464c1c8de0b704fc84ce85c760f824c1abb241eb352cb0420a8ef64dd2b4a43`.",
        "",
        "**Justificación anterior:** La tabla se describía como si contuviera simultáneamente ruta R y C para `192.168.70.0/24`.",
        "",
        f"**Problema:** {q119_problem}",
        "",
        f"**Justificación nueva:** {q119['resolution']['justification']}",
        "",
        "**Fuente:** `assets/image-42a2abb1e63652c10014ce21.png`, ampliada visualmente; Cisco IOS command reference para códigos C/R y AD conectada/RIP; nota de extracción que indica alternativas reconstruidas e imagen mejorada con IA.",
        "",
        "La pregunta continúa AMBIGUA y sin clave. La imagen actual respalda C y L para .70; no se promovió la opción «directamente conectada» sin foto original y opciones originales.",
        "",
        "## Explicaciones conservadas y errores conceptuales detectados",
        "",
        "### Resultado de la pasada por las 585 alternativas",
        "",
        "Las otras 575 explicaciones por alternativa no presentaron un intercambio claro de opción o una contradicción demostrable con el escenario descrito. Se conservaron para evitar cambios editoriales de preferencia. Las justificaciones generales no corregidas se mantienen sin reescritura.",
        "",
        "### Imprecisiones o decisiones que requieren revisión humana",
        "",
        "- **Q3 — RFC 1918, clave preservada:** la alternativa habla de «los routers del backbone descartan» paquetes privados. RFC 1918 §3 es más preciso: los paquetes con origen/destino privado no deberían reenviarse a través de enlaces interempresariales y los ISP deberían filtrar anuncios de rutas privadas. La opción es una simplificación operativa, no una afirmación universal sobre todo router. No se cambió la clave.",
        "- **Q23 — NAT estática para servidor accesible desde sucursal, clave preservada:** el mapeo fijo puede publicar el servidor, pero conectar sucursales suele resolverse mediante routing/VPN según el escenario. La explicación de V2 ya incluye esta salvedad; falta contexto para afirmar que static NAT sea siempre la opción conveniente.",
        "- **Q46 — IMAP, clave preservada:** la filmina local p. 34 afirma literalmente que el mensaje se descarga solo cuando se lee; esa es la simplificación de cátedra que respalda la clave. RFC 9051 §6.4.5 permite FETCH del mensaje completo o partes, a solicitud del cliente, y no impone que la descarga ocurra únicamente al abrirlo. La respuesta es cátedra-compatible, pero no una regla universal del protocolo.",
        "- **Q69 — FIN, clave preservada:** la alternativa habla de finalizar la conexión/socket; TCP FIN cierra la mitad emisora del flujo y los extremos pueden cerrar de forma independiente. La justificación general de V2 limita correctamente el alcance; conviene mantener esa precisión.",
        "- **Q108 — PSH/CWR, clave preservada:** la respuesta sigue la terminología docente; PSH pide un push, no asegura una entrega instantánea por decisión local. CWR comunica que el emisor reaccionó a ECN; no expresa una tasa numérica.",
        "- **Q123 — firma digital, clave preservada:** la alternativa usa «descifrar con la clave pública» como esquema didáctico. La justificación general aclara que, en los algoritmos modernos, la operación se denomina verificar la firma.",
        "- **Preguntas con diagramas reconstruidos:** las claves que dependen de reglas o topologías se conservan para el escenario visible; la fidelidad histórica no queda demostrada si el recurso se recreó o mejoró.",
        "",
        "Estos puntos no alteran claves, puntuación ni alternativas en V3. Se consignan para una conversación académica posterior.",
        "",
        "## Fuentes consultadas para los cambios y salvedades",
        "",
        "- `2 - 06 - RDD - Unidad 4 - Encaminamiento en Internet.pdf`, visor pp. 8–9; Cisco IOS route-code/administrative-distance reference: https://www.cisco.com/c/en/us/td/docs/ios/iproute_pi/command/reference/iri_book/iri_pi1.html y `iri_pi2.html`.",
        "- `Lectura de reglas del firewall IPFire.pdf`, visor pp. 2–4; recurso `assets/image-4d11058301d9e14f5dd7d5e5.png`.",
        "- `3 - 05 - RDD - Unidad 5 - Voz IP.pdf`, visor pp. 14–15; RFC 3550: https://www.rfc-editor.org/rfc/rfc3550.html.",
        "- RFC 1918, §3: https://www.rfc-editor.org/rfc/rfc1918.html.",
        "- `3 - 02 - RRD - Unidad 5 - Capa de APLICACIÓN.pdf`, visor pp. 33–34; RFC 9051, §6.4.5: https://www.rfc-editor.org/rfc/rfc9051.html.",
        "- RFC 9293, §3.6.1 (half-closed connections): https://www.rfc-editor.org/rfc/rfc9293.html.",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    data = update_v3_json()
    word_summary = create_quiz_docx(data)
    ojo = build_ojo_report(data)
    OJO_MD_PATH.write_text(ojo, encoding="utf-8")
    markdown_to_docx(ojo)
    justification = build_justification_audit(data)
    JUSTIFICATION_MD_PATH.write_text(justification, encoding="utf-8")
    print(json.dumps({
        "json": str(V3_PATH),
        "quizDocx": str(WORD_PATH),
        "ojoMarkdown": str(OJO_MD_PATH),
        "ojoDocx": str(OJO_DOCX_PATH),
        "justificationAudit": str(JUSTIFICATION_MD_PATH),
        "counts": word_summary,
        "ojoWarnings": OJO_POSITIONS,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
