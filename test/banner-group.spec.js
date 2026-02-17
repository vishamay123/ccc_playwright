const { test, expect } = require('@playwright/test');
const login = require('./helpers/login');

const { BASE_URL } = require('./config');

test.setTimeout(120000); // 2 minutes timeout for robustness

test('Banner Group Create and Delete', async ({ page }) => {
    console.log('Starting Banner Group Test...');

    // Precondition: Login
    console.log('Logging in...');
    await login(page);
    await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });
    console.log('Login successful');

    // 1. Navigate to Banner Group List
    console.log('Navigating to Banner Group List...');
    await page.goto(`${BASE_URL}/backend/bannergroup`);
    await expect(page).toHaveURL(/bannergroup/);

    // 2. Create New Banner Group
    console.log('Clicking Create...');
    await page.getByRole('button', { name: 'Create' }).click();

    // 3. Fill Banner Group Form
    console.log('Filling form...');
    const uniqueId = Date.now();
    const name = `Test Banner Group - ${uniqueId}`;
    const code = `CODE-${uniqueId}`;

    // Fill Name
    await page.getByRole('textbox', { name: /name/i }).fill(name);

    // Fill Code
    const codeInput = page.locator('input[name*="code"]').or(page.getByRole('textbox').nth(1));
    await codeInput.fill(code);

    // Fill Sort Order
    const sortOrder = page.locator('input[name*="sort_order"]').or(page.getByRole('spinbutton')).or(page.locator('input[type="number"]'));
    await sortOrder.fill('1');

    // Set Status (Active)
    await page.evaluate(() => {
        const status = document.querySelector('input[name="status"]');
        if (status) status.checked = true;
    });

    // 4. Save and Continue
    console.log('Saving...');
    await page.getByRole('button', { name: /save & continue/i }).click();

    // 5. Confirm Redirect to Edit Page & Capture ID
    console.log('Verifying creation redirect and capturing ID...');
    await expect(page).toHaveURL(/\/edit\/(\d+)/, { timeout: 30000 });

    const url = page.url();
    const idMatch = url.match(/\/edit\/(\d+)/);
    const id = idMatch ? idMatch[1] : null;

    if (!id) {
        throw new Error(`Could not capture ID from URL: ${url}`);
    }
    console.log(`Captured Banner Group ID: ${id}`);

    // 6. Find the Created Banner Group in List
    console.log('Going back to list to verify...');
    await page.goto(`${BASE_URL}/backend/bannergroup`);

    // Verify row exists by ID (Using strict cell match)
    // We use a regex to match the ID exactly in a cell, to avoid partial matches
    const idRegex = new RegExp(`^\\s*${id}\\s*$`);
    const row = page.locator('tr').filter({ has: page.locator('td', { hasText: idRegex }) }).first();

    // Fallback if strict match fails (just in case ID is formatted differently)
    if (await row.count() === 0) {
        console.log(`Strict ID match failed for ${id}. Trying loose match...`);
    }

    // Determine final row locator
    // Note: We use a fresh locator for 'loose' match if needed
    const finalRow = (await row.count() > 0) ? row : page.locator('tr').filter({ hasText: id }).first();

    await expect(finalRow).toBeVisible({ timeout: 10000 });
    console.log(`Created Banner Group found in list with ID: ${id}`);

    // Log row text for debugging
    const rowText = await finalRow.innerText().catch(() => 'Error reading text');
    console.log(`Row content: ${rowText.replace(/\n/g, ' ')}`);

    // 7. Delete Banner Group (Row Action Flow)
    console.log('Finding delete icon in the row...');

    // Look for the delete action within the finalRow
    // Based on user description: "actions for delete and in that colume click on delete icon"
    // Usually an anchor or button with a delete icon (trash)
    // We try multiple robust selectors for the delete action inside the row
    const deleteAction = finalRow.locator('a[title="Delete"], button[title="Delete"], a:has(.fa-trash), button:has(.fa-trash), a.btn-danger').first();

    await deleteAction.waitFor({ state: 'visible', timeout: 5000 });
    await deleteAction.click();

    // 8. Confirm Delete (Handle Modal)
    console.log('Waiting for confirmation modal...');
    // User mentioned: "so it come pops and then click on delete"
    // We target the modal that appears
    const modal = page.locator('.modal').filter({ hasText: /delete/i }).first();
    await expect(modal).toBeVisible({ timeout: 10000 });

    console.log('Clicking Delete in modal...');
    const confirmBtn = modal.locator('.modal-footer button.btn-danger, button:has-text("Delete")').first();
    await confirmBtn.click();

    // 9. Verify Banner Group Deleted
    console.log('Verifying deletion...');
    await expect(row).not.toBeVisible({ timeout: 10000 });
    console.log('Banner Group deleted successfully.');
});
