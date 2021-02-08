<h1 align='center'>FITRA</h1>
<p align='center'><a href='#description'>Description</a></p>
<p align='center'><a href='#installation'>Installation</a></p>
<p align='center'><a href='#usage'>Usage</a></p>
<p align='center'><a href='#license'>License</a></p>
<p align='center'><a href='#questions'>Questions</a></p>
<h2 >Description</h2>
<p >A realtime videochat app for personal trainers and clients</p>
<p align="center" ><img  width="100%"  src="assets/imgs/mainSetup.png" alt="a diagram of a fullstack application"></p>
<p align="center"><img  width="100%" src="assets/imgs/apiRoutes.png" alt="a tree of api routes"></p>
<h2 >Installation</h2>
<p >Download the repo and run npm i and npm run client-install. Also needed is a .env file in the root directory with a MONGO_URI set to a mongoDB connection string and SECRET set to whatever you want your secret to be, any long random string will do</p>
<h2 >Usage</h2>
<p >Trainers and clients can make accounts, edit their profiles, chat with other users over websocket connection, and view their schedule. Clients can use paypal to purchase sessions from trainers. Once a session is purchased, it shows up in the schedule of both the trainer and client. Once active, the session displays a link to a connect page which, when visited, creates an encrypted connection directly between the client and trainer via UDP protocol using PeerJS, after checking user authorization and session status</p>
<h2 >License</h2>
<p ><img src='https://img.shields.io/badge/license-MIT-red' alt='license'></img>
<h2 >Questions</h2>
<p >Any questions on this or other projects can be directed to thomasjfoydel@gmail.com </p>
<h2 >More Of My Projects</h2>
<p >Find more of my work on <a href='https://github.com/thomasfoydel'>my GitHub</a></p>
