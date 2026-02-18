const { test, expect } = require('@playwright/test');

const BASE_URL = "http://52.91.192.7";

test.setTimeout(300000);

// Login helper function
async function login(page) {
    console.log('Logging in...');
    await page.goto(BASE_URL);

    if (await page.url().includes('login')) {
        const emailInput = page.getByPlaceholder(/email|username/i).or(page.getByLabel(/email|username/i)).first();
        await emailInput.fill('admin@gmail.com');

        const passwordInput = page.getByPlaceholder(/password/i).or(page.getByLabel(/password/i)).first();
        await passwordInput.fill('admin123');

        const loginButton = page.getByRole('button', { name: /login|sign in/i }).first();
        if (await loginButton.count() > 0) {
            await loginButton.click();
        } else {
            await passwordInput.press('Enter');
        }
    }

    try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch (e) { }
    await expect(page).not.toHaveURL(/login/, { timeout: 30000 });
    console.log('Login successful');
}

test('Create and Delete Auction', async ({ page }) => {
    await login(page);

    console.log('Starting auction creation...');
    await page.getByRole('link', { name: 'Auction', exact: true }).click();
    await page.getByRole('link', { name: ' Auction Create' }).click();

    console.log('Filling form...');
    await page.locator('#general-form div').filter({ hasText: 'Description * NormalQuoteCodeHeader 1Header 2Header 3Header 4Header 5Header' }).getByRole('textbox').click();
    await page.locator('#general-form div').filter({ hasText: 'Description * NormalQuoteCodeHeader 1Header 2Header 3Header 4Header 5Header' }).getByRole('textbox').fill('test');

    await page.getByText('Meta title *').click();
    await page.getByRole('textbox', { name: 'Meta title' }).fill('test');

    await page.locator('textarea[name="en[meta_description]"]').click();
    await page.locator('textarea[name="en[meta_description]"]').fill('test');

    await page.getByText('Meta keywords *').click();
    await page.getByRole('textbox', { name: 'Meta keywords' }).fill('test');

    await page.getByText('Assign Artwork *Select').click();
    const artworkDropdown = page.getByLabel('Assign Artwork');
    const optionCount = await artworkDropdown.locator('option').count();

    if (optionCount > 1) {
        await artworkDropdown.selectOption({ index: 1 });
        console.log('Selected artwork at index 1');
    } else {
        console.warn('Not enough options in Assign Artwork dropdown to pick index 1. Trying index 0.');
        if (optionCount > 0) await artworkDropdown.selectOption({ index: 0 });
    }

    await page.getByRole('textbox', { name: 'Auction date' }).click();
    try {
        await page.getByText('SuMoTuWeThFrSa12345678910111213141516171819202122232425262728').click();
    } catch (e) {
        console.log('Calendar header click failed, trying to just pick a date');
    }

    await page.getByRole('link', { name: '19' }).first().click();

    await page.locator('input[name="estimate"]').click();
    await page.locator('input[name="estimate"]').fill('12');

    await page.locator('#auction_start_time').click();
    try {
        await page.getByText('TimeHourMinuteTime Zone-1200-').click();
    } catch (e) { console.log('Time picker non-critical click failed'); }

    await page.locator('#auction_end_time').click();
    await page.locator('dl div').first().click();

    await page.getByLabel('Status').selectOption('1');

    console.log('Saving auction...');
    await page.getByRole('button', { name: 'Save & Continue' }).click();

    // --- Deletion Logic ---
    console.log('Waiting for successful creation...');
    await expect(page).toHaveURL(/\/(edit|auction)\/|\?id=/, { timeout: 30000 });

    const createdUrl = page.url();
    console.log(`Created Auction URL: ${createdUrl}`);

    const idMatch = createdUrl.match(/\/edit\/(\d+)/) || createdUrl.match(/id=(\d+)/);
    const auctionId = idMatch ? idMatch[1] : null;

    if (!auctionId) {
        throw new Error('Could not extract Auction ID from URL: ' + createdUrl);
    }
    console.log(`Captured Auction ID: ${auctionId}`);

    console.log('Navigating to Auction List...');
    await page.getByRole('link', { name: 'Auction', exact: true }).click();
    try {
        await page.getByRole('link', { name: 'Auction List' }).click();
    } catch (e) {
        console.log('Auction List link not found, assuming already on list');
    }

    await page.waitForLoadState('networkidle');

    console.log(`Searching for Auction ID: ${auctionId}`);
    const searchInput = page.getByPlaceholder(/search|keyword|id/i).or(page.locator('input[name="id"]')).first();
    if (await searchInput.isVisible()) {
        await searchInput.fill(auctionId);
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
    }

    const row = page.locator('tr').filter({ hasText: auctionId }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    console.log('Found auction row.');

    // Delete Auction (Row Action Flow)
    console.log('Finding delete action in the row...');

    // Look for the delete action within the row
    // Try multiple robust selectors for the delete action inside the row
    const deleteAction = row.locator('a[title="Delete"], button[title="Delete"], a:has(.fa-trash), button:has(.fa-trash), a.btn-danger').first();

    await deleteAction.waitFor({ state: 'visible', timeout: 5000 });
    await deleteAction.click();
    console.log('Clicked delete action.');

    // Confirm Delete (Handle Modal)
    console.log('Waiting for confirmation modal...');
    const modal = page.locator('.modal').filter({ hasText: /delete/i }).first();
    await expect(modal).toBeVisible({ timeout: 10000 });

    console.log('Clicking Delete in modal...');
    const confirmBtn = modal.locator('.modal-footer button.btn-danger, button:has-text("Delete")').first();
    await confirmBtn.click();

    // Verify Auction Deleted
    console.log('Verifying deletion...');
    await expect(row).not.toBeVisible({ timeout: 10000 });
    console.log('Auction deleted successfully.');
});
