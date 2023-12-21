import { shallow } from 'zustand/shallow'
import { Table, Button, Tooltip, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useState } from 'preact/hooks'

import { Tools, Filter, Modal } from '@/components'
import { useUserStore } from '@/store'
import { lineCounter } from '@/utils'

import { UserType } from '@/store/User/types'
import { ModalType } from '@/components/Modal/types'

import './styles.scss'

const modalTypes = {
  create: 'create',
  edit: 'edit',
  delete: 'delete',
}

const columns = [
  {
    title: 'Login',
    dataIndex: 'login',
    key: 'login',
  },
  {
    title: 'Access',
    dataIndex: 'rules',
    key: 'rules',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'table__edit',
  },
]

function TableComponent() {
  const [users, setError, error, isLoadingUsers] = useUserStore(
    (state) => [state.users, state.setError, state.error, state.isLoadingUsers],
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
    setError('')
  }

  const getSelectedUser = (login: string) => {
    setSelectedUser(users.find((item) => item.login === login))
  }

  const handleAddButtonClick = () => {
    setModalType(modalTypes.create as ModalType)
    setIsOpenModal(true)
    setSelectedUser(null)
  }

  const dataSource = users?.map((item) => {
    return {
      ...item,
      rules: item.rules ? (
        <Tooltip
          placement='top'
          title={item.rules.map((item, index) => (
            <p class='table__tooltip-inner-item' key={index}>
              {item}
            </p>
          ))}
        >
          {`${item.rules.length} ${item.rules.length > 1 ? 'rules' : 'rule'}`}
        </Tooltip>
      ) : (
        'ALL'
      ),
      actions: <Tools onEdit={handleEdit} onDelete={handleDelete} />,
    }
  })

  const tableProps = {
    dataSource,
    columns: columns,
    tableLayout: 'fixed',
  }

  return (
    <div class='table'>
      <div class='table__header'>
        <Filter />
        <Button className='table__add-button' type='primary' onClick={handleAddButtonClick}>
          Add User
        </Button>
      </div>

      {users && (
        <Table
          {...tableProps}
          onRow={(record) => {
            return {
              onClick: () => getSelectedUser(record.login),
            }
          }}
        />
      )}

      {isLoadingUsers && (
        <Spin
          className='table__loader'
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        />
      )}

      {error && <span class='table__error'>{error}</span>}

      {isOpenModal && <Modal onClose={closeModal} user={selectedUser} type={modalType} />}
    </div>
  )
}

export default TableComponent
