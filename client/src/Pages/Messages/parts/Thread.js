import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'Components/Image/Image';

const Thread = ({ thread, close, currentUser, refEl }) => {
  return (
    <div className='thread'>
      {thread.map((msg, i) => {
        let ownMessage = msg.sender === currentUser;

        let previousNotCurrent =
          !thread[i - 1] || thread[i - 1].sender !== currentUser;
        let nextNotCurrent =
          !thread[i + 1] || thread[i + 1].sender !== currentUser;

        let ownBeginning = ownMessage && previousNotCurrent;
        let ownEnding = ownMessage && nextNotCurrent;

        let sandwiched = ownBeginning && ownEnding;

        return (
          <div
            className={`
          message 
          ownmsg-${ownMessage}
          sandwiched-${sandwiched}
          beginning-${!sandwiched && ownBeginning}
          ending-${!sandwiched && ownEnding}
           `}
            key={msg._id}
          >
            {!ownMessage && (
              <>
                <Link
                  to={`/${msg.fromTrainer ? 'trainer' : 'user'}/${msg.sender}`}
                >
                  <Image
                    alt="sender's profile"
                    name='profile-pic'
                    src={`/api/image/user/profilePic/${msg.sender}`}
                  />
                </Link>
                <strong className='name'>{msg.authorName.split(' ')[0]}</strong>
              </>
            )}
            <p className='content'>{msg.content}</p>
          </div>
        );
      })}
      {refEl()}
    </div>
  );
};

export default Thread;
