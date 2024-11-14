const Question = require("../src/questionClass.js");
const questionsJson = require("../public/questions.json");

const express = require("express");
app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port);

app.use(express.static('public'));

let userDatabase = [];
let voteHistory = {};

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
    if (userDatabase[req.params.newUser] !== null) {
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

app.get("/api/test/:test", (req, res, next) => {
    res.send({ test: req.params.test });
})

app.get("/api/question", (req, res, next) => {
    let questionArray = []
    let q = new Question("", []);
    for (let i = 0; i < questionsJson.questionArray.length; i++) {
        questionArray.push(new Question(questionsJson.questionArray[i].question, questionsJson.questionArray[i].answers))
    }
    q = questionArray[Math.floor(Math.random() * questionArray.length)];
    res.send(q);
});