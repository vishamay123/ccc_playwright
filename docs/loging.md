# Playwright E2E - Admin Login (JavaScript)

## Goal
Generate a single Playwright test file in JavaScript that logs in as admin.

## Script Requirements
- Use Playwright Test (`@playwright/test`)
- Put `const BASE_URL = "http://52.91.192.7/";` at the very top of the generated script
- Navigate using `await page.goto(BASE_URL);`
- Keep the test in one file (no extra helpers)
- Use stable selectors preference:
  1) getByRole
  2) getByLabel
  3) getByPlaceholder
  4) getByText
  5) css/xpath only if required

## Test: Admin Login

### Step 1: Open Website
- Go to: BASE_URL

### Step 2: Fill Login Form
- In the email field, type: `admin@gmail.com`
- In the password field, type: `123123`

### Step 3: Submit Login
- Click the "Login" button

### Step 4: Verify Login Success
- Assert that login succeeded by checking at least ONE:
  - URL changes away from the login page, OR
  - A visible element that only appears after login (e.g., "Dashboard", "Logout", profile name, etc.)
- If uncertain, add a screenshot on failure and keep assertions reasonable.

