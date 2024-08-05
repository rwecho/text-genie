import Thread from '@/components/ThreadPage'
import { getThread } from '@/services/thread'
import { Metadata, ResolvingMetadata } from 'next'
import { getTranslations } from 'next-intl/server'
export const fetchCache = 'force-no-store'

export async function generateMetadata(
  {},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations('ThreadPage')
  return {
    title: t('title'),
  }
}

const ThreadPage = async ({ params }: { params: { id: string } }) => {
  const thread = await getThread(params.id)
  return <Thread thread={thread} />
}
export default ThreadPage
