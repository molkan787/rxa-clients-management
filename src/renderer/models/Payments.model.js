import { collections } from '../database';
import { nowJson } from '../helpers/time';

export default class PaymentsModel{

    static get collection(){
        return collections.payments;
    }

    static getClientPayments(client_id, year){
        const selector = {
            client_id,
        };
        if(year) selector.year = year;
        return this.collection.findOne({
            selector
        });
    }

    static savePayment(data){
        return this.collection.upsert(data);
    }

}

window.PaymentsModel = PaymentsModel;