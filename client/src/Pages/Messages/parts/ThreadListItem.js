import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Image from 'Components/Image/Image';

const ThreadListItem = ({ user, setCurrentThread, currentThread, token }) => {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    axios
      .get(`/api/user/${user}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { user } }) => setUserInfo(user))
      .catch((err) => console.log('err: ', err));
  }, [token, user]);

  let current = currentThread === user;

  return (
    <div
      className={`threadlistitem ${current && 'current-item'}`}
      onClick={() =>
        setCurrentThread((cUser) => (cUser === user ? null : user))
      }
    >
      <Image
        name='profile-pic'
        src={`/api/image/user/profilePic/${user}`}
        alt={`profile of ${userInfo.name}`}
      />
      {userInfo.name && (
        <span className='name'>{userInfo.name.split(' ')[0]}</span>
      )}
    </div>
  );
};

ThreadListItem.propTypes = {
  props: PropTypes.shape({
    user: PropTypes.string.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
    currentThread: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }),
};

export default ThreadListItem;
