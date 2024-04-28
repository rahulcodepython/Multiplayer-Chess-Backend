import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });

const gameManage = new GameManager();

console.log('Server started on port 8080');

wss.on('connection', function connection(ws) {
    gameManage.addUser(ws);

    ws.on('disconnect', () => {
        gameManage.removeUser(ws);
    });
});
