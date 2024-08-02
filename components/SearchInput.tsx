import { Input, Flex, Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
const { TextArea } = Input

export type SearchInputProps = {
  onSending: (question: string) => Promise<void>
  placeholder?: string
}

const SearchInput = (props: SearchInputProps) => {
  const [sendLoading, setSendLoading] = useState(false)
  const [question, setQuestion] = useState<string>()

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    if (!question) {
      return
    }

    try {
      setSendLoading(true)
      await props.onSending(question)
      setQuestion('')
    } finally {
      setSendLoading(false)
    }
  }

  return (
    <div className="mt-4 p-2  relative">
      <TextArea
        className="!border-0 !text-md z-10 peer focus:!border-0 focus:!shadow-none focus-within:!border-0 focus-within:!shadow-none"
        autoSize={{ minRows: 2, maxRows: 6 }}
        placeholder={props.placeholder + '...'}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => handleTextAreaKeyDown(e)}
      ></TextArea>
      <Flex className="z-10 relative">
        <Button
          className="ml-auto"
          type="text"
          disabled={!question}
          onClick={handleSend}
          loading={sendLoading}
        >
          <span className="text-sm text-gray-400">Enter</span>
          <SendOutlined></SendOutlined>
        </Button>
      </Flex>
      <div className="peer-focus:border-gray-600 peer-hover:border-gray-400 top-0 left-0 w-full h-full absolute border-2 rounded-xl"></div>
    </div>
  )
}

export default SearchInput
