import React from "react";
import ReactDOM from "react-dom";
import { redirect } from "react-router-dom";
import * as questionsJson from "./questions.json" assert { type: "json" };

class Question {
    constructor(question = "", answers = []) {
        this.question = question;
        this.answers = answers;
    }
}

export default function Vote ({ currentUser, loggedIn, voted, handleVote }) {
    const [question, setQuestion] = React.useState(new Question());
    const [currentQuestionVotes, setCurrentQuestionVotes] = React.useState(new Object());
    let user;
    loggedIn ? user = JSON.parse(localStorage.getItem(currentUser)) : user = { currentStreak: 0 };
    let qArray = [];

    function generateQuestions() { // generates array of questions from json file
        let questionArray = []
        for (let i = 0; i < questionsJson.questionArray.length; i++) {
            questionArray.push(new Question(questionsJson.questionArray[i].question, questionsJson.questionArray[i].answers))
        }
        return questionArray;
    }

    React.useEffect(() => {
        qArray = generateQuestions();
        if (question.question === "") {
            setQuestion(getNewQuestion());
        }
        return;
    }, []); // should only trigger once

    function getNewQuestion() {
        let qIndex = Math.floor(Math.random() * qArray.length);
        console.log("new question at index " + qIndex + ": " + qArray[qIndex].question);

        let cqvCopy = currentQuestionVotes;

        qArray[qIndex].answers.forEach(element => {
            cqvCopy[element] = 0;
        });
        console.log(JSON.stringify(cqvCopy));
        setCurrentQuestionVotes(cqvCopy);

        return qArray[qIndex]; // get random question from array
    }

    if (!loggedIn) {
        return (
            <div className="main" id="vote-main">
                <h2>Please log in or make an account!</h2>
            </div>
        )
    } else {
        let now = new Date();
        console.log(now);
        if (now.getHours() === 15 && now.getMinutes() === 0 && now.getMilliseconds() === 0) {
            setQuestion(getNewQuestion());
        } // at 15:00 for one milisecond (3:00pm every day)

        return (
            <div className="main" id="vote-main"> 
                <div className="no-format" id="question-and-streak">
                    <h2 id="question">Question: {question.question}</h2>
                    <h3 id="streak">Your streak: {user.currentStreak} &#128293;</h3>
                </div>

                <VoteButtons answers={question.answers} />

                <ResultsTable currentQuestionVotes={currentQuestionVotes} voted={voted} />
            </div>
        )
    }
}

function VoteButtons ({ answers }) {
    if (answers.length === 2) {
        return (
            <div className="no-format" id="input-buttons">
                <div className="no-format" id="left-buttons">
                    <p>{answers[0]}</p>
                </div>
                <div className="no-format" id="right-buttons">
                    <p>{answers[1]}</p>
                </div>
            </div>
        )
    } else if (answers.length === 4) {
        return (
            <div className="no-format" id="input-buttons">
                <div id="left-buttons" className="no-format">
                    <p>{answers[0]}</p>
                    <button>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 200 A200 200 90 0 1 200 0 L200 80 A120 120 90 0 0 80 200 L0 200 Z" fill="green"/>
                        </svg>
                    </button>
                    <button>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 A200 200 90 0 0 200 200 L200 120 A120 120 90 0 1 80 0 L0 0 Z" fill="blue"/>
                        </svg>
                    </button>
                    <p>{answers[1]}</p>
                </div>
                <div id="right-buttons" className="no-format">
                    <p>{answers[2]}</p>
                    <button>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 A200 200 90 0 1 200 200 L120 200 A120 120 90 0 0 0 80 L0 0 Z" fill="orange"/>
                        </svg>
                    </button>
                    <button>
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
    if (!voted) {
        return;
    } else {
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