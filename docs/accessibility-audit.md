# Análisis de accesibilidad — 26 de octubre de 2026

Revisión inicial del commit `40fde81` en el servidor de desarrollo de Astro, con Chrome de escritorio y emulación móvil. Se revisaron Home, About, Projects, Contact, el menú abierto y el diálogo de SRE Agent. Las [evidencias estructuradas](accessibility-audit.json) incluyen los resultados de Astro, axe y las muestras de contraste. Los apartados de hallazgos conservan el diagnóstico original; las correcciones posteriores se resumen a continuación.

## Correcciones verificadas

Los tres hallazgos se han corregido en el código de trabajo:

| Hallazgo                          | Corrección                                                                                                                                                                                    | Verificación                                                                                                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contraste del texto naranja       | El acento pasa de `#ad3300` a `#842700`.                                                                                                                                                      | Mínimo muestreado para texto normal: **5,12:1**, superior a 4,5:1. Se recorrieron las cuatro vistas con scroll en escritorio y móvil, el menú, el diálogo y un botón con hover. |
| Apertura consecutiva de proyectos | Escape y el botón de cierre completan el cierre, limpian la selección y devuelven el foco en su propio evento. Un evento nativo `close` pendiente ya no puede borrar una selección posterior. | **6 de 6** repeticiones aisladas correctas. La regresión recorre los proyectos varias veces con Espacio/Escape y también comprueba el botón de cierre.                          |
| H1 ausente en vistas secundarias  | La navegación con JavaScript promueve los títulos a H1 nativos y ajusta los subtítulos a H2. Las islas conservan la jerarquía correspondiente.                                                | Un H1 accesible por vista activa y auditoría axe completa sin infracciones confirmadas. Sin JavaScript, se mantiene un único H1 y las secciones siguen siendo H2.               |

Pasan **26 pruebas** tanto contra desarrollo como contra la compilación de producción, además del linter, `astro check` y la compilación. La suite incluye ahora una medición de contraste renderizado en `tests/accessibility.spec.ts`, pues los fondos translúcidos siguen provocando resultados `incomplete` en axe. Sus resultados se guardan en `test-results/**/contrast.json`.

Los atributos `tabindex="-1"` se conservan: los avisos descritos abajo siguen siendo falsos positivos. La verificación no sustituye la sesión pendiente con un lector de pantalla ni garantiza cada combinación posible de viewport y estado interactivo.

## Los dos avisos de Astro

En Home se reproducen exactamente estos avisos de `a11y-no-noninteractive-tabindex`:

| Elemento       | Atributo        | Uso                                      |
| -------------- | --------------- | ---------------------------------------- |
| `main#main`    | `tabindex="-1"` | Recibir el foco desde «Skip to content». |
| `section#home` | `tabindex="-1"` | Recibir el foco al volver a Home.        |

Son falsos positivos en este contexto. La regla instalada de Astro, en `node_modules/astro/dist/runtime/client/dev-toolbar/apps/audit/rules/a11y.js:482`, marca estos elementos por tener `tabindex` sin distinguir el valor negativo. `-1` permite enfocar mediante JavaScript sin introducir una parada en la navegación con Tab, tal como explica la [guía de teclado de W3C](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#keyboardnavigationbetweencomponents). Eliminarlo perjudicaría el salto al contenido y la gestión del foco.

Las otras secciones reciben el mismo aviso. Con el menú abierto, Astro también puede marcar como «Missing content» títulos y enlaces del contenido subyacente: su regla consulta `innerText` aunque ese contenido está oculto e inerte. No equivale a que los enlaces del menú carezcan de nombre accesible.

Recomendación: conservar estos atributos y documentar el falso positivo. No añadir roles artificiales ni retirar semántica para silenciar la auditoría.

## Hallazgos que requieren atención

### 1. Contraste del texto naranja — prioridad alta

El acento `#ad3300` no alcanza siempre el contraste necesario sobre el degradado y los círculos detrás del cristal. Axe devuelve muchos resultados `incomplete` para `color-contrast`: no puede resolver automáticamente estos fondos. Por eso se midieron también fondos renderizados, conservando las transparencias.

| Texto                    | Vista y dispositivo | Contraste mínimo muestreado |
| ------------------------ | ------------------- | --------------------------- |
| Senior Software Engineer | Home, escritorio    | 3,62:1                      |
| Senior Software Engineer | Home, móvil         | 4,32:1                      |
| About me!                | Home, escritorio    | 4,47:1                      |
| Experience               | About, escritorio   | 4,27:1                      |
| View all projects        | Projects, móvil     | 4,21:1                      |
| Say hello!               | Contact, escritorio | 4,30:1                      |
| Say hello!               | Contact, móvil      | 4,28:1                      |

Estos textos requieren 4,5:1. El subtítulo usa 20px y peso 600; la medición aplica el umbral conservador de texto normal. El requisito y la prohibición de redondear un valor insuficiente se describen en [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Recomendación: oscurecer el texto de acento o proporcionar fondos más opacos donde sea necesario. Por ejemplo, `#8f2a00` da aproximadamente 4,70:1 sobre el peor fondo del subtítulo muestreado; es una propuesta, pendiente de validar en todos los estados y posiciones de desplazamiento. También hay que revisar las fechas de la cronología, que reutilizan el acento.

Método: se obtuvo el color del texto mediante `getComputedStyle`; se ocultó únicamente su pintura, conservando dimensiones y fondos; se capturó el viewport a escala CSS y se calculó la luminancia del fondo bajo sus rectángulos. Se muestreó cada dos píxeles, sin usar el color de los bordes suavizados de los caracteres. Se excluyeron ilustraciones decorativas, texto oculto y contenido inerte. Las cifras corresponden a las vistas y posiciones observadas; no cubren todos los tamaños, scrolls, hover o transiciones.

### 2. Apertura consecutiva de diálogos con teclado — prioridad alta

La prueba existente `tests/portfolio.spec.ts:139` falla de forma intermitente tras cerrar un proyecto con Escape y abrir el siguiente con Espacio. En algunos casos no aparece el diálogo esperado; en otro no se recuperó el foco en el botón de Awards Predictions.

La ejecución completa produjo **22 pruebas existentes correctas y 2 fallidas**, ambas en esta interacción. Se repitió la prueba con un solo worker y tres ejecuciones por dispositivo: **4 fallos de 6**. Por tanto, no se explica únicamente por la carga de pruebas paralelas.

Recomendación: investigar el ciclo de cierre, actualización de estado y devolución del foco en `src/components/islands/Projects.tsx`, además de la sincronización de la prueba. La evidencia confirma un problema reproducible en la secuencia automatizada; no determina todavía su causa ni permite atribuirlo exclusivamente a React o al navegador. Verificar después con teclado físico y lector de pantalla. Puede afectar a la operabilidad y al orden del foco.

### 3. Falta un encabezado de nivel 1 en las vistas secundarias — prioridad media

El único H1 está dentro de Home. Al abrir About, Projects o Contact, Home se oculta mediante `display: none`, por lo que su H1 desaparece del árbol de accesibilidad. Cada vista secundaria empieza entonces por un H2.

Axe completo lo marca como `page-has-heading-one`, de impacto moderado y categoría `best-practice`. No aparece en la suite habitual porque esta filtra las reglas por etiquetas WCAG. Es una mejora de estructura; por sí sola no demuestra un incumplimiento AA.

Recomendación: exponer un encabezado principal por vista activa y conservar la jerarquía adecuada cuando todas las secciones se muestran sin JavaScript.

## Comprobaciones satisfactorias y límites

- `astro check`: cero errores, advertencias e indicaciones. El linter también pasa.
- Las pruebas de navegación, Escape, historial, salto al contenido, interrupción de transiciones y movimiento reducido pasan en escritorio y móvil.
- Las pruebas de distribución a 320, 390, 768 y 1440px, y de texto al 200%, pasan.
- La lectura estática y las acciones de respaldo sin JavaScript pasan las pruebas existentes.
- Las dos auditorías adicionales recorrieron los seis estados. Axe completo detecta la falta de H1 en las vistas secundarias y deja comprobaciones de contraste pendientes. No debe interpretarse una lista vacía de infracciones WCAG automáticas como validación completa del contraste.
- El menú y el texto del diálogo muestreados superan sus umbrales de contraste en las capturas analizadas. Esto no certifica el contraste de todos los iconos, bordes o estados de foco.

Quedan pendientes una sesión real con VoiceOver/NVDA, la comprobación exhaustiva de contraste durante scroll y estados interactivos, y la evaluación manual del subtítulo animado respecto a pausa/detención. El subtítulo respeta movimiento reducido; el botón de pausa fue retirado por decisión previa del usuario. No se han cambiado esas preferencias durante este análisis.
