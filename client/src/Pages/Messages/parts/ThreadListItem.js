import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import Image from 'Components/Image/Image'

const ThreadListItem = ({ user, setCurrentThread, currentThread, token }) => {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    axios
      .get(`/api/user/${user}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { user } }) => setUserInfo(user))
      .catch(({ response: { data } }) => toast.error(data.message))
  }, [token, user])

  const current = currentThread === user

  return (
    <div
      className={`threadlistitem ${current && 'current-item'}`}
      onClick={() => setCurrentThread((cUser) => (cUser === user ? null : user))}
    >
      <Image
        name="profile-pic"
        alt={`profile of ${userInfo.name}`}
        src={`/api/image/user/profilePic/${user}`}
      />
      {userInfo.name && <span className="name">{userInfo.name.split(' ')[0]}</span>}
    </div>
  )
}

ThreadListItem.propTypes = {
  props: PropTypes.shape({
    user: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    currentThread: PropTypes.string.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
  }),
}

export default ThreadListItem
