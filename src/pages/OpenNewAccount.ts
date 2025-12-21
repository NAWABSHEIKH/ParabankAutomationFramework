import { Locator, Page,expect } from "@playwright/test";

export class OpenNewAccount {

    public readonly openNewAccountLink: Locator;
    public readonly accountType: Locator;
    public readonly accountID: Locator;
    public readonly openAccountBtn: Locator;
    public readonly openAccountResult: Locator;
    public readonly newAccountIDNumber: Locator;
    readonly openNewAccountBtn: Locator;
    readonly successMsg: Locator;
    private readonly page: Page; // ✅ added

    constructor(page: Page) {
        this.page = page; // ✅ added
        this.openNewAccountLink = page.getByRole("link", { name: "Open New Account" });
        this.accountType = page.locator("select#type");
        this.accountID = page.locator("select#fromAccountId");
        this.openAccountBtn = page.getByRole("button", { name: "Open New Account" });
        this.openAccountResult = page.locator("div#openAccountResult");
        this.newAccountIDNumber = page.locator("a#newAccountId");
        this.openNewAccountBtn = page.locator('input[value="Open New Account"]');
        this.successMsg = page.locator('#rightPanel p');
    }

    async clickOpenNewAccountLink() {
        await this.openNewAccountLink.click();
    }

    async selectAccountType(option: string) {
        await this.accountType.selectOption(option);
    }

    // async selectAccountID(id: string) {
    //     await this.accountID.selectOption(id);
    // }

    async clickOpenAccountButton() {
        // ✅ Force navigation-aware click
        await Promise.all([
            this.page.waitForURL(/openaccount\.htm/, { timeout: 30000 }),
            this.openAccountBtn.click()
        ]);
    }

    async clickOpenNewAccount() {
        await this.openNewAccountBtn.click();
        console.log('Open Account request sent');
    }

    async getSuccessMessageForAccountOpen(): Promise<string[]> {
        // ✅ Read fresh page content after navigation
        return await this.page.locator("div#openAccountResult p").allTextContents();
    }

    // ✅ FINAL FIX — READ FROM PAGE CONTENT (NOT LOCATORS)
    // async getNewAccountIDNumber(): Promise<string> {

    //     // ✅ Get full page text after navigation
    //     const pageText = await this.page.textContent("body");

    //     if (!pageText) {
    //         throw new Error("Failed to read page content");
    //     }

    //     // ✅ Extract account number reliably
    //     const match = pageText.match(/Your new account number:\s*(\d+)/);

    //     if (!match) {
    //         throw new Error("Account number not found in page text");
    //     }

    //     return match[1];
    // }


      async selectAccountID() {
        // Wait until at least one option is loaded
        //[mnawab] :- This is very important because my playwright execution is very fast,and the dropdown value is not getting selected because of that it is clicking the "Open New Account" and it the test fail.
        //That is why we waited for the value to get populated first , then we click 'Open New Account'.  
        await expect.poll(async () => {
            return await this.accountID.locator('option').count();
        }, {
            timeout: 15000,
            message: 'Waiting for account dropdown to be populated'
        }).toBeGreaterThan(0);

        // Select first available account
        await this.accountID.selectOption({ index: 0 });
    }

     async verifyAccountOpenedSuccessfully() {
        await expect(this.successMsg).toContainText('Congratulations');
    }



    // ✅ FINAL CORRECT IMPLEMENTATION
async getNewAccountIDNumber(): Promise<string> {

    // 1️⃣ Wait until account ID link is visible
    await expect(this.newAccountIDNumber).toBeVisible({ timeout: 15000 });

    // 2️⃣ Wait until text is populated (NOT empty)
    await expect.poll(async () => {
        const text = await this.newAccountIDNumber.textContent();
        return text?.trim();
    }, {
        timeout: 15000,
        message: "Waiting for new account ID to be generated"
    }).not.toBe("");

    // 3️⃣ Read final account number
    const accountId = (await this.newAccountIDNumber.textContent())?.trim();

    if (!accountId) {
        throw new Error("New account ID is empty");
    }

    return accountId;
}



}
