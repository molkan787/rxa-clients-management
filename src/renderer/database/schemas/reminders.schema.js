export default {
    type: 'object',
    version: 0,
    properties: {
        date: {
            type: 'string',
        },
        client_id: {
            type: 'string',
        },
        auto_remove: {
            type: 'boolean',
            default: false
        },
        type: {
            type: 'string',
        },
        content: {
            type: 'object',
        },
        notify_client: {
            type: 'boolean',
            default: false
        },
        reschedule: {
            default: false
        },
        repeat: {
            type: 'array',
            default: []
        },
        sent_count: {
            type: 'number',
            default: 0
        },
        options: {
            type: 'object',
            default: {}
        },
        archived: {
            type: 'boolean',
            default: false,
        },
        created_at: {
            type: 'string'
        },
        updated_at: {
            type: 'string',
        }
    },
    indexes: [
        'date',
        'type',
        'client_id',
    ],
    required: [
        'date',
        'type',
        'content',
    ]
}

export const ALL_CLIENTS = '__all_clients__';