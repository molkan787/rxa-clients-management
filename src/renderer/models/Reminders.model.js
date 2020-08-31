import { collections } from '../database';
import { nowJson } from '../helpers/time';
import { isRxDocument } from 'rxdb';

export default class RemindersModel{

    static get collection(){
        return collections.reminders;
    }

    static async archiveReminder(item){
        const doc = isRxDocument(item) ? item : await this.collection.findOne({
            selector: {
                _id: item,
            }
        })
        return doc.atomicSet('archived', true);
    }

    static addReminder(data){
        const now = nowJson();
        return this.collection.insert({
            ...data,
            created_at: data.created_at || now,
            updated_at: now,
        })
    }

    
    static getRemindersByBulkClients(clients_ids, filters){
        return this.collection.find({
            selector: {
                client_id: {
                    $in: clients_ids,
                },
                ...(filters || {})
            }
        })
    }

    static getRemindersByClient(client_id){
        return this.collection.find({
            selector: {
                client_id,
            },
            sort: [
                { 'date': 'desc' }
            ]
        })
    }
    
    static getRemindersByDate(date){
        return this.collection.find({
            selector: {
                date: {
                    $regex: new RegExp(`^${date}`)
                },
            }
        })
    }

}

window.RemindersModel = RemindersModel;