import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import * as questionsJson from "../public/Misc/questions.json" assert { type: "json" }; // change later
import * as db from "./database.js";
import path from "path";
import { WebSocketServer } from "ws";
import * as uuid from "uuid";

//import { Question } from "../src/questionClass.js";
// import was causing a problem so i copied the class here
class Question {
    constructor(question = "", answers = []) {
        this.question = question;
        this.answers = answers;
    }
    toJSON() {
        return {
            question: this.question,
            answers: this.answers
        }
    }
}

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
let http = app.listen(port);

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set("trust proxy", true);

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

let voteHistory = new Object();
let currentQuestion = new Question();

/*
APIs:
post /api/user/new
put /api/user/update
get /api/user/get
delete /api/user/delete
get /api/user/all
post /api/auth/login
post /api/auth/logout

get /api/question

get /api/vote/:dateString
get /api/vote/all
get /api/vote/current

get /api/forereset
*/

// user data apis are on path /api/user/..., includes post, put, delete, get, and get for all
apiRouter.post("/user/new", async (req, res, next) => {
    if (await db.getUser(req.body.username)) {
        console.log("user already exists");
        res.status(405).set("Content-Type", "application/json").send(await db.getUser(req.body.username));
    } else {
        let user = await db.makeUser(req.body.username, req.body.password);
        console.log(req.body.newUser + " has been created");
        setCookie(res, user.token);
        res.status(201).set("Content-Type", "application/json").send(user);
    }
});

apiRouter.put("/user/update", async (req, res, next) => {
    let user = await db.getUserByToken(req.body.token);
    if (user) {
        console.log(req.body.username + " found!");
        if (req.cookies.token == user.token) {
            await db.updateUser(req.body);
            console.log(`${req.body.username} data is now updated`);
            res.status(200).send();
        } else {
            res.status(401).send(); // unauthorized to update user
        }
    } else {
        console.log("user not found");
        res.status(404).send(null);
    }
});

apiRouter.get("/user/all", (req, res, next) => {
    let user = db.getUserByToken(req.query.token);
    if (user.token == req.cookies.token) {
        res.status(200).set("ContentType", "application/json").send(JSON.stringify({ data: db.getAllUsers() }));
    } else {
        res.status(401).send();
    }
})

apiRouter.get("/user/get", async (req, res, next) => {
    let user = await db.getUserByToken(req.query.token);
    if (user) {
        if (user.token == req.cookies.token) {
            res.status(200).set("Content-Type", "application/json").send(user);
        } else {
            res.status(401).send();
        }
    } else {
        console.log("user not found");
        res.status(404).send(null);
    }
})

apiRouter.delete("/user/delete", async (req, res, next) => {
    await db.deleteUser(req.body);
    res.status(200).send();
})


// auth apis that will replace the react auth
apiRouter.post("/auth/login", async (req, res, next) => {
    let user = await db.getUser(req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setCookie(res, user.token);
            res.status(200).send(user);
        } else {
            res.status(401).send();
        }
    } else {
        res.status(404).send();
    }
});


apiRouter.post("/auth/logout", (req, res, next) => {
    res.clearCookie("token", { path: "/" });
    res.status(200).send();
})


apiRouter.get("/test/:test", (req, res, next) => {
    res.send({ test: req.params.test });
})


// api that gets a random question from questions.json
apiRouter.get("/question", (req, res, next) => {
    res.status(200).set("Content-Type", "application/json").send(currentQuestion);
});


// vote history apis
// will do in backend
apiRouter.get("/vote/date/:dateString", async (req, res, next) => {
    let dateString = req.params.dateString;
    let votes = await db.getVoteHistory(dateString);
    console.log(`votes at ${dateString}: ${JSON.stringify(votes)}`);
    if (votes !== null && votes !== undefined) {
        res.status(200).set("Content-Type", "application/json").send(votes.answers);
    } else {
        res.status(404).send();
    }
});

apiRouter.get("/vote/all", async (req, res, next) => {
    voteHistory = await db.getVoteHistory();
    res.status(200).set("Content-Type", "application/json").send(voteHistory);
});

apiRouter.get("/vote/current", async (req, res, next) => {
    let votes = await db.getVotes(currentQuestion);
    delete votes["_id"];
    console.log("sending votes: " + JSON.stringify(votes));
    res.status(200).set("Content-Type", "application/json").send(votes);
});


apiRouter.get("/forcereset", async (req, res, next) => {
    await dailyReset();
    res.status(200).send();
});


// Return the application's default page if the path is unknown (from simon code)
app.use((_req, res) => {
    //res.sendFile(path.resolve("index.html", { root: "public" }));
    res.sendFile(path.resolve("../index.html")); // change later
});


export async function dailyReset() {
    currentQuestion = getQuestion();
    await db.clearVotes(currentQuestion);
    await db.dailyResetUsers();
}


// getQuestion returns a random question from questions.json
function getQuestion() {
    let questionArray = [...questionsJson.default.questionArray];
    let q = new Question("", []);
    //console.log(questionArray.length);
    q = questionArray[Math.floor(Math.random() * questionArray.length)];
    console.log("new question:\n" + JSON.stringify(q));
    return q;
}

// setCookie sets the cookie with the token
function setCookie(res, token) {
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
}


// WEBSOCKET

// Websocket server
const wsServer = new WebSocketServer({ noServer: true });

// upgrade event listener
http.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit("connection", ws, request);
    });
});

let connections = [];

wsServer.on("connection", (ws, req) => {
    const connection = { ws: ws, alive: true, id: uuid.v4() };
    connections.push(connection);
    console.log("new connection");

    ws.on("message", async (msg) => {
        let parsedMsg = JSON.parse(msg);
        console.log("received message: %s", msg);
        if (parsedMsg.type === "vote") {
            console.log("received vote: %s", parsedMsg.vote);
            await db.handleVote(parsedMsg.vote);
            //await db.getVotes(parsedMsg.question); // add question to msg so we can get the votes for it
            connections.forEach((c) => {
                if (c.id != connection.id) {
                    c.ws.send(JSON.stringify({ type: "vote", vote: parsedMsg.vote })); // send vote to others
                }
            });
        } else {
            console.log("unknown message type");
        }
    });

    ws.on("close", () => {
        console.log("connection closed");
        connections = connections.filter((conn) => conn != ws); // gets rid of connection
    });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
        connection.alive = true;
      });
});

// Keep active connections alive
setInterval(() => {
    connections.forEach((c) => {
      // Kill any connection that didn't respond to the ping last time
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);


// every day do the things
setInterval(async () => {
    await dailyReset();
}, 86400000); // 24 hours in milliseconds