export class WebSocketHandler {
    /*
    TODO:
    - make the frontend reset daily (index.js)
    - make the question universally the same (index.js and mostly app.jsx)
    - i drastically changed the vote history apis, so adjust accordingly on frontend (app.jsx)
    - fix the reload bug (app.jsx??)
    - double check ws is working (websocketHandling.js)
    */

    constructor(currentVotes, setCurrentVotes) {
        const port = window.location.port;
        //const port = 4000;
        const protocol = window.location.protocol == "https:" ? "wss" : "ws";
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = () => {
            console.log("Connected to websocket");
        };

        this.socket.onmessage = (msg) => {
            console.log("Received message: %s", msg.data);
            switch (msg.data) {
                case "ping":
                    this.socket.send("pong");
                    break;
                case "vote": // get a vote from another user
                    let newVotes = currentVotes;
                    if (currentVotes[msg.data.vote] === undefined || currentVotes[msg.data.vote] === null) {
                        newVotes[msg.data.vote] = 0;
                    }
                    newVotes[msg.data.vote]++;
                    setCurrentVotes(newVotes);
            }
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