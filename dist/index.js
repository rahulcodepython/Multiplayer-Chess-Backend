"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManage = new GameManager_1.GameManager();
console.log('Server started on port 8080');
wss.on('connection', function connection(ws) {
    gameManage.addUser(ws);
    ws.on('disconnect', () => {
        gameManage.removeUser(ws);
    });
});
