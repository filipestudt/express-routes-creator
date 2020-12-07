const fs = require('fs');
const config = require('./config');

var routes = fs.readdirSync(config.routesPath);

for (let route of routes) {
    let foo = require('./' + config.routesPath + route);
    console.log(foo);
}