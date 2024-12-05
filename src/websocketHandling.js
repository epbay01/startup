export class WebSocketHandler {
    constructor() {
        const port = window.location.port;
        //const port = 4000;
        const protocol = window.location.protocol == "https:" ? "wss" : "ws";
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = () => {
            console.log("Connected to websocket");
        };

        this.socket.onmessage = (event) => {
            console.log("Received message: %s", event.data);
        };

        this.socket.onclose = () => {
            console.log("Websocket disconnected");
        };
    }

    sendVote(vote) {
        let msg = JSON.stringify({ type: "vote", vote: vote });
        console.log("sending vote: %s", msg);
        this.socket.send(msg);
    }
}