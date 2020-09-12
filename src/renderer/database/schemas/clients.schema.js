export default {
    type: 'object',
    version: 0,
    properties: {
        no: {
            type: 'number',
        },
        business_name: {
            type: 'string',
        },
        template: {
            type: 'string',
        },
        data: {
            type: 'object',
            default: {}
        },
        created_at: {
            type: 'string'
        },
        updated_at: {
            type: 'string',
        }
    },
    indexes: [
        'no',
        'template',
        'business_name',
    ],
    required: [
        'template',
        'business_name',
        'data'
    ]
}