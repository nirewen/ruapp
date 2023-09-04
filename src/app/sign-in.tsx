import { useSession } from '@/context/SessionContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'

import { Button, Input, Label, Text, YStack } from 'tamagui'
import { z } from 'zod'

const schema = z.object({
  login: z.string({ required_error: 'Campo obrigatório' }).regex(/^\d+$/, 'Somente números'),
  senha: z.string({ required_error: 'Campo obrigatório' }),
})

type Fields = z.infer<typeof schema>

export default function App() {
  const { signIn } = useSession()
  const { control, handleSubmit, setFocus } = useForm<Fields>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: Fields) {
    signIn(data).then(() => {
      router.replace('/')
    })
  }

  return (
    <YStack f={1} jc='center' p='$4'>
      <YStack bg='$gray5' p='$4' borderRadius='$4'>
        <Controller
          control={control}
          name='login'
          render={({ field, fieldState: { error } }) => {
            return (
              <YStack>
                <Label htmlFor='login'>CPF ou Matrícula</Label>
                <Input
                  id='login'
                  onSubmitEditing={() => setFocus('senha')}
                  keyboardType='number-pad'
                  returnKeyType='next'
                  onChangeText={field.onChange}
                  {...field}
                />
                <Text color={error ? '$red10' : 'white'}>{error?.message ?? ''}</Text>
              </YStack>
            )
          }}
        />
        <Controller
          control={control}
          name='senha'
          render={({ field, fieldState: { error } }) => {
            return (
              <YStack>
                <Label htmlFor='senha'>Senha</Label>
                <Input
                  id='senha'
                  secureTextEntry
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyType='done'
                  onChangeText={field.onChange}
                  {...field}
                />
                <Text color={error ? '$red10' : 'white'}>{error?.message ?? ''}</Text>
              </YStack>
            )
          }}
        />
        <Button mt='$2' onPress={handleSubmit(onSubmit)}>
          Entrar
        </Button>
      </YStack>
    </YStack>
  )
}
