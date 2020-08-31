export default {
    type: 'object',
    version: 0,
    properties: {
        client_id: {
            type: 'string',
            primary: true,
        },
        year: {
            type: 'number'
        },
        paid_year: {},
        paid_months: {
            type: 'object',
            default: {}
        }
    },
    attachments: {},
    indexes: ['year']
};