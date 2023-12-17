export interface ChatTitleInfo {
  id: number;
  name: string;
  contents: ChatDetial[];
  icon: string;
  isReadMsg: boolean;
  isMite: boolean;
  chatConnectId: number;
}

export interface ChatDetial {
  order: number;
  type: number;
  content: any;
  time: string;
  icon: string;
  isOwner: boolean;
  name: string;
  counter: number;
}

export enum contentType {
  string = 0,
  img = 1,
  emo = 2,
  file = 3,
  video = 4,
  muisc = 5,
}
