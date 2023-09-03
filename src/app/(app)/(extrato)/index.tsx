import { useQuery } from '@tanstack/react-query'

import { APIResponse, api } from '@/util/api'
import dayjs from 'dayjs'
import { Tabs } from 'expo-router'
import { RefreshControl } from 'react-native-gesture-handler'
import { ScrollView, Spinner, Text, View, XStack, YStack } from 'tamagui'

export type Extrato = APIResponse<{
  saldoPeriodo: number
  saldoAnterior: number
  movimentacoes: Movimentacao[]
}>

export type Movimentacao = {
  id: number
  data: Date
  descricao: string
  operacao: string
  valor: number
}

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function Page() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['extrato'],
    queryFn: () => api.post<Extrato>('/ru/extrato', {}).then(res => res.data),
  })

  if (isLoading) {
    return <Spinner size='large' />
  }

  if (!data) {
    return null
  }

  return (
    <View>
      <Tabs.Screen
        options={{
          title: 'Extrato',
        }}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        contentContainerStyle={{ flexGrow: 1 }}
        p='$2'
        pt='$0'
        space='$2'
      >
        <YStack bg='$gray5' p='$3' borderRadius='$4' gap='$2'>
          <YStack>
            <Text fontWeight='bold' fontSize='$6'>
              Saldo atual
            </Text>
            <Text fontSize='$10' fontWeight='bold'>
              {formatter.format(data.saldoPeriodo)}
            </Text>
          </YStack>
          <YStack>
            <Text fontWeight='bold'>Saldo anterior</Text>
            <Text fontSize={16}>{formatter.format(data.saldoAnterior)}</Text>
          </YStack>
        </YStack>
        <YStack bg='$gray5' p='$3' borderRadius='$4' gap='$4'>
          {data.movimentacoes.map((movimentacao, i) => (
            <XStack jc='space-between' key={i}>
              <YStack>
                <Text fontWeight='bold'>{dayjs(movimentacao.data).format('DD/MM/YYYY')}</Text>
                <Text>{movimentacao.descricao}</Text>
              </YStack>
              <YStack ai='flex-end'>
                <Text fontWeight='bold'>{movimentacao.operacao}</Text>
                <Text>{formatter.format(movimentacao.valor)}</Text>
              </YStack>
            </XStack>
          ))}
        </YStack>
      </ScrollView>
    </View>
  )
}
