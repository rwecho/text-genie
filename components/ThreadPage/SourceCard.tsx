'use client'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import { useRouter } from 'next/navigation'

const SourceCard = (props: { url: string }) => {
  const router = useRouter()
  const { url } = props

  const handleSourceClick = (url: string) => {
    router.push(url)
  }

  return (
    <Card hoverable onClick={() => handleSourceClick(url)}>
      <Meta title='Europe Street beat' description={url} />
    </Card>
  )
}

export default SourceCard
