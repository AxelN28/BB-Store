import { CanvasTexture, SRGBColorSpace } from 'three';

function ink(paint, width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext('2d'));
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function text(ctx, value, x, y, font, color, width = 500) {
  ctx.textAlign = 'center';
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(value, x, y, width);
}

function chair(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineWidth = 9;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-53, 15);
  ctx.bezierCurveTo(-61, -65, -74, -106, -65, -123);
  ctx.quadraticCurveTo(-35, -145, 25, -138);
  ctx.bezierCurveTo(45, -127, 43, -84, 37, -30);
  ctx.lineTo(34, 22);
  ctx.moveTo(-47, -118);
  ctx.lineTo(-26, 17);
  ctx.moveTo(-24, -129);
  ctx.lineTo(-6, 17);
  ctx.moveTo(0, -131);
  ctx.lineTo(14, 17);
  ctx.moveTo(-53, 15);
  ctx.quadraticCurveTo(6, 25, 59, 13);
  ctx.lineTo(70, 34);
  ctx.quadraticCurveTo(13, 53, -65, 42);
  ctx.closePath();
  ctx.moveTo(-53, 43);
  ctx.lineTo(-61, 120);
  ctx.moveTo(56, 40);
  ctx.lineTo(61, 126);
  ctx.moveTo(26, 47);
  ctx.lineTo(19, 99);
  ctx.stroke();
  ctx.restore();
}

function hoodFront() {
  return ink((ctx) => {
    text(ctx, 'BAD BUNNY', 254, 134, '900 41px sans-serif', '#e9bd42');
    text(ctx, 'DeBÍ TiRAR', 255, 215, '900 76px Georgia, serif', '#4694ba');
    text(ctx, 'MáS FOToS', 254, 283, '900 76px Georgia, serif', '#4694ba');
    text(ctx, 'World Tour', 259, 332, 'italic bold 68px Georgia, serif', '#dc412c');
  });
}

function hoodBack() {
  return ink((ctx) => {
    text(ctx, 'DeBÍ TiRAR MáS FOToS', 256, 58, '900 39px sans-serif', '#4b9bbc');
    text(ctx, 'World Tour', 256, 121, 'italic bold 73px Georgia, serif', '#de4631');
    const cities = [
      ['SANTO DOMINGO', 'MADRID'], ['SAN JOSÉ', 'DÜSSELDORF'], ['MEXICO CITY', 'ARNHEM'],
      ['SANTIAGO', 'LONDON'], ['LIMA', 'MARSEILLE'], ['MEDELLÍN', 'PARIS'],
      ['BUENOS AIRES', 'STOCKHOLM'], ['SÃO PAULO', 'WARSAW'], ['SYDNEY', 'MILAN'],
      ['BARCELONA', 'BRUSSELS'], ['LISBON', ''],
    ];
    cities.forEach(([west, east], index) => {
      text(ctx, west, 133, 157 + index * 21, '900 22px sans-serif', '#e8bc38');
      text(ctx, east, 389, 157 + index * 21, '900 22px sans-serif', '#e8bc38');
    });

    ctx.save();
    ctx.translate(141, 426);
    ctx.scale(0.26, 0.26);
    ctx.strokeStyle = '#adbbad';
    chair(ctx, -75, 0, -0.14);
    chair(ctx, 70, 12, 0.15);
    ctx.restore();

    ctx.strokeStyle = '#467248';
    ctx.lineWidth = 4;
    for (let x = 80; x <= 430; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 461 + Math.sin(x) * 11);
      ctx.quadraticCurveTo(x + 6, 453, x + 18, 450 + Math.sin(x * 0.7) * 20);
      ctx.stroke();
    }
    ctx.fillStyle = '#c9964d';
    ctx.beginPath();
    ctx.roundRect(365, 405, 25, 47, 7);
    ctx.fill();
    ctx.fillStyle = '#7ba159';
    ctx.beginPath();
    ctx.ellipse(377, 396, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function clover(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.fillStyle = color;
  for (const angle of [-0.66, 0, 0.66]) {
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -19, 11, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillRect(-22, 7, 44, 3);
  ctx.fillRect(-18, 13, 36, 3);
  ctx.restore();
}

function globe(ctx, x, y, radius, color, openTop = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(3, radius * 0.021);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.clip();
  for (const width of [0.31, 0.62, 0.93]) {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * width, radius, 0, 0, openTop ? Math.PI : Math.PI * 2);
    ctx.stroke();
  }
  for (const y of openTop ? [0, 0.28, 0.54, 0.77] : [-0.53, 0, 0.54]) {
    ctx.beginPath();
    ctx.moveTo(-radius, y * radius);
    ctx.lineTo(radius, y * radius);
    ctx.stroke();
  }
  ctx.restore();
}

function teeBack() {
  return ink((ctx) => {
    const blue = '#428eb4';
    text(ctx, 'MeDe', 256, 285, '900 112px sans-serif', '#d44f43', 379);
    text(ctx, 'LLíN', 255, 385, '900 136px sans-serif', '#d44f43', 379);
    globe(ctx, 256, 247, 177, blue, true);
    text(ctx, 'DE PUERTO RICO', 254, 165, '600 31px sans-serif', blue);
    text(ctx, 'PARA', 256, 205, '600 29px sans-serif', blue);
    text(ctx, '✶   EL MUNDO   ✶', 256, 241, '600 31px sans-serif', blue);
  });
}

function teeFront() {
  return ink((ctx) => {
    clover(ctx, 256, 119, 2.2, '#1988ac');
    globe(ctx, 256, 320, 72, '#1988ac');
  });
}

function washedFront() {
  return ink((ctx) => text(ctx, 'DTmF', 256, 311, '900 153px sans-serif', '#f6f2eb', 432));
}

function washedBack() {
  return ink((ctx) => {
    const red = '#d44942';
    const blue = '#5e9cbc';
    text(ctx, 'BAD', 123, 89, '900 87px sans-serif', red);
    text(ctx, 'BUNNY', 151, 151, '900 80px sans-serif', red, 290);
    ['DeBÍ', 'TiRAR', 'MáS', 'FOToS'].forEach((line, index) => {
      text(ctx, line, 404, 65 + index * 37, '900 42px sans-serif', blue);
    });
    const tracks = ['NUEVAYoL', 'VOY A LLeVARTE PA PR', 'BAILE INoLVIDABLE', 'PERFuMITO NUEVO',
      'WELTiTA', 'VeLDÁ', 'EL CLúB', 'KETU TeCRÉ', 'BOKeTE', 'KLOuFRENS', 'TURiSTA',
      'CAFé CON RON', 'PIToRRO DE COCO', 'LO QUE LE PASÓ A HAWAii', 'EoO', 'DtMF', 'LA MuDANZA'];
    ctx.textAlign = 'right';
    ctx.fillStyle = blue;
    ctx.font = '700 12px sans-serif';
    tracks.forEach((track, index) => ctx.fillText(track, 478, 187 + index * 14, 240));

    globe(ctx, 92, 251, 34, '#e6e5db');
    ctx.fillStyle = '#b7b85c';
    ctx.beginPath();
    ctx.ellipse(214, 237, 39, 48, -0.17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#557b55';
    ctx.beginPath();
    ctx.ellipse(212, 230, 15, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(207, 244, 11, 19);
    text(ctx, 'sexto álbum', 104, 314, 'italic bold 25px Georgia, serif', '#e5e4db');
    text(ctx, 'de estudio', 104, 338, 'italic bold 25px Georgia, serif', '#e5e4db');
    for (let index = 0; index < 30; index++) {
      ctx.fillRect(50 + index * 3.8, 362, 1 + (index * 7 % 4), 49 - index % 3);
    }
    text(ctx, 'Rimas', 431, 461, 'italic bold 34px Georgia, serif', '#e8e6dc');
  });
}

export function makeWashedFabric() {
  function grain(x, y, cells) {
    function cell(column, row) {
      let hash = Math.imul(column % cells + 17, 0x45d9f3b) ^ Math.imul(row % cells + 71, 0x27d4eb2d);
      hash = Math.imul(hash ^ (hash >>> 16), 0x7feb352d);
      hash = Math.imul(hash ^ (hash >>> 15), 0x846ca68b);
      return ((hash ^ (hash >>> 16)) >>> 0) / 4294967295;
    }
    const column = Math.floor(x * cells);
    const row = Math.floor(y * cells);
    const dx = x * cells - column;
    const dy = y * cells - row;
    const u = dx * dx * (3 - 2 * dx);
    const v = dy * dy * (3 - 2 * dy);
    const north = cell(column, row) * (1 - u) + cell(column + 1, row) * u;
    const south = cell(column, row + 1) * (1 - u) + cell(column + 1, row + 1) * u;
    return north * (1 - v) + south * v;
  }

  return ink((ctx) => {
    const pixels = ctx.createImageData(256, 256);
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const px = x / 256;
        const py = y / 256;
        const warpedX = px + (grain(px, py, 8) - 0.5) * 0.11;
        const warpedY = py + (grain(py, px, 11) - 0.5) * 0.10;
        const tone = 77 + grain(warpedX, warpedY, 11) * 42 + grain(warpedX, warpedY, 26) * 57
          + grain(px, py, 58) * 38 + grain(px, py, 119) * 37;
        pixels.data.set([tone, tone, tone, 255], (y * 256 + x) * 4);
      }
    }
    ctx.putImageData(pixels, 0, 0);
  }, 256, 256);
}

export function makeGarmentArt(kind) {
  if (kind === 'hoodie') return { front: hoodFront(), back: hoodBack() };
  if (kind === 'tee') return { front: teeFront(), back: teeBack() };
  return { front: washedFront(), back: washedBack() };
}