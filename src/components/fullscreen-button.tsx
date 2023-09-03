import { useFullScreen } from '@/context/FullScreenContext'
import { Maximize, Minimize } from '@tamagui/lucide-icons'
import { View } from 'tamagui'

export function FullscreenButton() {
  const { isFullScreen, toggle } = useFullScreen()

  return (
    <View onPress={toggle} p='$2' m='$-2' bg='$gray4' borderRadius='$3'>
      {isFullScreen ? <Minimize size='$icon.sm' /> : <Maximize size='$icon.sm' />}
    </View>
  )
}
