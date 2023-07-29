import create from "zustand";
import { EnumEntryType, useGlobalStoreInterface } from "./type";

const useGlobalStore = create<useGlobalStoreInterface>((set) => ({
  venderInfo: {},
  entryType: EnumEntryType.empty,
  receptSwitch: false,
  initialStep: {},
  setVenderInfo: (venderInfo) => set(() => ({ venderInfo })),
  setInitialStep: (initialStep) => set(() => ({ initialStep })),
  setReceptSwitch: (status) => set(() => ({ receptSwitch: status })),
  setEntryType: (entryType) => set(() => ({ entryType }))

}));
export default useGlobalStore;
