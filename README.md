# startup
Long-term project for CS 260

Notes of what I have learned from the class are contained in [these notes](notes.md).

## Project Specification

### Elevator Pitch
Have you ever wondered, for some common questions, what do people generally actually think? Which _did_ come first, the chicken, or the egg? In this web application, these questions will finally be answered. Based on an old Wii app, this website will have new questions daily, then keep track of the universal response to that question. Each user votes, and adds to a base tally, so that people from anywhere can vote and see others' opinions.

Key features include:
- Accounts, to keep track of votes and previous votes
- Global interaction through voting
- History of past votes or how streak of days in a row you voted

### Design
Here is a rough example of what the voting page might look like:
![Voting page](Images/voting%20page.png)

Here is another rough sketch of the profile page:
![Profile page](Images/profile%20page.png)

Obviously, these are rough sketches and the specific design of the website would look much better. However, they illustrate the point that on the voting page would be a simple UI for voting, and the profile page would include more information accessed from the database.

### Technologies
**HTML** - Two or three HTML web pages, one for logging in, one for voting, and possibly one for settings or account information.

**CSS** - Styling the website to make a clean user experience.

**JavaScript** - Logic for voting, interactive elements such as buttons.

**React** - The main voting page will have an application and any other applicable components.

**Web Service** - Backend service that gets a new question every day, counts votes, and records past results.

**Authentication** - Authentication will be required to vote so that it minimizes extra/frivolous voting.

**Database** - Store users, possible questions, past results, and other user data such as past answers and streaks.

**WebSocket** - Votes updated globally in real time.

## HTML

**HTML pages for each component of your application:** Currently the website has three pages; index.html (the login and about page/home page), profile.html (where profile settings and information about past votes is displayed), and vote.html (where you will actually vote)

**Proper use of HTML tags including BODY, NAV, MAIN, HEADER, FOOTER:** I used each of these elements appropriately, for example adding a header with the name of the website and a footer with information such as a link to the GitHub

**Links between pages as necessary:** Within a `<nav>` element, I included links between the three pages

**Application textual content:** I added whatever text I could, although most of it will be modified later to display appropriate data

**Placeholder for 3rd party service calls:** In this case, I will be using a 3rd party API to help authenticate logins, and prevent someone from voting twice. If possible, I will also use the API to send notifications that a new question is up (if enabled)

**Application images:** I included a couple images, like one in the header and a picture of me in the footer

**Login placeholder, including user name display:** Added on index.html

**Database data placeholder showing content stored in the database:** Used placeholder text on profile.html

**WebSocket data placeholder showing where realtime communication will go:** The votes on vote.html will be updated in realtime

## CSS

**Header, footer, and main content body:** I have a sticky header/nav bar, flexible main content, and a footer at the bottom of the page with the necessary information such as my github, and a link to my email

**Navigation elements:** On my nav bar there are links to a couple other pages, and is fixed on top of the page

**Responsive to window resizing:** I used `@media` selectors to re-adjust the layout of the nav bar, the footer, and the about/login page when put in portrait mode. Also there is extensive use of `flex/flexbox` for many elements for both layout alignment and responsiveness to resizing

**Application elements:** Each element is appropriately styled to not look like base HTML and make a nicer layout

**Application text content:** The text utilizes fonts to look more thematic, and has padding etc. to make it readable

**Application images:** I included a few images, such as one in the footer, one in the header as the logo, and a couple on the about/login page

## React

**Bundled with Vite:** I did this using node.js

**Components:** I used multiple components with a number of states to keep track of votes, voter history, and users. The main components are the three pages of the site, but I also used additional components to build two tables, and adapt the nav bar. Currently, you can vote and it tracks the votes using localStorage. This will change later to a database.

**Router:** I used the router for the various pages. I also used it to redirect when you login.

**Hooks:** I used the `useEffect` hook in several places to adapt the site to respond to what's happening. For example, when you log in, put in a wrong password, or vote.

## Express service

**HTTP Service:** I made a backend in (service/index.js)[service/index.js] using the Express package.

**Static Middleware:** I used Express as well as `express cors` and `express json` middleware.

**3rd Party API/endpoints:** I used a 3rd party API to give me a techy phrase to put in the footer.

**Backend Endpoints:** I have several endpoints that I implemented:
  - `/api/user/...` endpoints including a GET, POST, PUT, and DELETE endpoint to manage logins and user data
  - `/api/vote/...` endpoints to save the current and past votes for each question. Includes a GET and PUT
  - `/api/question` endpoint, which GETs a new question

**Frontend Calls:** Each page has to call these endpoints, the `/api/user/` endpoints in particular, to get the data it needs to display. The question endpoint is called when you first open the page to get a question of the day, vote is called when you vote or look at the history on the profile page, and user is called all over the place.

## Login service

**User Registration**: Supports this through API /user/new

**User Auth and Logout:** Acheived through APIs /auth/login and /auth/logout

**Stores data and credentials in MongoDB:** All user data is stored in a Mongo database, including voter history, if you have voted already, etc. The user "user" HAS ALREADY VOTED! Currently the website does not reset daily, so you should use a different user

**Restricts application based on auth:** This is done with both the frontend *and* the backend (no reason to change functional code). You can check this by noticing the cookies get set when logging in

## Websocket

**Backend listens for websocket connection**: This works!

**Frontend listens for websocket connection**: When it connects, it says something in the console

**Data sent over websocket**: All votes are sent over websocket, so they should update other pages

**Websocket data displayed**: The votes in the table on the "Vote" page are all displayed in real time

**All visible elements function**: This required some changes, but lots of old bugs are fixed and everything should work! Logging in does not take you to the vote page automatically anymore (it was causing problems), FYI. The biggest thing is the website should reset every 24 hours, and the user history table is all working!
