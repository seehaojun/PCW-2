import { neon, neonConfig } from '@neondatabase/serverless'
import { Agent, fetch as undiciFetch } from 'undici'

const agent = new Agent({ connect: { family: 4 } })

neonConfig.fetchFunction = (url: string | URL | Request, init?: RequestInit) => {
  return undiciFetch(url as string, {
    ...init,
    dispatcher: agent,
  } as Parameters<typeof undiciFetch>[1])
}

export function getDb() {
  return neon(process.env.DATABASE_URL!)
}
