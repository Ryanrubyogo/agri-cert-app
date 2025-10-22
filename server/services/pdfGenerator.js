const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// --- Centralized Design System ---
const THEME = {
    colors: {
        primary: '#4CAF50', // Brand Green
        text: '#1E1E1E',    // Dark text for high contrast
        muted: '#555555',   // Lighter text for secondary info
        line: '#DDDDDD'     // Light grey for dividers
    },
    fonts: {
        bold: 'Helvetica-Bold',
        regular: 'Helvetica'
    },
    fontSizes: {
        h1: 20, // Main certificate title
        h2: 14, // Section titles
        body: 12, // Main content text
        small: 10 // Footer and metadata
    },
    layout: {
        margin: 50,
        contentWidth: 595.28 - (50 * 2) // A4 width minus margins
    }
};

function generateCertificate(farm, farmer, inspection, certificateData) {
    const doc = new PDFDocument({ size: 'A4', margin: THEME.layout.margin });

    const fileName = `cert-${farm.id}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'public', 'certificates', fileName);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    doc.pipe(fs.createWriteStream(filePath));

    // --- PDF Content Generation ---
    generateHeader(doc, certificateData);
    generateFarmerInfo(doc, farmer, farm);
    generateInspectionDetails(doc, inspection);
    generateCertificationTerms(doc);
    generateInspectorSignature(doc, inspection);

    doc.end();

    return `/public/certificates/${fileName}`;
}

function generateHeader(doc, certificateData) {
    const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
    
    doc.image(logoPath, THEME.layout.margin, 45, { width: 120 });

    doc.fillColor(THEME.colors.primary)
       .fontSize(THEME.fontSizes.h1)
       .font(THEME.fonts.bold)
       .text('Certificate of Organic Compliance', { align: 'right' });

    doc.moveDown(0.5);

    doc.fillColor(THEME.colors.muted)
       .fontSize(THEME.fontSizes.small)
       .font(THEME.fonts.regular)
       .text(`Certificate No: ${certificateData.certificateNo}`, { align: 'right' });
       
    doc.text(`Valid Until: ${certificateData.expiryDate.toLocaleDateString()}`, { align: 'right' });

    doc.y = 150; // Set a consistent starting point for the content below the header
}

function generateFarmerInfo(doc, farmer, farm) {
    drawSectionLine(doc, doc.y);
    doc.moveDown(2);

    doc.fillColor(THEME.colors.primary).fontSize(THEME.fontSizes.h2).font(THEME.fonts.bold).text('Certified Farmer & Farm');
    doc.moveDown();

    doc.fillColor(THEME.colors.text).fontSize(THEME.fontSizes.body).font(THEME.fonts.bold).text(farmer.name);
    doc.font(THEME.fonts.regular).text(farm.farmName);
    doc.fillColor(THEME.colors.muted).text(farm.location);

    doc.moveDown(2);
}

function generateInspectionDetails(doc, inspection) {
    drawSectionLine(doc, doc.y);
    doc.moveDown(2);

    doc.fillColor(THEME.colors.primary).fontSize(THEME.fontSizes.h2).font(THEME.fonts.bold).text('Inspection Details');
    doc.moveDown();

    doc.fillColor(THEME.colors.text).fontSize(THEME.fontSizes.body).font(THEME.fonts.regular)
       .text('This certification is granted based on the successful inspection conducted on: ', { continued: true })
       .font(THEME.fonts.bold).text(`${new Date(inspection.date).toLocaleDateString()}`);
    
    doc.moveDown(0.5);

    doc.font(THEME.fonts.regular)
       .text('Compliance Score Achieved: ', { continued: true })
       .font(THEME.fonts.bold).text(`${inspection.complianceScore}%`);

    doc.moveDown(2);
}

function generateCertificationTerms(doc) {
    drawSectionLine(doc, doc.y);
    doc.moveDown(2);
    doc.fillColor(THEME.colors.primary).fontSize(THEME.fontSizes.h2).font(THEME.fonts.bold).text('Certification Terms');
    doc.moveDown();
    doc.fillColor(THEME.colors.muted).fontSize(THEME.fontSizes.small).font(THEME.fonts.regular)
       .text('This certificate confirms that the aforementioned farm complies with the organic standards set forth by PESIRA. This certification is subject to annual review and may be revoked if standards are not maintained. Any use of prohibited substances will result in immediate termination of this certification.', {
           align: 'justify'
       });
}

function generateInspectorSignature(doc, inspection) {
    const sectionStartY = doc.y > 600 ? doc.y : 600; // Ensure signature block is near the bottom
    drawSectionLine(doc, sectionStartY);
    doc.y = sectionStartY;
    doc.moveDown(2);

    // Section Title
    doc.fillColor(THEME.colors.primary).fontSize(THEME.fontSizes.h2).font(THEME.fonts.bold).text('Inspector\'s Attestation');
    doc.moveDown(3);

    const signatureY = doc.y;
    const badgePath = path.join(__dirname, '..', 'assets', 'certified-organic-badge.jpg');

    // Left side: Signature Line and Text
    const signatureX = THEME.layout.margin;
    
    // Change 1: Use muted color for the signature line
    doc.strokeColor(THEME.colors.muted) 
       .lineWidth(1)
       .moveTo(signatureX, signatureY + 20)
       .lineTo(signatureX + 250, signatureY + 20)
       .stroke();
       
    // Change 2: Use a static placeholder for the inspector name
    doc.fillColor(THEME.colors.text).fontSize(THEME.fontSizes.body).font(THEME.fonts.regular)
      .text('Inspector: Douglas Kibe', signatureX, signatureY + 28);
    // Right side: Badge
    const badgeX = doc.page.width - THEME.layout.margin - 160;
    doc.image(badgePath, badgeX, signatureY - 40, {
        width: 160
    });
}


function drawSectionLine(doc, y) {
    doc.strokeColor(THEME.colors.line)
       .lineWidth(1)
       .moveTo(THEME.layout.margin, y)
       .lineTo(doc.page.width - THEME.layout.margin, y)
       .stroke();
}

module.exports = { generateCertificate };