//import { Question } from "../src/questionClass.js";
import * as questionsJson from "../public/Misc/questions.json" assert { type: "json" };
import * as db from "./database.js";
import path from "path";

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

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

let voteHistory = new Object();

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

put /api/vote/:dateString
get /api/vote/all
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
            console.log(`${req.body.user} is now updated`);
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
    let questionArray = [...questionsJson.default.questionArray];
    let q = new Question("", []);
    console.log(questionArray.length);
    q = questionArray[Math.floor(Math.random() * questionArray.length)];
    console.log(q);
    res.status(200).set("Content-Type", "application/json").send(q);
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
    res.status(200).set("Content-Type", "application/json").send(voteHistory);
})


// Return the application's default page if the path is unknown (from simon code)
app.use((_req, res) => {
    res.sendFile(path.resolve("../index.html"));
});


// setCookie sets the cookie with the token
function setCookie(res, token) {
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
}