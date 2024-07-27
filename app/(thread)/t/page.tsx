'use client'
import { usePagedThreads, useTopThreads } from '@/hooks/thread'
import { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Divider,
  List,
  Skeleton,
  message,
  Popconfirm,
} from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Thread } from '@/types/thread'
import { BookOutlined, DeleteOutlined } from '@ant-design/icons'

const ThreadsPage = () => {
  const [page, setPage] = useState(0)
  const [totalThreads, setTotalThreads] = useState<Thread[]>([])
  const { threads, totalCount, loading, error, totalPage } = usePagedThreads(
    page,
    10,
  )
  useEffect(() => {
    if (threads) {
      setTotalThreads((o) => {
        return [...o, ...threads]
      })
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

  return (
    <div
      id="scrollableDiv"
      className="p-4 overflow-auto "
      style={{
        height: 'calc(100vh - 100px)',
      }}
    >
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
                  <a href="https://ant.design">{item.qaList[0].question}</a>
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
