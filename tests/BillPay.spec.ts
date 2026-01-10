import {test,expect} from "@playwright/test";
import { BasePage } from "../src/pages/BasePage";
import { BillPayPage} from "../src/pages/BillPayPage";
import { AccountOverview } from "../src/pages/AccountOverview";
import { LoginPage } from "../src/pages/LoginPage";
import { staticData } from "../src/utils/data";
import { OpenNewAccount } from "../src/pages/OpenNewAccount";
import { AccountDetails } from "../src/pages/AccountDetails";


test.describe("Bill Pay",()=>{
    test("should deduct balance when bill payment is made from a newly created account",async({page})=>{
      
        // ✅ Network log (correct place)
        page.on("request", req => {
            if (req.url().includes("openaccount")) {
                console.log("Open Account request sent");
            }
        });
        const transactionAmount:number=50;
        const name="Gian";
        const loginPage=new LoginPage(page);
        const billPay=new BillPayPage(page);
        const openNewAccount=new OpenNewAccount(page);
        const accountOverview=new AccountOverview(page);

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

 //       console.log("New Account ID:", getNewAccountID);
        expect(getNewAccountID).toBeTruthy(); 

        // ==============
        
      // 4️⃣ Navigate to Accounts Overview
    await accountOverview.openAccountsOverview();

   const totalBalance:number= await accountOverview.getBalanceFromTable(getNewAccountID);
  // console.log(`Before transaction amount ${totalBalance}`);




    // =============================


        const billPayHeading=await billPay.clickAndVerifyBillPayLink();
        expect(billPayHeading).toBeTruthy();

        await billPay.payeeInformation(name,"shibuya","Tokyo","112344","Japan","12345");
        await billPay.verifyPayeeAccountId("112233","112233");
        await billPay.selectAccountID(getNewAccountID);
        await billPay.amountToBeTransact(transactionAmount);

        const successfullyClickSendButton=await billPay.clickAndVerifySendPaymentButton();
        expect(successfullyClickSendButton).toBeTruthy();


   //     console.log(await billPay.getSuccesMessage());
        expect(await billPay.getSuccesMessage()).toContain(name);
        expect(await billPay.getSuccesMessage()).toContain(transactionAmount.toString());
        expect(await billPay.getSuccesMessage()).toContain(getNewAccountID);


             // ==============
        
      // 4️⃣ Navigate to Accounts Overview
    await accountOverview.openAccountsOverview();
   const deductedBalance:number= await accountOverview.getBalanceFromTable(getNewAccountID);
   //console.log(`After transaction amount ${deductedBalance}`);




    // =============================


    expect(totalBalance-transactionAmount).toBe(deductedBalance);

    })


    test.only("should display correct transaction details after bill payment",async({page})=>{


         // ✅ Network log (correct place)
        page.on("request", req => {
            if (req.url().includes("openaccount")) {
                console.log("Open Account request sent");
            }
        });
        const transactionAmount:number=50;
        const name="Gian";
        const loginPage=new LoginPage(page);
        const billPay=new BillPayPage(page);
        const openNewAccount=new OpenNewAccount(page);
        const accountOverview=new AccountOverview(page);
        const accountDetail=new AccountDetails(page);

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

 //       console.log("New Account ID:", getNewAccountID);
        expect(getNewAccountID).toBeTruthy();


        // =========


         const billPayHeading=await billPay.clickAndVerifyBillPayLink();
        expect(billPayHeading).toBeTruthy();

        await billPay.payeeInformation(name,"shibuya","Tokyo","112344","Japan","12345");
        await billPay.verifyPayeeAccountId("112233","112233");
        await billPay.selectAccountID(getNewAccountID);
        await billPay.amountToBeTransact(transactionAmount);

        const successfullyClickSendButton=await billPay.clickAndVerifySendPaymentButton();
        expect(successfullyClickSendButton).toBeTruthy();


   //     console.log(await billPay.getSuccesMessage());
        expect(await billPay.getSuccesMessage()).toContain(name);
        expect(await billPay.getSuccesMessage()).toContain(transactionAmount.toString());
        expect(await billPay.getSuccesMessage()).toContain(getNewAccountID);

    //    ==============
       await accountOverview.openAccountsOverview();
       expect(await accountOverview.getHeadingText())
             .toContain("Accounts Overview"); 
        // 5️⃣ Verify account exists and click it
    const accountFound =
      await accountOverview.verifyAndClickAccount(getNewAccountID);
    expect(accountFound).toBeTruthy();

    expect(await accountDetail.accountNumberTextVisible()).toBeTruthy();

    await accountDetail.getAccountTransactionLink(name);

    const allTransactionDetails:string[]=await accountDetail.getAllTransactionDetailsInfo();


    const transactionId:number=Number(allTransactionDetails[0]);
    const paymentDate:string=(allTransactionDetails[1]);
    const paymentByPerson:string=(allTransactionDetails[2]);
    const transactionType:string=(allTransactionDetails[3]);
    const amountLeft:string=(allTransactionDetails[4]);


    // expect(transactionId).toBe(getNewAccountID);
    expect(paymentByPerson).toContain(name);
    expect(transactionType).toContain("Debit");
    expect(amountLeft).toContain(transactionAmount.toString());

    
    // for(const data of allTransactionDetails){
    //     console.log(data);
    // }
    // await page.pause();

    })

})
