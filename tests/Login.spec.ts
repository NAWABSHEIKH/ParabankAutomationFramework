import {test,expect} from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { staticData } from "../src/utils/data";

test.describe('User is not registered',()=>{

    test("Get error message for unregistered user",async ({page})=>{

        const loginPage=new LoginPage(page);
        await  page.goto("/");
        await page.waitForLoadState("domcontentloaded");
        await expect(page).toHaveURL(/parabank\/index\.htm/);

    //    await loginPage.fillUserName("User1xyz");
    //    await loginPage.fillPassword("122345xyz");
    //    await loginPage.clickLoginBtn();

    //     const errorMsg=await loginPage.getErrorMessage();
    //     expect(errorMsg).toContain("not be verified");
    //     console.log(errorMsg);


    //============ Login with Credential and compare with the username
           await loginPage.fillUserName(staticData.userName);
           await loginPage.fillPassword(staticData.password);
           await loginPage.clickLoginBtn();

              expect(await loginPage.getUserSuccessLoginMessage()).toContain(staticData.firstName);



    })
})
