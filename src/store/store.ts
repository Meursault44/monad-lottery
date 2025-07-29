import { create } from 'zustand';

interface State {
  isOpenModalSendMon: boolean;
  setIsOpenModalSendMon: (val: boolean) => void;
  isOpenModalDetails: boolean;
  setIsOpenModalDetails: (val: boolean) => void;
}

export const useStore = create<State>()((set) => ({
  isOpenModalSendMon: false,
  isOpenModalDetails: false,
  setIsOpenModalDetails: (value: boolean) => set({ isOpenModalDetails: value }),
  setIsOpenModalSendMon: (value: boolean) => set({ isOpenModalSendMon: value }),
}));
