const fs = require('fs');
const path = require('path');

// Read the original log file
const logPath = path.join(__dirname, 'combined.log');
const outputPath = path.join(__dirname, 'cleaned_combined.log');

try {
    const logContent = fs.readFileSync(logPath, 'utf8');
    const lines = logContent.split('\n').filter(line => line.trim());
    
    let cleanedLines = [];
    let serverStartCount = 0;
    let lastServerStart = '';
    
    for (const line of lines) {
        try {
            const logEntry = JSON.parse(line);
            
            // Skip redundant server startup messages (keep only first one per session)
            if (logEntry.message && typeof logEntry.message === 'string' && 
                logEntry.message.includes('🚀 Server running on port 5000')) {
                serverStartCount++;
                if (serverStartCount === 1 || logEntry.timestamp !== lastServerStart) {
                    cleanedLines.push(line);
                    lastServerStart = logEntry.timestamp;
                }
                continue;
            }
            
            // Skip redundant upload directory and CORS messages
            if (logEntry.message && typeof logEntry.message === 'string' && 
                (logEntry.message.includes('📁 Upload directory') || 
                 logEntry.message.includes('🌍 Environment') ||
                 logEntry.message.includes('🔗 CORS enabled'))) {
                continue;
            }
            
            // Keep all other entries
            cleanedLines.push(line);
            
        } catch (parseError) {
            // If it's not valid JSON, keep it as is
            cleanedLines.push(line);
        }
    }
    
    // Write cleaned logs
    fs.writeFileSync(outputPath, cleanedLines.join('\n'));
    
    console.log(`✅ Log file cleaned successfully!`);
    console.log(`📁 Original file: ${logPath}`);
    console.log(`📁 Cleaned file: ${outputPath}`);
    console.log(`📊 Original lines: ${lines.length}`);
    console.log(`📊 Cleaned lines: ${cleanedLines.length}`);
    console.log(`🗑️  Removed ${lines.length - cleanedLines.length} redundant entries`);
    
} catch (error) {
    console.error('❌ Error processing log file:', error.message);
} 