export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isOnline: boolean;
  chatTitleInfoIDs: string[];
  chatTitleInfos: ChatTitleInfo[];
}

export interface ChatTitleInfo {
  id?: string;
  name: string;
  icon?: string;
  isReadMsg?: boolean;
  isMite?: boolean;
  chatConnectId?: number;
  contents?: ChatDetail[];
  userIDs: string[];
  users: User[];
  chatDetails: ChatDetail[];
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
  chatInfoConnectId: number;
  ChatTitleInfo: ChatTitleInfo;
}

export enum contentType {
  string = 0,
  img = 1,
  emo = 2,
  file = 3,
  video = 4,
  muisc = 5,
}
