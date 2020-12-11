import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import Peer from 'peerjs';
import './Connect.scss';
import { CTX } from 'context/Store';
import { Redirect } from 'react-router-dom';

const objectFilter = function (obj, keyToFilterOut) {
  let result = {};
  let keys = Object.keys(obj);
  keys.forEach((key) => {
    if (key !== keyToFilterOut) {
      result[key] = obj[keyToFilterOut];
    }
  });
  return result;
};

const Video = ({ stream }) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.srcObject = stream;
  }, []);
  return <video playsInline autoPlay ref={ref} className='peer-video' />;
};

const Connect = ({ match, socket }) => {
  const [appState] = useContext(CTX);
  let {
    user: { type, name },
    isLoggedIn,
  } = appState;
  const { connectionId } = match.params;
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [peers, setPeers] = useState({});
  const peersRef = useRef({});
  const streamsRef = useRef({});
  const [videoStreams, setVideoStreams] = useState({});
  const [icons, setIcons] = useState({ video: false, audio: false });
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const myVideoRef = useRef();
  const scrollRef = useRef();
  const addVideoStream = (userVideoStream, id) => {
    setVideoStreams({
      ...videoStreams,
      [id]: { stream: userVideoStream },
    });
    streamsRef.current = {
      ...streamsRef.current,
      [id]: { stream: userVideoStream },
    };
  };

  useEffect(() => {
    let subscribed = true;
    const token = localStorage.getItem('fitr-token');
    let myPeer;
    axios
      .get(`/api/connect/client/${connectionId}`, {
        headers: { 'x-auth-token': token },
      })
      .then(async ({ data }) => {
        if (data.err) {
          if (subscribed) setErrorMessage(data.err);
        } else {
          myPeer = new Peer();
          myPeer.on('open', (id) => {
            socket.emit('join-room', {
              peerId: id,
              mySocketId: socket.id,
              roomId: data.roomId,
              token: token,
            });
          });

          let stream = null;

          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
          } catch (err) {
            console.log('connect media error: ', err);
          }

          myVideoRef.current.srcObject = stream;
          setMyVideoStream(stream);

          myPeer.on('call', function (call) {
            call.answer(stream, { metadata: socket.id });
            call.on('stream', function (callStream) {
              addVideoStream(callStream, call.metadata);
            });
          });

          socket.on('user-connected', ({ userId, mySocketId }) => {
            if (userId) connectToNewUser(userId, stream, mySocketId);
          });

          socket.on('create-message', (message) => {
            setMessages((messages) => [...messages, message]);
          });

          socket.on('user-disconnected', (userId) => {
            if (peersRef.current[userId]) peersRef.current[userId].close();
            const copy = Object.create({ ...peersRef.current });
            delete copy[userId];
            peersRef.current = copy;
          });

          function connectToNewUser(userId, stream, userSocketId) {
            /* call peer */
            const call = myPeer.call(userId, stream, {
              metadata: userSocketId,
            });
            if (call) {
              call.on('stream', (userVideoStream) => {
                addVideoStream(userVideoStream, call.metadata);
              });
              call.on('close', () => {
                call.removeAllListeners();
                call.close();
                peersRef.current[userSocketId].close();
                peersRef.current[userSocketId].removeAllListeners();
                const copy = Object.assign({ ...videoStreams });
                const filtered = objectFilter(copy, userSocketId);
                setVideoStreams(filtered);
              });
              setPeers({ ...peers, [userSocketId]: call });
              peersRef.current = { ...peersRef.current, [userSocketId]: call };
            }
          }
        }
      });

    return () => {
      subscribed = false;
      if (socket) socket.emit('disconnect-room', socket.id);
      // if (myVideoStream) myVideoStream.srcObject.getTracks().stop();
      if (myVideoRef.current.srcObject) {
        myVideoRef.current.srcObject.getTracks()[0].stop();
        myVideoRef.current.srcObject.getTracks()[1].stop();
      }
      if (myPeer) myPeer.destroy();
    };
  }, []);

  const playStop = () => {
    if (myVideoStream) {
      let enabled = myVideoStream.getVideoTracks()[0].enabled;
      setIcons({ ...icons, video: !icons.video });
      if (enabled) myVideoStream.getVideoTracks()[0].enabled = false;
      else myVideoStream.getVideoTracks()[0].enabled = true;
    }
  };

  const muteUnmute = () => {
    if (myVideoStream) {
      const enabled = myVideoStream.getAudioTracks()[0].enabled;
      setIcons({ ...icons, audio: !icons.audio });
      if (enabled) myVideoStream.getAudioTracks()[0].enabled = false;
      else myVideoStream.getAudioTracks()[0].enabled = true;
    }
  };

  const handleSubmit = () => {
    socket.emit('message', { content: chatInput, name });
    setChatInput('');
  };
  const handleChatInput = (e) => {
    let { value } = e.target;
    setChatInput(value);
  };
  const handleKeyDown = (e) => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  function scrollToBottom() {
    scrollRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  useEffect(() => {
    if (messages && scrollRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  let isTrainer = type === 'trainer';

  return (
    <>
      {socket || connectionId || isLoggedIn ? (
        <div className='connect'>
          <div className='videochat'>
            <video
              ref={myVideoRef}
              muted
              autoPlay
              playsInline
              className='my-video'
            />
            {errorMessage && <p className='err-msg'>{errorMessage} </p>}
            {Object.keys(videoStreams).map((userId) => {
              return (
                <Video stream={videoStreams[userId].stream} key={userId} />
              );
            })}

            <div className='controls'>
              <div className='controls-block'>
                <button onClick={playStop} className='control-btn'>
                  <i
                    className={`fas ${
                      !icons.video ? 'fa-video' : 'fa-video-slash stop'
                    }`}
                    id='stopstart'
                  ></i>
                  <span>stop/start</span>
                </button>
                <button className='control-btn' onClick={muteUnmute}>
                  <i
                    className={`fas ${
                      !icons.audio
                        ? 'fa-microphone'
                        : 'fa-microphone-slash unmute'
                    }`}
                    id='muteunmute'
                  ></i>
                  <span>Mute</span>
                </button>
              </div>
            </div>
          </div>
          <div className='messenger'>
            <div className='window'>
              <ul className='messages'>
                {messages.map((message, i) => (
                  <li key={i}>
                    <strong>{message.name}</strong>: {message.content}
                  </li>
                ))}
                <div ref={scrollRef} />
              </ul>
            </div>
            <div className='message_container'>
              <input
                onKeyPress={handleKeyDown}
                onChange={handleChatInput}
                value={chatInput}
                id='chat_message'
                type='text'
                placeholder='message...'
              />
            </div>
          </div>
        </div>
      ) : (
        <Redirect to={`/${isTrainer ? 'coachportal/' : null}`} />
      )}
    </>
  );
};

export default Connect;

/* const videoConstraints = {
   height: window.innerHeight / 2,
   width: window.innerWidth / 2,
 };
*/
