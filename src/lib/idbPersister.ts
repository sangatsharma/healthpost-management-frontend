import { PersistedClient } from '@tanstack/query-persist-client-core';
import { openDB, type IDBPDatabase } from 'idb';
import { base64ToFile } from './utils';
import { TAny } from '@/types/global';

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
        route + '||' + Date.now(),
      );
    } catch (error) {
      console.error('Failed to save offline mutation:', error);
    }
  },

  // async getAllOfflineMutations<T>() {
  //   try {
  //     const db = await getDB();
  //     if (!db.objectStoreNames.contains('offline-mutations')) return [];
  //     const keys = await db.getAllKeys('offline-mutations');
  //     const mutations = await Promise.all(
  //       keys.map(async (key) => {
  //         const data = await db.get('offline-mutations', key);

  //         return data ? { key, ...JSON.parse(data) } : null;
  //       }),
  //     );
  //     return mutations.filter(Boolean) as {
  //       key: string;
  //       method: 'post' | 'delete' | 'put';
  //       data: T;
  //       timestamp: Date;
  //     }[];
  //   } catch (error) {
  //     console.error('Failed to get offline mutations:', error);
  //     return [];
  //   }
  // },

  async getAllOfflineMutations<T>() {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains('offline-mutations')) return [];

      const keys = await db.getAllKeys('offline-mutations');

      const mutations = await Promise.all(
        keys.map(async (key) => {
          const rawString = await db.get('offline-mutations', key);
          if (!rawString) return null;

          // Parse if stored as JSON string
          const raw =
            typeof rawString === 'string' ? JSON.parse(rawString) : rawString;

          const { data, ...rest } = raw;
          if (!data || typeof data !== 'object') return null;

          const parsedData: Record<string, TAny> = {};

          for (const [k, v] of Object.entries(data)) {
            // Handle base64 image object
            if (
              typeof v === 'object' &&
              v !== null &&
              'base64' in v &&
              'name' in v &&
              'type' in v
            ) {
              parsedData[k] = base64ToFile(
                v.base64 as string,
                v.name as string,
                v.type as string,
              );
            } else {
              parsedData[k] = parseValue(v);
            }
          }

          return {
            key,
            ...rest,
            data: parsedData,
          };
        }),
      );

      return mutations.filter(Boolean) as {
        key: string;
        method: 'post' | 'put' | 'delete';
        data: T;
        timestamp: number;
        headers: TAny;
      }[];
    } catch (error) {
      console.error('Failed to get offline mutations:', error);
      return [];
    }
  },
  async removeOfflineMutation(key?: string) {
    if (!key) {
      return;
    }
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains('offline-mutations')) return;
      await db.delete('offline-mutations', key);
    } catch (error) {
      console.error('Failed to remove offline mutation:', error);
    }
  },
};

function parseValue(value: TAny) {
  if (value === 'null') return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Try parsing numbers (but don't convert things like "0123abc")
  if (
    typeof value === 'string' &&
    !isNaN(value as TAny) &&
    value.trim() !== ''
  ) {
    const num = Number(value);
    if (!isNaN(num)) return num;
  }

  return value;
}
