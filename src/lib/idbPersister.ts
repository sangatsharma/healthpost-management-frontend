import { PersistedClient } from '@tanstack/query-persist-client-core';
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'react-query-persist';
const STORE_NAME = 'queries';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains('offline-mutations')) {
          db.createObjectStore('offline-mutations');
        }
      },
    });
  }
  return dbPromise;
}

export const idbPersister = {
  async persistClient(persistedClient: PersistedClient) {
    try {
      const db = await getDB();
      await db.put(
        STORE_NAME,
        JSON.stringify(persistedClient),
        'react-query-client',
      );
    } catch (error) {
      console.error('Failed to persist client:', error);
    }
  },

  async restoreClient(): Promise<PersistedClient | undefined> {
    try {
      const db = await getDB();
      const data = await db.get(STORE_NAME, 'react-query-client');
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error('Failed to restore client:', error);
      return undefined;
    }
  },

  async removeClient() {
    try {
      const db = await getDB();
      await db.delete(STORE_NAME, 'react-query-client');
    } catch (error) {
      console.error('Failed to remove client:', error);
    }
  },

  // --- Offline Mutations ---
  async saveOfflineMutation(route: string, mutationData: unknown) {
    try {
      const db = await getDB();
      await db.put(
        'offline-mutations',
        JSON.stringify(mutationData),
        route + '-' + Date.now(),
      );
    } catch (error) {
      console.error('Failed to save offline mutation:', error);
    }
  },

  async getAllOfflineMutations() {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains('offline-mutations')) return [];
      const keys = await db.getAllKeys('offline-mutations');
      const mutations = await Promise.all(
        keys.map(async (key) => {
          const data = await db.get('offline-mutations', key);
          return data ? { key, ...JSON.parse(data) } : null;
        }),
      );
      return mutations.filter(Boolean);
    } catch (error) {
      console.error('Failed to get offline mutations:', error);
      return [];
    }
  },

  async removeOfflineMutation(key: string) {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains('offline-mutations')) return;
      await db.delete('offline-mutations', key);
    } catch (error) {
      console.error('Failed to remove offline mutation:', error);
    }
  },
};
