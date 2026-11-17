const fittedSizes = ['7 1/8', '7 1/4', '7 3/8', '7 1/2', '7 5/8', '7 3/4'];
const adjustableSizes = ['Adjustable'];
const productBaseUrl = 'https://frshcompany.com/products/frsh-x-bad-bunny-new-era-';

export const capDisplays = {
  'yankees-fitted': {
    team: 'YANKEES', badge: 'yankees', silhouette: '59FIFTY', crown: '#141c2b', lettering: '#eeeee7',
    selectableSize: true, x: -0.88, shelf: 2.27, angle: -0.22, slug: '5950-fitted-yankee-hat',
  },
  'mets-fitted': {
    team: 'METS', badge: 'mets', silhouette: '59FIFTY', crown: '#133d94', lettering: '#ec5a20',
    selectableSize: true, x: 0.88, shelf: 2.27, angle: -0.30, slug: '5950-fitted-mets-hat',
  },
  'yankees-snapback': {
    team: 'YANKEES', badge: 'yankees', silhouette: '19TWENTY', crown: '#101922', lettering: '#eeeee7',
    selectableSize: false, x: -0.88, shelf: 0.84, angle: -0.34, slug: '1920-snapback-yankee-hat',
  },
  'mets-snapback': {
    team: 'METS', badge: 'mets', silhouette: '19TWENTY', crown: '#134499', lettering: '#ef621f',
    selectableSize: false, x: 0.88, shelf: 0.84, angle: -0.26, slug: '1920-snapback-mets-hat',
  },
};

export const capProducts = Object.fromEntries(Object.entries(capDisplays).map(([id, cap]) => [
  id,
  {
    name: `Gorra ${cap.team} ${cap.silhouette}`,
    color: cap.badge === 'mets' ? 'Azul rey y naranja' : cap.selectableSize ? 'Azul marino y blanco' : 'Negro y blanco',
    referencePriceUsd: cap.selectableSize ? 65 : 60,
    retailerUrl: productBaseUrl + cap.slug,
    sizes: cap.selectableSize ? fittedSizes : adjustableSizes,
    description: cap.selectableSize
      ? 'Gorra estructurada de talla fija con monograma bordado y parche lateral de NUEVAYoL.'
      : 'Gorra ajustable con visera curva, monograma bordado y parche lateral de NUEVAYoL.',
  },
]));
