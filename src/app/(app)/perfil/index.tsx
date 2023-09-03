import { useQuery } from '@tanstack/react-query'
import { Tabs } from 'expo-router'
import { RefreshControl } from 'react-native-gesture-handler'
import { Image, ScrollView, Spinner, Text, View, XStack, YStack } from 'tamagui'

import { APIResponse, api } from '@/util/api'

export type Perfil = APIResponse<{
  nome: string
  fotoBase64: null
  saldoRu: number
  totalMsgsNaoLidas: number
  siglas: string[]
  restaurantes: APIResponse<Restaurante>[]
}>

export type Restaurante = {
  nome: string
  quantidadeDiasAgendamento: number
}

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function Page() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vinculos'],
    queryFn: () =>
      api
        .post<Perfil>(
          '/vinculos',
          {},
          {
            params: {
              buscaFoto: true,
            },
          }
        )
        .then(res => res.data),
  })

  if (isLoading) {
    return <Spinner size='large' />
  }

  if (!data) {
    return null
  }

  const size = 5

  return (
    <View flex={1}>
      <Tabs.Screen
        options={{
          title: 'Perfil',
        }}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        contentContainerStyle={{ flexGrow: 1 }}
        p='$2'
        pt='$0'
        space='$2'
      >
        <YStack bg='$gray5' p='$3' borderRadius='$4' gap='$3'>
          <XStack gap='$2'>
            <Image
              source={{ uri: 'data:image/png;base64,' + data.fotoBase64 }}
              width={size * 10}
              height={size * 13}
              borderRadius='$2'
            />
            <YStack flexShrink={1} gap='$2'>
              <Text textTransform='capitalize'>{data.nome}</Text>
              <YStack>
                <Text fontWeight='bold'>Saldo RU</Text>
                <Text fontSize={14}>{formatter.format(data.saldoRu)}</Text>
              </YStack>
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>
    </View>
  )
}
