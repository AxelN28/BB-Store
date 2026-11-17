# BB Store

Vitrina academica de ropa, tenis y gorras inspirada en Bad Bunny y sus colaboraciones. La exhibicion usa React, Vite y Three.js con React Three Fiber. Los modelos y la iluminacion se definen en `src/showroom/`.

## Desarrollo local

```sh
npm ci
npm run dev
```

Abre la URL que imprime Vite, entra en **Explorar la tienda** y selecciona un par de tenis para abrir su ficha. **Coleccion** abre el catalogo en lista con las tallas, precios de referencia, bolsa y enlaces a las fichas 3D.

`npm run lint` revisa el código fuente y la configuración de Vite. `npm run build` genera la versión de producción en `dist/`.

La bolsa simulada conserva modelos, tallas y cantidades en el navegador. Cada ficha 3D tiene un enlace directo, por ejemplo `#producto/campus`. La bolsa tambien tiene una pagina propia en `#bolsa`.

## Contacto

El formulario abre un borrador dirigido al correo academico del equipo en la aplicacion de correo del visitante. Para cambiar el destinatario, define `VITE_CONTACTO_CORREO` en `.env.local` y reinicia Vite. Para GitHub Pages, define la variable de repositorio con el mismo nombre antes de compilar. La direccion aparece en la web publica.

## Publicacion en GitHub Pages

1. En el repositorio de GitHub, selecciona **Settings → Pages → Source → GitHub Actions**.
2. Sube el proyecto a la rama `main` o ejecuta **Publicar en GitHub Pages** desde **Actions**. El flujo instala dependencias, ejecuta lint y compila el sitio.
3. Abre la URL de la ejecucion y prueba Inicio, Contacto, una ficha 3D y la bolsa. Ejecuta Lighthouse en modo movil para registrar el informe de entrega.

Vite genera recursos con rutas relativas para que el sitio funcione en la raiz del dominio o bajo la carpeta del repositorio. [Guia de publicacion de Vite](https://vite.dev/guide/static-deploy.html#github-pages)

## Documentacion

- [Guia de marca](docs/guia-de-marca.md)
- [Documento de entrega, guia de movimiento y guion de sustentacion](docs/entrega.md)
- [Creditos y licencias de recursos](docs/recursos.md)
- [Informe de pruebas y Lighthouse movil](docs/pruebas.md)

## Referencias de StockX y discografía

Los importes son capturas de precios base en USD de la ficha o del catálogo filtrado por talla de StockX. Los valores por talla se mantienen en `src/stockxPricing.js`. Si falta una referencia, la ficha y la bolsa enlazan a la talla específica en StockX. El subtotal incluye las tallas con precio verificado.

Los ocho cuadros muestran las portadas originales, con título y año. Las imágenes proceden de las fichas oficiales en [Apple Music](https://music.apple.com/us/artist/bad-bunny/1126808565) y se sirven localmente desde `src/assets/albums/`.

## Gorras NUEVAYoL

Los cuatro modelos recrean las versiones 59FIFTY y 19TWENTY de [FRSH Company](https://frshcompany.com/collections/bad-bunny-new-era). Las tallas y precios de referencia provienen de las fichas de FRSH. Los monogramas de los equipos proceden de MLB y se aplican como texturas de bordado. Desde la pared derecha se puede seleccionar una gorra, ver su parte trasera y añadirla a la bolsa simulada.

## Ropa

La pared izquierda exhibe tres recreaciones 3D. Las referencias oficiales son la [DTMF World Tour Cities Hoodie](https://shop.debitirarmasfotos.com/products/dtmf-euro-dates-black-hoodie) y la [adidas DTMF Medellín Merch Tee](https://www.adidas.co/camiseta-dtmf-bad-bunny-medellin-merch-tejido-grueso/KW8050.html). La camiseta negra lavada se recreó a partir de la imagen compartida y no tiene precio oficial verificado. Se pueden inspeccionar las tres prendas por delante y por detrás y agregar su talla a la bolsa simulada. Los subtotales de referencia se muestran por moneda.
