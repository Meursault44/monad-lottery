import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useEffect, useState, useRef, Suspense } from 'react';
import { useStateTogether, useNicknames, Chat } from 'react-together';
import { useReadContract, useReadContracts, useWatchContractEvent, useAccount } from 'wagmi';
import { TextDetails } from '@src/components/3DText/TextDetails.tsx';
import { MON_LOTTERY_ABI } from './MonLotteryABI';
import { MON_LOTTERY_ADDRESS } from './wagmi.ts';
import { formatEther } from 'viem';
import { useFunctionTogether } from 'react-together';
import {
  Plane,
  Box,
  Header,
  Fireworks,
  ModalForDetails,
  ModalForSendingMon,
  TotalAmount,
  Wheel,
  CubeWithImages,
} from '@src/components';
import { type ParticipantDataType, type ValuesType } from '@commonTypes';

type dataDepositsType = {
  result: bigint[];
  status: string;
}[];

type winnerPickedType = {
  args: {
    winner: string;
    amount: bigint;
  };
}[];

const App = () => {
  const [participantData, setParticipantData] = useStateTogether<ParticipantDataType>(
    'participantData',
    null
  );

  const totalPrice = useMemo(() => {
    if (!participantData) return 0;
    return Object.keys(participantData).reduce(
      (acc, curr) => Number((acc + participantData[curr].totalValue).toFixed(2)),
      0
    );
  }, [participantData]);

  const [, setNickname] = useNicknames();
  const { address } = useAccount();
  const chatRef = useRef(null);

  const [textWinner, setTextWinner] = useState<null | string>(null);
  const [winnerAddress, setWinnerAddress] = useState<null | string>(null);

  const {
    data: Participants,
    refetch: refetchParticipants,
    isLoading: isLoadingParticipants,
  } = useReadContract({
    address: MON_LOTTERY_ADDRESS,
    abi: MON_LOTTERY_ABI,
    functionName: 'getParticipants',
    args: [],
  });

  const typedParticipants = Participants as string[] | undefined;

  const {
    data: dataDeposits,
    refetch: refetchDeposits,
    isLoading: isLoadingDeposits,
  } = useReadContracts({
    // @ts-expect-error difficult type
    contracts: typedParticipants
      ? typedParticipants.map((address) => ({
          address: MON_LOTTERY_ADDRESS,
          abi: MON_LOTTERY_ABI,
          functionName: 'getUserDeposits',
          args: [address],
        }))
      : [],
  });

  const typedDataDeposits = dataDeposits as dataDepositsType | undefined;

  const refetchAsync = async () => {
    await refetchParticipants();
    refetchDeposits();
  };

  const handlerWinnerPickedEvent = useFunctionTogether(
    'handlerWinnerPickedEvent',
    (logs: winnerPickedType) => {
      refetchAsync();
      setTimeout(() => {
        setTextWinner(
          logs[0].args?.winner.slice(0, 6) +
            '...' +
            logs[0].args?.winner.slice(-4) +
            ' Won  ' +
            formatEther(logs[0].args?.amount) +
            ' Mon'
        );
        setWinnerAddress(null);
      }, 6100);
      setWinnerAddress(logs[0].args?.winner);
      setTimeout(() => {
        setTextWinner(null);
      }, 16000);
    }
  );

  useWatchContractEvent({
    address: MON_LOTTERY_ADDRESS,
    abi: MON_LOTTERY_ABI,
    eventName: 'Deposited',
    onLogs: () => {
      refetchAsync();
    },
  });

  useWatchContractEvent({
    address: MON_LOTTERY_ADDRESS,
    abi: MON_LOTTERY_ABI,
    eventName: 'WinnerPicked',
    onLogs: (logs) => {
      // @ts-expect-error difficult type
      handlerWinnerPickedEvent(logs);
    },
    onError(error) {
      console.log('Error!', error);
    },
  });

  useEffect(() => {
    if (
      typedParticipants &&
      Array.isArray(typedDataDeposits) &&
      typedParticipants.length === typedDataDeposits.length
    ) {
      setParticipantData((prev) => {
        const values: ParticipantDataType = {};
        typedParticipants.forEach((address, i) => {
          if (!typedDataDeposits[i].result?.length) return;
          values[address] = {
            values: typedDataDeposits[i].result.map((r) => formatEther(r) as ValuesType),
            totalValue: typedDataDeposits[i].result.reduce(
              (acc, curr) => Number((acc + Number(formatEther(curr))).toFixed(2)),
              0
            ),
            color:
              prev?.[address]?.color ??
              '#' + new THREE.Color(Math.random() * 0xffffff).getHexString(),
          };
        });
        return values;
      });
    } else if (
      !isLoadingParticipants &&
      !isLoadingDeposits &&
      !typedParticipants?.length &&
      !typedDataDeposits
    ) {
      setParticipantData({});
    }
  }, [typedDataDeposits, typedParticipants]);

  useEffect(() => {
    if (address) {
      const shortAddress = address.slice(0, 6) + '...' + address.slice(-4);
      setNickname(shortAddress);
    }
  }, [address, setNickname]);

  return (
    <div>
      <Header ref={chatRef} />
      <Canvas
        gl={{ alpha: true, stencil: true }}
        shadows
        dpr={[1, 2]}
        camera={{ position: [-1, 5, 5], fov: 45 }}
        style={{ height: '100vh' }}
      >
        <color attach="background" args={['lightblue']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[10, 10, 10]} castShadow shadow-mapSize={[2048, 2048]} />
        <Physics>
          <Plane position={[0, 0, 0]} />
          <Suspense fallback={null}>
            {participantData &&
              Object.keys(participantData).map((key) =>
                participantData[key]?.values?.map((item, idx) => (
                  <CubeWithImages key={`${key}-${idx}`} item={item || '0.05'} />
                ))
              )}
          </Suspense>
          <Box />
          {textWinner && <Fireworks text={textWinner} />}
          <Wheel
            participants={participantData}
            totalAmount={totalPrice}
            winnerAddress={winnerAddress}
            position={[-12, 5, 0]}
          />
        </Physics>
        <TotalAmount value={totalPrice} position={[-2, 10, -3.25]} />
        <TextDetails />
        <OrbitControls />
      </Canvas>
      <div ref={chatRef} className={'absolute bottom-0 right-0'}>
        <Chat rtKey="chat" />
      </div>
      <ModalForSendingMon />
      <ModalForDetails />
    </div>
  );
};

export default App;
