'use client'
import { useAuth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
const NotePage = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    redirect('/sign-in')
  }

  const fetchDataFromExternalResource = async () => {
    const token = await getToken()
    // Use the token to fetch data from an external resource
    // return data;

    return null
  }

  return <div>NotePage</div>
}

export default NotePage
