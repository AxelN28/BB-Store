import { apparelDisplays } from './apparelCatalog';
import { sizes } from './bagState';
import { capProducts } from './capCatalog';

const sneakers = {
  response: {
    name: 'adidas Response CL',
    color: 'Negro total',
    sizes,
    referencePriceUsd: 126,
    stockxUrl: 'https://stockx.com/adidas-response-cl-bad-bunny-triple-black',
    description: 'Tenis de malla negra con paneles ondulados y franjas azul oscuro.',
  },
  campus: {
    name: 'adidas Campus Chalky Brown',
    color: 'Beige y cafe',
    sizes,
    referencePriceUsd: 88,
    stockxUrl: 'https://stockx.com/adidas-campus-light-bad-bunny-brown',
    description: 'Gamuza beige, cordones gruesos y suela color crema.',
  },
  forum: {
    name: 'adidas Forum Low',
    color: 'Cafe',
    sizes,
    referencePriceUsd: 620,
    stockxUrl: 'https://stockx.com/adidas-forum-low-bad-bunny',
    description: 'Tenis de corte bajo con puntera perforada y correa con hebilla.',
  },
};

export const products = { ...sneakers, ...apparelDisplays, ...capProducts };

export const sections = [
  { id: 'apparel', label: 'Ropa', products: Object.keys(apparelDisplays) },
  { id: 'sneakers', label: 'Tenis', products: Object.keys(sneakers) },
  { id: 'caps', label: 'Gorras', products: Object.keys(capProducts) },
];
