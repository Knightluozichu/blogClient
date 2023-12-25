import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './css/index.css';

const app = createApp(App);

app.use(store);

app.use(router);

app.mount('#app');

// console.log(socket);
// console.debug(socket);
// 使用 socket 对象
