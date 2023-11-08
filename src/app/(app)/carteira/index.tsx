import { FullscreenButton } from '@/components/fullscreen-button'
import { APIResponse, api } from '@/util/api'
import Barcode from '@kichiyaki/react-native-barcode-generator'
import { useQuery } from '@tanstack/react-query'
import { Tabs } from 'expo-router'
import { Dimensions, RefreshControl } from 'react-native'
import { Image, ScrollView, Spinner, Text, View, XStack, YStack } from 'tamagui'

export type Carteira = APIResponse<{
  codBarras: string
  cpf: string
  cursoOuCargo: string
  dataNascimento: string
  fatorRH: null
  fotoBase64: string
  matricula: string
  moradorCEU: boolean
  nome: string
  nomeCivil: null
  rg: string
  tipo: number
  tipoSanguineo: null
  unidade: string
  vinculo: string
}>

export default function Page() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['carteira'],
    queryFn: () =>
      api
        .post<Carteira>(
          '/buscaCarteira',
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

  const size = 11

  return (
    <View flex={1}>
      <Tabs.Screen
        options={{
          title: 'e-Carteira da UFSM',
          headerRight: () => <FullscreenButton />,
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
          <Text textTransform='capitalize'>{data.nome}</Text>
          <XStack gap='$2'>
            <Image
              source={{ uri: 'data:image/png;base64,' + data.fotoBase64 }}
              width={size * 10}
              height={size * 13}
              borderRadius='$2'
            />
            <YStack flexShrink={1} gap='$2'>
              <YStack>
                <Text fontWeight='bold'>Matricula</Text>
                <Text fontSize={14}>{data.matricula}</Text>
              </YStack>
              <YStack>
                <Text fontWeight='bold'>Vínculo</Text>
                <Text fontSize={14}>{data.vinculo}</Text>
              </YStack>
              <YStack>
                <Text fontWeight='bold'>Curso</Text>
                <Text fontSize={14}>{data.cursoOuCargo}</Text>
              </YStack>
            </YStack>
          </XStack>
        </YStack>
        <YStack bg='$gray5' p='$3' borderRadius='$4' gap='$2'>
          <XStack>
            <YStack flex={1}>
              <Text fontWeight='bold'>Data de Nascimento</Text>
              <Text fontSize={14}>{data.dataNascimento}</Text>
            </YStack>
            <YStack flex={1}>
              <Text fontWeight='bold'>Grupo sanguíneo</Text>
              <Text fontSize={14}>{data.tipoSanguineo ?? 'Não declarado'}</Text>
            </YStack>
          </XStack>
          <XStack>
            <YStack flex={1}>
              <Text fontWeight='bold'>RG</Text>
              <Text fontSize={14}>{data.rg}</Text>
            </YStack>
            <YStack flex={1}>
              <Text fontWeight='bold'>CPF</Text>
              <Text fontSize={14}>{data.cpf}</Text>
            </YStack>
          </XStack>
          <XStack>
            <YStack flex={1}>
              <Text fontWeight='bold'>Morador CEU</Text>
              <Text fontSize={14}>{data.moradorCEU ? 'Sim' : 'Não'}</Text>
            </YStack>
          </XStack>
        </YStack>
        <View mt='auto' p='$3' bg='#FEFEFE' borderRadius='$4'>
          <Barcode
            background='#FEFEFE'
            value={data.codBarras}
            maxWidth={Dimensions.get('window').width - 48}
            height={80}
          />
        </View>
      </ScrollView>
    </View>
  )
}
