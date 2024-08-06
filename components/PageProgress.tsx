'use client'
import { useNProgress } from '@tanem/react-nprogress'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PageProgress = () => {
  const router = useRouter()

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  })
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: state.isRouteChanging,
  })

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }))
    }

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }))
    }

    // todo: how to implement page progress without using router.events?

    // router.events.on('routeChangeStart', handleRouteChangeStart)
    // router.events.on('routeChangeComplete', handleRouteChangeEnd)
    // router.events.on('routeChangeError', handleRouteChangeEnd)

    return () => {
      //   router.events.off('routeChangeStart', handleRouteChangeStart)
      //   router.events.off('routeChangeComplete', handleRouteChangeEnd)
      //   router.events.off('routeChangeError', handleRouteChangeEnd)
    }
  }, [])

  return (
    <Progress
      animationDuration={animationDuration}
      isFinished={isFinished}
      progress={progress}
      key={state.loadingKey}
    />
  )
}

export default PageProgress

const Progress = ({
  animationDuration,
  isFinished,
  progress,
}: {
  animationDuration: number
  isFinished: boolean
  progress: number
}) => {
  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      <Spinner />
    </Container>
  )
}

const Container = ({
  animationDuration,
  isFinished,
  children,
}: {
  animationDuration: number
  isFinished: boolean
  children: React.ReactNode
}) => {
  return (
    <div
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      {children}
    </div>
  )
}

const Bar = ({
  animationDuration,
  progress,
}: {
  animationDuration: number
  progress: number
}) => {
  return (
    <div
      style={{
        background: '#29D',
        height: 2,
        left: 0,
        marginLeft: `${(-1 + progress) * 100}%`,
        position: 'fixed',
        top: 0,
        transition: `margin-left ${animationDuration}ms linear`,
        width: '100%',
        zIndex: 1031,
      }}
    />
  )
}

const Spinner = () => {
  return (
    <div
      style={{
        display: 'block',
        position: 'fixed',
        right: 15,
        top: 15,
        zIndex: 1031,
      }}
    >
      <div
        style={{
          animation: '400ms linear infinite spinner',
          borderBottom: '2px solid transparent',
          borderLeft: '2px solid #29d',
          borderRadius: '50%',
          borderRight: '2px solid transparent',
          borderTop: '2px solid #29d',
          boxSizing: 'border-box',
          height: 18,
          width: 18,
        }}
      />
    </div>
  )
}
