export default {
    type: 'object',
    version: 0,
    properties: {
        client_id: {
            type: 'string',
            primary: true,
        },
        username: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
        infos: {
            type: 'object',
        },
        created_at: {
            type: 'string',
        },
        updated_at: {
            type: 'string',
        },
    },
    indexes: [
        'username',
    ]
}