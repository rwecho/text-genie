'use client'
import { useEffect, useState } from 'react'
import {
  Button,
  Divider,
  List,
  Skeleton,
  message,
  Popconfirm,
  Input,
} from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BookOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { usePagedThreadsStore } from '@/store/thread'
import { useTranslations } from 'next-intl'

const { Search } = Input

const ThreadsPage = () => {
  const [page, setPage] = useState(0)
  const pageSize = 10
  const [searchText, setSearchText] = useState('')
  const { threads, totalCount, load, remove } = usePagedThreadsStore()

  const [loading, setLoading] = useState(false)

  const t = useTranslations('ThreadsPage')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        await load(page, pageSize, searchText)
      } catch (error: any) {
        message.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [load, page, searchText])

  const loadMoreData = () => {
    setPage(page + 1)
  }

  const handleRemove = async (id: string) => {
    try {
      setLoading(true)
      await remove(id)
      message.success(t('deleteSuccess'))
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value: string) => {
    setSearchText(value)
  }

  return (
    <div
      id="scrollableDiv"
      className="overflow-auto container mx-auto h-auto max-w-lg py-6 px-8 md:px-32 md:max-w-6xl "
      style={{
        height: 'calc(100vh - 100px)',
      }}
    >
      <Search
        onSearch={handleSearch}
        placeholder={t('searchPlaceholder') + '...'}
        loading={loading}
        allowClear
      ></Search>
      <InfiniteScroll
        dataLength={threads.length}
        next={loadMoreData}
        hasMore={threads.length < (totalCount === undefined ? 0 : totalCount)}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>{t('dataEndMessage')}</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={threads}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="relative peer"
              actions={[
                <Popconfirm
                  key="list-delete-action"
                  title={t('deleteConfirm')}
                  description={t('deleteConfirmDescription')}
                  onConfirm={() => handleRemove(item.id)}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" danger size="small">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>,
                <Button type="text" key="list-book-action" size="small">
                  <BookOutlined />
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Link href={`/t/${item.id}`}>{item.qaList[0].question}</Link>
                }
                description={
                  <div className="overflow-hidden">{item.qaList[0].answer}</div>
                }
              />
              {/* <div>Content</div> */}
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}
export default ThreadsPage
