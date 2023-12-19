export interface AuthState {
  token: string | null
  error: string | null
  isLoading: boolean

  login: (login: string, password: string) => void
}
