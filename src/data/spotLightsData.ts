import { type Triplet } from '@commonTypes';

export type spotlightType = {
  position: Triplet;
  color: string;
  rotateZSpeed: number;
  rotateZ: number;
  rotateX: number;
};

export const spotLightsData: spotlightType[] = [
  {
    position: [-20, 20, -5],
    color: '#F7C815',
    rotateZSpeed: 1.95,
    rotateZ: 0.3,
    rotateX: -0.1,
  },
  {
    position: [-5, 20, -5],
    color: '#68904D',
    rotateZSpeed: 2.04,
    rotateZ: -0.3,
    rotateX: -0.1,
  },
  {
    position: [-20, 20, 5],
    color: '#2F70AF',
    rotateZSpeed: 1.65,
    rotateZ: 0.3,
    rotateX: 0.2,
  },
  {
    position: [-5, 20, 5],
    color: '#D4DBE2',
    rotateZSpeed: 1.75,
    rotateZ: -0.3,
    rotateX: 0.2,
  },
];
