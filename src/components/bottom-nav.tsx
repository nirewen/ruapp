import { View, XStack, YStack } from 'tamagui'

import { useFullScreen } from '@/context/FullScreenContext'
import { Clock9, DollarSign, MenuSquare, User2, Wallet } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'

export function BottomNav({ state }: { state: { index: number } }) {
  const { isFullScreen } = useFullScreen()

  return (
    <YStack display={isFullScreen ? 'none' : 'flex'}>
      <XStack ai='center' jc='space-evenly' py='$4' m='$2' bg='$gray5' borderRadius='$4'>
        <Link href='/'>
          <DollarSign />
        </Link>
        <Link href='/cardapio'>
          <MenuSquare />
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
          <Clock9 />
        </Link>
        <Link href='/perfil'>
          <User2 />
        </Link>
      </XStack>
    </YStack>
  )
}
