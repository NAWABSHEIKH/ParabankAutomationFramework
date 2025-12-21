import { Page,Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage{

    public readonly name:Locator;
    public readonly password:Locator;
    public readonly loginBtn:Locator;
    public readonly loginErrorMessage:Locator
    public readonly successUserLoginMessage:Locator;
    constructor(page:Page){
        super(page);
        this.name=page.locator('[name="username"]');
        this.password=page.locator('[name="password"]');
        this.loginBtn=page.locator('[value="Log In"]');
        this.loginErrorMessage=page.locator('.error');
        this.successUserLoginMessage=page.locator("p.smallText");
    }

    async getUserSuccessLoginMessage(){
        return this.successUserLoginMessage.textContent();
    }


    async fillUserName(name:string){
        await this.name.fill(name);
    }
    async fillPassword(password:string){
        await this.password.fill(password);
    }

    async clickLoginBtn(){
        await this.loginBtn.click();
    }

    async getErrorMessage()
      {
        return await this.loginErrorMessage.textContent();
    }
}