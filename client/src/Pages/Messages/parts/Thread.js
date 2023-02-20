import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Image from 'Components/Image/Image'

const Thread = ({ props: { thread, close, currentUser, refEl } }) => (
  <div className="thread">
    {thread.map((msg, i) => {
      const ownMessage = msg.sender === currentUser
      const previousNotCurrent = !thread[i - 1] || thread[i - 1].sender !== currentUser
      const nextNotCurrent = !thread[i + 1] || thread[i + 1].sender !== currentUser
      const ownBeginning = ownMessage && previousNotCurrent
      const ownEnding = ownMessage && nextNotCurrent
      const sandwiched = ownBeginning && ownEnding

      return (
        <div
          className={`
          message 
          ownmsg-${ownMessage}
          sandwiched-${sandwiched}
          ending-${!sandwiched && ownEnding}
          beginning-${!sandwiched && ownBeginning}
           `}
          key={msg._id}
        >
          {!ownMessage && (
            <>
              <Link to={`/${msg.fromTrainer ? 'trainer' : 'user'}/${msg.sender}`}>
                <Image
                  name="profile-pic"
                  alt="sender's profile"
                  src={`/api/image/user/profilePic/${msg.sender}`}
                />
              </Link>
              <strong className="name">{msg.authorName.split(' ')[0]}</strong>
            </>
          )}
          <p className="content">{msg.content}</p>
        </div>
      )
    })}
    {refEl()}
  </div>
)

Thread.propTypes = {
  props: PropTypes.shape({
    close: PropTypes.func.isRequired,
    refEl: PropTypes.func.isRequired,
    thread: PropTypes.array.isRequired,
    currentUser: PropTypes.string.isRequired,
  }),
}

export default Thread
