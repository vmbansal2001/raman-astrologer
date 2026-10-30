const http = require('http');
let state = { mode: 'success', requests: 0, accepted: 0, lastPayload: null };
const json = (res, status, value) => { res.writeHead(status, {'Content-Type': 'application/json'}); res.end(JSON.stringify(value)); };
async function read(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let body = ''; for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}
http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url || '/', 'http://localhost').pathname;
    if (pathname === '/__control' && req.method === 'POST') { const body = await read(req); state = {mode: body.mode || 'success', requests: 0, accepted: 0, lastPayload: null}; return json(res, 200, {mode: state.mode}); }
    if (pathname === '/__state' && req.method === 'GET') return json(res, 200, state);
    if (req.method !== 'POST' || !/^\/f\/[^/]+$/.test(pathname)) return json(res, 501, {error: 'Endpoint not modelled'});
    state.requests++;
    const body = await read(req); state.lastPayload = body;
    if (!req.headers['content-type']?.includes('application/json') || !req.headers.accept?.includes('application/json') || !body.name || !body.message || !body.enquiry_type || !body.preferred_contact || !body.consent) return json(res, 400, {errors: [{message: 'Invalid submission'}]});
    if (state.mode === 'server-error') return json(res, 500, {error: 'Service unavailable'});
    if (state.mode === 'html-error') { res.writeHead(502, {'Content-Type': 'text/html'}); return res.end('<h1>Upstream unavailable</h1>'); }
    if (state.mode === 'rate-limit') { res.setHeader('Retry-After', '60'); return json(res, 429, {errors: [{message: 'Too many requests'}]}); }
    if (state.mode === 'unconfirmed') return json(res, 200, {ok: false});
    if (state.mode === 'invalid-json') { res.writeHead(200, {'Content-Type': 'application/json'}); return res.end('not-json'); }
    state.accepted++;
    if (state.mode === 'timeout-after-accept') { await new Promise(resolve => setTimeout(resolve, 11000)); if (res.destroyed) return; }
    return json(res, 200, {ok: true});
  } catch { if (!res.headersSent) json(res, 500, {error: 'Mock handler error'}); }
}).listen(process.env.PORT || 4010);
