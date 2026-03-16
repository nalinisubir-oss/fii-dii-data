const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '.'))); // Serve current dir logic, specifically HTML and data

// Serve the dashboard HTML on root access
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'fii_dii_india_flows_dashboard.html'));
});

// Serve the latest FII/DII JSON API
app.get('/api/data', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'data', 'latest.json');
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// For local testing
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`);
        console.log(`📊 Dashboard accessible at http://localhost:${PORT}`);
        console.log(`⚙️ Note: Automated data extraction runs externally via GitHub Actions.`);
    });
}

// Export for Vercel Serverless Functions
module.exports = app;
