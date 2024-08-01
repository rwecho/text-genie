'use client'
import {
  AimOutlined,
  DisconnectOutlined,
  LinkOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Divider,
  Flex,
  FloatButton,
  Input,
  Skeleton,
  Space,
} from 'antd'
import SourceCard from './SourceCard'
import AnswerActions from './AnswerActions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { SendOutlined } from '@ant-design/icons'
import { KeyboardEvent } from 'react'
import { Thread } from '@/types/thread'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslations } from 'next-intl'

const { TextArea } = Input

const ThreadPage = (props: { id: string }) => {
  const threadId = props.id
  const [input, setInput] = useState<string>()
  const [thread, setThread] = useState<Thread>()
  const [related, setRelated] = useState<string[]>()
  const [generating, setGenerating] = useState(false)
  const t = useTranslations('ThreadPage')

  const appendMessage = useCallback(
    async (message: string, abortController: AbortController) => {
      const url = `/api/t/${threadId}`
      await fetchEventSource(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: message
          ? JSON.stringify({
              question: message,
            })
          : '{}',
        onclose: () => {
          setGenerating(false)
        },
        onerror: (err) => {
          console.error(err)
          throw err
        },
        signal: abortController.signal,
        onmessage: (event) => {
          setGenerating(true)
          switch (event.event) {
            case 'qa':
              setThread((o) => {
                if (!o) throw new Error('thread is not defined')
                const { id, question } = JSON.parse(event.data)
                const list = [...o.qaList]
                const [lastQa] = list.slice(-1)
                if (lastQa.answer) {
                  list.push({
                    id: id,
                    question: question,
                    questionAt: new Date(),
                    sources: [],
                    dislike: false,
                  })
                } else {
                  lastQa.id = id
                }

                return {
                  ...o,
                  qaList: list,
                }
              })
              break
            case 'answer':
              setThread((o) => {
                if (!o) throw new Error('thread is not defined')
                const list = [...o.qaList]
                const [lastQa] = list.slice(-1)
                if (!lastQa.answer) {
                  lastQa.answer = ''
                }
                lastQa.answer += event.data
                return {
                  ...o,
                  qaList: list,
                }
              })

              break
            case 'sources':
              setThread((o) => {
                if (!o) throw new Error('thread is not defined')

                const list = [...o.qaList]
                const [lastQa] = list.slice(-1)
                lastQa.sources = JSON.parse(event.data)
                return { ...o, qaList: list }
              })
              break
            case 'related':
              setRelated(JSON.parse(event.data))
              break
          }
        },
      })
    },
    [threadId],
  )

  useEffect(() => {
    const abortController = new AbortController()
    const load = async () => {
      const response = await fetch(`/api/t/${threadId}`)
      const thread: Thread = await response.json()
      setThread(thread)
      const [lastQa] = thread.qaList.slice(-1)
      if (!lastQa.answer) {
        appendMessage('', abortController)
      }
    }

    console.log('ThreadPage useEffect')
    load()

    return () => {
      abortController.abort()
    }
  }, [appendMessage, threadId])

  const handleAppendQuestion = async (question?: string) => {
    if (!question) {
      return
    }
    const abortController = new AbortController()

    let temp = question

    try {
      setInput('')
      setRelated([])
      await appendMessage(question, abortController)
    } catch (error) {
      setInput(temp)
    }
  }

  const handleRelated = async (related: string) => {
    await handleAppendQuestion(related)
  }

  const handleTextAreaKeyDown = async (
    e: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.ctrlKey && e.key === 'Enter') {
      await handleAppendQuestion(input)
    }
  }

  const handleDislike = async (qaId: string) => {
    const url = `/api/qa/${qaId}/dislike`
    const response = await fetch(url, {
      method: 'POST',
    })
    if (!response.ok) {
      return
    }
    setThread((o) => {
      if (!o) throw new Error('thread is not defined')
      const list = [...o.qaList]
      const qa = list.find((qa) => qa.id === qaId)
      if (qa) {
        qa.dislike = !qa.dislike
      }
      return {
        ...o,
        qaList: list,
      }
    })
  }

  return (
    <Flex
      vertical
      gap={'middle'}
      className="relative container mx-auto h-auto max-w-lg py-6 px-8 md:px-32 md:max-w-6xl"
    >
      {thread &&
        thread.qaList.map((qa, index) => {
          return (
            <Flex key={index} vertical gap={'large'}>
              {index > 0 && <Divider className="!my-4"></Divider>}
              {/* title */}
              <h1 className="text-2xl font-semibold">{qa.question}</h1>

              {/* answer paragrah */}

              <Flex
                vertical
                gap={'middle'}
                className="overflow-hidden overflow-wrap"
              >
                <Space className="text-lg font-semibold">
                  <AimOutlined />
                  {t('answer')}
                </Space>

                {!qa.answer && <Skeleton active></Skeleton>}

                {qa.answer && (
                  <>
                    <Markdown remarkPlugins={[remarkGfm]}>{qa.answer}</Markdown>
                    <AnswerActions
                      dislike={qa.dislike}
                      onCopy={async () => {
                        if (qa.answer) {
                          navigator.clipboard.writeText(qa.answer)
                        }
                      }}
                      onDislike={async () => await handleDislike(qa.id)}
                      onReload={async () => {}}
                    ></AnswerActions>
                  </>
                )}
              </Flex>

              {qa.sources && qa.sources.length > 0 && (
                <Flex vertical gap={'middle'}>
                  <Space className="text-lg font-semibold">
                    <LinkOutlined />
                    Source
                  </Space>
                  <Space wrap>
                    {qa.sources.map((source, index) => (
                      <SourceCard key={index} url={source.link} />
                    ))}
                  </Space>
                </Flex>
              )}

              {!qa.sources && <Skeleton active></Skeleton>}
            </Flex>
          )
        })}

      {!thread && <Skeleton active></Skeleton>}

      {related && related.length > 0 && (
        <Flex vertical gap={'middle'}>
          <Space className="text-lg font-semibold">
            <DisconnectOutlined />
            Related
          </Space>
          <Flex vertical className="w-full" gap={'middle'}>
            {related.map((related, index) => (
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
      )}

      {
        // related skeleton
        !thread && <Skeleton active></Skeleton>
      }

      <Flex vertical className="bottom-4 pt-4 left-0 w-full sticky">
        <div className="relative w-full">
          <TextArea
            className="z-10 !p-4 !pr-16 peer hover:!border-0 !border-0 focus-within:!border-0 focus-within:!shadow-none"
            placeholder={t('inputPlaceholder') + '...'}
            autoSize={{ minRows: 1, maxRows: 6 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTextAreaKeyDown}
          ></TextArea>
          <Button
            type="text"
            className="z-10 !absolute !right-2 !bottom-3"
            onClick={() => handleAppendQuestion(input)}
            loading={generating}
            disabled={!input}
          >
            <SendOutlined></SendOutlined>
          </Button>
          <div className="peer-focus:outline-gray-600 outline outline-gray-400  outline-offset-2 peer-hover:outline-gray-400 top-0 left-0 w-full h-full absolute border-2 rounded-xl"></div>
        </div>
      </Flex>

      <FloatButton.BackTop></FloatButton.BackTop>
    </Flex>
  )
}

export default ThreadPage
