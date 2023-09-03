import { useQuery } from '@tanstack/react-query'

import { APIResponse, api } from '@/util/api'
import { Check, ChevronDown, ChevronUp, DollarSign } from '@tamagui/lucide-icons'
import dayjs from 'dayjs'
import { Tabs } from 'expo-router'
import { useMemo, useState } from 'react'
import { RefreshControl } from 'react-native-gesture-handler'
import {
  Adapt,
  ScrollView,
  Select,
  SelectProps,
  Sheet,
  Spinner,
  Text,
  XStack,
  YStack,
} from 'tamagui'

export type Cardapio = APIResponse<{
  idRestaurante: number
  nomeRestaurante: string
  tipoRefeicaoItem: number
  tipoRefeicao: string
  data: string
  calorias: string
  preparos: Preparo[]
}>

export type Preparo = {
  id: number
  nome: string
  categoriaItem: number
  ordem: string
  categoria: string
  calorias: string
  cardapioId: number
  ingredientes: Ingrediente[]
}

export type Ingrediente = {
  id: number
  nome: string
  quantidade: number
  calorias: string
  preparoId: number
}

function RestauranteSelect(
  props: {
    value: string
    update: any
    items: {
      label: string
      value: number
    }[]
  } & SelectProps
) {
  return (
    <Select id='restaurante' onValueChange={props.update} {...props}>
      <Select.Trigger width={220} iconAfter={ChevronDown} flex={1}>
        <Select.Value placeholder='Something' />
      </Select.Trigger>

      <Adapt when='sm' platform='touch'>
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay animation='lazy' enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems='center'
          justifyContent='center'
          position='relative'
          width='100%'
          height='$3'
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>Restaurante</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                props.items.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item.value} value={item.value.toString()}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator marginLeft='auto'>
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [props.items]
            )}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems='center'
          justifyContent='center'
          position='relative'
          width='100%'
          height='$3'
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}

export default function Page() {
  const day = dayjs()
  const [start, setStart] = useState(day.day(0))
  const [restaurante, setRestaurante] = useState<string>('1')
  const [dia, setDia] = useState<string>(day.format('YYYY-MM-DD'))

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['cardapio', start],
    queryFn: () =>
      api
        .post<Cardapio[]>(
          '/ru/cardapio',
          {},
          {
            params: {
              dataInicioStr: start.format('DD/MM/YYYY'),
              dataFimStr: start.day(6).format('DD/MM/YYYY'),
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

  function DayButton({ day }: { day: dayjs.Dayjs }) {
    if (!data) return null

    const cardapio = data
      .filter(c => c.idRestaurante.toString() === restaurante)
      .filter(c => c.data === day.format('YYYY-MM-DD'))
    const selected = day.isSame(dayjs(dia), 'date')

    return (
      <YStack
        bg='$gray5'
        flex={1}
        onPress={() => {
          setDia(day.format('YYYY-MM-DD'))
        }}
      >
        <YStack ai='flex-end' p='$0.5' borderBottomWidth='$0.5' borderBottomColor='$gray4'>
          <Text color='$gray9' fontWeight='bold'>
            {day.format('ddd')}
          </Text>
        </YStack>
        <YStack bg={selected ? '$gray7' : '$gray5'} flex={1} p='$1' minHeight='$6'>
          <Text alignSelf='flex-end' color='$gray9' fontWeight='bold'>
            {day.format('DD')}
          </Text>
          <YStack gap='$0.5'>
            {cardapio.length > 0 &&
              cardapio.map((cardapio, index) => (
                <Text
                  color='$gray10'
                  fontWeight='bold'
                  key={index}
                  fontSize={10}
                  bg='$green4'
                  borderRadius='$size.0.25'
                  py='$0.5'
                  px='$1'
                >
                  {cardapio.tipoRefeicao}
                </Text>
              ))}
          </YStack>
        </YStack>
      </YStack>
    )
  }

  const cardapio = data
    .filter(c => c.idRestaurante.toString() === restaurante)
    .filter(c => c.data === dia)
  const restaurantes = data
    .map(c => ({
      label: c.nomeRestaurante,
      value: c.idRestaurante,
    }))
    .reduce((acc, cur) => {
      if (!acc.find(a => a.value === cur.value)) acc.push(cur)

      return acc
    }, [] as { label: string; value: number }[])
    .sort((a, b) => [1, 41, 42, 4].indexOf(a.value) - [1, 41, 42, 4].indexOf(b.value))

  return (
    <YStack flex={1}>
      <Tabs.Screen
        options={{
          title: 'Cardápio',
          tabBarIcon: ({ color }) => {
            return <DollarSign color={color} />
          },
        }}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        contentContainerStyle={{ flexGrow: 1 }}
        p='$2'
        pt='$0'
        space='$2'
      >
        <XStack>
          <RestauranteSelect
            native
            value={restaurante}
            items={restaurantes}
            update={setRestaurante}
          />
        </XStack>
        <XStack borderRadius='$2' overflow='hidden'>
          <DayButton day={day.day(1)} />
          <DayButton day={day.day(2)} />
          <DayButton day={day.day(3)} />
          <DayButton day={day.day(4)} />
          <DayButton day={day.day(5)} />
          <DayButton day={day.day(6)} />
          <DayButton day={day.day(7)} />
        </XStack>
        {cardapio.length > 0 ? (
          cardapio.map((cardapio, index) => (
            <YStack p='$2' bg='$gray5' borderRadius='$2' key={index}>
              <Text fontWeight='bold' fontSize='$7' p='$2' pt='$0'>
                {cardapio.tipoRefeicao}
              </Text>
              <YStack borderRadius='$2' overflow='hidden'>
                {cardapio.preparos.map((preparo, index) => (
                  <YStack key={index} bg={index % 2 === 0 ? '$gray3' : '$gray4'} py='$1.5' px='$2'>
                    <Text fontSize='$4'>{preparo.nome}</Text>
                  </YStack>
                ))}
              </YStack>
            </YStack>
          ))
        ) : (
          <Text>Cardápio indisponível</Text>
        )}
      </ScrollView>
    </YStack>
  )
}
