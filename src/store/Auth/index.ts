import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { http } from '@/utils'

import { AuthState } from './types'

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        error: null,
        isLoading: false,

        login: (login: string, password: string) => {
          set(() => ({
            isLoading: true,
          }))

          return http()
            .post('/api/login', { login, password })
            .then((response) =>
              set(() => ({
                token: response.data.token,
                isLoading: false,
              })),
            )
            .catch((error) =>
              set(() => ({
                error: error.response.data.error,
                isLoading: false,
              })),
            )
        },
      }),
      {
        name: 'auth',
        partialize: (state) => ({
          token: state.token,
        }),
      },
    ),
  ),
)

export default useAuthStore
