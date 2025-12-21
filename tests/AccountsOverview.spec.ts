import { test, expect } from "@playwright/test";
import { AccountOverview } from "../src/pages/AccountOverview";
import { LoginPage } from "../src/pages/LoginPage";
import { staticData } from "../src/utils/data";

test.describe("Accounts Overview", () => {

  test("Verify total balance matches sum of account balances", async ({ page }) => {

    const loginPage = new LoginPage(page);
    const accountOverview = new AccountOverview(page);

    await page.goto("/");
    await expect(page).toHaveURL(/parabank\/index\.htm/);

    await loginPage.fillUserName(staticData.userName);
    await loginPage.fillPassword(staticData.password);
    await loginPage.clickLoginBtn();

    expect(await loginPage.getUserSuccessLoginMessage())
      .toContain(staticData.firstName);

    await accountOverview.openAccountsOverview();

    expect(await accountOverview.getHeadingText())
      .toContain("Accounts Overview");

    const calculatedTotal =
      await accountOverview.getCalculatedTotalBalance();

    const displayedTotal =
      await accountOverview.getDisplayedTotalBalance();

    console.log("Calculated Total:", calculatedTotal);
    console.log("Displayed Total:", displayedTotal);

    expect(calculatedTotal).toBe(displayedTotal);
  });

});
