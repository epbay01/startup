# Class notes

## Github assignment
- In Github, commits push the (staged with `git add`) changes you have made to a remote cloud repository. Pulling (i.e. with `git pull`) updates the local repository to match.
- In VSCode, there are various tools to make this process easier, such as a place to put the commit messages, extensions that help to visualize, and various other tools.
- Markdown format is detailed [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#quoting-code) and is definitely something to be acquainted with.

## AWS and internet
- AWS allows you to purchase a server space, a domain, and set up all the DNS stuff. For this project, we made DNS records taht will redirect from the domain name I purchased (vote-together.click) to the public IP address (18.206.129.131). Each time the server stops and starts, it has a new IP address, so through AWS I also was able to get the more permanent public one.
- That means it goes http://*.vote-together.click -> http://18.206.129.131 -> instance IP (website run from server)
- To access the server shell, you can use command line code. `ssh -i [key pair file path] ubuntu@[server ip]` should do it. The key pair file is safely saved on my computer, and the server IP can be obtained from AWS.
- Caddy is an interface for securing the server (allowing https) by getting a certificate automatically.
- Caddy also redirects from a default port (such as 443 or 80) to a port where the server is actually running (in the startup, simon is on port 3000 and startup is on port 4000). When we ssh, we use port 22, for instance.
- The general formula for a URL is `<scheme>://<domain name>:<port>/<path>?<parameters>#<anchor>` where only scheme and domain are not optional
- You can make an HTTP request (request resources, etc. more detail shortly) using the `curl` command
  - Every HTTP request can be one of 5 types: GET (get a resource), POST (create a new resource), PUT (update a resource), DELETE (delete a resource), OPTIONS (get metadata of a resource, not the resource itself)
  - Every response starts with a code that indicates the general gist of the response (for example, 200 is success, 404 is not found, etc.)
  - Every request and response has headers, which give information and specify metadata
  - Cookies store sets of headers so they can be accessed or reused, since requests don't store persistent data themselves

## HTML
- Some key elements in HTML:
  - `<h#>` headings
  - `<div>` divisions
  - `<body>` main body
  - `<a>` anchor/hyperlink
  - `<img>` image, `<audio>` audio, `<video>` videos
  - `<ol> and <ul>` ordered/unordered list with items `<li>`
  - `<header>` and `<footer>`
  - `<table>` with `<tr>` table rows, `<th>` table headers, and `<td>` table data
  - `<p>` paragraph
  - `<nav>` for navigation elements
  - `<svg>` and `<canvas>` allow inline/programmatic displays, made via html/css/js
- Some key attributes
  - `href="[url/path]"` hyperlink reference
  - `src="[url/path]"` source
  - `id="[id]"` and `class="[class]"` for referencing specific elements and groups of elements
- Input
  - `<form>` is container element for input elements (usually JavaScript is used now for actual submission)
  - `<input>` has a bunch of possibilities for its `type` attribute, and each type has its own specific attributes, although there are some shared ones as well:
    - `name` name of input and form (if used)
    - `disabled` disables interaction
    - `value` initial value
    - `required` required for submission
    - `pattern` allows for any built-in data validation (for certain types of input element)

## CSS
CSS uses selectors which are given rules that have a property and a value. Selectors include an HTML element but there are other selectors as well:
  - `element1 element2` implies all `element2` that are descendents of `element1`
  - `*` means everything/all elements
  - `e1 > e2` all `e2` that are *direct children* of `e1` (not grandchildren, etc.)
  - `e1 ~ e2` the `e2` that are siblings of `e1`, for adjacent siblings use `+`
  - `e.class` is all elements `e` with the matching `class` attribute (element is optional)
  - `#id` a reference to the element with that id (there should only be one)
  - `e[attribute="value"]` is all elements with that attribute, optionally with the value for that attribute
  - `:hover` (there are other similar ones) allows selecting an element (etc.) in this case when it is hovered over by the mouse
Some important attributes:
  - `background-color: color`
  - `border: color width style`
  - `float: direction` places it to the left or right in the flow
  - `font: family size style`
  - `max/min-width/height: unit`
  - `margin/padding: unit`
  - `width/height: unit`
  - `z-index: number` sets the z layer

You can import fonts in two ways:
```
@font-face {
  font-family: 'Quicksand'; // name
  src: url('https://cs260.click/fonts/quicksand.ttf'); // font url
}

p { // example usage
  font-family: Quicksand;
}
```
Alternatively:
```
@import url('https://fonts.googleapis.com/css2?family=Rubik Microbe&display=swap'); // all one line

p { // example usage
  font-family: 'Rubik Microbe'; // font name in quotes
}
```

For CSS animations:
  - Use `animation-name: name;` to name it, and specify the `animation-duration` as well.
  - Create keyframes for the animation using a code block to specify what will change, and the properties at the beginning, end, and partway through
```
@keyframes name {
  from { // properties at the start of the animation
    // properties, ex. font-size or color
  }

  some% { // happens whatever % through the animation
    // different properties
  }

  to { // properties at the end
    // different properties
  }
}
```

`@media (bool) {}` can do some stuff such as detecting the orientation (with `orientation: portrait`) and adjusting accordingly.

`display: grid` is defined in conjuction with properties such as `grid-template-columns`, `grid-auto-rows`, and `grid-gap`.

`display: flex` creates a resizable flex container. The main attribute of the parent is `flex-direction:<column|row|reverse-column|reverse-row>`. The children can have `flex: #` where the number is the ratio of how much of the container they will get. It also can have numbers related to growing/shrinking etc. Other attributes can line things up like `justify-content` and `align-content` line things up on the main and cross axis respectively. `gap` can be used to create a fixed gap between elements (in addition to any other gaps from justify).

## Javascript

### General

In js, use `let` and  `const` to declare variables, they are weakly typed (the type can change or be automatically converted). Use the strict equality `===` and `!==` to compare as exact matches, the regular equality can have unexpected results because it automatically will convert types.

Arrow functions are declared in the syntax `(parameters) => {code}` with {} being optional. Functions in general are also considered objects.

JSON is a sepecial object format where the keys are strings, and it can easily be converted to and from a string format.

In functions, you can have an indefinite number of parameters by prefixing the last parameter with `...rest`. Then all the extra parameters would, in this case, be contained within `rest`. The opposite is also possible, to take an iterable object (for example a list or js object) and expand it into the parameters. This is done with `...object` in the function call.

### Array functions

Arrays and objects can be destructured, or pull certain items out and assign them to variables. The syntax for destructuring is like so: `let [b,c,...rest] = a` would assign b and c to be the first two items and rest to be everything else (optional). For an object, you use the key value: `let { a: var1, b: var2 } = obj`.

Some functions you can do on arrays (use dot):
- `push(item)` and `pop()` add/remove from end
- `slice(start,end)` returns sub-array (start inclusvie, end exclusive)
- `sort(function)`
- `for (i of array.values) {}` creates iterator for loop
- `find(function)` returns first satisfying value
- `forEach(function)` runs function on each item
- `reduce(function)` runs function to reduce array to a single value, ex `a.reduce((a,b) => a + b)`
- `map(function)` runs a function that maps an array to a new one
- `filter(function)` runs a function to remove items
- `every(function)` tests if all items match
- `some(function)` tests if any items match

### More For Websites

In HTML, use `<script>` elements and attributes such as `onclick="function()/code"` to integrate javascript into the website.

`localStorage` allows you to store numbers, bools, and strings locally instead of sending it back and forth to the server. (Becasue JSON can easily be converted to and from a string, JSON also can be stored.)

*Promise definition:* A `Promise` is an object that runs a function asyncronously. To make a promise you use the syntax `new Promise(function)` where the function is most often an arrow function and must have parameters `resolve, reject`. Code called inside the promise and code after runs at the same time.

*Promise use:* The `resolve, reject` parameters of the promise function are also functions, which set the promise to an accept state or reject state. To detect and execute code according to these states once the code finishes, we use `.then((return/output) => {code}), .catch((err => {code})), and .finally(() => {code})` where `then` runs on the accept state, `catch` catches the reject state, and `finally` runs regardless afterwards.

*Async and await:* `await` is a keyword that can be called in a `try/catch/finally` block and waits to execute code until a promise is resolved. `await` can only be called in either the global scope or in a function declared as `async`. `async` functions are functions that return a `Promise`.

## React
**!NOTE!** rewrite to be more clear about props, state, and render
### JSX
React uses a format called JSX to create and manipulate DOM/HTML components. JSX looks a lot like HTML at first, but has key differences. First off, the attributes use lower camel case and sometimes have different names. JSX elements can have children, and javascript can be embedded into it using `{expression}`.

React allows you to make custom components and insert them into JSX. This is done using `Component: <CustomTag prop="some property" />` inside another element. For example:

```
function CustomTag(props) {
  // some code here
  return <p>{props.foo}</p>
}

const root = ReactDOM.createRoot(document.getElementById('root')); // get the root element of the DOM
root.render(
<div>
  Component: <CustomTag foo="property value" />
</div>
);
```

**Components:** To be clear, each component has three pieces `props`, `state`, and `render`. Props are the properties, which as you can see can be used to pass things between and into components. States are used for an internal component state, for example what text it displays. Render renders the component when either a property or state changes.

In this example, the component is named `CustomTag` and it has a custom property `foo`. `foo` is passed into the functionality via the `props` parameter where we could do something with it. In this case, we use the property as the content of a `<p>` JSX tag. As you can see, the component returns JSX which is then inserted into the JSX where it is called (the `<div>` at the bottom). The `root.render(<JSX>)` function then actually renders the JSX into the document.

### Hooks

Hooks are React functions that add functionality to your elements. One example is the `useState` hook, which allows you to define changeable states that you can then use for various things such as styling, content, etc. For example, you might have `onclick={stateChangeFunction()}` and define the state with `[state, updateState] = React.useState("state1");` and then change the state with `updateState("state2")`. This would mean that on clicking the element the state would change from "state1" to "state2."

Another hook is `useEffect(function)`. This is called when an element is rendered, or optionally when there is cleanup. This happens for example when a state changes, the element is rerendered and so `useEffect` is called. Cleanup happens after there could be a rerendering, whether it happens or not. You also can specify dependencies that call the function when the variable is updated.

### Other

In React, you can have the entire application be on one page using the react-router-dom package. This means instead of loading a new page every time the site simply uses javascript to change the elements of the DOM.

## APIs

A URL can be used to store and share data. These "service endpoints" are also called "APIs." For instance, an API can be used to deliver JSON data or files. Endpoints are made in backend code, and can be used to deliver data either to the frontend or even to other websites.

The command `curl` makes HTTP requests (a GET request by default), then APIs are the URLs that know how to process and respond to those requests. For example `curl simon.vote-together.click/api/scores` returns a JSON object with the various scores recorded. `curl` can also be used for other types of requests (POST creates a new object, PUT updates an object, etc. see above).

### Fetch

Fetch is a library that allows you to make HTTP requests from frontend code. It takes a URL (and optionally other content), and returns a promise with the response. The syntax is thus as follows:
```
fetch(<url>)
  .then((response) => {})
  .finally(() => {});

// alternatively you can use try/catch/finally
```

For another type of request other than GET, you need to include more information:
```
fetch(<url>, {
  method: "POST",
  body: {<body>},
  headers: {
    "content-type": "application/json",
    etc.
  }
})
  .then //etc.
```

### Express

Express is a library that allows you to more easily make endpoints and HTTP responses. Some basic express commands include:

For setting up express, we use a constructor `express()` and then we can use the various functionality that express offers:
```
const express = require('express');
const app = express();

app.listen(<port>);
```

One important built-in express method is `express.static(<dir>)`, which allows you to access a directory of static files. For instance, to use this you would write `app.use(express.static("public"));` which would allow you to access and return any files in the public directory as a static file.

`app.use` allows you to also create your own middleware functions, which run sequentially and should end with `next()` if you want any other matches to run.

For setting up specific endpoints, we need to think about which request type we will be responding to. For the different types, we have methods such as `app.get`, `.put`, `.post`, etc. Each of these defines an endpoint and its functionality. We pass in first the path, then a function to define each endpoint.
```
app.get("/api/hello", (req, res, next) => {
  res.send({msg: "hello"});
});
```
This code, for example, would define an endpoint "/api/hello" that would, when requested with a GET request, return a JSON object with the key/value `msg: "hello"`. The `req` parameter of the inner function refers to the request, and the `res` refers to the response. `next` refers to the next function to be called if there are multiple matches. You also can do this with `next()`.

Parameters for the function can also be passed in via URL. You do this by prefixing the parameter name with ":", for example "store/:storeName" would make it so the URL "store/provo" passes "provo" in as the storeName parameter. It is accessed in the code with `req.params.<parameter>`. Paths also can have wildcards or regex.

## WebSocket, Auth, and MongoDB

### MongoDB

MongoDB is an online database. Databases are generally interfaced with through the backend. In Mongo, there are clusters and collections. You access them through object-like queries and something like the following:
```
const db = new MongoClient(`mongodb+srv://${userName}:${password}@${hostname}`);
const collection = db.db("cluster").collection("collection");

let answer = await collection.findOne({name: nameVar}); // there are many more query options
```

### Authentication

With authentication, generally you set cookies to have a token (a random string of letters and numbers) that you check before yielding any sensitive data to verify the requester's identity.

Passwords should always be hashed before sending over HTTP to prevent hackers from seeing the password in the request body.

### WebSocket

WebSocket essentially opens up a two-way stream that allows clients to send messages to each other through the server. When each app connects to the server, a hidden endpoint (sort of) is accessed/upgraded from http:// or https:// to ws:// or wss://, and then the connection is kept alive through regular pings (and a pong response). Then, when one client sends a message to the server, the server has access to the connections to all others and can redirect the message to everyone else.

WebSocket has a few fixed events, the main ones being "connection" and "message." Here is an example of using these once a connection is established:

```
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 9900 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = String.fromCharCode(...data);
    console.log('received: %s', msg);

    ws.send(`I heard you say "${msg}"`);
  });

  ws.send('Hello webSocket');
});
```

In this example, the connections are not collated into a list or redirected, the server simply responds with a message, however this would be totally possible.

## Misc Topics

### More on HTTP and ports

Every connection made is through both the IP address and a port. The standard port for an HTTPS request is 443, for HTTP is 80, for file transfer is 20, for SSH is 22, and so on. Services such as Caddy redirect requests from these ports to where the server/site is actually running on (for example the startup is running on 4000, simon is on 3000, but if you try to connect to 443 it will show the startup still and redirect based on subdomain).

Status codes:
- 100: informational
- 200: success
  - 201: created
  - 204: no content
- 300: redirect
- 400: client errors
  - 401 unauthorized
  - 404 is commonly not found
- 500: server errors

Headers:
- Authorization: has an auth token
- Accept: content accepted by client
- Content-Type: type of data sent
- Cookie: sends a cookie, or key-value pairs stored by the client
- Access-Control-Allow-Origin: CORS requirements, for example allowing access from potentially unauthorized third parties

### Service daemons

A service daemon (such as PM2 for aws) runs constantly in the background, keeping the backend functional. It allows you to run commands such as `pm2 restart <service>` (which restarts a specific subdomain/service), or `pm2 ls` (which lists all running services).

### Testing

There are a number of testing services for both frontend (UI) and backend (APIs). One used for UI is called Playwright, one for endpoints is called Jest. In JS, you create a .test.js file with code such as `.expect().toBe()` or `.expect().toHaveText()`.

### Typescript

This is an addition to JS that adds static typing. The syntax is `variable: type`. You also can define types with interfaces or in an enumerator-type way. For example:
```
// interface, which acts similar to a type/class without a constructor
interface Book {
  title: string;
  id: number;
}
// type enumerator
type AuthState = "authenticated" | "unauthenticate" | "unknown";
```

### Optimization

*Browser latency*: Impacted by complexity of application functions

*Network latency*: Happens when making too many HTTP requests or ones with large amounts of data

*Endpoint latency*: The amount of time it takes to process requests on the backend

### Security

Good practice techniques from the GitHub:

- Sanitize input data - Always assume that any data you receive from outside your system will be used to exploit your system. Consider if the input data can be turned into an executable expression, or can overload computing, bandwidth, or storage resources.
- Logging - It is not possible to think of every way that your system can be exploited, but you can create an immutable log of requests that will expose when a system is being exploited. You can then trigger alerts, and periodically review the logs for unexpected activity.
- Traps - Create what appears to be valuable information and then trigger alarms when the data is accessed.
- Educate - Teach yourself, your users, and everyone you work with, to be security minded. Anyone who has access to your system should understand how to prevent physical, social, and software attacks.
- Reduce attack surfaces - Do not open access anymore than is necessary to properly provide your application. This includes what network ports are open, what account privileges are allowed, where you can access the system from, and what endpoints are available.
- Layered security - Do not assume that one safeguard is enough. Create multiple layers of security that each take different approaches. For example, secure your physical environment, secure your network, secure your server, secure your public network traffic, secure your private network traffic, encrypt your storage, separate your production systems from your development systems, put your payment information in a separate environment from your application environment. Do not allow data from one layer to move to other layers. For example, do not allow an employee to take data out of the production system.
- Least required access policy - Do not give any one user all the credentials necessary to control the entire system. Only give a user what access they need to do the work they are required to do.
- Safeguard credentials - Do not store credentials in accessible locations such as a public GitHub repository or a sticky note taped to a monitor. Automatically rotate credentials in order to limit the impact of an exposure. Only award credentials that are necessary to do a specific task.
- Public review - Do not rely on obscurity to keep your system safe. Assume instead that an attacker knows everything about your system and then make it difficult for anyone to exploit the system. If you can attack your system, then a hacker will be able to also. By soliciting public review and the work of external penetration testers, you will be able to discover and remove potential exploits.
