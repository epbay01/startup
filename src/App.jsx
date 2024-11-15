import React from "react";
import { BrowserRouter, Route, Routes, NavLink, redirect } from "react-router-dom";

import Login from "./login/login.jsx";
import Profile from "./profile/profile.jsx";
import Vote from "./vote/vote.jsx";
import UnknownPath from "./unknown.jsx";

import { Question } from "./questionClass.js";

import "./style.css";
import "./login/login-style.css";
import "./profile/profile-style.css";
import "./vote/vote-style.css";

//import * as questionsJson from "./questions.json" assert { type: "json" };

/*
TODO:
- implement handleVote()
- send data from cqv back down to <profile> and <vote>
- possibly make it so login button doesn't send to vote page when password is refused, or add a message indicating wrong password
*/

export default function App() {
    const [currentUser, setCurrentUser] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [voted, setVoted] = React.useState(false);
    const [invalidPass, setInvalidPass] = React.useState(false);
    const [voteHistory, setVoteHistory] = React.useState([]);
    const [question, setQuestion] = React.useState(new Question());
    const [currentQuestionVotes, setCurrentQuestionVotes] = React.useState(new Object());
    let qArray;


    function getNewQuestion() {
        let cqvCopy = currentQuestionVotes;
        let qRes;

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
            let temp2 = voteHistory;
            let temp3 = question.question;
            temp2.push({
                temp3: cqvCopy
            });
            setVoteHistory(temp2);
        }

        fetch("startup.vote-together.click/api/question")
            .then((res) => {
                if (res.body !== "") {
                    res.json().then((data) => {
                        qRes = data;
                        qRes.answers.forEach(element => {
                            cqvCopy[element] = 0;
                        });
                    })
                    .catch((err) => {
                        console.log("JSON parse error: " + err);
                    });
                } else console.log("empty body");
            })
            .catch((err) => console.log("question api error: " + err))
            .finally(() => {
                cqvCopy = new Object();
                console.log(JSON.stringify(cqvCopy));
                setCurrentQuestionVotes(cqvCopy);
                localStorage.setItem("questionVotes", JSON.stringify(cqvCopy));
                return qRes;
            });
    }

    function handleVote(ans) {
        let tempUser = JSON.parse(localStorage.getItem(currentUser));
        if (!tempUser.votedToday) {
            console.log(ans);
            setVoted(true);
            let temp = currentQuestionVotes;
            temp[ans]++;
            setCurrentQuestionVotes(temp);
            let now = new Date();
            let strDate = `${now.getMonth()}/${now.getDay()}/${now.getFullYear()}`;
            tempUser.userHistory[strDate] = [question.question, ans];

            tempUser.votedToday = true;
            tempUser.currentStreak++;
            localStorage.setItem(currentUser, JSON.stringify(tempUser));
        } else {
            console.log("already voted today");
        }
    }


    function handleLogin(user, pass, logged) {
        if ((localStorage.getItem(user) !== null) && user !== "") {
            let temp = JSON.parse(localStorage.getItem(user));
            if (pass === temp.password) {
                setInvalidPass(false);
                setCurrentUser(user);
                setLoggedIn(logged);
                setVoted(temp.votedToday);
            } else {
                console.log("invalid password");
                setInvalidPass(true);
            }
        } else {
            setInvalidPass(false);
            createUser(user, pass);
            setCurrentUser(user);
            setLoggedIn(logged);
            setVoted(false);
        }

        return (invalidPass ? "/" : "/vote");
    }

    function createUser(user, pass) {
        let userDb = localStorage.getItem("userDatabase");
        let parsed;
        if (userDb === null) {
            let temp = {"key":[]};
            localStorage.setItem("userDatabase", JSON.stringify(temp));
            userDb = localStorage.getItem("userDatabase");
        }
        parsed = JSON.parse(userDb);
        if (user in parsed["key"]) {
            console.log("user already exists");
            return;
        }
        let userStats = {
            password: pass,
            currentStreak: 0,
            highestStreak: 0,
            popVote: 0,
            unpopVote: 0,
            confirmVotes: false,
            notifications: true,
            votedToday: false,
            userHistory: {}
        }
        localStorage.setItem(user, JSON.stringify(userStats));
        parsed["key"].push(user);
        localStorage.setItem("userDatabase", JSON.stringify(parsed));
    }


    React.useEffect(() => {
        if (question.question === "") {
            setQuestion(getNewQuestion());
        }
    }, [])

    React.useEffect(() => {
        let now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getMilliseconds() === 0) {
            setVoted(false);
            setQuestion(getNewQuestion());

            if (localStorage.getItem("userDatabase") !== null) {
                let userDatabase = JSON.parse(localStorage.getItem("userDatabase"));
                userDatabase["key"].forEach((item) => {
                    let tempUser = localStorage.getItem(item);
                    if (tempUser !== null) {
                        if (tempUser.votedToday === false) tempUser.currentStreak = 0;
                        tempUser.votedToday = false;
                        if (tempUser.currentStreak > tempUser.highestStreak) {
                            tempUser.highestStreak = tempUser.currentStreak;
                        }
                    }
                    localStorage.setItem(item, JSON.stringify(tempUser));
                })
            }
        } // at 0:00 for one milisecond (12:00am every day)
    })

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
                    <Route path="/vote" element={<Vote currentUser={currentUser} loggedIn={loggedIn} voted={voted} handleVote={(ans) => handleVote(ans)} question={question} currentQuestionVotes={currentQuestionVotes} />} />
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