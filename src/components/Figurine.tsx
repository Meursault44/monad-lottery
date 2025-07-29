import { useBox } from '@react-three/cannon';

export const Figurine = ({ fbx, ...rest }) => {
  const [ref] = useBox(() => ({
    mass: 0.5,
    position: [Math.random() * 8 - 4, Math.random() * 6 + 3, Math.random() * 8 - 4],
    rotation: [
      Math.random() * Math.PI * 2, // x: от 0 до 2π
      Math.random() * Math.PI * 2, // y: от 0 до 2π
      Math.random() * Math.PI * 2,
    ],
    ...rest,
  }));

  return (
    <group ref={ref} dispose={null} scale={0.005}>
      <primitive object={fbx.clone()} />
    </group>
  );
};
