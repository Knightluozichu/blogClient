import { defineStore } from 'pinia';
import { User } from '@/api/ChatList';

// defineStore 第一个参数是id，必需且值唯一
export const useUserStore = defineStore('user', {
  //state返回一个函数，防止作用域污染
  state: () => {
    const userInfo: User = {
      id: '',
      email: '',
      name: '',
      password: '',
      isOnline: false,
      chatTitleInfoIDs: [],
      chatTitleInfos: [],
    };
    return {
      userInfo,
      token: {
        sessionId: '',
      },
    };
  },
  getters: {
    newName: (state) => state.userInfo.name + 'vip',
    newSessionId: (state) => state.token.sessionId + '',
  },
  actions: {
    //更新整个对象
    updateUserInfo(userInfo: User) {
      this.userInfo = userInfo;
    },
    //更新基础数据类型
    updateSessionId(sessionId: string) {
      this.token.sessionId = sessionId;
    },
  },
});
