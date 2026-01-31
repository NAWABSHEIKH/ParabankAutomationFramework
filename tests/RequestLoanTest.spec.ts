import {test,expect} from "@playwright/test"
import { LoginPage } from "../src/pages/LoginPage";
import { OpenNewAccount } from "../src/pages/OpenNewAccount";
import { AccountOverview } from "../src/pages/AccountOverview";
import { staticData } from "../src/utils/data";
import { RequestLoan } from "../src/pages/RequestLoan";

test.describe("Request Loan",()=>{
    test("Deny or  Accept Request Loan",async ({page})=>{

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


    //Perform Loan Request
    const requestLoan=new RequestLoan(page);
    await requestLoan.clickLoanRequestLinkAndVerifyHeading();


    await requestLoan.applyLoan("100","50",newAccountId);
    await requestLoan.submitApplyBtn();


    const loanStatus = await requestLoan.getLoanStatus();
    const loanProvider = await requestLoan.getLoanProvider();
    const responseDate = await requestLoan.getResponseDate();
    const decisionMessage = await requestLoan.getloanSuccessOrDenyMessage();

    console.log("DecisionMessage "+decisionMessage);
    expect(loanStatus.length).toBeGreaterThan(0);
    expect(loanProvider.length).toBeGreaterThan(0);
    expect(responseDate.length).toBeGreaterThan(0);
    expect(decisionMessage.length).toBeGreaterThan(0);

    if (decisionMessage.includes("cannot grant a loan")) {
  expect(loanStatus).toContain("Denied");
     } else {
  const loanAccountId = await requestLoan.getAccountIdOnSuccess();
  expect(loanStatus).toContain("Approved");
  expect(loanAccountId).toMatch(/\d+/);
 }



    // console.log("1"+await requestLoan.getLoanStatus());
    // console.log("2"+await requestLoan.getLoanProvider());
    // console.log("3"+await requestLoan.getResponseDate());
    // console.log("4"+await requestLoan.getloanSuccessOrDenyMessage());

    // if ((await requestLoan.getloanSuccessOrDenyMessage()).includes("cannot grant a loan")){
    //  console.log("5"+ "Sorry account will not create.");
    // }else{
    //     console.log("5"+await requestLoan.getAccountIdOnSuccess());
    // }
    


    })
})