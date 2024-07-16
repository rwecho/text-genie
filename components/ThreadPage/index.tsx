import {
  AimOutlined,
  DisconnectOutlined,
  LinkOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Flex, Input, Space } from 'antd'
import SourceCard from './SourceCard'
import QuestionInput from './QuestionInput'
import AnswerActions from './AnswerActions'

const ThreadPage = async (props: { id: string }) => {
  const { URL } = process.env
  const thread = await fetch(`${URL}/api/t/${props.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const threadJson = await thread.json()

  return (
    <div className='relative container mx-auto h-auto max-w-lg py-6 px-8 md:px-32 md:max-w-6xl'>
      <Flex vertical gap={'large'}>
        {/* title */}
        <h1 className='text-2xl font-semibold'>{threadJson.id}</h1>

        {/* answer paragrah */}

        <Flex vertical gap={'middle'}>
          <Space className='text-lg font-semibold'>
            <AimOutlined />
            Answer
          </Space>

          <p className='text-lg'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            faucibus, purus nec volutpat luctus, justo odio posuere nunc, nec
            varius nisl nisi nec velit. Nullam faucibus, purus nec volutpat
            luctus, justo odio posuere nunc, nec varius nisl nisi nec velit.
          </p>

          <AnswerActions></AnswerActions>
        </Flex>

        <Flex vertical gap={'middle'}>
          <Space className='text-lg font-semibold'>
            <LinkOutlined />
            Source
          </Space>
          <Space wrap>
            <SourceCard url='www.instagram.com' />
            <SourceCard url='www.twitter.com' />
            <SourceCard url='www.facebook.com' />
            <SourceCard url='www.linkedin.com' />
            <SourceCard url='www.google.com' />
          </Space>
        </Flex>

        <Flex vertical gap={'middle'}>
          <Space className='text-lg font-semibold'>
            <DisconnectOutlined />
            Related
          </Space>
          <Flex vertical className='w-full'>
            <Button
              size='large'
              className='w-ful'
              type='default'
              icon={<PlusOutlined />}
              iconPosition='end'
              styles={{
                icon: {
                  marginLeft: 'auto',
                },
              }}
            >
              <a href='/t/'>https://www.google.com</a>
            </Button>
          </Flex>
        </Flex>

        <QuestionInput></QuestionInput>
      </Flex>
    </div>
  )
}

export default ThreadPage
