# Class notes

### Github assignment
- In Github, commits push the (staged with `git add`) changes you have made to a remote cloud repository. Pulling (i.e. with `git pull`) updates the local repository to match.
- In VSCode, there are various tools to make this process easier, such as a place to put the commit messages, extensions that help to visualize, and various other tools.
- Markdown format is detailed [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#quoting-code) and is definitely something to be acquainted with.

### AWS
- AWS allows you to purchase a server space, a domain, and set up all the DNS stuff. For this project, we made DNS records taht will redirect from the domain name I purchased (vote-together.click) to the public IP address (18.206.129.131). Each time the server stops and starts, it has a new IP address, so through AWS I also was able to get the more permanent public one.
- That means it goes http://*.vote-together.click -> http://18.206.129.131 -> instance IP (website run from server)
- To access the server shell, you can use command line code. `ssh -i [key pair file path] ubuntu@[server ip]` should do it. The key pair file is safely saved on my computer, and the server IP can be obtained from AWS.
