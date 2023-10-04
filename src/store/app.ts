import { AxiosResponse } from 'axios'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { AccountType, NewAccountType } from '@/types'
import { http } from '@/utils'

interface AppState {
  accounts: AccountType[]
  error: string

  getAccounts: () => Promise<void | AxiosResponse<any, any>>
  deleteAccount: (id: number) => Promise<void | AxiosResponse<any, any>>
  editAccount: (updatedAccount: AccountType) => Promise<void | AxiosResponse<any, any>>
  createAccount: (newAccount: NewAccountType) => Promise<void | AxiosResponse<any, any>>
  setAccounts: (updatedAccounts: AccountType[]) => void
  setError: (updatedError: string) => void
}

export const ROUTES = {
  accounts: '/accounts',
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    accounts: null,
    error: '',

    getAccounts: () => {
      return http()
        .get(ROUTES.accounts)
        .then((response) => {
          set(() => ({
            accounts: response.data,
            error: '',
          }))

          return response.data
        })
        .catch((error) => console.log(error))
    },

    setAccounts: (updatedAccounts: AccountType[]) =>
      set(() => ({
        accounts: updatedAccounts,
      })),

    setError: (updatedError: string) =>
      set(() => ({
        error: updatedError,
      })),

    deleteAccount: (id: number) => {
      return http()
        .delete(`${ROUTES.accounts}/${id}`)
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

    editAccount: (updatedAccount: AccountType) => {
      return http()
        .put(`${ROUTES.accounts}/${updatedAccount.id}`, updatedAccount)
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

    createAccount: (newAccount: NewAccountType) => {
      return http()
        .post(ROUTES.accounts, newAccount)
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

export default useAppStore
