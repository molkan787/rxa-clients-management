import { RxCollection, RxDatabase } from 'rxdb';

interface Collections {
    users: RxCollection,
    clients: RxCollection,
}

export const collections: Collections;

export function init(): Promise<any>;

export function getDB(): Promise<RxDatabase>;