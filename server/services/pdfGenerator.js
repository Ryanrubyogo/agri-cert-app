const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const BRAND_GREEN = '#4CAF50';
const LINE_COLOR = '#DDDDDD';
const TEXT_COLOR = '#1E1E1E';
const MUTED_COLOR = '#555555';

function generateCertificate(farm, farmer, inspection, certificateData) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    const fileName = `cert-${farm.id}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'public', 'certificates', fileName);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    doc.pipe(fs.createWriteStream(filePath));

    // --- PDF Content Generation ---
    generateHeader(doc);
    generateFarmerInfo(doc, farmer, farm);
    generateInspectionDetails(doc, inspection);
    generateCertificationTerms(doc);
    generateFooter(doc, certificateData);

    doc.end();

    return `/public/certificates/${fileName}`;
}

function generateHeader(doc) {
    const logoPath = path.join(__dirname, '..', 'assets', 'logo.svg');
    const logo = fs.readFileSync(logoPath);

    doc.image(logo, 50, 45, { width: 120 });

    doc.fillColor(BRAND_GREEN)
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('Certificate of Organic Compliance', 200, 65, { align: 'right' });

    doc.moveDown(4); // Add space after the header
}

function generateFarmerInfo(doc, farmer, farm) {
    drawSectionLine(doc, doc.y);
    doc.moveDown();

    doc.fillColor(BRAND_GREEN).fontSize(14).font('Helvetica-Bold').text('Certified Farmer & Farm');
    doc.moveDown();

    doc.fillColor(TEXT_COLOR).fontSize(12).font('Helvetica-Bold').text(farmer.name);
    doc.font('Helvetica').text(farm.farmName);
    doc.fillColor(MUTED_COLOR).text(farm.location);

    doc.moveDown(2);
}

function generateInspectionDetails(doc, inspection) {
    drawSectionLine(doc, doc.y);
    doc.moveDown();

    doc.fillColor(BRAND_GREEN).fontSize(14).font('Helvetica-Bold').text('Inspection Details');
    doc.moveDown();

    doc.fillColor(TEXT_COLOR).fontSize(12).font('Helvetica')
       .text('This certification is granted based on the successful inspection conducted on:', { continued: true })
       .font('Helvetica-Bold').text(` ${new Date(inspection.date).toLocaleDateString()}`);
    
    doc.font('Helvetica')
       .text('Compliance Score Achieved: ', { continued: true })
       .font('Helvetica-Bold').text(`${inspection.complianceScore}%`);

    doc.moveDown(2);
}

function generateCertificationTerms(doc) {
    drawSectionLine(doc, doc.y);
    doc.moveDown();

    doc.fillColor(BRAND_GREEN).fontSize(14).font('Helvetica-Bold').text('Certification Terms');
    doc.moveDown();

    doc.fillColor(MUTED_COLOR).fontSize(10).font('Helvetica')
       .text('This certificate confirms that the aforementioned farm complies with the organic standards set forth by PESIRA. This certification is subject to annual review and may be revoked if standards are not maintained. Any use of prohibited substances will result in immediate termination of this certification.', {
           align: 'justify'
       });
}

function generateFooter(doc, certificateData) {
    const pageBottom = doc.page.height - 50;
    drawSectionLine(doc, pageBottom - 20);

    doc.fontSize(10).fillColor(MUTED_COLOR)
       .text(`Certificate Number: ${certificateData.certificateNo}`, 50, pageBottom - 10, { align: 'left' })
       .text(`Date of Issue: ${certificateData.issueDate.toLocaleDateString()}`, 0, pageBottom - 10, { align: 'center' })
       .text(`Valid Until: ${certificateData.expiryDate.toLocaleDateString()}`, 0, pageBottom - 10, { align: 'right' });
}

function drawSectionLine(doc, y) {
    doc.strokeColor(LINE_COLOR)
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(550, y)
       .stroke();
}

module.exports = { generateCertificate };