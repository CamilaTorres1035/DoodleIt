# Doodle Gallery (DoodleIt)

Una aplicación web interactiva (Single Page Application) construida con HTML, CSS y p5.js que permite dibujar, guardar y organizar pequeños bocetos directamente en el navegador.

## Características
- Lienzo Interactivo: Dibuja libremente gracias al motor de p5.js.
- Herramientas Personalizables: Selector nativo de color y grosor de pincel.
- Borrador Mágico: Herramienta para corregir errores simulando el color del fondo.
- Persistencia Local: Los dibujos se guardan en formato Base64 en el localStorage del navegador, por lo que no se pierden al recargar la página.
- Galería Polaroid: Sistema de visualización de dibujos pasados con un estilo visual de fotografías instantáneas.
- Lightbox (Modal): Haz clic en cualquier dibujo de la galería para verlo en tamaño completo.
- Gestión de Galería: Elimina los bocetos que ya no quieras conservar.

## Conceptos Aprendidos / Aplicados
- Construcción de una SPA (Single Page Application) sin frameworks adicionales, ocultando y mostrando "vistas" (divs) por medio de clases CSS.
- Manipulación del DOM (createElement, appendChild) para renderizar listas dinámicas (la galería).
- Uso de canvas.toDataURL() para convertir píxeles gráficos en cadenas de texto (Base64).
- Serialización de datos usando JSON.stringify() y JSON.parse() para guardar arreglos complejos en localStorage.



Propagación de eventos en JS (e.stopPropagation()) para evitar comportamientos no deseados al tener elementos anidados con clics (botón de eliminar encima de la foto).

