import PDFDocument from 'pdfkit';

export const gerarPDF = (res, titulo, colunas, dados) => {

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${titulo}.pdf`);

    doc.pipe(res);

    const corPrimaria = '#1a1a2e';
    const corSecundaria = '#f5f5f5';

    doc.rect(0, 0, 650, 80).fill(corPrimaria);
    doc.fillColor('white').fontSize(24).text('ProntosPvidaSys', 0, 28, { align: 'center' });

    doc.moveDown(4);
    doc.fillColor('black').fontSize(18).text(titulo.replaceAll('_', ' '), { align: 'center' });
    doc.moveDown(2);

    const tableTop = doc.y;
    const tableWidth = 520;
    const colWidth = tableWidth / colunas.length;
    let y = tableTop;

    doc.rect(40, y, tableWidth, 25).fill(corPrimaria);
    doc.fillColor('white').fontSize(10);

    colunas.forEach((coluna, i) => {
        doc.text(coluna, 45 + (i * colWidth), y + 7, { width: colWidth - 10, align: 'left' });
    });

    y += 25;

    dados.forEach((linha, index) => {
        if (index % 2 === 0) {
            doc.rect(40, y, tableWidth, 25).fill(corSecundaria);
        }

        doc.fillColor('black').fontSize(9);

        const valores = Array.isArray(linha) ? linha : Object.values(linha);

        valores.forEach((valor, i) => {
            if (
                typeof valor === 'number' && (
                    colunas[i].toLowerCase().includes('valor') ||
                    colunas[i].toLowerCase().includes('preço') ||
                    colunas[i].toLowerCase().includes('total')
                )
            ) {
                valor = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }

            doc.text(String(valor ?? ''), 45 + (i * colWidth), y + 7, { width: colWidth - 10, align: 'left' });
        });

        y += 25;

        if (y > 720) {
            doc.addPage();
            y = 50;
        }
    });

    doc.moveDown(3);
    doc.fillColor('gray').fontSize(10);
    doc.text(`Total de registros: ${dados.length}`, 40);

    doc.end();
};