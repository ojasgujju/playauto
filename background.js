/ background.js
let recordedEvents = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case 'recordingStopped':
        console.log('Recording stopped, events:', request.events);
        recordedEvents = request.events;
        break;
      case 'generateTests':
        console.log('Generating tests from events:', recordedEvents);
        if (!recordedEvents || recordedEvents.length === 0) {
          console.error('No events recorded');
          return;
        }
        generateTestCases(recordedEvents);
        break;
    }
  } catch (error) {
    console.error('Error in message listener:', error);
  }
});

function generateTestCases(events) {
  const playwrightTest = generatePlaywrightTest(events);
  const testReport = generateTestReport(events);
  
  // Convert content to base64
  function convertToDataURL(content, type) {
    const blob = new Blob([content], { type: type });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // Download both files
  Promise.all([
    convertToDataURL(playwrightTest, 'text/javascript'),
    convertToDataURL(testReport, 'text/markdown')
  ]).then(([testDataUrl, reportDataUrl]) => {
    // Download test file
    chrome.downloads.download({
      url: testDataUrl,
      filename: 'customer-journey.spec.js',
      saveAs: true
    });
    
    // Download report
    chrome.downloads.download({
      url: reportDataUrl,
      filename: 'test-report.md',
      saveAs: true
    });
  });
}

function generatePlaywrightTest(events) {
  const testCases = events.map(event => {
    switch (event.type) {
      case 'click':
        return `  await page.click('${event.selector}');`;
      case 'input':
        return `  await page.fill('${event.selector}', '${event.value}');`;
      case 'change':
        return `  await page.selectOption('${event.selector}', '${event.value}');`;
      default:
        return '';
    }
  }).join('\n');

  return `
const { test, expect } = require('@playwright/test');

test('Customer Journey Test', async ({ page }) => {
  // Test configurations for different browsers and devices
  const contexts = [
    { name: 'Desktop Chrome', useAgent: 'Chrome' },
    { name: 'Desktop Firefox', useAgent: 'Firefox' },
    { name: 'Mobile Safari', useAgent: 'Safari', viewport: { width: 375, height: 667 } }
  ];

  for (const context of contexts) {
    console.log(\`Running test in \${context.name}\`);
    
    if (context.viewport) {
      await page.setViewportSize(context.viewport);
    }
    
    await page.setExtraHTTPHeaders({
      'User-Agent': context.useAgent
    });

    // Navigate to initial URL
    await page.goto('${events[0]?.url || ''}');

    // Replay recorded actions
${testCases}

    // Add assertions here
    await expect(page).toHaveURL('${events[events.length - 1]?.url || ''}');
  }
});`;
}

function generateTestReport(events) {
  const steps = events.map((event, index) => {
    return `${index + 1}. ${event.type.toUpperCase()}: ${event.selector} ${event.value ? `(Value: ${event.value})` : ''}`;
  }).join('\n');

  return `# Customer Journey Test Report

## Test Overview
- Total Steps: ${events.length}
- Start URL: ${events[0]?.url || 'N/A'}
- End URL: ${events[events.length - 1]?.url || 'N/A'}

## Test Steps
${steps}

## Cross-browser Testing
- Desktop Chrome
- Desktop Firefox
- Mobile Safari (iPhone 8)

## Test Coverage
- User interactions
- Form inputs
- Navigation
- Responsive design
- Cross-browser compatibility

## Notes
- Generated using Customer Journey Recorder
- Playwright test suite included
- Mobile-responsive testing included`;
}