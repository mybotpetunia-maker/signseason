// Sign Season Email Template System
// Wraps content in the brand template (plum/gold, table-based for email clients)

export function wrapEmail({ headline, subtitle, bodyHtml, ctaText, ctaUrl, preheader }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${headline}</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#1A1320;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
</head>
<body style="margin:0;padding:0;background-color:#1A1320;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1320;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:32px;">
          <a href="https://signseason.com" style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#C9AD6F;text-decoration:none;letter-spacing:0.05em;">sign season</a>
        </td></tr>
        <!-- Card -->
        <tr><td style="border:1px solid rgba(201,173,111,0.25);padding:48px 32px;background-color:#2A1F33;">
          <!-- Top divider -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:32px;">
            <div style="width:60px;height:1px;background-color:rgba(138,125,112,0.5);"></div>
          </td></tr></table>
          <!-- Headline -->
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:bold;color:#F0E8D8;margin:0 0 12px 0;text-align:center;letter-spacing:-0.02em;line-height:1.3;">${headline}</h1>
          <!-- Subtitle -->
          ${subtitle ? `<p style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;color:#B09A6E;margin:0 0 36px 0;text-align:center;">${subtitle}</p>` : '<div style="height:24px;"></div>'}
          <!-- Divider -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:28px;">
            <div style="width:40px;height:1px;background-color:rgba(138,125,112,0.3);"></div>
          </td></tr></table>
          <!-- Body content -->
          ${bodyHtml}
          <!-- CTA Button -->
          ${ctaText ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:36px 0 8px;">
            <a href="${ctaUrl}" style="display:inline-block;padding:16px 32px;background-color:#C9AD6F;color:#1A1320;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;border-radius:4px;">${ctaText}</a>
          </td></tr></table>` : ''}
          <!-- Bottom divider -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 0 16px;">
            <div style="width:60px;height:1px;background-color:rgba(138,125,112,0.3);"></div>
          </td></tr></table>
          <!-- Footer -->
          <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;color:#8A7D70;margin:0;text-align:center;">Sign Season &middot; <a href="https://signseason.com" style="color:#C9AD6F;text-decoration:none;">signseason.com</a></p>
          <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;color:#6B6058;margin:8px 0 0;text-align:center;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6B6058;text-decoration:underline;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Paragraph helper
export function p(text) {
  return `<p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 20px 0;">${text}</p>`;
}

// Bold inline
export function b(text) {
  return `<strong style="color:#E2D4A7;">${text}</strong>`;
}

// Link helper
export function link(text, url) {
  return `<a href="${url}" style="color:#C9AD6F;text-decoration:underline;">${text}</a>`;
}

// Section header
export function h2(text) {
  return `<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;color:#E2D4A7;margin:32px 0 12px 0;">${text}</h2>`;
}

// Divider
export function divider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 0;"><div style="width:30px;height:1px;background-color:rgba(138,125,112,0.25);"></div></td></tr></table>`;
}

// Link card (for content recommendations)
export function linkCard(title, desc, url) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr><td style="padding:16px 20px;background-color:rgba(30,21,40,0.6);border:1px solid rgba(201,173,111,0.1);border-radius:4px;">
      <a href="${url}" style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#C9AD6F;text-decoration:none;font-weight:bold;">${title}</a>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#B09A6E;margin:4px 0 0;line-height:1.5;">${desc}</p>
    </td></tr>
  </table>`;
}
