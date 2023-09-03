import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Tabs } from 'expo-router'
import { RefreshControl } from 'react-native-gesture-handler'
import { AlertDialog, Button, ScrollView, Spinner, Text, View, XStack, YStack } from 'tamagui'

import { APIResponse, api } from '@/util/api'
import { X } from '@tamagui/lucide-icons'

export type Agendamento = APIResponse<{
  data: string
  tipoRefeicao: string
  restaurante: string
  realizada: boolean
  avaliada: boolean
  permiteDisponibilizar: boolean
  limiteCancelamento: string
  dataRefeicao: null
  situacao: string
  mensagemCancelamento: null
}>

export function CancelarRefeicao({ onConfirm }: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <Button>
          <X />
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay key='overlay' animation='quick' opacity={0.5} />
        <AlertDialog.Content bordered elevate key='content'>
          <YStack space>
            <AlertDialog.Title>Cancelar agendamento</AlertDialog.Title>
            <AlertDialog.Description>
              Deseja realmente cancelar este agendamento?
            </AlertDialog.Description>

            <XStack space='$3' justifyContent='flex-end'>
              <AlertDialog.Cancel asChild>
                <Button>Não</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild onPress={onConfirm}>
                <Button theme='active'>Sim</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}

function getSituacao(situacao: string) {
  switch (situacao) {
    case 'FUTURA':
      return 'Refeição futura'
    case 'REALIZADA':
      return 'Refeição realizada'
  }
}

export default function Page() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['agendamentos'],
    queryFn: () => api.post<Agendamento[]>('/ru/agendamentos', {}).then(res => res.data),
  })
  const { mutate } = useMutation({
    mutationKey: ['agendamentos'],
    mutationFn: (idAgendamento: number) =>
      api
        .post<Agendamento[]>(
          '/ru/cancelaAgendamento',
          {
            idAgendamento,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then(res => res.data)
        .then(() => refetch()),
  })

  if (isLoading) {
    return <Spinner size='large' />
  }

  if (!data) {
    return null
  }

  return (
    <View flex={1}>
      <Tabs.Screen
        options={{
          title: 'Agendamentos',
        }}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        contentContainerStyle={{ flexGrow: 1 }}
        p='$2'
        pt='$0'
        space='$2'
      >
        {data.map((agendamento, i) => (
          <XStack bg='$gray5' p='$3' borderRadius='$4' gap='$4' key={i}>
            <YStack flex={1}>
              <Text fontWeight='bold'>{dayjs(agendamento.data).format('ddd DD/MM/YYYY')}</Text>
              <Text fontSize='$8'>{agendamento.tipoRefeicao}</Text>
              <Text>{agendamento.restaurante}</Text>
              <Text>Situação: {getSituacao(agendamento.situacao)}</Text>
            </YStack>
            <YStack>
              <CancelarRefeicao onConfirm={() => mutate(agendamento.id!)} />
            </YStack>
          </XStack>
        ))}
      </ScrollView>
    </View>
  )
}
