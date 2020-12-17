module.exports = (route, name, models) => {
    var modelName = '';
    var model = '';
    var content = '';

    if (models) {
        var modelName = name[0].toUpperCase() + name.slice(1);
        var content = `const ${modelName} = require('../models/${modelName}');\n\n`;
        var model = models[modelName];
    }

    for (let [key, val] of Object.entries(route)) {
        let action = require('./actions/' + val.action);
        content += `exports.${val.action} = async (req, res, next) => {`;
        content += action(modelName, model);
        content += `\n}\n\n`;
    }

    return content;
}