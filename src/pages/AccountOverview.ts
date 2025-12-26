import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountOverview extends BasePage {

  private readonly accountsOverviewLink: Locator;
  private readonly accountRows: Locator;
  private readonly overviewHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.accountsOverviewLink = page.getByRole("link", { name: "Accounts Overview" });
    this.accountRows = page.locator("tbody tr");
    this.overviewHeading = page.locator("#showOverview h1.title");
  }

  async openAccountsOverview(): Promise<void> {
    await this.accountsOverviewLink.click();
  }

  async getHeadingText(): Promise<string | null> {
    await this.overviewHeading.waitFor({ state: "visible" });
    return this.overviewHeading.textContent();
  }

  // 🔹 Calculates total from individual account rows
  async getCalculatedTotalBalance(): Promise<number> {
    await this.accountRows.first().waitFor({ state: "visible" });

    const rows = await this.accountRows.all();
    let calculatedTotal = 0;

    for (const row of rows) {
      const firstCellText = await row.locator("td").first().textContent();

      // Skip the summary "Total" row
      if (firstCellText?.trim() === "Total") {
        continue;
      }

      const balanceText = await row.locator("td").nth(1).textContent();

      if (balanceText) {
        calculatedTotal += Number(
          balanceText.replace("$", "").replace(",", "").trim()
        );
      }
    }

    return calculatedTotal;
  }

  // 🔹 Reads total value displayed in UI
  async getDisplayedTotalBalance(): Promise<number> {
    const totalRow = this.accountRows.filter({ hasText: "Total" });

    const totalText = await totalRow
      .locator("td")
      .nth(1)
      .textContent();

    return Number(
      totalText?.replace("$", "").replace(",", "").trim()
    );
  }



  //Newly added method
    // 🔹 Verify newly created account exists and click it
  async verifyAndClickAccount(accountId: string): Promise<boolean> {

    // Wait until table is visible
    await this.accountRows.first().waitFor({ state: "visible" });

    const rows = await this.accountRows.all();

    for (const row of rows) {
      const accountIdText =
        (await row.locator("td a").textContent())?.trim();

      if (accountIdText === accountId) {
        await row.locator("td a").click();
        return true;
      }
    }

    return false;
  }




}
