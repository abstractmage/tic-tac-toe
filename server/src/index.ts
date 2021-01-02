import Express from 'express';
import { RoomManager } from './RoomManager';

const app = Express();

const server = app.listen(3001, () => {
  console.log('server listening');
});

RoomManager.create(server);
