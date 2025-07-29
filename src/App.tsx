import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { useFBX, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useEffect, useState, useRef } from 'react';
import { useStateTogether, useNicknames, Chat } from 'react-together';
import { useReadContract, useReadContracts, useWatchContractEvent, useAccount } from 'wagmi';
import { TextDetails } from './components/3DText/TextDetails.tsx';
import { MON_LOTTERY_ABI } from './MonLotteryABI';
import { MON_LOTTERY_ADDRESS } from './wagmi.ts';
import { formatEther } from 'viem';
import { useFunctionTogether } from 'react-together';
import {
  Figurine,
  Plane,
  Box,
  Header,
  Fireworks,
  ModalForDetails,
  ModalForSendingMon,
  TotalAmount,
  Wheel,
} from './components';

useFBX.preload('/Mouch.fbx');
useFBX.preload('/Moyaki.fbx');
useFBX.preload('/Molandak.fbx');
useFBX.preload('/Chog.fbx');
useFBX.preload('/Salmonad.fbx');

const App = () => {
  const fbx0 = useFBX('/Mouch.fbx');
  const fbx1 = useFBX('/Moyaki.fbx');
  const fbx2 = useFBX('/Molandak.fbx');
  const fbx3 = useFBX('/Chog.fbx');
  const fbx4 = useFBX('/Salmonad.fbx');

  const [participantData, setParticipantData] = useStateTogether('participantData', {});

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

  const getFbx = (val) => {
    return val === '0.05'
      ? fbx0
      : val === '0.1'
        ? fbx1
        : val === '0.5'
          ? fbx2
          : val === '1'
            ? fbx3
            : fbx4;
  };
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

  const [textWinner, setTextWinner] = useState<null | string>(null);
  const [winnerAddress, setWinnerAddress] = useState<null | string>(null);

  const {
    data,
    refetch: refetchDeposits,
    isLoading: isLoadingDeposits,
  } = useReadContracts({
    contracts: Array.isArray(Participants)
      ? Participants.map((address) => ({
          address: MON_LOTTERY_ADDRESS,
          abi: MON_LOTTERY_ABI,
          functionName: 'getUserDeposits',
          args: [address],
        }))
      : [],
  });

  const handlerDepositedEvent = useFunctionTogether('handlerDepositedEvent', () => {
    refetchParticipants();
    refetchDeposits();
  });

  const handlerWinnerPickedEvent = useFunctionTogether('handlerWinnerPickedEvent', (logs) => {
    refetchParticipants();
    refetchDeposits();
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
  });

  useWatchContractEvent({
    address: MON_LOTTERY_ADDRESS,
    abi: MON_LOTTERY_ABI,
    eventName: 'Deposited',
    onLogs: handlerDepositedEvent,
  });

  useWatchContractEvent({
    address: MON_LOTTERY_ADDRESS,
    abi: MON_LOTTERY_ABI,
    eventName: 'WinnerPicked',
    onLogs: handlerWinnerPickedEvent,
    onError(error) {
      console.log('Error!', error);
    },
  });

  useEffect(() => {
    if (Array.isArray(Participants) && Array.isArray(data) && Participants.length === data.length) {
      setParticipantData(() => {
        const values = {};
        Participants.forEach((address, i) => {
          if (!data[i].result?.length) return;
          values[address] = {
            values: data[i].result.map((r) => formatEther(r)),
            totalValue: data[i].result.reduce(
              (acc, curr) => Number((acc + Number(formatEther(curr))).toFixed(2)),
              0
            ),
            color:
              participantData?.[address]?.color ??
              '#' + new THREE.Color(Math.random() * 0xffffff).getHexString(),
          };
        });
        return values;
      });
    } else if (!isLoadingParticipants && !isLoadingDeposits && !Participants?.length && !data) {
      setParticipantData({});
    }
  }, [data, Participants]);

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
          {participantData &&
            Object.keys(participantData).map((key) =>
              participantData[key]?.values?.map((item, i) => (
                <Figurine fbx={getFbx(item)} key={i} />
              ))
            )}
          <Box />
          {textWinner && <Fireworks text={textWinner} />}
          <Wheel
            participants={participantData}
            totalAmount={totalPrice}
            winnerAddress={winnerAddress}
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
