const { byId, nearestPlace, activate } = require('./_location-seo');

const BOT_PATTERN = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headless/i;

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Metodo non consentito' });
  if (BOT_PATTERN.test(String(req.headers?.['user-agent'] || ''))) return send(res, 403, { error: 'Crawler non consentito' });
  const fetchSite = String(req.headers?.['sec-fetch-site'] || '');
  if (fetchSite && fetchSite !== 'same-origin') return send(res, 403, { error: 'Origine non consentita' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch (_) {
    return send(res, 400, { error: 'Richiesta non valida' });
  }
  let place = null;
  if (body.source === 'manual') place = byId.get(String(body.id));
  if (body.source === 'gps') place = nearestPlace(Number(body.latitude), Number(body.longitude));
  if (!place) return send(res, 400, { error: 'Località non valida' });

  try {
    const result = await activate(place);
    return send(res, 200, { ok: true, ...result });
  } catch (_) {
    return send(res, 503, { error: 'Attivazione SEO temporaneamente non disponibile' });
  }
};
