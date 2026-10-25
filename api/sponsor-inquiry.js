// Serverless function (Vercel format): receives the "Interested In Sponsoring" form
// and emails the ElleHacks inbox through the Resend API (https://resend.com).
//
// Required environment variables (set them in the hosting dashboard, never in the frontend):
//   RESEND_API_KEY   - API key from Resend
//   SPONSOR_INBOX    - the ElleHacks address that receives inquiries
//   SPONSOR_FROM     - a sender on a domain verified in Resend, e.g. "ElleHacks Website <no-reply@ellehacks.com>"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  // Honeypot filled in: pretend it worked so bots don't retry.
  if (body.website) return res.status(200).json({ ok: true });

  const email = clean(body.email, 200);
  const title = clean(body.title, 150);
  const message = clean(body.message, 2000);

  if (!EMAIL_PATTERN.test(email) || !title || !message) {
    return res.status(400).json({ error: 'Please provide a valid email, a title, and a message.' });
  }

  const { RESEND_API_KEY, SPONSOR_INBOX, SPONSOR_FROM } = process.env;
  if (!RESEND_API_KEY || !SPONSOR_INBOX || !SPONSOR_FROM) {
    console.error('sponsor-inquiry: missing email environment variables');
    return res.status(500).json({ error: 'Email is not configured.' });
  }

  // The default email ElleHacks receives. Replying goes straight to the interested party.
  const text = [
    'Hi ElleHacks team,',
    '',
    'Someone is interested in sponsoring ElleHacks 2027 and would like to receive the partnership deck.',
    '',
    `Email: ${email}`,
    `Title: ${title}`,
    '',
    'Message:',
    message,
    '',
    'Sent from the "Interested In Sponsoring" form on the ElleHacks website.',
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SPONSOR_FROM,
      to: [SPONSOR_INBOX],
      reply_to: email,
      subject: `Sponsorship inquiry: ${title}`,
      text,
      html: `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    }),
  });

  if (!response.ok) {
    console.error('sponsor-inquiry: Resend error', response.status, await response.text());
    return res.status(502).json({ error: 'Could not send email.' });
  }

  return res.status(200).json({ ok: true });
}
