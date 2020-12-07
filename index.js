const fs = require('fs');
const config = require('./config');
const generateRoute = require('./src/generateRoute');
const generateController = require('./src/generateController');

var routes = fs.readdirSync(config.routesPath);

for (let route of routes) {
    let routeObj = require('./' + config.routesPath + route);
    let routeStringContent = generateRoute(routeObj, route.replace('.js', ''));
    let controllerStringContent = generateController(routeObj, route.replace('.js', ''));
    fs.writeFileSync('./' + config.routesOutputPath + '/' + route.replace('.js', '-route.js'), routeStringContent);
    fs.writeFileSync('./' + config.controllersOutputPath + '/' + route.replace('.js', '-controller.js'), controllerStringContent);
}