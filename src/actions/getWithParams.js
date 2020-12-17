module.exports = (model) => {
    return `
    try {
        var data = await ${model}.findAll({            
            where: { ...req.params }
        });
        res.status(200).send(data);
    }
    catch (err) {
        res.status(500).send({
            message: 'Unexpected error'
        })
    }`
}