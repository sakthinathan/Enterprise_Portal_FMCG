/**
 * WhatsApp Report Utilities for FMCG Stock & Payroll Operations
 * Formats audit summaries and opens WhatsApp Web/App for agency owners.
 */

export function formatWhatsAppAuditSummary(params) {
  const {
    agencyName,
    dateStr,
    selectedBrandNames = [],
    totalSkus,
    countedSkus,
    matchedSkus,
    shortageSkus,
    excessSkus,
    topShortages = []
  } = params;

  const brandCount = selectedBrandNames.length;
  const brandListSample = selectedBrandNames.slice(0, 5).join(', ');

  let message = `📦 *FMCG STOCK AUDIT & VARIANCE REPORT*\n`;
  message += `🏢 *Agency:* ${agencyName}\n`;
  message += `📅 *Date:* ${dateStr}\n\n`;

  message += `📊 *AUDIT SUMMARY:*\n`;
  message += `• *Brands Audited:* ${brandCount} (${brandListSample})\n`;
  message += `• *SKUs Checked:* ${countedSkus} / ${totalSkus} SKUs\n`;
  message += `• *Equal / Matched:* ${matchedSkus} SKUs 🟢\n`;
  message += `• *Shortages:* ${shortageSkus} SKUs 🔴\n`;
  message += `• *Excess:* ${excessSkus} SKUs 🟡\n`;

  if (topShortages.length > 0) {
    message += `\n⚠️ *TOP SHORTAGE ITEMS:*\n`;
    topShortages.slice(0, 5).forEach((item, idx) => {
      message += `${idx + 1}. *${item.brand}* (${item.materialDesc}): ${item.diffText}\n`;
    });
  }

  message += `\n📄 *Official audit report generated via FMCG Enterprise Suite.*`;
  return message;
}

export function openWhatsAppShare(messageText, phone = '') {
  const encodedText = encodeURIComponent(messageText);
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
  let url = `https://api.whatsapp.com/send?text=${encodedText}`;
  if (cleanPhone) {
    const formattedPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    url = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
