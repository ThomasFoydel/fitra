import axios from 'axios'
import Peer from 'peerjs'
import { toast } from 'react-toastify'
import { Navigate, useParams } from 'react-router-dom'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { CTX } from 'context/Store'
import './Connect.scss'

const objectFilter = function (obj, keyToFilterOut) {
  let result = {}
  Object.keys(obj).forEach((key) => {
    if (key !== keyToFilterOut) {
      result[key] = obj[keyToFilterOut]
    }
  })
  return result
}

const Video = ({ stream }) => {
  const ref = useRef()
  useEffect(() => {
    ref.current.srcObject = stream
  }, [])
  return <video playsInline autoPlay ref={ref} className="peer-video" />
}

const Connect = ({ socket }) => {
  const [{ user, isLoggedIn }] = useContext(CTX)
  const { type, name } = user
  const [icons, setIcons] = useState({ video: false, audio: false })
  const [myVideoStream, setMyVideoStream] = useState(null)
  const [videoStreams, setVideoStreams] = useState({})
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([])
  const [peers, setPeers] = useState({})
  const { connectionId } = useParams()
  const streamsRef = useRef({})
  const peersRef = useRef({})
  const myVideoRef = useRef()
  const scrollRef = useRef()

  const addVideoStream = (userVideoStream, id) => {
    setVideoStreams({ ...videoStreams, [id]: { stream: userVideoStream } })
    streamsRef.current = { ...streamsRef.current, [id]: { stream: userVideoStream } }
  }

  useEffect(() => {
    let subscribed = true
    const token = localStorage.getItem('fitr-token')
    let myPeer
    axios
      .get(`/api/connect/${connectionId}`, { headers: { 'x-auth-token': token } })
      .then(async ({ data: { roomId } }) => {
        if (!subscribed) return

        myPeer = new Peer()
        myPeer.on('open', (id) => {
          socket.emit('join-room', {
            token,
            roomId,
            peerId: id,
            mySocketId: socket.id,
          })
        })

        let stream = null

        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        } catch (err) {
          console.log('connect media error: ', err)
        }

        myVideoRef.current.srcObject = stream
        setMyVideoStream(stream)

        myPeer.on('call', function (call) {
          call.answer(stream, { metadata: socket.id })
          call.on('stream', function (callStream) {
            addVideoStream(callStream, call.metadata)
          })
        })

        socket.on('user-connected', ({ userId, mySocketId }) => {
          if (userId) connectToNewUser(userId, stream, mySocketId)
        })

        socket.on('create-message', (message) => {
          setMessages((messages) => [...messages, message])
        })

        socket.on('user-disconnected', (userId) => {
          if (peersRef.current[userId]) peersRef.current[userId].close()
          const copy = Object.create({ ...peersRef.current })
          delete copy[userId]
          peersRef.current = copy
        })

        function connectToNewUser(userId, stream, userSocketId) {
          /* call peer */
          const call = myPeer.call(userId, stream, { metadata: userSocketId })
          if (call) {
            call.on('stream', (userVideoStream) => addVideoStream(userVideoStream, call.metadata))
            call.on('close', () => {
              call.removeAllListeners()
              call.close()
              peersRef.current[userSocketId].close()
              peersRef.current[userSocketId].removeAllListeners()
              const copy = Object.assign({ ...videoStreams })
              const filtered = objectFilter(copy, userSocketId)
              setVideoStreams(filtered)
            })
            setPeers({ ...peers, [userSocketId]: call })
            peersRef.current = { ...peersRef.current, [userSocketId]: call }
          }
        }
      })
      .catch(({ data: { message } }) => toast.error(message))

    return async () => {
      subscribed = false
      if (socket) socket.emit('disconnect-room', socket.id)
      if (myPeer) myPeer.destroy()
    }
  }, [])

  useEffect(() => {
    return () => myVideoStream && myVideoStream.getTracks().forEach((track) => track.stop())
  }, [myVideoStream])

  const playStop = () => {
    if (myVideoStream) {
      const enabled = myVideoStream.getVideoTracks()[0].enabled
      setIcons({ ...icons, video: !icons.video })
      if (enabled) myVideoStream.getVideoTracks()[0].enabled = false
      else myVideoStream.getVideoTracks()[0].enabled = true
    }
  }

  const muteUnmute = () => {
    if (myVideoStream) {
      if (myVideoStream.getAudioTracks().length === 0) return
      const enabled = myVideoStream.getAudioTracks()[0].enabled
      setIcons({ ...icons, audio: !icons.audio })
      if (enabled) myVideoStream.getAudioTracks()[0].enabled = false
      else myVideoStream.getAudioTracks()[0].enabled = true
    }
  }

  const handleSubmit = () => {
    setChatInput('')
    socket.emit('message', { content: chatInput, name })
  }

  const handleChatInput = ({ target: { value } }) => setChatInput(value)

  const handleKeyDown = (e) => {
    if (e.charCode === 13) {
      handleSubmit()
    }
  }

  function scrollToBottom() {
    scrollRef.current.scrollIntoView({
      inline: 'start',
      block: 'nearest',
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (messages && scrollRef.current) scrollToBottom()
  }, [messages])

  return (
    <>
      {socket || connectionId || isLoggedIn ? (
        <div className="connect">
          <div className="videochat">
            <video ref={myVideoRef} muted autoPlay playsInline className="my-video" />
            {Object.keys(videoStreams).map((userId) => {
              return <Video stream={videoStreams[userId].stream} key={userId} />
            })}

            <div className="controls">
              <div className="controls-block">
                <button onClick={playStop} className="control-btn">
                  <i
                    id="stopstart"
                    className={`fas ${!icons.video ? 'fa-video' : 'fa-video-slash stop'}`}
                  ></i>
                  <span>stop/start</span>
                </button>
                <button className="control-btn" onClick={muteUnmute}>
                  <i
                    id="muteunmute"
                    className={`fas ${
                      !icons.audio ? 'fa-microphone' : 'fa-microphone-slash unmute'
                    }`}
                  />
                  <span>Mute</span>
                </button>
              </div>
            </div>
          </div>
          <div className="messenger">
            <div className="window">
              <ul className="messages">
                {messages.map((message, i) => (
                  <li key={i}>
                    <strong>{message.name}</strong>: {message.content}
                  </li>
                ))}
                <div ref={scrollRef} />
              </ul>
            </div>
            <div className="message_container">
              <input
                onKeyPress={handleKeyDown}
                onChange={handleChatInput}
                value={chatInput}
                id="chat_message"
                type="text"
                placeholder="message..."
              />
            </div>
          </div>
        </div>
      ) : (
        <Navigate to={`/${type === 'trainer' ? 'coachportal/' : null}`} />
      )}
    </>
  )
}

export default Connect
