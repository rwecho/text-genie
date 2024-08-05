import { Layout, Button } from 'antd'
import Home from '@/components/HomePage'
import { useTranslations } from 'next-intl'
import { Metadata, ResolvingMetadata } from 'next'
import { getTranslations } from 'next-intl/server'

const { Content } = Layout

export async function generateMetadata(
  {},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations('HomePage')
  return {
    title: t('title'),
  }
}

const HomePage = () => {
  return <Home></Home>
}

export default HomePage
