import { useMemo, useRef, useEffect, useState, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import { type ParticipantDataType } from '@commonTypes';
import * as THREE from 'three';


type WheelType = {
  position: [number, number, number];
  participants: ParticipantDataType;
  totalAmount?: number;
  winnerAddress: string | null;
};

type segmentsType = { address: string; value: number; color: string }[]

const radius = 4;
const depth = 0.3;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export const Wheel: FC<WheelType> = ({ position, participants, totalAmount, winnerAddress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [segments, setSegments] = useState<segmentsType>([{ address: 'empty', value: 1, color: '#888' }]);
  const meshArrow = useRef<THREE.Mesh>(null);

  // Обновляем сегменты, если participants есть и не пустой
  useEffect(() => {
    if (participants && Object.keys(participants).length > 0) {
      const total = totalAmount ?? Object.values(participants).reduce((a, p) => a + p.totalValue, 0);
      const newSegments = Object.entries(participants).map(([address, p]) => ({
        address,
        value: total ? p.totalValue / total : 1,
        color: p.color,
      }));
      setSegments(newSegments);
    }
    // Если participants null или пустой — не меняем сегменты
  }, [participants, totalAmount]);

  // Анимация вращения
  const animRef = useRef<{
    startTime: number | null;
    duration: number;
    finalAngle: number;
    running: boolean;
  }>({ startTime: null, duration: 6000, finalAngle: 0, running: false });

  // Запуск анимации вращения к победителю
  useEffect(() => {
    if (!winnerAddress) {
      animRef.current.running = false;
      animRef.current.startTime = null;
      return;
    }

    let startAngle = 0;
    let winnerAngle = 0;
    for (const seg of segments) {
      const angle = seg.value * Math.PI * 2;
      if (seg.address === winnerAddress) {
        winnerAngle = startAngle + angle / 2;
        break;
      }
      startAngle += angle;
    }

    const turns = 5; // количество оборотов перед остановкой
    animRef.current.finalAngle = 2 * Math.PI * turns + winnerAngle;
    animRef.current.duration = 6000;
    animRef.current.startTime = null;
    animRef.current.running = true;
  }, [winnerAddress, segments]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshArrow.current) {
      // Вращение по Y (или Z, если нужно)
      meshArrow.current.rotation.y = t * 2;

      // Плавное движение вверх-вниз по синусоиде
      meshArrow.current.position.y = radius * 2 + 1.7 + Math.sin(t * 4) * 0.2;
    }
    if (!groupRef.current) return;

    if (animRef.current.running) {
      if (animRef.current.startTime === null) animRef.current.startTime = clock.elapsedTime * 1000;

      const elapsed = clock.elapsedTime * 1000 - animRef.current.startTime;
      const t = Math.min(elapsed / animRef.current.duration, 1);
      const eased = easeOutCubic(t);
      const angle = eased * animRef.current.finalAngle;

      groupRef.current.rotation.z = -angle;

      if (t >= 1) {
        animRef.current.running = false;
      }
    } else {
      // Без победителя — стоит на месте
      // Можно поставить rotation.z = 0 или оставить как есть
      // Вот так:
      groupRef.current.rotation.z = groupRef.current.rotation.z; // не вращаем
    }
  });

  // Рендер сегментов с глубиной
  const meshes = useMemo(() => {
    let startAngle = 0;
    return segments.map((seg, i) => {
      const angle = seg.value * Math.PI * 2;

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.arc(0, 0, radius, startAngle, startAngle + angle, false);
      shape.lineTo(0, 0);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
      });

      startAngle += angle;

      return (
          <mesh
              key={i}
              geometry={geometry}
              rotation={[0, 0, 0]} // плоскость XY
              position={[0, 0, -depth / 2]}
          >
            <meshStandardMaterial
                color={seg.color}
                polygonOffset
                polygonOffsetFactor={1}
                polygonOffsetUnits={1}
                side={THREE.DoubleSide}
            />
          </mesh>
      );
    });
  }, [segments]);

  return (
      <>
      <group ref={groupRef} position={position} rotation={[0, 0, 0]}>
        {meshes}
      </group>
        <mesh ref={meshArrow} position={position} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.3, 1, 16]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </>
  );
};