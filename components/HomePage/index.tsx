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
import { KeyboardEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { llms } from '@/services/model'

import {
  ClerkProvider,
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const { Header, Footer, Sider, Content } = Layout

const menuRightItems = [
  {
    label: <a href="/n">Notes</a>,
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
  const [current, setCurrent] = useState('Gemini 1.5 Flash')
  const [sendLoading, setSendLoading] = useState(false)
  const [question, setQuestion] = useState<string>()

  // const items: MenuProps['items'] = Object.entries(
  //   Object.groupBy(llms, ({ group }) => group),
  // ).map(([group, models]) => ({
  //   label: group,
  //   key: group,
  //   type: 'group',
  //   children: models!.map((model) => ({
  //     key: model.name,
  //     label: model.name,
  //     onClick: () => {
  //       setCurrent(model.name)
  //     },
  //   })),
  // }))

  const handleTextAreaKeyDown = async (
    e: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.ctrlKey && e.key === 'Enter') {
      await handleSend()
    }
  }

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
      const data = await response.json()
      router.push(`/t/${data.id}`)
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
        {/* <Dropdown menu={{ items }}>
          <a className="!text-gray-600" onClick={(e) => e.preventDefault()}>
            <Space>
              {current}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown> */}

        <Menu
          className="!ml-auto !border-0"
          mode="horizontal"
          selectable={false}
          items={menuRightItems}
        />

        {/* <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn> */}
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
