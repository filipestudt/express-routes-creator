module.exports = (route, name, consign) => {
    var routeStringContent = `const express = require('express');\n`;
    routeStringContent += `const routes = express.Router();\n`;
    routeStringContent += `const authService = require('../services/auth-service');\n`;
    routeStringContent += `const controller = require('../controllers/${name}-controller');\n\n`;

    for (let [key, val] of Object.entries(route)) {

        let method = val.method ? val.method :
            key.includes('get') ? 'get' :
                key.includes('post') ? 'post' :
                    key.includes('put') ? 'put' :
                        key.includes('delete') ? 'delete' : '';


        let action = val.action || key;

        routeStringContent += `routes.${method}('${val.url}', `;
        routeStringContent += `${val.logged == true ? 'authService.authorize, ' : ''}`;
        routeStringContent += `controller.${action});\n`;
    }

    if (consign) {
        routeStringContent += `\nmodule.exports = app => { app.use('/${name}s', routes); }`;
    }
    else {
        routeStringContent += `\nmodule.exports = routes;`;
    }

    return routeStringContent;
}