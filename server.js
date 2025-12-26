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
