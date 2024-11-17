import React from "react";
import ReactDOM from "react-dom";
import { redirect } from "react-router-dom";

export default function Vote ({ currentUser, loggedIn, voted, handleVote, question, currentQuestionVotes }) {
    let user = {
        password: "",
        currentStreak: 0,
        highestStreak: 0,
        popVote: 0,
        unpopVote: 0,
        confirmVotes: false,
        notifications: true,
        votedToday: false,
        userHistory: {}
    }

    React.useEffect(() => {
        async function f() {
            await fetch(`http://localhost:4000/api/user/${currentUser}`)
            .then((res) => {
                if (res.status !== 404) {
                    user = res.json();
                } else {
                    user = null;
                }
            })
        }
        f();
    }, [currentUser]);

    if (!loggedIn) {
        return (
            <div className="main" id="vote-main">
                <h2>Please log in or make an account!</h2>
            </div>
        )
    } else {


        return (
            <div className="main" id="vote-main"> 
                <div className="no-format" id="question-and-streak">
                    <h2 id="question">Question: {question.question}</h2>
                    <h3 id="streak">Your streak: {user.currentStreak} &#128293;</h3>
                </div>

                <VoteButtons answers={Object.keys(currentQuestionVotes)} handleVote={handleVote} />

                <ResultsTable currentQuestionVotes={currentQuestionVotes} voted={voted} />
            </div>
        )
    }
}

function VoteButtons ({ answers, handleVote }) {
    if (answers.length === 2) {
        return (
            <div className="no-format" id="input-buttons">
                <div className="no-format" id="left-buttons">
                <p>{answers[0]}</p>
                    <button onClick={() => handleVote(answers[0])}>
                        <svg height="400" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M200 400 A200 200 0 0 1 200 0 L200 80 A120 120 90 0 0 200 320 Z" fill="green"/>
                        </svg>
                    </button>
                </div>
                <div className="no-format" id="right-buttons">
                    <p>{answers[1]}</p>
                    <button onClick={() => handleVote(answers[1])}>
                        <svg height="400" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 A200 200 90 0 1 0 400 L0 320 A120 120 90 0 0 0 80 L0 0 Z" fill="red"/>
                        </svg>
                    </button>
                </div>
            </div>
        )
    } else if (answers.length === 4) {
        return (
            <div className="no-format" id="input-buttons">
                <div id="left-buttons" className="no-format">
                    <p>{answers[0]}</p>
                    <button onClick={() => handleVote(answers[0])}>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 200 A200 200 90 0 1 200 0 L200 80 A120 120 90 0 0 80 200 L0 200 Z" fill="green"/>
                        </svg>
                    </button>
                    <button onClick={() => handleVote(answers[1])}>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 A200 200 90 0 0 200 200 L200 120 A120 120 90 0 1 80 0 L0 0 Z" fill="blue"/>
                        </svg>
                    </button>
                    <p>{answers[1]}</p>
                </div>
                <div id="right-buttons" className="no-format">
                    <p>{answers[2]}</p>
                    <button onClick={() => handleVote(answers[2])}>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 A200 200 90 0 1 200 200 L120 200 A120 120 90 0 0 0 80 L0 0 Z" fill="orange"/>
                        </svg>
                    </button>
                    <button onClick={() => handleVote(answers[3])}>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M200 0 A200 200 90 0 1 0 200 L0 120 A120 120 90 0 0 120 0 L0 0 Z" fill="red"/>
                        </svg>
                    </button>
                    <p>{answers[3]}</p>
                </div>
            </div>
        )
    }
}

function ResultsTable ({ currentQuestionVotes, voted }) {
    const [row1, setRow1] = React.useState([]);
    const [row2, setRow2] = React.useState([]);
    const [row3, setRow3] = React.useState([]);

    React.useEffect(() => {
        let tempRow1 = [];
        let tempRow2 = [];
        let tempRow3 = [];
        let sum = 0;
        for (let i = 0; i < Object.keys(currentQuestionVotes).length; i++) {
            tempRow1.push(<td className={"results-" + (i + 1)} key={"result-" + i}>{Object.keys(currentQuestionVotes)[i]}</td>);
            tempRow3.push(<td className={"results-" + (i + 1)} key={"votes-" + i}>{Object.values(currentQuestionVotes)[i]}</td>);
            sum += Object.values(currentQuestionVotes)[i];
        }
        for (let i = 0; i < Object.keys(currentQuestionVotes).length; i++) {
            let sumOrOther = 0;
            sum === 0 ? sumOrOther = 1 : sumOrOther = sum;
            tempRow2.push(<td className={"results-" + (i + 1)} key={"percent-" + i}>{Math.round((Object.values(currentQuestionVotes)[i] / sumOrOther) * 100)}</td>);
        }
        setRow1(tempRow1);
        setRow2(tempRow2);
        setRow3(tempRow3);
        return;
    }, [voted])

    if (!voted) {
        return;
    } else {
        return (
            <div id="results-div">
                <h3>Results</h3>
                <table id="results">
                    <tbody>
                        <tr id="results-responses">
                            <th>Response</th>
                            {row1}
                        </tr>
                        <tr id="results-percent">
                            <th>%</th>
                            {row2}
                        </tr>
                        <tr id="results-total">
                            <th>Votes</th>
                            {row3}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}