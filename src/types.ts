import { FunctionComponent } from 'preact'

export type TableRowType = {
  id: number
  rules: string
  login: string
  actions: FunctionComponent
}
