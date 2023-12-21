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
  password: string
}

export interface UserState {
  users: UserType[]
  modalError: string
  tableError: string
  isLoadingUsers: boolean
  isLoadingUpdateUser: boolean

  getUsers: () => Promise<void | AxiosResponse<UserType[], any>>
  deleteUser: (login: string) => Promise<void | AxiosResponse<any, any>>
  editUser: (updatedUser: NewUserType) => Promise<void | AxiosResponse<any, any>>
  createUser: (newUser: NewUserType) => Promise<void | AxiosResponse<any, any>>
  setUsers: (updatedUsers: UserType[]) => void
  setModalError: (updatedError: string) => void
  setTableError: (updatedError: string) => void
}
