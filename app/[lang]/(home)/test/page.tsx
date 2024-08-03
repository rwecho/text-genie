'use client'
import ContentView from '@/components/ThreadPage/ContentView'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export const fetchCache = 'force-no-store'

const TestPage = () => {
  const [message, setMessage] = useState('')
  useEffect(() => {
    fetchEventSource('/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/event-stream',
      },

      onmessage: (event) => {
        console.log('event:', event)
        setMessage((t) => {
          return t + JSON.parse(event.data)
        })
      },
    })
  }, [])

  return <ContentView content={message}></ContentView>
}

export default TestPage
