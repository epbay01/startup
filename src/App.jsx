import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "./login-style.css";
import "./profile-style.css";
import "./vote-style.css";

export default function App() {
    return <div className="body">
        <header>
            <img id="logo" src="/Images/vote together_white.png"/>
            <nav>
                <a id="nav-1" class="link" href="profile.html">Profile</a>
                <a id="nav-2" class="link" href="vote.html">VOTE!</a>
            </nav>
        </header>
        <main></main>
    </div>
}