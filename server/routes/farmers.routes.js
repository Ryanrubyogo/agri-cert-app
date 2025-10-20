const express = require('express');
const router = express.Router();

// Import the in-memory data store
const store = require('../data/store');

// --- API Endpoints for Farmers ---

// GET / - Get all farmers (Note: path is now relative to '/farmers')
router.get('/', (req, res) => {
  res.json(store.farmers);
});

// GET /:id - Get a single farmer by ID
router.get('/:id', (req, res) => {
  const farmerId = parseInt(req.params.id, 10);
  const farmer = store.farmers.find(f => f.id === farmerId);

  if (farmer) {
    res.json(farmer);
  } else {
    res.status(404).send('Farmer not found');
  }
});

// POST / - Create a new farmer
router.post('/', (req, res) => {
  const { name, phone, email, county } = req.body;

  if (!name || !county) {
    return res.status(400).send('Name and county are required.');
  }

  const newFarmer = {
    id: store.nextFarmerId,
    name,
    phone,
    email,
    county
  };

  store.farmers.push(newFarmer);
  store.nextFarmerId++;

  res.status(201).json(newFarmer);
});

// PUT /:id - Update an existing farmer
router.put('/:id', (req, res) => {
  const farmerId = parseInt(req.params.id, 10);
  const farmerIndex = store.farmers.findIndex(f => f.id === farmerId);

  if (farmerIndex !== -1) {
    const updatedFarmer = { ...store.farmers[farmerIndex], ...req.body };
    store.farmers[farmerIndex] = updatedFarmer;
    res.json(updatedFarmer);
  } else {
    res.status(404).send('Farmer not found');
  }
});

// DELETE /:id - Delete a farmer
router.delete('/:id', (req, res) => {
  const farmerId = parseInt(req.params.id, 10);
  const farmerIndex = store.farmers.findIndex(f => f.id === farmerId);

  if (farmerIndex !== -1) {
    store.farmers.splice(farmerIndex, 1);
    res.status(200).send('Farmer deleted successfully');
  } else {
    res.status(404).send('Farmer not found');
  }
});

// --- Relational Endpoint ---

// GET /:farmerId/farms - Get all farms for a specific farmer
router.get('/:farmerId/farms', (req, res) => {
    const farmerId = parseInt(req.params.farmerId, 10);
    const associatedFarms = store.farms.filter(farm => farm.farmerId === farmerId);

    // Good practice: check if the farmer exists
    const farmerExists = store.farmers.some(farmer => farmer.id === farmerId);
    if (!farmerExists) {
        return res.status(404).send('Farmer not found');
    }

    res.json(associatedFarms);
});

// Export the router
module.exports = router;