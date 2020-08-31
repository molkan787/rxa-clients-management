import { RemindersService } from './Reminders.service';
import { PaymentsService } from './Payments.service';

export default class Services {
    static init(){
        RemindersService.init();
        PaymentsService.init();
    }
}