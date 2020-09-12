import Controller from './controller';
import PaymentsModel from '../models/Payments.model';
import ClientsModel, { ClientsTemplates } from '../models/Clients.model';
import { year } from '../helpers/time';
import DataImporter from './DataImporter';
import { RemindersService } from '../services/Reminders.service';
import { PaymentsService } from '../services/Payments.service';

export default class ClientsController extends Controller{

    static async makePayment(client, amount, payment_date){
        await PaymentsService.makePayment(client, amount, payment_date)
        await this.calcOutstadningFee(client._id);
    }

    static async setPayment(client, amount, year, month){
        await PaymentsService.setPaidAmount(client, amount, year, month);
        await this.calcOutstadningFee(client._id);
    }

    static async setClientDataField(client_id, field, value){
        await ClientsModel.patchClient(client_id, {
            [field]: value,
        });
        if(field == 'data.total_fee' || field == 'data.payment_plan'){
            await this.calcOutstadningFee(client_id);
        }else if(field == 'data.incorporated'){
            const client = await ClientsModel.getClientById(client_id).exec();
            if(client.template == ClientsTemplates.LTD_COMPANIES){
                await RemindersService.generateDefaultReminders(client);
            }
        }
    }

    static async calcOutstadningFee(client_id){
        const client = await ClientsModel.getClientById(client_id).exec();
        const total_paid = await PaymentsService.calcYearlyPaidAmount(client, year());
        const outstanding = client.data.total_fee - total_paid;
        await ClientsModel.patchClient(client, {
            'data.outstanding_fee': outstanding,
        })
    }

    static importClients(excelFilename){
        return DataImporter.importClients(excelFilename);
    }

}
ClientsModel.ClientsController = ClientsController;
window.ClientsController = ClientsController