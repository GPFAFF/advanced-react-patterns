// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { Switch } from '../switch'

const callAll = (fns) => {
  debugger;
  return function (...args) {
    debugger;
    return fns.forEach(fn => fn?.(...args))
  }
}

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  function getTogglerProps({ onClick, ...props } = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  };

  return {
    on,
    toggle,
    getTogglerProps,
  }
}

function Button(props) {
  const { onClick, id } = props;
  return (
    <button
      id={id}
      onClick={onClick}
    >
      {props['aria-pressed'] ? 'on' : 'off'}
    </ button>
  )
}

function App() {
  const { on, toggle, togglerProps, getTogglerProps } = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({ on })} />
      <hr />
      <Button {...getTogglerProps(
        {
          'aria-label': 'custom-button',
          'aria-pressed': on,
          onClick: () => console.info('onButtonClick'),
          ...togglerProps,
          id: 'custom-button-id'
        }
      )} />
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
