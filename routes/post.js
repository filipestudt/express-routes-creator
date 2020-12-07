module.exports = {
    get: {
        url: '/',
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