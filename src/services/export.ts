import jsPDF from 'jspdf';
import { SwapLogEntry, User } from '@/types/models';
import { formatDate } from '@/utils/date';

export function exportSwapSummaryPdf(user: User, entries: SwapLogEntry[]) {
  const pdf = new jsPDF();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('HobbySwap Progress Summary', 20, 20);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Member: ${user.displayName}`, 20, 32);
  pdf.text(`Location: ${user.location.city}`, 20, 40);
  pdf.text(`Hours shared: ${entries.reduce((sum, entry) => sum + entry.hours, 0)}`, 20, 48);

  let y = 62;
  entries.slice(0, 10).forEach((entry) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(entry.title, 20, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${entry.type} • ${entry.hours}h • ${formatDate(entry.happenedAt)}`, 20, y + 8);
    y += 18;
  });

  pdf.save(`hobbyswap-summary-${user.displayName.toLowerCase().replace(/\s/g, '-')}.pdf`);
}

export function exportDataJson(payload: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
