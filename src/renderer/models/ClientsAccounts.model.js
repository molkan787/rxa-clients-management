import { collections } from '../database';
import ClientsModel from './Clients.model';
import { slugify } from '../helpers/string';
import { nowJson } from '../helpers/time';
import md5 from 'md5';

export default class ClientsAccountModel{

    static get collection(){
        return collections.clientsAccounts;
    }

    static getAccountByClientId(client_id){
        return this.collection.findOne({
            selector: {
                client_id,
            }
        })
    }

    static async changeAccountPassword(client_id, password){
        const account = await this.getAccountByClientId(client_id).exec();
        if(!account) throw new Error(`Client with id "${client_id}" not found`);
        await account.update({
            $set: {
                password: md5(password),
                updated_at: nowJson()
            }
        });
    }

    static async createAccount(client_id, password){
        const client = await ClientsModel.getClientById(client_id).exec();
        if(!client) throw new Error(`Client with id "${client_id}" not found`);
        const name = client.business_name;
        const username = await this._findUsername(name);
        const now = nowJson();
        await this.collection.insert({
            client_id,
            username,
            password: md5(password),
            infos: {
                name,
            },
            created_at: now,
            updated_at: now,
        })
    }

    static async _findUsername(clientName){
        let _username = slugify(clientName);
        let suffix = 1;
        while(suffix < 250){
            const username = _username + (suffix > 1 ? '-' + suffix : '')
            const account = await this.getAccountByUsername(username).exec();
            if(!account) return username;
        }
        throw new Error('Could find unused username, Max tries limit reached.');
    }

    static getAccountByUsername(username){
        return this.collection.findOne({
            selector: {
                username
            }
        })
    }

}