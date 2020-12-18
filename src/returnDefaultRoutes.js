module.exports = () => {
    return {
        get: {
            url: '/',
            method: 'get',
            action: 'get'
        },
        post: {
            url: '/',
            method: 'post',
            action: 'post'
        },
        put: {
            url: '/:id',
            method: 'put',
            action: 'put'
        },
        delete: {
            url: '/:id',
            method: 'delete',
            action: 'delete'
        }
    }
}