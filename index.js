const fs = require('fs');
const config = require('./config');
const generateRoute = require('./src/generateRoute');

var routes = fs.readdirSync(config.routesPath);

for (let route of routes) {
    let routeObj = require('./' + config.routesPath + route);
    let routeStringContent = generateRoute(routeObj, route.replace('.js', ''));
    fs.writeFileSync('./' + config.outputPath + '/' + route.replace('.js', '-route.js'), routeStringContent);
}