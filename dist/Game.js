"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messeges_1 = require("./messeges");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.MoveCount = 0;
        this.player1.send(JSON.stringify({
            type: messeges_1.INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: messeges_1.INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }
    makeMove(player, move) {
        if (this.MoveCount % 2 === 0 && player !== this.player1) {
            return;
        }
        if (this.MoveCount % 2 === 1 && player !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messeges_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
            this.player2.send(JSON.stringify({
                type: messeges_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
        }
        if (this.MoveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messeges_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messeges_1.MOVE,
                payload: move
            }));
        }
        this.MoveCount++;
    }
}
exports.Game = Game;
