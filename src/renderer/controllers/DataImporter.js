import xlsx from 'node-xlsx';
import ClientsTemplates from '../templates/Clients.templates';
import DataMapper from './helpers/DataMapper';
import ClientsModel from '../models/Clients.model';

export default class DataImporter{

    static async importClients(filename){
        const sheets = xlsx.parse(filename);
        const dataMapper = new DataMapper(Object.values(ClientsTemplates));
        const data = dataMapper.mapSheetsData(sheets);
        await this._addClients(data);
    }

    static async _addClients(data){
        for(let [template, items] of Object.entries(data)){
            await ClientsModel.addBulkClients(items, template);
        }
    }
    
}