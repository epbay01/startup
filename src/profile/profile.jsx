import React from "react";
import ReactDOM from "react-dom";

/*
TODO:
- make table give data
- possibly make a visual/bar graph? can be achieved with a colored box and a variable length
*/

export default function Profile ({ handleLogin, currentUser, loggedIn, voteHistory }) {    
    const [confirmVotesState, setConfirmVotesState] = React.useState(false);
    const [notificationsState, setNotificationsState] = React.useState(true);
    
    let userObj = { // default
        currentStreak : 0,
        highestStreak : 0,
        popVote : 0,
        unpopVote : 0,
        confirmVotes: false,
        notifications: true,
        votedToday: false,
        userHistory: {}
    }

    if (currentUser !== "") userObj = JSON.parse(localStorage.getItem(currentUser));
    
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

    function deleteUser() {
        localStorage.removeItem(currentUser);
        handleLogin("","",false);
    }

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
                    <input id="delete-button" type="button" value="Delete account" onClick={() => deleteUser()} />
                </div>
            </div>
            <VoteTable userObj={userObj} voteHistory={voteHistory} />
        </div>
    )
}

function VoteTable ({ userObj, voteHistory }) {
    let tableElements = [];

    function getVoteCount(q) {
        if (voteHistory[q] === undefined) return { "": 0 }
        return voteHistory[q]; // returns subobject with answers and votes
    }

    let userHistory = new Object();
    userHistory = userObj.userHistory;
    for (let i = 0; i < Object.keys(userHistory).length; i++) {
        let q = userHistory[Object.keys(userHistory)[i]];

        let answerStr = "";
        for (let j = 0; j < Object.keys(getVoteCount(q)).length; j++) {
            answerStr.concat(Object.keys(getVoteCount(q))[j]);
            answerStr.concat(" ");
            answerStr.concat(Object.values(getVoteCount(q))[j].toString());
            answerStr.concat("\n");
        }

        tableElements.push(
            <tr key={"vrt-row-" + i} className="vrt-data-row">
                <td key={"vrt-date-" + i}>{Object.keys(userHistory)[i]}</td>
                <td key={"vrt-q-" + i}>{q[0]}</td>
                <td key={"vrt-res-" + i}>{q[1]}</td>
                <td key={"vrt-global-" + i}>{answerStr}</td>
            </tr>
        )
    }

    return (
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
                    {tableElements}
                </tbody>
            </table>
        </div>
    )
}