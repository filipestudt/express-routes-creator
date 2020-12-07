module.exports = {
    get: {
        url: '/',
        logged: true,
        action: 'get'
    },
    getByAuthor: {
        url: '/:authorId',
        logged: true,
        action: 'getWithParams'
    },
    put: {
        url: '/:id',
        logged: true,
        action: 'put'
    },
    delete: {
        url: '/:id',
        logged: true,
        action: 'delete'
    }
}