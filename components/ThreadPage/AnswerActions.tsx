'use client'
import {
  CopyOutlined,
  ReloadOutlined,
  DislikeOutlined,
} from '@ant-design/icons'
import { Space, Button, message } from 'antd'

const AnswerActions = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const handleCopy = () => {
    // navigator.clipboard.writeText(threadJson.id)
    messageApi.success('Copied to clipboard')
  }
  const handleReload = () => {
    messageApi.success('Reloaded')
  }
  const handleDislike = () => {
    messageApi.success('Disliked')
  }
  return (
    <Space
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      {contextHolder}
      <Button
        className='ms-auto'
        size='small'
        type='primary'
        ghost
        onClick={handleCopy}
      >
        <CopyOutlined></CopyOutlined>
      </Button>
      <Button size='small' type='primary' ghost onClick={handleReload}>
        <ReloadOutlined />
      </Button>

      <Button size='small' type='primary' ghost onClick={handleDislike}>
        <DislikeOutlined />
      </Button>
    </Space>
  )
}
export default AnswerActions
