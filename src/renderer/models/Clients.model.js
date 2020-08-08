import { collections } from '../database';
import { nowJson } from '../helpers/time';

export const ClientsTemplates = Object.freeze({
    LTD_COMPANIES: 'ltd_companies',
    SOLE_TRADER: 'sole_trader',
    MINICAB: 'mini_cab',
})

export default class ClientsModel{

    static get collection(){
        return collections.clients;
    }

    static getClients(template){
        return this.collection.find({
            selector: {
                template,
            }
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
        await client.update({
            $set: {
                ...Object.decodepaths(patch),
                updated_at: nowJson(),
            }
        })
    }

    static addClient(details, template){
        const now = nowJson();
        const _details = Object.decodepaths(details);
        return this.collection.insert({
            ..._details,
            template,
            created_at: now,
            updated_at: now,
        });
    }

}

window.ClientsModel = ClientsModel;