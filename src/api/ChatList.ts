export interface ChatTitleInfo {
  id?: string;
  name: string;
  contents?: ChatDetail[];
  icon?: string;
  isReadMsg?: boolean;
  isMite?: boolean;
  chatConnectId?: number;
}

export interface ChatDetail {
  id: string;
  order: number;
  type: number;
  content: any;
  time: string;
  icon: string;
  isOwner: boolean;
  name: string;
  counter: number;
  chatTitleInfoId: string;
}

export enum contentType {
  string = 0,
  img = 1,
  emo = 2,
  file = 3,
  video = 4,
  muisc = 5,
}
