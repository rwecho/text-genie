import Thread from '@/components/ThreadPage'

const ThreadPage = ({ params }: { params: { id: string } }) => {
  return <Thread id={params.id} />
}
export default ThreadPage
