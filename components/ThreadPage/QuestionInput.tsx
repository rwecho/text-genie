'use client'
import { SendOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
const { TextArea } = Input

const QuestionInput = () => {
  return (
    <Flex vertical className='bottom-4 left-0 w-full sticky'>
      <div className='relative w-full p-2'>
        <TextArea
          className='z-10 !p-4 !pr-16 peer hover:!border-0 !border-0 focus-within:!border-0 focus-within:!shadow-none'
          placeholder='Add a comment...'
          autoSize={{ minRows: 1, maxRows: 6 }}
        ></TextArea>
        <Button type='text' className='z-10 !absolute !right-2 !bottom-3'>
          <SendOutlined></SendOutlined>
        </Button>
        <div className='peer-focus:border-gray-600 peer-hover:border-gray-400 top-0 left-0 w-full h-full absolute border-2 rounded-xl'></div>
      </div>
    </Flex>
  )
}

export default QuestionInput
