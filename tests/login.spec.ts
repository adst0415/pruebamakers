import { test, expect } from '@playwright/test';

test('1. Login exitoso con credenciales válidas', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');//ingreso a la pagina 
  await page.locator('[data-test="username"]').fill('standard_user');//usuario
  await page.locator('[data-test="password"]').fill('secret_sauce');//contraseña
  await page.locator('[data-test="login-button"]').click();//seleccion Login
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');//Confirmacion de ingreso
  
});

  test('2. Login fallido con contraseña incorrecta', async ({ page }) => {
    await page.goto('https://saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');// usuario
    await page.locator('[data-test="password"]').fill('password_fallido');// contraseña errada
    await page.locator('[data-test="login-button"]').click();//Login
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();// espera mensaje
    await expect(errorMessage).toContainText('Username and password do not match any user in this service');//mensaje de contraseña erronea
});

  test('3. Validación de campos obligatorios', async ({ page }) => {
    await page.goto('https://saucedemo.com');//pagina   
    await page.locator('[data-test="login-button"]').click();//Login
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username is required');//Mensaje Esperado
});
test('4. Login con usuario Bloqueado', async ({ page }) => {
    await page.goto('https://saucedemo.com');
    await page.locator('[data-test="username"]').fill('locked_out_user');// usuario
    await page.locator('[data-test="password"]').fill('secret_sauce');// contraseña errada
    await page.locator('[data-test="login-button"]').click();//Login
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();// espera mensaje
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');//mensaje de contraseña erronea
});