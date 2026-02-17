const { expect } = require('@playwright/test');
const { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config');

module.exports = async function login(page) {
  await page.goto(BASE_URL);

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

  try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch (e) { }

  await Promise.race([
    page.waitForURL(url => !url.toString().includes('login'), { timeout: 20000 }),
    page.getByRole('button', { name: /logout|sign out/i }).waitFor({ timeout: 20000 }).catch(() => null),
  ]).catch(async () => {
    await page.screenshot({ path: 'login-failure.png' });
    throw new Error('Login failed');
  });
};
