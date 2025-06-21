const fs = require('fs');
const path = require('path');

// Read the cleaned log file
const inputPath = path.join(__dirname, 'cleaned_combined.log');
const outputPath = path.join(__dirname, 'formatted_combined.log');

try {
    const logContent = fs.readFileSync(inputPath, 'utf8');
    const lines = logContent.split('\n').filter(line => line.trim());
    
    let formattedLines = [];
    
    for (const line of lines) {
        try {
            const logEntry = JSON.parse(line);
            
            // Create a formatted version
            const formattedEntry = {
                timestamp: logEntry.timestamp,
                level: logEntry.level,
                service: logEntry.service,
                message: logEntry.message
            };
            
            // Add additional fields if they exist
            if (logEntry.ip) formattedEntry.ip = logEntry.ip;
            if (logEntry.method) formattedEntry.method = logEntry.method;
            if (logEntry.url) formattedEntry.url = logEntry.url;
            if (logEntry.userAgent) formattedEntry.userAgent = logEntry.userAgent;
            if (logEntry.stack) formattedEntry.stack = logEntry.stack;
            
            // Format the JSON with proper indentation
            const formattedLine = JSON.stringify(formattedEntry, null, 2);
            formattedLines.push(formattedLine);
            
        } catch (parseError) {
            // If it's not valid JSON, keep it as is
            formattedLines.push(line);
        }
    }
    
    // Write formatted logs
    fs.writeFileSync(outputPath, formattedLines.join('\n\n'));
    
    console.log(`✅ Log file formatted successfully!`);
    console.log(`📁 Input file: ${inputPath}`);
    console.log(`📁 Formatted file: ${outputPath}`);
    console.log(`📊 Total entries: ${formattedLines.length}`);
    
} catch (error) {
    console.error('❌ Error formatting log file:', error.message);
} 