import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { GAME_QUEUE_FULL } from './messeges';

const PORT = Number(process.env.WS_PORT) || 8080;

const wss = new WebSocketServer({ port: PORT }, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});

const gameManage = new GameManager();

wss.on('connection', (ws) => {
    console.log('New player connected');
    const added = gameManage.addUser(ws);

    if (!added) {
        console.log('Game queue is full. Player is rejected.');
        ws.send(JSON.stringify({ type: GAME_QUEUE_FULL, payload: 'Game queue is full' }));
    }

    ws.on('close', () => {
        console.log('Player disconnected');
        gameManage.removeUser(ws);
    });
});
