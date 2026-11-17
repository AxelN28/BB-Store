import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { CanvasTexture, ImageLoader, SRGBColorSpace } from 'three';
import x100pre from '../assets/albums/x-100pre.jpg';
import oasis from '../assets/albums/oasis.jpg';
import yhlqmdlg from '../assets/albums/yhlqmdlg.jpg';
import lasQueNoIban from '../assets/albums/las-que-no-iban.jpg';
import elUltimoTour from '../assets/albums/el-ultimo-tour.jpg';
import unVeranoSinTi from '../assets/albums/un-verano-sin-ti.jpg';
import nadieSabe from '../assets/albums/nadie-sabe.jpg';
import debiTirarMasFotos from '../assets/albums/debi-tirar-mas-fotos.jpg';

const albums = [
  { year: 2018, lines: ['X 100PRE'], cover: x100pre },
  { year: 2019, lines: ['OASIS'], cover: oasis },
  { year: 2020, lines: ['YHLQMDLG'], cover: yhlqmdlg },
  { year: 2020, lines: ['LAS QUE NO', 'IBAN A SALIR'], cover: lasQueNoIban },
  { year: 2020, lines: ['EL ULTIMO TOUR', 'DEL MUNDO'], cover: elUltimoTour },
  { year: 2022, lines: ['Un Verano Sin Ti'], cover: unVeranoSinTi },
  { year: 2023, lines: ['nadie sabe lo que', 'va a pasar manana'], cover: nadieSabe },
  { year: 2025, lines: ['DeBI TiRAR MaS FOToS'], cover: debiTirarMasFotos },
];

const coverUrls = albums.map(({ cover }) => cover);
const printWidth = 1;
const printHeight = printWidth * 394 / 320;

function printAlbum({ year, lines }, cover) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 394;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(cover, 0, 0, 320, 320);
  ctx.fillStyle = '#141310';
  ctx.fillRect(0, 320, 320, 74);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f4ead9';
  ctx.font = '800 23px sans-serif';
  lines.forEach((line, index) => {
    ctx.fillText(line, 160, (lines.length === 1 ? 349 : 342) + index * 22, 300);
  });
  ctx.font = '700 19px sans-serif';
  ctx.fillStyle = '#cfab7c';
  ctx.fillText(String(year), 160, 386);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function AlbumWall() {
  const covers = useLoader(ImageLoader, coverUrls);
  const prints = useMemo(() => albums.map((album, index) => printAlbum(album, covers[index])), [covers]);
  useEffect(() => () => prints.forEach((print) => print.dispose()), [prints]);

  return (
    <group position={[0, 0, -5.93]}>
      {albums.map(({ lines }, index) => (
        <group key={lines[0]} position={[(index % 4 - 1.5) * 1.42, 3.55 - Math.floor(index / 4) * 1.36, 0]}>
          <mesh>
            <boxGeometry args={[printWidth + 0.08, printHeight + 0.08, 0.10]} />
            <meshStandardMaterial color="#593e2b" roughness={0.79} />
          </mesh>
          <mesh position-z={0.055}>
            <planeGeometry args={[printWidth, printHeight]} />
            <meshBasicMaterial map={prints[index]} toneMapped={false} fog={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
