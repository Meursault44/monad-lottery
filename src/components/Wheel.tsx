import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox, useCylinder, useHingeConstraint } from '@react-three/cannon';
import * as THREE from 'three';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const defaultSegment = {
  label: 'Empty',
  value: 1,
  color: '#888', // серый цвет
  address: 'empty',
};

export function Wheel({ position = [-10, 5, 0], participants, totalAmount, winnerAddress }) {
  const wheelRef = useRef<THREE.Group>(null);
  const anchorRef = useRef(null);
  const meshArrow = useRef<THREE.Mesh>(null);
  const [participantsInner, setParticipantsInner] = useState({});

  const segments = useMemo(() => {
    if (!Object.keys(participantsInner)) return [];
    return Object.keys(participantsInner).map((key) => ({
      label: key.slice(0, 6) + '...' + key.slice(-4),
      value: totalAmount ? participantsInner[key].totalValue / totalAmount : 1,
      color: participantsInner[key].color,
      address: key,
    }));
  }, [participantsInner]);

  const displaySegments = segments.length > 0 ? segments : [defaultSegment];

  const [, api] = useCylinder(
    () => ({
      mass: 5,
      args: [0.01, 4, 0.2, 64],
      position,
      angularDamping: 0.5,
      rotation: [0, 0, 0],
    }),
    wheelRef
  );

  useBox(
    () => ({
      type: 'Static',
      args: [0.1, 0.1, 0.1],
      position,
    }),
    anchorRef
  );

  useHingeConstraint(wheelRef, anchorRef, {
    pivotA: [0, 0, 0],
    axisA: [0, 0, 1],
    pivotB: [0, 0, 0],
    axisB: [0, 0, 1],
  });

  const rotateToWinner = () => {
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
      api.rotation.set(0, 0, -angle); // вот тут минус

      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const radius = 4;
  const shapes = [];
  let startAngle = 0;

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

    shapes.push(mesh);
    startAngle += angle;
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshArrow.current) {
      // Вращение по Y (или Z, если нужно)
      meshArrow.current.rotation.y = t * 2;

      // Плавное движение вверх-вниз по синусоиде
      meshArrow.current.position.y = radius * 2 + 1.7 + Math.sin(t * 4) * 0.2;
    }
  });

  useEffect(() => {
    if (winnerAddress) {
      rotateToWinner();
    }
  }, [winnerAddress]);

  useEffect(() => {
    if (Object.keys(participants).length) {
      setParticipantsInner({ ...participants });
    }
  }, [participants]);

  return (
    <>
      <group ref={wheelRef}>{shapes}</group>
      <mesh ref={meshArrow} position={[-10, radius * 2 + 1.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.3, 1, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}
