import { useEffect } from 'preact/hooks'

import { Table } from './components'
import { useAppStore } from '@/store'

export function App() {
  const getAccounts = useAppStore((state) => state.getAccounts)

  useEffect(() => {
    getAccounts()
  }, [])

  return (
    <div class='app'>
      <Table />
    </div>
  )
}
