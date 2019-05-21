import React from 'react'
import dequal from 'dequal'

// ./context/user-context

import * as userClient from '../user-client'
import {useAuth} from '../auth-context'

const UserStateContext = React.createContext()
const UserDispatchContext = React.createContext()

function userReducer(state, action) {
  switch (action.type) {
    case 'update': {
      return {user: action.updatedUser}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function UserProvider({children}) {
  const {user} = useAuth()
  const [state, dispatch] = React.useReducer(userReducer, {user})
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

function useUserState() {
  const context = React.useContext(UserStateContext)
  if (context === undefined) {
    throw new Error(`useUserState must be used within a UserProvider`)
  }
  return context
}

function useUserDispatch(params) {
  const context = React.useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error(`useUserDispatch must be used within a UserProvider`)
  }
  return context
}

// got this idea from Dan and I love it:
// https://twitter.com/dan_abramov/status/1125773153584676864
function updateUser(dispatch, user, updates) {
  return userClient.updateUser(user, updates).then(updatedUser => {
    dispatch({type: 'update', updatedUser})
  })
}

// export {UserProvider, useUserDispatch, useUserState, updateUser}

// src/screens/user-profile.js
// import {UserProvider, useUserState, updateUser} from './context/user-context'
function UserSettings() {
  const {user} = useUserState()
  const userDispatch = useUserDispatch()

  const [state, dispatch] = React.useReducer((s, a) => ({...s, ...a}), {
    status: null,
    error: null,
  })
  const {error, status} = state
  const isPending = status === 'pending'
  const isRejected = status === 'rejected'

  const [formState, setFormState] = React.useState(user)

  const isChanged = !dequal(user, formState)

  function handleChange(e) {
    setFormState({...formState, [e.target.name]: e.target.value})
  }

  function handleSubmit(event) {
    event.preventDefault()

    dispatch({status: 'pending'})
    updateUser(userDispatch, user, formState).then(
      () => {
        dispatch({status: 'resolved'})
      },
      error => {
        dispatch({status: 'rejected', error})
      },
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginBottom: 12}}>
        <label style={{display: 'block'}} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          disabled
          readOnly
          value={formState.username}
          style={{width: '100%'}}
        />
      </div>
      <div style={{marginBottom: 12}}>
        <label style={{display: 'block'}} htmlFor="tagline">
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          value={formState.tagline}
          onChange={handleChange}
          style={{width: '100%'}}
        />
      </div>
      <div style={{marginBottom: 12}}>
        <label style={{display: 'block'}} htmlFor="bio">
          Biography
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formState.bio}
          onChange={handleChange}
          style={{width: '100%'}}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={() => setFormState(user)}
          disabled={!isChanged}
        >
          Reset
        </button>
        <button type="submit" disabled={!isChanged && !isRejected}>
          {isPending
            ? '...'
            : isRejected
            ? '✖ Try again'
            : isChanged
            ? 'Submit'
            : '✔'}
        </button>
        {isRejected ? (
          <div style={{color: 'red'}}>
            <pre>{error.message}</pre>
          </div>
        ) : null}
      </div>
    </form>
  )
}

function UserDataDisplay() {
  const {user} = useUserState()
  return <pre>{JSON.stringify(user, null, 2)}</pre>
}

function Usage() {
  return (
    <div
      style={{
        height: 350,
        width: 300,
        backgroundColor: '#ddd',
        borderRadius: 4,
        padding: 10,
      }}
    >
      <UserProvider>
        <UserSettings />
        <UserDataDisplay />
      </UserProvider>
    </div>
  )
}
Usage.title = 'Context'

export default Usage