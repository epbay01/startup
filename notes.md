# Class notes

### Github assignment
- In Github, commits push the (staged with `git add`) changes you have made to a remote cloud repository. Pulling (i.e. with `git pull`) updates the local repository to match.
- In VSCode, there are various tools to make this process easier, such as a place to put the commit messages, extensions that help to visualize, and various other tools.
- Markdown format is detailed [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#quoting-code) and is definitely something to be acquainted with.

### AWS
- AWS allows you to purchase a server space, a domain, and set up all the DNS stuff. For this project, we made DNS records taht will redirect from the domain name I purchased (vote-together.click) to the public IP address (18.206.129.131). Each time the server stops and starts, it has a new IP address, so through AWS I also was able to get the more permanent public one.
- That means it goes http://*.vote-together.click -> http://18.206.129.131 -> instance IP (website run from server)
- To access the server shell, you can use command line code. `ssh -i [key pair file path] ubuntu@[server ip]` should do it. The key pair file is safely saved on my computer, and the server IP can be obtained from AWS.
- Caddy is an interface for securing the server (allowing https) by getting a certificate automatically.

### HTML
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

### CSS
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
