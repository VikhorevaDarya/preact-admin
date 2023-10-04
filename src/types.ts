import { FunctionComponent } from 'preact'

export type AccountType = {
  id: number
  access: string
  login: string
  password: string
}

export type TableRowType = {
  id: number
  access: string
  login: string
  actions: FunctionComponent
}

export type NewAccountType = {
  access: string
  login: string
  actions: FunctionComponent
}

export type ModalType = 'edit' | 'delete' | 'create'
