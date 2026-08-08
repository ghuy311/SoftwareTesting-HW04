const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Đọc test data từ file JSON (Data-driven)
const testDataPath = path.join(__dirname, '../data/fr07.data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

test.describe('FR-07: Giỏ hàng (Shopping Cart) - Positive Cases', () => {
    test.beforeEach(async ({ page }) => {
        // Giả định URL gốc là http://localhost:5173
        await page.goto('http://localhost:5173');
    });

    test('TC01: Thêm một sản phẩm vào giỏ hàng', async ({ page }) => {
        const data = testData.positiveCases.add_single;

        // Bước 1: Mở trang chi tiết sản phẩm (Cần review selector/url thật)
        await page.goto(`http://localhost:5173/product/${data.productId}`);

        // Bước 2: Bấm nút thêm vào giỏ.
        // LƯU Ý BUG FR-06: Nút "Thêm vào giỏ hàng" cần click 2 lần.
        // Tạm dùng click 2 lần ở đây để có dữ liệu cho FR-07. Sinh viên cần rà soát lại.
        const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
        await addToCartBtn.click();
        await addToCartBtn.click();

        // Bước 3: Chuyển sang giỏ hàng
        await page.locator('a[href="/cart"]').click(); // Giả định có thẻ a href=/cart

        // Bước 4: Kiểm tra cơ bản
        await expect(page.locator('text=' + data.productName)).toBeVisible();
        // Kiểm tra nhãn "Tổng cộng" theo spec
        await expect(page.locator('text=Tổng cộng')).toBeVisible();
    });

    test('TC02: Thêm cùng một sản phẩm vào giỏ (Bug FR-07 trùng dòng)', async ({ page }) => {
        const data = testData.positiveCases.add_multiple_same;

        await page.goto(`http://localhost:5173/product/${data.productId}`);

        const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });

        // Lần 1
        await addToCartBtn.click();
        await addToCartBtn.click();

        // Đợi 3s sau lần bấm đầu tiên (Lưu ý: đây là hardcoded wait, dễ gây flaky test)
        await page.waitForTimeout(3000);

        // Lần 2
        await addToCartBtn.click();
        await addToCartBtn.click();

        await page.locator('a[href="/cart"]').click(); // Giả định có thẻ a href=/cart

        // Tạm assert theo spec (Cộng dồn số lượng)
        // Lưu ý: Test này sẽ fail trên hệ thống thật vì bug FR-07 tạo dòng mới.
        // Đây là minh chứng bắt lỗi (bug) tự động của test script.
        const quantityInput = page.locator('.quantity-input').first();
        await expect(quantityInput).toHaveValue(data.quantity.toString());
    });

    test('TC03: Hiển thị giỏ hàng trống', async ({ page }) => {
        const data = testData.emptyCart;
        await page.goto('http://localhost:5173/cart');
        await expect(page.locator(`text=${data.expectedMessage}`)).toBeVisible();
    });

    test('TC04: Nhập số lượng không hợp lệ vào giỏ hàng (Negative)', async ({ page }) => {
        const data = testData.positiveCases.add_single;
        const invalidQties = testData.negativeCases.invalidQuantities;

        // Setup: Có 1 SP trong giỏ
        await page.goto(`http://localhost:5173/product/${data.productId}`);
        const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
        await addToCartBtn.click();
        await addToCartBtn.click();
        await page.goto('http://localhost:5173/cart');

        const quantityInput = page.locator('.quantity-input').first();

        for (const qty of invalidQties) {
            await quantityInput.fill(qty.toString());
            // Blur để kích hoạt event change nếu có
            await quantityInput.blur();

            // Assert State: Kiểm tra xem input có tự reset về 1 không, hoặc chặn giá trị sai.
            const value = await quantityInput.inputValue();
            // Nếu bị reset về giá trị hợp lệ, value phải là >= 1.
            const isInvalidState = (value === '0' || value === '-1' || value === 'abc' || value === '');
            expect(isInvalidState, `Giá trị nhập vào (${qty}) không được phép giữ nguyên`).toBe(false);
        }
    });

    test('TC05: Xóa sản phẩm phải hiển thị confirm dialog (Negative/Edge - Bắt Bug)', async ({ page }) => {
        const data = testData.positiveCases.add_single;
        await page.goto(`http://localhost:5173/product/${data.productId}`);
        const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
        await addToCartBtn.click();
        await addToCartBtn.click();
        await page.goto('http://localhost:5173/cart');

        let dialogTriggered = false;
        page.on('dialog', async dialog => {
            dialogTriggered = true;
            await dialog.accept();
        });

        // Giả định nút xóa có class .delete-item-btn hoặc text 'Xóa'
        const deleteBtn = page.locator('button:has-text("Xóa")').first();
        await deleteBtn.click();

        // Assert State: Sẽ fail tại đây do bug FR-07 đã biết (không có dialog)
        expect(dialogTriggered, 'Phải có confirm dialog khi xóa sản phẩm khỏi giỏ hàng').toBe(true);
    });

    test('TC06: Giỏ hàng phải gọi API để lưu dữ liệu (Network Assertion - Bắt Bug)', async ({ page }) => {
        const data = testData.positiveCases.add_single;
        await page.goto(`http://localhost:5173/product/${data.productId}`);
        
        const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
        
        // Assert Network: Dựa vào docs/api_specification.md, phải có POST request đến /api/cart
        // Test này sẽ cố tình bắt lỗi (FAIL do Timeout) vì hệ thống hiện tại 
        // dính bug ở FR-07 (Chỉ lưu ở React state, không gọi API)
        const responsePromise = page.waitForResponse(
            response => response.url().includes('/api/cart') && response.request().method() === 'POST',
            { timeout: 3000 } // Để 3s cho nhanh fail, chứng minh API không được gọi
        );
        
        await addToCartBtn.click();
        await addToCartBtn.click(); // Bug FR-06: click 2 lần
        
        // Nếu không có API request nào, đoạn code dưới sẽ ném ra TimeoutError
        const response = await responsePromise;
        
        // Nếu qua được timeout, assert HTTP Status
        expect(response.status()).toBe(200);
    });
});
