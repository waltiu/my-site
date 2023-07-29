type venderInfoType = Partial<{
  venderId: string;
  venderName: string;
  venderType: string;
  contactPhone:string
}>;
export enum EnumEntryType {
  empty="",
  owl="owl"

}
export interface useGlobalStoreInterface {
  venderInfo: venderInfoType;
  initialStep:initialStepType,
  receptSwitch:boolean
  entryType:EnumEntryType,
  setVenderInfo: (data: venderInfoType) => void;
  setInitialStep: (data: initialStepType) => void;
  setReceptSwitch: (data: boolean) => void;
  setEntryType: (data: EnumEntryType) => void;


}


export type initialStepType=Partial<{
  step:string,
  welcomeSpeech:string,
  robotWorkStartTime:string,
  robotWorkEndTime:string,
  isCertificationAiTrainer:boolean
}>
