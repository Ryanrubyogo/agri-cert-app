const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateCertificate(farm, farmer, inspection, certificateData) {
    const doc = new PDFDocument({ margin: 50 });

    // --- To this more robust version ---
    const fileName = `cert-${farm.id}-${Date.now()}.pdf`;
    // Create a robust path to 'public/certificates' from the 'services' directory
    const filePath = path.join(__dirname, '..', 'public', 'certificates', fileName);

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    doc.pipe(fs.createWriteStream(filePath));

    // --- PDF Content ---
    doc.fontSize(25).font('Helvetica-Bold').text('Certificate of Organic Compliance', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica').text('This document certifies that the agricultural operations of:', { align: 'left' });
    doc.moveDown();
    doc.fontSize(16).font('Helvetica-Bold').text(farmer.name, { indent: 20 });
    doc.fontSize(14).font('Helvetica').text(farm.farmName, { indent: 20 });
    doc.fontSize(12).text(farm.location, { indent: 20 });
    doc.moveDown(2);
    doc.text('This certification is granted based on the successful inspection conducted on:');
    doc.font('Helvetica-Bold').text(new Date(inspection.date).toLocaleDateString(), { indent: 20 });
    doc.font('Helvetica').text(`Compliance Score Achieved: ${inspection.complianceScore}%`);
    doc.moveDown(2);
    doc.fontSize(10);
    doc.text(`Certificate Number: ${certificateData.certificateNo}`, { align: 'left' });
    doc.text(`Date of Issue: ${certificateData.issueDate.toLocaleDateString()}`);
    doc.text(`Valid Until: ${certificateData.expiryDate.toLocaleDateString()}`);
    doc.moveDown(3);
    doc.fontSize(12).text('_________________________', { align: 'right' }).text('Authorized Signatory', { align: 'right' });

    doc.end();

    // Return the public URL for the file
    return `/public/certificates/${fileName}`;
}

module.exports = { generateCertificate };