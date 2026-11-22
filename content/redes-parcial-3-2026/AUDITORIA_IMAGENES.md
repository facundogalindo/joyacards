# Auditoría visual integral — Redes, parcial 3 de 2026

La fotografía original es la fuente primaria. Las reconstrucciones vectoriales separan lo que se distingue de lo que sigue incierto y no reemplazan las imágenes originales.

## Integridad del cuestionario

- Documento importado: `Redes_Parcial_3_2026_JoyaCards_Auditado.docx`.
- 30 preguntas puntuables, 32 justificaciones, 0 preguntas sin puntaje y 0 advertencias de importación.
- 9 apariciones de imágenes y 5 imágenes únicas.
- SHA-256 semántico antes y después: `9e9efc0a2741bdc58fcb04bb34a80f3aa9128706d1ccf72c5e9ac071968eeb3e`.
- Los enunciados, opciones, claves, justificaciones, puntajes, tipos de pregunta y bytes de las imágenes incrustadas permanecen iguales.
- Las cinco fotos completas originales se conservaron. Sus hashes y los de cada reconstrucción y comparación están en [AUDITORIA_IMAGENES.json](AUDITORIA_IMAGENES.json).

## Resultado por ejercicio

| Ejercicio | Estado | Material disponible |
| --- | --- | --- |
| Firewall / Telnet | **COMPLETA VERIFICADA** | Foto #11, recorte #22, versión mejorada, reconstrucción y comparación |
| TFTP | **COMPLETA VERIFICADA** | Foto #2, recorte #31, versión mejorada, reconstrucción y comparación |
| `nslookup` / Instagram | **COMPLETA VERIFICADA** | Foto #3, recorte #30, reconstrucción y comparación |
| `show ip route` | **PARCIAL VERIFICADA** | Foto #12, recorte #21, reconstrucción de topología y tabla, comparación |
| `netstat` | **PARCIAL VERIFICADA** | Foto #8, recorte #25, consola parcial y comparación; variante de práctica separada para la pregunta 30 |

## 1. Firewall / Telnet — completa verificada

**Fuentes:** [foto completa #11](assets/originales-completas/foto-11-firewall-completa-original.jpg), [recorte #22](assets/foto-11-firewall-telnet-origen-22.jfif).

**Reconstrucción:** [SVG](assets/reconstrucciones/reconstruccion-firewall-telnet.svg). **Comparación:** [foto, recorte y reconstrucción](assets/comparaciones/firewall-original-vs-reconstruccion.jpg). **Mejora de imagen:** [versión mejorada](assets/mejoradas/foto-11-firewall-telnet-origen-22-mejorada.jpg) y [comparación con el original](assets/comparaciones/firewall-original-vs-mejorada.jpg).

Se reabrieron y cotejaron las dos fuentes. La reconstrucción existente conserva las cinco reglas en su orden, protocolos, orígenes, destinos, acciones, checks y política general; también mantiene las zonas Green e Internet y sus colores. Se conserva la diferencia que aparece entre la IP `.155` de la consigna y las IP `.33` de ciertas reglas. Los pequeños iconos de edición se redibujaron como elementos cosméticos; no se interpretaron como reglas. La clave del cuestionario no se usó para reconstruir ni se cambió.

**Fidelidad:** completa para la información relevante que se ve en la interfaz. La mejora de contraste/enfoque y el redibujo eliminan muaré y perspectiva, sin cambiar reglas.

## 2. TFTP — completa verificada

**Fuentes:** [foto completa #2](assets/originales-completas/foto-02-tftp-completa-original.jpg), [recorte #31](assets/foto-02-tftp-recorte-31.jfif).

**Reconstrucción:** [SVG](assets/reconstrucciones/reconstruccion-tftp.svg). **Comparación:** [foto, recorte y reconstrucción](assets/comparaciones/tftp-original-vs-reconstruccion.jpg). **Mejora de imagen:** [versión mejorada](assets/mejoradas/foto-02-tftp-recorte-31-mejorada.jpg) y [comparación con el original](assets/comparaciones/tftp-original-vs-mejorada.jpg).

Se verificaron literalmente la consigna, las cinco opciones, sus letras y su orden. La foto muestra seleccionada visualmente la opción D; la reconstrucción conserva esa selección y el enlace “Quitar mi elección”. La selección fotografiada no se interpretó como la respuesta correcta. La clave B existente permanece intacta.

**Fidelidad:** completa respecto del contenido fotografiado. Se normalizaron tipografía y espaciado para hacer legible la misma interfaz.

## 3. `nslookup` / Instagram — completa verificada

**Fuentes:** [foto completa #3](assets/originales-completas/foto-14-nslookup-completa-original.jpg), [recorte #30](assets/foto-14-nslookup-instagram-original-abierta-30.jfif).

**Reconstrucción:** [SVG](assets/reconstrucciones/reconstruccion-nslookup-instagram.svg). **Comparación:** [foto, recorte y reconstrucción](assets/comparaciones/nslookup-original-vs-reconstruccion.jpg).

Se cotejaron el dominio `instagram.com`, la instrucción de escribir el comando completo y la indicación de no agregar texto ni espacios de más. El campo “Respuesta” queda vacío, como en la foto; no se incorporó la respuesta ni se convirtió la captura en opción múltiple.

**Fidelidad:** completa para la consigna y el campo visible. Se eliminaron muaré, inclinación y entorno físico.

## 4. `show ip route` — parcial verificada

**Fuentes:** [foto completa #12](assets/originales-completas/foto-12-show-ip-route-completa-original.jpg), [recorte #21](assets/foto-12-show-ip-route-recorte-21.jfif). Las preguntas 14–17 comparten la misma foto y reciben la misma reconstrucción.

Busqué `redes_pregunta_5_reconstruccion_fiel.png` en el repositorio y los adjuntos disponibles, pero no encontré ese archivo. Esta versión se reconstruyó desde las dos fuentes citadas.

**Reconstrucción:** [SVG parcial](assets/reconstrucciones/reconstruccion-show-ip-route-parcial.svg). **Comparación:** [foto completa, recorte y reconstrucción](assets/comparaciones/show-ip-route-original-vs-reconstruccion-parcial.jpg).

Se reconstruyeron la geometría triangular de los tres routers y las cuatro LAN en sus posiciones relativas. El dibujo conserva tres equipos finales en la LAN izquierda, dos en la LAN superior derecha, uno y un switch en la LAN inferior izquierda, y un punto de acceso con dos portátiles en la LAN inferior derecha. Se incluyeron las siete subredes visibles: `192.168.10.0/24`, `.20.0/24`, `.30.0/24`, `.40.0/24`, `.50.0/24`, `.60.0/24` y `.70.0/24`. Los enlaces entre routers mantienen el trazo rojo observado; no se dibujaron puntas porque el sentido de las marcas no puede confirmarse. Las LAN de la parte inferior mantienen el trazo verde visible.

La tabla se cotejó directamente con la fotografía #12 y el recorte #21, no con las respuestas del cuestionario. Las rutas RIP son `192.168.10.0/24 via 192.168.20.1`, `192.168.30.0/24 via 192.168.70.2` y también `via 192.168.20.1`, y `192.168.50.0/24 via 192.168.70.2`; todas muestran `[120/1]` y se conservaron sus tiempos e interfaces visibles. Las rutas conectadas/locales verificadas son `.20.0/24 C` con `.20.2/32 L` por `Serial0/1/0`; `.40.0/24 C` con `.40.1/32 L` por `GigabitEthernet0/0/0`; `.60.0/24 C` con `.60.1/32 L` por `GigabitEthernet0/0/1`; y `.70.0/24 C` con `.70.1/32 L` por `Serial0/1/1`. La dirección local final se corrigió a `192.168.70.1/32`; `192.168.70.2` aparece como próximo salto de rutas R. La identificación del router consultado como Router2 proviene de la pregunta asociada y se marca como referencia cruzada.

**No verificable:** nombres de los otros routers, nombres/modelos pequeños de varios dispositivos, interfaces rotuladas junto a los cables y sentido de las marcas rojas. Esos datos no se completaron. La tabla es legible; la incertidumbre queda principalmente en rótulos y flechas del diagrama.

## 5. `netstat` — parcial verificada

**Fuentes:** [foto completa #8](assets/originales-completas/foto-08-netstat-completa-original.jpg), [recorte #25](assets/pendiente-foto-08-netstat-25.jfif). Las preguntas 29 y 30 conservan el mismo original y la misma reconstrucción parcial.

**Reconstrucción de la foto:** [SVG parcial](assets/reconstrucciones/reconstruccion-netstat-parcial.svg). **Comparación:** [foto completa, recorte y reconstrucción parcial](assets/comparaciones/netstat-original-vs-reconstruccion-parcial.jpg).

Al reabrir y ampliar el recorte #25 se cuentan **cuatro filas** debajo de los encabezados de seis columnas (`Proto`, `Recv-Q`, `Send-Q`, `Local Address`, `Foreign Address`, `State`). La reconstrucción ahora conserva las cuatro en el orden visible. La línea superior del encabezado y los valores de las filas no tienen lectura confiable. Por eso cada campo de las cuatro filas aparece como `[…]`; no se asignaron protocolos, colas, direcciones, puertos ni estados.

**Variante recordada, solo para práctica de la pregunta 30:** [SVG](assets/reconstrucciones/netstat-variante-recordada-practica.svg). La etiqueta exacta es **VARIANTE RECONSTRUIDA PARA PRÁCTICA**. **Comparación:** [foto, recorte y variante recordada](assets/comparaciones/netstat-original-vs-variante-recordada.jpg). Tiene **tres filas**, que corresponden a los tres datos del escenario recordado: TCP 22 LISTEN, TCP 443 LISTEN y UDP 8280 con estado vacío. No agrega direcciones ni colas y no se presenta como transcripción de la foto. La pregunta 29 no ofrece esa variante. Las respuestas correctas de ambas preguntas no se tocaron.

**Fidelidad:** parcial para la captura real; los encabezados y las cuatro filas se conservaron, pero los valores ilegibles permanecen desconocidos. La variante práctica tiene tres filas y se identifica aparte del original.

## Validación y límites

Las cinco fotos y sus recortes se compararon visualmente con sus reconstrucciones. Se conservaron las tres reconstrucciones completas existentes: no se identificaron cambios de contenido que justificaran redibujarlas. Las dos imágenes antes consideradas no reconstruibles ahora tienen reconstrucciones parciales con incertidumbres visibles.

Las versiones mejoradas siguen disponibles para Firewall y TFTP. Los originales y recortes de todas las imágenes continúan en el selector. Las reconstrucciones no alteran la importación, respuestas ni puntajes.
