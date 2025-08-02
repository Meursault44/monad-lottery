import { useFrame } from '@react-three/fiber';
import { useRef, type FC } from 'react';
import * as THREE from 'three';
import { spotLightsData, type spotlightType } from '@src/data/spotLightsData.ts';

const Spotlight: FC<spotlightType> = ({ position, color, rotateZ, rotateZSpeed, rotateX }) => {
  const ref = useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = Math.sin(t * rotateZSpeed) * 0.3 + rotateZ; // вращаем группу
      ref.current.rotation.x = Math.sin(t * 4) * 0.2 + rotateX; // вращаем группу
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Сдвигаем конус вниз по Y на половину высоты, чтобы вершина была в центре группы */}
      <mesh position={[0, -15, 0]}>
        <coneGeometry args={[5, 30, 32, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export function Spotlights() {
  return (
    <>
      {spotLightsData.map((spotlight, i) => (
        <Spotlight
          position={spotlight.position}
          color={spotlight.color}
          rotateZ={spotlight.rotateZ}
          rotateZSpeed={spotlight.rotateZSpeed}
          rotateX={spotlight.rotateX}
          key={`${spotlight.color}-${i}`}
        />
      ))}
    </>
  );
}
