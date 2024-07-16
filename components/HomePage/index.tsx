'use client'
import { Layout, Button, theme, Space, Flex } from 'antd'
import { Menu, Input, Dropdown } from 'antd'
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  EditOutlined,
  OpenAIOutlined,
  SendOutlined,
  DownOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const { Header, Footer, Sider, Content } = Layout

const menuRightItems = [
  {
    label: 'Notes',
    key: 'notes',
    icon: <EditOutlined />,
  },
]

const { TextArea } = Input
const HomePage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG, margin },
  } = theme.useToken()

  const router = useRouter()
  const [current, setCurrent] = useState('Gemini-1.5-Flash')
  const [sendLoading, setSendLoading] = useState(false)
  const [question, setQuestion] = useState<string>()

  const items: MenuProps['items'] = [
    {
      key: 'openai',
      type: 'group',
      label: 'openai',
      children: [
        {
          key: 'GPT-4o',
          label: 'GPT-4o',
          onClick: () => {
            setCurrent('GPT-4o')
          },
        },
        {
          key: 'GPT-4',
          label: 'GPT-4',
          onClick: () => {
            setCurrent('GPT-4')
          },
        },
      ],
    },
    {
      key: 'google',
      label: 'google',
      type: 'group',
      children: [
        {
          key: 'Gemini-1.5-Flash',
          label: 'Gemini 1.5 Flash',
          onClick: () => {
            setCurrent('Gemini-1.5-Flash')
          },
        },
        {
          key: 'Gemini-1.5-Pro',
          label: 'Gemini 1.5 Pro',
          onClick: () => {
            setCurrent('Gemini-1.5-Pro')
          },
        },
      ],
    },
    {
      key: 'claude',
      label: 'claude',
      type: 'group',
      children: [
        {
          key: 'Claude-3-Haiku',
          label: 'Claude 3 Haiku',
          onClick: () => {
            setCurrent('Claude-3-Haiku')
          },
        },
        {
          key: 'Claude-3.5-Sonnet',
          label: 'Claude 3.5 Sonnet',
          onClick: () => {
            setCurrent('Claude-3.5-Sonnet')
          },
        },
      ],
    },
  ]

  const handleSend = async () => {
    if (!question) {
      return
    }

    try {
      setSendLoading(true)
      const response = await fetch('/api/t', {
        method: 'POST',
        body: JSON.stringify({
          question,
          engine: current,
        }),
      })

      if (!response.ok) {
        return
      }

      // delay for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const data = await response.json()
      const threadId = data.threadId
      if (!threadId) {
        return
      }
      router.push(`/t/${threadId}`)
    } finally {
      setSendLoading(false)
    }
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Header
        className="!px-4 flex items-center"
        style={{ background: colorBgContainer }}
      >
        <Dropdown menu={{ items }}>
          <a className="!text-gray-600" onClick={(e) => e.preventDefault()}>
            <Space>
              {current}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>

        <Menu
          className="!ml-auto !border-0"
          mode="horizontal"
          selectable={false}
          items={menuRightItems}
        />

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Header>
      <Content
        className="!p-4"
        style={{
          minHeight: 280,
          background: colorBgContainer,
        }}
      >
        <div className=" w-full max-w-screen-md mx-auto">
          <h2 className="mt-32 text-xl text-center font-semibold">
            查询、搜集、整理我们的知识库
          </h2>
          <div className="mt-4 p-2  relative">
            <TextArea
              className="!border-0 !text-md z-10 peer focus:!border-0 focus:!shadow-none focus-within:!border-0 focus-within:!shadow-none"
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder="知识的整理从一个问题开始..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></TextArea>
            <Flex className="z-10 relative">
              <Button
                className="ml-auto"
                type="text"
                disabled={!question}
                onClick={handleSend}
                loading={sendLoading}
              >
                <SendOutlined></SendOutlined>
              </Button>
            </Flex>
            <div className="peer-focus:border-gray-600 peer-hover:border-gray-400 top-0 left-0 w-full h-full absolute border-2 rounded-xl"></div>
          </div>
          <div className="mt-4"></div>
        </div>
      </Content>
      <Footer className="!py-2" style={{ textAlign: 'center' }}>
        TextGenie ©2024 Created By o5o2
      </Footer>
    </Layout>
  )
}

export default HomePage
