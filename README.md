# Playwright E2E Test Suite

Automated end-to-end testing suite for the CyberCom application using Playwright.

## 📁 Project Structure

```
playwright/
├── test/                      # Test files
│   ├── helpers/              # Shared helper functions
│   │   └── login.js         # Login helper
│   ├── fixtures/            # Test fixtures and data
│   ├── admin-login.spec.js
│   ├── artwork-create.spec.js
│   ├── auction-create.spec.js
│   ├── banner-group.spec.js
│   ├── cms-blocks.spec.js
│   ├── cms-pages.spec.js
│   ├── mail-templates.spec.js
│   ├── menus.spec.js
│   ├── system-admin.spec.js
│   ├── system-attributes.spec.js
│   └── user-create.spec.js
├── docs/                     # Test specifications (markdown)
│   ├── artwork-create-spec.md
│   ├── auction-create-delete.md
│   ├── banner-group.md
│   ├── cms-blocks.md
│   ├── cms-pages.md
│   ├── loging.md
│   ├── mail-templates.md
│   ├── menus.md
│   ├── system-admin.md
│   ├── system-attributes.md
│   └── user-create-spec.md
├── playwright-report/        # Test execution reports
├── test-results/            # Test results and artifacts
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md

```

## 🚀 Getting Started

### System Requirements

- **Operating System**: Windows 10+, macOS 12+, or Ubuntu 20.04+
- **Node.js**: Version 16 or higher (LTS recommended)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: ~1GB for Playwright and browsers

### Step 1: Install Node.js

If you don't have Node.js installed:

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer (choose LTS version)
3. Verify installation:
```bash
node --version
npm --version
```

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### Step 2: Clone or Navigate to Project

```bash
cd c:/Users/hello/OneDrive/Desktop/cybercom/playwright
```

### Step 3: Install Project Dependencies

```bash
npm install
```

This will install:
- `@playwright/test` - Playwright test runner
- All required dependencies from `package.json`

### Step 4: Install Playwright Browsers

Playwright requires browser binaries to run tests. Install them with:

```bash
npx playwright install
```

This downloads:
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari engine)

**Install specific browser only:**
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

**Install with system dependencies (Linux):**
```bash
npx playwright install --with-deps
```

### Step 5: Verify Installation

Run a test to verify everything is working:

```bash
npx playwright test test/admin-login.spec.js --headed
```

You should see a browser window open and the test execute.

### Step 6: Configure Environment (Optional)

If your application requires environment variables, create a `.env` file:

```bash
# .env
BASE_URL=http://52.91.192.7
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
```

### Troubleshooting Installation

**Issue: `npx: command not found`**
- Solution: Reinstall Node.js or add npm to PATH

**Issue: Browser installation fails**
- Solution: Run with admin/sudo privileges
```bash
# Windows (Run as Administrator)
npx playwright install

# Linux/macOS
sudo npx playwright install
```

**Issue: Tests fail with timeout**
- Solution: Check network connectivity to BASE_URL
- Increase timeout in `playwright.config.ts`

**Issue: Permission denied errors**
- Solution: Fix npm permissions
```bash
# Linux/macOS
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ./node_modules
```

---

## 🤖 Playwright MCP Server Setup

The Playwright MCP (Model Context Protocol) Server allows AI assistants to interact with Playwright for browser automation. This is useful for AI-assisted test generation and debugging.

### What is Playwright MCP Server?

Playwright MCP Server is a bridge that allows AI tools (like Claude, ChatGPT, etc.) to:
- ✅ Control browsers programmatically
- ✅ Generate test scripts automatically
- ✅ Debug test failures interactively
- ✅ Capture screenshots and recordings
- ✅ Inspect page elements

### Step 1: Install Playwright MCP Server

The MCP server is installed via npx (no permanent installation needed):

```bash
npx -y @playwright/mcp
```

**What this does:**
- `-y` flag automatically accepts the installation
- `@playwright/mcp` is the official Playwright MCP package
- Downloads and runs the MCP server

### Step 2: Configure MCP Server

Create or update `.vscode/mcp.json` in your project:

```bash
# Create .vscode directory if it doesn't exist
mkdir .vscode

# Create mcp.json file
```

Add the following configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx.cmd",
      "args": [
        "-y",
        "@playwright/mcp",
        "--output-dir",
        "C:\\Users\\hello\\OneDrive\\Desktop\\cybercom\\playwright",
        "--allow-unrestricted-file-access",
        "--browser",
        "chrome"
      ],
      "env": {
        "DEBUG": "pw:mcp*"
      }
    }
  }
}
```

### Configuration Explained

**`command: "npx.cmd"`**
- On Windows, uses `npx.cmd` to run Node packages
- On macOS/Linux, use `"npx"` instead

**`args` array:**

1. **`"-y"`** - Auto-accept package installation
   - Prevents interactive prompts
   - Useful for automated workflows

2. **`"@playwright/mcp"`** - The MCP server package
   - Official Playwright MCP implementation
   - Handles browser automation requests

3. **`"--output-dir"`** - Specifies where to save artifacts
   - Screenshots, videos, traces
   - Set to your project directory

4. **`"C:\\Users\\hello\\OneDrive\\Desktop\\cybercom\\playwright"`**
   - Your project path (use double backslashes on Windows)
   - Change this to match your actual project location
   - On macOS/Linux: `/path/to/your/project`

5. **`"--allow-unrestricted-file-access"`** - File system permissions
   - Allows MCP server to read/write test files
   - Required for test generation and artifact saving

6. **`"--browser"`** - Default browser to use
   - Options: `chrome`, `firefox`, `webkit`
   - Can be changed based on your testing needs

**`env` object:**

- **`"DEBUG": "pw:mcp*"`** - Enable debug logging
  - Shows detailed MCP server activity
  - Helpful for troubleshooting
  - Remove or set to `""` to disable

### Step 3: Platform-Specific Configuration

**Windows:**
```json
{
  "command": "npx.cmd",
  "args": [
    "-y",
    "@playwright/mcp",
    "--output-dir",
    "C:\\Users\\YourUsername\\path\\to\\project",
    "--allow-unrestricted-file-access",
    "--browser",
    "chrome"
  ]
}
```

**macOS/Linux:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@playwright/mcp",
    "--output-dir",
    "/Users/username/path/to/project",
    "--allow-unrestricted-file-access",
    "--browser",
    "chrome"
  ]
}
```

### Step 4: Verify MCP Server

Test the MCP server manually:

```bash
npx -y @playwright/mcp --output-dir . --browser chrome
```

**Expected output:**
```
Playwright MCP Server started
Listening for commands...
```

Press `Ctrl+C` to stop the server.

### Step 5: Using MCP Server with AI Tools

Once configured, AI assistants can:

**Generate tests:**
```
AI: "Create a test that logs in and creates a new user"
→ MCP Server generates test/new-user.spec.js
```

**Debug failures:**
```
AI: "Why is the login test failing?"
→ MCP Server runs test, captures screenshot, analyzes error
```

**Inspect elements:**
```
AI: "What's the selector for the submit button?"
→ MCP Server opens page, finds element, returns selector
```

### Common MCP Commands

**Start MCP server:**
```bash
npx -y @playwright/mcp --output-dir . --browser chrome
```

**Use different browser:**
```bash
npx -y @playwright/mcp --output-dir . --browser firefox
npx -y @playwright/mcp --output-dir . --browser webkit
```

**Enable verbose logging:**
```bash
DEBUG=pw:mcp* npx -y @playwright/mcp --output-dir .
```

**Specify custom port:**
```bash
npx -y @playwright/mcp --output-dir . --port 3000
```

### Troubleshooting MCP Server

**Issue: MCP server won't start**
- Solution: Check if port is already in use
- Try different port: `--port 3001`

**Issue: File access denied**
- Solution: Ensure `--allow-unrestricted-file-access` flag is set
- Check folder permissions

**Issue: Browser not found**
- Solution: Install browsers first
```bash
npx playwright install chrome
```

**Issue: Connection refused**
- Solution: Check firewall settings
- Ensure MCP server is running

### Security Considerations

⚠️ **Important Security Notes:**

1. **File Access**: `--allow-unrestricted-file-access` gives broad permissions
   - Only use in trusted environments
   - Don't expose MCP server to public networks

2. **Output Directory**: Ensure it points to project folder
   - Prevents writing files to system directories

3. **Debug Mode**: Disable in production
   - Debug logs may contain sensitive information

### Advanced Configuration

**Custom browser executable:**
```json
{
  "args": [
    "-y",
    "@playwright/mcp",
    "--output-dir",
    ".",
    "--browser-executable",
    "/path/to/chrome"
  ]
}
```

**Headless mode:**
```json
{
  "args": [
    "-y",
    "@playwright/mcp",
    "--output-dir",
    ".",
    "--headless"
  ]
}
```

**Multiple browser support:**
```json
{
  "args": [
    "-y",
    "@playwright/mcp",
    "--output-dir",
    ".",
    "--browser",
    "chrome,firefox,webkit"
  ]
}
```

---

## 🧠 How AI + MCP Work Together

Understanding the relationship between AI, MCP Server, Playwright, and the browser is crucial for effective test automation.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Assistant (Antigravity)              │
│                    🧠 Brain - Makes Decisions               │
│  • Analyzes requirements                                    │
│  • Generates test logic                                     │
│  • Observes browser state                                   │
│  • Creates Playwright scripts                               │
└────────────────────┬────────────────────────────────────────┘
                     │ Sends commands
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Playwright MCP Server                          │
│                📡 Messenger - Executes Commands             │
│  • Receives AI requests                                     │
│  • Translates to Playwright API                             │
│  • Returns browser state to AI                              │
└────────────────────┬────────────────────────────────────────┘
                     │ Controls via API
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Playwright                               │
│                  🎮 Controller - Browser Automation         │
│  • Executes browser actions                                 │
│  • Captures screenshots/videos                              │
│  • Reads DOM elements                                       │
└────────────────────┬────────────────────────────────────────┘
                     │ Automates
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Chrome/Firefox/WebKit)          │
│                  🌍 Executes Actions                        │
│  • Renders pages                                            │
│  • Performs clicks, typing, navigation                      │
│  • Provides DOM state                                       │
└─────────────────────────────────────────────────────────────┘
```

### Component Roles

| Component | Role | Responsibilities |
|-----------|------|------------------|
| **AI Assistant** | 🧠 Brain | Thinks, analyzes, generates code |
| **MCP Server** | 📡 Messenger | Bridges AI ↔ Playwright |
| **Playwright** | 🎮 Controller | Automates browser actions |
| **Browser** | 🌍 Executor | Runs the actual web application |

### Two Modes of Operation

#### 🟢 Mode 1: Script Generation Only (No Live Browser)

**User Request:**
```
"Generate a login test script"
```

**What Happens:**
1. ✅ AI uses its knowledge of Playwright
2. ✅ AI generates code based on best practices
3. ✅ Returns complete test script
4. ❌ **No browser is opened**
5. ❌ **No MCP is used**

**Example Output:**
```javascript
const { test, expect } = require('@playwright/test');

test('Login Test', async ({ page }) => {
  await page.goto('http://example.com/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
});
```

**Pros:**
- ✅ Fast generation
- ✅ No browser overhead

**Cons:**
- ⚠️ May use generic selectors
- ⚠️ Might not match actual page structure

---

#### 🔵 Mode 2: Live Browser + AI Analysis (Smart Mode)

**User Request:**
```
"Open http://example.com and generate automation script for login"
```

**What Happens:**

**Step 1: AI → MCP → Browser**
```
AI: "Open browser and navigate to http://example.com"
  ↓
MCP: Executes command via Playwright
  ↓
Browser: Opens and loads page
```

**Step 2: AI Reads Page Structure**
```
AI: "Get page snapshot"
  ↓
MCP: Captures DOM structure
  ↓
AI: Receives HTML/accessibility tree
```

**Step 3: AI Analyzes Elements**
```
AI analyzes:
- Input fields (email, password)
- Buttons (submit, login)
- Form structure
- ARIA labels
- Unique identifiers
```

**Step 4: AI Generates Accurate Script**
```javascript
// AI generates based on ACTUAL page structure
const { test, expect } = require('@playwright/test');

test('Login Test', async ({ page }) => {
  await page.goto('http://example.com/login');
  
  // AI found actual selectors from live page
  await page.getByLabel('Email Address').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // AI verified the success indicator
  await expect(page.getByText('Welcome back!')).toBeVisible();
});
```

**Step 5: AI Returns Script**
```
AI: "Here's your test script with accurate selectors"
```

**Pros:**
- ✅ Uses **real selectors** from actual page
- ✅ More stable and reliable
- ✅ Matches current UI structure
- ✅ Can verify elements exist

**Cons:**
- ⚠️ Slower (browser startup)
- ⚠️ Requires MCP server running

---

### Workflow Comparison

#### Without MCP (Blind Generation)
```
User Request
    ↓
AI generates code from knowledge
    ↓
Returns script (may need adjustments)
```

#### With MCP (Smart Generation)
```
User Request
    ↓
AI → MCP → Opens Browser
    ↓
AI → MCP → Reads Page DOM
    ↓
AI analyzes actual elements
    ↓
AI generates accurate script
    ↓
Returns production-ready script
```

---

### Real-World Example

**Scenario:** Create a test for adding a product to cart

**❌ Without MCP (Guessing):**
```javascript
// AI guesses common selectors
await page.click('.add-to-cart-button');
await page.click('#cart-icon');
```
**Problem:** Selectors might not exist or be different

**✅ With MCP (Accurate):**
```javascript
// AI inspects actual page and finds real selectors
await page.getByRole('button', { name: 'Add to Cart' }).click();
await page.getByLabel('Shopping Cart (1 item)').click();
```
**Benefit:** Uses exact selectors from live page

---

### Key Clarifications

#### ❓ Does MCP Control the Browser?
**✅ YES** - MCP controls the browser through Playwright

#### ❓ Does MCP Think?
**❌ NO** - MCP only executes commands. AI does the thinking.

#### ❓ Can AI Generate Scripts Without MCP?
**✅ YES** - But scripts may need manual adjustments

#### ❓ When Should I Use MCP?
**Use MCP when:**
- ✅ You want accurate, real-world selectors
- ✅ Page structure is complex or unknown
- ✅ You need to debug existing tests
- ✅ You want AI to inspect live elements

**Skip MCP when:**
- ✅ You know the exact selectors
- ✅ Generating simple, generic tests
- ✅ Working offline

---

### How AI Reads DOM Through MCP

**1. AI Requests Page Snapshot**
```
AI → MCP: "Give me accessibility tree of current page"
```

**2. MCP Captures DOM**
```javascript
// MCP internally runs:
const snapshot = await page.accessibility.snapshot();
```

**3. AI Receives Structure**
```json
{
  "role": "main",
  "name": "Login Form",
  "children": [
    {
      "role": "textbox",
      "name": "Email Address",
      "value": ""
    },
    {
      "role": "textbox",
      "name": "Password",
      "value": ""
    },
    {
      "role": "button",
      "name": "Sign In"
    }
  ]
}
```

**4. AI Analyzes and Generates**
```javascript
// AI creates selectors based on actual structure
await page.getByLabel('Email Address').fill('...');
await page.getByLabel('Password').fill('...');
await page.getByRole('button', { name: 'Sign In' }).click();
```

---

### How AI Decides Selectors

**Priority Order (Most Stable → Least Stable):**

1. **🥇 Role-based selectors** (Recommended)
   ```javascript
   page.getByRole('button', { name: 'Submit' })
   ```
   - Most stable
   - Accessibility-friendly
   - Works across UI changes

2. **🥈 Label-based selectors**
   ```javascript
   page.getByLabel('Email')
   ```
   - User-facing text
   - Stable across redesigns

3. **🥉 Text content**
   ```javascript
   page.getByText('Welcome')
   ```
   - Good for verification
   - May break with translations

4. **⚠️ CSS selectors** (Last resort)
   ```javascript
   page.locator('.btn-primary')
   ```
   - Fragile
   - Breaks with CSS changes

**AI automatically chooses the best selector based on:**
- Element accessibility attributes
- Uniqueness
- Stability
- Best practices

---

### Making Generated Scripts More Stable

**1. Use Unique Test Data**
```javascript
// ✅ Good - Timestamp ensures uniqueness
const email = `test_${Date.now()}@example.com`;

// ❌ Bad - May conflict with existing data
const email = 'test@example.com';
```

**2. Add Explicit Waits**
```javascript
// ✅ Good - Wait for element
await page.waitForSelector('.success-message');

// ❌ Bad - Assume immediate appearance
await page.click('.next-button');
```

**3. Verify State Changes**
```javascript
// ✅ Good - Verify navigation
await expect(page).toHaveURL(/dashboard/);

// ❌ Bad - No verification
await page.click('Login');
```

**4. Use BASE_URL Constant**
```javascript
// ✅ Good - Configurable
const BASE_URL = 'http://52.91.192.7';
await page.goto(`${BASE_URL}/login`);

// ❌ Bad - Hardcoded
await page.goto('http://52.91.192.7/login');
```

---

### Summary

**The Complete Flow:**

```
You: "Create login test"
  ↓
AI: Sends MCP command to open browser
  ↓
MCP: Opens browser via Playwright
  ↓
Browser: Loads login page
  ↓
MCP: Captures page structure
  ↓
AI: Analyzes DOM, finds selectors
  ↓
AI: Generates Playwright script
  ↓
You: Receive production-ready test
```

**Remember:**
- 🧠 **AI** = Thinks and generates code
- 📡 **MCP** = Bridges AI and Playwright
- 🎮 **Playwright** = Controls the browser
- 🌍 **Browser** = Executes the actions

This architecture enables **AI-assisted test automation** that's both intelligent and accurate! 🚀

---

## 🧪 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test test/system-admin.spec.js
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests with specific reporter
```bash
npx playwright test --reporter=list
npx playwright test --reporter=html
```

## 📊 View Test Reports

```bash
npx playwright show-report
```

## 📝 Test Specifications

Each test has a corresponding markdown specification in the `docs/` folder that describes:
- Test overview and objectives
- Prerequisites and setup
- Detailed test flow
- Success indicators
- Important notes and edge cases

These specifications serve as:
- Documentation for test behavior
- Reference for regenerating tests
- Onboarding material for new team members

## 🔧 Configuration

Test configuration is managed in `playwright.config.ts`:
- **Timeout**: 2 minutes per test
- **Base URL**: http://52.91.192.7
- **Browsers**: Chromium, Firefox, WebKit
- **Parallel execution**: Enabled
- **Retries**: 0 (local), 2 (CI)

## 📋 Test Coverage

### System Tests
- ✅ Admin Login
- ✅ System Admin (Create & Permanent Delete)
- ✅ System Attributes (Create & Delete)

### CMS Tests
- ✅ CMS Blocks (Create & Delete)
- ✅ CMS Pages (Create & Delete)
- ✅ Mail Templates (Create & Delete)
- ✅ Menus (Create & Delete)

### User Management
- ✅ User Create & Delete

### Content Management
- ✅ Artwork Create
- ✅ Auction Create & Delete
- ✅ Banner Group (Create & Delete)

## 🛠️ Helper Functions

### Login Helper (`test/helpers/login.js`)
Reusable login function used across all tests:
```javascript
const login = require('./helpers/login');
await login(page);
```

## 🎯 Best Practices

1. **Unique Data**: All tests use timestamp-based unique identifiers to avoid conflicts
2. **Direct Navigation**: Tests use `page.goto()` with BASE_URL for reliable navigation
3. **Robust Selectors**: Tests prefer role-based and accessible selectors
4. **Cleanup**: All tests clean up created data (delete after create)
5. **Verification**: Tests verify both creation and deletion success

## 📖 Writing New Tests

1. Create test file in `test/` folder
2. Use the login helper for authentication
3. Define BASE_URL constant
4. Generate unique test data using timestamps
5. Follow the pattern: Create → Verify → Delete → Verify
6. Create corresponding markdown spec in `docs/`

Example template:
```javascript
const { test, expect } = require('@playwright/test');
const login = require('./helpers/login');

const BASE_URL = 'http://52.91.192.7';

test.setTimeout(120000);

test('Your Test Name', async ({ page }) => {
    await login(page);
    
    const uniqueId = Date.now().toString();
    // Your test logic here
});
```

## 🐛 Troubleshooting

### Tests timing out
- Increase timeout in test file: `test.setTimeout(180000)`
- Check network connectivity to BASE_URL

### Selectors not found
- Run test in headed mode to inspect elements
- Check if UI has changed
- Update selectors in test file

### Login failures
- Verify credentials in `test/helpers/login.js`
- Check if login page structure has changed

## 📞 Support

For issues or questions, refer to the test specifications in the `docs/` folder or contact the QA team.

---

**Last Updated**: February 2026
