import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { customAlphabet } from 'nanoid/non-secure'
import { ToastAndroid } from 'react-native'

export type APIResponse<T> = {
  error: boolean
  codigo: number
  mensagem: string
  id: number | null
} & T

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)

export async function getDeviceId() {
  const deviceId = await SecureStore.getItemAsync('deviceId')

  if (!deviceId) {
    const newDeviceId = nanoid(10)
    await SecureStore.setItemAsync('deviceId', newDeviceId)

    return newDeviceId
  }

  return deviceId
}

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
})

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('session')
  const deviceId = await getDeviceId()

  if (token && deviceId) {
    config.headers['x-ufsm-access-token'] = token
    config.headers['x-ufsm-device-id'] = deviceId
  }

  return config
})

api.interceptors.response.use(response => {
  if (response.data.error) {
    ToastAndroid.show(response.data.mensagem, ToastAndroid.SHORT)
    return Promise.reject(response.data.mensagem)
  }

  return response
})
