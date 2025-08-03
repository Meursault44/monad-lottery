import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Tour } from 'antd';
import { useState, useRef, forwardRef, type RefObject, type ForwardedRef } from 'react';
import { useStore } from '../store/store.ts';
import { MON_LOTTERY_ABI } from '../MonLotteryABI.ts';
import { MON_LOTTERY_ADDRESS } from '../wagmi.ts';
import { useWriteContract } from 'wagmi';
import { getTourSteps } from '../data/tourSteps.tsx';

export const Header = forwardRef((_, refChat: ForwardedRef<HTMLElement>) => {
  const setIsOpenModalSendMon = useStore((state) => state.setIsOpenModalSendMon);
  const [isOpenTour, setIsOpenTour] = useState(false);

  const refAddMonBtn = useRef<HTMLButtonElement>(null);
  const refPickWinnerBtn = useRef<HTMLButtonElement>(null);
  const refTutorialBtn = useRef<HTMLButtonElement>(null);

  const steps = getTourSteps(
    refAddMonBtn,
    refPickWinnerBtn,
    refTutorialBtn,
    refChat as RefObject<HTMLElement>
  );

  const { writeContract } = useWriteContract();

  return (
    <div
      className={
        'flex justify-between w-[100%] absolute top-0 z-1 py-[12px] px-[8px] bg-[url(/header.webp)] bg-cover bg-center'
      }
    >
      <div className={'flex items-center gap-[12px]'}>
        <Button
          ref={refAddMonBtn}
          className={'font-bold'}
          onClick={() => setIsOpenModalSendMon(true)}
        >
          Add mon to pool
        </Button>
        <Button
          ref={refPickWinnerBtn}
          onClick={() => {
            writeContract({
              abi: MON_LOTTERY_ABI,
              address: MON_LOTTERY_ADDRESS,
              functionName: 'pickWinner',
              args: [],
              gas: BigInt(200_000)
            });
          }}
        >
          Get Winner
        </Button>
        <Button ref={refTutorialBtn} onClick={() => setIsOpenTour(true)}>
          Tutorial
        </Button>
      </div>
      <ConnectButton />
      <Tour open={isOpenTour} onClose={() => setIsOpenTour(false)} steps={steps} />
    </div>
  );
});
