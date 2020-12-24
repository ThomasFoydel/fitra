import React, { useContext, useEffect, useState, useRef } from 'react';
import Image from 'Components/Image/Image';
import axios from 'axios';
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

export default ThreadListItem;
