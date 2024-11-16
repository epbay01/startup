import React from "react";
import ReactDOM from "react-dom";

export default function Profile ({ handleLogin, currentUser, loggedIn }) {    
    const [confirmVotesState, setConfirmVotesState] = React.useState(false);
    const [notificationsState, setNotificationsState] = React.useState(true);
    const [currentUserObject, setCurrentUserObject] = React.useState({
        password: "",
        currentStreak: 0,
        highestStreak: 0,
        popVote: 0,
        unpopVote: 0,
        confirmVotes: false,
        notifications: true,
        votedToday: false,
        userHistory: {}
    });

    React.useEffect(() => {
        async function f() {
            if (currentUser === "") {
                setCurrentUserObject(null);
            } else {
                let res = await fetch(`http://localhost:4000/api/user/${currentUser}`);
                setCurrentUserObject(await res.json());
            }
        }
        f();
        console.log(JSON.stringify(currentUserObject) + "is current user object in profile");
    }, [currentUser, loggedIn]);
    
    if (!loggedIn) {
        return (
            <div className="main" id="profile-main">
                <h2>Please log in or make an account!</h2>
            </div>
        )
    }

    async function updateUser(confirm, notif) {
        setConfirmVotesState(confirm);
        setNotificationsState(notif);
        currentUserObject.confirmVotes = confirm;
        currentUserObject.notifications = notif;
        await fetch(`http://localhost:4000/api/user/update/${currentUser}`, {
            method: "PUT",
            body: JSON.stringify(currentUserObject)
        })
            .catch((err) => console.log(err));
    };

    async function deleteUser() {
        await fetch(`http://localhost:4000/api/user/delete/${currentUser}`, {method: "DELETE"});
        await handleLogin("","",false);
    }

    return (
        <div className="main" id="profile-main">
            <h2>{currentUser}</h2>
            <div>
                <h3>Settings and account info</h3>
                <h4>Account info</h4>
                <p>
                    Current streak: {currentUserObject.currentStreak} &#128293;<br/>
                    Highest streak: {currentUserObject.highestStreak} &#128293;<br/>
                    Friend invites: 1<br/>
                    Most popular vote: {currentUserObject.popVote}%<br/>
                    Least popular vote: {currentUserObject.unpopVote}%
                </p>
                <h4>Settings</h4>
                <div className="no-format" id="settings">
                    <span className="checkbox-setting"><label>Confirm votes?</label><input type="checkbox" checked={confirmVotesState} onChange={() => updateUser(!confirmVotesState, notificationsState)} /></span>
                    <span className="checkbox-setting"><label>Daily notifications?</label><input type="checkbox" checked={notificationsState} onChange={() => updateUser(confirmVotesState, !notificationsState)} /></span>
                    <input id="delete-button" type="button" value="Delete account" onClick={() => deleteUser()} />
                </div>
            </div>
            <VoteTable currentUserObject={currentUserObject} />
        </div>
    )
}

function VoteTable ({ currentUserObject }) {
    let tableElements = [];
    let voteHistory = new Object();

    React.useEffect(() => {
        async function f() {
            let res = await fetch("http://localhost:4000/api/vote/all");
            voteHistory = await res.json();
            console.log("vote history = " + JSON.stringify(voteHistory));
        }
        f();
    }, []);

    function getVoteCount(q) {
        if (voteHistory[q] === undefined) return { "": 0 }
        return voteHistory[q]; // returns subobject with answers and votes
    }

    let userHistory = new Object();
    userHistory = currentUserObject.userHistory;
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