import { collections } from '../database';

export default class AccountingEntriesModel{

    static get collection(){
        return collections.accountingEntries;
    }

    static getClientEntries(client_id, filters){
        const { dateFrom, dateTo, category } = filters;
        const selector = {
            client_id,
        }
        if(category) selector.category = category;

        if(dateFrom || dateTo){
            selector.date = {}
            if(dateFrom) selector.date.$gte = dateFrom;
            if(dateTo) selector.date.$lte = dateTo;
        }
        
        return this.collection.find({
            selector,
            sort: [
                { date: 'desc' }
            ]
        })
    }

}