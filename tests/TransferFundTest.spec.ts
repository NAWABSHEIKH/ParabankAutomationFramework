 import {test,expect} from "@playwright/test";
import { OpenNewAccount } from "../src/pages/OpenNewAccount";
import { LoginPage } from "../src/pages/LoginPage";
import { TransferFund } from "../src/pages/TransferFund";
import { staticData } from "../src/utils/data";
import { AccountOverview } from "../src/pages/AccountOverview";


 test.describe("Transaction between Source and Target Account",()=>{
    test("Amount Transfer",async ({page})=>{


         // ✅ Network log (correct place)
        page.on("request", req => {
            if (req.url().includes("openaccount")) {
                console.log("Open Account request sent");
            }
        });

        const loginPage = new LoginPage(page);
        const opennewaccount=new OpenNewAccount(page);
        const transferfund=new TransferFund(page);
        const accountList:Array<string>=new Array<string>();
        const accountOverview=new AccountOverview(page); 

        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");
        await expect(page).toHaveURL(/parabank\/index\.htm/);
       
        await loginPage.fillUserName(staticData.userName);
        await loginPage.fillPassword(staticData.password);
        await loginPage.clickLoginBtn();

        expect(await loginPage.getUserSuccessLoginMessage())
            .toContain(staticData.firstName);

        //create 2 account for transfering between source and target.
        for(let i=1;i<=2;i++){
        await opennewaccount.clickOpenNewAccountLink();
        await opennewaccount.selectAccountType("SAVINGS");
        await opennewaccount.selectAccountID();
        await opennewaccount.clickOpenAccountButton();

        const getOpenAccountResult =
            await opennewaccount.getSuccessMessageForAccountOpen();

        for (const message of getOpenAccountResult) {
            console.log(message);
        }

        const getNewAccountID =
            await opennewaccount.getNewAccountIDNumber();

        console.log("New Account ID:", getNewAccountID);
        expect(getNewAccountID).toBeTruthy();
        accountList.push(getNewAccountID);
        
    }

        console.log(accountList);


       /**
        * get previous value of account ID
        */
         
       await accountOverview.openAccountsOverview();
        expect(await accountOverview.getHeadingText())
      .toContain("Accounts Overview");


      const previousBanlanceSrcAccount=await accountOverview.getAvailableBalanceFromTable(accountList[0]);
     // console.log("previous Source balace availabel money: "+previousBanlanceSrcAccount);


       const previousBanlanceTargetAccount=await accountOverview.getAvailableBalanceFromTable(accountList[1]);
     //  console.log("previous Target balace availabel money: "+previousBanlanceTargetAccount);

       //=======================================//

       let deductMoney=100;

        //check the title is visible or not.
        expect(await transferfund.clickAndVerifyTransferFund()).toBeTruthy();
        //pass the value inside the Transfer fund page.
        await transferfund.fillAmount_AccouontID_Details(deductMoney,accountList[0],accountList[1]); 
        //click transfer button.
        await transferfund.clickTransferButton();

        expect(await transferfund.getSucessfullyTransferMsg()).toContain("Transfer Complete!");

        await accountOverview.openAccountsOverview();
        expect(await accountOverview.getHeadingText())
      .toContain("Accounts Overview");
      

      
       const availableBanlanceSrcAccount=await accountOverview.getAvailableBalanceFromTable(accountList[0]);
       const checkSrcAvailableBalance=previousBanlanceSrcAccount-deductMoney;
       expect(availableBanlanceSrcAccount).toBe(checkSrcAvailableBalance);

       const availableBanlanceTargetAccount=await accountOverview.getAvailableBalanceFromTable(accountList[1]);
        const checkTargetAvailableBalance=previousBanlanceTargetAccount+deductMoney;
       expect(availableBanlanceTargetAccount).toBe(checkTargetAvailableBalance);

        console.log(`Source available amount ${checkSrcAvailableBalance} Target available amount ${checkTargetAvailableBalance}`);
    })

 })