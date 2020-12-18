module.exports = (models) => {
    var obj = {};

    for (let [key, val] of Object.entries(models)) {
        obj[key] = {
            get: {
                url: '/',
                method: 'get',
                action: 'get'
            },
            post: {
                url: '/',
                method: 'post',
                action: 'post'
            }
        };

        for (let [tableAttribute, attributeValues] of Object.entries(val.tableAttributes)) {
            if (attributeValues.primaryKey) {
                let reff = obj[key];
                reff['getById'] = {
                    url: '/getById/:' + tableAttribute,
                    method: 'get',
                    action: 'getWithParams'
                };

                reff['put'] = {
                    url: '/:' + tableAttribute,
                    method: 'put',
                    action: 'put'
                };

                reff['delete'] = {
                    url: '/:' + tableAttribute,
                    method: 'delete',
                    action: 'delete'
                };
            }
        }
    }

    return obj;
}