import { View, XStack, YStack } from 'tamagui'

import { useFullScreen } from '@/context/FullScreenContext'
import { Clock9, DollarSign, MenuSquare, User2, Wallet } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'

export function BottomNav({ state }: { state: { index: number } }) {
  const { isFullScreen } = useFullScreen()

  return (
    <YStack display={isFullScreen ? 'none' : 'flex'}>
      <XStack ai='center' jc='space-around' py='$2.5' m='$2' bg='$gray5' borderRadius='$4'>
        <Link href='/'>
          <View
            jc='center'
            ai='center'
            p='$3'
            borderRadius='$2'
            bg={state.index === 3 ? '$gray7' : '$colorTransparent'}
          >
            <DollarSign />
          </View>
        </Link>
        <Link href='/cardapio'>
          <View
            jc='center'
            ai='center'
            p='$3'
            borderRadius='$2'
            bg={state.index === 1 ? '$gray7' : '$colorTransparent'}
          >
            <MenuSquare />
          </View>
        </Link>
        <View
          bg='$blue7'
          p='$3'
          mt='$-10'
          mb='$-6'
          borderRadius='$6'
          borderStyle='solid'
          borderWidth='$1.5'
          borderColor='$background'
        >
          <Link href='/carteira'>
            <Wallet size='$3' />
          </Link>
        </View>
        <Link href='/agendamentos'>
          <View
            jc='center'
            ai='center'
            p='$3'
            borderRadius='$2'
            bg={state.index === 4 ? '$gray7' : '$colorTransparent'}
          >
            <Clock9 />
          </View>
        </Link>
        <Link href='/perfil'>
          <View
            jc='center'
            ai='center'
            p='$3'
            borderRadius='$2'
            bg={state.index === 0 ? '$gray7' : '$colorTransparent'}
          >
            <User2 />
          </View>
        </Link>
      </XStack>
    </YStack>
  )
}
