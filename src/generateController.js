module.exports = (route, name) => {
    var model = name[0].toUpperCase() + name.slice(1);
    var content = `const ${model} = require('../models/${model}');\n\n`;

    for (let [key, val] of Object.entries(route)) {
        let action = require('./actions/' + val.action);
        content += `exports.${val.action} = async (req, res, next) => {`;
        content += action(model);
        content += `\n}\n\n`;
    }

    return content;
}