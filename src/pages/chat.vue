<template>
  <div class="flex flex-col">
    <div class="flex flex-row sticky z-10 top-0 bg-black w-full justify-between items-center px-4">
      <div class="flex justify-center items-center w-full text-xl text-white my-2 h-10">通信室</div>
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
    <div class="relative bg-black h-15 py-2 px-2">
      <label for="Search" class="sr-only"> Search </label>

      <input
        id="Search"
        type="text"
        placeholder="搜索..."
        class="w-full rounded-md border-gray-200 bg-gray-600 py-2.5 px-2 pe-10 shadow-sm sm:text-sm text-white"
      />

      <span class="absolute inset-y-0 end-1 grid w-10 place-content-center">
        <button type="button" class="text-white">
          <span class="sr-only text-white">搜索</span>

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
      class="hover:bg-gray-900 hover:cursor-pointer flex flex-row bg-gray-800 px-2 py-2 border-b border-gray-500/50"
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
          <div class="title text-md text-white">用户名或群名</div>
          <div class="title text-xs text-white/50">星期三</div>
        </div>

        <div class="flex flex-row justify-between">
          <div class="last-msg text-sm text-white/50 text-start">最后一条聊天的消息内容...</div>
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
      <section id="bottom-navigation" class="block fixed inset-x-0 bottom-0 z-10 bg-gray-600 shadow h-16 py-1">
        <div id="tabs" class="flex justify-between">
          <a
            href="#"
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 text-white"
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
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 text-white"
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
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 text-white"
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
            class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 text-white"
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
</template>
