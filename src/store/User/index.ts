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

    getUsers: () => {
      return http()
        .get(ROUTES.users)
        .then((response) => {
          set(() => ({
            accounts: response.data,
            error: '',
          }))

          return response.data
        })
        .catch((error) => console.log(error))
    },

    setUsers: (updatedUsers: UserType[]) =>
      set(() => ({
        users: updatedUsers,
      })),

    setError: (updatedError: string) =>
      set(() => ({
        error: updatedError,
      })),

    deleteUser: (id: number) => {
      return http()
        .delete(`${ROUTES.users}/${id}`)
        .then((response) => {
          set(() => ({
            error: '',
          }))

          return response
        })
        .catch((error) =>
          set(() => ({
            error: error.message,
          })),
        )
    },

    editUser: (updatedUser: UserType) => {
      return http()
        .put(`${ROUTES.users}/${updatedUser.id}`, updatedUser)
        .then((response) => {
          set(() => ({
            error: '',
          }))

          return response
        })
        .catch((error) =>
          set(() => ({
            error: error.message,
          })),
        )
    },

    createUser: (newUser: NewUserType) => {
      return http()
        .post(ROUTES.users, newUser)
        .then((response) => {
          set(() => ({
            error: '',
          }))

          return response
        })
        .catch((error) =>
          set(() => ({
            error: error.message,
          })),
        )
    },
  })),
)

export default useUserStore
