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
import SearchInput from '../SearchInput'
import { createThread } from '@/services/thread'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const { Header, Footer, Content } = Layout

const menuRightItems = [
  {
    label: <Link href="/n">Notes</Link>,
    key: 'notes',
    icon: <EditOutlined />,
  },
]

const HomePage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const t = useTranslations('HomePage')
  const router = useRouter()

  const handleQuestionSending = async (question: string) => {
    if (!question) {
      return
    }
    const thread = await createThread(question)
    router.push(`/t/${thread.id}`)
  }

  return (
    <Layout
      style={{
        minHeight: '100%',
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

        {/* <Menu
          className="!ml-auto !border-0"
          mode="horizontal"
          selectable={false}
          items={menuRightItems}
        /> */}

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
          background: colorBgContainer,
        }}
      >
        <div className="w-full max-w-screen-md mx-auto">
          <h2 className="mt-16 xl:mt-32 text-xl text-center font-semibold">
            {t('searchTitle')}
          </h2>
          <SearchInput
            onSending={handleQuestionSending}
            placeholder={t('searchPlaceholder')}
          ></SearchInput>
          <div className="mt-4"></div>
        </div>
      </Content>
      <Footer className="!py-2" style={{ textAlign: 'center' }}>
        TextGenie ©2024 Created By rwecho
      </Footer>
    </Layout>
  )
}

export default HomePage
