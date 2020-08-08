import { addRxPlugin, createRxDatabase } from 'rxdb';
import leveldown from 'leveldown';
import PouchDB from 'pouchdb';
import path from 'path';
import PouchDbAdapterLevelDb from 'pouchdb-adapter-leveldb';
addRxPlugin(PouchDbAdapterLevelDb);
import UsersSchema from './schemas/users.schema';
import ClientsSchema from './schemas/clients.schema';
import { nowJson } from '../helpers/time';
import md5 from 'md5';

let db = null;
export const collections = {};

// $TODO: DB syncing with remote
export async function init(){
    const _db = await createRxDatabase({
        name: path.join(DataDir, 'data', 'mydb'), // $TMP
        adapter: leveldown,
    });
    db = _db;
    collections.users = await _db.collection({ name: 'users', schema: UsersSchema });
    collections.clients = await _db.collection({ name: 'clients', schema: ClientsSchema });
    await setup();
}

export function getDB(){
    return db;
}

async function setup(){
    const users = await collections.users.find().exec();
    if(users.length == 0){
        const timenow = nowJson();
        await collections.users.insert({
            username: 'admin',
            usertype: 'admin',
            fullname: 'Master Admin',
            password: md5('123456'),
            created_at: timenow,
            updated_at: timenow,
        })
    }
}