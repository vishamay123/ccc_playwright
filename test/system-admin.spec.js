const { test, expect } = require('@playwright/test');
const login = require('./helpers/login');

const { BASE_URL } = require('./config');

test.setTimeout(120000);

test('System Admin Create and Permanent Delete', async ({ page }) => {
    // 1. Login
    await login(page);

    // 2. Navigate to System -> Admin -> Add Admin
    await page.getByRole('link', { name: 'System' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Admin' }).click();
    await page.getByRole('link', { name: ' Add Admin' }).click();

    // 3. Fill Form
    const uniqueId = Date.now().toString();
    const name = `Admin User ${uniqueId}`;
    const email = `admin_${uniqueId}@example.com`;
    const password = 'Admin@1234';

    // Name
    await page.locator('input[name="user[name]"]').fill(name);

    // Email
    await page.getByRole('textbox', { name: 'Email' }).fill(email);

    // Role Selection (Selector from user snippet)
    await page.locator('[id="user[role_id]"]').selectOption('2');

    // Password Tab
    await page.getByRole('tab', { name: 'Password' }).click();

    // Password Fields
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(password);

    // Save
    await page.getByRole('button', { name: 'Save & Continue' }).click();

    // 4. Verify Creation & Soft Delete (Move to Trash)
    // Capture ID from URL
    await expect(page).toHaveURL(/edit/);
    const currentUrl = page.url();
    const idMatch = currentUrl.match(/\/edit\/(\d+)/);
    const adminId = idMatch ? idMatch[1] : null;
    console.log(`Captured Admin ID: ${adminId}`);

    if (!adminId) throw new Error('Could not capture Admin ID from URL');

    // Navigate to Admin List using URL as requested
    console.log('Navigating directly to Admin List...');
    await page.goto(`${BASE_URL}/backend/user`);

    // Find Row by Name (Robust: Look for tr with specific name)
    const adminRow = page.locator('tr').filter({ hasText: name });
    await expect(adminRow).toBeVisible({ timeout: 10000 });

    // Select Checkbox within the row
    await adminRow.locator('[id="selectedCategory."]').check();

    // Click Delete (Soft Delete)
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.locator('#delete-form').getByRole('button', { name: 'Delete' }).click();

    // Verify removed from active list
    await expect(adminRow).not.toBeVisible({ timeout: 10000 });

    // 5. Permanent Delete (From Deleted List)
    console.log('Navigating to Deleted Admin List for permanent deletion...');
    // Direct navigation using BASE_URL as requested
    await page.goto(`${BASE_URL}/backend/deleted_user`);

    // Find Row in Deleted List using Name
    const deletedRow = page.locator('tr').filter({ hasText: name });
    await expect(deletedRow).toBeVisible({ timeout: 10000 });

    // Select Checkbox
    await deletedRow.locator('[id="selectedCategory."]').check();

    // Click Delete (Permanent)
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.locator('#delete-form').getByRole('button', { name: 'Delete' }).click();

    // Verify completely removed
    await expect(deletedRow).not.toBeVisible({ timeout: 10000 });
});
