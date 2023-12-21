import { useState } from 'preact/hooks'
import { shallow } from 'zustand/shallow'
import { Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { useUserStore } from '@/store'

import './styles.scss'

const defaultSelectValue = 'login'

function Filter() {
  const [setUsers, getUsers] = useUserStore((state) => [state.setUsers, state.getUsers], shallow)
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState(defaultSelectValue)

  const options = [
    { value: 'login', label: 'login' },
    { value: 'access', label: 'access' },
  ]

  const onInput = (event: InputEvent) => {
    const input = event.target as HTMLInputElement
    const inputValue = input.value

    setInputValue(inputValue)

    inputValue
      ? getUsers().then((users) => {
          if (selectValue === 'login') {
            setUsers(users.filter((item) => item.login.startsWith(inputValue)))
          } else if (selectValue === 'access') {
            setUsers(
              users.filter((item) =>
                item.rules.some((subItem) =>
                  subItem.toLowerCase().startsWith(inputValue.toLowerCase()),
                ),
              ),
            )
          }
        })
      : getUsers()
  }

  const onClear = () => {
    setInputValue('')
    getUsers()
  }

  const onSelect = (value: string) => {
    setSelectValue(value)
  }

  return (
    <div class='filter'>
      <Input
        placeholder='Search by'
        value={inputValue}
        onChange={onInput}
        prefix={<SearchOutlined />}
        className='filter__input'
        addonAfter={
          <Select
            defaultValue={defaultSelectValue}
            onChange={onSelect}
            className='filter__select'
            options={options}
          />
        }
      />

      {inputValue && <Button onClick={onClear}>Clear</Button>}
    </div>
  )
}

export default Filter
