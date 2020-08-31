export default {
    type: 'object',
    version: 0,
    properties: {
        client_id: {
            type: 'string',
        },
        items: {
            type: 'array',
        }
    },
    indexes: [
        'client_id',
    ]
}