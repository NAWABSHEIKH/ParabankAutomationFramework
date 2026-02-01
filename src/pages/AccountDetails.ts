import {Locator,Page,expect} from '@playwright/test';
import { BasePage } from './BasePage';


export class AccountDetails extends BasePage{

    private readonly textAccountNumber:Locator;
    private readonly accountID:Locator;
    private readonly accountType:Locator;
    private readonly balance:Locator;
    private readonly availableBalance:Locator;
    private readonly getAccountTransactionRow:Locator;
    private readonly getTransactionDetailHeading:Locator;
    private readonly allTransactionDetailsInfo:Locator;

     constructor(page:Page){
        super(page);
        this.textAccountNumber=page.getByText("Account Number:");
        this.accountID=page.locator('#accountId');
        this.accountType=page.locator('#accountType');
        this.balance=page.locator('#balance');
        this.availableBalance=page.locator('#availableBalance');
        this.getAccountTransactionRow=page.locator('//table[@id="transactionTable"]//tbody//tr');
        this.getTransactionDetailHeading=page.getByRole('heading', { name: 'Transaction Details' });
        this.allTransactionDetailsInfo=page.locator('//div[@id="rightPanel"]//table//td[2]');
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

    await this.accountType.filter({ hasText: /./ }).waitFor({ state: "visible" });

        //  await this.accountType.waitFor({state:'visible',timeout:3000});
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

    async getAccountTransactionLink(searchName:string){
      await this.getAccountTransactionRow.first().waitFor({state:'visible'});
      const totalRow=await this.getAccountTransactionRow.all();

      for(const row of totalRow){
       const textTransaction=await row.locator("td").nth(1).textContent();
       if(textTransaction!.includes(searchName)){
        await row.locator("td").nth(1).click();
        console.log("Transaction Link found");
        break;
       }

      }

      await this.getTransactionDetailHeading.waitFor({state:"visible"});
      
    }
    
   async getAllTransactionDetailsInfo():Promise<Array<string>>{
    const text:Array<string>=new Array<string>;
    await this.allTransactionDetailsInfo.first().waitFor({state:'visible'});
    //const index:number=0;
    const totalDetailsData=await this.allTransactionDetailsInfo.all();
    for(const data of totalDetailsData){
      text.push((await data.textContent())!);

    }

    return text;

   }

}