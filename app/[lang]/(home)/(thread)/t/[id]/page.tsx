import Thread from '@/components/ThreadPage'
import { getThread } from '@/services/thread'

export const fetchCache = 'force-no-store'

const ThreadPage = async ({ params }: { params: { id: string } }) => {
  const thread = await getThread(params.id)
  return <Thread thread={thread} />
}
export default ThreadPage
