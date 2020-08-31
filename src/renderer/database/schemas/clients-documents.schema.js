export default {
    type: 'object',
    version: 0,
    properties: {
        name: {
            type: 'string',
        },
        client_id: {
            type: 'string',
        },
        mimetype: {
            type: 'string',
        },
        comment: {
            type: 'string',
        },
        created_at: {
            type: 'string',
        }
    },
    attachments: {},
    indexes: [
        'client_id',
        'name',
        'created_at'
    ]
}