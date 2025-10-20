const express = require('express');
const router = express.Router();

const store = require('../data/store');

// --- API Endpoints for Fields ---

// GET / - Get all fields
router.get('/', (req, res) => {
  res.json(store.fields);
});

// GET /:id - Get a single field by ID
router.get('/:id', (req, res) => {
  const fieldId = parseInt(req.params.id, 10);
  const field = store.fields.find(f => f.id === fieldId);
  if (field) {
    res.json(field);
  } else {
    res.status(404).send('Field not found');
  }
});

// POST / - Create a new field
router.post('/', (req, res) => {
  const { farmId, name, crop, areaHa } = req.body;
  if (!farmId || !name || !crop) {
    return res.status(400).send('farmId, name, and crop are required.');
  }
  const newField = {
    id: store.nextFieldId,
    farmId,
    name,
    crop,
    areaHa
  };
  store.fields.push(newField);
  store.nextFieldId++;
  res.status(201).json(newField);
});

// PUT /:id - Update an existing field
router.put('/:id', (req, res) => {
  const fieldId = parseInt(req.params.id, 10);
  const fieldIndex = store.fields.findIndex(f => f.id === fieldId);
  if (fieldIndex !== -1) {
    const updatedField = { ...store.fields[fieldIndex], ...req.body };
    store.fields[fieldIndex] = updatedField;
    res.json(updatedField);
  } else {
    res.status(404).send('Field not found');
  }
});

// DELETE /:id - Delete a field
router.delete('/:id', (req, res) => {
  const fieldId = parseInt(req.params.id, 10);
  const fieldIndex = store.fields.findIndex(f => f.id === fieldId);
  if (fieldIndex !== -1) {
    store.fields.splice(fieldIndex, 1);
    res.status(200).send('Field deleted successfully');
  } else {
    res.status(404).send('Field not found');
  }
});

module.exports = router;