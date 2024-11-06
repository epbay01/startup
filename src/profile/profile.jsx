import React from "react";
import ReactDOM from "react-dom";

export default function Profile ({ currentUser, loggedIn }) {    
    const [confirmVotesState, setConfirmVotesState] = React.useState(false);
    const [notificationsState, setNotificationsState] = React.useState(true);
    
    let userObj = { // default
        currentStreak : 0,
        highestStreak : 0,
        popVote : 0,
        unpopVote : 0,
        confirmVotes: false,
        notifications: true
    }
    
    if (!loggedIn) {
        return (
            <div className="main" id="profile-main">
                <h2>Please log in or make an account!</h2>
            </div>
        )
    } else {
        if (localStorage.getItem(currentUser) !== null) {
            userObj = JSON.parse(localStorage.getItem(currentUser));
        }
    }

    function updateUser(confirm, notif) {
        setConfirmVotesState(confirm);
        setNotificationsState(notif);
        userObj.confirmVotes = confirm;
        userObj.notifications = notif;
        localStorage.setItem(currentUser, JSON.stringify(userObj));
    };

    return (
        <div className="main" id="profile-main">
            <h2>{currentUser}</h2>
            <div>
                <h3>Settings and account info</h3>
                <h4>Account info</h4>
                <p>
                    Current streak: {userObj.currentStreak} &#128293;<br/>
                    Highest streak: {userObj.highestStreak} &#128293;<br/>
                    Friend invites: 1<br/>
                    Most popular vote: {userObj.popVote}%<br/>
                    Least popular vote: {userObj.unpopVote}%
                </p>
                <h4>Settings</h4>
                <div className="no-format" id="settings">
                    <span className="checkbox-setting"><label>Confirm votes?</label><input type="checkbox" checked={confirmVotesState} onChange={() => updateUser(!confirmVotesState, notificationsState)} /></span>
                    <span className="checkbox-setting"><label>Daily notifications?</label><input type="checkbox" checked={notificationsState} onChange={() => updateUser(confirmVotesState, !notificationsState)} /></span>
                    <input id="delete-button" type="button" value="Delete account" />
                </div>
            </div>
            <div id="vr-div">
                <h3>Voting record</h3>
                <table id="vrt">
                    <tbody>
                        <tr id="vrt-header-row">
                            <th>Date</th>
                            <th>Question</th>
                            <th>Your response</th>
                            <th>Total response</th>
                        </tr>
                        <tr className="vrt-data-row">
                            <td>1/1/24</td>
                            <td>Which came first, the chicken or egg?</td>
                            <td>Chicken</td>
                            <td>46% Chicken<br />54% Egg [visual]</td>
                        </tr>
                        <tr className="vrt-data-row">
                            <td>1/1/24</td>
                            <td>Which came first, the chicken or egg?</td>
                            <td>Chicken</td>
                            <td>46% Chicken<br />54% Egg [visual]</td>
                        </tr>
                        <tr className="vrt-data-row">
                            <td>1/1/24</td>
                            <td>Which came first, the chicken or egg?</td>
                            <td>Chicken</td>
                            <td>46% Chicken<br />54% Egg [visual]</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}