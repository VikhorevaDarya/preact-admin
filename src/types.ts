import { FunctionComponent } from 'preact'

export type TableRowType = {
  id: number
  deny_access: string
  login: string
  actions: FunctionComponent
}
