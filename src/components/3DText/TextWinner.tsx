import { type FC } from 'react';
import { Text3D } from '@react-three/drei';

type TextWinnerType = {
  text: string;
};

export const TextWinner: FC<TextWinnerType> = ({ text }) => {
  return (
    <Text3D font="/fonts/Roboto_Regular.json" size={2} height={0.4} position={[-15, 15, -3.5]}>
      <meshStandardMaterial color="lightgreen" />
      {text}
    </Text3D>
  );
};
