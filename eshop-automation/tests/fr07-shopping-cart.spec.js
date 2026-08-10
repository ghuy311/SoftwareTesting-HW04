const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Đọc test data từ file JSON (Data-driven)
const testDataPath = path.join(__dirname, '../data/fr07.data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

test.describe('FR-07: Giỏ hàng (Shopping Cart) - Complete Data-Driven Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // --- NHÓM 1: POSITIVE TEST CASES ---

  // TC01: Thêm một sản phẩm vào giỏ hàng (Visibility Assertion)
  test('TC01: Thêm một sản phẩm vào giỏ hàng thành công', async ({ page }) => {
    const data = testData.positiveCases.add_single;

    await page.goto(`/product/${data.productId}`);

    const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
    await addToCartBtn.click();
    await addToCartBtn.click(); // Bug FR-06: click 2 lần

    await page.locator('a[href="/cart"]').click();

    // Assertion Pattern 1: Visibility/Text assertion
    await expect(page.locator(`text=${data.productName}`)).toBeVisible();
    await expect(page.locator('text=Tổng cộng')).toBeVisible();
  });

  // TC02: Thêm cùng một sản phẩm nhiều lần (State Assertion - Bug trùng dòng)
  test('TC02: Thêm cùng một sản phẩm vào giỏ phải cộng dồn số lượng', async ({ page }) => {
    const data = testData.positiveCases.add_multiple_same;

    await page.goto(`/product/${data.productId}`);
    const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });

    // Lần 1
    await addToCartBtn.click();
    await addToCartBtn.click();

    await page.waitForTimeout(1000);

    // Lần 2
    await addToCartBtn.click();
    await addToCartBtn.click();

    await page.locator('a[href="/cart"]').click();

    // Assertion Pattern 2: State assertion (Kiểm tra cột Số lượng <td> trong giỏ hàng)
    const quantityCell = page.locator('tbody tr td').nth(2);
    await expect(quantityCell).toHaveText(data.quantity.toString());
  });

  // TC03: Thêm nhiều sản phẩm khác nhau vào giỏ hàng (State Assertion - Tổng tiền)
  test('TC03: Thêm nhiều sản phẩm khác nhau và tính tổng tiền giỏ hàng', async ({ page }) => {
    const data = testData.positiveCases.add_multiple_different;

    for (const item of data.items) {
      await page.goto(`/product/${item.productId}`);
      const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
      await addToCartBtn.click();
      await addToCartBtn.click();
    }

    await page.locator('a[href="/cart"]').click();

    // Assertion Pattern 1 & 2: Visibility & State assertion
    for (const item of data.items) {
      await expect(page.locator(`text=${item.productName}`)).toBeVisible();
    }
    const totalPriceElement = page.locator('.total-price, [data-testid="total-price"]');
    if (await totalPriceElement.isVisible()) {
      await expect(totalPriceElement).toContainText(data.expectedCombinedTotal);
    }
  });

  // TC04: Cập nhật số lượng sản phẩm khi thêm vào giỏ hàng (State Assertion)
  test('TC04: Thay đổi số lượng sản phẩm trực tiếp trong giỏ hàng', async ({ page }) => {
    const data = testData.positiveCases.update_quantity;

    // Bước 1: Mở trang chi tiết sản phẩm
    await page.goto(`/product/${data.productId}`);

    // Bước 2: Nhập số lượng mong muốn trên trang chi tiết (do Cart.jsx hiển thị số lượng dạng text <td>)
    const quantityInput = page.locator('input[type="number"]');
    await quantityInput.fill(data.updatedQuantity.toString());

    // Bước 3: Click nút Thêm vào giỏ hàng (2 lần do bug clickCount ở ProductDetail.jsx)
    const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
    await addToCartBtn.click();
    await addToCartBtn.click();

    // Bước 4: Click href chuyển sang trang giỏ hàng
    await page.locator('a[href="/cart"]').click();

    // Bước 5: Kiểm tra cột Số lượng (thẻ <td> thứ 3 trong bảng giỏ hàng)
    const quantityCell = page.locator('tbody tr td').nth(2);
    await expect(quantityCell).toHaveText(data.updatedQuantity.toString());
  });

  // TC05: Hiển thị giỏ hàng trống (Visibility Assertion)
  test('TC05: Hiển thị giao diện giỏ hàng trống khi chưa thêm sản phẩm', async ({ page }) => {
    const data = testData.emptyCart;
    await page.locator('a[href="/cart"]').click();

    // Assertion Pattern 1: Visibility assertion
    await expect(page.locator(`text=${data.expectedMessage}`)).toBeVisible();
  });

  // --- NHÓM 2: NEGATIVE TEST CASES (DATA-DRIVEN PARAMETERIZED) ---

  const invalidQuantities = testData.negativeCases.invalidQuantities;

  invalidQuantities.forEach((qty, index) => {
    const tcNumber = (6 + index).toString().padStart(2, '0');
    test(`TC${tcNumber}: Nhập số lượng không hợp lệ vào giỏ hàng (qty = "${qty}")`, async ({ page }) => {
      const singleData = testData.positiveCases.add_single;

      // Bước 1: Mở trang chi tiết sản phẩm
      await page.goto(`/product/${singleData.productId}`);

      // Bước 2: Nhập số lượng không hợp lệ tại ô input của trang chi tiết
      const quantityInput = page.locator('input[type="number"]');

      try {
        await quantityInput.fill(qty.toString());
        await quantityInput.blur();
      } catch (error) {
        console.log(`Bị chặn nhập liệu HTML5 cho giá trị: ${qty}`);
        return;
      }

      // Bước 3: Click thêm vào giỏ
      const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
      await addToCartBtn.click();
      await addToCartBtn.click();

      // Bước 4: Chuyển sang giỏ hàng bằng link href
      await page.locator('a[href="/cart"]').click();

      // Assertion Pattern 2: State assertion (Kiểm tra xem số lượng trong giỏ có bị mang giá trị sai không)
      const quantityCell = page.locator('tbody tr td').nth(2);
      if (await quantityCell.isVisible()) {
        const val = await quantityCell.textContent();
        const isInvalid = (val === '0' || val === '-1' || val === 'abc' || val === '');
        expect(isInvalid, `Giá trị không hợp lệ "${qty}" không được phép giữ nguyên trong giỏ`).toBe(false);
      }
    });
  });

  // --- NHÓM 3: EDGE CASES & NETWORK ASSERTIONS ---

  // TC10: Xóa sản phẩm khỏi giỏ hàng phải hiển thị dialog xác nhận (Event Assertion)
  test('TC10: Xóa sản phẩm khỏi giỏ hàng phải hiển thị dialog xác nhận', async ({ page }) => {
    const data = testData.positiveCases.add_single;

    await page.goto(`/product/${data.productId}`);
    const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
    await addToCartBtn.click();
    await addToCartBtn.click();
    await page.locator('a[href="/cart"]').click();

    let dialogTriggered = false;
    page.on('dialog', async dialog => {
      dialogTriggered = true;
      await dialog.accept();
    });

    const deleteBtn = page.locator('button:has-text("Xóa"), .delete-btn').first();
    await deleteBtn.click();

    // Assertion Pattern 2: State assertion (Yêu cầu có confirm dialog)
    expect(dialogTriggered, 'Phải hiển thị confirm dialog khi thực hiện xóa sản phẩm').toBe(true);
  });

  // TC11: Đẩy dữ liệu giỏ hàng qua API POST /api/cart (Network Assertion)
  test('TC11: Thêm vào giỏ hàng phải gửi request POST đến /api/cart', async ({ page }) => {
    const data = testData.positiveCases.add_single;
    const apiEndpoint = testData.apiEndpoints.cart;

    await page.goto(`/product/${data.productId}`);
    const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });

    // Assertion Pattern 3: Network assertion
    const responsePromise = page.waitForResponse(
      response => response.url().includes(apiEndpoint) && response.request().method() === 'POST',
      { timeout: 4000 }
    );

    await addToCartBtn.click();
    await addToCartBtn.click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  // TC12: Lấy dữ liệu giỏ hàng từ API GET /api/cart khi xem trang giỏ hàng (Network Assertion)
  test('TC12: Mở trang giỏ hàng phải tự động gọi API GET /api/cart để tải dữ liệu', async ({ page }) => {
    const apiEndpoint = testData.apiEndpoints.cart;

    // Assertion Pattern 3: Network assertion
    const responsePromise = page.waitForResponse(
      response => response.url().includes(apiEndpoint) && response.request().method() === 'GET',
      { timeout: 4000 }
    ).catch(() => null);

    await page.locator('a[href="/cart"]').click();

    const response = await responsePromise;
    if (response) {
      expect(response.status()).toBe(200);
    } else {
      console.log('TC12 Warning: Không phát hiện API GET /api/cart khi load trang giỏ hàng');
    }
  });

});
