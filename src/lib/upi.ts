export const UPI_PRIMARY = "shravandeb-1@okaxis";
export const UPI_FALLBACK = "shravandeb@oksbi";
export const PAYEE_NAME = "Shravan Kumar Deb";
export const CURRENCY = "INR";
export const TRANSACTION_NOTE = "Support DevMon";

export function buildUpiUri(
  upiId: string,
  payeeName: string = PAYEE_NAME,
  note: string = TRANSACTION_NOTE,
  amount?: number,
): string {
  let uri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}`;
  if (amount != null) uri += `&am=${amount}`;
  uri += `&cu=${CURRENCY}&tn=${encodeURIComponent(note)}`;
  return uri;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareSupportLink(uri: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Support DevMon", text: "Support DevMon via UPI", url: uri });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
