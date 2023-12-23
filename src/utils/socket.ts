import { io } from 'socket.io-client';

const socket = io('http://192.168.8.9:3000');

export default socket;
