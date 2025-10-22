// --- Farmers Data ---
const farmers = [
  { id: 1, name: 'Maria Garcia', phone: '555-111-2222', email: 'maria.garcia@example.com', county: 'Fresno' },
  { id: 2, name: 'David Smith', phone: '555-333-4444', email: 'david.smith@example.com', county: 'Kern' }
];
let nextFarmerId = 3;

// --- Farms Data ---
const farms = [
  { id: 1, farmerId: 1, farmName: 'Sunrise Acres', location: 'Central Valley, CA', areaHa: 120 },
  { id: 2, farmerId: 2, farmName: 'Green Pastures Farm', location: 'Bakersfield, CA', areaHa: 250 }
];
let nextFarmId = 3;

// --- Fields Data ---
const fields = [
  { id: 1, farmId: 1, name: 'North Field', crop: 'Almonds', areaHa: 50 },
  { id: 2, farmId: 1, name: 'West Field', crop: 'Grapes', areaHa: 70 },
  { id: 3, farmId: 2, name: 'Main Field', crop: 'Cotton', areaHa: 250 }
];
let nextFieldId = 4;

// --- Inspections Data ---
const inspections = [
  { id: 1, farmId: 1, date: '2023-10-26T10:00:00Z', inspectorName: 'John Doe', status: 'Completed', complianceScore: 90, answers: [ { question: 'Are water sources protected?', answer: 'Yes' } ] }
];
let nextInspectionId = 2;

// --- Certificates Data ---
const certificates = [];
let nextCertificateId = 1;


// Export all data and ID counters
module.exports = {
  farmers, nextFarmerId,
  farms, nextFarmId,
  fields, nextFieldId,
  inspections, nextInspectionId,
  certificates, nextCertificateId 
};