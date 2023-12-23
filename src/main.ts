import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './css/index.css';
import socket from './utils/socket';

const app = createApp(App);

app.use(store);

app.use(router);

app.mount('#app');

// console.log(socket);
// console.debug(socket);

// client-side
socket.on('connect', () => {
  // console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on('disconnect', () => {
  // console.log(socket.id); // undefined
});
