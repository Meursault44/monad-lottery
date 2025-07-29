import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Tour } from 'antd';
import type { TourProps } from 'antd';
import { useState, useRef, forwardRef } from 'react';
import { useStore } from '../store/store.ts';
import { MON_LOTTERY_ABI } from '../MonLotteryABI.ts';
import { MON_LOTTERY_ADDRESS } from '../wagmi.ts';
import { useWriteContract } from 'wagmi';

export const Header = forwardRef((_, ref) => {
  const setIsOpenModalSendMon = useStore((state) => state.setIsOpenModalSendMon);
  const [isOpenTour, setIsOpenTour] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const { writeContract } = useWriteContract();

  const steps: TourProps['steps'] = [
    {
      title: '',
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial1-1.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial1-2.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      target: () => ref1.current,
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial2.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      target: () => ref2.current,
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial3-1.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      target: () => ref2.current,
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial3-2.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      target: () => ref3.current,
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial4.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial5.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      target: () => ref?.current,
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial6.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial7.webp" />,
      style: { width: 700 },
    },
    {
      title: '',
      cover: <img alt="tour.webp" src="/Tutorial/Tutorial8.webp" />,
      style: { width: 700 },
    },
  ];

  return (
    <div
      className={
        'flex justify-between w-[100%] absolute top-0 z-1 py-[12px] px-[8px] bg-[url(/header.webp)] bg-cover bg-center'
      }
    >
      <div className={'flex items-center gap-[12px]'}>
        <Button ref={ref1} className={'font-bold'} onClick={() => setIsOpenModalSendMon(true)}>
          Add mon to pool
        </Button>
        <Button
          ref={ref2}
          onClick={() => {
            writeContract({
              abi: MON_LOTTERY_ABI,
              address: MON_LOTTERY_ADDRESS,
              functionName: 'pickWinner',
              args: [],
            });
          }}
        >
          Get Winner
        </Button>
        <Button ref={ref3} onClick={() => setIsOpenTour(true)}>
          Tutorial
        </Button>
      </div>
      <ConnectButton />
      <Tour
        open={isOpenTour}
        onClose={() => setIsOpenTour(false)}
        steps={steps}
        nextButton={<Button>dfdf</Button>}
      />
    </div>
  );
});
