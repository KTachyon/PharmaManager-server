var express = require('express');
var AuthRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var AuthMiddleware = rekuire('middleware/auth');

AuthRouter.post('/login', Transactional(AuthMiddleware.login));
AuthRouter.get('/session', Transactional(AuthMiddleware.session));
AuthRouter.delete('/logout', Transactional(AuthMiddleware.logout));

module.exports = AuthRouter;
