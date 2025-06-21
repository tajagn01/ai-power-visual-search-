const fs = require('fs');
const path = require('path');

// Read the formatted log file
const logPath = path.join(__dirname, 'formatted_combined.log');

try {
    const logContent = fs.readFileSync(logPath, 'utf8');
    const entries = logContent.split('\n\n').filter(entry => entry.trim());
    
    console.log('📋 AI E-commerce Backend Logs\n');
    console.log('=' .repeat(80) + '\n');
    
    // Show only the most recent 20 entries
    const recentEntries = entries.slice(-20);
    
    for (const entry of recentEntries) {
        try {
            const logEntry = JSON.parse(entry);
            
            // Color coding for log levels
            const levelColors = {
                'info': '\x1b[32m',    // Green
                'warn': '\x1b[33m',    // Yellow
                'error': '\x1b[31m'    // Red
            };
            
            const resetColor = '\x1b[0m';
            const color = levelColors[logEntry.level] || '';
            
            // Format timestamp
            const timestamp = logEntry.timestamp || 'N/A';
            
            // Format message
            let message = logEntry.message;
            if (typeof message === 'object') {
                if (message.action) {
                    message = `[${message.action}] ${message.query || message.ip || ''}`;
                } else {
                    message = JSON.stringify(message, null, 2);
                }
            }
            
            console.log(`${color}[${logEntry.level.toUpperCase()}]${resetColor} ${timestamp}`);
            console.log(`   ${message}`);
            
            // Show additional info if available
            if (logEntry.ip) console.log(`   IP: ${logEntry.ip}`);
            if (logEntry.url) console.log(`   URL: ${logEntry.url}`);
            if (logEntry.method) console.log(`   Method: ${logEntry.method}`);
            
            console.log('');
            
        } catch (parseError) {
            console.log(entry);
            console.log('');
        }
    }
    
    console.log(`\n📊 Showing ${recentEntries.length} most recent entries out of ${entries.length} total entries`);
    console.log(`📁 Full log file: ${logPath}`);
    
} catch (error) {
    console.error('❌ Error reading log file:', error.message);
} 