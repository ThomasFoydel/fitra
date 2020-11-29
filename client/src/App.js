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
// import Schedule from 'Pages/ScheduleCURRENTLYUNUSED/Schedule';
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

// import TrainerMessages from 'Pages/CoachPages/Messages/Messages';

import TrainerLandingPage from 'Pages/CoachPages/TrainerLandingPage/TrainerLandingPage';

import { CTX } from 'context/Store';
import './App.scss';

function App() {
  const [appState, updateState] = useContext(CTX);
  let { isLoggedIn, user, showAuth } = appState;
  // const [authOpen, setAuthOpen] = useState(false);
  // const [currentShow, setCurrentShow] = useState('login');
  const [mySocket, setMySocket] = useState(null);

  let socket;

  useEffect(() => {
    let subscribed = true;
    let token = localStorage.getItem('fitr-token');

    let checkAuth = async () => {
      axios
        .get('/api/auth/', {
          headers: { 'x-auth-token': token },
        })
        .then((result) => {
          if (subscribed) {
            updateState({
              type: 'LOGIN',
              payload: { user: result.data, token },
            });
          }
        });
    };

    let noToken = !token || token === 'undefined';

    noToken ? updateState({ type: 'LOGOUT' }) : checkAuth();

    return () => {
      if (socket) socket.emit('disconnect-room', socket.id);
      subscribed = false;
    };
  }, []);

  useEffect(() => {
    let subscribed = true;

    if (user.token) {
      const urlBase =
        process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000/';
      const ENDPOINT = urlBase + `?token=${user.token}`;
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
  }, [user.token]);

  // const setAuthOpen = () => updateState({ type: 'TOGGLE_AUTH' });

  return (
    <div className={`App`}>
      <Router>
        <NavBar />
        <Switch>
          <Route
            exact
            path='/'
            component={() => (isLoggedIn ? <Home /> : <LandingPage />)}
          />
          {user.type === 'trainer' && (
            <Route
              exact
              path='/coachportal'
              component={isLoggedIn ? TrainerHome : TrainerLandingPage}
            />
          )}

          <Route exact path='/terms-of-use' component={TermsOfUse} />
          <Route exact path='/trainers' component={Trainers} />
          <Route exact path='/trainer/:trainerId' component={TrainerProfile} />
          {isLoggedIn && (
            <>
              {/* <Route exact path='/schedule' component={Schedule} /> */}
              <Route exact path='/settings' component={Settings} />
              <Route exact path='/editprofile' component={EditProfile} />
              <Route
                exact
                path='/review/:sessionId'
                component={SessionReview}
              />
              {mySocket && (
                <>
                  <Route
                    exact
                    path='/connect/:connectionId'
                    component={({ match }) => (
                      <Connect socket={mySocket} match={match} />
                    )}
                  />
                  <Route
                    exact
                    path='/messages'
                    component={Messages}
                    // render={() => <Messages socket={mySocket} />}
                  />
                </>
              )}

              <Route exact path='/user/:id' component={ClientProfile} />

              <Route
                exact
                path='/coachportal/settings'
                component={TrainerSettings}
              />
              <Route
                exact
                path='/coachportal/editprofile'
                component={EditProfile}
              />
              <Route
                exact
                path='/coachportal/schedule'
                component={TrainerSchedule}
              />

              <Route
                exact
                path='/coachportal/messages'
                component={Messages}
                // component={TrainerMessages}
              />
              <Route
                exact
                path='/coachportal/manage/:id'
                component={({ match }) => <ManageSession match={match} />}
              />
            </>
          )}
        </Switch>

        {!isLoggedIn && showAuth && <Auth trainer={false} />}
      </Router>
    </div>
  );
}

export default App;
