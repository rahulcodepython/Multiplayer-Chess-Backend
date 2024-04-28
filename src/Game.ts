import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messeges";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private MoveCount: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.MoveCount = 0;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }

    makeMove(player: WebSocket, move: {
        from: string;
        to: string;
    }) {
        if (this.MoveCount % 2 === 0 && player !== this.player1) {
            return;
        }
        if (this.MoveCount % 2 === 1 && player !== this.player2) {
            return;
        }

        try {
            this.board.move(move);
        } catch (error) {
            return;
        }

        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            })
            );
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            })
            );
        }

        if (this.MoveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }



        console.log(move);
        console.log(this.board.ascii());
        console.log(this.board.fen());
        console.log(this.board.history());
        console.log(this.board.turn()); // go to both parties
        console.log(this.board.history({ verbose: true }))

        this.MoveCount++;
    }
}