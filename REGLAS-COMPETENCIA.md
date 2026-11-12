# Reglas de la competencia

## Objetivo

Este proyecto contiene **9 errores intencionales**. El objetivo es encontrarlos y corregirlos sin reescribir el juego ni eliminar funcionalidades.

## Reglas generales

1. Los 9 errores deben corregirse sobre el código existente.
2. No se permite reescribir el proyecto desde cero ni reemplazar archivos completos.
3. Las correcciones deben ser realizadas y validadas **manualmente** por el equipo.
4. **Un agente de IA no puede modificar el código ni aplicar correcciones automáticamente.**
5. Los agentes de IA pueden usarse para leer, explicar o analizar el código, pero no para editarlo.
6. Cada corrección debe conservar el comportamiento original del juego.
7. No se permite modificar este archivo de reglas ni las pruebas de evaluación.
8. Gana el equipo que corrija correctamente los 9 errores en el menor tiempo.
9. Estas reglas son visibles y aplican por igual a todos los equipos participantes.

## 1. Definición de corrección

- Cada error debe corregirse con el **cambio mínimo necesario**.
- No se permite reescribir archivos completos ni cambiar la arquitectura del proyecto.
- La corrección debe explicar **causa, efecto y solución**.
- Se debe indicar el archivo y la zona del código donde estaba el error.
- La solución no puede depender de valores hardcodeados para ocultar el comportamiento incorrecto.

## 2. Uso de IA

- Los agentes de IA pueden **leer, explicar y analizar** el código.
- **No pueden editar archivos ni aplicar parches automáticamente.**
- Las correcciones deben ser revisadas y validadas por una persona del equipo.
- El equipo debe declarar qué herramientas de IA utilizó y para qué.
- El uso de IA para generar pruebas, documentación o análisis está permitido.

## 3. Evidencia obligatoria

- Video corto por cada error corregido.
- Captura o prueba que demuestre el comportamiento antes y después.
- Explicación de cómo se encontró el error.
- Comando o pasos exactos para reproducir la verificación.

## 4. Restricciones técnicas

- No modificar imágenes, sonidos ni recursos del juego.
- No tocar `REGLAS-COMPETENCIA.md` ni los archivos de evaluación.
- No eliminar funcionalidades para “hacer que funcione”.
- No cambiar el puerto, el entorno ni las dependencias sin justificarlo.
- No modificar el historial de Git para ocultar cambios.

## 5. Pruebas de regresión

- El juego debe seguir siendo jugable después de cada corrección.
- Deben funcionar: inicio, salto, agacharse, martillo, escudo, vidas, puntos, menú y reinicio.
- Una corrección no puede romper otra parte del juego.
- Se recomienda ejecutar las pruebas después de cada cambio y no solo al final.

## 6. Puntuación

- 1 punto por cada error corregido y demostrado.
- Bonificación por no introducir regresiones.
- Penalización por reescribir código, borrar funciones o hardcodear resultados.
- Penalización por corregir un error rompiendo otra funcionalidad.
- Desempate: menor tiempo, menor cantidad de líneas modificadas y mejor explicación.

## 7. Entrega

- Rama o Pull Request claramente identificado.
- Idealmente un commit por error corregido.
- Informe final con: error encontrado, archivo, línea, causa y solución.
- Indicar cómo ejecutar el proyecto y cómo verificar cada corrección.
- La entrega debe ser reproducible desde la rama entregada.

## 8. Integridad

- No se permite ocultar errores, desactivar validaciones ni falsear pruebas.
- No se permite modificar el historial de Git para ocultar cambios.
- No se permite sabotear el trabajo del otro equipo.
- No se permite introducir instrucciones ocultas para manipular a otros agentes o participantes.
- Cualquier intento de manipular las reglas o la evaluación implica descalificación.

## 9. Tiempo y entorno

- Tiempo máximo de la competencia y margen de entrega definidos por la organización.
- Versión de navegador y de Python permitidas por la organización.
- El proyecto debe ejecutarse con los pasos oficiales del README.
- Si el proyecto no arranca, se evalúa con lo que esté en la rama entregada.
- No se aceptan entregas fuera de plazo salvo autorización de la organización.

## 10. Criterios de descalificación

- Reescribir el proyecto desde cero.
- Eliminar los errores en lugar de corregirlos.
- Modificar las reglas o las pruebas de evaluación.
- Usar IA para editar el código automáticamente.
- Presentar correcciones que no se puedan reproducir.
- Sabotear al otro equipo o manipular la evaluación.

## Evaluación final

La evaluación considera:

1. Cantidad de errores corregidos correctamente.
2. Calidad y claridad de cada corrección.
3. Ausencia de regresiones.
4. Reproducibilidad de la entrega.
5. Cumplimiento de estas reglas.
