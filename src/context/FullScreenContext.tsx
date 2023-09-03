import React, { PropsWithChildren, useContext } from 'react'

type FullScreenContextType = {
  isFullScreen: boolean
  toggle: () => void
}

const FullScreenContext = React.createContext<FullScreenContextType>(null!)

export const FullScreenProvider = ({ children }: PropsWithChildren) => {
  const [isFullScreen, setFullScreen] = React.useState(false)

  function toggle() {
    setFullScreen(value => !value)
  }

  return (
    <FullScreenContext.Provider value={{ isFullScreen, toggle }}>
      {children}
    </FullScreenContext.Provider>
  )
}

export const useFullScreen = () => useContext(FullScreenContext)
