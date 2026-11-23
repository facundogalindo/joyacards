# Resumen ejecutivo — Iteración 4

## Resultado

La auditoría volvió a revisar una por una las 40 preguntas pendientes. La nueva versión deja 123 verificadas/puntuables, 3 provisionales y 6 ambiguas. Se promovieron 31 preguntas con una clave defendible para el texto e imagen de práctica; nueve quedan sin clave final. JoyaCards puntúa sobre 123.

| Estado | Antes | Después |
|---|---:|---:|
| Verificadas | 92 | 123 |
| Provisionales | 32 | 3 |
| Ambiguas | 8 | 6 |

## Promovidas

#9, #10, #11, #12, #13, #14, #16, #17, #18, #19, #20, #21, #22, #25, #26, #42, #43, #54, #55, #57, #72, #73, #74, #75, #108, #111, #117, #118, #120, #122, #123. La promoción se limita al escenario del banco; no certifica procedencia del examen original.

### Evidencia adicional

- Routing: cotejo visual de códigos R/C/L, prefijos, interfaces, next hops y rutas de igual costo; apoyo en las filminas de encaminamiento.
- NAT/PAT: seguimiento de IP/puerto de origen, puerto exterior, destino y sentido de retorno WAN→LAN en las tablas disponibles.
- Firewall: lectura de regla coincidente por dirección/protocolo y prioridad de arriba hacia abajo; leyenda local rojo=DROP/verde=ACCEPT solo para filas legibles.
- Transporte, seguridad, SMTP y DNS: filminas locales y estándares primarios RFC 9293, 3168, 3022, 5321, 8482, 5116 y 2104, según cada pregunta.

## Pendientes

Provisionales: #41, #66, #67. La fila HTTPS gris no tiene semántica definida por la guía (#41); los diagramas no muestran puerto del servidor (#66–67).

Ambiguas: #37, #60, #79, #83, #119, #127. q37 pide dos respuestas aunque solo una afirmación sobre MSS/Window Scale es inequívoca; q60 y q79 muestran puertos sin identificar procesos; q83 no tiene una opción que nombre MAIL FROM y RCPT TO; q119 presenta rutas R y C para el mismo /24; q127 propone un hash simple ante un atacante activo.

## Límites y no-regresión

No apareció una fotografía independiente y legible del examen 4K1. Las capturas del test online prueban el recurso exhibido, no la fidelidad histórica de imágenes reconstruidas; no se usaron marcas de estudiantes. La guía IPFire no define gris. La filmina local de Seguridad disponible es de 2024.

Las 92 resoluciones verificadas previas permanecen estructuralmente idénticas. No se modificaron JSON originales, DOCX originales, imágenes ni código.

## Validación de JoyaCards

El Word V2 importó 132 preguntas, 585 opciones, 123 puntuables, 9 sin puntuar, 15 preguntas múltiples, 40 referencias visuales y 585 justificaciones; no hubo fragmentos falsos ni advertencias. Se recorrieron las 132 tarjetas localmente y se probó carga V2 en joyacards.vercel.app sin errores de consola ni solicitudes fallidas. El visor de imagen, zoom y arrastre funcionaron. Tests backend 29/29, frontend 22/22; build completado. Lint reporta el error preexistente Buffer is not defined en frontend/test/redesParcial4k1Import.test.js:25.

El Word se exportó desde Microsoft Word a 60 páginas. Las 60 se revisaron en hojas de contacto y siete a tamaño completo; el alcance se describe en VALIDACION_FUNCIONAL_4K1.md.

## Archivos

- AUDITORIA_PENDIENTES_V2.md — análisis y evaluación alternativa por alternativa de las 40 preguntas.
- preguntas-resueltas-v2.json — resolución V2 con campos de extracción preservados.
- Redes_Parcial_4K1_2026_RESUELTO_V2.docx — documento importable con 123 claves y 9 preguntas sin puntuar.
- PREGUNTAS_PENDIENTES_V2.md — nueve ítems y evidencia concreta necesaria.
- VALIDACION_FUNCIONAL_4K1.md — importación local/publicada, pruebas y revisión visual.
- RESUMEN_ITERACION_4.md — resumen ejecutivo.

Ninguna de las nueve pendientes recibió clave puntuable; ninguna de las 92 claves previas se alteró.
