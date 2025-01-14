// popup/reportGenerator.js
function generateTestReport(actions, testCode) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>User Journey Test Report</title>
    <style>
        body { font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .action { margin: 10px 0; padding: 10px; border: 1px solid #eee; }
        .code { background: #f5f5f5; padding: 15px; border-radius: 4px; }
        .timeline { display: flex; flex-direction: column; gap: 10px; }
    </style>
</head>
<body>
    <h1>User Journey Test Report</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>
    
    <h2>Timeline</h2>
    <div class="timeline">
        ${actions.map(action => `
            <div class="action">
                <strong>${action.type.toUpperCase()}</strong>
                <p>Selector: ${action.selector}</p>
                <p>URL: ${action.url}</p>
                ${action.value ? `<p>Value: ${action.value}</p>` : ''}
                ${action.text ? `<p>Text: ${action.text}</p>` : ''}
                <p>Time: ${new Date(action.timestamp).toLocaleString()}</p>
            </div>
        `).join('')}
    </div>
    
    <h2>Generated Test Code</h2>
    <pre class="code">${testCode}</pre>
</body>
</html>`;
}
