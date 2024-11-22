import React, { useState } from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";

export default function Login({ invalidPass, handleLogin, currentUser = "youremail@website.com", loggedIn = false }) {
    let [logout, setLogout] = React.useState(<></>)
    let [username, setUsername] = React.useState(currentUser);
    let [password, setPassword] = React.useState("");
    let [invalidText, setInvalidText] = React.useState(<></>);

    React.useEffect(() => {
        if (loggedIn.valueOf()) {
            setLogout(
                <input id="logout-button" type="button" value="Logout" onClick={() => handleLogin("", "", false)} />
            );
        } else {
            setLogout(<></>);
        }
    }, [loggedIn]);

    React.useEffect(() => {
        invalidPass ? setInvalidText(<p className="no-format" id="invalid-pass">Invalid password. Please try again.</p>) : setInvalidText(<></>);
        //console.log("set html");
    }, [invalidPass]);

    return (
        <div className="main" id="login-main">
            {/* <!-- <br> --> */}

            <div className="no-format" id="info">
                <div id="about">
                    <div className="no-format">
                        <h3>About</h3>
                        <p>
                            Have you ever wondered, for some common questions, what people really think? Which did come first, the chicken, or the egg? In this web application, these questions will finally be answered. Based on an old Wii app, this website will have new questions daily, then keep track of the universal response to that question. Each user votes, and adds to a base tally, so that people from anywhere can vote and see others' opinions.
                        </p>
                    </div>
                    <img src="/Images/sample_question.png" alt="Example question: What color best matches your personality?"/>
                </div>

                <div>
                    <h3>Getting Started</h3>
                    <p>To get started:</p>
                    <ol>
                        <li>Make an account by inputting your email and password here</li>
                        <li>Click "Vote!" (if not redirected) to cast your first global vote on our poll</li>
                        <li>You can only vote once a day, but make sure to go to the "Profile" page to see yesterday's results</li>
                        <li>As you vote on consecutive days, your streak will grow! Try and get the highest streak you can!</li>
                        <li>Adjust any other settings on the "Profile" page as well!</li>
                        <li>Enjoy a global togetherness as we see what together, we vote for!</li>
                    </ol>
                </div>
            </div>
            <div className="no-format" id="login-and-pic">
                <div id="login">
                    <h3>Login</h3>
                    <span id="email" className="no-format"><p className="login-element">Email: </p><input className="login-element" type="text" value={username} onChange={(t) => setUsername(t.target.value)} /></span>
                    <span id="password" className="no-format"><p className="login-element">Password: </p><input className="login-element" type="text" value={password} onChange={(t) => setPassword(t.target.value)} /></span>
                    <input id="login-button" type="button" value="Submit" onClick={() => handleLogin(username, password, true)} /> {/* the nav redirection doesn't totally work, it happens before handleLogin/state updates */}
                    {logout}
                    {invalidText}
                </div>
                <div id="world-pic"><img src="Images/the-new-york-public-library-yEauzeZU6xo-unsplash.jpg" alt="Picture of earth"/></div>
            </div>
        </div>
    )
}