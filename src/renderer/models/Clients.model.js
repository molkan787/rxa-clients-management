import { collections } from '../database';
import { nowJson, month } from '../helpers/time';
import MetadataModel from './Metadata.model';
import store from '../store';
import { RemindersService } from '../services/Reminders.service';

const CLIENT_NO_POINTER = 'client_no_pointer';

export const ClientsTemplates = Object.freeze({
    LTD_COMPANIES: 'ltd_companies',
    SOLE_TRADER: 'sole_trader',
    MINICAB: 'mini_cab',
})

export default class ClientsModel{

    static get collection(){
        return collections.clients;
    }

    static getClientsByIds(clients_ids){
        return this.collection.find({
            selector: {
                _id: {
                    $in: clients_ids
                }
            }
        })
    }

    static getLtdMonthlyDueList(){
        return this.getClients(ClientsTemplates.LTD_COMPANIES, {
            'data.incorporated': {
                $regex: `^.+-${month()}`,
            },
        });
    }

    static getClients(template, filters){
        const allowed = this.getAllowedClients();
        const extra = allowed ? {
            _id: {
                $in: allowed
            }
        } : {}
        return this.collection.find({
            selector: {
                template,
                ...(filters || {}),
                ...extra
            },
            sort: [
                { no: 'desc' }
            ]
        });
    }

    static getClientById(client_id){
        return this.collection.findOne({
            selector: {
                _id: client_id,
            }
        });
    }

    static async patchClient(client_id, patch){
        const client = typeof client_id == 'object' ? client_id : await this.getClientById(client_id).exec();
        await client.atomicUpdate(data => {
            for(let prop in patch){
                if(!patch.hasOwnProperty(prop)) continue;
                Object.setPathedValue(data, prop, patch[prop]);
            }
            data.updated_at = nowJson();
            return data;
        });
    }

    static async addClient(details, template){
        const now = nowJson();
        const _details = Object.decodepaths(details);
        const no = await this.reserveNo(template);
        const client = await this.collection.insert({
            ..._details,
            no,
            template,
            created_at: now,
            updated_at: now,
        });
        await RemindersService.generateDefaultReminders(client);
        return client;
    }

    static async addBulkClients(bulkDetails, template){
        const now = nowJson();
        let no = await this.reserveNo(template, bulkDetails.length);
        const docsData = bulkDetails.map(details => ({
            ...Object.decodepaths(details),
            no: no++,
            template,
            created_at: now,
            updated_at: now,
        }));
        const { success } = await this.collection.bulkInsert(docsData);
        for(let client of success){
            await RemindersService.generateDefaultReminders(client);
        }
        return success;
    }

    static async reserveNo(template, count){
        const KEY = CLIENT_NO_POINTER + '_' + template;
        const multiple = typeof count == 'number';
        const current = await MetadataModel.getValue(KEY, 1);
        await MetadataModel.incValue(KEY, multiple ? count : 1);
        return current;
    }

    static getAllowedClients(){
        const user = store.state.Session.user;
        if(user.usertype == 'admin'){
            return null;
        }else{
            return user.clients;
        }
    }

}

window.ClientsModel = ClientsModel;