import { type FC } from 'react';
import { useBox } from '@react-three/cannon';
import { type Triplet } from '@commonTypes';

type WallType = {
  position: Triplet;
  rotation: Triplet;
};

const Wall: FC<WallType> = ({ position, rotation }) => {
  const [ref] = useBox(() => ({
    args: [0.5, 5, 9.5], // толщина, высота, длина
    position,
    rotation,
    type: 'Static',
  }));

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.5, 5, 9.5]} />
      <meshStandardMaterial
        color="lightgreen"
        transparent
        opacity={0.5}
        metalness={0.1}
        roughness={0}
      />
    </mesh>
  );
};

export const Box: FC = () => {
  return (
    <>
      <Wall position={[-5, 0.5, 0]} rotation={[0, 0, 0]} /> {/* левая стена */}
      <Wall position={[5, 0.5, 0]} rotation={[0, 0, 0]} /> {/* правая стена */}
      <Wall position={[0, 0.5, -5]} rotation={[0, Math.PI / 2, 0]} /> {/* задняя */}
      <Wall position={[0, 0.5, 5]} rotation={[0, Math.PI / 2, 0]} /> {/* передняя */}
    </>
  );
};
