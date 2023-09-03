import { Redirect, Tabs, router } from 'expo-router'
import { useEffect } from 'react'

import { DeviceEventEmitter, useColorScheme } from 'react-native'
import { Paragraph, Spinner, View, XStack, YStack } from 'tamagui'

import config from '@/../tamagui.config'
import { BottomNav } from '@/components/bottom-nav'
import { useSession } from '@/context/SessionContext'
import QuickActions, { ShortcutItem } from 'react-native-quick-actions'

const EXTRATO_SHORTCUT = 'extrato'
const CARDAPIO_SHORTCUT = 'cardapio'
const CARTEIRA_SHORTCUT = 'carteira'
const AGENDAMENTOS_SHORTCUT = 'agendamentos'

export default function AppLayout() {
  const { session, isLoading } = useSession()
  const colorScheme = useColorScheme()

  function processShortcut(item: ShortcutItem) {
    if (item.type === EXTRATO_SHORTCUT) {
      router.replace('/')
    }

    if (item.type === CARDAPIO_SHORTCUT) {
      router.replace('/cardapio')
    }

    if (item.type === CARTEIRA_SHORTCUT) {
      router.replace('/carteira')
    }

    if (item.type === AGENDAMENTOS_SHORTCUT) {
      router.replace('/agendamentos')
    }
  }

  useEffect(() => {
    QuickActions.setShortcutItems([
      {
        type: EXTRATO_SHORTCUT,
        title: 'Extrato',
        icon: 'DollarSignIcon',
        userInfo: {
          url: '/',
        },
      },
      {
        type: CARDAPIO_SHORTCUT,
        title: 'Cardápio',
        icon: 'MenuIcon',
        userInfo: {
          url: '/',
        },
      },
      {
        type: CARTEIRA_SHORTCUT,
        title: 'Carteira',
        icon: 'WalletIcon',
        userInfo: {
          url: '/',
        },
      },
      {
        type: AGENDAMENTOS_SHORTCUT,
        title: 'Agendamentos',
        icon: 'Clock9Icon',
        userInfo: {
          url: '/',
        },
      },
    ])

    QuickActions.popInitialAction().then(processShortcut).catch(console.error)
    DeviceEventEmitter.addListener('quickActionShortcut', processShortcut)

    return () => {
      QuickActions.clearShortcutItems()
      DeviceEventEmitter.removeAllListeners('quickActionShortcut')
    }
  }, [])

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Spinner size='large' />
  }

  // Only require authentication within the (app) group's layout as users need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated in the headless Node process that the pages are rendered in.
    return <Redirect href='/sign-in' />
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <YStack flex={1}>
      <Tabs
        screenOptions={{
          header: ({ options }) => {
            const HeaderLeft = options.headerLeft
            const HeaderRight = options.headerRight

            return (
              <XStack ai='center' m='$2' backgroundColor='$gray5' px='$4' py='$3' borderRadius='$4'>
                {HeaderLeft && <HeaderLeft />}
                <Paragraph>{options.title ?? 'Carregando...'}</Paragraph>
                {HeaderRight && (
                  <View ml='auto'>
                    <HeaderRight />
                  </View>
                )}
              </XStack>
            )
          },
        }}
        sceneContainerStyle={{
          backgroundColor:
            colorScheme === 'dark'
              ? config.themes.dark.background.val
              : config.themes.light.background.val,
        }}
        tabBar={({ state }) => {
          return <BottomNav state={state} />
        }}
      />
    </YStack>
  )
}
