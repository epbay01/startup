import React from "react";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Login from "./login/login.jsx";
import Profile from "./profile/profile.jsx";
import Vote from "./vote/vote.jsx";

import "./style.css";
import "./login/login-style.css";
import "./profile/profile-style.css";
import "./vote/vote-style.css";
import UnknownPath from "./unknown.jsx";

/*
TODO:
- lift up currentQuestionVotes (cqv) from <vote>
- implement handleVote()
- send data from cqv back down to <profile> and <vote>
- possibly make it so login button doesn't send to vote page when password is refused, or add a message indicating wrong password
*/

export default function App() {
    const [currentUser, setCurrentUser] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [voted, setVoted] = React.useState(false);

    const [invalidPass, setInvalidPass] = React.useState(false);

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
    }

    function handleVote() {
        setVoted(true);
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
                    <Route path="/" element={<Login handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} invalidPass={invalidPass} />} />
                    <Route path="/login" element={<Login handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/profile" element={<Profile handleLogin={(u, p, l) => handleLogin(u,p,l)} currentUser={currentUser} loggedIn={loggedIn} />} />
                    <Route path="/vote" element={<Vote currentUser={currentUser} loggedIn={loggedIn} voted={voted} handleVote={() => handleVote()} />} />
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