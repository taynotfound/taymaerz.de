const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 2050;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to load JSON data
function loadData(filename) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

// API endpoint to get all portfolio data
app.get('/api/data', (req, res) => {
  try {
    const data = {
      profile: loadData('profile.json'),
      contact: loadData('contact.json'),
      skills: loadData('skills.json'),
      experience: loadData('experience.json'),
        projects: loadData('projects.json'),
        services: loadData('services.json'),        contributions: loadData('contributions.json'),      site: loadData('site.json'),
      homelab: loadData('homelab.json')
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load portfolio data' });
  }
});

// Helper to fetch external JSON (using native http/https)
const http = require('http');
const https = require('https');
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (resp) => {
      const { statusCode } = resp;
      if (statusCode && statusCode >= 400) {
        resp.resume();
        return reject(new Error(`Status code ${statusCode}`));
      }
      let raw = '';
      resp.setEncoding('utf8');
      resp.on('data', (chunk) => raw += chunk);
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve(parsed);
        } catch (e) {
          // not JSON
          resolve(raw);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

// Proxy endpoint to fetch monitors from the status page (Uptime Kuma API)
app.get('/api/status/monitors', async (req, res) => {
  try {
    const servicesData = loadData('services.json') || {};
    const statusUrl = servicesData?.status?.statusUrl || '';
    if (!statusUrl) return res.status(404).json({ error: 'No status URL configured' });

    const base = new URL(statusUrl).origin; // e.g. https://status.taymaerz.de

    const candidates = [
      `${base}/api/monitors`,
      `${base}/status.json`,
      `${base}/api/status`,
      `${base}/api/monitors/`,
    ];

    let lastErr = null;
    for (const url of candidates) {
      try {
        const data = await fetchJson(url);
        // If we got something reasonable, return it
        if (data) return res.json({ source: url, data });
      } catch (err) {
        lastErr = err;
      }
    }

    return res.status(502).json({ error: 'Failed to fetch monitors', details: lastErr?.message });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Individual data endpoints
app.get('/api/profile', (req, res) => res.json(loadData('profile.json')));
app.get('/api/contact', (req, res) => res.json(loadData('contact.json')));
app.get('/api/skills', (req, res) => res.json(loadData('skills.json')));
app.get('/api/experience', (req, res) => res.json(loadData('experience.json')));
app.get('/api/projects', (req, res) => res.json(loadData('projects.json')));
app.get('/api/site', (req, res) => res.json(loadData('site.json')));
app.get('/api/legal', (req, res) => res.json(loadData('legal.json')));
app.get('/api/homelab', (req, res) => res.json(loadData('homelab.json')));

// Main routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/impressum', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'impressum.html'));
});

app.get('/impressum-en', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'impressum-en.html'));
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio running at http://localhost:${PORT}`);
});
