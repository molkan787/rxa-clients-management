import { RxCollection, RxDatabase } from 'rxdb';

interface Collections {
    users: RxCollection,
    clients: RxCollection,
    payments: RxCollection,
    reminders: RxCollection,
    metadata: RxCollection,
    clientsAccounts: RxCollection,
    clientsDocuments: RxCollection,
    accountingEntries: RxCollection,
    entriesCategories: RxCollection,
}

export const collections: Collections;

export function init(): Promise<any>;

export function getDB(): Promise<RxDatabase>;