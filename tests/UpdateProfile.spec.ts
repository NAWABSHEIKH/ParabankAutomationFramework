import {test,expect} from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { staticData } from "../src/utils/data";
import { UpdateProfile } from "../src/pages/UpdateProfile";
import { RegistrationPage } from "../src/pages/RegistrationPage";

test.describe("Update Profile Info",()=>{

    test("Update the address of the user",async({page})=>{
    // ✅ Network log (correct place)
        page.on("request", req => {
            if (req.url().includes("openaccount")) {
                console.log("Open Account request sent");
            }
        });

        const loginPage=new LoginPage(page);
        const updateProfile=new UpdateProfile(page);
        const registrationPage=new RegistrationPage(page);

        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");
        await expect(page).toHaveURL(/parabank\/index\.htm/);

         await loginPage.fillUserName(staticData.userName);
         await loginPage.fillPassword(staticData.password);
         await loginPage.clickLoginBtn();

         expect(await loginPage.getUserSuccessLoginMessage())
                    .toContain(staticData.firstName);
                    
         await updateProfile.clickUpdatedContactInfo();
        //  console.log(await updateProfile.getBeforeAddressDetail()); 

         const beforeAddressListValue=await updateProfile.getBeforeAddressDetail();

         const beforeAddress=beforeAddressListValue[0];
         const beforeCity=beforeAddressListValue[1];
         const beforeZipcode=beforeAddressListValue[2];
         const beforeState=beforeAddressListValue[3];

         console.log(beforeAddress+" "+beforeCity+" "+beforeZipcode+" "+beforeState);

         const afterAddress="rename_"+beforeAddress+"_updated";
         const afterCity="rename_"+beforeCity+"_updated";
         const afterZipcode="rename_"+beforeZipcode+"_updated";
         const afterState="rename_"+beforeState+"_updated";

         await updateProfile.setUpdatedAddressDetail(afterAddress,afterCity,afterZipcode,afterState);
         await  updateProfile.clickUpdateProfileButton();

         expect(await updateProfile.verifySuccessMessage()).toContain("updated address");

         await registrationPage.clickLogoutBtn();

           await loginPage.fillUserName(staticData.userName);
         await loginPage.fillPassword(staticData.password);
         await loginPage.clickLoginBtn();

         expect(await loginPage.getUserSuccessLoginMessage())
                    .toContain(staticData.firstName);
                    
         await updateProfile.clickUpdatedContactInfo();
        //  console.log(await updateProfile.getBeforeAddressDetail()); 

         const updatedListAddress=await updateProfile.getBeforeAddressDetail();

         const updatedAddress=updatedListAddress[0];
         const updatedCity=updatedListAddress[1];
         const updatedZipcode=updatedListAddress[2];
         const updatedState=updatedListAddress[3];

         console.log(updatedAddress+" "+updatedCity+" "+updatedZipcode+" "+updatedState);

         console.log("Before:", beforeAddress);
         console.log("After :", updatedAddress);

         expect(updatedAddress).not.toBe(beforeAddress);
         expect(updatedCity).not.toBe(beforeCity);
         expect(updatedZipcode).not.toBe(beforeZipcode);
         expect(updatedState).not.toBe(beforeState);


    })
})