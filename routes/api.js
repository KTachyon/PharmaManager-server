var rekuire = require('rekuire');
var express = require('express');
var router = express.Router();

var APIMiddleware = rekuire('middleware/api');

// Cross domain middleware, to support cross domain requests (if the API is in a different domain)
router.use(APIMiddleware.setupCrossDomain);
router.use(APIMiddleware.transaction);

router.use('/patients', rekuire('routes/patients'));
router.use('/drugs', rekuire('routes/drugs'));
router.use('/stock', rekuire('routes/drugStock'));

router.use(APIMiddleware.unhandledRequest);

module.exports = router;
