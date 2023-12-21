import { shallow } from 'zustand/shallow'
import { Table, Tooltip, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { Tools } from '@/components'
import { useUserStore } from '@/store'

import { UserType } from '@/store/User/types'

import './styles.scss'

interface Props {
  setSelectedUser: (updatedUser: UserType) => void
  handleDelete: () => void
  handleEdit: () => void
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

function TableComponent({ setSelectedUser, handleDelete, handleEdit }: Props) {
  const [users, isLoadingUsers, tableError] = useUserStore(
    (state) => [state.users, state.isLoadingUsers, state.tableError],
    shallow,
  )

  const getSelectedUser = (login: string) => {
    setSelectedUser(users.find((item) => item.login === login))
  }

  const dataSource = users?.map((item) => {
    return {
      ...item,
      rules: item.rules[0] ? (
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

      {tableError && <span class='table__error'>{tableError}</span>}
    </div>
  )
}

export default TableComponent
