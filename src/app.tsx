import { useAuthStore } from '@/store'
import { Auth, AccountManagement } from './pages'

export function App() {
  const [token] = useAuthStore((state) => [state.token])

  return <div class='app'>{token ? <AccountManagement /> : <Auth />}</div>
}
