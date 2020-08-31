import { ClientsTemplates } from '../models/Clients.model';

const common = [
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
        text: 'E-MAIL ADDRESS',
        value: 'data.email',
        type: 'email',
    }
]

export default Object.freeze({
    [ClientsTemplates.LTD_COMPANIES]: {
        name: ClientsTemplates.LTD_COMPANIES,
        title: 'LTD COMPANIES',
        excel: {
            headerLines: [ 3, 4 ]
        },
        props: [
            ...common,
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
                text: 'DATE SENT Ann. Ret',
                value: 'data.ann_ret_date_sent',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'DATE SENT A/C to IR',
                value: 'data.ac_to_ir_date_sent',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'DATE SENT A/C to CO',
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
                excludes: ['no']
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
    },
    [ClientsTemplates.SOLE_TRADER]: {
        name: ClientsTemplates.SOLE_TRADER,
        title: 'SOLE TRADER',
        excel: {
            headerLines: [ 3 ]
        },
        props: [
            ...common,
            {
                text: 'BUSINESS STARTED',
                value: 'data.business_started',
                type: 'date',
                format: 'DD/MM/YYYY'
            },
            {
                text: 'OWNERS/PARTNERS NAME',
                value: 'data.owners_partners_name',
                type: 'text',
            },
            {
                text: 'YEAR ENDED',
                value: 'data.year_ended',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'DATE SENT',
                value: 'data.date_sent',
                type: 'date',
                format: 'DD/MM/YYYY'
            },
            {
                text: 'COMMENT',
                value: 'data.note',
                type: 'text',
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
                excludes: ['no']
            }
        },
        table: {
            primary_fields: [
                'no',
                'business_name',
                'data.business_started',
                'data.total_fee',
                'data.outstanding_fee',
            ]
        }
    },
    [ClientsTemplates.MINICAB]: {
        name: ClientsTemplates.MINICAB,
        title: 'MINICAB DRIVERS',
        excel: {
            headerLines: [ 4 ]
        },
        props: [
            ...common,
            {
                text: 'BUSINESS STARTED',
                value: 'data.business_started',
                type: 'date',
                format: 'DD/MM/YYYY'
            },
            {
                text: 'DATE OF POSTED',
                value: 'data.date_of_posted',
                type: 'date',
                format: 'DD/MM/YYYY',
            },
            {
                text: 'PROFESSION',
                value: 'data.profession',
                type: 'text',
            },
            {
                text: 'TELEPHONE',
                value: 'data.telephone',
                type: 'text',
            },
            {
                text: 'TOTAL FEE',
                value: 'data.total_fee',
                type: 'currency'
            },
            {
                text: 'FEE O/S',
                value: 'data.outstanding_fee',
                type: 'currency'
            }
        ],
        forms: {
            creation: {
                all: true,
                required: ['business_name'],
                excludes: ['no']
            }
        },
        table: {
            primary_fields: [
                'no',
                'business_name',
                'data.business_started',
                'data.total_fee',
                'data.outstanding_fee',
            ]
        }
    }
})