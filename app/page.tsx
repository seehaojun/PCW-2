import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, defaultRouteForRole } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  redirect(defaultRouteForRole(session.user.role))
}
