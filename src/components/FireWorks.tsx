import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextWinner } from './3DText/TextWinner.tsx';

const MAX_PARTICLES = 500;
const PARTICLES_PER_EXPLOSION = 100;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Fireworks = ({ text = 'Winner', tempColor = new THREE.Color() }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const colors = useMemo(
    () =>
      new Array(MAX_PARTICLES)
        .fill(0)
        .map(() => '#' + new THREE.Color(Math.random() * 0xffffff).getHexString()),
    []
  );

  const colorArray = useMemo(() => {
    const arr = new Float32Array(3 * MAX_PARTICLES);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      tempColor.set(colors[i]).toArray(arr, i * 3);
    }
    return arr;
  }, [colors, tempColor]);

  // Заменено useState на useRef
  const velocities = useRef(Array.from({ length: MAX_PARTICLES }, () => new THREE.Vector3()));
  const positions = useRef(
    Array.from({ length: MAX_PARTICLES }, () => new THREE.Vector3(0, -10, 0))
  );
  const lifetimes = useRef(Array(MAX_PARTICLES).fill(0));

  const launchFireworkAt = (pos: THREE.Vector3) => {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (lifetimes.current[i] <= 0) {
        for (let j = 0; j < PARTICLES_PER_EXPLOSION && i + j < MAX_PARTICLES; j++) {
          const index = i + j;
          lifetimes.current[index] = 1.0;
          positions.current[index].copy(pos);
          velocities.current[index].set(
            Math.random() * 0.15 - 0.05,
            Math.random() * 0.24 - 0.05,
            Math.random() * 0.15 - 0.05
          );
        }
        break;
      }
    }
  };

  const startFireWorks = async () => {
    for (let i = 0; i < 10; i++) {
      await launchFireworkAt(
        new THREE.Vector3(Math.random() * 35 - 15, Math.random() * 13 + 8, Math.random() * 4 - 4)
      );
      await delay(1000);
    }
  };

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const id = i;
      if (lifetimes.current[i] > 0) {
        positions.current[i].add(velocities.current[i]);
        velocities.current[i].y -= 0.005;
        lifetimes.current[i] -= 0.015;

        dummy.position.copy(positions.current[i]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);

        tempColor.set(colors[id]);
        tempColor.toArray(colorArray, id * 3);
        meshRef.current.geometry.attributes.color.needsUpdate = true;
      } else {
        dummy.position.set(0, -10, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  useEffect(() => {
    startFireWorks();
  }, []);

  return (
    <>
      <TextWinner text={text} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PARTICLES]}>
        <sphereGeometry args={[0.15, 8, 8]}>
          <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
        </sphereGeometry>
        <meshBasicMaterial vertexColors />
      </instancedMesh>
    </>
  );
};
