// popup/testGenerator.js
function generatePlaywrightTest(actions) {
    let code = `import { test, expect } from '@playwright/test';\n\n`;
    code += `test('User Journey Test', async ({ page }) => {\n`;
    
    let currentUrl = '';
    actions.forEach(action => {
        if (action.url !== currentUrl) {
            code += `    await page.goto('${action.url}');\n`;
            currentUrl = action.url;
        }
        
        switch (action.type) {
            case 'click':
                code += `    await page.click('${action.selector}');\n`;
                if (action.text) {
                    code += `    await expect(page.locator('${action.selector}')).toHaveText('${action.text}');\n`;
                }
                break;
            case 'fill':
                code += `    await page.fill('${action.selector}', '${action.value}');\n`;
                code += `    await expect(page.locator('${action.selector}')).toHaveValue('${action.value}');\n`;
                break;
        }
        code += `    await page.waitForLoadState('networkidle');\n`;
    });
    
    code += `});\n`;
    return code;
}
