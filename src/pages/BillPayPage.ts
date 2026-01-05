import { Page,Locator,expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BillPayPage extends BasePage{

/**
page.getByRole("link",{name:"Bill Pay"});
page.getByRole("Heading",{name:"Bill Payment Service"});//verify you landed in this page.
page.locator('[name="payee.name"]')//fill name;
page.locator('[name="payee.address.street"]')//fill address;
page.locator('[name="payee.address.city"]') //fill city;
page.locator('[name="payee.address.state"]')//fill state
page.locator('[name="payee.address.zipCode"]')//fill zipCode;
page.locator('[name="payee.phoneNumber"]')// fill phoneNumber;
page.locator('[name="payee.accountNumber"]')//fill accountNumber;
page.locator('[name="verifyAccount"]') //verifyAccount;
page.locator('input[name="amount"]')//amount;
page.locator('select[name="fromAccountId"]')//use selectOptions to select your desire account id
page.getByRole("button",{name:"Send Payment"});
page.getByRole('heading', { name: 'Bill Payment Complete' })//verify transaction is complte.
 * 
 * 
 */
    private readonly billPayLink:Locator;
    private readonly verifyBillPayService:Locator;
    private readonly payeeName:Locator;
    private readonly payeeStreet:Locator;
    private readonly payeeCity:Locator;
    private readonly payeeZipcode:Locator;
    private readonly payeeState:Locator;
    private readonly payeePhoneNumber:Locator;
    private readonly payeeAccountNumber:Locator;
    private readonly verifyPayeeAccountNumber:Locator;
    private readonly fromAccountID:Locator;
    private readonly sendPaymentButton:Locator;
    private readonly verifyBillPayementComplete:Locator;
    private readonly transactionAmount:Locator;
    private readonly successMsg:Locator;

    constructor(page:Page){
        super(page);
        this.billPayLink=page.getByRole("link",{name:"Bill Pay"});
        this.verifyBillPayService=page.getByRole("heading",{name:"Bill Payment Service"});

        this.payeeName=page.locator('[name="payee.name"]');
        this.payeeStreet=page.locator('[name="payee.address.street"]');
        this.payeeCity=page.locator('[name="payee.address.city"]');
        this.payeeZipcode=page.locator('[name="payee.address.zipCode"]');
        this.payeeState=page.locator('[name="payee.address.state"]');
        this.payeePhoneNumber=page.locator('[name="payee.phoneNumber"]');

        this.payeeAccountNumber=page.locator('[name="payee.accountNumber"]');
        this.verifyPayeeAccountNumber=page.locator('[name="verifyAccount"]');

        this.fromAccountID=page.locator('select[name="fromAccountId"]');
        this.sendPaymentButton=page.getByRole("button",{name:"Send Payment"});;
        this.verifyBillPayementComplete=page.getByRole('heading', { name: 'Bill Payment Complete' });

        this.transactionAmount=page.locator('input[name="amount"]');

       this.successMsg=page.locator('p:has-text("Bill Payment to")');
    }

    async clickAndVerifyBillPayLink():Promise<boolean>{
        await this.billPayLink.click();
        return await this.verifyBillPayService.isVisible();
    }

    async payeeInformation(name:string,street:string
        ,city:string,zipcode:string,state:string,phoneNumber:string){

            if(name!=null && street !=null && city!=null &&  zipcode!=null && state!=null && phoneNumber!=null){

       await this.payeeName.fill(name);
       await  this.payeeStreet.fill(street);
       await this.payeeCity.fill(city);
       await this.payeeZipcode.fill(zipcode);
       await this.payeeState.fill(state);
       await this.payeePhoneNumber.fill(phoneNumber);
            }else{
                throw new Error("Some field is missing! Kindly fill all the field.")
            }
    }

    async verifyPayeeAccountId(payeeAccountID:string,verifyPayeeAccountID:string){
           if(payeeAccountID===verifyPayeeAccountID){
       await this.payeeAccountNumber.fill(payeeAccountID);
       await this.verifyPayeeAccountNumber.fill(verifyPayeeAccountID);
           }else{
            throw new Error("Account didn't match kindly write correct account");
           }
    }


    async amountToBeTransact(amount:number){
        await this.transactionAmount.fill(amount.toString());
    }

    async selectAccountID(accountID:string){
        await this.fromAccountID.selectOption(accountID);
    }

    async clickAndVerifySendPaymentButton():Promise<boolean>{
       await this.sendPaymentButton.scrollIntoViewIfNeeded();
       await this.sendPaymentButton.click();

         // Wait until Bill Payment Is populated text is populated (NOT empty)
           await expect.poll(async () => {
             const text = await this.verifyBillPayementComplete.isVisible();
             return text;
           }, {
             timeout: 15000,
             message: "Waiting for account ID to be populated on Account Details page"
           }).not.toBeFalsy();

      return await this.verifyBillPayementComplete.isVisible();
      
    }

    async getSuccesMessage():Promise<string>{
        return (await this.successMsg.textContent())!;
    }

}