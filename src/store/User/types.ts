import { FunctionComponent } from 'preact'
import { AxiosResponse } from 'axios'

export type UserType = {
  id: number
  deny_access: string
  login: string
  password: string
}

export type NewUserType = {
  deny_access: string
  login: string
  actions: FunctionComponent
}

export interface UserState {
  users: UserType[]
  error: string

  getUsers: () => Promise<void | AxiosResponse<any, any>>
  deleteUser: (id: number) => Promise<void | AxiosResponse<any, any>>
  editUser: (updatedAccount: UserType) => Promise<void | AxiosResponse<any, any>>
  createUser: (newAccount: NewUserType) => Promise<void | AxiosResponse<any, any>>
  setUsers: (updatedAccounts: UserType[]) => void
  setError: (updatedError: string) => void
}
