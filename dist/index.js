"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const messeges_1 = require("./messeges");
const PORT = Number(process.env.WS_PORT) || 8080;
const wss = new ws_1.WebSocketServer({ port: PORT }, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
const gameManage = new GameManager_1.GameManager();
wss.on('connection', (ws) => {
    console.log('New player connected');
    const added = gameManage.addUser(ws);
    if (!added) {
        console.log('Game queue is full. Player is rejected.');
        ws.send(JSON.stringify({ type: messeges_1.GAME_QUEUE_FULL, payload: 'Game queue is full' }));
    }
    ws.on('close', () => {
        console.log('Player disconnected');
        gameManage.removeUser(ws);
    });
});
