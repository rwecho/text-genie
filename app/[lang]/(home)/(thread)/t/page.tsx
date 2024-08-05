import { Metadata, ResolvingMetadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Threads from '@/components/ThreadsPage'

export async function generateMetadata(
  {},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations('ThreadsPage')
  return {
    title: t('title'),
  }
}

const ThreadsPage = () => {
  return <Threads></Threads>
}
export default ThreadsPage
