module.exports = (model) => {
    return `
    try {
        var data = await ${model}.findAll({
            attributes: {
                exclude: model.options.exclude
            },
            include: model.options.include
        });
        res.status(200).send(data);
    }
    catch (err) {
        res.status(500).send({
            message: 'Erro inesperado'
        })
    }`
}