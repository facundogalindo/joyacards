# Auditoría de extracción — Redes Parcial 4K1 2026

## Alcance

Se extrajo el contenido visible de la sección Parcial 4K1 2026 de https://cuestionario-redes.vercel.app/ para conservar un banco de preguntas sin resolver. Esta extracción no evalúa la corrección académica de las preguntas ni completa respuestas, claves, justificaciones o puntajes.

La navegación recorrió el índice visible del cuestionario con Playwright y Chromium. No se seleccionaron alternativas ni se usaron controles para verificar respuestas. Se conservaron las preguntas y alternativas en el orden de la primera pasada. Una segunda lectura independiente cotejó los 132 títulos del índice, enunciados y conjuntos de alternativas. El sitio cambió el orden de las alternativas de 122 preguntas entre sesiones; la comparación tuvo en cuenta esa aleatorización sin cambiar el orden capturado inicialmente.

## Conteo

- Preguntas: 132 posiciones, 132 contenidos distintos y ningún duplicado.
- Tipo indicado en el sitio: 117 de opción única y 15 de selección múltiple.
- Selección requerida en las múltiples: 14 indican dos opciones y 1 indica tres.
- Alternativas: 585 en total. Distribución: 5 preguntas con 2; 7 con 3; 69 con 4; 30 con 5; 19 con 6; y 2 con 7 alternativas.
- Imágenes: 40 referencias distribuidas en 40 preguntas; 15 archivos PNG únicos descargados del contenido ofrecido por el sitio. Los archivos se conservaron como recursos y se validaron con SHA-256.
- La estructura JSON no contiene campos de respuesta, alternativa correcta, justificación ni puntuación.

## Notas que ya muestra la fuente

El contenido se transcribe según la versión visible del sitio, incluidas sus advertencias. Estas preguntas o recursos no deben confundirse con reproducciones literales de material fotografiado del parcial:

- Preguntas 9–13: variantes de práctica que el sitio indica que no salieron en el parcial; la topología fue mejorada con inteligencia artificial.
- Preguntas 16–22 y 60: imágenes recreadas a partir de reconstrucciones de preguntas.
- Preguntas 41–43: imagen recreada con inteligencia artificial desde las reglas compartidas; el sitio indica que su contenido fue revisado.
- Preguntas 54–55: imagen recreada con inteligencia artificial para representar una topología.
- Preguntas 66–67: imagen reconstruida; el sitio aclara que el parcial usaba un desplegable por campo, mientras que allí se unificó en una pregunta por PC y se armaron las opciones desde la reconstrucción.
- Preguntas 72–75: tabla de enrutamiento transcripta desde una reconstrucción, no desde la captura original; la topología fue mejorada con inteligencia artificial.
- Pregunta 97: imagen recreada a partir de la guía de lectura de reglas de IPFire de la cátedra.
- Preguntas 117–120: el sitio aclara que las opciones no son las originales porque el parcial usaba un selector cuyas opciones no se pudieron ver; la imagen también fue mejorada con inteligencia artificial.
- Pregunta 126: el parcial pedía escribir el comando; las opciones incorrectas visibles en el sitio fueron construidas a partir del material de la cátedra.

La extracción no completa ni valida contenido que el sitio mismo marca como reconstruido. Las notas de la fuente se guardan junto a cada pregunta en el JSON.

## Archivos generados

- preguntas-sin-resolver.json: fuente estructurada completa, con las etiquetas numéricas de alternativas que muestra el cuestionario, el orden de la primera captura, referencias a imágenes y notas de la fuente.
- Redes_Parcial_4K1_2026_SIN_RESOLVER.docx: versión Word con los 132 enunciados, las 585 alternativas y las 40 referencias de imagen integradas. Las imágenes son las mismas descargadas para el JSON. Para que el importador actual pueda reconocer las alternativas, el Word las presenta con letras; el JSON mantiene sus etiquetas numéricas y el orden capturado.
- assets/: imágenes PNG referenciadas por el JSON.
- scripts/extract_4k1_playwright.cjs: rutina reutilizable para repetir la extracción y la comparación de fuente.
- scripts/generate_docx.py y scripts/verify_docx_import.cjs: generación del Word y validación de su contenido e importación.

## Validación del Word y límite del importador

Se extrajo el texto del DOCX y se comparó con el JSON. Los 132 enunciados y sus alternativas están presentes y completos; las 40 referencias a imágenes están embebidas, y la extracción del DOCX no produjo mensajes de error.

También se probó el conversor real del proyecto, sin modificar su código. La importación actual solo conserva 14 de las 132 preguntas: son 14 preguntas de selección múltiple que quedan explícitamente sin puntuar y sin respuestas marcadas. Las 117 preguntas de opción única se omiten porque el formato actual requiere una alternativa correcta para importarlas. La pregunta múltiple 3 tampoco se conserva: el analizador actual interpreta el texto “1918)” dentro de “RFC 1918)” como una marca de alternativa y divide ese enunciado; el conversor reportó 134 registros en vez de 132. El informe de verificación registra esta limitación.

Por lo tanto, el DOCX es una fuente completa para una siguiente iteración, pero no se considera importado íntegramente en JoyaCards. No se inventaron respuestas para sortear el requisito del importador y no se cambió la funcionalidad de la aplicación.

## Revisión visual

El DOCX se renderizó a PDF e imágenes con la herramienta de documentos del entorno. Se inspeccionaron visualmente las 45 páginas: el texto y las imágenes son legibles, no se observan cortes de contenido ni alternativas separadas de su pregunta. Esta revisión valida la presentación del archivo, no la verdad académica de los enunciados ni los datos que el sitio identifica como reconstruidos.

## Repetición

El JSON guarda el origen, el resultado de la segunda comparación, los conteos y las advertencias por pregunta. Para repetir la extracción o auditar sus resultados, usar scripts/extract_4k1_playwright.cjs y las verificaciones incluidas en scripts/.
