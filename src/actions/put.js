module.exports = (modelName, model) => {
    var ownerField = '';
    var where = '';

    if (model) {
        for (let [key, value] of Object.entries(model.tableAttributes)) {
            if (value.owner == true) {
                ownerField = key;
                break;
            }
        }
    }

    if (ownerField) {
        where = `${ownerField} = await getUserIdByToken(req, res),\n\t\t\t\t`;
    }


    return `
    try {
        const rows = await ${modelName}.update(req.body, {
            individualHooks: true,
            where: {
                ${where}...req.params
            }
        });

        if (rows[0] > 0) {
            res.status(200).send({ message: 'Successfully edited' });
        }
        else {
            res.status(500).send({ message: "Error at update, the register does not exist or you don't have the permission for this" });
        }
    }
    catch (err) {
        res.status(500).send({
            message: 'Unexpected error'
        })
    }`
}