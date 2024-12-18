import React from "react";
import { BrowserRouter, Route, Routes, NavLink, redirect } from "react-router-dom";

import Login from "./login/login.jsx";
import Profile from "./profile/profile.jsx";
import Vote from "./vote/vote.jsx";
import UnknownPath from "./unknown.jsx";

import { Question } from "./questionClass.js";
import { WebSocketHandler } from "./websocketHandling.js";

import "./style.css";
import "./login/login-style.css";
import "./profile/profile-style.css";
import "./vote/vote-style.css";

export default function App() {
    const [currentUser, setCurrentUser] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [voted, setVoted] = React.useState(false);
    const [invalidPass, setInvalidPass] = React.useState(false);
    const [question, setQuestion] = React.useState(new Question());
    const [currentQuestionVotes, setCurrentQuestionVotes] = React.useState(new Object());
    const [currentUserObject, setCurrentUserObject] = React.useState({
        username: "",
        password: "",
        currentStreak: 0,
        highestStreak: 0,
        popVote: 0,
        unpopVote: 0,
        confirmVotes: false,
        notifications: true,
        votedToday: false,
        userHistory: {},
        token: ""
    });
    const [techyPhrase, setTechyPhrase] = React.useState("Programming is pretty neat.");
    const [wsHandler, setWsHandler] = React.useState();


    async function getNewQuestion() {
        let cqvCopy = currentQuestionVotes;
        let qRes = new Object();
        cqvCopy = new Object();

        fetch("/api/question")
            .then(async (res) => {
                if (res.body !== "") {
                    qRes = await res.json();
                    qRes.answers.forEach(element => {
                        cqvCopy[element] = 0;
                    });
                } else console.log("empty body");
            })
            .catch((err) => console.log("question fetch error: " + err))
            .finally((res) => {
                console.log("cqvCopy: " + JSON.stringify(cqvCopy));
                setCurrentQuestionVotes(cqvCopy);
                localStorage.setItem("questionVotes", JSON.stringify(cqvCopy));
                let temp = new Question(qRes.question, qRes.answers);
                console.log(JSON.stringify(temp.toJSON()));
                setQuestion(temp);
                return temp;
            })
    }

    
    async function handleVote(ans) {
        if (!currentUserObject.votedToday) {
            await wsHandler.sendVote(ans, setCurrentQuestionVotes); // replaces vote api, sends to all users
            

            // the rest of this is for the user vote history and local vars
            console.log(ans);
            setVoted(true);
            let temp = currentQuestionVotes;
            await fetch(`/api/vote/current`).then(async (res) => temp = await res.json());
            setCurrentQuestionVotes(temp);
            console.log("current question votes: " + JSON.stringify(temp));
            let now = new Date();
            let strDate = `${now.getMonth() + 1}.${now.getDate()}.${now.getFullYear()}`;

            let cuo = currentUserObject;
            cuo.userHistory[strDate] = [question.question, ans];
            cuo.votedToday = true;
            cuo.currentStreak++;
            setCurrentUserObject(cuo);
            console.log("cuo in handleVote: " + JSON.stringify(cuo));

            // update user on server
            fetch(`/api/user/update`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(cuo)
            })
                .catch((err) => console.log(err));

        //     // push to vote api, will update current/history
        //     fetch(`/api/vote/${strDate}`, {
        //         method: "PUT",
        //         headers: {"Content-Type": "application/json"},
        //         body: JSON.stringify(temp)
        //     })
        } else {
            console.log("already voted today");
        }
    }


    async function handleLogin(user, pass, logged) {
        if (!logged) { // logout
            let res = await fetch(`/api/auth/logout`, {method: "POST"});
            setCurrentUser("");
            setLoggedIn(false);
            setVoted(false);
            setCurrentUserObject(null);
            return "/";
        } else {
            let cuo = currentUserObject;
            if (cuo !== null) {
                cuo.username = user;
                cuo.password = pass;
            } else {
                cuo = {
                    username: user,
                    password: pass,
                    token: ""
                };
            }
            let res = await fetch(`/api/auth/login?token=${cuo.token}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(cuo)
            });
            console.log(`login response: ${res.status}`);
            switch (res.status) {
                case 404: // user not found
                    setCurrentUserObject(null); // set in createUser
                    setInvalidPass(false);
                    setCurrentUser(user);
                    setVoted(false);
                    if (user !== "") await createUser(user, pass);
                    break;
                case 200: // logged in
                    try {
                        cuo = await res.json();
                    } catch (err) {
                        console.log(err);
                    }
                    setInvalidPass(false);
                    setCurrentUser(user);
                    setCurrentUserObject(cuo);
                    setLoggedIn(true);
                    setVoted(cuo.votedToday);
                    break;
                case 401: // unauthorized
                    setCurrentUserObject(null);
                    setInvalidPass(true);
                    setCurrentUser("");
                    setLoggedIn(false);
                    setVoted(false);
                    break;
                default:
                    console.log("default case");
                    break;
            }
        }

        return (invalidPass ? "/" : "/vote");
    }

    async function createUser(user, pass) {
        let res = await fetch(`/api/user/new`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: user, password: pass})
        });
        setCurrentUserObject(await res.json());
        setCurrentUser(user.username);
    }

    React.useEffect(() => {
        async function f() {
            await getNewQuestion();
            let cqv = await (await fetch("/api/vote/current")).json();
            setCurrentQuestionVotes(cqv);
            setWsHandler(new WebSocketHandler(setCurrentQuestionVotes));
            let techRes = await fetch("https://techy-api.vercel.app/api/json");
            let techy = await techRes.json();
            setTechyPhrase(`"${techy.message}."`);
        }
        f();
    }, []);


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
                    <Route path="/" element={<Login invalidPass={invalidPass} handleLogin={async (u, p, l) => await handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/login" element={<Login invalidPass={invalidPass} handleLogin={async (u, p, l) => await handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/profile" element={<Profile handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} currentUserObject={currentUserObject} loggedIn={loggedIn} setCurrentUserObject={(obj) => setCurrentUserObject(obj)} />} />
                    <Route path="/vote" element={<Vote currentUser={currentUser} setCurrentUserObject={currentUserObject} loggedIn={loggedIn} voted={voted} handleVote={(ans) => handleVote(ans)} question={question} currentQuestionVotes={currentQuestionVotes} currentUserObject={currentUserObject} />} />
                    <Route path="*" element={<UnknownPath />} />
                </Routes>
                
                <footer>
                    <div className="no-format">
                        <p id="techy-phrase">{techyPhrase}</p>
                        <p><a className="link" href="https://github.com/epbay01/startup">github repository</a></p>
                        <p>website by: <a className="link" href="mailto:epbay01@byu.edu">elijah bay</a></p>
                        <img width="200px" src="/Images/IMG_8451.png" alt="Picture of the creator, Elijah Bay"/>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    )
}