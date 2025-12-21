import { test, expect } from "@playwright/test";
import { OpenNewAccount } from "../src/pages/OpenNewAccount";
import { staticData } from "../src/utils/data";
import { LoginPage } from "../src/pages/LoginPage";

test.describe("Open New Account", () => {

    test("Check account is openned successfully", async ({ page }) => {

        // ✅ Network log (correct place)
        page.on("request", req => {
            if (req.url().includes("openaccount")) {
                console.log("Open Account request sent");
            }
        });

        const loginPage = new LoginPage(page);
        const openNewAccount = new OpenNewAccount(page);

        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");
        await expect(page).toHaveURL(/parabank\/index\.htm/);

        await loginPage.fillUserName(staticData.userName);
        await loginPage.fillPassword(staticData.password);
        await loginPage.clickLoginBtn();

        expect(await loginPage.getUserSuccessLoginMessage())
            .toContain(staticData.firstName);

        await openNewAccount.clickOpenNewAccountLink();
        await openNewAccount.selectAccountType("SAVINGS");
        await openNewAccount.selectAccountID();
        await openNewAccount.clickOpenAccountButton();

        const getOpenAccountResult =
            await openNewAccount.getSuccessMessageForAccountOpen();

        for (const message of getOpenAccountResult) {
            console.log(message);
        }

        const getNewAccountID =
            await openNewAccount.getNewAccountIDNumber();

        console.log("New Account ID:", getNewAccountID);
        expect(getNewAccountID).toBeTruthy();
    });
});
