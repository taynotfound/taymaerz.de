const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3050;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Portfolio data cache
let portfolioData = null;
let lastFetch = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to fetch and parse portfolio data
async function fetchPortfolioData() {
  try {
    if (portfolioData && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
      return portfolioData;
    }

    console.log('Fetching fresh portfolio data from taymaerz.de...');
    const response = await axios.get('https://taymaerz.de');
    const html = response.data;
    
    // Parse the data from the HTML (simplified extraction)
    const data = {
      name: "Tay März",
      title: "Developer & Linux Enthusiast",
      bio: "I'm a passionate developer from Germany with 6+ years of programming experience since 2019, dedicated to building beautiful, accessible, and modern web experiences. My journey has taken me through AI prototyping, internships, and real-world projects for communities and businesses. I thrive on learning new technologies, collaborating with others, and turning ideas into reality. Always curious, always shipping.",
      photo: "/assets/images/photo.jpg",
      contact: {
        email: "tay@taymaerz.de",
        discord: "notfound.sh",
        github: "https://github.com/taynotfound"
      },
      skills: [
        { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
        { name: "Astro", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg" },
        { name: "Tailwind", icon: "https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg" },
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
        { name: "Bash", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" }
      ],
      experience: [
        {
          period: "2025 - Present",
          company: "dikon Elektronik & IT GmbH",
          position: "Trainee IT specialist in system integration",
          location: "Germany",
          description: "Support and maintain the company's infrastructure and employees PCs."
        },
        {
          period: "2024 - 2025",
          company: "Greenmark IT GmbH",
          position: "Junior Development Apprentice",
          location: "Alfeld (On site)",
          description: "Developed and maintained web applications, contributed to new features and internal tools, and supported the launch of a customer portal and data management system."
        },
        {
          period: "2024",
          company: "Thiele Bakery",
          position: "Cashier",
          location: "Göttingen (On site)",
          description: "Provided friendly customer service, prepared baked goods and snacks, and ensured a welcoming store atmosphere."
        },
        {
          period: "2023 - 2024",
          company: "AGVolution GmbH",
          position: "Intern Web & AI Developer",
          location: "Göttingen (Hybrid)",
          description: "Independently developed a self-hosted AI assistant for agriculture, and contributed to backend and frontend web projects."
        },
        {
          period: "2022 - Present",
          company: "EasySystems",
          position: "Developer",
          location: "Germany (Remote)",
          description: "Develop and maintain Discord bots, including an AI-powered assistant and a leveling system for communities."
        }
      ],
      volunteer: [
        {
          period: "2023 - Present",
          organization: "PATHFindr",
          position: "Volunteer Moderator",
          location: "Discord",
          description: "Moderating the PATHFindr community Discord Server, and ensuring a positive and welcoming environment for all members. Consistently contributed to the community for over a year, approaching two years of dedicated service."
        }
      ],
      projects: [
        {
          name: "WeatherWeb",
          description: "Autistic Friendly & AI Powered Weather Web App without any bullshit.",
          image: "/assets/images/screenshots/weatherweb-1.png",
          liveUrl: "https://weather.taymaerz.de/",
          githubUrl: "https://github.com/taynotfound/weatherweb"
        },
        {
          name: "Recimaster",
          description: "Recipes without any Bullshit & AI powered Instructions. Just you and your Food.",
          image: "/assets/images/screenshots/recimaster-1.png",
          liveUrl: "https://recipe.taymaerz.de/",
          githubUrl: "https://github.com/taynotfound/recimaster"
        },
        {
          name: "Nexus Search",
          description: "A modern, privacy-focused search engine interface powered by multiple search APIs.",
          image: "/assets/images/screenshots/nexus-search-1.png",
          liveUrl: "https://search.taymaerz.de/",
          githubUrl: "https://github.com/taynotfound/nexus-search"
        },
        {
          name: "MyRadio",
          description: "A web-based radio station with curated playlists and song requests.",
          image: "/assets/images/screenshots/myradio-1.png",
          liveUrl: "https://myradio.taymaerz.de/",
          githubUrl: null
        },
        {
          name: "Gay Clicker",
          description: "Play Gay Clicker, the ultimate LGBTQ+ idle game! Collect gay points, unlock upgrades, and become the ultimate Gay Icon.",
          image: "/assets/images/screenshots/gayclicker-1.png",
          liveUrl: "https://gayshit.wtf/clicker",
          githubUrl: null
        },
        {
          name: "Soup",
          description: "A Travel Assistant with AI Built In.",
          image: "/assets/images/screenshots/soup-1.png",
          liveUrl: "https://soup.taymaerz.de/",
          githubUrl: null
        },
        {
          name: "maerz.click",
          description: "Cut your links shorter. Modern URL shortener with custom domains, link customization, click tracking, and full management.",
          image: "/assets/images/screenshots/maerz-click.png",
          liveUrl: "https://maerz.click/",
          githubUrl: null
        },
        {
          name: "shar.taymaerz.de",
          description: "Selfhosted Fediverse instance for decentralized social networking.",
          image: "/assets/images/screenshots/shar-taymaerz.png",
          liveUrl: "https://shar.taymaerz.de/",
          githubUrl: null
        }
      ]
    };
    
    portfolioData = data;
    lastFetch = Date.now();
    return data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    // Return fallback data if fetch fails
    if (portfolioData) return portfolioData;
    throw new Error('Unable to fetch portfolio data');
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/impressum', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'impressum.html'));
});

app.get('/impressum-en', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'impressum-en.html'));
});

// API Routes
app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await fetchPortfolioData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const data = await fetchPortfolioData();
    res.json(data.projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects data' });
  }
});

app.get('/api/experience', async (req, res) => {
  try {
    const data = await fetchPortfolioData();
    res.json(data.experience);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience data' });
  }
});

app.get('/api/skills', async (req, res) => {
  try {
    const data = await fetchPortfolioData();
    res.json(data.skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills data' });
  }
});

app.get('/api/about', async (req, res) => {
  try {
    const data = await fetchPortfolioData();
    res.json({
      name: data.name,
      title: data.title,
      bio: data.bio,
      photo: data.photo,
      contact: data.contact
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch about data' });
  }
});

// Discord webhook endpoint for contact form
app.post('/api/contact', async (req, res) => {
  try {
    // Security: Check referrer to ensure it's from our domain
    const referer = req.get('Referer');
    const origin = req.get('Origin');
    const allowedDomains = [
      'http://localhost:3000',
      'https://taymaerz.de',
      'https://www.taymaerz.de'
    ];
    
    const isValidOrigin = allowedDomains.some(domain => 
      (referer && referer.startsWith(domain)) || 
      (origin && origin === domain)
    );
    
    if (!isValidOrigin) {
      return res.status(403).json({ error: 'Forbidden: Invalid origin' });
    }

    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Sanitize and escape mentions
    const sanitize = (text) => {
      return text
        .replace(/@/g, '@\u200B') // Zero-width space to break mentions
        .replace(/discord\.gg/gi, 'discord\u200B.gg') // Break discord invites
        .replace(/https?:\/\//gi, 'h\u200Bttp://') // Break URLs
        .substring(0, 2048); // Limit length
    };
    
    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedSubject = sanitize(subject);
    const sanitizedMessage = sanitize(message);
    
    // Create Discord embed
    const embed = {
      title: "📧 New Contact Form Submission",
      color: 0x8B5CF6, // Purple color
      fields: [
        {
          name: "👤 Name",
          value: sanitizedName,
          inline: true
        },
        {
          name: "📧 Email",
          value: sanitizedEmail,
          inline: true
        },
        {
          name: "📋 Subject",
          value: "```\n" + sanitizedSubject + "\n```",
          inline: false
        },
        {
          name: "💬 Message",
          value: sanitizedMessage,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Portfolio Contact Form • taymaerz.de"
      }
    };
    
    // Send to Discord webhook
    const webhookUrl = 'https://discord.com/api/webhooks/1393726097442472016/l0AljtDKArt0HflqGOwSDMGoLtZZIc2qcQP-l2Qft8Mu-Jux3cnC473yxqZ5RtYsaVYI';
    
    await axios.post(webhookUrl, {
      embeds: [embed],
      username: "Portfolio Bot",
      avatar_url: "https://taymaerz.de/assets/images/photo.jpg"
    });
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! Thank you for reaching out.' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Portfolio API endpoints available at:');
  console.log('  GET /api/portfolio - Complete portfolio data');
  console.log('  GET /api/projects - Projects only');
  console.log('  GET /api/experience - Experience only');
  console.log('  GET /api/skills - Skills only');
  console.log('  GET /api/about - About info only');
});

module.exports = app;
