const { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config');

module.exports = async function login(page) {
  await page.goto(BASE_URL);

  // Fill email
  const emailInput = page
    .getByPlaceholder(/email|username/i)
    .or(page.getByLabel(/email|username/i))
    .first();
  await emailInput.waitFor({ timeout: 10000 });
  await emailInput.fill(ADMIN_EMAIL);

  // Fill password
  const passwordInput = page
    .getByPlaceholder(/password/i)
    .or(page.getByLabel(/password/i))
    .first();
  await passwordInput.fill(ADMIN_PASSWORD);

  // Click login button or press Enter
  const loginButton = page.getByRole('button', { name: /login|sign in/i }).first();
  if (await loginButton.count() > 0) {
    await loginButton.click();
  } else {
    await passwordInput.press('Enter');
  }

  // Wait for navigation away from the login page
  try {
    await page.waitForURL((url) => !url.toString().includes('login'), { timeout: 20000 });
  } catch {
    await page.screenshot({ path: 'login-failure.png' });
    throw new Error(`Login failed — still on login page. URL: ${page.url()}`);
  }

  // Wait for page to settle
  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  } catch {
    // non-fatal, some apps never reach networkidle
  }
};