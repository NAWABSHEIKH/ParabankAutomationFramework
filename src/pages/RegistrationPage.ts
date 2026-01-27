import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegistrationPage extends BasePage {

    readonly registerLink: Locator;
    readonly firstname: Locator;
    readonly lastname: Locator;
    readonly address: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly zipCode: Locator;
    readonly phoneNumber: Locator;
    readonly ssn: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly registerBtn: Locator;
    readonly successMsg: Locator;
    private readonly logout:Locator;

    constructor(page: Page) {
        super(page);

        this.logout=page.getByRole("link",{name:"Log Out"});
        this.registerLink = page.getByRole("link", { name: /register/i });

        this.firstname = page.locator('#customer\\.firstName');
        this.lastname = page.locator('#customer\\.lastName');
        this.address = page.locator('#customer\\.address\\.street');
        this.city = page.locator('#customer\\.address\\.city');
        this.state = page.locator('#customer\\.address\\.state');
        this.zipCode = page.locator('#customer\\.address\\.zipCode');
        this.phoneNumber = page.locator('#customer\\.phoneNumber');
        this.ssn = page.locator('#customer\\.ssn');
        this.username = page.locator('#customer\\.username');
        this.password = page.locator('#customer\\.password');
        this.confirmPassword = page.locator('#repeatedPassword');

        this.registerBtn = page.getByRole("button", { name: /register/i });

        this.successMsg = page.locator("#rightPanel p");
    }

    async clickRegisterLink() {
        await this.registerLink.click();
    }

    async addNameDetails(firstName: string, lastName: string) {
        await this.firstname.fill(firstName);
        await this.lastname.fill(lastName);
    }

    async addLocationDetails(address: string, city: string, zip: string, state: string) {
        await this.address.fill(address);
        await this.city.fill(city);
        await this.zipCode.fill(zip);
        await this.state.fill(state);
    }

    async add_SSN_PhoneNumber(ssn: string, phone: string) {
        await this.ssn.fill(ssn);
        await this.phoneNumber.fill(phone);
    }

    async addCredentialDetails(username: string, password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            throw new Error("Password and Confirm Password do not match");
        }

        await this.username.fill(username);
        await this.password.fill(password);
        await this.confirmPassword.fill(confirmPassword);
    }

    async registerButton() {
        await this.registerBtn.click();
    }

    async getSuccessMessage() {
        return await this.successMsg.textContent();
    }

    async clickLogoutBtn(){
        await this.logout.click();
    }
}


// import { Locator, Page } from "@playwright/test";
// import { BasePage } from "./BasePage";

// export class RegistrationPage extends BasePage{

//     public readonly firstname:Locator;
//     public readonly lastname:Locator;
//     public readonly address:Locator;
//     public readonly state:Locator;
//     public readonly city:Locator;
//     public readonly zipCode:Locator;
//     public readonly phoneNumber:Locator;
//     public readonly ssn:Locator;
//     public readonly username:Locator;
//     public readonly password:Locator;
//     public readonly confirmPassword:Locator;
//     public readonly registerLink:Locator;
//     public readonly registerBtn:Locator;
//     public readonly successMsg:Locator;
//     // public readonly successMsg:Locator;
    

//     constructor(page:Page){
//         super(page);
//         this.registerLink=page.getByRole("link",{name:/register/i});    
//         this.firstname=page.locator("#customer\\.firstName");
//         this.lastname=page.locator("#customer\\.lastName");
//         this.address=page.locator("#customer\\.address\\.street");
//         this.state=page.locator("#customer\\.address\\.city");
//         this.city=page.locator("#customer\\.address\\.state");
//         this.zipCode=page.locator("#customer\\.address\\.zipCode");
//         this.phoneNumber=page.locator("#customer\\.phoneNumber");
//         this.ssn=page.locator("#customer\\.ssn");
//         this.username=page.locator("#customer\\.username");
//         this.password=page.locator("#customer\\.password");
//         this.confirmPassword=page.locator("#repeatedPassword");
//         this.registerBtn=page.getByRole("button",{name:/register/i});
//         this.successMsg=page.locator("#rightPanel p");
       
//     }

//     async getSuccessMessage(){
//         return await this.successMsg.textContent();
//     }

//     async clickRegisterLink(){
//        await this.registerLink.click();
//     }

//     async addNameDetails(firstName:string,lastName:string){
//         await this.firstname.fill(firstName);
//         await this.lastname.fill(lastName);
//     }

//     async addLocationDetails(address:string,city:string,zipcode:string,state:string){
//         await this.address.fill(address);
//         await this.city.fill(city);
//         await this.zipCode.fill(zipcode);
//         await this.state.fill(state);
//     }

//     async add_SSN_PhoneNumber(ssn:string,phoneNumber:string){
//        await  this.ssn.fill(ssn);
//        await  this.phoneNumber.fill(phoneNumber);
//     }

//     async addCredentialDetails(username:string,password:string,confirmPassword:string){
//         await this.username.fill(username);
//         try{
//             if(password!=confirmPassword){
//                    throw new Error("Password and Confirm Password not matched!");
//             }
//         }catch{
//         }

//        await this.password.fill(password);
//        await   this.confirmPassword.fill(confirmPassword);
//     }

//     async registerButton(){
//       await this.registerBtn.click();
//     }


// }