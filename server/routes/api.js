const express = require('express');
const router = express.Router();

// Import the routers
const farmersRouter = require('./farmers.routes.js');
const farmsRouter = require('./farms.routes.js'); 
const fieldsRouter = require('./fields.routes.js');
const inspectionsRouter = require('./inspections.routes.js');
const certificatesRouter = require('./certificates.routes.js');

// Delegate requests to the specific routers
router.use('/farmers', farmersRouter);
router.use('/farms', farmsRouter);
router.use('/fields', fieldsRouter);
router.use('/inspections', inspectionsRouter);
router.use('/certificates', certificatesRouter);

module.exports = router;