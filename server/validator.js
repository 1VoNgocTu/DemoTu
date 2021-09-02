const auth = {
    username: { type: 'string'},
    password: { type: 'string'}
}

const post = {
    title:{ type: 'string'},
    disdescription: {
        type: 'string',
        optional: true
    },
    url: {
        type: 'string',
        optional: true
    },
    status: {
        type: 'string',
        optional: true
    },
}

module.exports = {
    auth,
    post
}