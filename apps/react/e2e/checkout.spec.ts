import { test, expect } from '@playwright/test';
import { loginAs, USER } from './helpers';

const openCart = (page: Parameters<typeof loginAs>[0]) =>
  page.locator('button').filter({ hasText: /\$[\d.]+/ }).last().click();

/** Add a product then navigate to checkout via the cart sidebar — avoids full page reload */
async function goToCheckout(page: Parameters<typeof loginAs>[0]) {
  await page.goto('/products');
  await page.waitForSelector('h3', { timeout: 10_000 });

  const firstCard = page.locator('.group').first();
  await firstCard.hover();
  const quickAdd = page.getByRole('button', { name: 'Quick Add' }).first();
  await quickAdd.waitFor({ state: 'visible', timeout: 5_000 });
  await quickAdd.click();

  await openCart(page);
  await page.getByRole('button', { name: /Checkout Now/i }).click();
  await expect(page).toHaveURL('/checkout');
}

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, USER.email, USER.password);
  });

  test('checkout shows shipping address form', async ({ page }) => {
    await goToCheckout(page);
    await expect(page.getByPlaceholder('123 Cyberpunk Blvd')).toBeVisible();
    await expect(page.getByPlaceholder('Neo-Tokyo')).toBeVisible();
    await expect(page.getByPlaceholder('10101')).toBeVisible();
    await expect(page.getByPlaceholder('Unified World')).toBeVisible();
  });

  test('proceeds to payment step after filling address', async ({ page }) => {
    await goToCheckout(page);

    await page.getByPlaceholder('123 Cyberpunk Blvd').fill('123 Test Street');
    await page.getByPlaceholder('Neo-Tokyo').fill('Test City');
    await page.getByPlaceholder('10101').fill('12345');
    await page.getByPlaceholder('Unified World').fill('Testland');
    await page.getByRole('button', { name: 'Proceed to Payment' }).click();

    await expect(page.getByText('Secure Payment')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText('Ending in 4242')).toBeVisible();
  });

  test('full checkout flow ends on /order-success', async ({ page }) => {
    await goToCheckout(page);

    await page.getByPlaceholder('123 Cyberpunk Blvd').fill('456 E2E Ave');
    await page.getByPlaceholder('Neo-Tokyo').fill('Playwright City');
    await page.getByPlaceholder('10101').fill('99999');
    await page.getByPlaceholder('Unified World').fill('Testland');
    await page.getByRole('button', { name: 'Proceed to Payment' }).click();

    await expect(page.getByText('Secure Payment')).toBeVisible({ timeout: 5_000 });
    await page.getByRole('button', { name: /Pay \$[\d.]+ Now/ }).click();

    await expect(page).toHaveURL('/order-success', { timeout: 10_000 });
    await expect(page.locator('text=/order|success|confirm/i').first()).toBeVisible();
  });

  test('can go back to edit address from payment step', async ({ page }) => {
    await goToCheckout(page);

    await page.getByPlaceholder('123 Cyberpunk Blvd').fill('789 Back St');
    await page.getByPlaceholder('Neo-Tokyo').fill('Changeville');
    await page.getByPlaceholder('10101').fill('00000');
    await page.getByPlaceholder('Unified World').fill('Changeland');
    await page.getByRole('button', { name: 'Proceed to Payment' }).click();

    await expect(page.getByText('Secure Payment')).toBeVisible({ timeout: 5_000 });
    await page.getByRole('button', { name: 'Change' }).click();

    await expect(page.getByPlaceholder('123 Cyberpunk Blvd')).toBeVisible();
  });
});
