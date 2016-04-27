# OpenNews ICAT Presentation Software
Uses buttons connected to a raspberry pi (GPIO 5&6), a websocket (socket.io) and a webpage to present NLP categorized text to users and allows them to take a "quiz" against the machine.
## Dependencies:
* Node & npm
* Gulp (`npm install -g gulp`)
* Bower (`npm install -g bower`)

## Installation:

1. Clone repo
2. Install Node dependencies (`npm install`)
2. Install Bower dependencies (`bower install`)
3. Run dev server: `gulp serve`
4. Run node server: `node server/app.js`


## Notes:
* Does not have full quiz implementation merged in yet.
* Make sure you update the websocket address to the proper one in `main.js`
