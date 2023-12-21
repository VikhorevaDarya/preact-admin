import { FunctionComponent } from 'preact'
import { AxiosResponse } from 'axios'

export type UserType = {
  id: number
  rules: string[]
  login: string
  password: string
}

export type NewUserType = {
  rules: string
  login: string
  actions: FunctionComponent
}

export interface UserState {
  users: UserType[]
  error: string
  isLoadingUsers: boolean
  isLoadingUpdateUser: boolean

  getUsers: () => Promise<void | AxiosResponse<any, any>>
  deleteUser: (login: string) => Promise<void | AxiosResponse<any, any>>
  editUser: (updatedUser: UserType) => Promise<void | AxiosResponse<any, any>>
  createUser: (newUser: NewUserType) => Promise<void | AxiosResponse<any, any>>
  setUsers: (updatedUsers: UserType[]) => void
  setError: (updatedError: string) => void
}
