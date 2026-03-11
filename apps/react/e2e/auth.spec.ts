import { test, expect } from '@playwright/test';
import { loginAs, registerUser, uniqueEmail, USER } from './helpers';

test.describe('Authentication', () => {
  test('home page loads and shows featured products', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Latest Arrivals')).toBeVisible();
    await expect(page.locator('h3').first()).toBeVisible({ timeout: 10_000 });
  });

  test('auth page shows login form by default', async ({ page }) => {
    await page.goto('/auth');
    // The large centered heading on the auth page
    await expect(page.getByRole('main').getByRole('heading', { name: 'Oshopper' })).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('can toggle to register form', async ({ page }) => {
    await page.goto('/auth');
    await page.getByText('Create an Account').click();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
  });

  test('can toggle back to login form', async ({ page }) => {
    await page.goto('/auth');
    await page.getByText('Create an Account').click();
    // Click the "Sign In" span inside the register form (text-accent class, not the navbar link)
    await page.locator('span.text-accent', { hasText: 'Sign In' }).click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('logs in with seeded user credentials', async ({ page }) => {
    await loginAs(page, USER.email, USER.password);
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Sign In')).not.toBeVisible();
  });

  test('shows error on wrong password', async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder('name@example.com').fill(USER.email);
    await page.getByPlaceholder('••••••••').fill('WrongPassword999!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('text=/invalid|incorrect|failed|unauthorized/i').first()).toBeVisible();
  });

  test('shows error for non-existent account', async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder('name@example.com').fill('nobody@nowhere.com');
    await page.getByPlaceholder('••••••••').fill('Password1234!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('text=/invalid|not found|failed/i').first()).toBeVisible();
  });

  test('registers a new user and auto-logs in', async ({ page }) => {
    const email = uniqueEmail();
    await registerUser(page, 'E2E Tester', email, 'Password1234!');
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Sign In')).not.toBeVisible();
  });

  test('redirects logged-in user away from /auth', async ({ page }) => {
    await loginAs(page, USER.email, USER.password);
    await page.goto('/auth');
    await expect(page).toHaveURL('/');
  });

  test('profile page requires auth — redirects to /auth when not logged in', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/auth');
  });

  test('checkout page requires auth — redirects to /auth when not logged in', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL('/auth');
  });

  test('admin page redirects non-admin user to home', async ({ page }) => {
    await loginAs(page, USER.email, USER.password);
    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });
});
