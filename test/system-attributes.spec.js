const { test, expect } = require('@playwright/test');
const login = require('./helpers/login');

const { BASE_URL } = require('./config');

test.setTimeout(120000);

test('System Attribute Create and Delete', async ({ page }) => {
    // 1. Login
    await login(page);

    // 2. Navigate to System -> Attribute -> Add Attribute
    await page.getByRole('link', { name: 'System' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Attribute' }).click();
    await page.getByRole('link', { name: ' Add Attribute' }).click();

    // 3. Fill Form
    const uniqueId = Date.now().toString(); // Use timestamp for uniqueness
    const name = `Test Attribute ${uniqueId}`;
    const code = `attr_${uniqueId}`;

    // Name[en]
    await page.getByRole('textbox', { name: 'Name[en]' }).click();
    await page.getByRole('textbox', { name: 'Name[en]' }).fill(name);

    // Code
    await page.getByRole('textbox', { name: 'Code' }).click();
    await page.getByRole('textbox', { name: 'Code' }).fill(code);

    // Input Type (Checkbox)
    await page.getByLabel('Input Type').selectOption('checkbox');

    // Is Required (Yes = 1)
    await page.getByLabel('Is Required').selectOption('1');

    // Save
    await page.getByRole('button', { name: 'Save & Continue' }).click();

    // 4. Navigate back to List
    console.log('Navigating directly to Attribute List...');
    await page.goto(`${BASE_URL}/backend/attribute`);

    // 5. Locate and Delete the Item
    // Identifying row by Unique Name and Code
    const row = page.getByRole('row').filter({ hasText: name }).filter({ hasText: code });

    // Verify visibility
    await expect(row).toBeVisible({ timeout: 10000 });

    // Select Checkbox
    // User used: locator('[id="selectedCategory."]')
    // We'll try to target the checkbox within the row
    const checkbox = row.locator('input[type="checkbox"]');
    await checkbox.check();

    // Global Delete Button
    await page.getByRole('button', { name: 'Delete' }).click();

    // Confirm Delete in Modal
    await page.locator('#delete-form').getByRole('button', { name: 'Delete' }).click();

    // Verify Deletion
    await expect(row).not.toBeVisible({ timeout: 10000 });
});
