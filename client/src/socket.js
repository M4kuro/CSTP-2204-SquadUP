import { io } from 'socket.io-client';

const socket = io(
  import.meta.env.PROD
    ? 'https://cstp-2204-squadup-production.up.railway.app'
    : 'http://localhost:5000'
);

export default socket;