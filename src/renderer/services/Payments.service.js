import PaymentsModel from '../models/Payments.model';
import { monthNames, currentYear } from '../helpers/time';

export class PaymentsService{

    static init() {}

    static async makePayment(client, amount){
        const client_id = client._id;
        const payments = await this.getPayments(client_id, currentYear());
        let { paid_year, paid_months, year } = payments;
        const { total_fee, payment_plan } = client.data;
        const paymentPlan = payment_plan || 'monthly';
        if(paymentPlan == 'monthly'){
            const perMonth = total_fee / 12;
            let remaining = parseFloat(amount);
            for(let m = 0; m < 12; m++){
                const paidAmt = this._getPaidAmount(paid_months[m], perMonth);
                const diff = perMonth - paidAmt;
                if(diff == 0) continue;
                const toAdd = Math.min(diff, remaining);
                remaining -= toAdd;
                const newPaidAmt = paidAmt + toAdd;
                paid_months[m] = newPaidAmt >= perMonth ? true : newPaidAmt;
                if(remaining <= 0) break;
            }
        }else{
            paid_year = this._getPaidAmount(paid_year, total_fee) + parseFloat(amount);
            if(paid_year >= total_fee) paid_year = true;
        }
        await PaymentsModel.savePayment({
            client_id,
            year,
            paid_year,
            paid_months
        })
    }

    static async setPaidAmount(client, amount, year, month){
        const client_id = client._id;
        const payments = await this.getPayments(client_id, year);
        let { paid_year, paid_months } = payments;
        if(typeof month != 'undefined'){
            paid_months[month] = amount;
        }else{
            paid_year = amount;
        }
        await PaymentsModel.savePayment({
            client_id,
            year,
            paid_year,
            paid_months
        })
    }

    static async calcYearlyPaidAmount(client, year){
        const payments = await this.getPayments(client._id, year);
        const { paid_year, paid_months } = payments;
        const { total_fee, payment_plan } = client.data;
        const paymentPlan = payment_plan || 'monthly';
        if(paymentPlan == 'monthly'){
            const perMonth = total_fee / 12;
            let totalPaidAmt = 0;
            for(let m = 0; m < 12; m++){
                const paidAmt = this._getPaidAmount(paid_months[m], perMonth);
                totalPaidAmt += paidAmt;
            }
            return totalPaidAmt;
        }else{
            return this._getPaidAmount(paid_year, total_fee);
        }
    }

    static async getClientInvoices(client, year){
        const payments = await this.getPayments(client._id, year);
        return this.generateInvoices(client, payments);
    }

    static generateInvoices(client, payments){
        const { paid_year, paid_months, year } = payments;
        const { total_fee, payment_plan } = client.data;
        const paymentPlan = payment_plan || 'monthly';
        if(paymentPlan == 'monthly'){
            const perMonth = total_fee / 12;
            const invoices = [];
            for(let m = 0; m < 12; m++){
                const paidAmt = this._getPaidAmount(paid_months[m], perMonth);
                invoices.push({
                    text: `${monthNames[m]} ${year}`,
                    due: perMonth,
                    paid: paidAmt,
                    year,
                    month: m
                })
            }
            return invoices;
        }else{
            const paidAmt = this._getPaidAmount(paid_year, total_fee);
            return [{
                text: 'Year ' + year,
                paid: paidAmt,
                due: total_fee,
                year,
            }]
        }
    }

    static _getPaidAmount(status, total){
        return parseFloat(status ? (typeof status == 'boolean' ? total : status) : 0);
    }

    static async getPayments(client_id, year){
        const payments = await PaymentsModel.getClientPayments(client_id, year).exec();
        return payments || {
            year,
            paid_months: {}
        };
    }

    static _generateInvoices(client, year){
        const paymentPlan = client.data.payment_plan || 'monthly';
        const { total_fee, outstanding_fee } = client.data;
        const total = parseFloat(total_fee || 0);
        const outstanding = parseFloat(outstanding_fee || 0);
        if(total == 0) return [];
        const paidAmt = total - outstanding;
        if(paymentPlan == 'monthly'){
            const perMonth = total / 12;
            const invoices = [];
            let remaining = paidAmt;
            for(let i = 0; i < 12; i++){
                const amt = remaining >= perMonth ? perMonth : remaining;
                remaining -= amt;
                invoices.push({
                    text: `${monthNames[i]} ${year}`,
                    due: perMonth,
                    paid: amt
                })
            }
            return invoices.reverse();
        }else{
            return [{
                text: 'Year ' + year,
                paid: paidAmt,
                due: total
            }]
        }
    }

}