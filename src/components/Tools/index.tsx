import { Button } from 'antd'
import { EditFilled, DeleteFilled } from '@ant-design/icons'

import './styles.scss'

interface ToolsProps {
  onEdit: () => void
  onDelete: () => void
}

function Tools({ onEdit, onDelete }: ToolsProps) {
  return (
    <div class='tools'>
      <Button shape='circle' icon={<EditFilled />} onClick={onEdit} />
      <Button danger shape='circle' icon={<DeleteFilled />} onClick={onDelete} />
    </div>
  )
}

export default Tools
