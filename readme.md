# express-routes-creator

> Generate routes and controllers quickly using a configuration file.\
> Made to be used with sequelize.\
> To use in other contexts edit the actions.

# Table of contents

* [Usage](#usage)
* [Methods Detailed](#methods-detailed)
    * [Generate From File](#generate-from-file)
    * [Generate From Model](#generate-from-model)
    * [Generate File](#generate-file)
    * [Generate File From Model](#generate-file-from-model)
* [Parameters Explained](#parameters-explained)
* [Usage Examples](#usage-examples)

This documentation is still a working in progress.

# Usage

```sh
npm install express-routes-creator
```

```js
const expressRoutesCreator = require('express-routes-creator');

expressRoutesCreator.generateFromFile({
    // absolute path where the files to generate the routes are
    filesPath, 
    // relative path output where the routes files will be created (optional)
    // you can pass only the routesOutput to generate only the routes
    // or only the controllersOutput to only generate the controllers
    // or either the two arguments
    routesOutput, 
    // relative path output where the controllers files will be created (optional)    
    controllersOutput, 
    // the models attribute of the sequelize instance object (optional)
    // only used to generate controllers
    models, 
    //boolean argument to generate the routes file ready to import using the consign module (optional, false by default)
    consign, 
    //boolean argument to replace the files in the output folder (optional)
    replace
})

expressRoutesCreator.generateFromModel({
    models,
    routesOutput,
    controllersOutput,
    consign, 
    replace
})

expressRoutesCreator.generateFile({
    routes, //array
    output
})

expressRoutesCreator.generateFileFromModel({
    models,
    output
})
```
See more about the parameters [here](#parameters-explained).

# Methods Detailed 

## Generate From File

Generates using a javascript config file

```js
const expressRoutesCreator = require('express-routes-creator');

expressRoutesCreator.generateFromFile({
    // absolute path where the configuration files to generate the routes are
    filesPath: __dirname + '/routes', 
    // relative path output where the routes files will be created (optional)
    // you can pass only the routesOutput to generate only the routes
    // or only the controllersOutput to only generate the controllers
    // or either the two arguments
    routesOutput: 'src/routes', 
    // relative path output where the controllers files will be created (optional)   
    controllersOutput: 'src/controllers', 
    // the models attribute of the sequelize instance object (optional)
    // only used to generate controllers
    models: db.models, 
    //boolean argument to generate the routes file ready to import using the consign module (optional, false by default)
    consign: true, 
    ///boolean argument to replace the files in the output folder (optional)
    replace: false 
})
```
Example of the configuration file that generates the routes:
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
The action refer to a file that generates a generic controller using the models name.

## Generate From Model
Generates using sequelize models

```js
const expressRoutesCreator = require('express-routes-creator');

expressRoutesCreator.generateFromModel({
    models: db.models, // the models attribute of the sequelize instance object
    routesOutput: 'src/routes',
    controllersOutput: 'src/controllers', 
    consign: false, //optional
    replace: false //optional
})
```

The db variable in this example is the return of the sequelize connection object and after all models are loaded, so the application can read the tabble attributes from the models.

## Generate File
Generates configuration files with default routes to make easier to start

```js
const expressRoutesCreator = require('express-routes-creator');

expressRoutesCreator.generateFile({
    routes: ['user', 'post'], //array
    output: 'src/output'
})
```

This example generates two files: user.js, post.js
```js
//users.js
module.exports = {
  get: { url: '/', method: 'get', action: 'get' },
  post: { url: '/', method: 'post', action: 'post' },
  put: { url: '/:id', method: 'put', action: 'put' },
  delete: { url: '/:id', method: 'delete', action: 'delete' }
}
```
Now this files could be used to generate the routes and controllers, and you can edit they to generate custom routes.


## Generate File From Model

```js
const expressRoutesCreator = require('express-routes-creator');

expressRoutesCreator.generateFileFromModel({
    models: db.models, // the models attribute of the sequelize instance object
    output: 'src/output'
})
```

# Parameters explained

## Consign

If is true the routes file will have the module.exports ready for be imported using the Consign module

```js
module.exports = app => { app.use('/users', routes); }
```

## Replace

When passing a output folder that is not empty as argument, the program will throw a exception to protect those files, so if you are sure that you want to replace the files inside the folder, then you can pass the replace argument as true.

# Usage examples

## Generating from file

To create the routes and controllers the .js files in the routesPath must have this basic informations:

```js
// post.js
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

When using the generateFromFile method:

```js
const expressRoutesCreator = require('express-routes-creator');

expressRoutesCreator.generateFromFile({
    filesPath, 
    routesOutput,   
    controllersOutput, 
    models
})
```

The result will be this:

```js
// post-route.js
const express = require('express');
const routes = express.Router();
const authService = require('../services/auth-service');
const controller = require('../controllers/post-controller');

routes.get('/', controller.get);
routes.get('/:authorId', authService.authorize, controller.getWithParams);
routes.put('/:id', authService.authorize, controller.put);
routes.delete('/:id', authService.authorize, controller.delete);

module.exports = routes;
```

```js
// post-controller.js
const Post = require('../models/Post');

exports.get = async (req, res, next) => {
    try {
        var data = await Post.findAll();
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

exports.post = async (req, res, next) => {
	try {
		req.body[authorId] = await getUserIdByToken(req, res);
        const response = await Post.create(req.body);
        res.status(201).send({
            message: 'Successfully created'
        });
    }
    catch (e) {
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
            res.status(500).send({ message: "Error at update, the register does not exist or you don't have the permission for this" });
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
        const rows = await Post.destroy(req.body, {  
            where: {
                authorId = await getUserIdByToken(req, res),
				...req.params
            }
        });

        if (rows > 0) {
            res.status(200).send({ message: 'Successfully deleted' });
        }
        else {
            res.status(500).send({ message: "Error while deleting, the register does not exist or you don't have the permission for this" });
        }
    }
    catch (err) {
        res.status(500).send({
            message: 'Unexpected error'
        })
    }
}
```

## How to edit the controllers code

The action attribute used on the route generation file refer to a action in ./src/actions, you can edit those files or create new actions to suit your needs