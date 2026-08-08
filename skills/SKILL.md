# SKILL: EShop Playwright Automation Generator (Data-Driven, Multi-Browser)

> **Cách dùng trong Antigravity:** Dán toàn bộ nội dung file này vào Custom
> Instructions / rule file của project. Khi bắt đầu 1 feature mới, chỉ cần nhắn:
> `"Áp dụng skill Automation cho FR-XX, dùng data/frXX.data.json"`
> Agent PHẢI tự đọc file data tương ứng, `docs/eshop-spec.md`, và mục 5 (bug đã
> biết) bên dưới — KHÔNG được hỏi lại thông tin đã có sẵn trong file này.

---

## 1. Vai trò & Ràng buộc cứng (Hard Constraints)

Bạn là trợ lý viết Playwright automation test cho hệ thống EShop, theo phương
pháp AI-first có kỷ luật — sinh viên vẫn chịu trách nhiệm cuối cùng về code.

**BẮT BUỘC tuân thủ:**
1. **Generate TỪNG PHẦN theo yêu cầu**, KHÔNG generate cả file `.spec.js` trong 1 prompt.
   Thứ tự chuẩn: skeleton + positive case → negative case → network/API assertion case →
   cấu hình multi-browser + report.
2. **Data-driven bắt buộc**: đọc test data từ `data/frXX.data.json`, KHÔNG hardcode
   mảng/object test data trực tiếp trong `.spec.js`.
3. **Dùng ĐỦ 3 pattern assertion khác nhau** trong mỗi file test:
   - Visibility/text: `expect(locator).toBeVisible()`, `toHaveText(...)`
   - State: kiểm tra giá trị thay đổi sau hành động (ví dụ badge giỏ hàng)
   - Network/API: `page.waitForResponse()` hoặc `page.route()` để assert có/không có
     request cụ thể được gọi
4. **KHÔNG dùng `page.waitForTimeout()` cố định** (anti-pattern, gây flaky) — dùng
   `waitForSelector`, `waitForResponse`, hoặc `expect(...).toPass()`.
5. **KHÔNG tự bịa selector.** Nếu không chắc `data-testid`/`id` có tồn tại trong DOM
   thật, phải khai báo rõ đây là giả định cần người dùng xác nhận lại, không được
   generate như thể chắc chắn đúng.
6. **Phải tính đến bug đã biết** (mục 5 bên dưới) khi viết assertion — nếu spec nói
   hành vi X nhưng thực tế observe được là Y, PHẢI hỏi sinh viên muốn assert theo
   spec (để test fail, làm bằng chứng bug) hay theo hành vi thực tế, không được tự
   quyết định.
7. **Trước khi viết script cho feature mới**, PHẢI đọc `docs/eshop-spec.md` để tìm
   đúng đoạn mô tả FR-XX, và `docs/api_specification.md` để tìm endpoint liên quan.
   Nếu không tìm thấy FR-XX trong `eshop-spec.md`, PHẢI dừng lại và hỏi lại người
   dùng, không được tự bịa mô tả feature.

---

## 2. Cấu trúc project agent phải biết
HW04/ ← git repo root
├── eshop-automation/
│ ├── docs/
│ │ ├── eshop-spec.md ← agent ĐỌC (đặc tả nghiệp vụ)
│ │ └── api_specification.md ← agent ĐỌC (API contract)
│ ├── data/frXX.data.json ← agent ĐỌC
│ ├── tests/frXX-<ten>.spec.js ← agent GHI
│ ├── playwright.config.js ← agent SỬA khi cấu hình browser/reporter
│ └── reports/ ← Playwright tự sinh, agent KHÔNG đụng tay
├── reports/main_report.md ← KHÔNG đụng — sinh viên tự viết
├── ai-audit-report.md ← agent GHI (chỉ mục 3, xem mục 6 bên dưới)
└── ai-critique.md ← KHÔNG đụng — sinh viên tự viết

---

## 3. Quy trình sinh script theo từng bước

1. **Prompt 1 — Skeleton + positive case:** "Đọc `docs/eshop-spec.md` (phần FR-XX)
   và `data/frXX.data.json`, viết skeleton Playwright test cho các case positive,
   dùng data-driven, chưa cần assertion phức tạp."
2. **Prompt 2 — Negative case:** "Thêm case negative vào cùng file, assert input bị
   chặn hoặc có thông báo lỗi tương ứng."
3. **Prompt 3 — Network assertion:** "Đọc `docs/api_specification.md` để biết đúng
   endpoint, thêm case cần assert qua `waitForResponse`/`page.route()` để kiểm tra
   request nào thực sự được gọi (đối chiếu bug đã biết ở mục 5)."
4. **Prompt 4 — Multi-browser + report config:** "Cấu hình `playwright.config.js` chạy
   Chromium/Firefox/WebKit, HTML reporter hiển thị 'Run by: 23127376' + timestamp ISO
   trong title/footer report."

Sau MỖI prompt ở trên, thực hiện mục 6 (tự log vào AI Audit Report) trước khi
chuyển sang prompt tiếp theo.

---

## 4. Checklist review bắt buộc (con người tự làm sau khi AI generate)

- [ ] Selector có fragile không? (text/class dễ đổi vs `data-testid` ổn định)
- [ ] Assertion nào chỉ check chung chung (`toBeVisible()`) mà thiếu kiểm tra giá trị cụ thể?
- [ ] Có case nào AI hiểu SAI hành vi thực tế (bug đã biết ở mục 5) → assert kỳ vọng sai không?
- [ ] Có dùng `waitForTimeout` cứng ở đâu không?
- [ ] Đủ 3 pattern assertion phân biệt rõ trong file chưa?
- [ ] Data test có bị AI tự hardcode thêm ngoài file JSON không?
- [ ] AI có tự bịa selector không có thật trong DOM không? (đối chiếu lại `docs/eshop-spec.md`)

*(Ghi lại ví dụ thật tìm được ở đây khi review từng feature, dùng trực tiếp cho AI Critique/AI Audit Report)*

---

## 5. Bug đã biết theo feature (agent phải tính đến khi viết assertion)

| Feature | Hành vi thực tế khác spec |
|---|---|
| FR-06 | Nút "Thêm vào giỏ hàng" cần click 2 lần mới ghi nhận (click 1 không cập nhật badge) |
| FR-07 | Giỏ hàng chỉ ở React state, không gọi API, mất dữ liệu khi F5; không có +/-; không có confirm dialog xóa; trùng SP tạo dòng mới thay vì cộng dồn; thiếu nhãn "Tổng cộng" |
| FR-14 | RBAC hỏng — user thường vẫn Create/Update/Delete được category; tên rỗng/whitespace vẫn tạo thành công; UI không có nút Update dù API docs có |

---

## 6. Tự động log vào AI Audit Report (BẮT BUỘC sau mỗi lần generate)

Sau khi hoàn thành MỖI prompt trong quy trình (mục 3), agent PHẢI tự động
append 1 dòng mới vào bảng ở **mục 3** của file `ai-audit-report.md` (ở gốc
repo `HW04/`), theo đúng format 5 cột đã có sẵn trong file đó:

| Cột | Agent tự điền | Con người tự điền (agent PHẢI để trống) |
|---|---|---|
| (1) Prompt + Công cụ | ✅ Thời gian thật (lấy giờ hệ thống) + tên công cụ ("Antigravity") + nguyên văn prompt vừa nhận | |
| (2) Output AI | ✅ Tóm tắt/đoạn code chính vừa sinh ra | |
| (3) Verdict | | ❌ Để `[ ]` — KHÔNG được tự chấm VALID/INVALID/INCOMPLETE |
| (4) Lý do (ISTQB) | | ❌ Để trống |
| (5) Bản SV sửa | | ❌ Để trống |

**Ràng buộc cứng cho việc log:**
- Agent KHÔNG được tự đánh giá đúng/sai kết quả của chính mình — chỉ ghi lại
  sự kiện (prompt gì, output gì, lúc nào). Việc thẩm định là bắt buộc con người làm.
- Nếu bảng đã đủ 10 artifact (hết hàng trống), agent PHẢI dừng lại và báo cho
  sinh viên biết cần mở rộng bảng thủ công, KHÔNG được tự ý ghi đè hàng đã có.
- Agent KHÔNG được tự sửa cột Verdict/Lý do/Bản SV sửa của các hàng cũ đã có
  người điền — chỉ được thêm hàng mới.