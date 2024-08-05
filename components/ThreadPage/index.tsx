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
  message,
  Skeleton,
  Space,
} from 'antd'
import SourceCard from './SourceCard'
import AnswerActions from './AnswerActions'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SendOutlined } from '@ant-design/icons'
import { KeyboardEvent } from 'react'
import { Thread } from '@/types/thread'
import { useTranslations } from 'next-intl'
import { useThreadStore } from '@/store/thread'
import ContentView from './ContentView'

const { TextArea } = Input

const ThreadPage = (props: { thread: Thread }) => {
  const [input, setInput] = useState<string>()
  const t = useTranslations('ThreadPage')

  const scrollHandlerRef = useRef<HTMLDivElement>(null)

  const {
    thread,
    answering,
    stopAnswer,
    relatedTopics,
    dislike,
    setThread,
    appendNew,
    answerLast,
  } = useThreadStore()

  const handleDislike = async (qaId: string) => {
    try {
      const result = await dislike(qaId)
      if (result) {
        message.success(t('dislikeSuccess'))
      } else {
        message.success(t('undislikeSuccess'))
      }
    } catch (error: any) {
      message.error('Failed to dislike')
    }
  }

  useEffect(() => {
    const init = async () => {
      setThread(props.thread)
      await answerLast(props.thread.id)
      console.log('ThreadPage useEffect')
    }
    init()
  }, [setThread, answerLast, props.thread])

  const handleTextAreaKeyDown = async (
    e: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleSend()
    }
  }

  const handleSend = async () => {
    if (input) {
      appendNew(props.thread.id, input)
      setInput('')
    }
  }

  const handleRelated = async (related: string) => {
    await appendNew(props.thread.id, related)
  }

  useEffect(() => {
    // auto scroll to bottom
    if (scrollHandlerRef.current) {
      scrollHandlerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
      })
    }
  }, [thread, relatedTopics])

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
                    <ContentView content={qa.answer}></ContentView>
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

      {relatedTopics && relatedTopics.length > 0 && (
        <Flex vertical gap={'middle'}>
          <Space className="text-lg font-semibold">
            <DisconnectOutlined />
            Related
          </Space>
          <Flex vertical className="w-full" gap={'middle'}>
            {relatedTopics.map((related, index) => (
              <Button
                key={index}
                size="large"
                className="w-full !text-start !whitespace-normal !h-auto overflow-hidden overflow-ellipsis"
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

      <div ref={scrollHandlerRef} className="h-16"></div>

      <Flex vertical className="bottom-4 pt-4 left-0 w-full sticky">
        {/* {answering && (
          <div className="w-full">
            <Button
              type="default"
              ghost
              className="w-full"
              onClick={() => {
                stopAnswer()
              }}
            >
              {t('stop')}
            </Button>
          </div>
        )} */}

        {
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
              onClick={handleSend}
              disabled={!input}
            >
              <SendOutlined></SendOutlined>
            </Button>
            <div className="peer-focus:outline-gray-600 outline outline-gray-400  outline-offset-2 peer-hover:outline-gray-400 top-0 left-0 w-full h-full absolute border-2 rounded-xl"></div>
          </div>
        }
      </Flex>

      <FloatButton.BackTop
        style={{
          insetBlockEnd: '96px',
        }}
      ></FloatButton.BackTop>
    </Flex>
  )
}

export default ThreadPage
