# Auditoría final de importación del Parcial 4K1

**Fecha:** 22 de noviembre de 2026

**Base de trabajo:** rama `main`, commit `cc95e78`
**Documento importado:** `Redes_Parcial_4K1_2026_RESUELTO.docx`

## Resultado

La conversión de Word importó las 132 preguntas del Parcial 4K1. Conservó sus 585 alternativas, las 40 referencias a imágenes y las justificaciones. De las preguntas, 92 quedan verificadas y puntuables; las otras 40 permanecen visibles y practicables, pero sin clave y fuera del puntaje.

| Comprobación | Resultado |
| --- | ---: |
| Preguntas importadas | 132 |
| Alternativas | 585 |
| Preguntas verificadas y puntuables | 92 |
| Preguntas pendientes sin puntuar | 40 |
| Preguntas de selección múltiple | 15 |
| Referencias a imágenes | 40 |
| Archivos de imagen únicos | 15 |
| Justificaciones importadas | 585 |
| Advertencias de conversión | 0 |

## Parser y preguntas sin puntuar

El parser ya no separa el contenido de una pregunta al encontrar una secuencia como `RFC 1918)` o `TCP 22)`. Conserva los límites de párrafo y línea de Word; las etiquetas de alternativa se procesan cuando aparecen en esos límites. Se añadieron regresiones para ambos ejemplos y para el formato previo de documentos compatibles.

El marcador existente `[[SIN_PUNTUAR]]` ahora admite preguntas de opción única además de las de opción múltiple. Las 40 preguntas pendientes se importan con `answers: []`, todas sus alternativas con `isCorrect: false` y `isUnscored: true`. Se pueden responder y continuar sin mostrar un resultado de acierto o error. El denominador de puntuación queda en 92, no en 132. No se asignaron claves a las preguntas pendientes.

## Cotejo contra el JSON resuelto

La prueba de integración recorre las 132 entradas de `preguntas-resueltas.json` en orden. Relaciona cada `id` con la `extractionPosition` del documento y la posición importada; compara texto y tipo de pregunta; verifica el texto y orden de las 585 alternativas; y deriva las claves esperadas únicamente de los `selectedOptionIds` con estado `VERIFICADA`.

También verifica que las 40 preguntas no verificadas carezcan de clave, que las 15 preguntas múltiples conserven el tipo, que cada justificación esperada siga disponible y que las 40 imágenes importadas coincidan byte por byte con los hashes SHA-256 registrados. Las preguntas 3 y 24 conservan `RFC 1918)` y `TCP 22)` dentro de sus enunciados. No hubo advertencias ni fragmentos adicionales: cualquier texto u opción sobrante habría fallado la comparación completa.

El DOCX contenía rótulos de justificación y evaluación con escapes literales `\u00f3`. Se normalizaron a `Justificación` y `Evaluación` para que Mammoth y el importador los interpreten correctamente; no se cambiaron los enunciados, alternativas, claves, imágenes ni el contenido de las justificaciones. Los JSON de extracción y resolución no se modificaron.

## Compatibilidad con el Parcial 3

La batería frontend conserva el digest semántico de referencia del Parcial 3 (`9e9efc0a2741bdc58fcb04bb34a80f3aa9128706d1ccf72c5e9ac071968eeb3e`), sus 30 preguntas puntuables, 32 justificaciones y 9 registros de imagen en preguntas. Pasaron también las comprobaciones existentes de imágenes y visor/zoom. No se modificaron preguntas, respuestas, justificaciones, imágenes ni código del visor del Parcial 3.

## Pruebas ejecutadas

- Backend: `npm.cmd test` — **29 aprobadas, 0 fallidas**.
- Frontend: `npm.cmd test` — **22 aprobadas, 0 fallidas**. Incluye la importación integral del DOCX 4K1 y la regresión semántica del Parcial 3.
- `git diff --check` — sin errores de espacios o formato.

## Revisión visual y limitación

No se pudo producir una renderización paginada fiel del DOCX: `soffice.exe` no está disponible y la automatización local de Word no completó la exportación. Como alternativa, se generó un PDF local desde el HTML extraído por Mammoth e impreso con Chrome. Contiene 56 páginas no vacías y muestra correctamente los acentos reparados.

Se revisaron visualmente las páginas 1, 29 y 56. No se inspeccionaron todas las páginas a escala 100 %, y la paginación del PDF de alternativa no representa la de Word. Por eso esta revisión no certifica el diseño de todas las páginas del DOCX. La verificación completa de contenido, claves, alternativas, justificaciones e imágenes sí se hizo mediante pruebas automatizadas contra el JSON resuelto.
