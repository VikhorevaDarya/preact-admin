import { AxiosResponse } from 'axios'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { AccountType, NewAccountType } from '@/types'
import { http } from '@/utils'

interface AppState {
  accounts: AccountType[]

  getAccounts: () => Promise<void | AxiosResponse<any, any>>
  deleteAccount: (id: number) => Promise<void | AxiosResponse<any, any>>
  editAccount: (updatedAccount: AccountType) => Promise<void | AxiosResponse<any, any>>
  createAccount: (newAccount: NewAccountType) => Promise<void | AxiosResponse<any, any>>
  setAccounts: (updatedAccounts: AccountType[]) => void
}

export const ROUTES = {
  accounts: '/accounts',
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    accounts: null,

    getAccounts: () => {
      return http()
        .get(ROUTES.accounts)
        .then((response) => {
          set(() => ({
            accounts: response.data,
          }))

          return response.data
        })
        .catch((error) => console.log(error))
    },

    setAccounts: (updatedAccounts: AccountType[]) =>
      set(() => ({
        accounts: updatedAccounts,
      })),

    deleteAccount: (id: number) => {
      return http()
        .delete(`${ROUTES.accounts}/${id}`)
        .then((response) => {
          return response
        })
        .catch((error) => console.log(error))
    },

    editAccount: (updatedAccount: AccountType) => {
      return http()
        .put(`${ROUTES.accounts}/${updatedAccount.id}`, updatedAccount)
        .then((response) => {
          return response
        })
        .catch((error) => console.log(error))
    },

    createAccount: (newAccount: NewAccountType) => {
      return http()
        .post(ROUTES.accounts, newAccount)
        .then((response) => {
          return response
        })
        .catch((error) => console.log(error))
    },
  })),
)

export default useAppStore
