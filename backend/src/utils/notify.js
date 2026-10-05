/**
 * notify.js — Server-side WhatsApp notifications via CallMeBot
 *
 * One-time setup for the owner:
 * 1. Save +34 644 59 72 87 as a contact (CallMeBot)
 * 2. Send this WhatsApp message to that number:
 *    "I allow callmebot to send me messages"
 * 3. You'll receive your API key in reply
 * 4. Add to .env:
 *    OWNER_WHATSAPP=91XXXXXXXXXX
 *    CALLMEBOT_API_KEY=xxxxxxx
 */

const https = require('https');

/**
 * Send a WhatsApp message to the owner via CallMeBot.
 * @param {string} message - Plain text message (max ~1000 chars)
 * @returns {Promise<void>} — Resolves silently, never throws (fire-and-forget safe)
 */
function notifyOwner(message) {
  const phone  = process.env.OWNER_WHATSAPP;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  // Silently skip if not configured — won't break anything
  if (!phone || !apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[notify] OWNER_WHATSAPP or CALLMEBOT_API_KEY not set — skipping WhatsApp alert');
    }
    return Promise.resolve();
  }

  const encodedMsg = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMsg}&apikey=${apiKey}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      res.resume(); // drain response body
      resolve();
    }).on('error', (err) => {
      console.error('[notify] WhatsApp notification failed:', err.message);
      resolve(); // never reject — notification is best-effort
    });
  });
}

/**
 * Build and send a trial request notification to the owner.
 */
function notifyNewTrialRequest(trial) {
  const lines = [
    `🌿 *New Free Basket Request!*`,
    ``,
    `👤 *Name:* ${trial.name}`,
    `📱 *Mobile:* ${trial.mobile}`,
    trial.whatsapp && trial.whatsapp !== trial.mobile
      ? `💬 *WhatsApp:* ${trial.whatsapp}` : null,
    trial.area     ? `📍 *Area:* ${trial.area}` : null,
    trial.society  ? `🏠 *Society:* ${trial.society}` : null,
    `🏡 *Address:* ${trial.address}`,
    trial.family_size          ? `👨‍👩‍👧 *Family:* ${trial.family_size} people` : null,
    trial.preferred_delivery_day ? `📅 *Prefers:* ${trial.preferred_delivery_day}` : null,
    ``,
    `➡️ Reply to schedule their delivery!`,
  ].filter(Boolean).join('\n');

  return notifyOwner(lines);
}

module.exports = { notifyOwner, notifyNewTrialRequest };
