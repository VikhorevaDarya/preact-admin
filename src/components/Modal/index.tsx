import { useEffect } from 'preact/hooks'
import { shallow } from 'zustand/shallow'
import { Input, Modal, Button, Form, Spin } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from '@ant-design/icons'

import { ModalType } from './types'
import { UserType } from '@/store/User/types'
import { useUserStore } from '@/store'

import './styles.scss'

interface ModalProps {
  user: UserType | null
  type: ModalType

  onClose: () => void
}

function ModalWindow({ onClose, user, type }: ModalProps) {
  const [modalError, deleteUser, getUsers, editUser, createUser, isLoadingUpdateUser] =
    useUserStore(
      (state) => [
        state.modalError,
        state.deleteUser,
        state.getUsers,
        state.editUser,
        state.createUser,
        state.isLoadingUpdateUser,
      ],
      shallow,
    )

  const isEdit = type === 'edit'
  const isCreate = type === 'create'
  const buttonTitle = type?.charAt(0).toUpperCase() + type?.slice(1)

  const initialValues = {
    login: isEdit ? user.login : '',
    password: isEdit ? user.password : '',
    rules: isEdit ? user.rules.join('\n') : '',
  }

  const { TextArea } = Input
  const [form] = Form.useForm()

  const inputPasswordIconRender = (visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)
  const submitMethod = isEdit ? editUser : createUser

  const handleSubmit = (values) => {
    submitMethod(values).then((res) => {
      if (res) finishSession()
    })
  }

  const onDelete = () =>
    deleteUser(user.login).then((res) => {
      if (res) finishSession()
    })

  const finishSession = () => {
    getUsers()
    onClose()
  }

  useEffect(() => form.resetFields(), [])

  return (
    <Modal open={true} className='modal' onCancel={onClose}>
      {(isEdit && user) || isCreate ? (
        <Form
          className='modal__form'
          onFinish={handleSubmit}
          form={form}
          initialValues={initialValues}
        >
          <Form.Item name='login' rules={[{ required: true, message: 'Login is required' }]}>
            <Input placeholder='login' disabled={isEdit} />
          </Form.Item>

          {!isEdit && (
            <Form.Item
              name='password'
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password placeholder='Password' iconRender={inputPasswordIconRender} />
            </Form.Item>
          )}

          <Form.Item name='rules'>
            <TextArea placeholder='Deny access' rows={20} />
          </Form.Item>

          <Button type='primary' htmlType='submit' disabled={isLoadingUpdateUser}>
            {isLoadingUpdateUser ? (
              <Spin
                className='modal__loader'
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            ) : (
              buttonTitle
            )}
          </Button>
        </Form>
      ) : (
        <div class='modal__delete-content'>
          <h2 class='modal__delete-title'>
            Do you really want to delete
            <span class='modal__delete-title_bold'> {user?.login}</span>?
          </h2>

          <Button
            type='primary'
            danger
            onClick={onDelete}
            htmlType='submit'
            disabled={isLoadingUpdateUser}
          >
            {isLoadingUpdateUser ? (
              <Spin
                className='modal__loader'
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      )}

      <span class='modal__form-error'>{modalError}</span>
    </Modal>
  )
}

export default ModalWindow
