export default {
    type: 'object',
    version: 0,
    properties: {
        client_id: {
			type: 'string'
		},
        entry_type: {
			type: 'string'
		},
        date: {
			type: 'string'
		},
        category: {
			type: 'string'
		},
        amount: {
            type: 'number'
        },
        note: {
            type: 'string',
            default: '',
		},
        created_at: {
			type: 'string'
		},
        updated_at: {
			type: 'string'
		},
    },
    indexes: [
        'client_id',
        'entry_type',
        'date',
        'category',
    ]
}