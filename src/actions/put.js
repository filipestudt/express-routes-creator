module.exports = (modelName, model) => {
    var ownerField = '';
    var where = `${ownerField} = await getUserIdByToken(req, res),\n\t\t\t\t`;

    /**
     * Busca qual é o atributo owner=true do model
     * O owner é o usuário logado, por isso pega o id a partir do token
     */
    for (let [key, value] of Object.entries(model.tableAttributes)) {
        if (value.owner == true) {
            ownerField = key;
            break;
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
            res.status(200).send({ message: 'Editado com sucesso' });
        }
        else {
            res.status(500).send({ message: 'Erro ao editar, o registro não existe ou você não tem permissão' });
        }
    }
    catch (err) {
        res.status(500).send({
            message: 'Erro inesperado'
        })
    }`
}