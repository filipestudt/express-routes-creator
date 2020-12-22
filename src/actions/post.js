module.exports = (modelName, model) => {
    var ownerField = '';
    var str = '\n\ttry {';

    if (model) {
        for (let [key, value] of Object.entries(model.tableAttributes)) {
            if (value.owner == true) {
                ownerField = key;
                break;
            }
        }
    }

    if (ownerField) {
        str += `\n\t\treq.body[${ownerField}] = await getUserIdByToken(req, res);`;
    }

    str += `
        const response = await ${modelName}.create(req.body);
        res.status(201).send({
            message: 'Successfully created'
        });
    }
    catch (e) {
        res.status(500).send({
            message: 'Unexpected error'
        })
    }`

    return str;
}