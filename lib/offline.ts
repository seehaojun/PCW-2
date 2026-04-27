'use client'

import { openDB, type DBSchema } from 'idb'

interface OfflineDraft {
  entryId: string
  textNotes?: string
  voiceBlobs?: { timestamp: number; blob: Blob }[]
  photoBlobs?: { timestamp: number; filename: string; blob: Blob }[]
  updatedAt: number
}

interface PCW2DB extends DBSchema {
  'offline-drafts': {
    key: string
    value: OfflineDraft
  }
}

function getDB() {
  return openDB<PCW2DB>('pcw2-offline-drafts', 1, {
    upgrade(db) {
      db.createObjectStore('offline-drafts', { keyPath: 'entryId' })
    },
  })
}

export async function saveOfflineDraft(draft: OfflineDraft) {
  const db = await getDB()
  await db.put('offline-drafts', draft)
}

export async function getOfflineDraft(entryId: string) {
  const db = await getDB()
  return db.get('offline-drafts', entryId)
}

export async function getAllOfflineDrafts() {
  const db = await getDB()
  return db.getAll('offline-drafts')
}

export async function deleteOfflineDraft(entryId: string) {
  const db = await getDB()
  await db.delete('offline-drafts', entryId)
}
