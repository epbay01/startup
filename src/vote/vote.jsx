import React from "react";
import ReactDOM from "react-dom";

export default function Vote () {
    return (
        <div className="main" id="vote-main"> 
            <div className="no-format" id="question-and-streak">
                <h2 id="question">Question: What color best matches your personality?</h2>
                <h3 id="streak">Your streak: 5 &#128293;</h3>
            </div>
            {/* <div className="no-format" id="input-buttons">
                <div id="left-buttons" className="no-format">
                    <p>Green</p>
                    <button>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 200 A200 200 90 0 1 200 0 L200 80 A120 120 90 0 0 80 200 L0 200 Z" style="fill: green;"/>
                        </svg>
                    </button>
                    <button>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 A200 200 90 0 0 200 200 L200 120 A120 120 90 0 1 80 0 L0 0 Z" style="fill: blue;"/>
                        </svg>
                    </button>
                    <p>Blue</p>
                </div>
                <div id="right-buttons" className="no-format">
                    <p>Yellow</p>
                    <button>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 A200 200 90 0 1 200 200 L120 200 A120 120 90 0 0 0 80 L0 0 Z" style="fill: orange;"/>
                        </svg>
                    </button>
                    <button>
                        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M200 0 A200 200 90 0 1 0 200 L0 120 A120 120 90 0 0 120 0 L0 0 Z" style="fill: red;"/>
                        </svg>
                    </button>
                    <p>Red</p>
                </div>
            </div> */}

            <div id="results-div">
                <h3>Results (shows after submitted)</h3>
                <table id="results">
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
                        <td className="results-1"><p class="no-format">10</p></td>
                        <td className="results-2">20</td>
                        <td className="results-3">5</td>
                        <td className="results-4">15</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}