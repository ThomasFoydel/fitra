<h1 align='center'>FITRA</h1>
<p align="center"><img src="assets/imgs/screencap.png" width="80%" alt="a screenshot of a landing page for trainers"></p>
<hr/>
<h2 align='center'>Table of Contents</2>
<p align='center'><a href='#description'>Description</a></p>
<p align='center'><a href='#installation'>Installation</a></p>
<p align='center'><a href='#usage'>Usage</a></p>
<p align='center'><a href='#license'>License</a></p>
<p align='center'><a href='#questions'>Questions</a></p>
<hr/>

<h2>Description</h2>
<p>A realtime videochat app for personal trainers and clients. Built with a MongoDB database, a Node/Express server, and a React user interface. The video chat functionality relies on websocket connections between users and the server which are used to open up a connection over the User Datagram Protocol directly between the users. Once a client has registered, signed in, and purchased a session, they and the trainer they've booked can access a page which is much like a websocket chatroom, except when a user enters it, the socket connection is used to request videostream connection data from other users in the room and send back one's own videostream after getting a response. This connects the trainer and client for encrypted peer-to-peer realtime communication.</p>
<p>Tests are written with Jest and React Testing Library. The front-end state is managed with React Context. Payment relies on a Paypal integration. Facebook and Google one-click login can be used to register/login for clients, though the Google login currently requires turning on third party cookies in browser settings.</p>
<p>The trainer schedule manager is based on a previous project, react-rnd-schedule, which uses a resize and drag-and-drop package called react-rnd to make a weekview schedule with resizable and dragable appointment times.</p>
<p align="center"><img width="80%" src="assets/imgs/mainSetup.png" alt="a diagram of a fullstack application"></p>
<p align="center"><img width="80%" src="assets/imgs/apiRoutes.jpg" alt="a tree of api routes"></p>
<hr/>
<h2>Installation</h2>
<p>Download the repo and run<p>

    npm run install-all

<p>Also needed is a .env file in the root directory with a MONGO_URI property set to a mongoDB connection string and SECRET property set to whatever you want your secret to be, any long random string will do</p>
<p>To run the project locally use the command<p>

    npm run dev

<p>This will start the server at <a href="http://localhost:8000">localhost:8000</a></p>
<p>And the user interface at <a href="http://localhost:3000">localhost:3000</a></p>
<hr/>
<h2>Usage</h2>

<p>Trainers and clients can make accounts, edit their profiles, chat with other users over websocket connection, and view their schedule. Clients can use paypal to purchase sessions from trainers. Once a session is purchased, it shows up in the schedule of both the trainer and client. Once active, the session displays a link to a connect page which, when visited, creates an encrypted connection directly between the client and trainer via UDP protocol using PeerJS, after checking user authorization and session status</p>

|                               <div>Description<div>                                |                                                <div>Demo<div>                                                 |
| :--------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: |
|                   <p>Trainers and clients can make profiles</p>                    |            <img height="400px" src="assets/gifs/coachportalsignin.gif" alt="authentication flow">             |
|               <p>Clients can search for trainers by tag or name</p>                | <img height="400px"   src="assets/gifs/trainersearch.gif" alt="a search bar being used to find mma trainers"> |
|        <p>Clients can purchase sessions from trainers with paypal</p> <div>        |            <img height="400px"   src="assets/gifs/purchasesession.gif" alt="paypal purchase flow">            |
|                <p>Users can connect via UDP for videochat</p></div>                |     <img height="400px"   src="assets/gifs/connectsession.gif" alt="a videochat connection being opened">     |
|            <p>Clients can leave reviews after a session is complete</p>            |               <img height="400px"   src="assets/gifs/review.gif" alt="a review being written">                |
|                      <p>Trainers can cancel sessions</p><div>                      |          <img height="400px"    src="assets/gifs/cancelsession.gif" alt="a session being cancelled">          |
| <p>Trainers can manage their schedule, blocking out times that are unavailable</p> |       <img height="400px"   src="assets/gifs/coachportalschedule.gif" alt="a schedule app being used">        |
|             <p>Trainers can change their half-hourly rate and tags</p>             |  <img height="400px"   src="assets/gifs/coachportalsettings.gif" alt="tag and rate settings being changed">   |
| <p>Users can edit their profile profile info, profile picture, and cover photo</p> | <img height="400px"   src="assets/gifs/changepics.gif" alt="a profile picture and cover photo being updated"> |
|        <p>Users can send each other messages over websocket connection</p>         |       <img height="350px"   src="assets/gifs/messages.gif" alt="a message being sent to another user">        |

<hr/>
<h2>License</h2>
<p><img src='https://img.shields.io/badge/license-MIT-half' alt='license'></img>
<hr/>
<h2>Questions</h2>
<p>Any questions on this or other projects can be directed to thomasjfoydel@gmail.com </p>
<hr/>
<h2>More Of My Projects</h2>
<p>Thanks for checking this out! Find more of my work on <a href='https://github.com/thomasfoydel'>my GitHub</a></p>
