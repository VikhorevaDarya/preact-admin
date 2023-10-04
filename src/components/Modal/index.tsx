import { useEffect } from 'preact/hooks'
import { Input, Modal, Button, Form } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

import { AccountType, ModalType } from '@/types'
import { useAppStore } from '@/store'

import './styles.scss'

interface ModalProps {
  account: AccountType | null
  type: ModalType

  onClose: () => void
}

function ModalWindow({ onClose, account, type }: ModalProps) {
  const [deleteAccount, getAccounts, editAccount, createAccount] = useAppStore((state) => [
    state.deleteAccount,
    state.getAccounts,
    state.editAccount,
    state.createAccount,
  ])

  const isEdit = type === 'edit'
  const buttonTitle = type?.charAt(0).toUpperCase() + type?.slice(1)

  const { TextArea } = Input
  const [form] = Form.useForm()

  const inputPasswordIconRender = (visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)

  const handleSubmit = (values) =>
    isEdit
      ? editAccount({ id: account.id, ...values }).then(finishSession)
      : createAccount(values).then(finishSession)

  const onDelete = () => deleteAccount(account.id).then(finishSession)

  const finishSession = () => {
    getAccounts()
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
            access: isEdit ? account.access : '',
          }}
        >
          <Form.Item name='login'>
            <Input placeholder='login' />
          </Form.Item>

          <Form.Item name='password'>
            <Input.Password placeholder='Password' iconRender={inputPasswordIconRender} />
          </Form.Item>

          <Form.Item name='access'>
            <TextArea placeholder='Deny Access' />
          </Form.Item>

          <Button type='primary' htmlType='submit'>
            {buttonTitle}
          </Button>
        </Form>
      ) : (
        <div class='modal__delete-content'>
          <h2 class='modal__delete-title'>
            Are you really want to delete
            <span class='modal__delete-title_bold'> {account?.login}</span>?
          </h2>

          <Button type='primary' danger onClick={onDelete} htmlType='submit'>
            Delete
          </Button>
        </div>
      )}
    </Modal>
  )
}

export default ModalWindow
