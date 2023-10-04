import { Table, Button, Tooltip } from 'antd'
import { useState } from 'preact/hooks'

import { Tools, Filter, Modal } from '@/components'
import { AccountType, ModalType } from '@/types'
import { useAppStore } from '@/store'
import { lineCounter } from '@/utils'

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
    dataIndex: 'access',
    key: 'access',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'table__edit',
  },
]

function TableComponent() {
  const accounts = useAppStore((state) => state.accounts)

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<null | AccountType>(null)
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
  }

  const getSelectedAccount = (accountId: number) => {
    setSelectedAccount(accounts.find((item) => item.id === accountId))
  }

  const handleAddButtonClick = () => {
    setModalType(modalTypes.create as ModalType)
    setIsOpenModal(true)
    setSelectedAccount(null)
  }

  const dataSource = accounts?.map((item) => {
    return {
      ...item,
      access: item.access ? (
        <Tooltip
          placement='top'
          title={item.access.split('\n').map((item, index) => (
            <p class="table__tooltip-inner-item" key={index}>{item}</p>
          ))}
        >
          {`${lineCounter(item.access)} ${lineCounter(item.access) > 1 ? 'rules' : 'rule'}`}
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
          Add
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
