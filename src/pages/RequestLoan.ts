import { Locator,Page,expect } from "@playwright/test";
import { BasePage } from "./BasePage";


/**
 * click request link 
 * verify heading is present Apply for a Loan
 * input#amount --> amount
 * input#downPayment --> payment
 * select#fromAccountId --> select account using visible text.
 * use getByRole(btn,{name:APPLY NOW})
 * 
 * 
 * 
 * 
 * After you click apply btn then verify this heading
 * Loan Request Processed
 * #loanProviderName -->getTextContent
 * #responseDate  -->  getTextContent
 * #loanStatus  ->  get status
 * 
 * #loanRequestApproved p --> take nth child of 1 for this message " Congratulations, your loan has been approved. "
 * Note : Use this [id*="loanRequest"] locator to locate either congratulation or denied message. because the locators change dynamically make sure you use .nth(1) to point the first element. 
 * 
 * 
 * #newAccountId  --> get text of newly created account id.  " Your new account number: 15453 "
 * 
 */

export class RequestLoan extends BasePage{
    private readonly requestLoanLink:Locator;
    private readonly applyLoanHeading:Locator;
    private readonly amount:Locator;
    private readonly downPayment:Locator;
    private readonly selectAccount:Locator;
    private readonly clickApplyBtn:Locator;
    private readonly loanRequestProceedHeading:Locator;

    private readonly loanProvider:Locator;
    private readonly loanStatus:Locator;
    private readonly responseDate:Locator;
    private readonly loanSuccessOrDenyMessage:Locator;
    private readonly getAccountId:Locator;



    constructor(page:Page){
        super(page);
        this.requestLoanLink=page.getByRole("link",{name:'Request Loan'});
        this.applyLoanHeading=page.getByRole("heading",{name:'Apply for a Loan'});
        this.amount=page.locator('input#amount');
        this.downPayment=page.locator("input#downPayment");
        this.selectAccount=page.locator("select#fromAccountId");
        this.clickApplyBtn=page.getByRole("button",{name:"APPLY NOW"});
        this.loanRequestProceedHeading=page.getByRole("heading",{name:"Loan Request Processed"});

        this.loanProvider=page.locator("#loanProviderName");
        this.loanStatus=page.locator("#loanStatus");
        this.responseDate=page.locator("#responseDate");
        this.loanSuccessOrDenyMessage=page.locator('[id*="loanRequest"] p');
        this.getAccountId=page.locator("#newAccountId");
    }

    async clickLoanRequestLinkAndVerifyHeading(){
        await this.requestLoanLink.click();
        await this.applyLoanHeading.waitFor({state:'visible'}); 
       // expect(await this.applyLoanHeading.isVisible()).toBeTruthy();
    }

    async applyLoan(amount:string,downPayment:string,accountID:string){
       await this.amount.fill(amount);
       await this.downPayment.fill(downPayment);
       await this.selectAccount.selectOption(accountID);    
    }

    async submitApplyBtn(){
        await this.clickApplyBtn.click();
        await this.loanRequestProceedHeading.waitFor({state:'visible'});
       console.log('Heading is visible. Proceeding with further tasks.');
    }

    async getLoanStatus():Promise<string>{
     return (await this.loanStatus.textContent())!;
    }

    async getLoanProvider():Promise<string>{
       return (await this.loanProvider.textContent())!; 
    }

    async getResponseDate():Promise<string>{
        return (await this.responseDate.textContent())!;
    }


    async getloanSuccessOrDenyMessage(): Promise<string> {
  await this.page
    .locator('[id*="loanRequest"] p')
    .filter({ hasText: /./ })
    .first()
    .waitFor({ state: "visible" });

  return (
    await this.page
      .locator('[id*="loanRequest"] p')
      .filter({ hasText: /./ })
      .first()
      .innerText()
  ).trim();
}


    // async getloanSuccessOrDenyMessage():Promise<string>{
    //     return (await this.loanSuccessOrDenyMessage.first().textContent({timeout:3000}))!;
    // }

    async getAccountIdOnSuccess():Promise<string>{
        return (await this.getAccountId.textContent())!;
    }

}