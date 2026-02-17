import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './test',

    fullyParallel: true,
    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 2 : undefined,

    timeout: 60000,

    expect: {
        timeout: 10000,
    },

    reporter: process.env.CI
        ? [['html'], ['junit', { outputFile: 'results.xml' }]]
        : 'html',

    use: {
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        headless: true,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 15000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
