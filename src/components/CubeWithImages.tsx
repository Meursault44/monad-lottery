import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { type FC, useMemo } from 'react';
import { useBox } from '@react-three/cannon';
import { type Triplet, type ValuesType } from '@commonTypes';

const imagesMap: Record<ValuesType, string> = {
  '0.05': '/Mouch.webp',
  '0.1': '/Moyaki.webp',
  '0.5': '/Molandak.webp',
  '1': '/Chog.webp',
  '5': '/Salmonad.webp',
};

type CubeWithImagesType = {
  position?: Triplet;
  item?: ValuesType;
};

export const CubeWithImages: FC<CubeWithImagesType> = ({
  position = [Math.random() * 6 - 3, Math.random() * 2 + 4, Math.random() * 6 - 3],
  item = '0.05',
}) => {
  const textures = useLoader(THREE.TextureLoader, [
    imagesMap[item],
    imagesMap[item],
    imagesMap[item],
    imagesMap[item],
    imagesMap[item],
    imagesMap[item],
  ]);

  const materials = useMemo(
    () => textures.map((texture) => new THREE.MeshStandardMaterial({ map: texture })),
    [textures]
  );

  // Физическое тело
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 1, 1], // размер куба
  }));

  return (
    <mesh ref={ref} material={materials} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};
