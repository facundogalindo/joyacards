# Validación funcional del Parcial 4K1 en JoyaCards — Iteración 4

**Fecha:** 22 de noviembre de 2026  
**Repositorio/commit base:** main, `e025b76829084b5791554c0378c8033d15920d8e`  
**Código de la aplicación:** sin cambios en esta iteración.

## Importación real del Word V2

El DOCX final se importó con Mammoth y el convertidor real del backend, y se probó en la interfaz local y publicada. No se sustituyó esa comprobación por una prueba aislada de parsing.

| Medida | Resultado |
|---|---:|
| Preguntas importadas | 132 |
| Alternativas | 585 |
| Puntuables | 123 |
| Sin puntuar | 9 |
| Selección múltiple | 15 |
| Referencias a imágenes / archivos únicos | 40 / 15 |
| Justificaciones | 585 |
| Advertencias del convertidor | 0 |
| Fragmentos falsos / preguntas perdidas | 0 / 0 |
| Diferencias de enunciado/opciones | 0 |
| Mensajes de Mammoth | 0 |
| Marcas de respuesta correcta en ítems puntuables | 138 |

El cotejo del DOCX contra la fuente encontró coincidencia exacta en los 132 enunciados, textos/orden de alternativas e imágenes. #3 («RFC 1918)») y #24 («TCP 22)») se importan completos; no aparecen como fragmentos falsos.

## Flujo local completo

- Backend en http://127.0.0.1:3001 y frontend en http://127.0.0.1:5173.
- Playwright cargó el DOCX V2 final y avanzó por las 132 tarjetas.
- El contador inicial fue «Correctas: 0 / 123», no sobre 132.
- Las nueve tarjetas sin puntuar permitieron selección y continuidad; no ofrecieron Verificar, no cambiaron aciertos/errores ni el denominador.
- Se observaron 15 tarjetas múltiples y 40 imágenes con dimensiones naturales válidas; las justificaciones se pudieron consultar.
- El visor cubrió el viewport, inició en 100 %, hizo zoom, permitió arrastre y cerró correctamente.
- Resumen del simulacro: 132 presentadas, 123 calificables, 9 de práctica sin puntuación.
- Errores de consola/página: 0. Solicitudes fallidas: 0.

Las selecciones fueron automatizadas para probar controles, no para medir desempeño académico. La puntuación obtenida al final del recorrido no se interpreta como nota del alumno.

## Flujo publicado

- URL: https://joyacards.vercel.app/ (HTTP 200).
- Se cargó el DOCX V2 final en la versión desplegada: detectó 132 preguntas y 585 justificaciones; al empezar mostró «Correctas: 0 / 123».
- Errores de consola/página: 0. Solicitudes fallidas: 0.
- Como control previo, el DOCX resuelto original también se probó publicado y detectó 132 preguntas/585 justificaciones con su denominador de 92. El test final de esta iteración usó V2.
- No se guardó contenido ni se alteraron cuestionarios de usuarios.

## Automatización, compatibilidad y build

- backend, npm.cmd test: 29 aprobadas, 0 fallidas; contiene las regresiones RFC 1918), TCP 22), preguntas sin clave y documentos compatibles.
- frontend, npm.cmd test: 22 aprobadas, 0 fallidas; incluye baseline semántico Parcial 3 (`9e9efc0a2741bdc58fcb04bb34a80f3aa9128706d1ccf72c5e9ac071968eeb3e`) e importación 4K1.
- frontend, npm.cmd run build: completado. Vite avisa que el bundle minificado de ~615 kB supera el umbral de 500 kB; no falla el build.
- frontend, npm.cmd run lint: no pasa por `frontend/test/redesParcial4k1Import.test.js:25:13`, `Buffer is not defined (no-undef)`. Ese archivo está fuera de los cambios y no se modificó; el error no afecta la importación probada. Queda anotado para una tarea técnica independiente.
- Las 92 resoluciones verificadas previas se compararon y conservaron exactamente; los datos fuente de las 132 preguntas no cambiaron.

## Word: render y revisión visual

render_docx.py no encontró soffice.exe. El DOCX final se abrió en Microsoft Word local y se exportó a PDF: 60 páginas Letter.

Se inspeccionaron las 60 páginas en diez hojas de contacto y, a resolución completa, las páginas 1, 2, 3, 10, 15, 21 y 33. Se revisaron tabla de routing, NAT/PAT, reglas IPFire, capturas Wireshark y topología PAT. Las imágenes permanecen dentro del ancho y legibles; no se vieron caracteres de reemplazo ni páginas vacías/desbordamientos. Los marcadores de control de JoyaCards se conservan como texto blanco de 1 pt para el parser y no aparecen impresos; la numeración queda visible. Las preguntas largas pueden continuar en la página siguiente.

La hoja de contacto permite revisar composición/paginación de todas las páginas; no equivale a leer a resolución completa cada línea de las 60. Las siete páginas enumeradas arriba se inspeccionaron individualmente a tamaño completo.

## Integridad y límites

- Los JSON originales, los DOCX originales, assets y código fuente permanecen intactos.
- V2 conserva 132 IDs, 585 alternativas, 117 preguntas únicas, 15 múltiples, 40 referencias visuales y 585 evaluaciones/justificaciones.
- Las 31 nuevas claves se limitan al escenario de práctica documentado. No se halló una foto independiente del examen 4K1; la procedencia histórica de reconstrucciones permanece no verificada.
- Pendientes sin clave: #37, #41, #60, #66, #67, #79, #83, #119 y #127.
