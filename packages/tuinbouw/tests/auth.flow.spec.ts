import { expect, test } from '@playwright/test'

test('create user', async ({ page }) => {
  await page.goto('http://localhost:5173/auth/login')
  await page.getByRole('link', { name: 'Register' }).click()
  await page.getByPlaceholder('John', { exact: true }).click()
  await page.getByPlaceholder('John', { exact: true }).fill('John')
  await page.getByPlaceholder('John', { exact: true }).press('Tab')
  await page.getByPlaceholder('Doe').fill('Doe')
  await page.getByPlaceholder('Doe').press('Tab')
  await page.getByPlaceholder('john@gmail.com').fill('john@gmail.com')
  await page.getByPlaceholder('••••••••').click()
  await page.getByPlaceholder('••••••••').fill('123456')
  await page.getByRole('button', { name: 'Create an account' }).click()
})

test('login', async ({ page }) => {
  await page.goto('http://localhost:5173/auth/login')
  await page.getByPlaceholder('john@gmail.com').click()
  await page.getByPlaceholder('john@gmail.com').fill('john@gmail.com')
  await page.getByPlaceholder('john@gmail.com').press('Tab')
  await page.getByPlaceholder('••••••••').fill('123456')
  await page.getByRole('button', { name: 'Login' }).click()
})

test('forgot password', async ({ page }) => {
  await page.goto('http://localhost:5173/auth/forgot-password')
  await page.getByPlaceholder('john@gmail.com').click()
  await page
    .getByPlaceholder('john@gmail.com')
    .fill('samuelvanhaecke30@gmail.com')
  await page.getByPlaceholder('john@gmail.com').press('Tab')
  await page.getByRole('button', { name: 'Send Email' }).press('Enter')
})
