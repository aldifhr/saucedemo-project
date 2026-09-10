import { Page } from "@playwright/test"

export class InventoryPage {
    readonly page: Page;
    readonly sortDropdown;
    readonly itemNames;
    readonly itemPrices;
    readonly itemDescs;
    readonly itemImages;
    readonly itemCards;
    readonly addToCartButtons;
    readonly cartBadge;

    constructor(page: Page) {
        this.page = page;
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices = page.locator('[data-test="inventory-item-price"]');
        this.itemDescs = page.locator('[data-test="inventory-item-desc"]');
        this.itemImages = page.locator('.inventory_item_img img');
        this.itemCards = page.locator('.inventory_item');
        this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortDropdown.selectOption(value);
    }

    async getItemNames(): Promise<string[]> {
        return this.itemNames.allTextContents();
    }

    async getItemPrices(): Promise<number[]> {
        const texts = await this.itemPrices.allTextContents();
        return texts.map(t => parseFloat(t.replace('$', '')));
    }

    async clickFirstItemByTitle() {
        await this.itemNames.first().click();
    }

    async clickFirstItemByImage() {
        await this.itemImages.first().click();
    }

    async getFirstItemData() {
        return {
            name: await this.itemNames.first().textContent(),
            desc: await this.itemDescs.first().textContent(),
            price: await this.itemPrices.first().textContent(),
            imageSrc: await this.itemImages.first().getAttribute('src'),
        };
    }

    async addFirstItemToCart() {
        await this.addToCartButtons.first().click();
    }

    async addProductByName(productName: string) {
        const card = this.page.locator('.inventory_item', { hasText: productName });
        await card.locator('button[data-test^="add-to-cart"]').click();
    }

    async addProductsByNames(names: string[]) {
        for (const name of names) {
            await this.addProductByName(name);
        }
    }
}
