/**
 * Diction beta waitlist. Receives the email from the form on trydiction.com
 * and appends a timestamped row to the "Diction Beta Waitlist" Google Sheet.
 *
 * Setup (once): open the Sheet > Extensions > Apps Script, paste this file,
 * then Deploy > New deployment > Web app, Execute as: Me,
 * Who has access: Anyone. Put the /exec URL in waitlist.js.
 */
const SHEET_ID = '1-_BXbao6l0QhQo_hS0-AZ_M9JDd04PTvM2CfEeTAB0Y';
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Honeypot: real people never fill the hidden "website" field.
  if (p.website) return json({ ok: true });

  const email = String(p.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email) || /^[=+\-@]/.test(email)) {
    return json({ ok: false, error: 'invalid' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const last = sheet.getLastRow();
    if (last > 1) {
      const existing = sheet.getRange(2, 2, last - 1, 1).getValues().flat();
      if (existing.indexOf(email) !== -1) return json({ ok: true, duplicate: true });
    }
    sheet.appendRow([new Date(), email]);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

function doGet() {
  return json({ ok: true, service: 'diction-waitlist' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
