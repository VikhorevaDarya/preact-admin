import { Button } from 'antd'

import { useEffect, useState } from 'preact/hooks'
import { shallow } from 'zustand/shallow'

import { useUserStore } from '@/store'
import { Table, Filter, Modal } from '@/components'

import { UserType } from '@/store/User/types'
import { ModalType } from '@/components/Modal/types'

import './styles.scss'

const modalTypes = {
  create: 'create',
  edit: 'edit',
  delete: 'delete',
}

const AccountManagement = () => {
  const [getUsers, setModalError] = useUserStore(
    (state) => [state.getUsers, state.setModalError],
    shallow,
  )

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<null | UserType>(null)
  const [modalType, setModalType] = useState<ModalType | null>(null)

  const handleEdit = () => {
    setIsOpenModal(true)
    setModalType(modalTypes.edit as ModalType)
  }

  const handleDelete = () => {
    setModalType(modalTypes.delete as ModalType)
    setIsOpenModal(true)
  }

  const closeModal = () => {
    setIsOpenModal(false)
    setSelectedUser(null)
    setModalError('')
  }

  const handleAddButtonClick = () => {
    setModalType(modalTypes.create as ModalType)
    setIsOpenModal(true)
    setSelectedUser(null)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div class='account-management'>
      <h1 class='account-management__title'>Registry Account Management</h1>
      <div class='account-management__header'>
        <Filter />
        <Button
          className='account-management__add-button'
          type='primary'
          onClick={handleAddButtonClick}
        >
          Add User
        </Button>
      </div>

      <div class='account-management__content'>
        <Table
          setSelectedUser={setSelectedUser}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </div>

      {isOpenModal && <Modal onClose={closeModal} user={selectedUser} type={modalType} />}
    </div>
  )
}

export default AccountManagement
