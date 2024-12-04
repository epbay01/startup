export class WebSocketHandler {
    constructor() {
        const port = window.location.port;
        //const port = 4000;
        const protocol = window.location.protocol == "https:" ? "wss" : "ws";
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = () => {
            console.log("Connected to websocket");
        };
        this.socket.onclose = () => {
            console.log("Websocket disconnected");
        };
    }

    sendVote(vote) {
        let msg = JSON.stringify({ type: "vote", vote: vote });
        this.socket.send(msg);
    }
}