<script setup lang="ts">
import { ref, watchEffect, onMounted, nextTick, onBeforeUnmount, onUnmounted } from 'vue';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import router from '@/router';
import HttpClient from '@/utils/axios';
import { ChatDetail, ChatTitleInfo } from '@/api/ChatList';
import { onClickOutside } from '@vueuse/core';
// import socket from '@/utils/socket';

const chatWindowId = ref<number | undefined>(-1); //默认-1
const user = useUserStore();
//检查是否登录，没有登录则跳转到登录页面，登录了就显示聊天页面
const { token, userInfo } = storeToRefs(user);
const isLogin = ref(false);
const chatList = ref<ChatTitleInfo[]>([]);
const chatInfo = ref<ChatTitleInfo>();
const sessionId = localStorage.getItem('sessionId');
const email = ref('');
const isDarkMode = ref(false);
const curMessage = ref('');
const showSearchUser = ref(false);
const addUserRef = ref<HTMLElement | null>(null);
const addSearchUser = ref('');
let stop: (() => void) | undefined;

const sendMessage = () => {
  if (!chatInfo.value) {
    return;
  }
  const order = chatInfo.value?.contents ? chatInfo.value?.contents?.length - 1 : 0;
  const chatTitleInfoId = chatInfo.value.id || '0';
  const userName = userInfo.value?.name || '';

  HttpClient.post('/chatDetail', {
    order: order,
    type: 0,
    content: curMessage.value,
    time: new Date().getUTCDate().toString(),
    icon: '',
    isOwner: true,
    name: userName,
    counter: 30,
    chatTitleInfoId: chatTitleInfoId,
  })
    .then((res) => {
      // console.log(res);
      if (res.status == 200 && chatInfo.value) {
        const mChatDetial: ChatDetail = res.data as ChatDetail;
        if (chatInfo.value?.contents) {
          chatInfo.value?.contents.push(mChatDetial);
        } else {
          chatInfo.value.contents = [mChatDetial];
        }
      }

      return;
    })
    .catch(() => {
      // console.log(err);
      return;
    });
};

if (!sessionId) {
  router.push('/login');
} else {
  // const res = await HttpClient.get("/login", { params: { sessionId: sessionId } });
  // if(res.status == 200)
  // {
  // sessionId 鉴别 todo...
  token.value.sessionId = sessionId;
  isLogin.value = true;
  // }
}

// socket.on('check.ChatTitleInfos', (msg: string) => {
//   console.log(msg);
// });

if (isLogin.value) {
  const name = localStorage.getItem('name');
  email.value = localStorage.getItem('email') || '';
  HttpClient.get(`/chatInfo?name=${name}`).then((res) => {
    // console.log(res);
    if (res.status === 200) {
      //把res.data用json解析成ChatList对象
      // res.data.forEach((element: any) => {
      //   socket.emit('check.ChatTitleInfos', { userIds: element.userIds, sessionId: sessionId });
      // });
      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i];
        const chatTitleInfo: ChatTitleInfo = item as ChatTitleInfo;
        chatList.value.push(chatTitleInfo);
      }
      // chatList.value = res.data;
      // console.log(chatList.value);
    } else {
      return;
    }
  });
}

function selectChat(chatId: number | undefined) {
  chatWindowId.value = chatId;
  const chat = chatList.value.find((chat) => chat.chatConnectId === chatId);
  if (chat) {
    chatInfo.value = chat;
    // console.log(chatInfo.value, chat);
  } else {
    chatInfo.value = undefined; //todo..找不到聊天信息
  }
}

//聊天框 滑竿默认底部
const contentRef = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  // console.log(contentRef.value);
  if (contentRef.value) {
    contentRef.value.addEventListener('scroll', handleScroll);
    contentRef.value.scrollTop = contentRef.value.scrollHeight;
    // console.log("滑竿到底", contentRef.value.scrollTop, contentRef.value.scrollHeight);
  }
};

const handleScroll = () => {
  // Check if the user has scrolled to the bottom
  if (contentRef.value) {
    const isAtBottom = contentRef.value.scrollTop + contentRef.value.clientHeight >= contentRef.value.scrollHeight;

    // Only scroll to the bottom automatically if the user is already at the bottom
    if (isAtBottom) {
      scrollToBottom();
    }
  }
};

onMounted(() => {
  nextTick(() => {
    setTimeout(scrollToBottom, 1000); // 增加延迟
  });
  // console.log(addUserRef.value);
  if (addUserRef.value) {
    stop = onClickOutside(addUserRef.value, closeOnOutsideClick);
  }
});

// Cleanup the scroll event listener when the component is unmounted
onBeforeUnmount(() => {
  if (contentRef.value) {
    contentRef.value.removeEventListener('scroll', handleScroll);
  }
});

//倒计时
const countDown = () => {
  setInterval(() => {
    if (!chatInfo.value || !chatInfo.value.contents) return;
    if (chatInfo.value && chatInfo.value.contents.length > 0) {
      chatInfo.value.contents.forEach((item) => {
        if (item.counter > 0) {
          item.counter--;
        }
      });
      //从数组中删除counter为0的元素
      // chatInfo.value.contents = chatInfo.value.contents.filter((item) => item.counter > 0);
      const detail: ChatDetail = chatInfo.value.contents.filter((item) => item.counter <= 0)[0];
      chatInfo.value.contents = chatInfo.value.contents.filter((item) => item.counter > 0);
      if (detail && detail.id) {
        // chatInfo.value.contents 移除 detail
        // console.log(detail.id);
        HttpClient.delete('/chatDetail', { params: { id: detail.id } })
          .then(() => {
            // console.log(res);
            return;
          })
          .catch(() => {
            // console.log(err);
            return;
          });
      }
    }
  }, 1000);
};

countDown();

const getDarkModel = () =>
  (isDarkMode.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

watchEffect(() => {
  getDarkModel();
});

const showChatListInfoTime = (item: ChatTitleInfo) => {
  if (!item.contents) return '';
  const len = item.contents.length;
  if (len > 0) {
    return item.contents[len - 1].time;
  } else {
    return '';
  }
};

const showChatListInfoContent = (item: ChatTitleInfo) => {
  if (!item.contents) return '';
  const len = item.contents.length;
  if (len > 0) {
    return item.contents[len - 1].content;
  } else {
    return '';
  }
};

const handleSearchUser = () => {
  // console.log('搜索用户');
  HttpClient.get('/search', { params: { name: addSearchUser.value, email: addSearchUser.value } })
    .then((res) => {
      // console.log(res);
      if (res.status === 200) {
        addChatTitleInfo();
        closeOnOutsideClick();
      } else {
        alert('没有找到该用户');
      }
    })
    .catch(() => {
      // console.log(err);
    });
};

const closeOnOutsideClick = () => {
  showSearchUser.value = false;
};

const addChatTitleInfo = () => {
  // console.log(addSearchUser.value, email.value);
  //遍历chatList.value

  HttpClient.post('/chatInfo', { name: addSearchUser.value, email: email.value })
    .then((res) => {
      // console.log(res);
      if (res.status === 200) {
        //把res.data用json解析成ChatList对象
        chatList.value.push(res.data);
        // console.log(chatList.value);
      } else {
        return;
      }
    })
    .catch(() => {
      // console.log(err);
    });
};

onUnmounted(() => {
  if (stop) {
    stop();
  }
});
</script>

<template>
  <div class="flex flex-col lg:hidden">
    <div class="flex flex-row sticky z-10 top-0 bg-white dark:bg-black w-full justify-between items-center px-4">
      <div class="flex justify-center items-center w-full text-xl text-black dark:text-white my-2 h-10">通信室</div>
      <div class="add-chat mt-2 w-6">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="1.464"></circle>
            <path
              d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
              stroke="#ffffff"
              stroke-width="1.464"
              stroke-linecap="round"
            ></path>
          </g>
        </svg>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="relative bg-white/80 dark:bg-black h-15 py-2 px-2">
      <label for="Search" class="sr-only"> Search </label>

      <input
        id="Search"
        type="text"
        placeholder="搜索..."
        class="w-full rounded-md dark:border-gray-200 border-gray-800 bg-gray-200 dark:bg-gray-600 py-2.5 px-2 pe-10 shadow-sm sm:text-sm text-black dark:text-white"
      />

      <span class="absolute inset-y-0 end-1 grid w-10 place-content-center">
        <button type="button" class="dark:text-white text-black">
          <span class="sr-only dark:text-white text-black">搜索</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </span>
    </div>
    <!-- 聊天列表 -->
    <div
      v-for="id in 20"
      :key="id"
      class="hover:bg-gray-900 hover:cursor-pointer flex flex-row bg-gray-200 dark:bg-gray-800 px-2 py-2 border-b border-gray-500/50"
    >
      <div class="flex justify-center items-center relative">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
              stroke="#ffffff"
              stroke-width="0.4800000000000001"
              stroke-linecap="round"
            ></path>
            <circle cx="12" cy="16" r="1" fill="#ffffff"></circle>
            <path
              d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
              stroke="#ffffff"
              stroke-width="0.4800000000000001"
              stroke-linecap="round"
            ></path>
          </g>
        </svg>
        <span
          class="top-0 left-7 absolute w-3.5 h-3.5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full"
        ></span>
      </div>
      <div class="flex flex-col px-2 w-full">
        <div class="flex flex-row justify-between">
          <div class="title text-md dark:text-white text-gray-400">用户名或群名</div>
          <div class="title text-xs dark:text-white/50 text-gray-400">星期三</div>
        </div>

        <div class="flex flex-row justify-between">
          <div class="last-msg text-sm dark:text-white/50 text-start text-gray-400">最后一条聊天的消息内容...</div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M3 3L21 21M9.37747 3.56325C10.1871 3.19604 11.0827 3 12 3C13.5913 3 15.1174 3.59 16.2426 4.6402C17.3679 5.69041 18 7.11479 18 8.6C18 10.3566 18.2892 11.7759 18.712 12.9122M17 17H15M6.45339 6.46451C6.15686 7.13542 6 7.86016 6 8.6C6 11.2862 5.3238 13.1835 4.52745 14.4866C3.75616 15.7486 3.37051 16.3797 3.38485 16.5436C3.40095 16.7277 3.43729 16.7925 3.58603 16.9023C3.71841 17 4.34762 17 5.60605 17H9M9 17V18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18V17M9 17H15"
                stroke="#ffffff"
                stroke-width="0.4800000000000001"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <!-- component -->
    <div class="w-full">
      <!-- <section id="bottom-navigation" class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow"> // if shown only tablet/mobile-->
      <section
        id="bottom-navigation"
        class="block fixed inset-x-0 bottom-0 z-10 dark:bg-gray-600 bg-gray-100 shadow h-16 py-1"
      >
        <div id="tabs" class="flex justify-between">
          <a
            href="#"
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 dark:text-white text-gray-400"
          >
            <div class="relative">
              <svg width="25" height="25" viewBox="0 0 42 42" class="inline-block mb-1">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path
                    d="M21.0847458,3.38674884 C17.8305085,7.08474576 17.8305085,10.7827427 21.0847458,14.4807396 C24.3389831,18.1787365 24.3389831,22.5701079 21.0847458,27.6548536 L21.0847458,42 L8.06779661,41.3066256 L6,38.5331279 L6,26.2681048 L6,17.2542373 L8.88135593,12.4006163 L21.0847458,2 L21.0847458,3.38674884 Z"
                    fill="currentColor"
                    fill-opacity="0.1"
                  ></path>
                  <path
                    d="M11,8 L33,8 L11,8 Z M39,17 L39,36 C39,39.3137085 36.3137085,42 33,42 L11,42 C7.6862915,42 5,39.3137085 5,36 L5,17 L7,17 L7,36 C7,38.209139 8.790861,40 11,40 L33,40 C35.209139,40 37,38.209139 37,36 L37,17 L39,17 Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M22,27 C25.3137085,27 28,29.6862915 28,33 L28,41 L16,41 L16,33 C16,29.6862915 18.6862915,27 22,27 Z"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="currentColor"
                    fill-opacity="0.1"
                  ></path>
                  <rect
                    fill="currentColor"
                    transform="translate(32.000000, 11.313708) scale(-1, 1) rotate(-45.000000) translate(-32.000000, -11.313708) "
                    x="17"
                    y="10.3137085"
                    width="30"
                    height="2"
                    rx="1"
                  ></rect>
                  <rect
                    fill="currentColor"
                    transform="translate(12.000000, 11.313708) rotate(-45.000000) translate(-12.000000, -11.313708) "
                    x="-3"
                    y="10.3137085"
                    width="30"
                    height="2"
                    rx="1"
                  ></rect>
                </g>
              </svg>
              <span class="-top-1 absolute w-2.5 h-2.5 bg-red-400 dark:border-gray-800 rounded-full"></span>
            </div>
            <span class="tab tab-home block text-xs">首页</span>
          </a>
          <a
            href="#"
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 dark:text-white text-gray-400"
          >
            <div class="relative">
              <svg width="25" height="25" viewBox="0 0 42 42" class="inline-block mb-1">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path
                    d="M14.7118754,20.0876892 L8.03575361,20.0876892 C5.82661462,20.0876892 4.03575361,18.2968282 4.03575361,16.0876892 L4.03575361,12.031922 C4.03575361,8.1480343 6.79157254,4.90780265 10.4544842,4.15995321 C8.87553278,8.5612583 8.1226025,14.3600511 10.9452499,15.5413938 C13.710306,16.6986332 14.5947501,18.3118357 14.7118754,20.0876892 Z M14.2420017,23.8186831 C13.515543,27.1052019 12.7414284,30.2811559 18.0438552,31.7330419 L18.0438552,33.4450645 C18.0438552,35.6542035 16.2529942,37.4450645 14.0438552,37.4450645 L9.90612103,37.4450645 C6.14196811,37.4450645 3.09051926,34.3936157 3.09051926,30.6294627 L3.09051926,27.813861 C3.09051926,25.604722 4.88138026,23.813861 7.09051926,23.813861 L14.0438552,23.813861 C14.1102948,23.813861 14.1763561,23.8154808 14.2420017,23.8186831 Z M20.7553776,32.160536 C23.9336213,32.1190063 23.9061943,29.4103976 33.8698747,31.1666916 C34.7935223,31.3295026 35.9925894,31.0627305 37.3154077,30.4407183 C37.09778,34.8980343 33.4149547,38.4450645 28.9036761,38.4450645 C24.9909035,38.4450645 21.701346,35.7767637 20.7553776,32.160536 Z"
                    fill="currentColor"
                    opacity="0.1"
                  ></path>
                  <g transform="translate(2.000000, 3.000000)">
                    <path
                      d="M8.5,1 C4.35786438,1 1,4.35786438 1,8.5 L1,13 C1,14.6568542 2.34314575,16 4,16 L13,16 C14.6568542,16 16,14.6568542 16,13 L16,4 C16,2.34314575 14.6568542,1 13,1 L8.5,1 Z"
                      stroke="currentColor"
                      stroke-width="2"
                    ></path>
                    <path
                      d="M4,20 C2.34314575,20 1,21.3431458 1,23 L1,27.5 C1,31.6421356 4.35786438,35 8.5,35 L13,35 C14.6568542,35 16,33.6568542 16,32 L16,23 C16,21.3431458 14.6568542,20 13,20 L4,20 Z"
                      stroke="currentColor"
                      stroke-width="2"
                    ></path>
                    <path
                      d="M23,1 C21.3431458,1 20,2.34314575 20,4 L20,13 C20,14.6568542 21.3431458,16 23,16 L32,16 C33.6568542,16 35,14.6568542 35,13 L35,8.5 C35,4.35786438 31.6421356,1 27.5,1 L23,1 Z"
                      stroke="currentColor"
                      stroke-width="2"
                    ></path>
                    <path
                      d="M34.5825451,33.4769886 L38.3146092,33.4322291 C38.8602707,33.4256848 39.3079219,33.8627257 39.3144662,34.4083873 C39.3145136,34.4123369 39.3145372,34.4162868 39.3145372,34.4202367 L39.3145372,34.432158 C39.3145372,34.9797651 38.8740974,35.425519 38.3265296,35.4320861 L34.5944655,35.4768456 C34.048804,35.4833899 33.6011528,35.046349 33.5946085,34.5006874 C33.5945611,34.4967378 33.5945375,34.4927879 33.5945375,34.488838 L33.5945375,34.4769167 C33.5945375,33.9293096 34.0349773,33.4835557 34.5825451,33.4769886 Z"
                      fill="currentColor"
                      transform="translate(36.454537, 34.454537) rotate(-315.000000) translate(-36.454537, -34.454537) "
                    ></path>
                    <circle stroke="currentColor" stroke-width="2" cx="27.5" cy="27.5" r="7.5"></circle>
                  </g>
                </g>
              </svg>
              <span class="absolute -top-1 w-2.5 h-2.5 bg-red-400 dark:border-gray-800 rounded-full"></span>
            </div>

            <span class="tab tab-kategori block text-xs">通信录</span>
          </a>
          <a
            href="#"
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 dark:text-white text-gray-400"
          >
            <div class="relative">
              <svg width="25" height="25" viewBox="0 0 42 42" class="inline-block mb-1">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path
                    d="M20.5890101,0.254646884 C12.8696785,5.50211755 8.0025785,14.258415 14.1941217,18.8708225 C23.16683,25.5550669 13.3362326,40.2698884 33.1021758,38.4149164 C29.6814884,40.8311956 25.5065164,42.2507054 21,42.2507054 C9.40202025,42.2507054 0,32.8486852 0,21.2507054 C0,9.79003409 9.18071714,0.473634138 20.5890101,0.254646884 Z"
                    fill="currentColor"
                    opacity="0.1"
                  ></path>
                  <path
                    d="M25.9500282,20.3643496 L22.4308312,38.2677802 C22.3775703,38.5387376 22.1147395,38.7152155 21.8437821,38.6619546 C21.6570955,38.6252584 21.507413,38.4857901 21.4576354,38.3021581 L16.5951895,20.3643496 L20.099732,4.44663907 C20.1385204,4.27046145 20.2692032,4.12883813 20.4417012,4.07604096 C20.7057521,3.99522179 20.9853245,4.14376046 21.0661436,4.40781135 L25.9500282,20.3643496 Z M21.3022963,22.2852638 C22.4068658,22.2852638 23.3022963,21.3898333 23.3022963,20.2852638 C23.3022963,19.1806943 22.4068658,18.2852638 21.3022963,18.2852638 C20.1977268,18.2852638 19.3022963,19.1806943 19.3022963,20.2852638 C19.3022963,21.3898333 20.1977268,22.2852638 21.3022963,22.2852638 Z"
                    fill="currentColor"
                    transform="translate(21.272609, 20.629524) rotate(-315.000000) translate(-21.272609, -20.629524) "
                  ></path>
                  <circle stroke="currentColor" stroke-width="2" cx="21" cy="21" r="20"></circle>
                </g>
              </svg>
              <span class="-top-1 absolute w-2.5 h-2.5 bg-red-400 dark:border-gray-800 rounded-full"></span>
            </div>

            <span class="tab tab-explore block text-xs">发现</span>
          </a>

          <a
            href="#"
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 dark:text-white text-gray-400"
          >
            <div class="relative">
              <svg width="25" height="25" viewBox="0 0 42 42" class="inline-block mb-1">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path
                    d="M14.7118754,20.0876892 L8.03575361,20.0876892 C5.82661462,20.0876892 4.03575361,18.2968282 4.03575361,16.0876892 L4.03575361,12.031922 C4.03575361,8.1480343 6.79157254,4.90780265 10.4544842,4.15995321 C8.87553278,8.5612583 8.1226025,14.3600511 10.9452499,15.5413938 C13.710306,16.6986332 14.5947501,18.3118357 14.7118754,20.0876892 Z M14.2420017,23.8186831 C13.515543,27.1052019 12.7414284,30.2811559 18.0438552,31.7330419 L18.0438552,33.4450645 C18.0438552,35.6542035 16.2529942,37.4450645 14.0438552,37.4450645 L9.90612103,37.4450645 C6.14196811,37.4450645 3.09051926,34.3936157 3.09051926,30.6294627 L3.09051926,27.813861 C3.09051926,25.604722 4.88138026,23.813861 7.09051926,23.813861 L14.0438552,23.813861 C14.1102948,23.813861 14.1763561,23.8154808 14.2420017,23.8186831 Z M20.7553776,32.160536 C23.9336213,32.1190063 23.9061943,29.4103976 33.8698747,31.1666916 C34.7935223,31.3295026 35.9925894,31.0627305 37.3154077,30.4407183 C37.09778,34.8980343 33.4149547,38.4450645 28.9036761,38.4450645 C24.9909035,38.4450645 21.701346,35.7767637 20.7553776,32.160536 Z"
                    fill="currentColor"
                    opacity="0.1"
                  ></path>
                  <g transform="translate(2.000000, 3.000000)">
                    <path
                      d="M8.5,1 C4.35786438,1 1,4.35786438 1,8.5 L1,13 C1,14.6568542 2.34314575,16 4,16 L13,16 C14.6568542,16 16,14.6568542 16,13 L16,4 C16,2.34314575 14.6568542,1 13,1 L8.5,1 Z"
                      stroke="currentColor"
                      stroke-width="2"
                    ></path>
                    <path
                      d="M4,20 C2.34314575,20 1,21.3431458 1,23 L1,27.5 C1,31.6421356 4.35786438,35 8.5,35 L13,35 C14.6568542,35 16,33.6568542 16,32 L16,23 C16,21.3431458 14.6568542,20 13,20 L4,20 Z"
                      stroke="currentColor"
                      stroke-width="2"
                    ></path>
                    <path
                      d="M23,1 C21.3431458,1 20,2.34314575 20,4 L20,13 C20,14.6568542 21.3431458,16 23,16 L32,16 C33.6568542,16 35,14.6568542 35,13 L35,8.5 C35,4.35786438 31.6421356,1 27.5,1 L23,1 Z"
                      stroke="currentColor"
                      stroke-width="2"
                    ></path>
                    <path
                      d="M34.5825451,33.4769886 L38.3146092,33.4322291 C38.8602707,33.4256848 39.3079219,33.8627257 39.3144662,34.4083873 C39.3145136,34.4123369 39.3145372,34.4162868 39.3145372,34.4202367 L39.3145372,34.432158 C39.3145372,34.9797651 38.8740974,35.425519 38.3265296,35.4320861 L34.5944655,35.4768456 C34.048804,35.4833899 33.6011528,35.046349 33.5946085,34.5006874 C33.5945611,34.4967378 33.5945375,34.4927879 33.5945375,34.488838 L33.5945375,34.4769167 C33.5945375,33.9293096 34.0349773,33.4835557 34.5825451,33.4769886 Z"
                      fill="currentColor"
                      transform="translate(36.454537, 34.454537) rotate(-315.000000) translate(-36.454537, -34.454537) "
                    ></path>
                    <circle stroke="currentColor" stroke-width="2" cx="27.5" cy="27.5" r="7.5"></circle>
                  </g>
                </g>
              </svg>
              <span class="-top-1 absolute w-2.5 h-2.5 bg-red-400 dark:border-gray-800 rounded-full"></span>
            </div>

            <span class="tab tab-account block text-xs">我</span>
          </a>
        </div>
      </section>
    </div>
  </div>

  <div class="hidden lg:block">
    <aside class="flex">
      <div class="flex flex-col items-center w-16 h-screen py-8 bg-gray-400 dark:bg-gray-900 dark:border-gray-700">
        <nav class="flex flex-col items-center flex-1 space-y-8">
          <router-link to="/home">
            <img class="w-auto h-6 sm:h-7 rounded-md" src="../assets/hellsing logo_2.svg" alt="" />
          </router-link>

          <a
            href="#"
            class="bg-blue-100 p-1.5 inline-block text-blue-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </a>

          <a
            href="#"
            class="p-1.5 inline-block text-gray-500 transition-colors duration-200 rounded-lg dark:text-blue-400 dark:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </a>

          <a
            href="#"
            class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
          </a>

          <a
            href="#"
            class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </a>

          <a
            href="#"
            class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
        </nav>

        <div class="flex flex-col items-center mt-4 space-y-4">
          <a href="#">
            <div class="flex justify-center items-center relative">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
                    stroke="#ffffff"
                    stroke-width="0.4800000000000001"
                    stroke-linecap="round"
                  ></path>
                  <circle cx="12" cy="16" r="1" fill="#ffffff"></circle>
                  <path
                    d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                    stroke="#ffffff"
                    stroke-width="0.4800000000000001"
                    stroke-linecap="round"
                  ></path>
                </g>
              </svg>
              <span
                v-if="chatInfo && chatInfo.contents && chatInfo.contents.length > 0"
                class="top-0 left-7 absolute w-3.5 h-3.5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full"
              ></span>
            </div>
          </a>

          <a
            href="#"
            class="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </a>
        </div>
      </div>

      <div
        class="h-screen px-5 py-8 overflow-y-auto bg-white border-l border-r w-1/3 dark:bg-gray-900 dark:border-gray-700 relative"
      >
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>

          <input
            type="text"
            class="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            placeholder="搜索"
          />
        </div>

        <nav class="mt-4 -mx-4">
          <div
            v-for="(item, index) in chatList"
            :key="index"
            class="hover:bg-gray-900 hover:cursor-pointer flex flex-row bg-gray-200 dark:bg-gray-800 px-2 py-2 border-b border-gray-500/50"
            @click="selectChat(item.chatConnectId)"
          >
            <div class="flex justify-center items-center relative">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
                    stroke="#ffffff"
                    stroke-width="0.4800000000000001"
                    stroke-linecap="round"
                  ></path>
                  <circle cx="12" cy="16" r="1" fill="#ffffff"></circle>
                  <path
                    d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                    stroke="#ffffff"
                    stroke-width="0.4800000000000001"
                    stroke-linecap="round"
                  ></path>
                </g>
              </svg>
              <span
                v-if="item.id !== chatWindowId && item.contents && item.contents.length > 0"
                class="top-0 left-7 absolute w-3.5 h-3.5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full"
              ></span>
            </div>
            <div class="flex flex-col px-2 w-full">
              <div class="flex flex-row justify-between">
                <div class="title text-md dark:text-white text-gray-400">{{ item.name }}</div>
                <div class="title text-xs dark:text-white/50 text-gray-400">{{ showChatListInfoTime(item) }}</div>
              </div>

              <div class="flex flex-row justify-between">
                <div class="last-msg text-sm dark:text-white/50 text-start text-gray-400">
                  {{ showChatListInfoContent(item) }}...
                </div>
                <svg
                  v-show="item.isMite"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M3 3L21 21M9.37747 3.56325C10.1871 3.19604 11.0827 3 12 3C13.5913 3 15.1174 3.59 16.2426 4.6402C17.3679 5.69041 18 7.11479 18 8.6C18 10.3566 18.2892 11.7759 18.712 12.9122M17 17H15M6.45339 6.46451C6.15686 7.13542 6 7.86016 6 8.6C6 11.2862 5.3238 13.1835 4.52745 14.4866C3.75616 15.7486 3.37051 16.3797 3.38485 16.5436C3.40095 16.7277 3.43729 16.7925 3.58603 16.9023C3.71841 17 4.34762 17 5.60605 17H9M9 17V18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18V17M9 17H15"
                      :stroke="isDarkMode ? '#ffffff' : '#000000'"
                      stroke-width="0.4800000000000001"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </nav>

        <div class="flex flex-row-reverse justify-between items-start mr-4 absolute bottom-10 right-0">
          <div
            class="hover:cursor-pointer border border-indigo-500 bg-indigo-500 rounded-full shadow-2xl h-10 w-10 z-10 text-center flex justify-center items-center"
            @click="showSearchUser = !showSearchUser"
          >
            <div class="text-xl dark:text-white text-gray-700 font-bold">+</div>
          </div>
        </div>
        <div
          v-show="showSearchUser"
          class="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
              ref="addUserRef"
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">找朋友</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">输入 name 或者 email.</p>
                    </div>
                  </div>
                </div>
                <div class="relative mt-6">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </span>

                  <input
                    v-model="addSearchUser"
                    type="text"
                    class="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    placeholder="搜索"
                  />
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="handleSearchUser"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="chatWindowId === -1" class="flex container flex-col justify-center items-center space-y-6 px-40 py-12">
        <div class="text-2xl text-black">通告！通告！</div>

        <div class="text-2xl text-black">1.安全宣传要广泛-安全培训在岗前</div>

        <div class="text-2xl text-black">2.安全责任重泰山-强化措施保平安</div>

        <div class="text-2xl text-black">3.人人讲安全，事事为安全；时时想安全，处处要安全</div>

        <div class="text-2xl text-black">4.重视安全硕果来 忽视安全遭祸害</div>

        <div class="text-2xl text-black">5.安全在你脚下，安全在你手中。</div>

        <div class="text-2xl text-black">6.人人讲安全，事事为安全；时时想安全，处处要安全</div>
      </div>

      <div v-else class="flex flex-col w-full h-screen">
        <div class="h-20">
          <div class="title text-md dark:text-white text-gray-400 text-center leading-[5rem] px-10">
            {{ chatInfo?.name }}
          </div>
        </div>

        <!-- 聊天内容 -->
        <div ref="contentRef" class="content h-3/4 overflow-auto mb-2">
          <div class="space-y-5 h-full w-full">
            <!-- Chat Bubble -->
            <ul v-for="(item, index) in chatInfo?.contents" :key="index" class="talk-content">
              <li v-show="!item.isOwner" class="max-w-lg flex gap-x-2 sm:gap-x-4 me-11">
                <span
                  class="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-gray-600"
                >
                  <img class="inline-block h-9 w-9 rounded-full" :src="item.icon" alt="Image Description" />
                </span>
                <!-- Card -->
                <div
                  class="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-slate-900 dark:border-gray-700 whitespace-pre-line"
                >
                  <div class="flex flex-row justify-between space-x-4">
                    <div class="text-xs text-gray-900 font-bold">{{ item.name }}</div>
                    <div class="text-xs text-gray-200">{{ item.time }}</div>
                  </div>

                  <h2 class="font-medium text-gray-800 dark:text-white">
                    {{ item.content }}
                    <div class="flex justify-end items-end">
                      <div class="text-md text-gray-400">{{ item.counter }}s</div>
                    </div>
                  </h2>
                </div>
                <!-- End Card -->
              </li>
              <!-- End Chat -->

              <!-- Chat -->
              <li v-show="item.isOwner" class="flex ms-auto gap-x-2 sm:gap-x-4">
                <div class="grow text-end space-y-3">
                  <!-- Card -->
                  <div class="inline-block bg-blue-600 rounded-2xl p-4 shadow-sm whitespace-pre-line">
                    <div class="flex flex-row justify-between space-x-4">
                      <div class="text-xs text-gray-900 font-bold">{{ userInfo.name }}</div>
                      <div class="text-xs text-gray-200">{{ item.time }}</div>
                    </div>
                    <p class="text-sm text-white text-start mt-2">
                      {{ item.content }}
                    </p>
                    <div class="flex justify-start">
                      <div class="text-md text-gray-400">{{ item.counter }}s</div>
                    </div>
                  </div>
                  <!-- End Card -->
                </div>

                <span
                  class="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-gray-600"
                >
                  <img class="inline-block h-9 w-9 rounded-full" :src="item.icon" alt="Image Description" />
                </span>
              </li>
              <!-- End Chat -->
            </ul>
            <!-- End Chat Bubble -->
          </div>
        </div>

        <div class="border-b border-gray-300"></div>
        <div class="flex flex-col h-1/5">
          <div class="flex flex-row justify-between">
            <div class="flex flex-row justify-start space-x-4 px-4 py-2">
              <div class="emo">
                <svg
                  id="Layer_1"
                  width="28px"
                  height="28px"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                  enable-background="new 0 0 32 32"
                  xml:space="preserve"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path
                        fill="#000000"
                        d="M16,32c8.822,0,16-7.178,16-16S24.822,0,16,0S0,7.178,0,16S7.178,32,16,32z M16,1c8.271,0,15,6.729,15,15 s-6.729,15-15,15S1,24.271,1,16S7.729,1,16,1z"
                      ></path>
                      <path
                        fill="#000000"
                        d="M10.36,14.337c1.444,0,2.62-1.176,2.62-2.621c0-1.445-1.176-2.621-2.62-2.621 c-1.445,0-2.621,1.176-2.621,2.621C7.739,13.162,8.915,14.337,10.36,14.337z M10.36,10.096c0.894,0,1.62,0.727,1.62,1.621 c0,0.894-0.727,1.621-1.62,1.621s-1.621-0.727-1.621-1.621C8.739,10.823,9.467,10.096,10.36,10.096z"
                      ></path>
                      <path
                        fill="#000000"
                        d="M21.486,14.323c1.438,0,2.606-1.169,2.606-2.607c0-1.437-1.169-2.606-2.606-2.606s-2.607,1.169-2.607,2.606 C18.879,13.154,20.049,14.323,21.486,14.323z M21.486,10.11c0.886,0,1.606,0.721,1.606,1.606c0,0.886-0.721,1.607-1.606,1.607 c-0.887,0-1.607-0.721-1.607-1.607C19.879,10.831,20.6,10.11,21.486,10.11z"
                      ></path>
                      <path
                        fill="#000000"
                        d="M9.651,20.465c-0.163-0.224-0.477-0.27-0.699-0.106c-0.222,0.164-0.27,0.477-0.105,0.699 c1.876,2.546,4.369,3.948,7.021,3.948c2.671,0,5.177-1.419,7.058-3.996c0.162-0.223,0.113-0.536-0.109-0.699 s-0.535-0.114-0.699,0.109c-1.687,2.312-3.906,3.586-6.249,3.586C13.542,24.005,11.334,22.748,9.651,20.465z"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="folder">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M9 13H15M12.0627 6.06274L11.9373 5.93726C11.5914 5.59135 11.4184 5.4184 11.2166 5.29472C11.0376 5.18506 10.8425 5.10425 10.6385 5.05526C10.4083 5 10.1637 5 9.67452 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V10.2C21 9.0799 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H14.3255C13.8363 7 13.5917 7 13.3615 6.94474C13.1575 6.89575 12.9624 6.81494 12.7834 6.70528C12.5816 6.5816 12.4086 6.40865 12.0627 6.06274Z"
                      stroke="#000000"
                      stroke-width="0.72"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
              <div class="Scissors">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M8.15179 15.85L21 4M12.3249 12L8.15 8.15M21 20L15 14.4669M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6ZM9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15C7.65685 15 9 16.3431 9 18Z"
                      stroke="#000000"
                      stroke-width="0.672"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
              <div class="chat">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M8 10.5H16" stroke="#000000" stroke-width="0.72" stroke-linecap="round"></path>
                    <path d="M8 14H13.5" stroke="#000000" stroke-width="0.72" stroke-linecap="round"></path>
                    <path
                      d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
                      stroke="#000000"
                      stroke-width="0.72"
                      stroke-linecap="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            <div class="flex flex-row justify-start space-x-4 px-4 py-2">
              <div class="call">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M17 12C19.7614 12 22 9.76142 22 7C22 4.23858 19.7614 2 17 2C14.2386 2 12 4.23858 12 7C12 7.79984 12.1878 8.55582 12.5217 9.22624C12.6105 9.4044 12.64 9.60803 12.5886 9.80031L12.2908 10.9133C12.1615 11.3965 12.6035 11.8385 13.0867 11.7092L14.1997 11.4114C14.392 11.36 14.5956 11.3895 14.7738 11.4783C15.4442 11.8122 16.2002 12 17 12Z"
                      stroke="#000000"
                      stroke-width="0.72"
                    ></path>
                    <path
                      d="M8.03759 7.31617L8.6866 8.4791C9.2723 9.52858 9.03718 10.9053 8.11471 11.8278C8.11471 11.8278 8.11471 11.8278 8.11471 11.8278C8.11459 11.8279 6.99588 12.9468 9.02451 14.9755C11.0525 17.0035 12.1714 15.8861 12.1722 15.8853C12.1722 15.8853 12.1722 15.8853 12.1722 15.8853C13.0947 14.9628 14.4714 14.7277 15.5209 15.3134L16.6838 15.9624C18.2686 16.8468 18.4557 19.0692 17.0628 20.4622C16.2258 21.2992 15.2004 21.9505 14.0669 21.9934C12.1588 22.0658 8.91828 21.5829 5.6677 18.3323C2.41713 15.0817 1.93421 11.8412 2.00655 9.93309C2.04952 8.7996 2.7008 7.77423 3.53781 6.93723C4.93076 5.54428 7.15317 5.73144 8.03759 7.31617Z"
                      stroke="#000000"
                      stroke-width="0.72"
                      stroke-linecap="round"
                    ></path>
                  </g>
                </svg>
              </div>
              <div class="video">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z"
                      stroke="#000000"
                      stroke-width="0.744"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="input-area flex flex-col justify-between border p-2 h-full py-2 mb-2">
            <textarea
              v-model="curMessage"
              class="flex-grow border-0 focus:outline-none"
              placeholder="发消息..."
            ></textarea>
            <div class="justify-end fixed bottom-0 right-0 mb-4 mr-2">
              <button
                class="mt-2 px-4 py-2 bg-blue-500 text-white border-blue-500 shadow-lg rounded-lg"
                @click="sendMessage()"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
