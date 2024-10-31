import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Login from "./login/login.jsx";
import Profile from "./profile/profile.jsx";
import Vote from "./vote/vote.jsx";

import "./style.css";
import "./login-style.css";
import "./profile-style.css";
import "./vote-style.css";

export default function App() {
    return (
    <BrowserRouter>
        <div className="body">
            <header>
                <img id="logo" src="/Images/vote together_white.png"/>
                <nav>
                    <NavLink id="nav-1" className="link" to="profile">Profile</NavLink>
                    <NavLink id="nav-2" className="link" to="vote">VOTE!</NavLink>
                    {/* <NavLink id="nav-3" className="link" to="login">Login</NavLink> */}
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/vote" element={<Vote />} />
            </Routes>
            
            <footer>
                <div>
                    <p><a className="link" href="https://github.com/epbay01/startup">github repository</a></p>
                    <p>website by: <a className="link" href="mailto:epbay01@byu.edu">elijah bay</a></p>
                    <img width="200px" src="public/Images/IMG_8451.png" alt="Picture of the creator, Elijah Bay"/>
                </div>
            </footer>
        </div>
    </BrowserRouter>
    )
}