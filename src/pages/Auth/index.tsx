import { shallow } from 'zustand/shallow'
import { Input, Form, Button, Spin } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from '@ant-design/icons'

import { useAuthStore } from '@/store'

import './styles.scss'

const AuthPage = () => {
  const [login, error, isLoading] = useAuthStore(
    (state) => [state.login, state.error, state.isLoading],
    shallow,
  )
  const inputPasswordIconRender = (visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)

  const handleSubmit = (values) => {
    login(values.login, values.password)
  }

  return (
    <div class='auth'>
      <Form className='auth__form' onFinish={handleSubmit}>
        <Form.Item
          name='login'
          rules={[{ required: true, message: 'Login is required' }]}
          className='auth__field'
        >
          <Input placeholder='login' />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Password is required' }]}
          className='auth__field'
        >
          <Input.Password placeholder='Password' iconRender={inputPasswordIconRender} />
        </Form.Item>

        {error && <span class='auth__error'>{error}</span>}

        <Button type='primary' htmlType='submit' className='auth__submit' disabled={isLoading}>
          {isLoading ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          ) : (
            'Authorize'
          )}
        </Button>
      </Form>
    </div>
  )
}

export default AuthPage
