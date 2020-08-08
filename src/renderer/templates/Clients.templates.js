import { ClientsTemplates } from '../models/Clients.model';
export default Object.freeze({
    [ClientsTemplates.LTD_COMPANIES]: {
        name: ClientsTemplates.LTD_COMPANIES,
        title: 'LTD COMPANIES',
        props: [
            {
                text: 'SERIAL NO',
                value: 'no',
                type: 'number',
            },
            {
                text: 'NAME OF BUSINESS',
                value: 'business_name',
                type: 'text',
            },
            {
                text: 'INCORPORATED',
                value: 'data.incorporated',
                type: 'date',
                format: 'DD/MM/YYYY'
            },
            {
                text: 'A/C DATE',
                value: 'data.ac_date',
                type: 'date',
                format: 'DD/MM'
            },
            {
                text: 'NOTE',
                value: 'data.note',
                type: 'text',
            },
            {
                text: 'ANNUAL RETURN DUE',
                value: 'data.annual_return_due',
                type: 'date',
                format: 'DD/MM'
            },
            {
                text: 'Ann. Ret (DATE SENT)',
                value: 'data.ann_ret_date_sent',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'A/C to IR (DATE SENT)',
                value: 'data.ac_to_ir_date_sent',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'A/C to CO (DATE SENT)',
                value: 'data.ac_to_co_date_sent',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'DATE OF SA SENT',
                value: 'data.date_of_sa_sent',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'TOTAL FEE',
                value: 'data.total_fee',
                type: 'currency'
            },
            {
                text: 'OUTSTANDING FEE',
                value: 'data.outstanding_fee',
                type: 'currency'
            }
        ],
        forms: {
            creation: {
                all: true,
                required: ['business_name'],
                readonly: ['no'],
                defaults: {
                    'no': 2
                }
            }
        },
        table: {
            primary_fields: [
                'no',
                'business_name',
                'data.incorporated',
                'data.total_fee',
                'data.outstanding_fee',
            ]
        }
    }
})
