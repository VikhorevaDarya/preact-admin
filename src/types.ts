import { FunctionComponent } from 'preact'

export type AccountType = {
  id: number
  deny_access: string
  login: string
  password: string
}

export type TableRowType = {
  id: number
  deny_access: string
  login: string
  actions: FunctionComponent
}

export type NewAccountType = {
  deny_access: string
  login: string
  actions: FunctionComponent
}

export type ModalType = 'edit' | 'delete' | 'create'
