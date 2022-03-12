/* eslint-disable import/first */
import dotenv from 'dotenv';
import { Server } from 'socket.io';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

import app from './app';
import logger from './logger';

let http = require('http').Server(app);
let socket = require('socket.io')(http, {
  cors: { origin: '*' },
});

socket.on('connection', function (socket: any) {
  console.log('a user connected');
  socket.on('message', function (message: any) {
    console.log(message);
    socket.emit('Hi');
  });
});

app.listen(app.get('port'), (): void => {
  logger.info(`Server server started at http://localhost:${app.get('port')}`);
});
