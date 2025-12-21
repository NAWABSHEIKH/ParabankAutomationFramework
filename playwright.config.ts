import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    headless: false,
    baseURL: "https://parabank.parasoft.com/parabank",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
});
 