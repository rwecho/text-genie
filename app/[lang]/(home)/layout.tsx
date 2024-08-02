'use client'

import {
  Button,
  Menu,
  Flex,
  Layout,
  theme,
  Space,
  Modal,
  Spin,
  message,
  Dropdown,
  MenuProps,
} from 'antd'
import {
  startTransition,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShareAltOutlined,
  HistoryOutlined,
  PlusOutlined,
  HomeOutlined,
  DownOutlined,
  SmileOutlined,
} from '@ant-design/icons'
// import { useRouter } from 'next/navigation'
import { usePathname, useRouter } from '@/services/navigation'
import { useTopThreadsStore } from '@/store/thread'
import Link from 'next/link'
import Image from 'next/image'
import SearchInput from '@/components/SearchInput'
import { createThread } from '@/services/thread'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const { Header, Content, Sider } = Layout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const t = useTranslations('HomePage')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)
  const { topThreads, load, loading, error } = useTopThreadsStore()
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  useEffect(() => {
    load()
  }, [load])

  const languageItems: MenuProps['items'] = [
    {
      key: 'en',
      label: <>English</>,
      onClick: () => {
        startTransition(() => {
          const currentFullPath = pathname + window.location.search
          debugger
          router.replace(currentFullPath, { locale: 'en' })
        })
      },
    },
    {
      key: 'cn',
      label: <>简体中文</>,
      onClick: () => {
        startTransition(() => {
          const currentFullPath = pathname + window.location.search
          router.replace(currentFullPath, { locale: 'cn' })
        })
      },
    },
  ]

  const collections = useMemo(() => {
    if (!topThreads) {
      return []
    }

    var items = topThreads.map((thread) => {
      return {
        key: thread.id,
        label: (
          <>
            <Link href={`/t/${thread.id}`} className="relative peer">
              <Flex justify="space-between">
                <span>{thread.qaList[0].question}</span>
              </Flex>
            </Link>
          </>
        ),
      }
    })
    if (topThreads.length >= 5) {
      items.push({
        key: 'more',
        label: <Link href="/t">{t('more')}...</Link>,
      })
    }
    return items
  }, [t, topThreads])

  const handleNewThread = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    message.success(t('copied'))
  }

  const handleQuestionSending = async (question: string) => {
    if (!question) {
      return
    }
    const thread = await createThread(question)
    router.push(`/t/${thread.id}`)
    setIsModalOpen(false)
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
          <Flex vertical>
            <Button
              type="link"
              className="!text-gray-800"
              style={{
                height: 'auto',
              }}
            >
              <Space className="justify-center my-4">
                <Image
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                  alt="logo"
                  width={32}
                  height={32}
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
                <span>{t('newThread')}</span>
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
              defaultOpenKeys={['collections']}
              items={[
                {
                  key: 'home',
                  icon: <HomeOutlined />,
                  label: <Link href="/">{t('home')}</Link>,
                },
                {
                  key: 'collections',
                  icon: <HistoryOutlined />,
                  label: (
                    <>
                      <span>
                        {t('collections')}
                        {loading && <Spin size="small"></Spin>}
                      </span>
                      {error && message.error('Failed to load collections')}
                    </>
                  ),
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
              items={[]}
            />
          </Flex>
        </Sider>
        <Layout
          style={{
            minHeight: '100vh',
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
              <Dropdown menu={{ items: languageItems }}>
                <Button onClick={(e) => e.preventDefault()} type="text">
                  <Space>
                    {locale === 'en' ? 'English' : '简体中文'}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>

              <Button
                className="!text-gray-600"
                size="small"
                type="link"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                {t('share')}
              </Button>
            </Space>
          </Header>
          <Content
            style={{
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title={t('searchTitle')}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <SearchInput
          onSending={handleQuestionSending}
          placeholder={t('searchPlaceholder') + '...'}
        ></SearchInput>
      </Modal>
    </>
  )
}
