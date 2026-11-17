# BB Store · Documento de entrega

## Concepto y recorrido

Benito es una vitrina academica de streetwear vinculada a Bad Bunny. Desde Inicio se puede ir a Coleccion para comparar los diez productos o entrar a la exhibicion para ver sus modelos 3D. En la exhibicion, Tenis queda al frente, Ropa a la izquierda y Gorras a la derecha. Cada ficha permite elegir talla y agregar a una bolsa simulada. Cuando hay referencia por talla se actualiza el precio, y la bolsa conserva los subtotales por moneda.

### Esquema de pantallas

| Pantalla | Distribucion principal | Siguiente accion |
|---|---|---|
| Inicio | Menu, imagen de la exhibicion y titulo | Explorar la tienda o abrir Coleccion |
| Coleccion | Indice de secciones, lista, precio y ficha expandible | Elegir talla o ver en 3D |
| Detalle | Modelo y ficha lateral en escritorio. Modelo encima de la ficha en movil | Elegir talla, girar prendas y gorras, o agregar |
| Bolsa | Cantidades, referencias y subtotales | Cambiar cantidades o volver al catalogo |
| Nosotros | Proposito y contexto academico | Volver a Coleccion |
| Contacto | Texto y formulario en dos columnas. Una columna en movil | Preparar correo |

## Guia de movimiento

| Momento | Movimiento | Intencion |
|---|---|---|
| Entrada al inicio | Desplazamiento de 15 px en 620 ms. El texto de apoyo y el boton entran con 90 ms de retraso | Presentar primero el titulo y despues la accion |
| Catalogo | Encabezados de seccion entran en 380 ms al cruzar el area visible | Marcar el cambio entre Ropa, Tenis y Gorras |
| Exhibicion | La camara recorre el espacio y desacelera al acercarse al objetivo | Conservar la orientacion al girar entre paredes y enfocar un producto |
| Ficha | Panel de producto en 400 ms | Relacionar el modelo enfocado con su talla, descripcion y precio |
| Bolsa | Contador en 280 ms al cambiar la cantidad y panel en 220 ms al abrir | Confirmar el cambio de cantidad y mostrar de donde aparece la bolsa |

Con movimiento reducido, la camara llega directamente al encuadre y las entradas decorativas se omiten. Secuencia para el prototipo animado funcional: Inicio → Exhibicion → giro a Ropa → detalle 3D → Bolsa.

## Desarrollo y verificacion

- React y Vite para la interfaz. Three.js y React Three Fiber para los modelos y la camara. CSS para entradas y microinteracciones e Intersection Observer para detectar el desplazamiento.
- Inicio muestra una captura WebP de la escena propia. El motor 3D se carga al visitar la exhibicion o activar un modelo. Los enlaces directos a producto muestran primero la ficha y la opcion de activar el modelo. Las pantallas de catalogo, contacto y bolsa funcionan sin WebGL.
- El formulario prepara un mensaje dirigido al correo academico del equipo en la aplicacion de correo del visitante.
- El [informe de pruebas](pruebas.md) registra el recorrido en celular, tableta y escritorio y la medicion movil local. El objetivo de rendimiento es 80 o mas.

## Sustentacion de 10 minutos

| Minutos | Contenido |
|---|---|
| 0–2 | Concepto, publico y decisiones visuales |
| 2–5 | Demostracion de las tres zonas, el giro de camara y un detalle 3D |
| 5–7 | Talla, precio de referencia, bolsa y Contacto |
| 7–9 | Movimiento reducido, rendimiento, Lighthouse y publicacion |
| 9–10 | Roles, aportes de cada integrante y cierre |

Para cerrar la entrega, registrar integrantes, roles y aportes con sus commits reales. Adjuntar el archivo de diseno o prototipo del equipo si la materia exige Figma, la URL publica y el informe Lighthouse. Consultar [Creditos y licencias](recursos.md) antes de difundir los recursos de terceros.
