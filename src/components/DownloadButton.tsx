import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  elementId: string;
  fileName: string;
}

export default function DownloadButton({ elementId, fileName }: DownloadButtonProps) {
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownload = async () => {
    setIsCompiling(true);

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Download error: Element #${elementId} not found.`);
      setIsCompiling(false);
      return;
    }

    try {
      // 1. Render element to high-DPI canvas
      const canvas = await html2canvas(element, {
        scale: 2, // crisp texts and shapes
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        windowWidth: 1200, // lock width for consistent column rendering
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // 2. Initialize jsPDF standard A4 format (210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // 3. Render page 1
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // 4. Render subsequent pages if content overflows A4 height
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // shift upward
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      // 5. Save the generated file
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF document:", error);
      alert("Something went wrong while compiling the PDF. Please try again.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isCompiling}
      className={`px-8 py-3 rounded-2xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
        isCompiling
          ? 'bg-slate-700 text-white shadow-slate-700/10'
          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
      }`}
    >
      {isCompiling ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Compiling PDF Document...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download My Diet Plan (PDF)
        </>
      )}
    </button>
  );
}
