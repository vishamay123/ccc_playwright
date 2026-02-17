const { test, expect } = require('@playwright/test');

const { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./config');

test.setTimeout(300000);

// Login helper function
async function login(page) {
    console.log('Logging in...');
    await page.goto(BASE_URL);

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

test('Create and Delete User', async ({ page }) => {
    await login(page);

    console.log('Starting user creation...');

    // Navigate to Users section
    await page.getByRole('link', { name: 'Users', exact: true }).click();
    await page.getByRole('link', { name: ' Add User' }).click();

    console.log('Filling user form...');

    // Generate unique data to avoid conflicts
    const timestamp = Date.now();
    const uniqueEmail = `testuser${timestamp}@example.com`;

    // Random first names (letters only)
    const firstNames = ['David'];
    const randomIndex = Math.floor(Math.random() * firstNames.length);
    const uniqueFirstName = firstNames[randomIndex];

    const uniquePhone = `93132${timestamp.toString().slice(-5)}`; // Use last 5 digits of timestamp

    // Fill Customer Information
    await page.locator('input[name="customer[first_name]"]').click();
    await page.locator('input[name="customer[first_name]"]').fill(uniqueFirstName);

    await page.locator('input[name="customer[last_name]"]').click();
    await page.locator('input[name="customer[last_name]"]').fill('User');

    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);

    await page.locator('input[name="customer[country_code]"]').click();
    await page.locator('input[name="customer[country_code]"]').fill('+91');

    await page.getByRole('textbox', { name: 'Phone *' }).click();
    await page.getByRole('textbox', { name: 'Phone *' }).fill(uniquePhone);

    // Set status to Active (value 2)
    await page.locator('[id="customer[status]"]').selectOption('2');

    // Fill Address Information
    console.log('Filling address information...');
    await page.getByRole('tab', { name: 'Address' }).click();

    await page.getByRole('textbox', { name: 'Address' }).click();
    await page.getByRole('textbox', { name: 'Address' }).fill('Test Address');

    await page.locator('input[name="address[city]"]').click();
    await page.locator('input[name="address[city]"]').fill('Test City');

    await page.locator('input[name="address[message]"]').click();
    await page.locator('input[name="address[message]"]').fill('Test message from automation');

    // Save the user
    console.log('Saving user...');
    await page.getByRole('button', { name: 'Save & Continue' }).click();

    // Capture created user ID
    console.log('Waiting for successful creation...');

    // Wait for either URL change OR error message confirming creation
    try {
        await Promise.race([
            page.waitForURL(/\/(edit|customer)\/\d+/, { timeout: 10000 }),
            expect(page.getByText(/An email must have a "To", "Cc", or "Bcc" header/i)).toBeVisible({ timeout: 10000 })
        ]);
    } catch (e) {
        console.log('Neither redirect nor expected email warning occurred within timeout.');
    }

    const createdUrl = page.url();
    console.log(`Created User URL: ${createdUrl}`);

    // Try multiple patterns to extract ID
    const idMatch = createdUrl.match(/\/edit\/(\d+)/) ||
        createdUrl.match(/\/customer\/(\d+)/) ||
        createdUrl.match(/\/user\/(\d+)/) ||
        createdUrl.match(/id=(\d+)/);
    const userId = idMatch ? idMatch[1] : null;

    let searchIdentifier = userId;
    let isEmailSearch = false;

    if (!userId) {
        console.warn('Could not extract User ID from URL: ' + createdUrl);

        // Check for specific email warning which means SUCCESS
        const emailWarning = await page.getByText(/An email must have a "To", "Cc", or "Bcc" header/i).isVisible().catch(() => false);

        if (emailWarning) {
            console.log('User created successfully (confirmed by email header warning).');
            console.log(`Will search by Email: ${uniqueEmail}`);
            searchIdentifier = uniqueEmail;
            isEmailSearch = true;
        } else {
            // Check for actual errors
            const errorMsg = await page.locator('.alert-danger, .error, .alert-error').textContent().catch(() => null);
            if (errorMsg) {
                console.log('Error message found:', errorMsg);
            }
            throw new Error('User creation failed - could not capture user ID and no success warning found');
        }
    } else {
        console.log(`Captured User ID: ${userId}`);
    }

    // Navigate to Customer List directly ensures we are on the right page
    console.log('Navigating to Customer List...');
    await page.goto(`${BASE_URL}/backend/customer`);
    await page.waitForLoadState('networkidle');

    // Search for the created user using Identifier (Email)
    console.log(`Searching for User: ${searchIdentifier}`);

    // Ensure search input is visible and clear it before typing
    const searchInput = page.getByPlaceholder(/search|keyword|id/i).or(page.locator('input[name="id"]')).first();
    if (await searchInput.isVisible()) {
        await searchInput.fill('');
        await searchInput.fill(searchIdentifier);
        await searchInput.press('Enter');
        await page.waitForTimeout(3000);
    } else {
        console.log('Search input not found, trying to find row without search...');
    }

    // Find the user row
    // Filter by the username part of the email (before @) to handle potential truncation in table
    const usernamePart = searchIdentifier.split('@')[0];
    const row = page.locator('tr').filter({ hasText: usernamePart }).first();
    try {
        await row.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Found user row by identifier: ' + searchIdentifier);
    } catch (e) {
        console.log('Could not find row by identifier. Dumping row text:');
        const rows = await page.locator('tr').allInnerTexts();
        console.log(rows);
        throw e;
    }

    // Delete User (Row Action Flow)
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

    // Verify User Deleted
    console.log('Verifying deletion...');
    await expect(row).not.toBeVisible({ timeout: 10000 });
    console.log('User deleted successfully.');
});
