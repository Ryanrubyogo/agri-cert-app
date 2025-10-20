const { generateCertificate } = require('../services/pdfGenerator');


const express = require('express');
const router = express.Router();

const store = require('../data/store');

// GET / - Get all inspections (for verification)
router.get('/', (req, res) => {
  res.json(store.inspections);
});

// POST / - Create a new inspection
router.post('/', (req, res) => {
  const { farmId, inspectorName, answers } = req.body;

  // Basic validation
  if (!farmId || !inspectorName || !answers || !Array.isArray(answers)) {
    return res.status(400).send('farmId, inspectorName, and a valid answers array are required.');
  }

  // --- Compliance Score Logic ---
  const yesAnswers = answers.filter(a => a.answer.toLowerCase() === 'yes').length;
  const totalQuestions = answers.length;
  const complianceScore = totalQuestions > 0 ? Math.round((yesAnswers / totalQuestions) * 100) : 0;
  // --- End of Logic ---

  const newInspection = {
    id: store.nextInspectionId,
    farmId: parseInt(farmId, 10),
    date: new Date().toISOString(), // Use current date
    inspectorName,
    status: 'Submitted', // Default status
    complianceScore,
    answers
  };

  store.inspections.push(newInspection);
  store.nextInspectionId++;

  res.status(201).json(newInspection);
});


// POST /:inspectionId/approve - Approve an inspection and generate a certificate
router.post('/:inspectionId/approve', (req, res) => {
  const inspectionId = parseInt(req.params.inspectionId, 10);
  const inspection = store.inspections.find(i => i.id === inspectionId);

  if (!inspection) {
    return res.status(404).send('Inspection not found');
  }

  if (inspection.complianceScore < 80) {
    return res.status(403).send('Compliance score too low for certification.');
  }

  // --- Improved Data Finding Logic ---
  const farm = store.farms.find(f => f.id === inspection.farmId);
  if (!farm) {
    return res.status(404).send('Associated farm not found.');
  }
  const farmer = store.farmers.find(f => f.id === farm.farmerId);
  if (!farmer) {
    return res.status(404).send('Associated farmer not found.');
  }
  // --- End of Improvement ---

  const issueDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(issueDate.getFullYear() + 1);

  const newCertificateData = {
    id: store.nextCertificateId,
    farmId: farm.id,
    certificateNo: `CERT-${farm.id}-${issueDate.getFullYear()}`,
    issueDate: issueDate,
    expiryDate: expiryDate,
  };
  
  const pdfUrl = generateCertificate(farm, farmer, inspection, newCertificateData);
  
  const finalCertificate = {
      ...newCertificateData,
      pdfUrl: pdfUrl
  };

  store.certificates.push(finalCertificate);
  store.nextCertificateId++;
  inspection.status = 'Completed';

  res.status(201).json(finalCertificate);
});

module.exports = router;