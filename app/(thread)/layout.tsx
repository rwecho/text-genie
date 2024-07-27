'use client'

import { Button, Menu, Flex, Layout, theme, Space, Modal, Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShareAltOutlined,
  HistoryOutlined,
  EditOutlined,
  RocketOutlined,
  PlusOutlined,
  HomeOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useTopThreads } from '@/hooks/thread'

const { Header, Content, Footer, Sider } = Layout
const { TextArea } = Input

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, margin },
  } = theme.useToken()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)

  const [question, setQuestion] = useState<string>()

  const [sendLoading, setSendLoading] = useState(false)

  const {
    loading: topThreadsLoading,
    threads: topThreads,
    totalCount,
    error,
  } = useTopThreads()

  const collections = useMemo(() => {
    if (!topThreads || !totalCount) {
      return []
    }

    var items = topThreads.map((thread, index) => {
      return {
        key: thread.id,
        label: <a href={`/t/${thread.id}`}>{thread.qaList[0].question}</a>,
      }
    })

    if (totalCount > 5) {
      items.push({
        key: 'more',
        label: <a href="/t">More ...</a>,
      })
    }
    return items
  }, [topThreads, totalCount])

  const handleUpgrade = () => {
    console.log('Upgrade to Pro')
  }

  const handleNewThread = () => {
    // popup a modal to create a new thread
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend()
    }
  }

  const handleSend = async () => {
    if (!question) {
      return
    }

    try {
      setSendLoading(true)

      setIsModalOpen(false)

      const response = await fetch('/api/t', {
        method: 'POST',
        body: JSON.stringify({
          question,
          // engine: current,
        }),
      })

      if (!response.ok) {
        return
      }
      const data = await response.json()

      setQuestion('')

      router.push(`/t/${data.id}`)
    } finally {
      setSendLoading(false)
    }
  }

  useEffect(() => {
    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        handleNewThread()
      }
    }
    document.addEventListener('keydown', handleDocumentKeyDown)
    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [])

  return (
    <>
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            borderRight: '1px solid #f0f0f0',
          }}
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <Flex
            vertical
            style={{
              height: '100%',
            }}
          >
            <Button
              type="link"
              className="!text-gray-800"
              style={{
                height: 'auto',
              }}
            >
              <Space className="justify-center my-4">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                  alt="logo"
                  style={{
                    height: '32px',
                  }}
                />
                {!collapsed && (
                  <span className="ms-4 text-xl font-semibold">文字助手</span>
                )}
              </Space>
            </Button>

            {collapsed ? (
              <Button
                type="dashed"
                className="mb-4 mx-auto"
                icon={<PlusOutlined />}
                onClick={handleNewThread}
              ></Button>
            ) : (
              <Button
                type="dashed"
                className="mx-2 mb-4"
                icon={<PlusOutlined />}
                onClick={handleNewThread}
              >
                <span>New Thread</span>
                <span className="text-xs text-gray-400">⌘+K</span>
              </Button>
            )}

            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{
                border: 0,
              }}
              items={[
                {
                  key: 'home',
                  icon: <HomeOutlined />,
                  label: <a href="/">Home</a>,
                },
                {
                  key: 'collections',
                  icon: <HistoryOutlined />,
                  label: <span>Collections</span>,
                  children: collections,
                },
              ]}
            />

            <Menu
              style={{
                marginTop: 'auto',
                border: 0,
              }}
              theme="light"
              mode="inline"
              selectable={false}
              items={
                [
                  // {
                  //   key: 'Upgrade-to-Pro',
                  //   icon: <RocketOutlined className='!text-red-600 rotate-45 ' />,
                  //   label: (
                  //     <div className='flex flex-col space-y-0'>
                  //       <span
                  //         style={{
                  //           height: 'auto',
                  //         }}
                  //       >
                  //         Upgrade to Pro
                  //       </span>
                  //     </div>
                  //   ),
                  //   style: {
                  //     height: 'auto',
                  //   },
                  //   onClick: handleUpgrade,
                  // },
                ]
              }
            />
          </Flex>
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: 'margin-left 0.2s',
          }}
        >
          <Header
            className="!px-4 !py-0 flex items-center "
            style={{ background: colorBgContainer }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
              }}
            />

            <Space className="!ml-auto">
              {/* avatar */}
              {/* <Button
              className="!text-gray-600"
              size="small"
              type="link"
              icon={<EditOutlined />}
            >
              Go to Note
            </Button> */}
              <Button
                className="!text-gray-600"
                size="small"
                type="link"
                icon={<ShareAltOutlined />}
              >
                Share
              </Button>
            </Space>
          </Header>
          <Content
            style={{
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="查询、搜集、整理我们的知识库"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="mt-4 p-2  relative">
          <TextArea
            autoFocus
            className="!border-0 !text-md z-10 peer focus:!border-0 focus:!shadow-none focus-within:!border-0 focus-within:!shadow-none"
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="知识的整理从一个问题开始..."
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
              <span className="text-sm text-gray-400">Ctrl+Enter</span>
              <SendOutlined></SendOutlined>
            </Button>
          </Flex>
          <div className="peer-focus:border-gray-600 peer-hover:border-gray-400 top-0 left-0 w-full h-full absolute border-2 rounded-xl"></div>
        </div>
      </Modal>
    </>
  )
}
