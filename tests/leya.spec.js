
import { test, expect } from '@playwright/test';
import { TIMEOUT } from 'dns';

test.beforeEach(async ({ page }) => {
    await page.goto('http://www.leyaonline.com/pt');
    await page.getByRole('button', { name: 'Recusar Todos' }).click();
});

test.describe('Proposed Scenarios', () => {

    test('Scenario1', async ({ page }) => {
        // Search for George
        await page.getByPlaceholder('pesquisa').click();
        await page.getByPlaceholder('pesquisa').fill('George');

        // Verify that the book "O Triunfo dos Porcos" is displayed on the list
        await expect(page.getByRole('heading', { level: 6, name: 'O Triunfo dos Porcos' })).toBeVisible();

        // Confirm that the book description contains the words "Quinta Manor
        await page.getByPlaceholder('pesquisa').click();
        await page.locator('button.searchbar-large').click();
        await page.getByRole('link', { name: 'O Triunfo dos Porcos' }).click();
        await expect(page.getByText('Quinta Manor')).toBeVisible();
    });

    test('Scenario2', async ({ page }) => {
        // Search for the book "1984"
        await searchForBook(page, '1984')

        // Validate that the author is George Orwell
        await expect(page.locator('section.author').getByRole('link', { name: 'GEORGE ORWELL' })).toBeVisible();

        // Confirm that the ISBN is "9789722071550"
        await expect(page.locator('#second-container')).toContainText('ISBN: 9789722071550');

        // Check that the number of pages is 344
        await expect(page.locator('#second-container')).toContainText('Páginas: 344');

        // Ensure that the dimensions of the book are "235 x 175 mm x 23 mm
        await expect(page.locator('#second-container')).toContainText('235 x 157 x 23 mm');
    });

    test('Scenario 3', async ({ page }) => {
        // Search for the book "1984"
        await searchForBook(page, '1984')

        // Verify that the book "A Quinta dos Animais" is authored by the same author
        // Did not find "A Quinta dos Animais in website", replaced with "George Orwell - Ensaios"
        await expect(page.getByRole('heading', { level: 6, name: 'George Orwell - Ensaios' })).toBeVisible();
    })

    test('Scenario 4', async ({ page }) => {
        // Search for the book "1984"
        await searchForBook(page, '1984')

        // Add the book to the basket
        await page.getByRole('link', { name: 'Comprar' }).nth(0).click();

        // Confirm that the number of items in the basket is 1
        await expect(page.locator('#dropdownMenuButton100')).toHaveAttribute('data-tag', '1');
    });

    test('Scenario 5"', async ({ page }) => {
        // Change the background to dark mode
        await page.locator('a:has(.icon-sun)').click();

        // Check if the dark mode has been successfully applied to the website
        await expect(page.locator('.nav-icon.icon-moon')).toBeVisible();

        const backgroundColor = await page.evaluate(() => {
            const body = document.querySelector('body');
            return window.getComputedStyle(body).backgroundColor;
        });
        expect(backgroundColor).toBe('rgb(30, 31, 30)');
    })
});

test.describe('Aditional test cases', () => {

    test.only('Scenario 6 - Change a value (usually dynamic) in the dom for testing purposes', async ({ page }) => {

        await searchForBook(page, '1984')

        // Check that the element with value 1984 exists and element with value 1985 does not exist
        await expect(page.locator('.h1', { hasText: '1985' })).not.toBeVisible();
        await expect(page.locator('.h1', { hasText: '1984' })).toBeVisible();

        // Mock the value from 1984 to 1985
        await page.evaluate(() => {
            document.querySelector('.h1', { hasText: '1984' }).textContent = '1985';
        });

        // Verify the value has been updated to '1985'
        await expect(page.locator('.h1', { hasText: '1985' })).toBeVisible();
    });

    test('Scenario 7 - check if banner in front page is working correctly', async ({ page }) => {
        await expect(page.locator('div.owl-item.active a.banner-single-item')).toHaveAttribute('href', /licoes-para-a-vida/);
        await page.waitForTimeout(5000);
        await expect(page.locator('div.owl-item.active a.banner-single-item')).toHaveAttribute('href', /o-meu-caminho/);
        await page.waitForTimeout(5000);
        await expect(page.locator('div.owl-item.active a.banner-single-item')).toHaveAttribute('href', /la-em-baixo-no-vale/);
        await page.waitForTimeout(5000);
        await expect(page.locator('div.owl-item.active a.banner-single-item')).toHaveAttribute('href', /inventario-de-sonhos/);
        await page.waitForTimeout(5000);
        await expect(page.locator('div.owl-item.active a.banner-single-item')).toHaveAttribute('href', /cartoes-de-revisao/);
        await page.waitForTimeout(5000);
        await expect(page.locator('div.owl-item.active a.banner-single-item')).toHaveAttribute('href', /licoes-para-a-vida/);
    });
})

async function searchForBook(page, searchBook) {
    await page.getByPlaceholder('pesquisa').click();
    await page.getByPlaceholder('pesquisa').fill(searchBook);
    await expect(page.getByText(`Resultados de livros para a pesquisa “${searchBook}”`)).toBeVisible();
    await page.locator('button.searchbar-large').click();
    await page.getByRole('heading', { level: 6, name: searchBook }).click();
}