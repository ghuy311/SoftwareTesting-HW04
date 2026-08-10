# Kế hoạch Triển khai: Data-Driven Test Automation cho FR-14 (Quản lý Danh mục - Category CRUD)

Tài liệu này trình bày kế hoạch thiết kế bộ kịch bản kiểm thử tự động (automation test suite) theo phương pháp Data-Driven cho tính năng **FR-14: Quản lý Danh mục** kết hợp với ràng buộc **FR-12: Kiểm soát Truy cập (Access Control)** của dự án EShop.

---

## User Review Required

> [!IMPORTANT]
> - **Cấu trúc Test Data:** Dữ liệu kiểm thử được phân tách hoàn toàn vào file JSON `data/fr14.data.json`. Không hardcode dữ liệu trong script test.
> - **Độ phủ Test Case (12 TCs):** Bộ kịch bản bao gồm 12 test cases phủ đủ các nhóm: Positive (Thêm/Xem/Xóa thành công), Negative (Để trống tên, khoảng trắng, xóa danh mục ràng buộc sản phẩm), Access Control (Khách/User không có quyền Admin), và Network/API Assertions (Kiểm tra request POST/DELETE /api/categories).
> - **Các Assertion Pattern được áp dụng:**
>   1. **Visibility/Text Assertion:** Kiểm tra sự hiện diện của phần tử UI và thông báo lỗi.
>   2. **State Assertion:** Kiểm tra số lượng danh mục thay đổi sau thao tác Thêm/Xóa, kiểm tra giá trị reset form.
>   3. **Network/API Assertion:** Bắt và kiểm tra HTTP Response (Status 200/201/401/403) từ Backend API (`/api/categories`).

---

## Proposed Changes

### Automation Testing Suite (`eshop-automation`)

#### [NEW] [fr14.data.json](file:///d:/Nam3/SoftwareTesting/SoftwareTesting-HW04/eshop-automation/data/fr14.data.json)
- Lưu trữ toàn bộ dữ liệu kiểm thử dưới dạng cấu trúc JSON sạch:
  - `adminAccount`: Tài khoản Admin mẫu để đăng nhập.
  - `userAccount`: Tài khoản User thường (không phải admin) để test phân quyền.
  - `validCategories`: Danh sách tên danh mục hợp lệ (tên thường, tên ngắn 1 ký tự, tên chứa dấu tiếng Việt/ký tự đặc biệt, tên dài).
  - `invalidCategories`: Các trường hợp dữ liệu không hợp lệ (tên rỗng `""`, chỉ chứa khoảng trắng `"   "`).
  - `expectedMessages`: Các câu thông báo lỗi hoặc tiêu đề UI dự kiến theo đặc tả FR-14 & FR-21.

#### [NEW] [fr14-category-management.spec.js](file:///d:/Nam3/SoftwareTesting/SoftwareTesting-HW04/eshop-automation/tests/fr14-category-management.spec.js)
- Xây dựng 12 Test Cases chạy bằng Playwright Test runner:
  - **TC01:** Admin xem danh sách danh mục hiện có (Visibility Assertion).
  - **TC02:** Admin thêm danh mục hợp lệ thành công (State Assertion & Data-driven từ `validCategories[0]`).
  - **TC03:** Admin thêm danh mục với tên ngắn 1 ký tự (Data-driven từ `validCategories[1]`).
  - **TC04:** Admin thêm danh mục chứa Tiếng Việt và ký tự đặc biệt (Data-driven từ `validCategories[2]`).
  - **TC05:** Admin thêm danh mục để trống tên -> Chặn bởi HTML5 validation hoặc báo lỗi UI (Negative Case).
  - **TC06:** Admin thêm danh mục tên chỉ toàn khoảng trắng -> Hệ thống báo lỗi "Tên danh mục là bắt buộc" (Negative Case).
  - **TC07:** Admin xóa một danh mục thành công -> Danh mục biến mất khỏi danh sách (State Assertion).
  - **TC08:** Admin xóa danh mục đang có sản phẩm thuộc về -> Chặn xóa và hiển thị cảnh báo phù hợp (Edge/Negative Case).
  - **TC09:** Người dùng thường (role = 'user') truy cập trang `/admin/categories` -> Bị chặn/chuyển hướng (Access Control FR-12).
  - **TC10:** Gọi API `POST /api/categories` không truyền token hoặc token không có quyền admin -> Trả về HTTP 401/403 (Network Assertion & Access Control FR-12).
  - **TC11:** Admin thêm danh mục kích hoạt API `POST /api/categories` trả về HTTP 200/201 thành công (Network Assertion).
  - **TC12:** Thêm danh mục với độ dài tên cực lớn (255+ ký tự) -> UI không bị crash/tràn giao diện (Robustness Edge Case).

---

## Verification Plan

### Automated Tests
- Chạy thử nghiệm kịch bản Playwright trên 3 trình duyệt (Chromium, Firefox, WebKit):
  ```bash
  npx playwright test tests/fr14-category-management.spec.js
  npx playwright test tests/fr14-category-management.spec.js --project=chromium
  npx playwright test tests/fr14-category-management.spec.js --project=firefox
  npx playwright test tests/fr14-category-management.spec.js --project=webkit
  ```
- Kiểm tra file báo cáo HTML sinh ra trong mục `reports/` để đảm bảo hiển thị đúng thông tin "Run by: 23127376".

### Manual Verification
- Kiểm tra tính tuân thủ quy định: Không chứa bất kỳ icon/emoji nào trong file mã nguồn và nội dung dữ liệu kiểm thử.
- Đảm bảo mã nguồn rõ ràng, dễ bảo trì và giải thích nguyên nhân nếu có test case bị fail do phát hiện lỗi thật (bug) trên hệ thống SUT EShop.
