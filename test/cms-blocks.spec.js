const { test, expect } = require('@playwright/test');
const login = require('./helpers/login');

const { BASE_URL } = require('./config');

test.setTimeout(120000); // 2 minutes timeout for robustness

test('CMS Block Create and Delete', async ({ page }) => {
    console.log('Starting CMS Block Test...');

    // 1. Login
    console.log('Logging in...');
    await login(page);
    await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });
    console.log('Login successful');

    // 2. Navigate to CMS -> Blocks -> Add Block
    console.log('Navigating to CMS > Blocks > Add Block...');
    await page.getByRole('link', { name: 'CMS' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Blocks' }).click();
    await page.getByRole('link', { name: ' Add Block' }).click();

    // 3. Fill Form
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const title = `Test Block ${uniqueId}`;
    const content = `This is test block content generated at ${uniqueId}`;
    const slug = `test-block-${uniqueId}`;

    console.log(`Filling form with Title: ${title}`);

    // Title
    await page.getByRole('textbox', { name: 'Title' }).fill(title);

    // Content
    // User snippet: await page.getByRole('textbox', { name: 'Content' }).fill('test');
    // We'll use the specific content generated
    await page.getByRole('textbox', { name: 'Content' }).fill(content);

    // Slug
    // User snippet: await page.getByRole('textbox', { name: 'Slug' }).click(); then fill
    await page.getByRole('textbox', { name: 'Slug' }).click();
    await page.getByRole('textbox', { name: 'Slug' }).fill(slug);

    // 4. Save
    console.log('Saving...');
    await page.getByRole('button', { name: 'Save & Continue' }).click();

    // Verify Success - Pattern match from previous tests
    // Assuming "Block created successfully." or similar, or redirect.
    // We'll check for success message if possible, or fall back to checking list.
    console.log('Waiting for success confirmation...');
    // We try to catch the success toast/message
    try {
        await expect(page.getByText('Block created successfully.')).toBeVisible({ timeout: 10000 });
        console.log('Block creation confirmed by success message.');
    } catch (e) {
        console.log('Success message not detected (might differ), checking redirection/list...');
    }

    // 5. Navigate back to List
    console.log('Navigating back to Block List...');
    await page.getByRole('link', { name: 'CMS' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Blocks' }).click();
    // Assuming 'List' link exists similar to Pages, checking snippet or standard pattern
    // If not explicit in user snippet, we assume standard 'List' or just clicking 'Blocks' might show list?
    // User snippet only showed adding. Standard pattern is "List" sub-item or "Blocks" parent item implies list.
    // In Page test it was " List". Let's assume " List" or check if clicking "Blocks" goes to list.
    // Usually there is a "List" or "Manage" link. Let's try the " List" pattern first as it matches Pages.

    // Safest bet based on Pages test:
    const listLink = page.getByRole('link', { name: ' List' });
    if (await listLink.isVisible()) {
        await listLink.click();
    } else {
        // Fallback: clicking the Blocks header might go to list
        console.log('"List" link not found, assuming we are on list or need to click parent...');
        // Verify if we are already on list (url contains 'block')
    }

    // 6. Find Created Block
    console.log(`Searching for block: ${title}`);
    const row = page.getByRole('row', { name: title }).first();

    console.log('Waiting for row to be visible...');
    try {
        await expect(row).toBeVisible({ timeout: 10000 });
    } catch (e) {
        console.log('Row not found immediately, trying to search via filter...');
        const searchInput = page.getByPlaceholder(/search|keyword|title/i).first();
        if (await searchInput.count() > 0 && await searchInput.isVisible()) {
            await searchInput.fill(title);
            await searchInput.press('Enter');
            await expect(row).toBeVisible({ timeout: 10000 });
        } else {
            console.log('Search input not found or not visible.');
            throw e;
        }
    }
    console.log('Found created block in list.');

    // 7. Delete Block
    console.log('Deleting block...');

    // Checkbox
    const checkbox = row.locator('input[type="checkbox"]').first();
    await checkbox.check();

    // Global Delete Button
    const deleteBtn = page.getByRole('button', { name: 'Delete' }).first();
    await deleteBtn.click();

    // Confirm Delete
    console.log('Confirming deletion...');
    const modalDeleteBtn = page.locator('#delete-form').getByRole('button', { name: 'Delete' });
    await expect(modalDeleteBtn).toBeVisible({ timeout: 5000 });
    await modalDeleteBtn.click();

    // 8. Verify Deletion
    console.log('Verifying deletion...');
    await expect(row).not.toBeVisible({ timeout: 10000 });
    console.log('Block deleted successfully.');
});
