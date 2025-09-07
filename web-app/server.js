const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoints
app.get('/api/analytics', (req, res) => {
    res.json({
        totalGrievances: 1247,
        resolved: 1058,
        pending: 89,
        inProgress: 100,
        resolutionRate: 84.8,
        severityBreakdown: { Low: 45, Medium: 35, High: 20 }
    });
});

app.post('/api/classify-severity', (req, res) => {
    const { title, description } = req.body;
    const text = (title + ' ' + description).toLowerCase();
    
    const highKeywords = ['emergency', 'urgent', 'critical', 'dangerous', 'fire', 'accident', 'injury'];
    const mediumKeywords = ['broken', 'damaged', 'leak', 'outage', 'blocked', 'noise'];
    
    let severity = 'Low';
    let confidence = 0.6;
    
    if (highKeywords.some(keyword => text.includes(keyword))) {
        severity = 'High';
        confidence = 0.9;
    } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
        severity = 'Medium';
        confidence = 0.8;
    }
    
    res.json({ severity, confidence });
});

app.post('/api/chatbot', (req, res) => {
    const { message } = req.body;
    
    const responses = {
        'hello': 'Hello! I\'m your AI assistant for the Citizen Grievance System. How can I help you today?',
        'help': 'I can help you with:\n• Submitting grievances\n• Tracking your reports\n• Understanding the system\n• Getting support',
        'grievance': 'You can submit grievances by clicking "Submit Grievance" in your dashboard.',
        'status': 'Check your grievance status in the "Track Grievances" section.',
        'emergency': 'For emergencies, call 100 (Police), 101 (Fire), 102 (Ambulance), or 108 (Emergency).',
        'default': 'I can help you with grievance submission, tracking, rewards, and general information. What would you like to know?'
    };
    
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }
    
    res.json({ response });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Citizen Grievance System running on http://localhost:${PORT}`);
    console.log('🎨 Nike-inspired UI loaded');
    console.log('🤖 AI Chatbot active');
    console.log('📊 Analytics ready');
});
