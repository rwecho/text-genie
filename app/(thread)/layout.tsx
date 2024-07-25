'use client'

import { Button, Menu, Flex, Layout, theme, Space } from 'antd'
import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShareAltOutlined,
  HistoryOutlined,
  EditOutlined,
  RocketOutlined,
} from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, margin },
  } = theme.useToken()

  const [collapsed, setCollapsed] = useState(false)
  const handleUpgrade = () => {
    console.log('Upgrade to Pro')
  }
  return (
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
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{
              border: 0,
            }}
            items={[
              // {
              //   key: 'notes',
              //   icon: <EditOutlined />,
              //   label: <a href="/n/">Notes</a>,
              // },
              {
                key: 'collections',
                icon: <HistoryOutlined />,
                label: <a href="/t/">Collections</a>,
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
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
