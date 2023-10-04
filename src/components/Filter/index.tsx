import { useState, useEffect } from 'preact/hooks'
import { shallow } from 'zustand/shallow'
import { Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { useAppStore } from '@/store'

import './styles.scss'

const defaultSelectValue = 'login'

function Filter() {
  const [setAccounts, getAccounts] = useAppStore(
    (state) => [state.setAccounts, state.getAccounts],
    shallow,
  )
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
      ? getAccounts().then((res) => {
          if (selectValue === 'login') {
            setAccounts(res.filter((item) => item.login.startsWith(inputValue)))
          } else if (selectValue === 'access') {
            setAccounts(
              res.filter((item) =>
                item.access.split('\n').some((subItem) => subItem.startsWith(inputValue)),
              ),
            )
          }
        })
      : getAccounts()
  }

  const onDrop = () => {
    setInputValue('')
    getAccounts()
  }

  const onSelect = (value: string) => {
    setSelectValue(value)
  }

  useEffect(() => {
    getAccounts()
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

      {inputValue && <Button onClick={onDrop}>Drop</Button>}
    </div>
  )
}

export default Filter
