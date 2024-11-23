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


    async function getNewQuestion() {
        let cqvCopy = currentQuestionVotes;
        let qRes = new Object();

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
            console.log(ans);
            setVoted(true);
            let temp = currentQuestionVotes;
            temp[ans]++;
            setCurrentQuestionVotes(temp);
            console.log("current question votes: " + JSON.stringify(temp));
            let now = new Date();
            let strDate = `${now.getMonth()}.${now.getDay()}.${now.getFullYear()}`;

            let cuo = currentUserObject;
            cuo.userHistory[strDate] = [question.question, ans];
            cuo.votedToday = true;
            cuo.currentStreak++;
            setCurrentUserObject(cuo);
            console.log("cuo in handleVote: " + JSON.stringify(cuo));

            // update user on server
            fetch(`http://localhost:4000/api/user/update`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(cuo)
            })
                .catch((err) => console.log(err));

            // push to vote api, will update current/history
            fetch(`http://localhost:4000/api/vote/${strDate}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(temp)
            })
        } else {
            console.log("already voted today");
        }
    }


    async function handleLogin(user, pass, logged) {
        if (!logged) { // logout
            let res = await fetch(`http://localhost:4000/api/auth/logout`, {method: "POST"});
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
            let res = await fetch(`http://localhost:4000/api/auth/login?token=${cuo.token}`, {
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
        let res = await fetch(`http://localhost:4000/api/user/new`, {
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
            let techRes = await fetch("https://techy-api.vercel.app/api/json");
            let techy = await techRes.json();
            setTechyPhrase(`"${techy.message}."`);

            let now = new Date();
            let userDB = [];
            if (now.getHours() === 0 && now.getMinutes() === 0 && now.getMilliseconds() === 0) {
                setVoted(false);
                await getNewQuestion();
    
                fetch(`http://localhost:4000/api/user/all`)
                    .then(async (res) => {
                        if (res.status !== 404 || res.status !== 401) {
                            userDB = await res.json();
                        } else userDB = null;
                    });
                console.log(`userDB = ${userDB}`);
                if (userDB !== null) {
                    userDB.data.forEach(async (user) => {
                        let temp = userDB[user];
                        fetch(`http://localhost:4000/api/user/update`, {
                            method: "PUT",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(temp)
                        })
                    })
                }
            }
        }
        f();
    }, [])

    React.useEffect(() => { // TEMPORARY!!!
        let f = async () => {return await getNewQuestion()}
        voted ? setQuestion(f()) : 0;
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
                    <Route path="/" element={<Login invalidPass={invalidPass} handleLogin={async (u, p, l) => await handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/login" element={<Login invalidPass={invalidPass} handleLogin={async (u, p, l) => await handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/profile" element={<Profile handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
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