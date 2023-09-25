import { Redirect, Tabs, router } from 'expo-router'
import { useEffect } from 'react'
import { NativeEventEmitter, useColorScheme } from 'react-native'
import Shortcuts, { ShortcutItem } from 'react-native-actions-shortcuts'

import { Paragraph, Spinner, View, XStack, YStack } from 'tamagui'

import config from '@/../tamagui.config'
import { BottomNav } from '@/components/bottom-nav'
import { useSession } from '@/context/SessionContext'

//@ts-expect-error
const ShortcutsEmitter = new NativeEventEmitter(Shortcuts)

const EXTRATO_SHORTCUT = 'extrato'
const CARDAPIO_SHORTCUT = 'cardapio'
const CARTEIRA_SHORTCUT = 'carteira'
const AGENDAMENTOS_SHORTCUT = 'agendamentos'

export default function AppLayout() {
  const { session, isLoading } = useSession()
  const colorScheme = useColorScheme()

  function processShortcut(item: ShortcutItem) {
    router.replace(item.data.path)
  }

  useEffect(() => {
    if (!Shortcuts) {
      return
    }

    Shortcuts.setShortcuts([
      {
        type: EXTRATO_SHORTCUT,
        title: 'Extrato',
        data: {
          path: '/',
        },
        iconName: 'extrato',
      },
      {
        type: CARDAPIO_SHORTCUT,
        title: 'Cardápio',
        data: {
          path: '/cardapio',
        },
        iconName: 'cardapio',
      },
      {
        type: CARTEIRA_SHORTCUT,
        title: 'Carteira',
        data: {
          path: '/carteira',
        },
        iconName: 'carteira',
      },
      {
        type: AGENDAMENTOS_SHORTCUT,
        title: 'Agendamentos',
        data: {
          path: '/agendamentos',
        },
        iconName: 'agendamentos',
      },
    ])

    ShortcutsEmitter.addListener('onShortcutItemPressed', processShortcut)

    return () => ShortcutsEmitter.removeAllListeners('onShortcutItemPressed')
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
              <XStack
                ai='center'
                m='$2'
                backgroundColor='$gray5'
                px='$4'
                py='$3'
                borderRadius='$4'
              >
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
