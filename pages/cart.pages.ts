import { Page } from "@playwright/test"

export class CartPage {
    readonly page: Page;
    readonly cartLink;
    readonly cartBadge;
    readonly cartItems;
    readonly itemNames;
    readonly removeButtons;
    readonly continueShoppingButton;
    readonly checkoutButton;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartItems = page.locator('.cart_item');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.removeButtons = page.locator('button[data-test^="remove"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async open() {
        await this.cartLink.click();
    }

    async getCartItemNames(): Promise<string[]> {
        return this.itemNames.allTextContents();
    }

    async removeFirstItem() {
        await this.removeButtons.first().click();
    }

    async removeProductByName(productName: string) {
        const card = this.page.locator('.cart_item', { hasText: productName });
        await card.locator('button').click();
    }
}
