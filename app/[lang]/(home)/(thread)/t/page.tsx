'use client'
import { usePagedThreads } from '@/hooks/thread'
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
import { Thread } from '@/types/thread'
import { BookOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Search } = Input

const ThreadsPage = () => {
  const [page, setPage] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const [totalThreads, setTotalThreads] = useState<Thread[]>([])
  const { threads, totalCount, loading, error, totalPage } = usePagedThreads(
    page,
    10,
    searchText,
  )
  useEffect(() => {
    if (threads) {
      setTotalThreads((o) => {
        return [...o, ...threads]
      })

      console.log(threads)
    }
  }, [threads])

  const loadMoreData = () => {
    setPage(page + 1)
  }

  const handleRemove = async (id: string) => {
    try {
      await fetch(`/api/t/${id}`, {
        method: 'DELETE',
      })

      setTotalThreads((o) => {
        return [...o.filter((t) => t.id != id)]
      })

      message.success(id)
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const handleSearch = async (value: string) => {
    try {
      setSearching(true)
      setSearchText(value)
      setTotalThreads([])
    } catch (error) {
    } finally {
      setSearching(false)
    }
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
        placeholder="Search your threads..."
        loading={searching}
        allowClear
      ></Search>
      <InfiniteScroll
        dataLength={totalThreads.length}
        next={loadMoreData}
        hasMore={
          totalThreads.length < (totalCount === undefined ? 0 : totalCount)
        }
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={totalThreads}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Popconfirm
                  key="list-delete-action"
                  title="Delete the task"
                  description="Are you sure to delete this task?"
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
