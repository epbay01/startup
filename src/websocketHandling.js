export class WebSocketHandler {
    /*
    TODO:
    - make the frontend reset daily (index.js) DONE!
    - make the question universally the same (index.js and mostly app.jsx) back DONE! front not
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
            const msgObj = JSON.parse(msg.data);
            console.log("Received message: %s", JSON.stringify(msgObj));
            switch (msgObj.type) {
                case "ping":
                    this.socket.send("pong");
                    break;
                case "vote": // get a vote from another user
                    let newVotes = currentVotes;
                    if (newVotes[msgObj.vote] === undefined || newVotes[msgObj.vote] === null) {
                        newVotes[msgObj.vote] = 0;
                    }
                    newVotes[msgObj.vote]++;
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