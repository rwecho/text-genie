import { Spin } from 'antd'

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Spin size="large" tip="Loading..." />
    </div>
  )
}

export default Loading
