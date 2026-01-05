import { test, expect } from "@playwright/test";
import { AccountOverview } from "../src/pages/AccountOverview";
import { LoginPage } from "../src/pages/LoginPage";
import { staticData } from "../src/utils/data";
import { OpenNewAccount } from "../src/pages/OpenNewAccount";

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


  test("Verify newly created account appears in Accounts Overview", async ({ page }) => {

    const loginPage = new LoginPage(page);
    const openNewAccount = new OpenNewAccount(page);
    const accountOverview = new AccountOverview(page);

    // 1️⃣ Login
    await page.goto("/");
    await expect(page).toHaveURL(/parabank\/index\.htm/);

    await loginPage.fillUserName(staticData.userName);
    await loginPage.fillPassword(staticData.password);
    await loginPage.clickLoginBtn();

    expect(await loginPage.getUserSuccessLoginMessage())
      .toContain(staticData.firstName);

    // 2️⃣ Create new account
    await openNewAccount.clickOpenNewAccountLink();
    await openNewAccount.selectAccountType("SAVINGS");
    await openNewAccount.selectAccountID();
    await openNewAccount.clickOpenAccountButton();

    // 3️⃣ Capture newly created account ID
    const newAccountId =
      await openNewAccount.getNewAccountIDNumber();

    console.log("Newly Created Account ID:", newAccountId);
    expect(newAccountId).toBeTruthy();

    // 4️⃣ Navigate to Accounts Overview
    await accountOverview.openAccountsOverview();

    // 5️⃣ Verify account exists and click it
    const accountFound =
      await accountOverview.verifyAndClickAccount(newAccountId);

    expect(accountFound).toBeTruthy();


  });


});
