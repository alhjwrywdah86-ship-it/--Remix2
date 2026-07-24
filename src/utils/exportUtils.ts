import pptxgen from "pptxgenjs";

/**
 * Trigger native print dialog with beautifully formatted RTL stylesheet
 */
export function printContent(title: string, contentHtml: string) {
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة للتمكن من طباعة التقرير.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Cairo', sans-serif;
          margin: 0;
          padding: 24px;
          color: #1A365D;
          background: #ffffff;
          direction: rtl;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #C5A021;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 22px;
          margin: 0 0 4px 0;
          color: #1A365D;
        }
        .header p {
          font-size: 12px;
          color: #64748B;
          margin: 0;
        }
        .section {
          margin-bottom: 18px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #1A365D;
          border-right: 4px solid #C5A021;
          padding-right: 8px;
          margin-bottom: 8px;
          background: #F8FAFC;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #CBD5E1;
          padding: 8px;
          text-align: right;
          font-size: 13px;
        }
        th {
          background-color: #1A365D;
          color: #ffffff;
        }
        .question-box {
          border: 1px dashed #94A3B8;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 6px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 11px;
          color: #94A3B8;
          border-top: 1px solid #E2E8F0;
          padding-top: 10px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>الجمهورية اليمنية - منصة المعلم العربي المحترف | إشراف بيداغوجي هادئ</p>
      </div>
      <div>
        ${contentHtml}
      </div>
      <div class="footer">
        تم التوليد والتصدير عبر منصة المعلم العربي المحترف © ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/**
 * Export HTML document to Word (.doc) with full Arabic RTL formatting
 */
export function exportToWord(filename: string, title: string, contentHtml: string) {
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'>
  <head>
    <meta charset='utf-8'>
    <title>${title}</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, 'Arial', sans-serif; direction: rtl; text-align: right; }
      h1, h2, h3 { color: #1A365D; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #cccccc; padding: 8px; text-align: right; }
      th { background-color: #1A365D; color: #ffffff; }
    </style>
  </head>
  <body>
    <div style="text-align: center; border-bottom: 2px solid #C5A021; padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="color: #1A365D;">${title}</h1>
      <p style="color: #64748B; font-size: 12px;">منصة المعلم العربي المحترف</p>
    </div>
    ${contentHtml}
  </body>
  </html>`;

  const blob = new Blob(["\ufeff" + header], {
    type: "application/msword;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename.replace(/\s+/g, "_")}_${Date.now()}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export lesson plan slides or presentations to PowerPoint (.pptx)
 */
export async function exportToPptx(
  filename: string,
  title: string,
  slides: { slideTitle: string; slideContent: string[] }[]
) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  (pres as any).rtl = true;

  // Title Slide
  const titleSlide = pres.addSlide();
  titleSlide.background = { color: "1A365D" };
  titleSlide.addText(title, {
    x: "10%",
    y: "35%",
    w: "80%",
    h: "20%",
    fontSize: 32,
    bold: true,
    color: "C5A021",
    align: "center"
  });
  titleSlide.addText("منصة المعلم العربي المحترف - تحضير رقمي تفاعلي", {
    x: "10%",
    y: "60%",
    w: "80%",
    h: "10%",
    fontSize: 16,
    color: "FFFFFF",
    align: "center"
  });

  // Content Slides
  slides.forEach((slideData, idx) => {
    const slide = pres.addSlide();
    slide.background = { color: "F8FAFC" };

    // Slide Header
    slide.addText(`${idx + 1}. ${slideData.slideTitle}`, {
      x: "5%",
      y: "8%",
      w: "90%",
      h: "12%",
      fontSize: 22,
      bold: true,
      color: "1A365D",
      align: "right"
    });

    const bodyText = slideData.slideContent.map((point) => `• ${point}`).join("\n\n");
    slide.addText(bodyText, {
      x: "5%",
      y: "25%",
      w: "90%",
      h: "65%",
      fontSize: 16,
      color: "334155",
      align: "right",
      valign: "top"
    });
  });

  await pres.writeFile({ fileName: `${filename.replace(/\s+/g, "_")}.pptx` });
}
