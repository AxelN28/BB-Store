const demoSizes = ['S', 'M', 'L', 'XL', '2XL'];

export const apparelDisplays = {
  'dtmf-cities-hoodie': {
    kind: 'hoodie', label: 'Buzo DTmF Ciudades', name: 'Buzo DTmF Gira Mundial Ciudades',
    color: 'Negro lavado', fabric: '#343233', trim: '#272526',
    x: -2.10, angle: -0.09, sizes: demoSizes,
    price: 70, currency: 'USD', source: 'Tienda de la gira de Bad Bunny',
    sourceUrl: 'https://shop.debitirarmasfotos.com/products/dtmf-euro-dates-black-hoodie',
    description: 'Buzo negro de tela gruesa con capucha, punos acanalados y ciudades de la gira en la espalda.',
  },
  'dtmf-medellin-tee': {
    kind: 'tee', label: 'Camiseta DTmF Medellin', name: 'Camiseta adidas DTmF Medellin',
    color: 'Blanco crema, azul y rojo', fabric: '#dedbcb', trim: '#cbc7b6',
    x: 0, angle: Math.PI + 0.06, showBack: true, sizes: demoSizes,
    price: 199950, currency: 'COP', source: 'adidas Colombia',
    sourceUrl: 'https://www.adidas.co/camiseta-dtmf-bad-bunny-medellin-merch-tejido-grueso/KW8050.html',
    description: 'Camiseta de tejido grueso, corte cuadrado y estampado azul y rojo de Medellin en la espalda.',
  },
  'dtmf-washed-tee': {
    kind: 'washed', label: 'Camiseta negra DTmF', name: 'Camiseta DTmF negro lavado',
    color: 'Gris carbon lavado', fabric: '#666363', trim: '#494747',
    x: 2.10, angle: 0.11, sizes: demoSizes,
    price: null, currency: 'USD', source: 'Referencia de imagen',
    description: 'Camiseta holgada de acabado lavado con DTmF en blanco y el arte del album en la espalda.',
  },
};
