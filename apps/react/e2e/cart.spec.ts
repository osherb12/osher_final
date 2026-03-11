import { test, expect } from '@playwright/test';
import { loginAs, USER } from './helpers';

// The cart button shows "$X.XX" — match it by partial price text
const openCart = (page: Parameters<typeof loginAs>[0]) =>
  page.locator('button').filter({ hasText: /\$[\d.]+/ }).last().click();

async function addFirstProduct(page: Parameters<typeof loginAs>[0]) {
  await page.goto('/products');
  await page.waitForSelector('h3', { timeout: 10_000 });
  const firstCard = page.locator('.group').first();
  await firstCard.hover();
  const quickAdd = page.getByRole('button', { name: 'Quick Add' }).first();
  await quickAdd.waitFor({ state: 'visible', timeout: 5_000 });
  await quickAdd.click();
}

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, USER.email, USER.password);
  });

  test('cart button is visible in navbar', async ({ page }) => {
    await expect(page.locator('button').filter({ hasText: /\$[\d.]+/ }).last()).toBeVisible();
  });

  test('cart drawer opens on cart button click', async ({ page }) => {
    await openCart(page);
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible({ timeout: 5_000 });
  });

  test('can add product via Quick Add and cart badge updates', async ({ page }) => {
    await addFirstProduct(page);
    // Cart badge (item count) should appear on the button
    await expect(
      page.locator('button').filter({ hasText: /\$[\d.]+/ }).last().locator('span').filter({ hasText: /^[1-9]/ })
    ).toBeVisible({ timeout: 5_000 });
  });

  test('cart sidebar shows items after adding a product', async ({ page }) => {
    await addFirstProduct(page);
    await openCart(page);
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible({ timeout: 5_000 });
    // Clear Cart button only appears when cart has items
    await expect(page.getByRole('button', { name: 'Clear Cart' })).toBeVisible({ timeout: 5_000 });
  });

  test('can clear the cart', async ({ page }) => {
    await addFirstProduct(page);
    await openCart(page);
    await expect(page.getByText('Your Cart')).toBeVisible({ timeout: 5_000 });
    await page.getByRole('button', { name: 'Clear Cart' }).click();
    await expect(page.getByRole('button', { name: 'Clear Cart' })).not.toBeVisible({ timeout: 3_000 });
  });

  test('Checkout Now button navigates to /checkout', async ({ page }) => {
    await addFirstProduct(page);
    await openCart(page);
    await page.getByRole('button', { name: /Checkout Now/i }).click();
    await expect(page).toHaveURL('/checkout');
  });
});
