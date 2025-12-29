import {expect, Locator,Page} from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransferFund extends BasePage{

    private readonly transferFundLink:Locator;
    private readonly transferFundTitle:Locator;
    private readonly insertAmount:Locator;
    private readonly srcAccountID:Locator;
    private readonly targetAccountID:Locator;
    private readonly transferButton:Locator;
    private readonly successfulTransferMsg:Locator;


    constructor(page:Page){
        super(page);
        this.transferFundLink=page.getByRole("link",{name:"Transfer Funds"});
        this.transferFundTitle=page.getByRole('heading', { name: 'Transfer Funds' })
        this.insertAmount=page.locator("#amount");
        this.srcAccountID=page.locator("#fromAccountId");
        this.targetAccountID=page.locator("#toAccountId");
        this.transferButton=page.locator("[value='Transfer']");
        this.successfulTransferMsg=page.getByRole('heading', { name: 'Transfer Complete!' });
    }

    async clickAndVerifyTransferFund():Promise<boolean>{
        await this.transferFundLink.click();
       return await this.transferFundTitle.isVisible();
        //expect(await this.transferFundTitle.textContent()).toContain("Transfer Funds")
    }

    async fillAmount_AccouontID_Details(amount:number,srcAccId:string,tarAccId:string){
       await this.insertAmount.fill(amount.toString());
       await this.srcAccountID.selectOption(srcAccId);
       await this.targetAccountID.selectOption(tarAccId);
       console.log(`your details Amount: ${amount},SrcAccountId: ${srcAccId},TarAccountId: ${tarAccId}`);
    }

    async clickTransferButton(){
        await this.transferButton.click();
    }

    async getSucessfullyTransferMsg():Promise<string|null>{
       return await this.successfulTransferMsg.textContent();
    }

}