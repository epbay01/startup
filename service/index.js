import { Question } from "../src/questionClass.js";
import * as questionsJson from "../public/questions.json" assert { type: "json" };

import express from "express";
import cors from "cors";

let app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port);

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

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
app.post("/api/user/new/:newUser", (req, res, next) => {
    if (req.params.newUser in userDatabase) {
        console.log("user already exists");
        res.status(405).set("ContentType", "application/json").send(userDatabase[req.params.newUser]);
    } else {
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
        console.log(req.params.newUser + " has been created");
        res.status(201).set("ContentType", "application/json").send(userDatabase[req.params.newUser]);
    }
});

app.put("/api/user/update/:updatedUser", (req, res, next) => {
    if (req.params.updatedUser in userDatabase) {
        console.log(req.params.updatedUser + " found!, body is " + JSON.stringify(req.body));
        userDatabase[req.params.updatedUser] = req.body;
        console.log(`${req.params.updatedUser} is now ${JSON.stringify(userDatabase[req.params.updatedUser])}`);
        res.status(200).send();
    } else {
        console.log("user not found");
        res.status(404).send(null);
    }
});

app.get("/api/user/all", (req, res, next) => {
    res.set("ContentType", "application/json").send(userDatabase);
})

app.get("/api/user/:getUser", (req, res, next) => {
    if (req.params.getUser in userDatabase) {
        res.status(200).set("ContentType", "application/json").send(userDatabase[req.params.getUser]);
    } else {
        console.log("user not found");
        res.status(404).send(null);
    }
})

app.delete("/api/user/delete/:deleteUser", (req, res, next) => {
    if (req.params.deleteUser in userDatabase) {
        delete userDatabase[req.params.deleteUser];
    }
    res.status(200).send(); // ok either way
})


app.get("/api/test/:test", (req, res, next) => {
    res.send({ test: req.params.test });
})


// api that gets a random question from questions.json
app.get("/api/question", (req, res, next) => {
    let questionArray = [...questionsJson.default.questionArray];
    let q = new Question("", []);
    console.log(questionArray.length);
    q = questionArray[Math.floor(Math.random() * questionArray.length)];
    console.log(q);
    res.status(200).set("ContentType", "application/json").send(q);
});


// vote history apis
app.put("/api/vote/:dateString", (req, res, next) => {
    if (req.params.dateString in voteHistory) {
        voteHistory[req.params.dateString] = req.body;
        res.status(200).send();
    } else {
        voteHistory[req.params.dateString] = req.body;
        res.status(201).send();
    }
});

app.get("/api/vote/all", (req, res, next) => {
    res.status(200).set("ContentType", "application/json").send(voteHistory);
})