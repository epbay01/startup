export class WebSocketHandler {
    constructor(setCurrentVotes) {
        this.setCurrentVotes = setCurrentVotes;

        const port = window.location.port;
        //const port = 4000;
        const protocol = window.location.protocol == "https:" ? "wss" : "ws";
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = () => {
            console.log("Connected to websocket");
        };

        this.socket.onmessage = async (msg) => {
            const msgObj = JSON.parse(msg.data);
            console.log("Received message: %s", JSON.stringify(msgObj));
            switch (msgObj.type) {
                case "ping":
                    this.socket.send("pong");
                    break;
                case "vote": // get a vote from another user
                    let newVotes = {};
                    await fetch("/api/vote/current").then(async (res) => newVotes = await res.json());
                    console.log("recieved: %s", JSON.stringify(newVotes));
                    this.setCurrentVotes((s) => newVotes);
                    break;
            }
        };

        this.socket.onclose = () => {
            console.log("Websocket disconnected");
        };
    }

    async sendVote(vote, setCurrentVotes) {
        let msg = JSON.stringify({ type: "vote", vote: vote });
        console.log("sending vote: %s", msg);
        this.socket.send(msg);

        let newVotes = {};
        await fetch("/api/vote/current").then(async (res) => newVotes = await res.json());
        console.log("recieved: %s", JSON.stringify(newVotes));
        setCurrentVotes((s) => newVotes);
    }
}