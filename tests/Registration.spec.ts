import {test,expect} from "@playwright/test";
import { RegistrationPage } from "../src/pages/RegistrationPage";
import { LoginPage } from "../src/pages/LoginPage";
import { staticData } from "../src/utils/data";

test.describe("Registration page",()=>{
    test("Create user in registration page",async({page})=>{
                const registrationInfo=new RegistrationPage(page);
                const loginPage=new LoginPage(page);
                await  page.goto("/");
                await page.waitForLoadState("domcontentloaded");
                await expect(page).toHaveURL(/parabank\/index\.htm/);

                await registrationInfo.clickRegisterLink();
                await registrationInfo.addNameDetails(staticData.firstName,staticData.lastName);
                await registrationInfo.addLocationDetails(staticData.city,staticData.state,staticData.zicode,staticData.city);
                await registrationInfo.addCredentialDetails(staticData.userName,staticData.password,staticData.confirmPassword);
                await registrationInfo.add_SSN_PhoneNumber(staticData.ssn,staticData.phoneNumber);
                
                await registrationInfo.registerButton();

                expect(await registrationInfo.getSuccessMessage()).toContain("account was created successfully");

           

                
    })

    
})
