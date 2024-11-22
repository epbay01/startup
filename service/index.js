//import { Question } from "../src/questionClass.js";
import * as questionsJson from "./public/Misc/questions.json" assert { type: "json" };
import * as dbConfig from "./dbConfig.json" assert { type: "json" };
import * as db from "./database.js";

// import was causing a problem
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

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port);

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set("trust proxy", true);

// Return the application's default page if the path is unknown (from simon code)
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

// will be obselete
let userDatabase = new Object();
let voteHistory = new Object();

/*
APIs:
- user data
    - make user
    - store data
    - access data on login
- vote history
    - store
    - access
- question
*/

// user data apis are on path /api/user/..., includes post, put, delete, get, and get for all
apiRouter.post("/user/new", async (req, res, next) => {
    if (db.getUser(req.body.newUser)) {
        console.log("user already exists");
        res.status(405).set("ContentType", "application/json").send(await db.getUser(req.body.newUser));
    } else {
        let user = await db.makeUser(req.body.newUser, req.body.password);
        console.log(req.body.newUser + " has been created");
        setCookie(res, user.token);
        res.status(201).set("ContentType", "application/json").send(user);
    }
});

apiRouter.put("/user/update", async (req, res, next) => {
    if (await db.getUser(req.body.username)) {
        console.log(req.body.username + " found!, body is " + JSON.stringify(req.body));
        await db.updateUser(req.body);
        console.log(`${req.body.user} is now updated`);
        res.status(200).send();
    } else {
        console.log("user not found");
        res.status(404).send(null);
    }
});

// for this, look at mongodb online
// apiRouter.get("/user/all", (req, res, next) => {
//     res.set("ContentType", "application/json").send(userDatabase);
// })

apiRouter.get("/user/get", async (req, res, next) => {
    let user = await db.getUser(req.body.username);
    if (user != null || user != undefined) {
        res.status(200).set("ContentType", "application/json").send(user);
    } else {
        console.log("user not found");
        res.status(404).send(null);
    }
})

apiRouter.delete("/user/delete", async (req, res, next) => {
    await db.deleteUser(req.body);
    res.status(200).send(); // ok either way
})


apiRouter.get("/test/:test", (req, res, next) => {
    res.send({ test: req.params.test });
})


// api that gets a random question from questions.json
apiRouter.get("/question", (req, res, next) => {
    let questionArray = [...questionsJson.default.questionArray];
    let q = new Question("", []);
    console.log(questionArray.length);
    q = questionArray[Math.floor(Math.random() * questionArray.length)];
    console.log(q);
    res.status(200).set("ContentType", "application/json").send(q);
});


// vote history apis
apiRouter.put("/vote/:dateString", (req, res, next) => {
    if (req.params.dateString in voteHistory) {
        voteHistory[req.params.dateString] = req.body;
        res.status(200).send();
    } else {
        voteHistory[req.params.dateString] = req.body;
        res.status(201).send();
    }
});

apiRouter.get("/vote/all", (req, res, next) => {
    res.status(200).set("ContentType", "application/json").send(voteHistory);
})



function setCookie(res, token) {
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
}