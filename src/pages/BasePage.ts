import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }


  async goto(path = '/') {
  for (let i = 0; i < 3; i++) {
    try {
      await this.page.goto(`https://parabank.parasoft.com${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
      return;
    } catch (err) {
      console.log(`Retrying navigation... (${i + 1})`);
      if (i === 2) throw err; // throw on 3rd failure
    }
  }
}

  // async goto(path = '/') {
  //   await this.page.goto(path,{ waitUntil: 'domcontentloaded', timeout: 30000 });  // { waitUntil: 'networkidle' }
  // }

  async getTitle() {
    return this.page.title();
  }

  async clickLocator(locator: Locator) {
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }
}
