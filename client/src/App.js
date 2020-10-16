import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import {
  // Redirect,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import io from 'socket.io-client';

import Auth from 'Components/Auth/Auth';
import NavBar from 'Components/NavBar/NavBar';

import LandingPage from 'Pages/LandingPage/LandingPage';
import Home from 'Pages/Home/Home';
import Settings from 'Pages/Settings/Settings';
import Schedule from 'Pages/Schedule/Schedule';
import Trainers from 'Pages/Trainers/Trainers';
import Messages from 'Pages/Messages/Messages';
import TrainerProfile from 'Pages/TrainerProfile/TrainerProfile';
import Connect from 'Pages/Connect/Connect';
import EditProfile from 'Pages/EditProfile/EditProfile';
import ManageAppt from 'Pages/CoachPages/ManageAppt/ManageAppt';
import TrainerSettings from 'Pages/CoachPages/Settings/Settings';
import TrainerSchedule from 'Pages/CoachPages/Schedule/ScheduleContainer';

// import TrainerMessages from 'Pages/CoachPages/Messages/Messages';

import TrainerLandingPage from 'Pages/CoachPages/TrainerLandingPage/TrainerLandingPage';

import { CTX } from 'context/Store';
import './App.scss';

function App() {
  const [appState, updateState] = useContext(CTX);
  let { isLoggedIn } = appState;
  const [authOpen, setAuthOpen] = useState(false);
  const [currentShow, setCurrentShow] = useState('login');
  // const [redirect, setRedirect] = useState(false);
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

    if (appState.user.token) {
      const urlBase =
        process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000/';
      const ENDPOINT = urlBase + `?token=${appState.user.token}`;
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
  }, [appState.user.token]);

  // useEffect(() => {
  //   let subscribed = true;
  //   setTimeout(() => {
  //     if (!isLoggedIn && subscribed) setRedirect(true);
  //   }, 5000);
  //   return () => (subscribed = false);
  // }, [appState.isLoggedIn]);

  // useEffect(() => {
  //   let subscribed = true;
  //   if (subscribed) setTimeout(() => setRedirect(false), 100);
  //   return () => (subscribed = false);
  // }, [redirect]);
  return (
    <div className={`App`}>
      <Router>
        {/* {redirect && <Redirect to='/' />} */}
        {isLoggedIn && <NavBar />}
        <Switch>
          {isLoggedIn && (
            <>
              <Route exact path='/home' component={Home} />

              <Route exact path='/schedule' component={Schedule} />
              <Route exact path='/settings' component={Settings} />
              <Route exact path='/editprofile' component={EditProfile} />
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
              <Route exact path='/trainers' component={Trainers} />
              <Route
                exact
                path='/trainer/:trainerId'
                component={TrainerProfile}
              />

              <Route exact path='/coachportal/home' component={Home} />

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
                component={({ match }) => <ManageAppt match={match} />}
              />
            </>
          )}

          {!isLoggedIn && (
            <>
              <Route
                exact
                path='/'
                component={() => (
                  <LandingPage
                    setCurrentShow={setCurrentShow}
                    setAuthOpen={setAuthOpen}
                  />
                )}
              />
              <Route exact path='/coachportal' component={TrainerLandingPage} />
            </>
          )}
        </Switch>
      </Router>
      {!isLoggedIn && authOpen && (
        <Auth
          trainer={false}
          setAuthOpen={setAuthOpen}
          currentShow={currentShow}
          setCurrentShow={setCurrentShow}
        />
      )}
    </div>
  );
}

export default App;
