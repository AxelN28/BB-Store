import {
  CanvasTexture, DataTexture, LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, RGBAFormat,
} from 'three';

export function createSurfaceTextures() {
  let seed = 4125;
  function grain() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function texture(pattern, repeat) {
    const size = 96;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        const value = pattern(x, y);
        data.set([value, value, value, 255], index);
      }
    }
    const result = new DataTexture(data, size, size, RGBAFormat);
    result.wrapS = result.wrapT = RepeatWrapping;
    result.repeat.set(...repeat);
    result.generateMipmaps = true;
    result.minFilter = LinearMipmapLinearFilter;
    result.magFilter = LinearFilter;
    result.anisotropy = 4;
    result.needsUpdate = true;
    return result;
  }

  const mesh = texture((x, y) => {
    const xWave = Math.cos((x + 2 * (Math.floor(y / 4) % 2)) * Math.PI / 2);
    const yWave = Math.sin(y * Math.PI / 2);
    return 187 + 29 * (xWave * xWave + yWave * yWave) + grain() * 8;
  }, [7, 4]);
  const suede = texture((x, y) => 222 + 30 * grain() + 6 * Math.sin(x * 1.17 + y * 2.39), [5, 3]);
  const weave = texture((x, y) => 200 + 25 * Math.sin(x * Math.PI / 2) ** 2 + 20 * Math.sin(y * Math.PI / 2) ** 2 + grain() * 8, [5, 1]);

  return { mesh, suede, weave };
}

export function createCampusMark() {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 48;
  const context = canvas.getContext('2d');
  context.font = '700 29px sans-serif';
  context.fillStyle = '#fff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('CAMPUS', canvas.width / 2, canvas.height / 2, 144);
  const mark = new CanvasTexture(canvas);
  mark.anisotropy = 4;
  return mark;
}
