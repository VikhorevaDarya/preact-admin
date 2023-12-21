import { useEffect } from 'preact/hooks'
import { shallow } from 'zustand/shallow'

import { useUserStore } from '@/store'
import { Table } from '@/components'

import './styles.scss'

const AccountManagement = () => {
  const [getUsers] = useUserStore((state) => [state.getUsers], shallow)

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div class='account-management'>
      <h1 class='account-management__title'>Registry Account Management</h1>
      <Table />
    </div>
  )
}

export default AccountManagement
