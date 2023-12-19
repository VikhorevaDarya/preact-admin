import { useEffect } from 'preact/hooks'
import { shallow } from 'zustand/shallow'
import { Input, Modal, Button, Form } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

import { ModalType } from './types'
import { UserType } from '@/store/User/types'
import { useUserStore } from '@/store'

import './styles.scss'

interface ModalProps {
  account: UserType | null
  type: ModalType

  onClose: () => void
}

function ModalWindow({ onClose, account, type }: ModalProps) {
  const [error, deleteUser, getUsers, editUser, createUser] = useUserStore(
    (state) => [state.error, state.deleteUser, state.getUsers, state.editUser, state.createUser],
    shallow,
  )

  const isEdit = type === 'edit'
  const buttonTitle = type?.charAt(0).toUpperCase() + type?.slice(1)

  const { TextArea } = Input
  const [form] = Form.useForm()

  const inputPasswordIconRender = (visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)

  const handleSubmit = (values) =>
    isEdit
      ? editUser({ id: account.id, ...values }).then((res) => {
          if (res) finishSession()
        })
      : createUser(values).then((res) => {
          if (res) finishSession()
        })

  const onDelete = () =>
    deleteUser(account.id).then((res) => {
      if (res) finishSession()
    })

  const finishSession = () => {
    getUsers()
    onClose()
  }

  useEffect(() => form.resetFields(), [])

  return (
    <Modal open={true} className='modal' onCancel={onClose}>
      {(isEdit && account) || type === 'create' ? (
        <Form
          className='modal__form'
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            login: isEdit ? account.login : '',
            password: isEdit ? account.password : '',
            deny_access: isEdit ? account.deny_access : '',
          }}
        >
          <Form.Item name='login' rules={[{ required: true, message: 'Login is required' }]}>
            <Input placeholder='login' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder='Password' iconRender={inputPasswordIconRender} />
          </Form.Item>

          <Form.Item name='deny_access'>
            <TextArea placeholder='Deny access' />
          </Form.Item>

          <Button type='primary' htmlType='submit'>
            {buttonTitle}
          </Button>
        </Form>
      ) : (
        <div class='modal__delete-content'>
          <h2 class='modal__delete-title'>
            Do you really want to delete
            <span class='modal__delete-title_bold'> {account?.login}</span>?
          </h2>

          <Button type='primary' danger onClick={onDelete} htmlType='submit'>
            Delete
          </Button>
        </div>
      )}

      <span class='modal__form-error'>{error}</span>
    </Modal>
  )
}

export default ModalWindow
