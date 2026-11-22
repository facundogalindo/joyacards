# Auditoría académica del Parcial 4K1 2026

## Resultado

Se analizaron las 132 preguntas y las 585 alternativas del cuestionario. Quedaron 92 preguntas verificadas, 32 provisionales y 8 ambiguas; ninguna se clasificó como no resoluble con las fuentes. En el DOCX solo se puntúan respuestas verificadas (106 alternativas correctas). Las otras 40 preguntas conservan su análisis, pero no se les asigna una clave definitiva.

La auditoría se apoya en la bibliografía local inventariada, las imágenes asociadas a los enunciados y referencias oficiales primarias cuando una precisión técnica lo requiere. No se consultaron las claves del sitio del cuestionario ni se usaron respuestas seleccionadas por estudiantes.

## Cobertura y estados

| Medida | Resultado |
|---|---:|
| Preguntas | 132 |
| Alternativas evaluadas | 585 de 585 |
| Opción única / selección múltiple | 117 / 15 |
| Referencias a imágenes / archivos únicos | 40 / 15 |
| Estado VERIFICADA | 92 |
| Estado PROVISIONAL | 32 |
| Estado AMBIGUA | 8 |
| NO RESOLUBLE CON LAS FUENTES | 0 |
| Confianza ALTA / MEDIA / BAJA | 81 / 48 / 3 |
| Alternativas correctas marcadas (solo verificadas) | 106 |

### Distribución temática

Clasificación descriptiva a partir del enunciado y las fuentes citadas; los temas pueden solaparse conceptualmente, pero cada pregunta se cuenta una sola vez en esta tabla.

| Tema | Total | Verificada | Provisional | Ambigua |
|---|---:|---:|---:|---:|
| Correo electrónico | 6 | 6 | 0 | 0 |
| DNS | 14 | 13 | 1 | 0 |
| Firewall | 17 | 12 | 3 | 2 |
| Gestión SNMP | 3 | 3 | 0 | 0 |
| NAT y PAT | 21 | 7 | 13 | 1 |
| Otros servicios | 1 | 1 | 0 | 0 |
| Routing | 19 | 6 | 12 | 1 |
| Seguridad | 14 | 12 | 1 | 1 |
| Telefonía IP y multimedia | 7 | 7 | 0 | 0 |
| Transferencia FTP/TFTP | 4 | 4 | 0 | 0 |
| Transporte TCP/UDP | 22 | 18 | 2 | 2 |
| Web y HTTP | 4 | 3 | 0 | 1 |

## Método y trazabilidad

Se conservaron los identificadores, el orden estable, los enunciados, las alternativas, el tipo de respuesta, las imágenes y su procedencia registrados en la extracción. Cada una de las 585 alternativas recibió una evaluación y una justificación en el JSON. Las resoluciones incluyen estado, confianza, observaciones, problemas y fuentes con página del visor o apartado cuando la fuente lo permite.

Las 132 preguntas se revisaron en seis bloques (1–25, 26–50, 51–75, 76–100, 101–125 y 126–132). Las 15 imágenes únicas se inspeccionaron como evidencia del escenario. Cuando una tabla o captura estaba reconstruida o no permitía leer un dato, la pregunta se dejó provisional o ambigua; no se completaron valores por inferencia. Las marcas de selección en las capturas no se usaron para derivar claves.

La filmina disponible de Seguridad corresponde a 2024. No se encontró una versión 2026 dentro del material local revisado. Para conceptos que dependen de normativa o semántica técnica precisa, las citas oficiales externas constan junto a las fuentes locales en el JSON y en `REFERENCIAS_BIBLIOGRAFICAS.md`.

## Preguntas que requieren revisión

Las preguntas ambiguas son: #26, #37, #42, #60, #79, #83, #119, #127.

Las preguntas provisionales son: #9, #10, #11, #12, #13, #14, #16, #17, #18, #19, #20, #21, #22, #25, #41, #43, #54, #55, #57, #66, #67, #72, #73, #74, #75, #108, #111, #117, #118, #120, #122, #123.

El detalle por pregunta, la interpretación en disputa, las alternativas defendibles y el material que falta para cerrar la respuesta están en `PREGUNTAS_PENDIENTES.md`. En particular, se conservan como ambiguos los casos de respuesta múltiple inconsistente, acciones de firewall ilegibles, servicios inferidos de puertos, sobre SMTP incompleto, tabla de rutas contradictoria y falta de autenticación criptográfica adecuada.

## Prueba del importador actual

Se ejecutó localmente el convertidor real de `backend/src/services/wordToJson.service.js` sobre el DOCX resuelto, sin editar archivos del importador ni de la aplicación. No se probó el endpoint publicado ni el estado del servicio remoto.

| Resultado del importador | Cantidad |
|---|---:|
| Preguntas fuente en DOCX | 132 |
| Registros sintácticos producidos por el parser | 134 |
| Registros que importa | 94 |
| Preguntas verificadas válidas importadas | 90 de 92 |
| Preguntas de selección múltiple sin puntuar importadas | 2 |
| Fragmentos espurios admitidos como preguntas | 2 |
| Preguntas con imagen importadas | 9 |
| Justificaciones presentes en el DOCX | 585 |
| Justificaciones retenidas en preguntas importadas | 427 |
| Advertencias del convertidor | 0 |

El parser parte el enunciado #3 en `RFC` y `1918)` y crea una pregunta artificial #1918. También parte el enunciado #24 en `TCP` y `22)` y crea una pregunta artificial #22. Por ello no importa las preguntas originales #3 y #24, aunque las alternativas de ambas permanecen en el DOCX. El total de 94 no representa 94 preguntas correctas: son 90 verificadas, 2 no puntuadas y 2 fragmentos espurios. Las preguntas de opción única sin clave verificada se excluyen por el comportamiento actual del convertidor, como ya se había observado en la primera iteración.

Los 585 bloques de justificación se reconocieron sintácticamente. El convertidor conserva 427 en las preguntas que sí admite; las explicaciones pertenecientes a preguntas omitidas o fragmentadas no reparan su pérdida.

Para corregirlo en una iteración técnica posterior, el reconocimiento de etiquetas de opción debe restringirse a límites reales de línea o de párrafo, para evitar tomar `1918)` y `22)` internos como números de opción. También debe definirse cómo representar preguntas de opción única sin clave sin inventar una respuesta. El código no se modificó en esta iteración.

## Integridad de los artefactos

Se compararon los campos de extracción de cada pregunta contra `preguntas-sin-resolver.json`: IDs, posición, enunciados, alternativas, orden, imágenes, tipo y notas se conservan sin cambios. Se verificaron los 40 marcadores de imagen insertados en el DOCX y sus 15 archivos únicos contra sus SHA-256 registrados. Los archivos de extracción, imágenes, scripts y el código de JoyaCards permanecen intactos.

### SHA-256 de entregables

Hashes de los otros cinco archivos para comprobar su integridad. Este informe no incluye su propio hash.

| Archivo | SHA-256 |
|---|---|
| `INVENTARIO_BIBLIOGRAFIA.md` | `6f8f79a209d19a1280702f6493645f4640172e60332a3056f253886c47b5b277` |
| `preguntas-resueltas.json` | `355dada0b3a558a03efcdae754d9dd9e9a1a0be40d927d9719fb7149f4a66c50` |
| `Redes_Parcial_4K1_2026_RESUELTO.docx` | `983bb35f5d83638f80de529cd3550ebd82ee5e6c14f46761b9ab13ee4b5627c3` |
| `PREGUNTAS_PENDIENTES.md` | `46f15095a1a80c5a2e94cba961eb2b03c87305d6f1dbfbbdc431041083f33cf4` |
| `REFERENCIAS_BIBLIOGRAFICAS.md` | `0b1268593f0b8c52cf64ffb946c72348599d4ad561bdd693c9f9a1c42e91656c` |

## Verificación visual del DOCX

No se pudo completar una revisión visual paginada de todas las páginas. El renderizador `render_docx.py` no encontró `soffice.exe`. La exportación local desde Word también falló con `DISP_E_TYPEMISMATCH`, y la ventana abierta de Word no pudo recuperarse porque estaba minimizada. Por eso no se declara que cada página haya sido inspeccionada visualmente.

Sí se verificaron programáticamente las 132 preguntas, los 585 textos de alternativas, los 40 marcadores de imagen, las 40 inserciones de imagen y los 585 bloques de justificación. La conversión Mammoth no produjo mensajes y el cotejo de cuerpo no encontró diferencias de prompt, alternativas o imágenes. Se recomienda hacer una inspección visual paginada cuando haya un renderizador de Word disponible.

## Archivos entregados

- `INVENTARIO_BIBLIOGRAFIA.md`: censo de materiales locales y estado de lectura.
- `preguntas-resueltas.json`: resolución trazable de las 132 preguntas y evaluación de las 585 alternativas.
- `Redes_Parcial_4K1_2026_RESUELTO.docx`: preguntas en formato JoyaCards, respuestas verificadas marcadas y una justificación por alternativa. Las pendientes están identificadas dentro de sus justificaciones y desarrolladas en el informe separado.
- `AUDITORIA_ACADEMICA.md`: alcance, resultados, limitaciones y prueba de importación.
- `PREGUNTAS_PENDIENTES.md`: 40 preguntas que necesitan revisión adicional.
- `REFERENCIAS_BIBLIOGRAFICAS.md`: fuentes locales, referencias oficiales y recursos visuales citados.
