import { addRxPlugin, createRxDatabase } from 'rxdb';
import leveldown from 'leveldown';
import path from 'path';
import PouchDB from 'pouchdb';
import PouchDbAdapterLevelDb from 'pouchdb-adapter-leveldb';
import PouchDbAdapterHttp from 'pouchdb-adapter-http'
import UsersSchema from './schemas/users.schema';
import ClientsSchema from './schemas/clients.schema';
import PaymentsSchema from './schemas/payments.schema';
import RemindersSchema from './schemas/reminders.schema';
import MetadataSchema from './schemas/metadata.schema';
import ClientsDocumentsSchema from './schemas/clients-documents.schema';
import AccountingEntriesSchema from './schemas/accounting-entries.schema';
import ClientsAccountsSchema from './schemas/clients-accounts.schema';
import EntriesCategoriesSchema from './schemas/entries-categories.schema';
import { nowJson } from '../helpers/time';
import md5 from 'md5';
import config from '../config';

addRxPlugin(PouchDbAdapterLevelDb);
addRxPlugin(PouchDbAdapterHttp);

let db = null;
export const collections = {};

export async function init(){
    const _db = await createRxDatabase({
        name: path.join(DataDir, 'data', 'rxa-db'),
        adapter: leveldown,
    });
    db = _db;
    collections.users = await _db.collection({ name: 'users', schema: UsersSchema });
    collections.clients = await _db.collection({ name: 'clients', schema: ClientsSchema });
    collections.payments = await _db.collection({ name: 'payments', schema: PaymentsSchema });
    collections.reminders = await _db.collection({ name: 'reminders', schema: RemindersSchema });
    collections.metadata = await _db.collection({ name: 'metadata', schema: MetadataSchema });
    collections.clientsAccounts = await _db.collection({ name: 'clients_accounts', schema: ClientsAccountsSchema });
    collections.clientsDocuments = await _db.collection({ name: 'clients_documents', schema: ClientsDocumentsSchema });
    collections.accountingEntries = await _db.collection({ name: 'accounting_entries', schema: AccountingEntriesSchema });
    collections.entriesCategories = await _db.collection({ name: 'entries_categories', schema: EntriesCategoriesSchema });
    setupReplications();
    // await setup();
}

export function getDB(){
    return db;
}

function setupReplications(){
    _setupReplication(collections.users, 'rxa_users');
    _setupReplication(collections.clients, 'rxa_clients');
    _setupReplication(collections.payments, 'rxa_payments');
    _setupReplication(collections.reminders, 'rxa_reminders');
    _setupReplication(collections.metadata, 'rxa_metadata');
    _setupReplication(collections.clientsAccounts, 'rxa_clients_accounts');
    _setupReplication(collections.clientsDocuments, 'rxa_client_documents');
    _setupReplication(collections.accountingEntries, 'rxa_accounting_entries');
    _setupReplication(collections.entriesCategories, 'rxa_entries_categories');
}

function _setupReplication(collection, remoteName){
    const pouchdb = new PouchDB(`${config.REMOTE_DB_URL}/${remoteName}/`);
    const rep_state = collection.sync({
        remote: pouchdb,
        waitForLeadership: false,
        direction: {
            pull: true,
            push: true
        },
        options: {
            live: true,
            retry: true
        },
    })
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
