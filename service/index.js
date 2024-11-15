import { Question } from "../src/questionClass.js";
import * as questionsJson from "../public/questions.json" assert { type: "json" };

import express from "express";
let app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port);

app.use(express.static('public'));

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
*/


app.post("/api/user/new/:newUser", (req, res, next) => {
    if (req.params.newUser in Object.keys(userDatabase)) {
        res.send(null);
    }
    userDatabase[req.params.newUser] = {
        password: "",
        currentStreak: 0,
        highestStreak: 0,
        popVote: 0,
        unpopVote: 0,
        confirmVotes: false,
        notifications: true,
        votedToday: false,
        userHistory: {}
    }
    res.send(userDatabase[req.params.newUser]);
});

app.get("/api/user/all", (req, res, next) => {
    res.send(userDatabase);
})

app.get("/api/test/:test", (req, res, next) => {
    res.send({ test: req.params.test });
})

app.get("/api/question", (req, res, next) => {
    let questionArray = JSON.parse(questionsJson).questionArray;
    let q = new Question("", []);
    q = questionArray[Math.floor(Math.random() * questionArray.length)];
    res.send(q);
});