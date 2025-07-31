import { usePlane } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import { type FC } from 'react';
import * as THREE from 'three';
import { type Triplet } from '@commonTypes';

type PlaneType = {
  position: Triplet;
};

export const Plane: FC<PlaneType> = ({ position }) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position }));
  const texture = useLoader(THREE.TextureLoader, '/floor.webp');

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};
