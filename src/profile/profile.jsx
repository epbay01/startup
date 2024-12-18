import React from "react";
import ReactDOM from "react-dom";

export default function Profile ({ handleLogin, currentUser, currentUserObject, loggedIn, setCurrentUserObject }) {    
    const [confirmVotesState, setConfirmVotesState] = React.useState(false);
    const [notificationsState, setNotificationsState] = React.useState(true);

    // React.useEffect(() => {
    //     async function f() {
    //         if (currentUser === "") {
    //             setCurrentUserObject(null);
    //         } else {
    //             let res = await fetch(`http://localhost:4000/api/user/${currentUser}`);
    //             setCurrentUserObject(await res.json());
    //         }
    //     }
    //     f();
    //     console.log(JSON.stringify(currentUserObject) + "is current user object in profile");
    // }, [currentUser, loggedIn]);
    
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
        let cuo = currentUserObject;
        cuo.confirmVotes = confirm;
        cuo.notifications = notif;
        await fetch(`/api/user/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cuo)
        })
            .catch((err) => console.log(err));
        
        setCurrentUserObject(cuo);
    };

    async function deleteUser() {
        await fetch(`/api/user/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentUserObject)
        });
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
                    Most popular vote: {currentUserObject.popVote}<br/>
                    Least popular vote: {currentUserObject.unpopVote}
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
    const [voteHistory, setVoteHistory] = React.useState({});
    const [tableElementsState, setTableElementsState] = React.useState([]);

    React.useEffect(() => {
        async function f() {
            let tableElements = [];
            let res = await fetch("/api/vote/all");
            setVoteHistory(await res.json());
            console.log("vote history = " + JSON.stringify(voteHistory));

            let userHistory = new Object();
            userHistory = currentUserObject.userHistory;
            for (let i = 0; i < Object.keys(userHistory).length; i++) {
                let q = userHistory[Object.keys(userHistory)[i]];

                let globalVotes = {};
                globalVotes = await getVoteCount(Object.keys(userHistory)[i]);
                console.log("globalVotes: " + JSON.stringify(globalVotes));
                let answerArray = [];
                for (const j in globalVotes) {
                    answerArray.push(<p>{j}: {globalVotes[j]}<br/></p>);
                    //answerP.body += <p>{j}: {globalVotes[j]}<br/></p>;
                }
                if (answerArray.length === 0) {
                    answerArray.push(<p>No data</p>);
                }

                tableElements.push(
                    <tr key={"vrt-row-" + i} className="vrt-data-row">
                        <td key={"vrt-date-" + i}>{Object.keys(userHistory)[i]}</td>
                        <td key={"vrt-q-" + i}>{q[0]}</td>
                        <td key={"vrt-res-" + i}>{q[1]}</td>
                        <td key={"vrt-global-" + i}>{answerArray}</td>
                    </tr>
                )
            }
            setTableElementsState(tableElements);
        }
        f();
    }, []);

    async function getVoteCount(date) {
        try {
            let res = await fetch(`/api/vote/date/${date}`);
            return await res.json();
        } catch {
            return {};
        }
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
                    {tableElementsState}
                </tbody>
            </table>
        </div>
    )
}