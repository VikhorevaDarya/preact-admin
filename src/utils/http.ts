import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import { useAuthStore } from '@/store'

type ErrorType = {
  message: string
}

export interface HTTPOptions extends AxiosRequestConfig {
  statusIgnore?: number[]
}

export const baseURL = `${import.meta.env.VITE_PREACT_APP_API_URL}/api`

const getStatus = (error: AxiosError): number => error.response?.status || 0

const getBackendErrorMessage = (error: AxiosError<ErrorType>): string | undefined =>
  error.response?.data?.message

const http = (options: HTTPOptions = { statusIgnore: [] }) => {
  const { statusIgnore } = options

  const defaultOptions = {
    baseURL,
  }

  const instance = axios.create({
    ...defaultOptions,
    ...options,
  })

  const requestHandler = (request: AxiosRequestConfig) => {
    const { token } = useAuthStore.getState()

    request.headers['Authorization'] = `Bearer ${token}`

    return request
  }

  const responseHandler = (response: AxiosResponse) => {
    return response
  }

  const errorHandler = (error: AxiosError<ErrorType>) => {
    const status = getStatus(error)
    const backendErrorMessage = getBackendErrorMessage(error)
    const errorMessage = backendErrorMessage || error.message

    let message: string | undefined = errorMessage

    if (statusIgnore?.includes(status)) {
      message = undefined
    }

    if (message) {
      console.error(`${status}: ${message}`)
    }

    return Promise.reject(error)
  }

  instance.interceptors.request.use(
    requestHandler as (value: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>,
    errorHandler,
  )
  instance.interceptors.response.use(responseHandler, errorHandler)

  return instance
}

export default http
