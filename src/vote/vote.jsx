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

export default function Vote ({ currentUser, loggedIn }) {
    const [question, setQuestion] = React.useState(new Question());
    let qArray = [];
    let currentQuestionStats = {
        "question": question.question
    }
    question.answers.forEach(element => {
        currentQuestionStats[element + "Votes"] = 0;
        currentQuestionStats[element + "Percent"] = 0;
    });

    function generateQuestions() { // generates array of questions from json file
        let questionArray = []
        for (let i = 0; i < questionsJson.questionArray.length; i++) {
            questionArray.push(new Question(questionsJson.questionArray[i].question, questionsJson.questionArray[i].answers))
        }
        return questionArray;
    }

    React.useEffect(() => {
        qArray = generateQuestions();
        return;
    }, []); // should only trigger once

    function getNewQuestion() {
        return qArray[Math.floor(Math.random() * qArray.length)]; // get random question from array
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
                    <h3 id="streak">Your streak: 5 &#128293;</h3>
                </div>

                <VoteButtons answers={question.answers} />

                <div id="results-div">
                    <h3>Results (shows after submitted)</h3>
                    <table id="results">
                        <tbody>
                            <tr id="results-responses">
                                <th>Response</th>
                                <td className="results-1">Option 1</td>
                                <td className="results-2">Option 2</td>
                                <td className="results-3">Option 3</td>
                                <td className="results-4">Option 4</td>
                            </tr>
                            <tr id="results-percent">
                                <th>%</th>
                                <td className="results-1">20</td>
                                <td className="results-2">40</td>
                                <td className="results-3">10</td>
                                <td className="results-4">30</td>
                            </tr>
                            <tr id="results-total">
                                <th>Votes</th>
                                <td className="results-1"><p className="no-format">10</p></td>
                                <td className="results-2">20</td>
                                <td className="results-3">5</td>
                                <td className="results-4">15</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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