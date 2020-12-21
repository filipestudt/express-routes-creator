const fs = require('fs');
const util = require('util');
const generateRoute = require('./src/generateRoute');
const generateController = require('./src/generateController');
const generateRouteFromModel = require('./src/generateRouteFromModel');
const returnDefaultRoutes = require('./src/returnDefaultRoutes');
const validateReplace = require('express-routes-creator/src/validateReplace');

exports.generateFromFile = (config) => {
    /* 
     * Check for the required parameters 
     */
    if (!config.filesPath) {
        throw 'Missing filesPath argument';
    }
    validateReplace(config);

    var files = fs.readdirSync(config.filesPath);

    for (let file of files) {
        let routeObj = require(config.filesPath + '/' + file);

        if (config.routesOutput) {
            let routeStringContent = generateRoute(routeObj, file.replace('.js', ''), config.consign);
            fs.mkdirSync(config.routesOutput, { recursive: true });
            fs.writeFileSync(config.routesOutput + '/' + file.replace('.js', '-route.js'), routeStringContent);
        }

        if (config.controllersOutput) {
            let controllerStringContent = generateController(routeObj, file.replace('.js', ''), config.models);
            fs.mkdirSync(config.controllersOutput, { recursive: true });
            fs.writeFileSync(config.controllersOutput + '/' + file.replace('.js', '-controller.js'), controllerStringContent);
        }
    }
}

/**
 * @description
 * Generate default routes from the model
 * If the model have primary key, will generate a getById method
 * If the model have foreign key, will generate a method for each foreign key
 * 
 * Expected params:
 * {
 *  models,
 *  routesOutput,
 *  controllersOutput
 * }
 * @param {Object} config 
 */
exports.generateFromModel = (config) => {
    if (!config.models) {
        throw 'Missing models argument';
    }
    validateReplace(config);

    let obj = generateRouteFromModel(config.models);

    for (let [key, val] of Object.entries(obj)) {
        if (config.routesOutput) {
            let routeStringContent = generateRoute(val, key[0].toLocaleLowerCase() + key.slice(1), config.consign);
            fs.mkdirSync(config.routesOutput, { recursive: true });
            fs.writeFileSync(config.routesOutput + '/' + key[0].toLocaleLowerCase() + key.slice(1) + '-route.js', routeStringContent);
        }

        if (config.controllersOutput) {
            let controllerStringContent = generateController(val, key[0].toLocaleLowerCase() + key.slice(1), config.models);
            fs.mkdirSync(config.controllersOutput, { recursive: true });
            fs.writeFileSync(config.controllersOutput + '/' + key[0].toLocaleLowerCase() + key.slice(1) + '-controller.js', controllerStringContent);
        }
    }
}

/**
 * @description
 * Generate default routes from the model like the generateFromModel function,
 * but save in .js files
 * Expected params:
 * {
 *  models,
 *  output
 * }
 * @param {Object} config 
 */
exports.generateFileFromModel = (config) => {
    if (!config.models || !config.output) {
        throw 'Missing models or output argument';
    }
    validateReplace(config);

    let obj = generateRouteFromModel(config.models);

    fs.mkdirSync(config.output, { recursive: true });

    for (let [key, val] of Object.entries(obj)) {
        fs.writeFileSync(config.output + '/' + key[0].toLocaleLowerCase() + key.slice(1) + '.js', 'module.exports = ' + util.inspect(val), 'utf-8');
    }
}

/**
 * @description
 * Recieves an array and generate default routes for every name on the array
 * Expected params:
 * {
 *  routes,
 *  output
 * }
 * @param {Object} config 
 */
exports.generateFile = (config) => {
    if (!config.routes || !config.output) {
        throw 'Missing routes or output argument';
    }
    validateReplace(config);

    fs.mkdirSync(config.output, { recursive: true });

    for (let route of config.routes) {
        fs.writeFileSync(config.output + '/' + route + '.js', 'module.exports = ' + util.inspect(returnDefaultRoutes()), 'utf-8');
    }
}