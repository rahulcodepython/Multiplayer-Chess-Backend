import { WebSocket } from "ws";
import { INIT_GAME, MOVE, WAITING_FOR_PLAYER } from "./messeges";
import { Game } from "./Game";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket): boolean {
        if (this.users.length < 2) {
            this.users.push(socket);
            this.addHandler(socket);
            if (this.users.length === 1) {
                socket.send(JSON.stringify({ type: WAITING_FOR_PLAYER, payload: 'Waiting for opponent' }));
            }
            return true;
        } else {
            return false;
        }
    }

    removeUser(socket: WebSocket) {
        console.log("Removing user...");

        // Remove from users list
        this.users = this.users.filter(user => user !== socket);

        // Clear pending user if they were the one waiting
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }

        // Find and remove any game where the player was present
        this.games = this.games.filter(game => {
            if (game.player1 === socket || game.player2 === socket) {
                console.log("Game removed due to player disconnect");
                return false; // Remove this game
            }
            return true; // Keep other games
        });

        // Close the WebSocket connection
        socket.close();
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);

                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
        });

    }

}