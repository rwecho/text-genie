'use client'
import {
  CopyOutlined,
  ReloadOutlined,
  DislikeOutlined,
} from '@ant-design/icons'
import { Space, Button, message } from 'antd'
import { useTranslations } from 'next-intl'

type AnswerActionsProps = {
  dislike: boolean
  onCopy: () => Promise<void>
  onDislike: () => Promise<void>
  onReload: () => Promise<void>
}

const AnswerActions = (props: AnswerActionsProps) => {
  const [messageApi, contextHolder] = message.useMessage()

  const t = useTranslations('ThreadPage')

  const handleCopy = async () => {
    await props.onCopy()
    messageApi.success(t('copied'))
  }
  const handleReload = async () => {
    await props.onReload()

    messageApi.success('Reloaded')
  }
  const handleDislike = async () => {
    await props.onDislike()
  }
  return (
    <Space
      className="py-2 px-2"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      {contextHolder}
      <Button
        className="ms-auto"
        size="small"
        type="primary"
        ghost
        onClick={handleCopy}
      >
        <CopyOutlined></CopyOutlined>
      </Button>
      {/* <Button size='small' type='primary' ghost onClick={handleReload}>
        <ReloadOutlined />
      </Button> */}

      {props.dislike && (
        <Button
          size="small"
          type="primary"
          className="!bg-gray-200"
          onClick={handleDislike}
        >
          <DislikeOutlined />
        </Button>
      )}

      {!props.dislike && (
        <Button size="small" type="primary" ghost onClick={handleDislike}>
          <DislikeOutlined />
        </Button>
      )}
    </Space>
  )
}
export default AnswerActions
