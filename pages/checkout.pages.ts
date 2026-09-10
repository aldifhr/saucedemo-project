import { Page } from "@playwright/test"

export class CheckoutPage {
    readonly page: Page;
    // Step One
    readonly firstNameInput;
    readonly lastNameInput;
    readonly postalCodeInput;
    readonly continueButton;
    readonly cancelButton;
    readonly errorMessage;
    // Step Two
    readonly paymentInfo;
    readonly shippingInfo;
    readonly totalPrice;
    readonly finishButton;
    readonly cancelButtonStepTwo;
    // Complete
    readonly completeHeader;
    readonly completeText;
    readonly backHomeButton;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.paymentInfo = page.locator('[data-test="payment-info-label"]');
        this.shippingInfo = page.locator('[data-test="shipping-info-label"]');
        this.totalPrice = page.locator('[data-test="total-label"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButtonStepTwo = page.locator('[data-test="cancel"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeText = page.locator('[data-test="complete-text"]');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    async fillInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continueCheckout() {
        await this.continueButton.click();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }
}
