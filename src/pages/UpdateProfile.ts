import { Page,Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class UpdateProfile extends BasePage {
     
    private readonly fName:Locator;
    private readonly lName:Locator;
    private readonly address:Locator;
    private readonly city:Locator;
    private readonly zipcode:Locator;
    private readonly state:Locator;
    private readonly phoneNum:Locator;
    private readonly updateProfileBtn:Locator;
    private readonly updateContactInfo:Locator;
    private readonly updateSuccessMessage:Locator
    private readonly verifyUpdatedProfileHeading:Locator;
    private readonly verifyProfileSection:Locator;
   

    constructor(page:Page){
        super(page);
     this.fName=page.locator("#customer\\.firstName");
     this.lName=page.locator("#customer\\.lastName");
     this.address=page.locator("#customer\\.address\\.street");
     this.city=page.locator("#customer\\.address\\.city");
     this.zipcode=page.locator("#customer\\.address\\.zipCode");
     this.state=page.locator("#customer\\.address\\.state");
     this.phoneNum=page.locator("#customer\\.phoneNumber");
     this.updateProfileBtn=page.locator('[value="Update Profile"]');
     this.updateContactInfo=page.getByRole("link",{name:"Update Contact Info"});
     this.updateSuccessMessage=page.locator("div[id=updateProfileResult] p");
     this.verifyUpdatedProfileHeading=page.getByRole("heading",{name:"Profile Updated"})
     this.verifyProfileSection=page.getByRole("heading",{name:"Update Profile"});
    }

    // async getBeforeAddressDetail():Promise<Array<String>>{
    //     const list=new Array();
    //     const address=await this.address.inputValue();
    //     const city=await this.city.inputValue();
    //     const zipCode=await this.zipcode.inputValue();
    //     const state=await this.state.inputValue();
    //     list.push(address);
    //     list.push(city);
    //     list.push(zipCode);
    //     list.push(state);
    //     return list;

    // }

    async clickUpdatedContactInfo(){
        await this.updateContactInfo.click();
        expect(await this.verifyProfileSection.isVisible());
    }

    //Second way to get the value
   async getBeforeAddressDetail(): Promise<string[]> {
    // Await all text content calls simultaneously for better performance

    // Ensure the element is present before trying to read it
    await this.address.waitFor({ state: 'visible' });

    const [address, city, zipCode, state] = await Promise.all([
        this.address.inputValue(),
        this.city.inputValue(),
        this.zipcode.inputValue(),
        this.state.inputValue()
    ]);

    // Return the values as a typed string array
    return [address!, city!, zipCode!, state!];
}


  async setUpdatedAddressDetail(address:string,city:string,zipcode:string,state:string):Promise<void>{
       await this.address.fill(address);
       await this.city.fill(city);
       await this.zipcode.fill(zipcode);
       await this.state.fill(state);

  }

  async clickUpdateProfileButton(){
    await this.updateProfileBtn.click();
  }

  async verifySuccessMessage():Promise<string>{
    expect(await this.verifyUpdatedProfileHeading.isEnabled()).toBeTruthy();
    return (await this.updateSuccessMessage.textContent())!;
  }
 

    

 }