import axios from 'axios'
import { toast } from 'react-toastify'
import React, { useState, useContext } from 'react'
import { CTX } from 'context/Store'

const TagEditor = () => {
  const [{ user }, updateState] = useContext(CTX)
  const { token } = user
  const maxMet = user.tags && user.tags.length >= 4
  const [inputVal, setInputVal] = useState('')

  const handleChange = ({ target: { value } }) => setInputVal(value)

  const handleAddTag = () => {
    if (!inputVal) return toast.error('Tag cannot be empty')
    axios
      .put('/api/trainer/add-tag', { value: inputVal }, { headers: { 'x-auth-token': token } })
      .then(({ data: { tags } }) => {
        updateState({ type: 'CHANGE_TAGS', payload: { tags } })
        setInputVal('')
      })
      .catch(({ data: { message } }) => toast.error(message))
  }

  const handleDelete = ({ target: { id } }) => {
    axios
      .delete('/api/trainer/delete-tag', {
        headers: { 'x-auth-token': token, value: id },
      })
      .then(({ data: { tags } }) => updateState({ type: 'CHANGE_TAGS', payload: { tags } }))
      .catch(({ data: { message } }) => toast.error(message))
  }

  const handleKeyPress = ({ charCode }) => {
    if (charCode === 13) handleAddTag()
  }

  return (
    <div className="tag-editor">
      {Array.isArray(user.tags) &&
        user.tags.map((tag) => (
          <div className="tag" key={tag}>
            <span data-testid="tag">{tag}</span>
            <button id={tag} onClick={handleDelete}>
              <i id={tag} onClick={handleDelete} className="fas fa-times"></i>
            </button>
          </div>
        ))}
      <input
        type="text"
        value={inputVal}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        data-testid="tag-editor-input"
      />
      <button
        className="add-btn"
        data-testid="add-tag-btn"
        onClick={maxMet ? () => toast.error('Tag list limited to 4 tags') : handleAddTag}
      >
        add tag
      </button>
    </div>
  )
}

export default TagEditor
