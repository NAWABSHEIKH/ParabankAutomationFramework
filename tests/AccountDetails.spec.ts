import {test,expect} from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { OpenNewAccount } from "../src/pages/OpenNewAccount";
import { AccountOverview } from "../src/pages/AccountOverview";
import { AccountDetails } from "../src/pages/AccountDetails";
import { staticData } from "../src/utils/data";

test.describe("Verify account details page",()=>{
   
     test("Account Details Page",async({page})=>{

         const loginPage = new LoginPage(page);
            const openNewAccount = new OpenNewAccount(page);
            const accountOverview = new AccountOverview(page);
            const accountDetailInfo=new AccountDetails(page);
        
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
     expect(await accountDetailInfo.accountNumberTextVisible()).toBeTruthy();
     expect(await accountDetailInfo.getAccountId()).toContain(newAccountId);
     expect(await accountDetailInfo.getAccountType()).toContain("SAVINGS");
     expect(await accountDetailInfo.getAvailableBalance()).toContain("0");
     expect(await accountDetailInfo.getBalance()).toContain("0");

     })
})