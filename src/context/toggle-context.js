import * as React from 'react';

const ToggleContext = React.createContext();
ToggleContext.displayName = 'ToggleContext';

function ToggleProvider({ value, children }) {
  return <ToggleContext.Provider value={value}>{children}</ToggleContext.Provider>
}

function useToggle() {
  const context = React.useContext(ToggleContext)
  if (context === undefined) {
    throw new Error(`useToggle must be used within a ToggleProvider`)
  }
  return context
}

export { ToggleProvider, useToggle, ToggleContext };