import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const defaultSegment = {
  label: 'Empty',
  value: 1,
  color: '#888',
  address: 'empty',
};

export function Wheel({ position = [0, 0, 0], participants, totalAmount, winnerAddress }) {
  const wheelRef = useRef<THREE.Group>(null);
  const arrowRef = useRef<THREE.Mesh>(null);
  const [participantsInner, setParticipantsInner] = useState({});
  console.log(participants);
  console.log(participantsInner);

  const radius = 4;

  const segments = useMemo(() => {
    if (!participantsInner || !Object.keys(participantsInner).length) return [];
    return Object.keys(participantsInner).map((key) => ({
      label: key.slice(0, 6) + '...' + key.slice(-4),
      value: totalAmount > 0 ? participantsInner[key].totalValue / totalAmount : 1 / Object.keys(participantsInner).length,
      color: participantsInner[key].color,
      address: key,
    }));
  }, [participantsInner, totalAmount]);

  const displaySegments = useMemo(() => {
    return segments.length > 0 ? segments : [defaultSegment];
  }, [segments])

  // Создание секторов
  const shapes = useMemo(() => {
    if (!displaySegments.length) return [];

    let startAngle = 0;
    const result = [];

    for (let i = 0; i < displaySegments.length; i++) {
      const seg = displaySegments[i];
      const angle = seg.value * Math.PI * 2;

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.arc(0, 0, radius, startAngle, startAngle + angle, false);
      shape.lineTo(0, 0);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.3,
        bevelEnabled: false,
      });

      const mesh = (
        <mesh key={i} geometry={geometry} rotation={[0, 0, Math.PI / 2]} position={[0, 0, -0.15]}>
          <meshStandardMaterial color={seg.color} />
        </mesh>
      );

      result.push(mesh);
      startAngle += angle;
    }

    return result;
  }, [displaySegments]);

  // Анимация вращения
  const rotateToWinner = () => {
    if (!wheelRef.current) return;

    let startAngle = 0;
    let winnerAngle = 0;

    for (const seg of displaySegments) {
      const angle = seg.value * Math.PI * 2;
      if (seg.address === winnerAddress) {
        winnerAngle = startAngle + angle / 2;
        break;
      }
      startAngle += angle;
    }

    const turns = 5;
    const finalAngle = 2 * Math.PI * turns + winnerAngle;
    const duration = 6000;

    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      const angle = eased * finalAngle;

      if (wheelRef.current) {
        wheelRef.current.rotation.z = -angle;
      }

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (participants && Object.keys(participants).length) {
      setParticipantsInner({ ...participants });
    }
  }, [participants]);

  useEffect(() => {
    if (winnerAddress) {
      rotateToWinner();
    }
  }, [winnerAddress]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (arrowRef.current) {
      arrowRef.current.rotation.y = t * 2;
      arrowRef.current.position.y = radius * 2 + 1.7 + Math.sin(t * 4) * 0.2;
    }
  });

  return (
    <>
      <group ref={wheelRef} position={position}>
        {shapes}
      </group>
      <mesh
        ref={arrowRef}
        position={[position[0], radius * 2 + 1.5, position[2]]}
        rotation={[Math.PI, 0, 0]}
      >
        <coneGeometry args={[0.3, 1, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}
