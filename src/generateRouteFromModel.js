module.exports = (config) => {
    var obj = {};

    for (let [key, val] of Object.entries(config.models)) {
        obj[key] = {
            get: {
                url: 'get',
                action: '/'
            },
            post: {
                url: 'post',
                action: '/'
            }
        };

        for (let [tableAttribute, attributeValues] of Object.entries(val.tableAttributes)) {
            if (attributeValues.primaryKey) {
                let reff = obj[key];
                reff['getById'] = {
                    url: '/getById/:' + tableAttribute,
                    action: 'getWithParams'
                };

                reff['put'] = {
                    url: '/:' + tableAttribute,
                    action: 'put'
                };

                reff['delete'] = {
                    url: '/:' + tableAttribute,
                    action: 'delete'
                };
            }
        }
    }

    return obj;
}