import { api, getDeviceId } from '@/util/api'
import React, { PropsWithChildren } from 'react'
import { useStorageState } from './useStorageState'

export interface Credentials {
  login: string
  senha: string
}

const AuthContext = React.createContext<{
  signIn: (data: Credentials) => Promise<void>
  signOut: () => void
  session?: string | null
  isLoading: boolean
}>(null!)

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />')
    }
  }

  return value
}

export function SessionProvider(props: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session')

  return (
    <AuthContext.Provider
      value={{
        signIn: async credentials => {
          try {
            const { data } = await api.post('/generateToken', {
              login: credentials.login,
              senha: credentials.senha,
              appName: 'UFSMDigital',
              deviceId: await getDeviceId(),
              deviceInfo: '',
            })

            return setSession(data.token)
          } catch (error: any) {
            console.log(error)
          }
        },
        signOut: () => {
          setSession(null)
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
