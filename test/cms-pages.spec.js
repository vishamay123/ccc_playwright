const { test, expect } = require('@playwright/test');
const login = require('./helpers/login');

const { BASE_URL } = require('./config');

test.setTimeout(120000); // 2 minutes timeout for robustness

test('CMS Page Create and Delete', async ({ page }) => {
    console.log('Starting CMS Page Test...');

    // 1. Login
    console.log('Logging in...');
    await login(page); // Uses helper to login

    // Verify login success
    await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });
    console.log('Login successful');

    // 2. Navigate to CMS -> Pages -> Add
    console.log('Navigating to CMS > Pages > Add...');

    // Attempt UI navigation as per user snippet
    await page.getByRole('link', { name: 'CMS' }).click();
    await page.getByRole('paragraph').filter({ hasText: /Pages/i }).click(); // Using regex for case insensitivity/spaces
    await page.getByRole('link', { name: ' Add', exact: false }).click();

    // 3. Fill Form
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const title = `Test Page ${uniqueId}`;
    const bodyText = `This is a test page body generated at ${uniqueId}`;
    const metaTitle = `Meta Title ${uniqueId}`;
    const metaDesc = `Meta Description ${uniqueId}`;

    console.log(`Filling form with Title: ${title}`);

    // Title
    await page.getByRole('textbox', { name: 'Title', exact: true }).fill(title);

    // Body - Using user's specific locator strategy
    // We try to locate it exactly as requested, but wrap in try/catch to avoid hard failure if UI is slightly dynamic
    try {
        const bodyLocator = page.locator('#general-form div').filter({ hasText: 'Body * NormalQuoteCodeHeader' }).getByRole('textbox');
        await bodyLocator.waitFor({ state: 'visible', timeout: 5000 });
        await bodyLocator.fill(bodyText);
    } catch (e) {
        // Fallback: Try to find 'Body' label more generally
        console.log('Specific Body locator not found, trying generic fallback...');
        await page.locator('#general-form div').filter({ hasText: 'Body' }).last().getByRole('textbox').fill(bodyText);
    }

    // Meta Fields
    await page.getByRole('textbox', { name: 'Meta Title' }).fill(metaTitle);
    await page.getByRole('textbox', { name: 'Meta Description' }).fill(metaDesc);

    // Slug
    await page.getByText('Slug * Generate').click();
    await page.getByRole('textbox', { name: 'Slug' }).fill(title);

    // 4. Save
    console.log('Saving...');
    await page.getByRole('button', { name: 'Save & Continue' }).click();

    // Verify Success Message
    console.log('Waiting for success message...');
    await expect(page.getByText('Page created successfully.')).toBeVisible({ timeout: 10000 });
    console.log('Page creation confirmed by success message.');

    // 5. Navigate back to List (User flow)
    console.log('Navigating back to Page List...');
    await page.getByRole('link', { name: 'CMS' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Pages' }).click();
    await page.getByRole('link', { name: ' List' }).click();

    // 6. Find Created Page
    console.log(`Searching for page: ${title}`);

    // Construct row locator based on the unique title
    const row = page.getByRole('row', { name: title }).first();

    // Wait for the row to be visible
    console.log('Waiting for row to be visible...');
    try {
        await expect(row).toBeVisible({ timeout: 10000 });
    } catch (e) {
        console.log('Row not found immediately, trying to search via filter...');
        // Try searching if not found locally (assuming there's a filter/search box)
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
    console.log('Found created page in list.');

    // 7. Delete Page
    console.log('Deleting page...');

    // Select the checkbox in the row
    // We try to use the user's indicated ID pattern or a generic checkbox
    const checkbox = row.locator('input[type="checkbox"]').first();
    await checkbox.check();

    // Click Global Delete Button 
    // User snippet: await page.getByRole('button', { name: 'Delete' }).click();
    const deleteBtn = page.getByRole('button', { name: 'Delete' }).first();
    await deleteBtn.click();

    // Confirm Delete in Modal
    console.log('Confirming deletion...');
    // User snippet: await page.locator('#delete-form').getByRole('button', { name: 'Delete' }).click();
    const modalDeleteBtn = page.locator('#delete-form').getByRole('button', { name: 'Delete' });
    await expect(modalDeleteBtn).toBeVisible({ timeout: 5000 });
    await modalDeleteBtn.click();

    // 8. Verify Deletion
    console.log('Verifying deletion...');
    await expect(row).not.toBeVisible({ timeout: 10000 });
    console.log('Page deleted successfully.');
});
