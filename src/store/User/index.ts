import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { UserType, NewUserType } from './types'
import { http } from '@/utils'
import { UserState } from './types'

export const ROUTES = {
  users: '/user',
}

const useUserStore = create<UserState>()(
  devtools((set) => ({
    users: null,
    error: '',
    isLoadingUsers: false,
    isLoadingUpdateUser: false,

    getUsers: () => {
      set(() => ({
        isLoadingUsers: true,
        users: null,
      }))

      return http()
        .get(ROUTES.users)
        .then((response) => {
          set(() => ({
            users: response.data,
            error: '',
            isLoadingUsers: false,
          }))

          return response.data
        })
        .catch((error) => {
          set(() => ({
            isLoadingUsers: false,
            error: error.message,
          }))
        })
    },

    setUsers: (updatedUsers: UserType[]) =>
      set(() => ({
        users: updatedUsers,
      })),

    setError: (updatedError: string) =>
      set(() => ({
        error: updatedError,
      })),

    deleteUser: (login: string) => {
      set(() => ({
        isLoadingUpdateUser: true,
      }))

      return http()
        .delete(`${ROUTES.users}/${login}`)
        .then((response) => {
          set(() => ({
            error: '',
            isLoadingUpdateUser: false,
          }))

          return response
        })
        .catch((error) =>
          set(() => ({
            error: error.message,
            isLoadingUpdateUser: false,
          })),
        )
    },

    editUser: (updatedUser: NewUserType) => {
      set(() => ({
        isLoadingUpdateUser: true,
      }))

      return http()
        .put(ROUTES.users, {
          ...updatedUser,
          rules: updatedUser.rules.split('\n'),
        })
        .then((response) => {
          set(() => ({
            error: '',
            isLoadingUpdateUser: false,
          }))

          return response
        })
        .catch((error) =>
          set(() => ({
            error: error.message,
            isLoadingUpdateUser: false,
          })),
        )
    },

    createUser: (newUser: NewUserType) => {
      set(() => ({
        isLoadingUpdateUser: true,
      }))

      return http()
        .post(ROUTES.users, {
          ...newUser,
          rules: newUser.rules.split('\n'),
        })
        .then((response) => {
          set(() => ({
            error: '',
            isLoadingUpdateUser: false,
          }))

          return response
        })
        .catch((error) =>
          set(() => ({
            error: error.message,
            isLoadingUpdateUser: false,
          })),
        )
    },
  })),
)

export default useUserStore
