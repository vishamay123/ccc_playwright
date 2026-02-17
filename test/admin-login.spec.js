const { test, expect } = require('@playwright/test');
const { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./config');

test('Admin Login', async ({ page }) => {
  // Step 1: Open Website
  await page.goto(BASE_URL);

  // Step 2: Fill Login Form
  // Email field - try getByPlaceholder first, then getByLabel
  const emailInput = page.getByPlaceholder(/email|username/i).or(page.getByLabel(/email|username/i)).first();
  await emailInput.fill(ADMIN_EMAIL);

  // Password field
  const passwordInput = page.getByPlaceholder(/password/i).or(page.getByLabel(/password/i)).first();
  await passwordInput.fill(ADMIN_PASSWORD);

  // Step 3: Submit Login
  // Click the Login button using getByRole
  const loginButton = page.getByRole('button', { name: /login|sign in/i });
  await loginButton.click();

  // Step 4: Verify Login Success
  // Wait for navigation away from login page or for a post-login element
  await Promise.race([
    page.waitForURL(url => !url.toString().includes('login'), { timeout: 5000 }),
    page.getByRole('button', { name: /logout|sign out/i }).waitFor({ timeout: 5000 }).catch(() => null),
    page.getByText(/dashboard|welcome|profile/i).waitFor({ timeout: 5000 }).catch(() => null)
  ]).catch(() => {
    // If none of the primary indicators work, take a screenshot for debugging
    page.screenshot({ path: 'login-failure.png' });
    throw new Error('Login verification failed');
  });

  // Assert that we're no longer on the login page
  expect(page.url()).not.toContain('login');
});
