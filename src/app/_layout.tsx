import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TamaguiProvider, Theme } from 'tamagui'

import config from '../../tamagui.config'

import { SessionProvider } from '@/context/SessionContext'
import { StatusBar } from 'expo-status-bar'

import { FullScreenProvider } from '@/context/FullScreenContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

export default function Layout() {
  const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor:
                colorScheme === 'dark'
                  ? config.themes.dark.background.val
                  : config.themes.light.background.val,
            }}
          >
            <SessionProvider>
              <FullScreenProvider>
                <Slot />
                <StatusBar
                  style={colorScheme === 'dark' ? 'light' : 'dark'}
                  backgroundColor={
                    colorScheme === 'dark'
                      ? config.themes.dark.background.val
                      : config.themes.light.background.val
                  }
                />
              </FullScreenProvider>
            </SessionProvider>
          </SafeAreaView>
        </PersistQueryClientProvider>
      </Theme>
    </TamaguiProvider>
  )
}
