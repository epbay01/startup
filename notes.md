# Class notes

### Github assignment
- In Github, commits push the (staged with `git add`) changes you have made to a remote cloud repository. Pulling (i.e. with `git pull`) updates the local repository to match.
- In VSCode, there are various tools to make this process easier, such as a place to put the commit messages, extensions that help to visualize, and various other tools.
- Markdown format is detailed [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#quoting-code) and is definitely something to be acquainted with.

### AWS
- I am using an elastic IP so that even if I have to turn the server off, the public IP stays the same. The public IP is: 18.206.129.131, so the website is [this](http://18.206.129.131)
- To access the server shell, use the command `ssh -i <key path> ubuntu@18.206.129.131`
- If my server runs slow, I can spend a little money to upgrade it on aws. Currently I am using t2.micro because it was free.