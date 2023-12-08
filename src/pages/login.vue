<script setup lang="ts">
localStorage.setItem('role', 'admin'); //在登录页存储用户等级

import { ref, watchEffect } from 'vue';
const emailError = ref('');
const passwordError = ref('');
const userError = ref('');

const username = ref('');
const email = ref('');
const password = ref('');
const privacy = ref(false);
const subscription = ref(false);

const passwordVisable = ref(false);
const allowSignUp = ref(false);

const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

const login = () => {
  if (username.value) {
    userError.value = '';
  }

  if (email.value) {
    if (!emailRegex.test(email.value)) {
      emailError.value = '邮箱格式不正确';
      return;
    } else {
      emailError.value = '';
    }
  }

  if (password.value) {
    passwordError.value = '';
  }

  if (username.value === '') {
    userError.value = '用户名不能为空';
    return;
  }

  if (email.value === '') {
    emailError.value = '邮箱不能为空';
    return;
  }

  if (password.value === '') {
    passwordError.value = '密码不能为空';
    return;
  }

  allowSignUp.value = !!(
    privacy.value &&
    username.value &&
    email.value &&
    password.value &&
    !emailError.value &&
    !passwordError.value &&
    !userError.value
  );
};

watchEffect(() => {
  login();
});
</script>

<template>
  <nav x-data="{isOpen:false}" class="relative bg-white shadow dark:bg-gray-800">
    <div class="container px-6 py-4 ma-auto md:flex md:justify-between md:items-center">
      <div class="flex items-center">
        <router-link to="/home">
          <img class="w-auto h-6 sm:h-7 rounded-md" src="../assets/hellsing logo_2.svg" alt="" />
        </router-link>
        <h1 class="text-xl text-gray-400 px-2">hellsing</h1>
      </div>
    </div>
  </nav>
  <div class="flex justify-center items-center">
    <div
      class="bg-white flex flex-col w-[480px] lg:shadow-lg lg:rounded-lg lg:border lg:border-gray-200 lg:mt-6 lg:mb-4"
    >
      <div class="py-2 px-6 container">
        <div class="flex flex-row justify-between">
          <div class="text-gray-500 text-center px-2 py-2 text-lg">注册</div>
          <div class="text-gray-500 text-center px-2 py-2 text-lg hover:text-blue-600 hover:cursor-pointer">×</div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="px-6 border-b border-gray-300"></div>
      <div class="py-2 px-4 container">
        <!-- 用户名 -->
        <form>
          <div class="flex flex-col justify-between px-2 mt-2 space-y-2">
            <div class="text-gray-500 text-sm">用户名</div>
            <div class="text-gray-500 text-sm">
              <input
                v-model="username"
                type="text"
                class="border border-gray-300 rounded-md w-full h-11 px-2"
                placeholder="用户名"
                autocomplete="username"
              />
              />
            </div>
            <div class="text-sm text-red-300" :class="[!userError ? 'hidden' : '']">{{ userError }}</div>
          </div>
          <!-- 邮箱 -->
          <div class="flex flex-col justify-between px-2 py-1 space-y-2">
            <div class="text-gray-500 text-sm">邮箱</div>
            <div class="text-gray-500 text-sm">
              <input
                v-model="email"
                type="email"
                class="border border-gray-300 rounded-md w-full h-11 px-2"
                placeholder="you@email.com"
                autocomplete="current-email"
              />
            </div>
            <div class="text-sm text-red-300" :class="[!emailError ? 'hidden' : '']">{{ emailError }}</div>
          </div>

          <!-- 密码 -->
          <div class="flex flex-col justify-between px-2 py-1 space-y-2">
            <div class="text-gray-500 text-sm">创建密码</div>
            <div class="text-gray-500 text-sm relative">
              <input
                v-model="password"
                :type="!passwordVisable ? 'password' : 'text'"
                class="border border-gray-300 rounded-md w-full h-11 px-2"
                placeholder="******"
                autocomplete="current-password"
              />
              <div
                class="eyes absolute right-0 top-0 bottom-0 mr-2 flex items-center hover:cursor-pointer"
                @click="
                  () => {
                    passwordVisable = !passwordVisable;
                  }
                "
              >
                <svg
                  v-show="passwordVisable"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                      stroke="#000000"
                      stroke-width="0.4800000000000001"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
                <svg
                  v-show="!passwordVisable"
                  viewBox="0 0 24.00 24.00"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                      stroke="#000000"
                      stroke-width="0.4800000000000001"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                      stroke="#000000"
                      stroke-width="0.4800000000000001"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            <div class="text-sm text-red-300">{{ passwordError }}</div>
          </div>

          <div class="flex flex-col px-2 space-y-2">
            <div class="flex flex-row">
              <input id="checkbox" v-model="privacy" type="checkbox" class="form-checkbox text-blue-600 bottom-0" />
              <div class="ml-2 text-gray-700 w-full text-sm">
                我同意<a href="" class="text-blue-600">使用条款</a>和<a href="" class="text-blue-600">隐私政策</a>
              </div>
            </div>
            <div class="flex flex-row">
              <input id="checkbox" v-model="subscription" type="checkbox" class="form-checkbox text-blue-600" />
              <div class="ml-2 text-gray-700 text-sm">我希望在时事通讯中接收提示、新闻和社区内容（2 次/月）。</div>
            </div>
          </div>

          <div class="px-2 py-2 text-xs text-gray-300">
            通过创建帐户，您的用户名将公开，任何访问该网站的人都可以读取。请勿包含 ID、凭据或非公开信息等敏感数据。<a
              href=""
              class="text-blue-600"
              >了解如何编辑您的用户名</a
            >。<a href="" class="text-blue-600">了解如何删除您的帐户</a>。
          </div>

          <!-- 提交按钮 -->
          <div class="px-2 py-2">
            <button
              type="submit"
              :class="[allowSignUp ? 'bg-blue-600' : 'bg-blue-100']"
              class="text-white w-full h-11 rounded-md"
            >
              创建用户
            </button>
          </div>
        </form>
      </div>

      <div class="px-2 py-1 text-sm text-gray-700 text-center font-bold">或登录</div>
      <!-- 第三方登录 -->
      <div class="flex flex-row px-4 py-2 flex-wrap justify-center items-center">
        <div
          class="m-1 border border-gray-300 flex flex-row lg:w-32 w-24 h-10 justify-evenly items-center rounded-md hover:cursor-pointer"
        >
          <svg
            id="Layer_2"
            viewBox="0 0 48.00 48.00"
            data-name="Layer 2"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            stroke-width="0.384"
            width="36"
            height="36"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                class="cls-1"
                d="M20,32.17a21.33,21.33,0,0,1-5.81-.71,2.63,2.63,0,0,0-1.45.24c-1.35.76-2.64,1.62-4.17,2.58.28-1.27.46-2.38.78-3.45a1.31,1.31,0,0,0-.6-1.74c-4.65-3.28-6.61-8.2-5.14-13.26,1.36-4.68,4.69-7.51,9.22-9a15.47,15.47,0,0,1,16.89,4.94,15.09,15.09,0,0,1,2.71,7.55m-18.13-3a1.79,1.79,0,0,0-1.72-1.78,1.73,1.73,0,0,0-1.81,1.68A1.71,1.71,0,0,0,12.47,18,1.76,1.76,0,0,0,14.3,16.32Zm9.3-1.78a1.79,1.79,0,0,0-1.75,1.76,1.75,1.75,0,0,0,1.8,1.7,1.73,1.73,0,1,0,0-3.46Z"
              ></path>
              <path
                class="cls-1"
                d="M40.83,42.05c-1.22-.54-2.35-1.36-3.55-1.49s-2.45.57-3.69.69a12.36,12.36,0,0,1-10-3.27C18.22,33,19,25.46,25.17,21.41c5.49-3.6,13.55-2.4,17.42,2.6a9.88,9.88,0,0,1-1.14,13.8c-1.19,1.06-1.62,1.94-.86,3.33a4,4,0,0,1,.24.91Zm-14-13.52a1.44,1.44,0,1,0,0-2.88,1.44,1.44,0,1,0,0,2.88Zm9-2.88A1.43,1.43,0,0,0,34.44,27a1.42,1.42,0,1,0,2.84.12A1.43,1.43,0,0,0,35.87,25.65Z"
              ></path>
            </g>
          </svg>
          <div class="text-sm text-gray-400 text-center">微信</div>
        </div>
        <div
          class="m-1 border border-gray-300 flex flex-row lg:w-32 w-24 h-10 justify-evenly items-center rounded-md hover:cursor-pointer"
        >
          <svg
            id="Layer_2"
            viewBox="0 0 48.00 48.00"
            data-name="Layer 2"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            stroke-width="0.384"
            width="36"
            height="36"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                class="cls-1"
                d="M20,32.17a21.33,21.33,0,0,1-5.81-.71,2.63,2.63,0,0,0-1.45.24c-1.35.76-2.64,1.62-4.17,2.58.28-1.27.46-2.38.78-3.45a1.31,1.31,0,0,0-.6-1.74c-4.65-3.28-6.61-8.2-5.14-13.26,1.36-4.68,4.69-7.51,9.22-9a15.47,15.47,0,0,1,16.89,4.94,15.09,15.09,0,0,1,2.71,7.55m-18.13-3a1.79,1.79,0,0,0-1.72-1.78,1.73,1.73,0,0,0-1.81,1.68A1.71,1.71,0,0,0,12.47,18,1.76,1.76,0,0,0,14.3,16.32Zm9.3-1.78a1.79,1.79,0,0,0-1.75,1.76,1.75,1.75,0,0,0,1.8,1.7,1.73,1.73,0,1,0,0-3.46Z"
              ></path>
              <path
                class="cls-1"
                d="M40.83,42.05c-1.22-.54-2.35-1.36-3.55-1.49s-2.45.57-3.69.69a12.36,12.36,0,0,1-10-3.27C18.22,33,19,25.46,25.17,21.41c5.49-3.6,13.55-2.4,17.42,2.6a9.88,9.88,0,0,1-1.14,13.8c-1.19,1.06-1.62,1.94-.86,3.33a4,4,0,0,1,.24.91Zm-14-13.52a1.44,1.44,0,1,0,0-2.88,1.44,1.44,0,1,0,0,2.88Zm9-2.88A1.43,1.43,0,0,0,34.44,27a1.42,1.42,0,1,0,2.84.12A1.43,1.43,0,0,0,35.87,25.65Z"
              ></path>
            </g>
          </svg>
          <div class="text-sm text-gray-400 text-center">微信</div>
        </div>
        <div
          class="m-1 border border-gray-300 flex flex-row lg:w-32 w-24 h-10 justify-evenly items-center rounded-md hover:cursor-pointer"
        >
          <svg
            id="Layer_2"
            viewBox="0 0 48.00 48.00"
            data-name="Layer 2"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            stroke-width="0.384"
            width="36"
            height="36"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                class="cls-1"
                d="M20,32.17a21.33,21.33,0,0,1-5.81-.71,2.63,2.63,0,0,0-1.45.24c-1.35.76-2.64,1.62-4.17,2.58.28-1.27.46-2.38.78-3.45a1.31,1.31,0,0,0-.6-1.74c-4.65-3.28-6.61-8.2-5.14-13.26,1.36-4.68,4.69-7.51,9.22-9a15.47,15.47,0,0,1,16.89,4.94,15.09,15.09,0,0,1,2.71,7.55m-18.13-3a1.79,1.79,0,0,0-1.72-1.78,1.73,1.73,0,0,0-1.81,1.68A1.71,1.71,0,0,0,12.47,18,1.76,1.76,0,0,0,14.3,16.32Zm9.3-1.78a1.79,1.79,0,0,0-1.75,1.76,1.75,1.75,0,0,0,1.8,1.7,1.73,1.73,0,1,0,0-3.46Z"
              ></path>
              <path
                class="cls-1"
                d="M40.83,42.05c-1.22-.54-2.35-1.36-3.55-1.49s-2.45.57-3.69.69a12.36,12.36,0,0,1-10-3.27C18.22,33,19,25.46,25.17,21.41c5.49-3.6,13.55-2.4,17.42,2.6a9.88,9.88,0,0,1-1.14,13.8c-1.19,1.06-1.62,1.94-.86,3.33a4,4,0,0,1,.24.91Zm-14-13.52a1.44,1.44,0,1,0,0-2.88,1.44,1.44,0,1,0,0,2.88Zm9-2.88A1.43,1.43,0,0,0,34.44,27a1.42,1.42,0,1,0,2.84.12A1.43,1.43,0,0,0,35.87,25.65Z"
              ></path>
            </g>
          </svg>
          <div class="text-sm text-gray-400 text-center">微信</div>
        </div>
        <div
          class="m-1 border border-gray-300 flex flex-row lg:w-32 w-24 h-10 justify-evenly items-center rounded-md hover:cursor-pointer"
        >
          <svg
            id="Layer_2"
            viewBox="0 0 48.00 48.00"
            data-name="Layer 2"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            stroke-width="0.384"
            width="36"
            height="36"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                class="cls-1"
                d="M20,32.17a21.33,21.33,0,0,1-5.81-.71,2.63,2.63,0,0,0-1.45.24c-1.35.76-2.64,1.62-4.17,2.58.28-1.27.46-2.38.78-3.45a1.31,1.31,0,0,0-.6-1.74c-4.65-3.28-6.61-8.2-5.14-13.26,1.36-4.68,4.69-7.51,9.22-9a15.47,15.47,0,0,1,16.89,4.94,15.09,15.09,0,0,1,2.71,7.55m-18.13-3a1.79,1.79,0,0,0-1.72-1.78,1.73,1.73,0,0,0-1.81,1.68A1.71,1.71,0,0,0,12.47,18,1.76,1.76,0,0,0,14.3,16.32Zm9.3-1.78a1.79,1.79,0,0,0-1.75,1.76,1.75,1.75,0,0,0,1.8,1.7,1.73,1.73,0,1,0,0-3.46Z"
              ></path>
              <path
                class="cls-1"
                d="M40.83,42.05c-1.22-.54-2.35-1.36-3.55-1.49s-2.45.57-3.69.69a12.36,12.36,0,0,1-10-3.27C18.22,33,19,25.46,25.17,21.41c5.49-3.6,13.55-2.4,17.42,2.6a9.88,9.88,0,0,1-1.14,13.8c-1.19,1.06-1.62,1.94-.86,3.33a4,4,0,0,1,.24.91Zm-14-13.52a1.44,1.44,0,1,0,0-2.88,1.44,1.44,0,1,0,0,2.88Zm9-2.88A1.43,1.43,0,0,0,34.44,27a1.42,1.42,0,1,0,2.84.12A1.43,1.43,0,0,0,35.87,25.65Z"
              ></path>
            </g>
          </svg>
          <div class="text-sm text-gray-400 text-center">微信</div>
        </div>
        <div
          class="m-1 border border-gray-300 flex flex-row lg:w-32 w-24 h-10 justify-evenly items-center rounded-md hover:cursor-pointer"
        >
          <svg
            id="Layer_2"
            viewBox="0 0 48.00 48.00"
            data-name="Layer 2"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            stroke-width="0.384"
            width="36"
            height="36"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                class="cls-1"
                d="M20,32.17a21.33,21.33,0,0,1-5.81-.71,2.63,2.63,0,0,0-1.45.24c-1.35.76-2.64,1.62-4.17,2.58.28-1.27.46-2.38.78-3.45a1.31,1.31,0,0,0-.6-1.74c-4.65-3.28-6.61-8.2-5.14-13.26,1.36-4.68,4.69-7.51,9.22-9a15.47,15.47,0,0,1,16.89,4.94,15.09,15.09,0,0,1,2.71,7.55m-18.13-3a1.79,1.79,0,0,0-1.72-1.78,1.73,1.73,0,0,0-1.81,1.68A1.71,1.71,0,0,0,12.47,18,1.76,1.76,0,0,0,14.3,16.32Zm9.3-1.78a1.79,1.79,0,0,0-1.75,1.76,1.75,1.75,0,0,0,1.8,1.7,1.73,1.73,0,1,0,0-3.46Z"
              ></path>
              <path
                class="cls-1"
                d="M40.83,42.05c-1.22-.54-2.35-1.36-3.55-1.49s-2.45.57-3.69.69a12.36,12.36,0,0,1-10-3.27C18.22,33,19,25.46,25.17,21.41c5.49-3.6,13.55-2.4,17.42,2.6a9.88,9.88,0,0,1-1.14,13.8c-1.19,1.06-1.62,1.94-.86,3.33a4,4,0,0,1,.24.91Zm-14-13.52a1.44,1.44,0,1,0,0-2.88,1.44,1.44,0,1,0,0,2.88Zm9-2.88A1.43,1.43,0,0,0,34.44,27a1.42,1.42,0,1,0,2.84.12A1.43,1.43,0,0,0,35.87,25.65Z"
              ></path>
            </g>
          </svg>
          <div class="text-sm text-gray-400 text-center">微信</div>
        </div>
      </div>

      <div class="text-xs text-gray-300 text-center">本网站受 reCAPTCHA 保护，并适用 Google隐私政策和服务条款。</div>
      <div class="text-sm mt-2 text-gray-700 text-center">
        已经有帐户？<a href="" class="text-blue-600">在此登录</a>
      </div>
      <div class="text-center mb-2">
        <a href="" class="text-xs underline text-gray-400 text-center hover:text-blue-600">隐私政策</a>•
        <a href="" class="text-xs underline text-gray-400 text-center hover:text-blue-600">帮助</a>•
        <a href="" class="text-xs underline text-gray-400 text-center hover:text-blue-600">条款和条件</a>
      </div>
    </div>
  </div>
</template>
