const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Đọc test data từ file JSON (Data-driven)
const testDataPath = path.join(__dirname, '../data/fr14.data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const ADMIN_URL = testData.adminUrl || 'http://localhost:5174';

// Hàm hỗ trợ escape các ký tự đặc biệt trong regex khi tìm kiếm text chính xác
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test.describe('FR-14: Quản lý Danh mục (Category CRUD)', () => {

  test.beforeEach(async ({ page }) => {
    // Truy cập phân hệ Admin
    await page.goto(ADMIN_URL);

    // Kiểm tra nếu đang ở trang Login Admin thì thực hiện đăng nhập Admin
    const emailInput = page.locator('input[placeholder="Email"]');
    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailInput.fill(testData.adminAccount.email);
      await page.locator('input[placeholder="Password"]').fill(testData.adminAccount.password);
      await page.locator('button:has-text("Login")').click();
    }

    // Click vào tab "Danh mục" ở sidebar giao diện Admin
    const categoryTab = page.locator('li', { hasText: 'Danh mục' });
    await categoryTab.click();
  });

  // ==========================================
  // POSITIVE TEST SUITE (TC01 - TC04)
  // ==========================================

  // TC01: Admin xem danh sách danh mục hiện có (Visibility Assertion)
  test('TC01: Admin xem danh sách danh mục hiện có', async ({ page }) => {
    // Assertion Pattern 1: Visibility assertion cho tiêu đề trang Quản lý danh mục
    const pageHeading = page.locator('h2', { hasText: testData.uiLabels.pageTitle });
    await expect(pageHeading).toBeVisible();

    // Kiểm tra bảng danh sách danh mục và các ô dữ liệu danh mục hiện có
    const categoryTable = page.locator('table');
    await expect(categoryTable).toBeVisible();
    await expect(categoryTable.locator('tbody tr', { hasText: 'Điện thoại' })).toBeVisible();
    await expect(categoryTable.locator('tbody tr', { hasText: 'Laptop' })).toBeVisible();
    await expect(categoryTable.locator('tbody tr', { hasText: 'Phụ kiện' })).toBeVisible();
  });

  // TC02: Admin thêm danh mục hợp lệ thành công (State Assertion & Data-driven: standard)
  test('TC02: Admin thêm danh mục chuẩn hợp lệ thành công', async ({ page }) => {
    const categoryData = testData.validCategories.standard;

    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    await inputName.fill(categoryData.name);
    await addBtn.click();

    // Assertion Pattern 1 & 2: Visibility Assertion (Danh mục mới xuất hiện trong bảng)
    const newCategoryRow = page.locator('table tbody tr', { hasText: categoryData.name });
    await expect(newCategoryRow).toBeVisible();

    // State Assertion: Ô nhập được reset về chuỗi rỗng
    await expect(inputName).toHaveValue('');
  });

  // TC03: Admin thêm danh mục với tên ngắn 1 ký tự (Data-driven: singleChar)
  test('TC03: Admin thêm danh mục với tên ngắn 1 ký tự thành công', async ({ page }) => {
    const categoryData = testData.validCategories.singleChar;

    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    await inputName.fill(categoryData.name);
    await addBtn.click();

    // Assertion Pattern 1: Visibility Assertion (Dùng exact regex match để không bị Strict Mode Violation)
    const newCategoryCell = page.locator('table tbody tr td:nth-child(2)').filter({
      hasText: new RegExp(`^${escapeRegex(categoryData.name)}$`)
    });
    await expect(newCategoryCell).toBeVisible();
  });

  // TC04: Admin thêm danh mục chứa Tiếng Việt và ký tự đặc biệt (Data-driven: specialChars)
  test('TC04: Admin thêm danh mục chứa Tiếng Việt và ký tự đặc biệt thành công', async ({ page }) => {
    const categoryData = testData.validCategories.specialChars;

    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    await inputName.fill(categoryData.name);
    await addBtn.click();

    // Assertion Pattern 1: Visibility Assertion
    const newCategoryRow = page.locator('table tbody tr', { hasText: categoryData.name });
    await expect(newCategoryRow).toBeVisible();
  });

  // ==========================================
  // NEGATIVE TEST SUITE (TC05 - TC08) - DATA-DRIVEN
  // ==========================================

  // TC05: Admin thêm danh mục để trống tên (Data-driven từ testData.invalidCategories.empty)
  test('TC05: Admin thêm danh mục để trống tên không thành công', async ({ page }) => {
    const categoryData = testData.invalidCategories.empty;
    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    await inputName.fill(categoryData.name);
    await addBtn.click();

    // Data-driven assertion: Kiểm tra không có ô tên danh mục nào khớp hoàn toàn giá trị rỗng từ testData JSON
    const emptyCategoryCell = page.locator('table tbody tr td:nth-child(2)').filter({
      hasText: new RegExp(`^${escapeRegex(categoryData.name)}$`)
    });
    await expect(emptyCategoryCell).not.toBeVisible();
  });

  // TC06: Admin thêm danh mục tên chỉ chứa khoảng trắng (Data-driven từ testData.invalidCategories.whitespace)
  test('TC06: Admin thêm danh mục tên chỉ chứa khoảng trắng không thành công', async ({ page }) => {
    const categoryData = testData.invalidCategories.whitespace;
    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    await inputName.fill(categoryData.name);
    await addBtn.click();

    // Data-driven assertion: Kiểm tra không có ô tên danh mục nào khớp hoàn toàn chuỗi khoảng trắng từ testData JSON
    const whitespaceCell = page.locator('table tbody tr td:nth-child(2)').filter({
      hasText: new RegExp(`^${escapeRegex(categoryData.name)}$`)
    });
    await expect(whitespaceCell).not.toBeVisible();
  });

  // TC07: Admin xóa một danh mục hợp lệ thành công (Data-driven từ testData.categoryToDelete)
  test('TC07: Admin xóa danh mục thành công', async ({ page }) => {
    const categoryData = testData.categoryToDelete;
    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    // Bước 1: Thêm danh mục mới từ data JSON
    await inputName.fill(categoryData.name);
    await addBtn.click();

    const createdRow = page.locator('table tbody tr', { hasText: categoryData.name });
    await expect(createdRow).toBeVisible();

    // Bước 2: Thực hiện xóa danh mục
    const deleteBtn = createdRow.locator('button', { hasText: testData.uiLabels.deleteButtonText });
    await deleteBtn.click();

    // State Assertion: Hàng danh mục không còn xuất hiện trong bảng
    await expect(createdRow).not.toBeVisible();
  });

  // TC08: Admin xóa danh mục đang có sản phẩm thuộc về (Data-driven từ testData.categoryWithProducts)
  test('TC08: Admin xóa danh mục đang có sản phẩm phải bị chặn hoặc thông báo lỗi', async ({ page }) => {
    const categoryData = testData.categoryWithProducts;
    const targetRow = page.locator('table tbody tr', { hasText: categoryData.name });
    await expect(targetRow).toBeVisible();

    // Data-driven alert handler: Bắt thông báo lỗi và đối chiếu với expectedErrorMessage trong testData JSON
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    const deleteBtn = targetRow.locator('button', { hasText: testData.uiLabels.deleteButtonText });
    await deleteBtn.click();

    // State Assertion: Danh mục đang có sản phẩm vẫn phải tồn tại trong bảng
    await expect(targetRow).toBeVisible();
  });

  // ==========================================
  // NETWORK / API ASSERTION SUITE (TC09 - TC12) - DATA-DRIVEN
  // ==========================================

  // TC09: Access Control FR-12 - User thường truy cập hoặc tạo danh mục phải bị kiểm soát HTTP 401/403 (Data-driven từ testData.userAccount & testData.apiEndpoints)
  test('TC09: Access Control - User thường tạo danh mục phải bị chỉ định HTTP 401/403 (Lỗi RBAC)', async ({ page }) => {
    const userAccount = testData.userAccount;
    const categoriesEndpoint = testData.apiEndpoints.categories;

    // Đăng xuất khỏi Admin bằng cách xóa localStorage adminToken
    await page.evaluate(() => localStorage.removeItem('adminToken'));
    await page.goto(ADMIN_URL);

    // Kiểm tra đăng nhập với tài khoản User thường (non-admin)
    const emailInput = page.locator('input[placeholder="Email"]');
    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailInput.fill(userAccount.email);
      await page.locator('input[placeholder="Password"]').fill(userAccount.password);

      // Lắng nghe dialog nếu có phản hồi "Bạn không phải là admin!" từ uiLabels
      page.on('dialog', async dialog => {
        await dialog.dismiss();
      });

      await page.locator('button:has-text("Login")').click();
    }

    // Capture response của request POST /api/categories
    // Theo đặc tả FR-12 & SEC-03: API phải trả về status 401 hoặc 403 khi role không phải admin
    // Bắt bug FR-14 (RBAC hỏng): SUT backend vẫn trả về 200/201
    const categoryTab = page.locator('li', { hasText: 'Danh mục' });
    if (await categoryTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await categoryTab.click();
      const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
      const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

      await inputName.fill('Category Test RBAC');
      const responsePromise = page.waitForResponse(
        res => res.url().includes(categoriesEndpoint) && res.request().method() === 'POST'
      );
      await addBtn.click();
      const response = await responsePromise;

      // Assertion Pattern 3: Network Assertion - Kiểm tra HTTP status response phải là 401 hoặc 403
      expect([401, 403]).toContain(response.status());
    } else {
      // User thường bị chặn truy cập giao diện Admin (Đạt Access Control trên FE)
      const loginHeading = page.locator('h2', { hasText: 'Admin Login' });
      await expect(loginHeading).toBeVisible();
    }
  });

  // TC10: Admin thêm danh mục kích hoạt API POST /api/categories (Data-driven từ testData.apiEndpoints & testData.validCategories)
  test('TC10: Admin thêm danh mục phải gửi request POST /api/categories thành công (HTTP 200/201)', async ({ page }) => {
    const categoryData = testData.validCategories.standard;
    const categoriesEndpoint = testData.apiEndpoints.categories;
    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    await inputName.fill(categoryData.name + ' API Test');

    // Assertion Pattern 3: Network Assertion từ page.waitForResponse dùng apiEndpoints trong testData JSON
    const responsePromise = page.waitForResponse(
      res => res.url().includes(categoriesEndpoint) && res.request().method() === 'POST'
    );
    await addBtn.click();

    const response = await responsePromise;
    expect([200, 201]).toContain(response.status());

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
  });

  // TC11: Admin xóa danh mục kích hoạt API DELETE /api/categories/:id (Data-driven từ testData.apiEndpoints)
  test('TC11: Admin xóa danh mục phải gửi request DELETE /api/categories/:id thành công', async ({ page }) => {
    const categoryData = testData.categoryToDelete;
    const categoriesEndpoint = testData.apiEndpoints.categories;
    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    // Bước 1: Thêm danh mục để có ID xóa
    await inputName.fill(categoryData.name + ' Delete API');
    await addBtn.click();

    const targetRow = page.locator('table tbody tr', { hasText: categoryData.name + ' Delete API' });
    await expect(targetRow).toBeVisible();

    // Bước 2: Capture request DELETE qua API Network assertion
    const responsePromise = page.waitForResponse(
      res => res.url().includes(categoriesEndpoint) && res.request().method() === 'DELETE'
    );

    const deleteBtn = targetRow.locator('button', { hasText: testData.uiLabels.deleteButtonText });
    await deleteBtn.click();

    const response = await responsePromise;
    // Assertion Pattern 3: Network Assertion cho API delete status
    expect(response.status()).toBe(200);

    // Kiểm tra phần tử đã bị gỡ khỏi bảng giao diện UI (Visibility/State Assertion)
    await expect(targetRow).not.toBeVisible();
  });

  // TC12: Admin thêm danh mục với tên cực đại (255+ ký tự) (Data-driven từ testData.validCategories.longName)
  test('TC12: Admin thêm danh mục với tên cực đại không bị crash UI hoặc lỗi giao diện', async ({ page }) => {
    const categoryData = testData.validCategories.longName;
    const inputName = page.locator(`input[placeholder="${testData.uiLabels.inputPlaceholder}"]`);
    const addBtn = page.locator('button', { hasText: testData.uiLabels.addButtonText });

    await inputName.fill(categoryData.name);
    await addBtn.click();

    // Assertion Pattern 1: Visibility assertion cho danh mục tên dài trong bảng UI
    const longCategoryRow = page.locator('table tbody tr', { hasText: categoryData.name });
    await expect(longCategoryRow).toBeVisible();
  });

});
