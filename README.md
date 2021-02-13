<style>

.img {
    height: 700px;
    object-fit: contain;
    }
.h3{
    /* width: 50%; */
    margin-left: 50%;
    transform: translateX(-50%);
    text-align: center;
    }

</style>

<h1 align='center'>FITRA</h1>
<p align='center'><a href='#description'>Description</a></p>
<p align='center'><a href='#installation'>Installation</a></p>
<p align='center'><a href='#usage'>Usage</a></p>
<p align='center'><a href='#license'>License</a></p>
<p align='center'><a href='#questions'>Questions</a></p>

<p align="center"><img class="img" src="assets/imgs/screencap.png" alt="a screenshot of a landing page for trainers"></p>

<h2 >Description</h2>
<p >A realtime videochat app for personal trainers and clients</p>
<p align="center"><img width="80%" src="assets/imgs/mainSetup.png" alt="a diagram of a fullstack application"></p>
<p align="center"><img width="80%" src="assets/imgs/apiRoutes.png" alt="a tree of api routes"></p>
<h2 >Installation</h2>
<p >Download the repo and run npm i and npm run client-install. Also needed is a .env file in the root directory with a MONGO_URI set to a mongoDB connection string and SECRET set to whatever you want your secret to be, any long random string will do</p>
<h2 >Usage</h2>

<p >Trainers and clients can make accounts, edit their profiles, chat with other users over websocket connection, and view their schedule. Clients can use paypal to purchase sessions from trainers. Once a session is purchased, it shows up in the schedule of both the trainer and client. Once active, the session displays a link to a connect page which, when visited, creates an encrypted connection directly between the client and trainer via UDP protocol using PeerJS, after checking user authorization and session status</p>

| Description                                                                                                                                                                               |                                                       Demo                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------: |
| <h3 class="h3">Trainers and clients can make profiles</h3>                                                                                                                                |           <p><img class="img"  src="assets/gifs/coachportalsignin.gif" alt="authentication flow"></p>            |
| <h3 class="h3">Clients can search for trainers by tag or name</h3>                                                                                                                        | <p><img class="img"  src="assets/gifs/trainersearch.gif" alt="a search bar being used to find mma trainers"></p> |
| <h3 class="h3">Clients can purchase sessions from trainers with paypal</h3> <div>                                                                                                         |            <p><img class="img"  src="assets/gifs/purchasesession.gif" alt="paypal purchase flow"></p>            |
| <h3 class="h3">Once a client has booked a trainer's session, those users can connect over UDP connection to videochat once the session is active and until the session is over</h3></div> |     <p><img class="img"  src="assets/gifs/connectsession.gif" alt="a videochat connection being opened"></p>     |
| <h3 class="h3">Clients can leave reviews after a session is complete and the average rating of a trainer displays on their profile</h3>                                                   |               <p><img class="img"  src="assets/gifs/review.gif" alt="a review being written"></p>                |
| <h3 class="h3">Trainers can cancel sessions</h3><div>                                                                                                                                     |          <p><img class="img"   src="assets/gifs/cancelsession.gif" alt="a session being cancelled"></p>          |
| <h3 class="h3">Trainers can manage their schedule, blocking out times that are unavailable, recurring or not</h3>                                                                         |       <p><img class="img"  src="assets/gifs/coachportalschedule.gif" alt="a schedule app being used"></p>        |
| <h3 class="h3">Trainers can change their half-hourly rate and tags</h3>                                                                                                                   |  <p><img class="img"  src="assets/gifs/coachportalsettings.gif" alt="tag and rate settings being changed"></p>   |
| <h3 class="h3">Users can edit their profile profile info, profile picture, and cover photo</h3>                                                                                           | <p><img class="img"  src="assets/gifs/changepics.gif" alt="a profile picture and cover photo being updated"></p> |
| <h3 class="h3">Users can send each other messages over websocket connection</h3>                                                                                                          |       <p><img class="img"  src="assets/gifs/messages.gif" alt="a message being sent to another user"></p>        |

<h2 >License</h2>
<p ><img src='https://img.shields.io/badge/license-MIT-half' alt='license'></img>
<h2 >Questions</h2>
<p >Any questions on this or other projects can be directed to thomasjfoydel@gmail.com </p>
<h2 >More Of My Projects</h2>
<p >Find more of my work on <a href='https://github.com/thomasfoydel'>my GitHub</a></p>
