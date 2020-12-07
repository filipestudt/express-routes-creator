module.exports = (route, name) => {
    var routeStringContent = `const express = require('express');\n`;
    routeStringContent += `const routes = express.Router();\n`;
    routeStringContent += `const authService = require('../services/auth-service');\n`;
    routeStringContent += `const controller = require('../controllers/${name}-controller');\n`;
    routeStringContent += `const ${name} = require('../models/${name}');\n\n`;

    for (let [key, val] of Object.entries(route)) {
        console.log(key);
        console.log(val);

        let method = key.includes('get') ? 'get' :
            key.includes('post') ? 'post' :
                key.includes('put') ? 'put' :
                    key.includes('delete') ? 'delete' :
                        val.method;

        routeStringContent += `routes.${method}('${val.url}', `;
        routeStringContent += `${val.logged == true ? 'authService.authorize, ' : ''}`;
        routeStringContent += `controller.${val.action});\n`;
    }

    routeStringContent += `\nmodule.exports = app => { app.use('/${name}s', routes); }`;

    return routeStringContent;
}