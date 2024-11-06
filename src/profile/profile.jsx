import React from "react";
import ReactDOM from "react-dom";

export default function Profile ({ currentUser, loggedIn }) {
    if (!loggedIn) {
        return (
            <div className="main" id="profile-main">
                <h2>Please log in or make an account!</h2>
            </div>
        )
    }

    return (
        <div className="main" id="profile-main">
            <h2>{currentUser}</h2>
            <div>
                <h3>Settings and account info</h3>
                <h4>Account info</h4>
                <p>
                    Highest streak: 5 &#128293;<br/>
                    Friend invites: 1<br/>
                    Most popular vote: 89%<br/>
                    Least popular vote: 32%
                </p>
                <h4>Settings</h4>
                <div className="no-format" id="settings">
                    <span className="checkbox-setting"><label>Confirm votes?</label><input type="checkbox" /></span>
                    <span className="checkbox-setting"><label>Daily notifications?</label><input type="checkbox" checked /></span>
                    <input id="delete-button" type="button" value="Delete account" />
                </div>
            </div>
            <div id="vr-div">
                <h3>Voting record</h3>
                <table id="vrt">
                    <tr id="vrt-header-row">
                        <th>Date</th>
                        <th>Question</th>
                        <th>Your response</th>
                        <th>Total response</th>
                    </tr>
                    <tr class="vrt-data-row">
                        <td>1/1/24</td>
                        <td>Which came first, the chicken or egg?</td>
                        <td>Chicken</td>
                        <td>46% Chicken<br />54% Egg [visual]</td>
                    </tr>
                    <tr class="vrt-data-row">
                        <td>1/1/24</td>
                        <td>Which came first, the chicken or egg?</td>
                        <td>Chicken</td>
                        <td>46% Chicken<br />54% Egg [visual]</td>
                    </tr>
                    <tr class="vrt-data-row">
                        <td>1/1/24</td>
                        <td>Which came first, the chicken or egg?</td>
                        <td>Chicken</td>
                        <td>46% Chicken<br />54% Egg [visual]</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}