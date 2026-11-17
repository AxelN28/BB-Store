# Informe de pruebas

## Lighthouse movil

Medicion local de la compilacion de produccion con Lighthouse 13.6.0 y el perfil movil predeterminado. Los archivos se sirvieron en la ruta `/BB-Store/` para reproducir la estructura de GitHub Pages.

| Pantalla | Rendimiento | Accesibilidad automatizada | Contraste |
|---|---:|---:|---|
| Inicio | 100 | 100 | Aprobado |
| Coleccion | 100 | 100 | Aprobado |
| Detalle de Campus, antes de activar el modelo | 100 | 100 | Aprobado |
| Bolsa | 100 | 100 | Aprobado |
| Nosotros | 100 | 100 | Aprobado |
| Contacto | 100 | 100 | Aprobado |

El objetivo de 80 se supera en las pantallas medidas localmente. La escena 3D se carga al elegirla y queda fuera de estas mediciones de carga inicial. Queda pendiente repetir Lighthouse en la URL publica y adjuntar ese informe a la entrega.

## Pruebas de navegacion

- Chromium en celular (390 × 844), tableta (768 × 1024) y escritorio (1280 × 800). Se comprobaron catalogo, seleccion de talla, precio de referencia, bolsa, fichas 3D, enlaces directos y regreso con el boton Atras.
- El formulario valida los campos obligatorios y prepara un enlace de correo con destinatario, asunto y cuerpo.
- La prueba de navegacion se ejecuto con movimiento reducido. Se verifico en el codigo que se omiten las entradas decorativas y que la camara salta al encuadre.
- Instalacion limpia con `npm ci`, analisis con `npm run lint` y compilacion con `npm run build` completados.
