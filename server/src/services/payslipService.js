import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

function generatePayslip(employee) {
    const doc = new PDFDocument({ margin: 30 });

    const filePath = path.join(
        'generated',
        `${employee.Name || 'employee'}-payslip.pdf`,
    );
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(14).text('UNIVERSITY OF AGRICULTURE, FAISALABAD', {
        align: 'center',
        bold: true,
    });
    doc.text('Sub-Campus Burewala-Vehari', { align: 'center' });
    doc.text(
        `Pay Slip - ${employee.Month || 'August'} ${employee.Year || '2025'}`,
        { align: 'center' },
    );
    doc.moveDown();

    // Employee Info
    doc.fontSize(10);
    doc.text(`Name: ${employee.Name || ''}`);
    doc.text(`Designation: ${employee.Designation || ''}`);
    doc.text(`BPS: ${employee.BPS || ''}`);
    doc.text(`CNIC: ${employee.CNIC || ''}`);
    doc.text(`Date of Joining: ${employee.Joining || ''}`);
    doc.moveDown();

    // Pay and Allowances
    doc.fontSize(12).text('Pay and Allowances:', { underline: true });
    doc.fontSize(10);
    const payFields = [
        ['Basic Pay', employee.BasicPay],
        ['House Rent', employee.HouseRent],
        ['Medical Allowance', employee.MedicalAllowance],
        ['Special Allowance', employee.SpecialAllowance],
        ['ARA 2023', employee.ARA2023],
        ['30% ARA 2024', employee.ARA2024],
        ['Total Allowances', employee.TotalAllowances],
    ];
    payFields.forEach(([label, val]) => {
        doc.text(`${label}: ${val || 0}`);
    });

    doc.moveDown();

    // Deductions
    doc.fontSize(12).text('Deductions:', { underline: true });
    doc.fontSize(10);
    const deductions = [
        ['House Rent Allowance', employee.Ded_HouseRent],
        ['Group Insurance Fund', employee.Ded_Insurance],
        ['Benevolent Fund', employee.Ded_Benevolent],
        ['Taxes', employee.Ded_Tax],
        ['Total Deductions', employee.TotalDeductions],
    ];
    deductions.forEach(([label, val]) => {
        doc.text(`${label}: ${val || 0}`);
    });

    doc.moveDown();

    // Summary
    doc.fontSize(11).text(`Gross Pay: ${employee.GrossPay}`);
    doc.text(`Net Pay: ${employee.NetPay}`);
    doc.moveDown();

    doc.fontSize(9).text(
        'This is a system generated document and needs no signature.',
        { align: 'center' },
    );

    doc.end();
    return filePath;
}

export { generatePayslip };
