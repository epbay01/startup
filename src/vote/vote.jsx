import React from "react";
import ReactDOM from "react-dom";
import { redirect } from "react-router-dom";
import * as questionsJson from "./questions.json";

class Question {
    constructor(question = "", answers = []) {
        this.question = question;
        this.answers = answers;
    }
}

export default function Vote ({ currentUser, loggedIn }) {
    let qArray;
    function generateQuestions() { // generates array of questions from json file
        let json = JSON.parse(questionsJson);
        let questionArray = []
        for (let i = 0; i < json.questionArray.length; i++) {
            questionArray.push(new Question(json.questionArray[i].question, json.questionArray[i].answers))
        }
        return questionArray;
    }

    React.useEffect(() => qArray = generateQuestions(), []); // should only trigger once

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
        const [question, setQuestion] = React.useState(new Question());
        let now = new Date();
        if (now.getHours() === 12 && now.getMilliseconds() === 0) {
            setQuestion(getNewQuestion());
        }

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
    if (length(answers) === 2) {

    } else if (length(answers) === 4) {
        return (
            <div className="no-format" id="input-buttons">
                <div id="left-buttons" className="no-format">
                    <p>Green</p>
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
                    <p>Blue</p>
                </div>
                <div id="right-buttons" className="no-format">
                    <p>Yellow</p>
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
                    <p>Red</p>
                </div>
            </div>
        )
    }
}