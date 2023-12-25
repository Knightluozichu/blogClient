import { io } from 'socket.io-client';

const socket = io('http://192.168.8.9:3000');

// client-side
socket.on('connect', () => {
  // console.debug(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on('disconnect', () => {
  // console.debug(socket.id); // undefined
});

// 使用 socket 对象
// socket.on('chat message', (msg) => {
//     // console.debug('new message: ' + msg);
// });

export default socket;
