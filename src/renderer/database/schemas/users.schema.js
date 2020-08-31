export default {
    type: 'object',
    version: 0,
    properties: {
        username: {
            type: 'string',
            maxLength: 200,
            minLength: 3,
            primary: true,
        },
        password: {
            type: 'string',
        },
        usertype: {
            type: 'string',
        },
        fullname: {
            type: 'string',
            maxLength: 200,
        },
        clients: {
            type: 'array',
            default: [],
        },
        created_at: {
            type: 'string'
        },
        updated_at: {
            type: 'string',
        }
    },
    required: ['password', 'usertype']
}