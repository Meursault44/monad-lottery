import { Text3D } from '@react-three/drei';
import { useStore } from '../../store/store.ts';

export const TextDetails = () => {
  const setIsOpenModalDetails = useStore((state) => state.setIsOpenModalDetails);

  return (
    <group position={[11.5, 10.5, -3.5]}>
      {/* Невидимый хитбокс */}
      <mesh onClick={() => setIsOpenModalDetails(true)} position={[2.1, 0.5, 0]}>
        <boxGeometry args={[5.5, 2, 0.5]} />
        <meshBasicMaterial transparent opacity={0.4} />
      </mesh>

      {/* Сам текст */}
      <Text3D font="/fonts/Roboto_Regular.json" size={1} height={0.2}>
        Details
      </Text3D>
    </group>
  );
};
