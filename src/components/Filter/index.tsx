import { useCallback, useState } from 'preact/hooks'
import { shallow } from 'zustand/shallow'
import { Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { useUserStore } from '@/store'

import './styles.scss'

const defaultSelectValue = 'login'

const options = [
  { value: 'login', label: 'login' },
  { value: 'access', label: 'access' },
]

function Filter() {
  const [setUsers, getUsers] = useUserStore((state) => [state.setUsers, state.getUsers], shallow)
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState(defaultSelectValue)

  const onInput = useCallback(
    (event: InputEvent) => {
      const input = event.target as HTMLInputElement

      setInputValue(input.value)

      if (input.value) {
        if (selectValue === 'login') {
          filterByLogin(input.value)
        } else if (selectValue === 'access') {
          filterByAccess(input.value)
        }
      } else {
        getUsers()
      }
    },
    [selectValue],
  )

  const filterByLogin = (value: string) =>
    getUsers().then((users) => {
      setUsers(users.filter((item) => item.login.startsWith(value)))
    })

  const filterByAccess = (value: string) =>
    getUsers().then((users) => {
      setUsers(
        users.filter((item) =>
          item.rules.some((subItem) => subItem.toLowerCase().startsWith(value.toLowerCase())),
        ),
      )
    })

  const onClear = () => {
    setInputValue('')
    getUsers()
  }

  const onSelect = (value: string) => {
    setSelectValue(value)

    if (inputValue) {
      if (value === 'login') {
        filterByLogin(inputValue)
      }

      if (value === 'access') {
        filterByAccess(inputValue)
      }
    }
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
            defaultValue={selectValue}
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
