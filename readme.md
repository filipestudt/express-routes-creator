# express-routes-creator

> Generate routes and controllers quickly using a configuration file.


## Usage

```sh
npm install express-routes-creator
```

```js
const expressRoutesCreator = require('express-routes-creator');

expressRoutesCreator(config);
```

The config file
```js
{
    routesPath, // absolute path where the files to generate the routes are
    routesOutputPath // where the routes files will be created
    controllersOutputPath // where the controllers files will be created
    models // the models if using sequelize
    owner // true or false, if will consider the owner field on sequelize
}
```

Example of config 

```js
var config = {
    routesPath: __dirname + '/routes',
    routesOutputPath: './src/routes',
    controllersOutputPath: './src/controllers',
    models: db.models,
    owner: true
}
expressRoutesCreator(config);
```

## Making routes and controllers

To create the routes and controllers the .js files in the routesPath must have the basic informations

```js
module.exports = {
    get: {
        url: '/',
        action: 'get'
    },
    getByAuthor: {
        url: '/:authorId',
        logged: true,
        action: 'getWithParams'
    },
    put: {
        url: '/:id',
        logged: true,
        action: 'put'
    },
    delete: {
        url: '/:id',
        logged: true,
        action: 'delete'
    }
}
```

That would generate this:

```js
// route file
const express = require('express');
const routes = express.Router();
const authService = require('../services/auth-service');
const controller = require('../controllers/post-controller');

routes.get('/', controller.get);
routes.get('/:authorId', authService.authorize, controller.getWithParams);
routes.put('/:id', authService.authorize, controller.put);
routes.delete('/:id', authService.authorize, controller.delete);

module.exports = app => { app.use('/posts', routes); }
```

```js
// controller file
const Post = require('../models/Post');

exports.get = async (req, res, next) => {
    try {
        var data = await Post.findAll({
            attributes: {
                exclude: model.options.exclude
            },
            include: model.options.include
        });
        res.status(200).send(data);
    }
    catch (err) {
        res.status(500).send({
            message: 'Unexpected error'
        })
    }
}

exports.getWithParams = async (req, res, next) => {
    try {
        var data = await Post.findAll({
            attributes: {
                exclude: model.options.exclude
            },
            include: model.options.include,
            where: { ...req.params }
        });
        res.status(200).send(data);
    }
    catch (err) {
        res.status(500).send({
            message: 'Unexpected error'
        })
    }
}

exports.put = async (req, res, next) => {
    try {
        const rows = await Post.update(req.body, {
            individualHooks: true,
            where: {
                authorId = await getUserIdByToken(req, res),
				...req.params
            }
        });

        if (rows[0] > 0) {
            res.status(200).send({ message: 'Successfully edited' });
        }
        else {
            res.status(500).send({ message: "Error at update, the register does not exist or you don't have the permission" });
        }
    }
    catch (err) {
        res.status(500).send({
            message: 'Unexpected error'
        })
    }
}

exports.delete = async (req, res, next) => {
    try {

    }
    catch (err) {

    }
}

```