# HW04 — Automation Testing (EShop SUT)

> **Môn học:** CS423 / CSC15003 — Kiểm chứng Phần mềm  
> **Sinh viên:** HỒ GIA HUY  
> **MSSV:** 23127376  
> **Lớp:** 23KTPM2 / 23CLC  
> **Giảng viên hướng dẫn:** ThS. Lâm Quang Vũ / ThS. Trần Duy Hoàng / ThS. Trần Thị Bích Hạnh  

---

## 1. Bảng Tự Đánh Giá (Self-Assessment Table)

| STT | Hạng mục (Criteria) | Điểm tối đa | Điểm tự đánh giá |
| :---: | :--- | :---: | :---: |
| **1** | Task 1 — Feature A (FR-06: Xem chi tiết sản phẩm) | 25 | 25 |
| **2** | Task 1 — Feature B (FR-07: Giỏ hàng - Shopping Cart) | 25 | 25 |
| **3** | Task 1 — Feature C (FR-14: Quản lý danh mục - Category CRUD) | 25 | 25 |
| **4** | Task 2 — Demo video (Thuyết minh & Thao tác thực tế) | 15 | 15 |
| **5** | Agent Skill (Tự động hóa quy trình theo kỷ luật AI-First) | 10 | 10 |
| **Tổng** | **Tổng điểm (Total)** | **100** | **100** |

---

## 2. Tóm Tắt Kết Quả Kiểm Thử (Test Summary Report)

| Chỉ số | Giá trị |
| :--- | :--- |
| **Số lượng tính năng kiểm thử (Features)** | **3 features** (FR-06, FR-07, FR-14) |
| **Tổng số kịch bản tự động hóa (Test Cases)** | **36 test cases** (12 TCs / feature) |
| **Số lượng trình duyệt thử nghiệm (Browsers)** | **3 browsers** (Chromium, Firefox, WebKit) |
| **Tổng số lượt chạy trình duyệt (Browser Runs)** | **108 test runs** (36 TCs × 3 browsers) |
| **Số lượt Test Pass (Đạt)** | **52 runs** |
| **Số lượt Test Fail (Bắt được lỗi SUT thực tế)** | **56 runs** |
| **Số lượng Bug được phát hiện & báo cáo** | **5 lỗi nghiêm trọng** (FR-06, FR-07, FR-14) |
| **Metadata HTML Report** | `"Run by: 23127376"` + Timestamp ISO |
| **Link Video Demo YouTube** |https://youtu.be/oWQxS3hL81s |
---

## 3. Cấu Trúc Thư Mục Repository

```text
HW04/
├── eshop-automation/
│   ├── data/                 # File dữ liệu JSON (Data-driven: fr06, fr07, fr14)
│   ├── docs/                 # Đặc tả hệ thống SUT & tài liệu API contract
│   ├── tests/                # 3 bộ test script Playwright (fr06, fr07, fr14)
│   ├── reports/              # Playwright HTML Report sinh ra tự động
│   └── playwright.config.js  # Cấu hình Multi-browser, Metadata & Reporter
├── skills/                   # Agent Skill định nghĩa quy trình tự động hóa AI-First
│   └── SKILL.md
├── reports/
│   └── main_report.md        # Báo cáo tổng hợp chi tiết bài tập HW04
├── ai-audit-report.md        # Nhật ký Audit AI (16 Artifacts)
├── ai-critique.md            # Đánh giá phản biện năng lực AI
└── README.md                 # Tài liệu hướng dẫn & Bảng tổng kết
```

---

## 4. Hướng Dẫn Chạy Kiểm Thử Cục Bộ (Local Execution Guide)

### Bước 1: Khởi động hệ thống SUT (Backend & Frontend)
Đảm bảo hệ thống EShop SUT đang hoạt động:
- **Backend API:** `http://localhost:3000`
- **Frontend Client:** `http://localhost:5173`
- **Frontend Admin:** `http://localhost:5174`

### Bước 2: Chạy kiểm thử tự động với Playwright

```bash
# Cài đặt phụ thuộc
cd eshop-automation
npm install

# Chạy toàn bộ bộ kiểm thử tự động 108 runs trên 3 trình duyệt
npx playwright test

# Chạy riêng phân hệ FR-14 Quản lý danh mục
npx playwright test tests/fr14-category-management.spec.js

# Xem báo cáo trực quan Playwright HTML Report
npx playwright show-report reports
```

---
*Báo cáo được hoàn thành bởi sinh viên **Hồ Gia Huy - 23127376** cho bài tập HW04 môn Kiểm chứng Phần mềm.*
