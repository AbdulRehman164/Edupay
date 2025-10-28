import fs from 'fs';
import path from 'path';
import html_to_pdf from 'html-pdf-node';

export async function generatePayslip(data, outputPath) {
    const templatePath = path.join(
        process.cwd(),
        'templates',
        'payslipTemplate.html',
    );
    let html = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders {{key}} with actual data
    //for (const key in data) {
    //    html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    //}

    //const file = { content: html };
    const file = { content: '<h1>My Test Pdf File</h1>' };
    const options = {
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm' },
    };

    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    fs.writeFileSync(path.join(outputPath, 'payslip.pdf'), pdfBuffer);

    console.log(`PDF generated: ${outputPath}`);
}
