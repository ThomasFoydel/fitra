import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';

import Auth from 'Components/Auth/Auth';
import NavBar from 'Components/NavBar/NavBar';

import LandingPage from 'Pages/LandingPage/LandingPage';
import Home from 'Pages/Home/Home';
import TrainerHome from 'Pages/CoachPages/TrainerHome/TrainerHome';
import Settings from 'Pages/Settings/Settings';

import Trainers from 'Pages/Trainers/Trainers';
import Messages from 'Pages/Messages/Messages';
import TrainerProfile from 'Pages/TrainerProfile/TrainerProfile';
import Connect from 'Pages/Connect/Connect';
import EditProfile from 'Pages/EditProfile/EditProfile';
import ManageSession from 'Pages/CoachPages/ManageSession/ManageSession';
import TrainerSettings from 'Pages/CoachPages/Settings/Settings';
import TrainerSchedule from 'Pages/CoachPages/Schedule/ScheduleContainer';
import ClientProfile from 'Pages/ClientProfile/ClientProfile';
import SessionReview from 'Pages/SessionReview/SessionReview';

import TermsOfUse from 'Pages/TermsOfUse/TermsOfUse';

import TrainerLandingPage from 'Pages/CoachPages/TrainerLandingPage/TrainerLandingPage';

import { CTX } from 'context/Store';
import './App.scss';

function App() {
  const [appState, updateState] = useContext(CTX);
  let {
    isLoggedIn,
    user: { token, type },
    showAuth,
  } = appState;
  const [mySocket, setMySocket] = useState(null);

  let socket;

  useEffect(() => {
    let subscribed = true;
    let tokenLS = localStorage.getItem('fitr-token');

    let checkAuth = async () => {
      axios
        .get('/api/auth/', {
          headers: { 'x-auth-token': tokenLS },
        })
        .then((result) => {
          if (subscribed) {
            updateState({
              type: 'LOGIN',
              payload: { user: result.data, token: tokenLS },
            });
          }
        });
    };

    let noToken = !tokenLS || tokenLS === 'undefined';

    noToken ? updateState({ type: 'LOGOUT' }) : checkAuth();

    return () => {
      if (socket) socket.emit('disconnect-room', socket.id);
      subscribed = false;
    };
  }, []);

  useEffect(() => {
    let subscribed = true;

    if (token) {
      const urlBase =
        process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000/';
      const ENDPOINT = urlBase + `?token=${token}`;
      socket = io(ENDPOINT);
      if (subscribed) {
        setMySocket(socket);
        socket.on('chat-message', (message) =>
          updateState({ type: 'NEW_MESSAGE', payload: { message } })
        );
      }
    }

    return () => {
      subscribed = false;
      if (socket) {
        // socket.emit('disconnect-room', socket.id);
        // socket.emit('disconnect', socket.id);
        socket.removeAllListeners();
        socket.off();
      }
    };
  }, [token]);

  let HomeComponent = type === 'trainer' ? TrainerHome : Home;

  return (
    <div className={`App`}>
      <Router>
        <NavBar />
        <Switch>
          <Route
            exact
            path='/'
            component={isLoggedIn ? HomeComponent : LandingPage}
          />

          <Route
            exact
            path='/coachportal'
            component={isLoggedIn ? HomeComponent : TrainerLandingPage}
          />

          <Route exact path='/terms-of-use' component={TermsOfUse} />
          <Route exact path='/trainers' component={Trainers} />
          <Route exact path='/trainer/:trainerId' component={TrainerProfile} />
          <Route
            exact
            path='/settings'
            component={isLoggedIn ? Settings : LandingPage}
          />
          <Route
            exact
            path='/editprofile'
            component={isLoggedIn ? EditProfile : LandingPage}
          />

          <Route
            exact
            path='/review/:sessionId'
            component={isLoggedIn ? SessionReview : LandingPage}
          />

          <Route
            exact
            path='/connect/:connectionId'
            component={({ match }) =>
              match && mySocket ? (
                <Connect socket={mySocket} match={match} />
              ) : (
                <HomeComponent />
              )
            }
          />
          <Route
            exact
            path='/messages'
            component={isLoggedIn ? Messages : LandingPage}
          />

          <Route exact path='/user/:id' component={ClientProfile} />

          <Route
            exact
            path='/coachportal/settings'
            component={isLoggedIn ? TrainerSettings : TrainerLandingPage}
          />
          <Route
            exact
            path='/coachportal/editprofile'
            component={isLoggedIn ? EditProfile : TrainerLandingPage}
          />
          <Route
            exact
            path='/coachportal/schedule'
            component={isLoggedIn ? TrainerSchedule : TrainerLandingPage}
          />

          <Route
            exact
            path='/coachportal/messages'
            component={isLoggedIn ? Messages : TrainerLandingPage}
          />
          <Route
            exact
            path='/coachportal/manage/:id'
            component={({ match }) =>
              isLoggedIn ? (
                <ManageSession match={match} />
              ) : (
                <TrainerLandingPage />
              )
            }
          />
        </Switch>

        {!isLoggedIn && showAuth && <Auth trainer={false} />}
      </Router>
    </div>
  );
}

export default App;
