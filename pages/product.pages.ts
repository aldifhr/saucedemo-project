import { Page } from "@playwright/test"

export class ProductPage {
    readonly page: Page;
    readonly detailName;
    readonly detailDesc;
    readonly detailPrice;
    readonly detailImage;
    readonly addToCartButton;
    readonly removeButton;
    readonly backButton;

    constructor(page: Page) {
        this.page = page;
        this.detailName = page.locator('[data-test="inventory-item-name"]');
        this.detailDesc = page.locator('[data-test="inventory-item-desc"]');
        this.detailPrice = page.locator('[data-test="inventory-item-price"]');
        this.detailImage = page.locator('.inventory_details_img');
        this.addToCartButton = page.locator('button[data-test^="add-to-cart"]');
        this.removeButton = page.locator('button[data-test^="remove"]');
        this.backButton = page.locator('[data-test="back-to-products"]');
    }

    async getDetailData() {
        return {
            name: await this.detailName.textContent(),
            desc: await this.detailDesc.textContent(),
            price: await this.detailPrice.textContent(),
            imageSrc: await this.detailImage.getAttribute('src'),
        };
    }
}
