import { useRef } from 'react';
import { type FC } from 'react';
import { easing } from 'maath';
import { useFrame } from '@react-three/fiber';
import { Text3D, Mask, useMask } from '@react-three/drei';
import { type Triplet } from '@commonTypes';
import * as THREE from 'three';

type TextTotalAmountType = {
  value: number;
  currency?: string;
  position: Triplet;
};

type CounterType = {
  index: number;
  value: number | string;
  speed: number;
};

export const TotalAmount: FC<TextTotalAmountType> = ({ value, currency = 'Mon', position }) => (
  <group position={position}>
    {[...`✨✨✨✨${value}`.slice(-5)].map((num, index) => (
      <Counter
        index={index}
        value={num === '✨' ? -1 : num}
        key={index}
        speed={0.1 * (4 - index)}
      />
    ))}
    <Text3D font="/fonts/Roboto_Regular.json" size={1} height={0.2} position={[5.2 * 1.5, 0, 0]}>
      {currency}
    </Text3D>
    <Mask id={1} position={[0, 1, 0]}>
      <boxGeometry args={[15, 1.9, 1]} />
      <meshBasicMaterial />
    </Mask>
    <mesh position={[5, 1 + 1.2, 0]}>
      <boxGeometry args={[15, 0.5, 1]} />
      <meshStandardMaterial color="black" />
    </mesh>
    <mesh position={[5, 1 - 1.3, 0]}>
      <boxGeometry args={[15, 0.5, 1]} />
      <meshStandardMaterial color="black" />
    </mesh>
  </group>
);

const Counter: FC<CounterType> = ({ index, value, speed = 0.1 }) => {
  const ref = useRef<THREE.Group>(null);
  const stencil = useMask(1);

  useFrame((_, delta) => {
    if (value === '.' || !ref.current) return;
    easing.damp(ref.current.position, 'y', Number(value) * -2, speed, delta);
  });

  if (value === '.')
    return (
      <Text3D
        font="/fonts/Roboto_Regular.json"
        size={4}
        height={0.4}
        position={[index * 1.5 + 0.2, 0, 0]}
      >
        .
        <meshBasicMaterial {...stencil} />
      </Text3D>
    );

  return (
    <group position-x={index * 1.5} ref={ref}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Text3D
          key={number}
          font="/fonts/Roboto_Regular.json"
          size={2}
          height={0.4}
          position={[0, number * 2, 0]}
        >
          {number}
          <meshBasicMaterial {...stencil} />
        </Text3D>
      ))}
    </group>
  );
};
