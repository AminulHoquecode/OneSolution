import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function resizePDF(file: File, scale: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.setSize(width * scale, height * scale);
  });

  return await pdfDoc.save();
}

export async function editPDFText(
  file: File,
  textOperations: Array<{
    pageIndex: number;
    text: string;
    x: number;
    y: number;
    fontSize?: number;
    remove?: boolean;
  }>
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const op of textOperations) {
    const page = pdfDoc.getPage(op.pageIndex);
    if (!op.remove) {
      page.drawText(op.text, {
        x: op.x,
        y: op.y,
        size: op.fontSize || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
    // Note: For text removal, we would need to implement a more complex solution
    // as PDF-lib doesn't directly support text removal
  }

  return await pdfDoc.save();
}

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

export async function imagesToPDF(images: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const image of images) {
    const arrayBuffer = await image.arrayBuffer();
    let embedImage;
    
    if (image.type === 'image/jpeg') {
      embedImage = await pdfDoc.embedJpg(arrayBuffer);
    } else if (image.type === 'image/png') {
      embedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      throw new Error('Unsupported image format');
    }

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const scale = Math.min(width / embedImage.width, height / embedImage.height);

    page.drawImage(embedImage, {
      x: (width - embedImage.width * scale) / 2,
      y: (height - embedImage.height * scale) / 2,
      width: embedImage.width * scale,
      height: embedImage.height * scale,
    });
  }

  return await pdfDoc.save();
} 