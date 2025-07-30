import { Image, type TourProps } from 'antd';
import type { RefObject } from 'react';

export function getTourSteps(
  refAddMonBtn: RefObject<HTMLElement | null>,
  refPickWinnerBtn: RefObject<HTMLElement | null>,
  refTutorialBtn: RefObject<HTMLElement | null>,
  refChat: RefObject<HTMLElement | null>
): TourProps['steps'] {
  return [
    {
      title: '',
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial1-1.webp" />,
    },
    {
      title: '',
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial1-2.webp" />,
    },
    {
      title: '',
      target: refAddMonBtn.current,
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial2.webp" />,
    },
    {
      title: '',
      target: refPickWinnerBtn.current,
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial3-1.webp" />,
    },
    {
      title: '',
      target: refPickWinnerBtn.current,
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial3-2.webp" />,
    },
    {
      title: '',
      target: refTutorialBtn.current,
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial4.webp" />,
    },
    {
      title: '',
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial5.webp" />,
    },
    {
      title: '',
      target: refChat?.current,
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial6.webp" />,
    },
    {
      title: '',
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial7.webp" />,
    },
    {
      title: '',
      cover: <Image alt="tour.webp" src="/Tutorial/Tutorial8.webp" />,
    },
  ];
}
