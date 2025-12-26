import {Locator,Page,expect} from '@playwright/test';
import { BasePage } from './BasePage';


export class AccountDetails extends BasePage{

    private readonly textAccountNumber:Locator;
    private readonly accountID:Locator;
    private readonly accountType:Locator;
    private readonly balance:Locator;
    private readonly availableBalance:Locator;

     constructor(page:Page){
        super(page);
        this.textAccountNumber=page.getByText("Account Number:");
        this.accountID=page.locator('#accountId');
        this.accountType=page.locator('#accountType');
        this.balance=page.locator('#balance');
        this.availableBalance=page.locator('#availableBalance');
     }

     async accountNumberTextVisible():Promise<boolean>{
         await this.textAccountNumber.waitFor({state:'visible'});
         return this.textAccountNumber.isVisible(); 

     }

     async getAccountId(): Promise<string> {

  // Wait until account ID text is populated (NOT empty)
  await expect.poll(async () => {
    const text = await this.accountID.textContent();
    return text?.trim();
  }, {
    timeout: 15000,
    message: "Waiting for account ID to be populated on Account Details page"
  }).not.toBe("");

  const accountId = (await this.accountID.textContent())?.trim();

  if (!accountId) {
    throw new Error("Account ID is empty on Account Details page");
  }

  return accountId;
}


     async getAccountType():Promise<string|null>{
         await this.accountType.waitFor({state:'visible',timeout:3000});
        return await this.accountType.textContent();
     }

     async getBalance():Promise<string|null>{
         await this.balance.waitFor({state:'visible'});
        return await this.balance.textContent();
     }

     async getAvailableBalance():Promise<string|null>{
         await this.availableBalance.waitFor({state:'visible'});
        return await this.availableBalance.textContent();
     }

}