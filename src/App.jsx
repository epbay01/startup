import React from "react";
import { BrowserRouter, Route, Routes, NavLink, redirect } from "react-router-dom";

import Login from "./login/login.jsx";
import Profile from "./profile/profile.jsx";
import Vote from "./vote/vote.jsx";
import UnknownPath from "./unknown.jsx";

import "./style.css";
import "./login/login-style.css";
import "./profile/profile-style.css";
import "./vote/vote-style.css";

import * as questionsJson from "./questions.json" assert { type: "json" };

/*
TODO:
- implement handleVote()
- send data from cqv back down to <profile> and <vote>
- possibly make it so login button doesn't send to vote page when password is refused, or add a message indicating wrong password
*/

class Question {
    constructor(question = "", answers = []) {
        this.question = question;
        this.answers = answers;
    }
}

export default function App() {
    const [currentUser, setCurrentUser] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [voted, setVoted] = React.useState(false);
    const [invalidPass, setInvalidPass] = React.useState(false);
    const [voteHistory, setVoteHistory] = React.useState([]);
    const [question, setQuestion] = React.useState(new Question());
    const [currentQuestionVotes, setCurrentQuestionVotes] = React.useState(new Object());
    let qArray;
    

    function generateQuestions() { // generates array of questions from json file
        let questionArray = []
        for (let i = 0; i < questionsJson.questionArray.length; i++) {
            questionArray.push(new Question(questionsJson.questionArray[i].question, questionsJson.questionArray[i].answers))
        }
        return questionArray;
    }

    function getNewQuestion() {
        qArray = generateQuestions();
        let qIndex = Math.floor(Math.random() * qArray.length);
        let cqvCopy = currentQuestionVotes;

        if (question.question !== "") {
            let temp;
            try {
                temp = JSON.parse(localStorage.getItem("questionVotes"));
            } catch {
                localStorage.removeItem("questionVotes");
                localStorage.setItem("questionVotes", JSON.stringify(new Object()));
                temp = new Object();
            } finally {
                if (temp === null)  {
                    localStorage.removeItem("questionVotes");
                    localStorage.setItem("questionVotes", JSON.stringify(new Object()));
                    temp = new Object();
                }
            }
            temp[question.question] = cqvCopy;
            localStorage.setItem("questionVotes", JSON.stringify(temp));
            let temp2 = voteHistory;
            temp2.push(cqvCopy);
            setVoteHistory(temp2);
        }

        console.log("new question at index " + qIndex + ": " + qArray[qIndex].question);
        cqvCopy = new Object();
        qArray[qIndex].answers.forEach(element => {
            cqvCopy[element] = 0;
        });
        console.log(JSON.stringify(cqvCopy));
        setCurrentQuestionVotes(cqvCopy);

        return qArray[qIndex]; // get random question from array
    }

    function handleVote() {
        setVoted(true);
    }


    function handleLogin(user, pass, logged) {
        if ((localStorage.getItem(user) !== null) && user !== "") {
            let temp = JSON.parse(localStorage.getItem(user));
            if (pass == temp.password) {
                setInvalidPass(false);
                setCurrentUser(user);
                setLoggedIn(logged);
            } else {
                console.log("invalid password");
                setInvalidPass(true);
            }
        } else {
            setInvalidPass(false);
            createUser(user, pass);
            setCurrentUser(user);
            setLoggedIn(logged);
        }

        return (invalidPass ? "/" : "/vote");
    }

    function createUser(user, pass) {
        let userStats = {
            password: pass,
            currentStreak: 0,
            highestStreak: 0,
            popVote: 0,
            unpopVote: 0,
            confirmVotes: false,
            notifications: true
        }
        localStorage.setItem(user, JSON.stringify(userStats));
    }


    React.useEffect(() => {
        if (question.question === "") {
            setQuestion(getNewQuestion());
        }

        let now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getMilliseconds() === 0) {
            setVoted(false);
            setQuestion(getNewQuestion());
        } // at 0:00 for one milisecond (12:00am every day)
    }, [])

    React.useEffect(() => { // TEMPORARY!!!
        voted ? setQuestion(getNewQuestion()) : 0;
    }, [voted]);


    function Nav({path}) {
        switch (path) {
            case "/":
                return (
                    <nav>
                        {/* <NavLink id="nav-1" className="link" to="login">Login</NavLink> */}
                        <NavLink id="nav-1" className="link" to="/profile">Profile</NavLink>
                        <NavLink id="nav-2" className="link" to="/vote">VOTE!</NavLink>
                    </nav>
                )
            case "/login":
                return (
                    <nav>
                        {/* <NavLink id="nav-1" className="link" to="login">Login</NavLink> */}
                        <NavLink id="nav-1" className="link" to="/profile">Profile</NavLink>
                        <NavLink id="nav-2" className="link" to="/vote">VOTE!</NavLink>
                    </nav>
                )
            case "/profile":
                return (
                    <nav>
                        <NavLink id="nav-1" className="link" to="/login">Login</NavLink>
                        {/* <NavLink id="nav-2" className="link" to="profile">Profile</NavLink> */}
                        <NavLink id="nav-2" className="link" to="/vote">VOTE!</NavLink>
                    </nav>
                )
            case "/vote":
            return (
                <nav>
                    <NavLink id="nav-1" className="link" to="/login">Login</NavLink>
                    <NavLink id="nav-2" className="link" to="/profile">Profile</NavLink>
                    {/* <NavLink id="nav-3" className="link" to="vote">VOTE!</NavLink> */}
                </nav>
            )
        }
    }

    return (
        <BrowserRouter>
            <div className="body">
                <header>
                    <img id="logo" src="/Images/vote together_white.png"/>
                    {/* <nav> router */}
                    <Routes>
                        <Route path="/" element={<Nav path={"/"} />} />
                        <Route path="/login" element={<Nav path={"/login"} />} />
                        <Route path="/profile" element={<Nav path={"/profile"} />} />
                        <Route path="/vote" element={<Nav path={"/vote"} />} />
                    </Routes>
                    
                </header>
                {/* <main> router */}
                <Routes>
                    <Route path="/" element={<Login invalidPass={invalidPass} handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/login" element={<Login invalidPass={invalidPass} handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/profile" element={<Profile handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} voteHistory={voteHistory} />} />
                    <Route path="/vote" element={<Vote currentUser={currentUser} loggedIn={loggedIn} voted={voted} handleVote={() => handleVote()} question={question} currentQuestionVotes={currentQuestionVotes} />} />
                    <Route path="*" element={<UnknownPath />} />
                </Routes>
                
                <footer>
                    <div className="no-format">
                        <p><a className="link" href="https://github.com/epbay01/startup">github repository</a></p>
                        <p>website by: <a className="link" href="mailto:epbay01@byu.edu">elijah bay</a></p>
                        <img width="200px" src="/Images/IMG_8451.png" alt="Picture of the creator, Elijah Bay"/>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    )
}