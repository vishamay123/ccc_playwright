const { test, expect } = require('@playwright/test');
const login = require('./helpers/login');

const { BASE_URL } = require('./config');

test.setTimeout(120000); // 2 minutes timeout for robustness

test('Mail Template Create and Delete', async ({ page }) => {
    console.log('Starting Mail Template Test...');

    // 1. Login
    console.log('Logging in...');
    await login(page);
    await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });
    console.log('Login successful');

    // 2. Navigate to CMS -> Mail Templates -> Add
    console.log('Navigating to CMS > Mail Templates > Add...');
    await page.getByRole('link', { name: 'CMS' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Mail Templates' }).click();
    await page.getByRole('link', { name: ' Add' }).click();

    // 3. Fill Form
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const name = `Test Template ${uniqueId}`;
    const slug = `test-template-${uniqueId}`;
    const subject = `Test Subject ${uniqueId}`;
    const bodyText = `This is a test mail template body generated at ${uniqueId}`;
    const emailInfo = 'test@example.com';

    console.log(`Filling form with Name: ${name}`);

    // Name
    await page.locator('input[name="mail[name]"]').click();
    await page.locator('input[name="mail[name]"]').fill(name);

    // Slug
    await page.getByRole('textbox', { name: 'Slug' }).click();
    await page.getByRole('textbox', { name: 'Slug' }).fill(slug);

    // Subject
    await page.locator('input[name="mail[subject]"]').click();
    await page.locator('input[name="mail[subject]"]').fill(subject);

    // Body - Using user's specific locator strategy
    // We try to locate it exactly as requested, but wrap in try/catch for robustness
    try {
        const bodyLocator = page.locator('#custom-tabs-three-page-info div').filter({ hasText: 'Body * NormalQuoteCodeHeader' }).getByRole('textbox');
        await bodyLocator.click();
        await bodyLocator.fill(bodyText);
    } catch (e) {
        console.log('Specific Body locator not found, trying generic fallback...');
        // Fallback: look for a textbox in the same container or just generic Body filter
        await page.locator('#custom-tabs-three-page-info div').filter({ hasText: 'Body' }).last().getByRole('textbox').fill(bodyText);
    }

    // CC
    await page.locator('input[name="mail[cc]"]').click();
    await page.locator('input[name="mail[cc]"]').fill(emailInfo);

    // BCC
    await page.locator('input[name="mail[bcc]"]').click();
    await page.locator('input[name="mail[bcc]"]').fill(emailInfo);

    // 4. Save
    console.log('Saving...');
    await page.getByRole('button', { name: 'Save & Continue' }).click();

    // Verify Success
    console.log('Waiting for success confirmation...');
    // Assuming "Mail Template created successfully." or similartoast
    try {
        // Broad text match for success to cover variations like "Mail template saved" etc
        // If not found, we rely on finding it in the list later.
        await expect(page.getByText(/successfully/i)).toBeVisible({ timeout: 10000 });
        console.log('Success message detected.');
    } catch (e) {
        console.log('Success message not explicitly detected, proceeding to list verification...');
    }

    // 5. Navigate back to List
    console.log('Navigating back to Mail Template List...');
    await page.getByRole('link', { name: 'CMS' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Mail Templates' }).click();

    // Check if we need to click "List" specifically or if clicking "Mail Templates" is enough
    // Based on previous tests, there's usually a "List" submenu.
    const listLink = page.getByRole('link', { name: ' List' });
    if (await listLink.count() > 0 && await listLink.isVisible()) {
        await listLink.click();
    }

    // 6. Find Created Template
    console.log(`Searching for template: ${name}`);
    const row = page.getByRole('row', { name: name }).first();

    console.log('Waiting for row to be visible...');
    try {
        await expect(row).toBeVisible({ timeout: 10000 });
    } catch (e) {
        console.log('Row not found immediately, trying to search...');
        const searchInput = page.getByPlaceholder(/search|keyword|name/i).first();
        if (await searchInput.count() > 0 && await searchInput.isVisible()) {
            await searchInput.fill(name);
            await searchInput.press('Enter');
            await expect(row).toBeVisible({ timeout: 10000 });
        } else {
            console.log('Search input not found or not visible.');
            throw e;
        }
    }
    console.log('Found created template in list.');

    // 7. Delete Template
    console.log('Deleting template...');

    // Checkbox
    // User didn't provide delete snippet, assuming standard bulk delete pattern
    const checkbox = row.locator('input[type="checkbox"]').first();
    await checkbox.check();

    // Global Delete Button
    const deleteBtn = page.getByRole('button', { name: 'Delete' }).first();
    await deleteBtn.click();

    // Confirm Delete
    console.log('Confirming deletion...');
    // Expecting standard modal
    const modalDeleteBtn = page.locator('#delete-form').getByRole('button', { name: 'Delete' });
    await expect(modalDeleteBtn).toBeVisible({ timeout: 5000 });
    await modalDeleteBtn.click();

    // 8. Verify Deletion
    console.log('Verifying deletion...');
    await expect(row).not.toBeVisible({ timeout: 10000 });
    console.log('Template deleted successfully.');
});
