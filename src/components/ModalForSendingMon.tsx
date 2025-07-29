import React, { useState } from 'react';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { Modal, Button, Typography, Radio } from 'antd';
import { useStore } from '../store/store.ts';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { MON_LOTTERY_ABI } from '../MonLotteryABI';
import { MON_LOTTERY_ADDRESS } from '../wagmi.ts';

const { Text } = Typography;

const options: CheckboxGroupProps<string>['options'] = [
  { label: '0.05 Mon', value: 'Mouch' },
  { label: '0.1 Mon', value: 'Moyaki' },
  { label: '0.5 Mon', value: 'Molandak' },
  { label: '1 Mon', value: 'Chog' },
  { label: '5 Mon', value: 'Salmonad' },
];

type CharactersType = 'Mouch' | 'Moyaki' | 'Molandak' | 'Chog' | 'Salmonad';

const map: Record<CharactersType, number> = {
  Mouch: 0.05,
  Moyaki: 0.1,
  Molandak: 0.5,
  Chog: 1,
  Salmonad: 5,
};

export const ModalForSendingMon: React.FC = () => {
  const [value, setValue] = useState<{ character: CharactersType; value: number }>({
    character: 'Mouch',
    value: 0.05,
  });
  const isOpenModalSendMon = useStore((state) => state.isOpenModalSendMon);
  const setIsOpenModalSendMon = useStore((state) => state.setIsOpenModalSendMon);

  const { writeContract } = useWriteContract();

  return (
    <Modal
      open={isOpenModalSendMon}
      title="adding mon to pool"
      onCancel={() => setIsOpenModalSendMon(false)}
      footer={null}
    >
      <Text>
        Select how many Mon you want to add to the pool. Depending on the number of Mon, the texture
        for the square will be selected
      </Text>
      <Radio.Group
        block
        options={options}
        defaultValue="Mouch"
        optionType="button"
        buttonStyle="solid"
        onChange={(e) => setValue({ character: e.target.value, value: map[e.target.value] })}
      />
      <img
        src={`/${value.character}.webp`}
        alt={'picture with Mouch'}
        className={'m-auto mt-5 mb-5 h-[400px]'}
      />
      <Button
        onClick={() => {
          writeContract({
            abi: MON_LOTTERY_ABI,
            address: MON_LOTTERY_ADDRESS,
            functionName: 'deposit',
            args: [],
            value: parseEther(String(value.value)), // 0.05 MON
          });
          setIsOpenModalSendMon(false);
        }}
      >
        Add {value.value} mon to pool
      </Button>
    </Modal>
  );
};
