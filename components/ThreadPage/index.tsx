'use client'
import {
  AimOutlined,
  DisconnectOutlined,
  LinkOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Divider, Flex, FloatButton, Input, Space } from 'antd'
import SourceCard from './SourceCard'
import AnswerActions from './AnswerActions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { SendOutlined } from '@ant-design/icons'
import { KeyboardEvent } from 'react'

const { TextArea } = Input

interface AnswerSource {
  Link: string
}

interface Question {
  Id?: string
  Content: string
  Time: Date
}

interface Answer {
  Id?: string
  Content: string
  Time: Date
  Duration?: number
  Sources?: AnswerSource[]
}

interface QA {
  Question: Question
  Answer?: Answer
}

interface Thread {
  Id: string
  QAList: QA[]
  Related: string[]
}

const ThreadPage = (props: { id: string }) => {
  const [input, setInput] = useState<string>()
  const [thread, setThread] = useState<Thread>({
    Id: '',
    QAList: [],
    Related: [],
  })

  const [generating, setGenerating] = useState(false)

  const appendMessage = useCallback(
    async (message: string, abortController: AbortController) => {
      const url = '/api/m'
      await fetchEventSource(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
        }),
        onclose: () => {
          setGenerating(false)
        },
        signal: abortController.signal,
        onmessage: (event) => {
          console.log(event)
          setGenerating(true)
          switch (event.event) {
            case 'threadId':
              setThread((o) => {
                return {
                  ...o,
                  Id: event.data,
                }
              })
              break
            case 'question':
              setThread((o) => {
                const list = [
                  ...o.QAList,
                  {
                    Question: {
                      Content: event.data,
                      Time: new Date(),
                    } as Question,
                  },
                ]
                return {
                  ...o,
                  QAList: list,
                }
              })
              break
            case 'answer':
              setThread((o) => {
                const list = [...o.QAList]
                const [lastQa] = list.slice(-1)
                if (!lastQa.Answer) {
                  lastQa.Answer = {
                    Content: '',
                    Time: new Date(),
                  }
                }
                lastQa.Answer.Content += event.data
                return {
                  ...o,
                  QAList: list,
                }
              })

              break
            case 'sources':
              setThread((o) => {
                const list = [...o.QAList]
                const [lastQa] = list.slice(-1)
                if (!lastQa.Answer) {
                  lastQa.Answer = {
                    Content: '',
                    Time: new Date(),
                  }
                }
                lastQa.Answer.Sources = JSON.parse(event.data).map(
                  (link: string) => {
                    return {
                      Link: link,
                    }
                  },
                )
                return { ...o, QAList: list }
              })
              break
            case 'related':
              setThread((o) => {
                return { ...o, Related: JSON.parse(event.data) }
              })
              break
          }
        },
      })
    },
    [],
  )

  useEffect(() => {
    const abortController = new AbortController()
    appendMessage('hello world', abortController)
    return () => {
      abortController.abort()
    }
  }, [appendMessage])

  const handleAppendQuestion = async () => {
    if (!input) {
      return
    }
    const abortController = new AbortController()
    await appendMessage(input, abortController)
    setInput('')
  }

  const handleRelated = async (related: string) => {
    const abortController = new AbortController()
    await appendMessage(related, abortController)
  }

  const handleTextAreaKeyDown = async (
    e: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.ctrlKey && e.key === 'Enter') {
      await handleAppendQuestion()
    }
  }

  return (
    <Flex
      vertical
      gap={'middle'}
      className="relative container mx-auto h-auto max-w-lg py-6 px-8 md:px-32 md:max-w-6xl"
    >
      {thread.QAList.map((qa, index) => {
        return (
          <Flex key={index} vertical gap={'large'}>
            {index > 0 && <Divider className="!my-4"></Divider>}
            {/* title */}
            <h1 className="text-2xl font-semibold">{qa.Question.Content}</h1>

            {/* answer paragrah */}

            <Flex vertical gap={'middle'}>
              <Space className="text-lg font-semibold">
                <AimOutlined />
                Answer
              </Space>

              <p className="text-lg">{qa.Answer?.Content}</p>

              <AnswerActions></AnswerActions>
            </Flex>

            <Flex vertical gap={'middle'}>
              <Space className="text-lg font-semibold">
                <LinkOutlined />
                Source
              </Space>
              <Space wrap>
                {qa.Answer?.Sources &&
                  qa.Answer.Sources.map((source, index) => (
                    <SourceCard key={index} url={source.Link} />
                  ))}
              </Space>
            </Flex>
          </Flex>
        )
      })}

      <Flex vertical gap={'middle'}>
        <Space className="text-lg font-semibold">
          <DisconnectOutlined />
          Related
        </Space>
        <Flex vertical className="w-full" gap={'middle'}>
          {thread.Related.map((related, index) => (
            <Button
              key={index}
              size="large"
              className="w-full"
              type="default"
              icon={<PlusOutlined />}
              iconPosition="end"
              styles={{
                icon: {
                  marginLeft: 'auto',
                },
              }}
              onClick={() => handleRelated(related)}
            >
              {related}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Flex vertical className="bottom-4 pt-4 left-0 w-full sticky">
        <div className="relative w-full">
          <TextArea
            className="z-10 !p-4 !pr-16 peer hover:!border-0 !border-0 focus-within:!border-0 focus-within:!shadow-none"
            placeholder="Add a comment..."
            autoSize={{ minRows: 1, maxRows: 6 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTextAreaKeyDown}
          ></TextArea>
          <Button
            type="text"
            className="z-10 !absolute !right-2 !bottom-3"
            onClick={handleAppendQuestion}
            loading={generating}
            disabled={!input}
          >
            <SendOutlined></SendOutlined>
          </Button>
          <div className="peer-focus:outline-gray-600 outline outline-gray-400  outline-offset-2 peer-hover:outline-gray-400 top-0 left-0 w-full h-full absolute border-2 rounded-xl"></div>
        </div>
      </Flex>

      <FloatButton.BackTop>hello world</FloatButton.BackTop>
    </Flex>
  )
}

export default ThreadPage
