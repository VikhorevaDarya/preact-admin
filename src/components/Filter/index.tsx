import { useState, useEffect } from 'preact/hooks'
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
      ? getUsers().then((res) => {
          if (selectValue === 'login') {
            setUsers(res.filter((item) => item.login.startsWith(inputValue)))
          } else if (selectValue === 'access') {
            setUsers(
              res.filter((item) =>
                item.deny_access.split('\n').some((subItem) => subItem.startsWith(inputValue)),
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

  useEffect(() => {
    getUsers()
  }, [])

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
