const request = require('supertest');
const app = require('../index');
const store = require('../data/store'); // We now import the REAL store
const pdfGenerator = require('../services/pdfGenerator');

// We still mock the PDF generator because we don't want to create real files
jest.mock('../services/pdfGenerator');

// --- NEW: Add a cleanup step to run after each test ---
// This is a best practice to restore all spies and mocks.
afterEach(() => {
  jest.restoreAllMocks();
});
// --------------------------------------------------------

describe('POST /api/inspections/:inspectionId/approve', () => {
  test('should return 403 Forbidden if compliance score is below 80', async () => {
    const mockInspection = { id: 1, farmId: 1, complianceScore: 50 };
    
    // --- CHANGE: Use jest.spyOn() to mock the .find method ---
    jest.spyOn(store.inspections, 'find').mockReturnValue(mockInspection);

    const response = await request(app).post('/api/inspections/1/approve');

    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('Compliance score too low for certification.');
  });

  test('should return 201 Created and a certificate if score is 80 or higher', async () => {
    const mockInspection = { id: 2, farmId: 1, complianceScore: 95 };
    const mockFarm = { id: 1, farmerId: 1 };
    const mockFarmer = { id: 1 };
    
    // --- CHANGE: Use jest.spyOn() for all .find methods ---
    jest.spyOn(store.inspections, 'find').mockReturnValue(mockInspection);
    jest.spyOn(store.farms, 'find').mockReturnValue(mockFarm);
    jest.spyOn(store.farmers, 'find').mockReturnValue(mockFarmer);

    // We can still manipulate the store directly for simple values
    store.certificates = [];
    store.nextCertificateId = 1;
    pdfGenerator.generateCertificate.mockReturnValue('/public/fake-cert.pdf');

    const response = await request(app).post('/api/inspections/2/approve');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id', 1);
    expect(pdfGenerator.generateCertificate).toHaveBeenCalled();
  });
});