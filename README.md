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
