import http from 'http';
import { ALL_APIS, getApiById, CATEGORIES_WITH_COUNTS } from '../src/data/registry';
import { searchApis, recommendApisForTask, compareApis } from '../src/data/search-index';
import { fetchLiveApiDocumentation } from './utils/live-docs-resolver';

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', apiCount: ALL_APIS.length, version: '2.0.0', liveWebEnabled: true }));
    return;
  }

  // Categories endpoint
  if (url.pathname === '/api/categories') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(CATEGORIES_WITH_COUNTS));
    return;
  }

  // APIs list & search
  if (url.pathname === '/api/apis' && req.method === 'GET') {
    const q = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category') || undefined;
    const limit = Number(url.searchParams.get('limit')) || 50;

    let results = searchApis(q, category, limit);

    // If query returned 0 local results, try live web resolution
    if (results.length === 0 && q.trim()) {
      const live = await fetchLiveApiDocumentation(q);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ liveResult: live, results: [] }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
    return;
  }

  // Single API detail
  if (url.pathname.startsWith('/api/apis/') && req.method === 'GET') {
    const id = url.pathname.replace('/api/apis/', '');
    let api = getApiById(id);
    if (!api) {
      const live = await fetchLiveApiDocumentation(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ isLiveWeb: true, liveDoc: live }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(api));
    return;
  }

  // Recommend APIs endpoint (POST)
  if (url.pathname === '/api/recommend' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { task, constraints } = JSON.parse(body || '{}');
        if (!task) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'task is required in body' }));
          return;
        }
        const recommendations = recommendApisForTask(task, constraints);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(recommendations));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Compare APIs endpoint (POST)
  if (url.pathname === '/api/compare' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { apiIds } = JSON.parse(body || '{}');
        if (!apiIds || !Array.isArray(apiIds)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'apiIds array is required' }));
          return;
        }
        const comparison = compareApis(apiIds);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comparison));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`🚀 API Docs Hub HTTP MCP Server running on http://localhost:${PORT} with ${ALL_APIS.length} APIs + Live Web Docs`);
});
