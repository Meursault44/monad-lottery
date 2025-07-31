import React, { useMemo } from 'react';
import { Modal, List } from 'antd';
import { useStore } from '../store/store.ts';
import { useStateTogether } from 'react-together';
import { type ParticipantDataType } from '@commonTypes';

export const ModalForDetails: React.FC = () => {
  const isOpenModalDetails = useStore((state) => state.isOpenModalDetails);
  const setIsOpenModalDetails = useStore((state) => state.setIsOpenModalDetails);
  const [participants] = useStateTogether<ParticipantDataType>('participantData', {});

  const data = useMemo(() => {
    if (!participants) return [];
    return Object.keys(participants).map((key) => ({ ...participants[key], key }));
  }, [participants]);

  return (
    <Modal
      open={isOpenModalDetails}
      title="Details"
      onCancel={() => setIsOpenModalDetails(false)}
      footer={null}
    >
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<div className={`w-12 h-12`} style={{ backgroundColor: item.color }}></div>}
              title={<div>{item.totalValue} Mon</div>}
              description={<div>{item.key}</div>}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};
