const fs = require('fs');

function checkFolderForFiles(folder) {
    try {
        var files = fs.readdirSync(folder);
        return files.length > 0;
    } catch (err) {
        return false;
    }
}

module.exports = (config) => {
    if (config.routesOutput && checkFolderForFiles(config.routesOutput) && !config.replace) {
        throw `The folder '${config.routesOutput}' have files inside and this action could replace they ` +
        `making you lose all your work.\n` +
        `If you are sure that you want to replace they, please pass replace as true with the config parameters: ` +
        `{replace: true}`;
    }
    if (config.controllersOutput && checkFolderForFiles(config.controllersOutput) && !config.replace) {
        throw `The folder '${config.controllersOutput}' have files inside and this action could replace they ` +
        `making you lose all your work.\n` +
        `If you are sure that you want to replace they, please pass replace as true with the config parameters: ` +
        `{replace: true}`;
    }
    if (config.output && checkFolderForFiles(config.output) && !config.replace) {
        throw `The folder '${config.output}' have files inside and this action could replace they ` +
        `making you lose all your work.\n` +
        `If you are sure that you want to replace they, please pass replace as true with the config parameters: ` +
        `{replace: true}`;
    }
}