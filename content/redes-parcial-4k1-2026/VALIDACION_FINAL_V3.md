# Validación final V3 — Redes 4K1 2026

Fecha: 23 de noviembre de 2026
Rama objetivo: `main`
Base revisada: `acb67dfb15913469ca0866a3cb4d0fa15ef02fbc`

## Resultado académico

Se cotejaron individualmente las 585 justificaciones por alternativa con su enunciado, alternativa y veredicto. Se conservaron 575; se corrigieron 10 justificaciones de alternativa y una justificación general de q119. No se modificó ninguna clave. Las correcciones y sus fuentes concretas están detalladas en `AUDITORIA_JUSTIFICACIONES_V3.md`.

Las diez correcciones de alternativas corresponden a q10 (opciones 2 y 4), q24 (1), q25 (1), q26 (2), q112 (1, 2 y 3), y q119 (1 y 3). En q119 también se corrigió la explicación general: la ampliación disponible muestra `C 192.168.70.0/24` y `L 192.168.70.1/32`; no se confirma una ruta `R` para `.70`. La reconstrucción no prueba por sí sola la fidelidad histórica del examen, así que q119 sigue ambigua y sin puntuar.

Las seis posiciones ambiguas —37, 60, 79, 83, 119 y 127— conservan alternativas y estado sin puntuar. En el Word V3, `(OJO: PREGUNTA AMBIGUA)` se agrega al final del enunciado visible mediante `presentationSuffix`; el texto académico original se mantiene. Las tres provisionales —41, 66 y 67— continúan sin puntuación y sin marca OJO.

## Conteos de V3

| Elemento | Conteo |
|---|---:|
| Preguntas | 132 |
| Alternativas | 585 |
| Justificaciones por alternativa | 585 |
| Preguntas verificadas y puntuables | 123 |
| Preguntas provisionales | 3 |
| Preguntas ambiguas | 6 |
| Preguntas sin puntuar | 9 |
| Preguntas de selección múltiple | 15 |
| Referencias a imágenes | 40 |
| Archivos de imagen únicos | 15 |
| Marcas OJO visibles | 6 |

## Importación

El Word V3 se procesó con el importador real de JoyaCards y mediante una solicitud multipart al endpoint local `POST /api/word/to-json?shuffle=false` (HTTP 200). La respuesta tuvo 132 preguntas, 585 alternativas, 585 justificaciones, 123 puntuables, 9 sin puntuar, 15 de selección múltiple, 40 imágenes y las seis marcas OJO; devolvió cero advertencias. La conversión HTML con Mammoth y el parser también reportaron cero advertencias.

La prueba automatizada coteja posiciones e IDs, enunciados visibles y originales, orden y texto de alternativas, claves, estados, imágenes y hashes de recursos contra los JSON de extracción y resolución. Comprueba además los textos problemáticos `RFC 1918)` de q3 y `TCP 22)` de q24, la neutralidad de las preguntas sin clave y que ninguna pregunta provisional reciba OJO. No se detectaron preguntas omitidas ni fragmentos falsos.

Los JSON de extracción y resolución anteriores, los Word V2 y el cuestionario del Parcial 3 no se modificaron. La regresión del Parcial 3 conserva 30 tarjetas puntuables, 32 justificaciones, 9 referencias de imagen y el digest semántico `9e9efc0a2741bdc58fcb04bb34a80f3aa9128706d1ccf72c5e9ac071968eeb3e`.

## Pruebas ejecutadas

- Backend: `npm test` — 29 aprobadas, 0 fallidas.
- Frontend: `npm test` — 23 aprobadas, 0 fallidas; incluye importación V3 y baseline semántico del Parcial 3.
- Frontend: `npm run lint` — aprobado; `Buffer` está importado explícitamente desde `node:buffer`.
- Frontend: `npm run build` — aprobado. Vite conserva una advertencia de tamaño para el bundle JavaScript (615,28 kB sin comprimir; 182,76 kB gzip).
- Importación local por HTTP: HTTP 200 y conteos indicados arriba, sin advertencias.
- Verificación documental: DOCX convertido a PDF con Microsoft Word. El cuestionario ocupa 57 páginas; sus 57 páginas renderizadas se inspeccionaron individualmente. El auditor OJO ocupa 17 páginas; las 17 páginas renderizadas se inspeccionaron individualmente. Después de actualizar el metadato de validación de V3, el Word V3 volvió a exportarse y las 57 páginas rasterizadas resultaron idénticas a las ya revisadas. La regeneración del auditor OJO cambió solo el metadato de validación del JSON, no su contenido visible; Word confirma 17 páginas en el DOCX actual.

## Alcance y limitaciones

La pantalla local de JoyaCards abre correctamente y muestra la carga del Word. No se completó un recorrido E2E de navegador que seleccione el archivo: Playwright no está instalado y el selector nativo no quedó disponible mediante la automatización de escritorio. Por eso el resultado funcional confirmado para V3 es la importación por el endpoint local y el importador probado por tests, no una sesión completa de práctica en navegador ni una nueva publicación de producción.

Las seis preguntas OJO continúan deliberadamente sin clave. Para resolverlas aún hacen falta las evidencias documentales indicadas en su auditoría independiente, especialmente las fotografías originales y aclaraciones de cátedra donde corresponda. Las claves previamente verificadas se conservaron.
