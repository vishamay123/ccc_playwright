const { test, expect } = require('@playwright/test');

const { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./config');

test.setTimeout(300000);

// Login helper function
async function login(page) {
    console.log('Logging in...');
    await page.goto(BASE_URL);

    // If already logged in, we might be redirected to dashboard or similar
    if (await page.url().includes('login')) {
        const emailInput = page.getByPlaceholder(/email|username/i).or(page.getByLabel(/email|username/i)).first();
        await emailInput.fill(ADMIN_EMAIL);

        const passwordInput = page.getByPlaceholder(/password/i).or(page.getByLabel(/password/i)).first();
        await passwordInput.fill(ADMIN_PASSWORD);

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

test('Artwork Create (E2E)', async ({ page }) => {
    // 1) Open Website
    await page.goto(BASE_URL);

    // Precondition: Login
    await login(page);

    // 2) Open Artwork List
    console.log('Navigating to Artwork List...');
    await page.click('text=Auction');
    await page.waitForTimeout(500);
    await page.click('text=Artwork List');
    await page.waitForTimeout(3000);

    // 3) Create Artwork
    console.log('Clicking Create Artwork...');
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(3000);

    // 4) Fill Artwork Information
    console.log('Filling Artwork Information...');
    await page.fill('[name="en[title]"]', 'test');

    // Rich Text (Summernote) - check visibility or fallback
    const descEditor = page.locator('.note-editable').first();
    if (await descEditor.isVisible()) {
        await descEditor.fill('test');
    } else {
        await page.fill('[name="en[description]"]', 'test');
    }

    await page.fill('[name="en[provenance]"]', 'tets');
    await page.fill('[name="en[exhibition_history]"]', 'test');
    await page.fill('[name="en[catalog_notes]"]', 'test');
    await page.fill('[name="artist"]', 'Test QA');
    await page.fill('[name="year"]', '2026');
    await page.fill('[name="dimensions"]', '4*4');
    await page.fill('[name="tags"]', 'etst');

    // 5) Upload Required Documents
    console.log('Uploading Reports...');
    await page.setInputFiles('input[id="condition_report"]', 'tests/fixtures/sample.pdf');
    await page.setInputFiles('input[id="fact_sheet"]', 'tests/fixtures/sample.pdf');

    // 6) Fill Auction Fields
    console.log('Filling Auction Fields...');
    await page.selectOption('#artwork_type', { label: 'Auction' });
    await page.fill('[name="starting_bid"]', '1');
    await page.fill('[name="minimum_increment"]', '5');

    // 7) Upload Artwork Images
    console.log('Uploading Artwork Images...');
    await page.click('text=Artwork Files');
    await page.waitForTimeout(1000);
    await page.setInputFiles('input[name="artworkfiles[0][file]"]', 'tests/fixtures/sample.jpg');

    // 8) Save and Continue
    console.log('Saving...');
    await page.click('button:has-text("Save & Continue")');

    // 9) Capture Created Artwork Details URL + ID (MUST)
    console.log('Capturing Created Artwork URL...');
    // Wait for the URL to contain 'edit' or 'id', implying successful creation/redirect
    await expect(page).toHaveURL(/\/(edit|artwork)\/|\?id=/, { timeout: 30000 });

    const createdArtworkUrl = page.url();
    console.log(`Created Artwork URL: ${createdArtworkUrl}`);

    // Extract ID (just for logging/verification purposes)
    const idMatch = createdArtworkUrl.match(/\/edit\/(\d+)/) || createdArtworkUrl.match(/id=(\d+)/);
    const createdArtworkId = idMatch ? idMatch[1] : 'unknown';
    console.log(`Created Artwork ID: ${createdArtworkId}`);

    console.log('Artwork Created Successfully!');
});
