import { shallow } from 'zustand/shallow'
import { Table, Button, Tooltip } from 'antd'
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
    dataIndex: 'deny_access',
    key: 'deny_access',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'table__edit',
  },
]

function TableComponent() {
  const [users, setError] = useUserStore((state) => [state.users, state.setError], shallow)

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<null | UserType>(null)
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
    setSelectedAccount(null)
    setError('')
  }

  const getSelectedAccount = (accountId: number) => {
    setSelectedAccount(users.find((item) => item.id === accountId))
  }

  const handleAddButtonClick = () => {
    setModalType(modalTypes.create as ModalType)
    setIsOpenModal(true)
    setSelectedAccount(null)
  }

  const dataSource = users?.map((item) => {
    return {
      ...item,
      deny_access: item.deny_access ? (
        <Tooltip
          placement='top'
          title={item.deny_access.split('\n').map((item, index) => (
            <p class='table__tooltip-inner-item' key={index}>
              {item}
            </p>
          ))}
        >
          {`${lineCounter(item.deny_access)} ${
            lineCounter(item.deny_access) > 1 ? 'rules' : 'rule'
          }`}
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

      <Table
        {...tableProps}
        onRow={(record) => {
          return {
            onClick: () => getSelectedAccount(record.id),
          }
        }}
      />

      {isOpenModal && <Modal onClose={closeModal} account={selectedAccount} type={modalType} />}
    </div>
  )
}

export default TableComponent
