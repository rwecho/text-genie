import { Inter } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Metadata, ResolvingMetadata } from 'next'
import { getTranslations } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(
  {},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations('HomePage')
  return {
    title: t('appName'),
    description: t('appDescription'),
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    lang: string
  }
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()
  return (
    <ClerkProvider>
      <html lang={params.lang} suppressHydrationWarning={true}>
        <body className={inter.className}>
          <AntdRegistry>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </AntdRegistry>
        </body>
      </html>
    </ClerkProvider>
  )
}
