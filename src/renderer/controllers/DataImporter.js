import xlsx from 'node-xlsx';
import ClientsTemplates from '../templates/Clients.templates';
import DataMapper from './helpers/DataMapper';
import ClientsModel from '../models/Clients.model';
import { sleep } from '../utils';

export default class DataImporter{

    static async importClients(filename){
        const sheets = xlsx.parse(filename);
        const dataMapper = new DataMapper(Object.values(ClientsTemplates));
        const data = dataMapper.mapSheetsData(sheets);
        console.time('addClients');
        await this._addClients(data);
        console.timeEnd('addClients');
    }

    static async _addClients(data){
        for(let [template, items] of Object.entries(data)){
            const clients = this._filterClients(items);
            if(clients.length < 1) continue;
            await ClientsModel.addBulkClients(items, template);
            // await this._insertClients(clients, template);
        }
    }

    static async _insertClients(items, template){
        for(let item of items){
            await ClientsModel.addClient(item, template);
        }
    }

    static _filterClients(clients){
        return clients.filter(c => c.no && c.business_name)
    }
    
}