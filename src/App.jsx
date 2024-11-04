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

export default function App() {
    const [currentUser, setCurrentUser] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);

    const states = [currentUser, loggedIn];
    const setStates = [setCurrentUser, setLoggedIn];

    function onChange(index, value) {
        setStates[index](value);
    }

    return (
        <BrowserRouter>
            <div className="body">
                <header>
                    <img id="logo" src="/Images/vote together_white.png"/>
                    <nav>
                        <NavLink id="nav-1" className="link" to="login">Login</NavLink>
                        <NavLink id="nav-2" className="link" to="profile">Profile</NavLink>
                        <NavLink id="nav-3" className="link" to="vote">VOTE!</NavLink>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Login onChange={(i, v) => onChange(i,v)} states={states} />} />
                    <Route path="/login" element={<Login onChange={(i, v) => onChange(i,v)} states={states} />} />
                    <Route path="/profile" element={<Profile states={states} />} />
                    <Route path="/vote" element={<Vote states={states} />} />
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