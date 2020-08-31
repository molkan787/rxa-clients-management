import { ClientsTemplates } from '../models/Clients.model';
import RemindersModel from '../models/Reminders.model';
import { nowJson, todayJSON } from '../helpers/time';
import { DateTime } from 'luxon';
import store from '../store';
window.DateTime = DateTime

export const ReminderTypes = {
    TEXT: 'text',
    LTD_ACCT_DUE: 'ltd_acct_due',
    LTD_ANNUAL_RET_DUE: 'ltd_annual_ret_due',
    STM_APRIL_ACCT_DUE: 'stm_april_acct_due',
    STM_TAX_RETURN: 'stm_tax_return',
    PAYMENT: 'payment'
}

export class RemindersService {

    static init(){}

    static getActiveReminders(){
        const today = todayJSON();
        return RemindersModel.collection.find({
            selector: this.applySelectorLimits({
                archived: false,
                $or: [
                    { date: { $lte: today } },
                    { repeat: { $lte: today } }
                ]
            }),
            sort: [
                { date: 'desc' }
            ]
        })
    }

    static async addReminder(params, options){
        if(params.type == ReminderTypes.PAYMENT){
            return await this.addPaymentReminder(params, options);
        }else{
            return await RemindersModel.addReminder(params);
        }
    }

    static async addPaymentReminder(params, options){
        const { schedule } = options;
        const { date, ...props } = params;
        const plus = schedule == 'yearly' ? { year: 1 } : { month: schedule == 'quarterly' ? 3 : 1 };
        return await RemindersModel.addReminder({
            date: this._getNearestSlotDate(schedule),
            ...props,
            content: {
                title: `${schedule.capitalize()} fee reminder`,
                body: 'Fee reminder'
            },
            reschedule: {
                plus,
                copy_reschedule: true
            },
            auto_remove: true,
            options
        })
    }

    static async removeReminder(reminder){
        await reminder.remove();
    }

    static async archiveReminder(reminder){
        if(reminder.auto_remove){
            await reminder.remove();
        }else{
            await reminder.update({
                $set: {
                    archived: true,
                    updated_at: nowJson()
                }
            })
        }
        if(reminder.reschedule){
            await this.rescheduleReminder(reminder);
        }
    }

    static async rescheduleReminder(reminder){
        const data = reminder.toJSON();
        const { reschedule, date, repeat, archived, _id,...props} = data;
        const newDate = this.addToDate(date, reschedule.plus);
        const newRepeat = repeat.map(d => this.addToDate(d, reschedule.plus));
        return await RemindersModel.addReminder({
            date: newDate,
            repeat: newRepeat,
            reschedule: reschedule.copy_reschedule ? reschedule : false,
            archived: false,
            ...props
        })
    }

    static generateDefaultReminders(client){
        if(client.template == ClientsTemplates.LTD_COMPANIES){
            return this.generateLtdDefaultReminders(client);
        }else{
            return this.generateStmDefaultReminders(client);
        }
    }

    static async generateLtdDefaultReminders(client){
        const client_id = client._id;
        const { incorporated } = client.data;
        await this.clearLtdDefaultReminders(client);
        if(!incorporated) return;
        const inc_date = DateTime.fromISO(incorporated);
        const acct_due_date = inc_date.plus({ months: 18 });
        const annual_ret_due_date = inc_date.plus({ months: 12 });
        await RemindersModel.addReminder({
            date: acct_due_date.toJSDate().toJSON(),
            client_id,
            type: ReminderTypes.LTD_ACCT_DUE,
            content: {
                title: 'ACCT DUE  DATE',
                body: 'ACCT due date reminder'
            },
            notify_client: true
        })
        await RemindersModel.addReminder({
            date: annual_ret_due_date.toJSDate().toJSON(),
            client_id,
            type: ReminderTypes.LTD_ANNUAL_RET_DUE,
            content: {
                title: 'ANNUAL RET DUE DATE',
                body: 'Annual due date reminder'
            },
            notify_client: true
        })
    }

    static async generateStmDefaultReminders(client){
        const client_id = client._id;
        const aprilDates = this._getAprilReminderDates();
        await RemindersModel.addReminder({
            client_id,
            date: aprilDates.primary,
            repeat: [aprilDates.repeat],
            reschedule: {
                plus: { year: 1 },
                copy_reschedule: true
            },
            type: ReminderTypes.STM_APRIL_ACCT_DUE,
            content: {
                title: 'ACCT DUE REMINDER',
                body: 'ACCT DUE REMINDER'
            },
            notify_client: true
        })
        await RemindersModel.addReminder({
            client_id,
            date: this._getDecemberReminderDate(),
            reschedule: {
                plus: { year: 1 },
                copy_reschedule: true
            },
            type: ReminderTypes.STM_TAX_RETURN,
            content: {
                title: 'TAX RETURN REMINDER',
                body: 'TAX RETURN REMINDER'
            },
            notify_client: true
        })
    }

    static _getAprilReminderDates(){
        let d = new Date();
        let year = d.getFullYear();
        if(d.getMonth() > 6) year++;
        const date = DateTime.utc(year, 4, 7, 0, 0, 0, 0);
        const primary = date.toJSON();
        const repeat = date.plus({ month: 3 }).set({ day: 1 });
        return {
            primary,
            repeat
        }
    }

    static _getDecemberReminderDate(){
        let d = new Date();
        let year = d.getFullYear();
        if(d.getMonth() == 11 && d.getDate()) year++;
        const date = DateTime.utc(year, 12, 1, 0, 0, 0, 0);
        return date.toJSON();
    }

    static clearLtdDefaultReminders(client){
        return RemindersModel.collection.find({
            selector: {
                client_id: client._id,
                type: {
                    $in: [ReminderTypes.LTD_ACCT_DUE, ReminderTypes.LTD_ANNUAL_RET_DUE]
                }
            }
        }).remove();
    }

    static _getNearestSlotDate(schedule){
        let date = DateTime.fromObject({ day: 1, hour: 0, minute: 0, millisecond: 0, zone: 'UTC' });
        let year = date.get('year');
        let month = date.get('month');
        if(schedule == 'monthly'){
            date = date.plus({ month: 1 });
        }else if(schedule == 'quarterly'){
            const newMonth = Math.ceil(month / 3) * 3 + 1;
            const diff = newMonth - month;
            date = date.plus({ month: diff });
        }else{
            date = date.set({ year: (year+1), month: 1 });
        }
        return date.toJSON();
    }

    static addToDate(date, addition){
        return DateTime.fromISO(date).plus(addition).toJSDate().toJSON();
    }

    static applySelectorLimits(selector){
        const user = store.state.Session.user;
        if(store.getters.isLimitedUser){
            selector.client_id = {
                $in: (user && user.clients) || []
            }
        }
        return selector;
    }

}