const express = require('express');
const router = express.Router();

const store = require('../data/store');

// --- API Endpoints for Farms ---

// GET / - Get all farms
router.get('/', (req, res) => {
  res.json(store.farms);
});

// GET /:id - Get a single farm by ID
router.get('/:id', (req, res) => {
  const farmId = parseInt(req.params.id, 10);
  const farm = store.farms.find(f => f.id === farmId);
  if (farm) {
    res.json(farm);
  } else {
    res.status(404).send('Farm not found');
  }
});

// POST / - Create a new farm
router.post('/', (req, res) => {
  const { farmerId, farmName, location, areaHa } = req.body;
  if (!farmerId || !farmName || !location) {
    return res.status(400).send('farmerId, farmName, and location are required.');
  }
  const newFarm = {
    id: store.nextFarmId,
    farmerId,
    farmName,
    location,
    areaHa
  };
  store.farms.push(newFarm);
  store.nextFarmId++;
  res.status(201).json(newFarm);
});

// PUT /:id - Update an existing farm
router.put('/:id', (req, res) => {
  const farmId = parseInt(req.params.id, 10);
  const farmIndex = store.farms.findIndex(f => f.id === farmId);
  if (farmIndex !== -1) {
    const updatedFarm = { ...store.farms[farmIndex], ...req.body };
    store.farms[farmIndex] = updatedFarm;
    res.json(updatedFarm);
  } else {
    res.status(404).send('Farm not found');
  }
});

// DELETE /:id - Delete a farm
router.delete('/:id', (req, res) => {
  const farmId = parseInt(req.params.id, 10);
  const farmIndex = store.farms.findIndex(f => f.id === farmId);
  if (farmIndex !== -1) {
    store.farms.splice(farmIndex, 1);
    res.status(200).send('Farm deleted successfully');
  } else {
    res.status(404).send('Farm not found');
  }
});


// --- Relational Endpoint ---

// GET /:farmId/fields - Get all fields for a specific farm
router.get('/:farmId/fields', (req, res) => {
    const farmId = parseInt(req.params.farmId, 10);
    const associatedFields = store.fields.filter(field => field.farmId === farmId);
    
    // It's good practice to check if the farm itself exists
    const farmExists = store.farms.some(farm => farm.id === farmId);
    if (!farmExists) {
        return res.status(404).send('Farm not found');
    }

    res.json(associatedFields);
});

// GET /:farmId/inspections - Get all inspections for a specific farm
router.get('/:farmId/inspections', (req, res) => {
    const farmId = parseInt(req.params.farmId, 10);
    const associatedInspections = store.inspections.filter(inspection => inspection.farmId === farmId);
    
    // It's good practice to check if the farm itself exists
    const farmExists = store.farms.some(farm => farm.id === farmId);
    if (!farmExists) {
        return res.status(404).send('Farm not found');
    }

    res.json(associatedInspections);
});

// GET /:farmId/certificates - Get all certificates for a specific farm
router.get('/:farmId/certificates', (req, res) => {
    const farmId = parseInt(req.params.farmId, 10);
    const associatedCertificates = store.certificates.filter(cert => cert.farmId === farmId);
    
    const farmExists = store.farms.some(farm => farm.id === farmId);
    if (!farmExists) {
        return res.status(404).send('Farm not found');
    }

    res.json(associatedCertificates);
});

module.exports = router;