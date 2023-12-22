import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { NotificationPlacement } from 'antd/es/notification/interface'
import { notification } from 'antd'

import { UserType, NewUserType } from './types'
import { http } from '@/utils'
import { UserState } from './types'

export const ROUTES = {
  users: '/user',
}

const notificationOptions = {
  duration: 3,
  placement: 'bottomRight' as NotificationPlacement,
  className: 'notification',
}

const useUserStore = create<UserState>()(
  devtools((set) => ({
    users: null,
    modalError: '',
    tableError: '',
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
            tableError: '',
            isLoadingUsers: false,
          }))

          return response.data
        })
        .catch((error) => {
          set(() => ({
            isLoadingUsers: false,
            tableError: error.message,
          }))
        })
    },

    setUsers: (updatedUsers: UserType[]) =>
      set(() => ({
        users: updatedUsers,
      })),

    setModalError: (updatedError: string) =>
      set(() => ({
        modalError: updatedError,
      })),

    setTableError: (updatedError: string) =>
      set(() => ({
        tableError: updatedError,
      })),

    deleteUser: (login: string) => {
      set(() => ({
        isLoadingUpdateUser: true,
      }))

      return http()
        .delete(`${ROUTES.users}/${login}`)
        .then((response) => {
          set(() => ({
            modalError: '',
            isLoadingUpdateUser: false,
          }))

          notification.open({
            ...notificationOptions,
            type: 'success',
            message: `${login} deleted successfully`,
          })

          return response
        })
        .catch((error) =>
          set(() => ({
            modalError: error.message,
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
          password: '',
          rules: updatedUser.rules.trim().split('\n').filter(Boolean),
        })
        .then((response) => {
          set(() => ({
            modalError: '',
            isLoadingUpdateUser: false,
          }))

          notification.open({
            ...notificationOptions,
            type: 'success',
            message: `${updatedUser.login} edited successfully`,
          })

          return response
        })
        .catch((error) =>
          set(() => ({
            modalError: error.message,
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
          rules: newUser.rules.trim().split('\n').filter(Boolean),
        })
        .then((response) => {
          set(() => ({
            modalError: '',
            isLoadingUpdateUser: false,
          }))

          notification.open({
            ...notificationOptions,
            type: 'success',
            message: `${newUser.login} created successfully`,
          })

          return response
        })
        .catch((error) =>
          set(() => ({
            modalError: error.message,
            isLoadingUpdateUser: false,
          })),
        )
    },
  })),
)

export default useUserStore
