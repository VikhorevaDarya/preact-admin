import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { http } from '@/utils'

import { AuthState } from './types'

export const ROUTES = {
  login: '/login',
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        error: null,
        isLoading: false,

        login: (login: string, password: string) => {
          set(() => ({
            isLoading: true,
          }))

          return http()
            .post(ROUTES.login, { login, password })
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
        setToken: (updatedToken) =>
          set(() => ({
            token: updatedToken,
          })),
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
