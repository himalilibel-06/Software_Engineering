# DETAILED SOFTWARE TEST SPECIFICATION & TEST CASES
## BIM Facility Management System (Smart BIM FM Platform)

---

### DOCUMENT CONTROL

| Attribute | Specification Details |
| :--- | :--- |
| **Document Title** | Detailed Software Test Cases & Verification Protocol |
| **Project Name** | BIM Facility Management System (`bim-management`) |
| **Document Identifier** | TEST-BIM-FM-2026-IA3 |
| **Current Version** | 1.0.0 |
| **Date of Publication** | October 29, 2026 |
| **Target Assessment** | IA3 Software Engineering Assessment — Condition 4 |
| **Document Status** | Final Test Specification / Baselined for Evaluation |
| **Repository Path** | `E:\SE_Project\Software_Engineering` |
| **Associated SRS** | [`docs/SRS.md`](file:///E:/SE_Project/Software_Engineering/docs/SRS.md) (Version 1.0.0) |

---

## 1. INTRODUCTION & TEST STRATEGY

### 1.1 Purpose
This Software Test Specification provides a comprehensive, rigorous set of test cases designed to verify and validate the **BIM Facility Management System**. The test suite covers all functional modules, security mechanisms, API routes, data validation boundaries, and user interface workflows implemented in the project repository. It serves as the official quality assurance baseline for the college IA3 Software Engineering examination.

### 1.2 Scope of Testing
The testing scope encompasses:
1. **Frontend User Workflows**: Form validation, error notifications, reactive UI filtering, dynamic pagination, local caching, CSV/JSON report exports, and SVG spatial canvas transformations.
2. **Backend API Microservices**: REST endpoint response codes (200, 201, 400, 401, 403, 404, 500), payload parsing, role enforcement, and JSON response structuring.
3. **Database & Data Integrity**: Mongoose schema validations, unique constraints, bcrypt password hashing, and multi-tenant user scoping (`userId: req.user.id`).
4. **Security & Session Management**: JWT token issuance, verification, token tampering rejection, and client-side route guard redirections.

### 1.3 Test Levels & Methodologies
- **Black-Box Functional Testing**: Verifying that UI actions and forms produce expected functional outcomes without knowledge of internal code mechanics.
- **Boundary Value Analysis (BVA) & Equivalence Partitioning**: Testing input boundary limits (e.g., password minimum length $\ge 8$, health score bounds $0 \le \text{health} \le 100$, payload limits up to 10MB).
- **Negative & Fault-Tolerance Testing**: Validating system resilience when supplied with invalid emails, mismatched passwords, duplicate IDs, missing tokens, and malformed database IDs.
- **Security & Multi-Tenant Isolation Testing**: Proving that Account A cannot view, edit, or delete assets, issues, or maintenance logs created by Account B.

### 1.4 Test Environment & System Prerequisites

| Component | Target Test Specification |
| :--- | :--- |
| **Operating System** | Windows 10 / Windows 11 (PowerShell terminal) |
| **Frontend Runtime** | Vite Development Server (`http://localhost:5173`) |
| **Backend Runtime** | Node.js v20+ / Express 5 API Server (`http://localhost:5000`) |
| **Database Server** | MongoDB Community Server (`mongodb://127.0.0.1:27017/bim_management`) |
| **Client Browsers** | Google Chrome (v120+) or Microsoft Edge (Chromium) |
| **Client Storage** | LocalStorage and SessionStorage enabled |
| **Network Configuration** | CORS enabled for localhost cross-origin communication |

---

## 2. TEST EXECUTION PROTOCOL & EVIDENCE CAPTURE GUIDELINES

To execute the manual tests specified in this document and collect verifiable evidence for academic assessment, testers must adhere to the following standard operating procedure:

### 2.1 Starting the System
1. Open PowerShell terminal 1:
   ```powershell
   cd E:\SE_Project\Software_Engineering\backend
   node index.js
   ```
   *Expected output*: `Connected to MongoDB successfully!` and server listening on port 5000.
2. Open PowerShell terminal 2:
   ```powershell
   cd E:\SE_Project\Software_Engineering
   npm run dev
   ```
   *Expected output*: Local Vite server active at `http://localhost:5173`.

### 2.2 Capturing Screenshot & Network Evidence
1. **Browser Console & Network Inspector**: Press `F12` or `Ctrl + Shift + I` in Google Chrome / Microsoft Edge. Keep the **Console** and **Network** tabs visible.
2. **Execution Steps**: Follow the numbered steps in each test case table.
3. **Evidence Screenshot Capture**:
   - Capture full-window screenshots showing both the UI state and the DevTools Network payload (URL, HTTP Status Code, and Response JSON).
   - Save captured screenshots in `docs/evidence/` using the naming pattern: `TC-XXX_<step_description>.png` (e.g., `TC-AUTH-01_registration_success.png`).
4. **Recording Actual Results**:
   - If the actual UI and API behavior matches the expected result, record the actual result verbatim, cite the screenshot file, and update status to **Pass**.
   - If a discrepancy occurs, document the error message/stack trace, capture the console error, and update status to **Fail**.
   - If an environmental defect (e.g., database down) prevents execution, mark as **Blocked**.

---

## 3. TEST EXECUTION SUMMARY (DASHBOARD)

> [!IMPORTANT]
> In accordance with academic testing standards, proposed manual test cases are initialized to **Not Run** until executed and verified with timestamped evidence. Testers must not mark tests as Pass without executing the procedure.

| Status Category | Test Count | Percentage (%) | Description |
| :--- | :---: | :---: | :--- |
| **Pass** | 0 | 0.0% | Test executed; actual result perfectly matched expected criteria. |
| **Fail** | 0 | 0.0% | Test executed; defect detected or behavior deviated from specification. |
| **Blocked** | 0 | 0.0% | Test could not be executed due to environmental or dependency failure. |
| **Not Run** | 45 | 100.0% | Test case formally specified; awaiting tester execution and screenshot capture. |
| **TOTAL** | **45** | **100.0%** | **Comprehensive Test Suite Coverage** |

---

## 4. REQUIREMENT TRACEABILITY MATRIX (RTM)

The table below maps each Functional Requirement (FR) and Non-Functional Security Requirement (NFR) from `docs/SRS.md` to its corresponding test case identifier:

| SRS Requirement ID | Module / Feature Name | Test Case ID | Test Category | Initial Status |
| :--- | :--- | :--- | :--- | :---: |
| **FR-001** | User Self-Registration | `TC-AUTH-01`, `TC-AUTH-02` | Authentication | Not Run |
| **FR-002** | User Authentication (Login) | `TC-AUTH-03`, `TC-AUTH-04`, `TC-AUTH-05`, `TC-AUTH-06`, `TC-AUTH-07` | Authentication & Validation | Not Run |
| **FR-003** | Route Protection Guard | `TC-AUTH-09` | Security & Access Control | Not Run |
| **FR-004** | Dashboard KPI Telemetry | `TC-DASH-01` | Dashboard & Analytics | Not Run |
| **FR-005** | Floor Condition Distribution | `TC-DASH-02` | Dashboard & Analytics | Not Run |
| **FR-006** | Maintenance Spend Timeline | `TC-DASH-03` | Dashboard & Analytics | Not Run |
| **FR-007** | High-Level Summary Overview | `TC-DASH-04` | Dashboard Overview | Not Run |
| **FR-008** | Asset Inventory Registration | `TC-ASSET-01`, `TC-ASSET-02`, `TC-INT-01` | Asset Management | Not Run |
| **FR-009** | Asset Search & Multi-Filters | `TC-ASSET-05`, `TC-ASSET-06` | Asset Management | Not Run |
| **FR-010** | Asset Pagination Controls | `TC-ASSET-07` | Asset Management | Not Run |
| **FR-011** | Asset Deletion (Decommission)| `TC-ASSET-08` | Asset Management | Not Run |
| **FR-012** | RFC 4180 Asset CSV Export | `TC-ASSET-09` | Data Export | Not Run |
| **FR-013** | Asset Details Inspection | `TC-ASSET-04` | Asset Details | Not Run |
| **FR-014** | Edit Asset & Refresh Persistence | `TC-ASSET-03` | Asset Modification | Not Run |
| **FR-015** | Incident Defect Logging | `TC-ISSUE-01`, `TC-ISSUE-02`, `TC-INT-02` | Issue Management | Not Run |
| **FR-016** | Issue Status Transition | `TC-ISSUE-03` | Issue Workflow | Not Run |
| **FR-017** | Issue Technician Assignment | `TC-ISSUE-04`, `TC-TECH-01`, `TC-TECH-02` | Issue Management | Not Run |
| **FR-018** | Issue Record Deletion | `TC-ISSUE-05` | Issue Management | Not Run |
| **FR-019** | Preventative Maintenance Creation| `TC-MAINT-01`, `TC-MAINT-04`, `TC-INT-03` | Maintenance Management | Not Run |
| **FR-020** | Overdue Maintenance Detection | `TC-MAINT-02` | Automated Logic | Not Run |
| **FR-021** | Maintenance Task Completion | `TC-MAINT-03` | Maintenance Management | Not Run |
| **FR-022** | BIM Isometric Wireframe | `TC-BIM-01` | BIM Spatial Viewer | Not Run |
| **FR-023** | BIM Canvas Zoom/Rotate | `TC-BIM-02` | BIM Spatial Viewer | Not Run |
| **FR-024** | BIM Property Card Inspection | `TC-BIM-03` | BIM Spatial Viewer | Not Run |
| **FR-025** | BIM Node JSON Export | `TC-BIM-04` | Data Export | Not Run |
| **FR-026** | Administrative User Directory | `TC-USER-01` | User Administration | Not Run |
| **FR-027** | Admin User Provisioning | `TC-USER-02` | User Administration | Not Run |
| **FR-028** | Admin User Account Deletion | `TC-USER-03` | User Administration | Not Run |
| **FR-029** | Personal Profile Customization | `TC-PROF-01` | Profile Management | Not Run |
| **FR-030** | Base64 Profile Avatar Upload | `TC-PROF-02` | Profile Management | Not Run |
| **FR-031** | Fleet Health Score Analytics | `TC-ANLY-01` | Executive Analytics | Not Run |
| **FR-032** | Top 5 Critical Equipment Triage| `TC-ANLY-02` | Executive Analytics | Not Run |
| **FR-033** | Local Settings Preferences | `TC-CONF-01` | System Preferences | Not Run |
| **FR-034** | Session Logout & Cache Clearing| `TC-AUTH-08`, `TC-CONF-02` | Session Management | Not Run |
| **NFR-SEC-01** | Salted Bcrypt Password Hashing| `TC-INT-01` | Database Security | Not Run |
| **NFR-SEC-02** | Cryptographic JWT Token Auth | `TC-SEC-01`, `TC-SEC-02` | API Security | Not Run |
| **NFR-SEC-04** | Multi-Tenant Data Isolation | `TC-SEC-03` | Multi-Tenancy | Not Run |
| **NFR-SEC-05** | Password Exposure Exclusion | `TC-SEC-04` | Data Protection | Not Run |
| **NFR-REL-01** | Malformed Input Rejection | `TC-ERR-01`, `TC-ERR-02`, `TC-ERR-03` | Error Handling | Not Run |

---

## 5. DETAILED TEST CASES

---

### MODULE 1: AUTHENTICATION, REGISTRATION & LOGOUT

#### [TC-AUTH-01] User Self-Registration with Valid Credentials
- **Related SRS Requirement**: `FR-001`
- **Objective**: Verify that an unregistered user can successfully create a new account with complete details, resulting in an encrypted password stored in MongoDB and redirection to Login.
- **Preconditions**: Backend and MongoDB running; email `alex.turner@facility.com` is not registered.
- **Test Steps**:
  1. Open browser and navigate to `http://localhost:5173/signup`.
  2. Input Full Name: `Alex Turner`.
  3. Input Email: `alex.turner@facility.com`.
  4. Select Role: `Facility Manager`.
  5. Input Password: `Password@2026`.
  6. Input Confirm Password: `Password@2026`.
  7. Observe password strength meter displays "Strong".
  8. Click "Create Account" button.
- **Input Data**:
  ```json
  {
    "fullName": "Alex Turner",
    "email": "alex.turner@facility.com",
    "role": "Facility Manager",
    "password": "Password@2026"
  }
  ```
- **Expected Result**:
  - Network inspector logs `POST http://localhost:5000/api/auth/signup` returning HTTP status `201 Created`.
  - Response body contains `{ "message": "User registered successfully!" }`.
  - Toast notification "Registration successful!" displays on client.
  - Client navigates to `/` (Login page).
  - User document exists in MongoDB `users` collection with `password` hashed with bcrypt (starts with `$2a$10$` or `$2b$10$`).
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-01_signup_201.png`. Verified code in [`src/pages/Signup.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/Signup.jsx#L90-L130) and [`backend/routes/authRoutes.js`](file:///E:/SE_Project/Software_Engineering/backend/routes/authRoutes.js#L9-L29).

---

#### [TC-AUTH-02] User Registration with Duplicate Email Address
- **Related SRS Requirement**: `FR-001`, `NFR-REL-01`
- **Objective**: Verify that the registration system rejects duplicate email registrations and displays an informative error.
- **Preconditions**: User `alex.turner@facility.com` is already registered in MongoDB.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/signup`.
  2. Enter Full Name: `Alexander T.`.
  3. Enter Email: `alex.turner@facility.com` (identical to existing account).
  4. Enter Password: `AnotherPassword@123`.
  5. Enter Confirm Password: `AnotherPassword@123`.
  6. Click "Create Account" button.
- **Input Data**: Same email as `TC-AUTH-01`.
- **Expected Result**:
  - Network inspector logs `POST /api/auth/signup` returning HTTP `400 Bad Request`.
  - Backend returns error code 11000 payload: `{ "message": "This email is already registered." }`.
  - Error banner or toast displays: "This email is already registered."
  - User remains on `/signup` page without database corruption.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-02_duplicate_email_400.png`. Verified code in [`backend/routes/authRoutes.js`](file:///E:/SE_Project/Software_Engineering/backend/routes/authRoutes.js#L23-L25).

---

#### [TC-AUTH-03] Successful Credential Authentication & JWT Issuance
- **Related SRS Requirement**: `FR-002`
- **Objective**: Verify that a registered user can authenticate with valid credentials, receive a signed JWT token, store it in `localStorage`, and navigate to `/dashboard`.
- **Preconditions**: Account `alex.turner@facility.com` exists with password `Password@2026`.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/`.
  2. Enter Email: `alex.turner@facility.com`.
  3. Enter Password: `Password@2026`.
  4. Select Role: `Facility Manager`.
  5. Click "Sign In" button.
  6. Open DevTools `Application` tab -> `Local Storage` -> `http://localhost:5173`.
- **Input Data**:
  ```json
  {
    "email": "alex.turner@facility.com",
    "password": "Password@2026",
    "role": "Facility Manager"
  }
  ```
- **Expected Result**:
  - Network log displays `POST http://localhost:5000/api/auth/Login` returning HTTP `200 OK`.
  - Response body contains `{ "message": "Login successful!", "token": "<JWT_STRING>", "user": { ... } }`.
  - Key `token` is populated in browser `localStorage`.
  - Client automatically redirects to `/dashboard`.
  - Top navigation bar renders "Alex Turner" and "Facility Manager" badge.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-03_login_success.png`. Verified code in [`src/pages/Login.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/Login.jsx#L40-L75).

---

#### [TC-AUTH-04] Invalid Login Credentials (Incorrect Password)
- **Related SRS Requirement**: `FR-002`
- **Objective**: Verify that submitting an incorrect password prevents access and returns HTTP 400.
- **Preconditions**: User `alex.turner@facility.com` exists.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/`.
  2. Enter Email: `alex.turner@facility.com`.
  3. Enter Password: `WrongPassword999!`.
  4. Select Role: `Facility Manager`.
  5. Click "Sign In".
- **Input Data**: Email `alex.turner@facility.com`, Password `WrongPassword999!`.
- **Expected Result**:
  - Network log displays `POST /api/auth/Login` returning HTTP `400 Bad Request`.
  - Response body contains `{ "message": "Invalid credentials." }`.
  - Client displays red alert error banner: "Invalid credentials."
  - `localStorage.getItem("token")` remains `null`.
  - URL remains on `/` (Login).
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-04_invalid_password_400.png`. Verified in [`backend/routes/authRoutes.js`](file:///E:/SE_Project/Software_Engineering/backend/routes/authRoutes.js#L44-L47).

---

#### [TC-AUTH-05] Non-Existent User Login Submission
- **Related SRS Requirement**: `FR-002`
- **Objective**: Verify proper rejection when attempting to log in with an unrecorded email address.
- **Preconditions**: Email `ghost.user@facility.com` is not registered in MongoDB.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/`.
  2. Enter Email: `ghost.user@facility.com`.
  3. Enter Password: `RandomPassword123!`.
  4. Click "Sign In".
- **Input Data**: Unregistered email.
- **Expected Result**:
  - Network log displays `POST /api/auth/Login` returning HTTP `400 Bad Request`.
  - Response body contains `{ "message": "User not found. Please sign up." }`.
  - UI displays error: "User not found. Please sign up."
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-05_user_not_found.png`. Verified in [`backend/routes/authRoutes.js`](file:///E:/SE_Project/Software_Engineering/backend/routes/authRoutes.js#L39-L41).

---

#### [TC-AUTH-06] Empty Email and Password Field Validation on Login
- **Related SRS Requirement**: `FR-002`
- **Objective**: Verify client-side prevention of empty or whitespace-only credential submissions.
- **Preconditions**: User on Login page `/`.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/`.
  2. Leave Email and Password fields completely blank.
  3. Click "Sign In" button.
- **Input Data**: Email `""`, Password `""`.
- **Expected Result**:
  - Browser HTML5 validation flags empty inputs (`required` attribute) or client error banner triggers.
  - Zero HTTP requests are sent over the network (preventing server traffic).
  - Focus is directed to the first missing field.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-06_empty_login_validation.png`.

---

#### [TC-AUTH-07] Role Mismatch on Login
- **Related SRS Requirement**: `FR-002`
- **Objective**: Verify that attempting to authenticate with a role different from the registered role is denied with HTTP 403.
- **Preconditions**: User `alex.turner@facility.com` is registered as `Facility Manager`.
- **Test Steps**:
  1. Navigate to `/`.
  2. Enter Email: `alex.turner@facility.com`.
  3. Enter Password: `Password@2026`.
  4. Select Role: `Technician` (mismatched role).
  5. Click "Sign In".
- **Input Data**: Valid email and password, mismatched role selector.
- **Expected Result**:
  - Network inspector logs HTTP `403 Forbidden`.
  - Response body contains `{ "message": "Access denied!" }`.
  - UI renders red error notification: "Access denied!"
  - User is not logged in; `token` is not stored.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-07_role_mismatch_403.png`. Verified in [`backend/routes/authRoutes.js`](file:///E:/SE_Project/Software_Engineering/backend/routes/authRoutes.js#L49-L54).

---

#### [TC-AUTH-08] User Session Logout & Token Invalidation
- **Related SRS Requirement**: `FR-034`
- **Objective**: Verify that clicking Logout purges the JWT token from `localStorage` and redirects to the Login page.
- **Preconditions**: User is logged in; token is in `localStorage`.
- **Test Steps**:
  1. On any authenticated page (e.g., `/dashboard`), locate the top-right header or sidebar.
  2. Click the user profile dropdown or Logout button.
  3. Confirm the logout prompt.
  4. Check `localStorage.getItem("token")` in DevTools Console.
  5. Check current browser URL.
- **Input Data**: Click Logout action.
- **Expected Result**:
  - `localStorage.removeItem("token")` or `.clear()` executes.
  - `localStorage.getItem("token")` evaluates to `null`.
  - Browser navigates to `http://localhost:5173/`.
  - Back button does not restore authenticated view.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-08_logout_storage_cleared.png`. Verified in [`src/components/Header.jsx`](file:///E:/SE_Project/Software_Engineering/src/components/Header.jsx) and [`src/pages/Settings.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/Settings.jsx).

---

#### [TC-AUTH-09] Client-Side Route Protection Guard
- **Related SRS Requirement**: `FR-003`
- **Objective**: Verify that an unauthenticated browser session attempting to open protected URLs is blocked and redirected to Login.
- **Preconditions**: Browser storage cleared (`localStorage.clear()`).
- **Test Steps**:
  1. Open a new private/incognito window.
  2. Manually enter URL `http://localhost:5173/dashboard` in the address bar.
  3. Press Enter.
  4. Repeat for `http://localhost:5173/assets` and `http://localhost:5173/bim-viewer`.
- **Input Data**: Direct URL navigation without `token`.
- **Expected Result**:
  - The `ProtectedRoute` component intercepts the route change.
  - The browser immediately redirects to `http://localhost:5173/`.
  - No dashboard or asset table data is rendered.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-AUTH-09_route_guard_redirect.png`. Verified in [`src/components/ProtectedRoute.jsx`](file:///E:/SE_Project/Software_Engineering/src/components/ProtectedRoute.jsx).

---

### MODULE 2: ASSET INVENTORY & LIFECYCLE MANAGEMENT

#### [TC-ASSET-01] Create New Hardware Asset with Valid Parameters
- **Related SRS Requirement**: `FR-008`
- **Objective**: Verify that an authenticated user can register a new hardware asset, which is saved with user scoping in MongoDB.
- **Preconditions**: User authenticated as `Alex Turner`.
- **Test Steps**:
  1. Navigate to `/assets` or `/asset-inventory`.
  2. Click "Add Asset" button.
  3. In the modal, enter:
     - Asset ID: `AHU-201`
     - Name: `Air Handling Unit - East Wing`
     - Category: `HVAC`
     - Location: `Floor 2, Zone B`
     - Status: `Active`
     - Health Score: `95`
     - Manufacturer: `Carrier Corp`
     - Installation Date: `2024-03-15`
  4. Click "Submit" / "Save Asset".
- **Input Data**:
  ```json
  {
    "assetId": "AHU-201",
    "name": "Air Handling Unit - East Wing",
    "category": "HVAC",
    "location": "Floor 2, Zone B",
    "status": "Active",
    "health": 95,
    "manufacturer": "Carrier Corp",
    "installationDate": "2024-03-15"
  }
  ```
- **Expected Result**:
  - Network inspector shows `POST http://localhost:5000/api/assets` returning HTTP `201 Created`.
  - Request headers include `Authorization: Bearer <valid_token>`.
  - Returned JSON contains `_id`, all attributes, and `userId: "<alex_user_id>"`.
  - Modal closes; asset ledger table re-fetches and displays `AHU-201`.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-01_asset_created_201.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L56-L64).

---

#### [TC-ASSET-02] Asset Creation Failure on Duplicate Asset ID
- **Related SRS Requirement**: `FR-008`, `NFR-DAT-01`
- **Objective**: Verify that Mongoose schema unique index on `assetId` rejects duplicate equipment identifiers.
- **Preconditions**: Asset `AHU-201` exists in the database.
- **Test Steps**:
  1. Open "Add Asset" modal on `/assets`.
  2. Input Asset ID: `AHU-201` (identical to existing asset).
  3. Input Name: `Duplicate Chiller`.
  4. Input Category: `HVAC`.
  5. Click "Save Asset".
- **Input Data**: `assetId: "AHU-201"`.
- **Expected Result**:
  - Network log shows `POST /api/assets` returning HTTP `400 Bad Request`.
  - Response body contains Mongoose duplicate key error string (`E11000 duplicate key error collection: ... index: assetId_1`).
  - UI displays error prompt: "Error saving asset / Asset ID already exists".
  - Existing asset is not overwritten.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-02_duplicate_asset_400.png`. Verified in [`backend/models/Asset.js`](file:///E:/SE_Project/Software_Engineering/backend/models/Asset.js#L5).

---

#### [TC-ASSET-03] Asset Modification & Parameter Update (Edit Asset)
- **Related SRS Requirement**: `FR-014`
- **Objective**: Verify that editing an existing asset updates its properties in MongoDB, shows a success notification, and reflects changes in the inventory list.
- **Preconditions**: Asset `AHU-201` exists.
- **Test Steps**:
  1. On `/assets`, locate `AHU-201` and click the "Edit" (pencil) icon.
  2. Verify form populates with existing values (`AHU-201`, `Air Handling Unit - East Wing`).
  3. Modify Name to: `Air Handling Unit - East Wing (Upgraded)`.
  4. Modify Health Score from `95` to `78`.
  5. Modify Status to: `Under Maintenance`.
  6. Click "Save Changes".
- **Input Data**:
  ```json
  {
    "name": "Air Handling Unit - East Wing (Upgraded)",
    "health": 78,
    "status": "Under Maintenance"
  }
  ```
- **Expected Result**:
  - Network log displays `PUT /api/assets/:id` returning HTTP `200 OK`.
  - Response JSON reflects updated name, health `78`, and status `"Under Maintenance"`.
  - Green toast / confirmation banner displays: "Asset updated successfully".
  - Browser navigates to `/assets`; row `AHU-201` displays health badge `78%` (Warning color) and status `Under Maintenance`.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-03_edit_asset_persistence.png`. Verified in [`src/pages/EditAsset.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/EditAsset.jsx) and [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L231-L246).

---

#### [TC-ASSET-04] Asset Details Persistence Across Browser Refresh
- **Related SRS Requirement**: `FR-013`
- **Objective**: Verify that loading `/asset-details` retains complete telemetry data when the browser page is manually refreshed (`F5`).
- **Preconditions**: Asset `AHU-201` exists.
- **Test Steps**:
  1. On `/assets`, click on asset row `AHU-201` or click "View Details".
  2. Browser navigates to `/asset-details`.
  3. Verify asset details render: Asset ID `AHU-201`, Manufacturer, Health Score, Location.
  4. Press `F5` or `Ctrl + R` to reload the browser tab.
  5. Inspect whether the asset details remain intact or display a blank error screen.
- **Input Data**: Browser refresh action on `/asset-details`.
- **Expected Result**:
  - The component recovers the asset from `sessionStorage.getItem("view_asset")` or executes `GET /api/assets` using the query parameter.
  - Page renders all telemetry cards cleanly without blank screen or uncaught TypeError.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-04_asset_details_refresh.png`. Verified in [`src/pages/AssetDetails.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/AssetDetails.jsx).

---

#### [TC-ASSET-05] Real-Time Asset Substring Search Filtering
- **Related SRS Requirement**: `FR-009`
- **Objective**: Verify that typing search strings dynamically filters table rows across Name, Asset ID, and Location in real-time.
- **Preconditions**: Multiple assets registered (e.g., `AHU-201`, `CH-01`, `PUMP-03`).
- **Test Steps**:
  1. Navigate to `/assets`.
  2. Type `East` in the search input box.
  3. Observe table rows.
  4. Clear input, then type `PUMP`.
  5. Observe table rows.
- **Input Data**: Search strings `"East"`, `"PUMP"`.
- **Expected Result**:
  - When typing `"East"`, only assets containing `"East"` in their name or location (e.g., `Air Handling Unit - East Wing`) are shown.
  - When typing `"PUMP"`, only pump equipment is shown.
  - Filtering occurs instantly without page reloads.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-05_search_filter.png`. Verified in [`src/pages/AssetManagement.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/AssetManagement.jsx).

---

#### [TC-ASSET-06] Asset Category & Operational Status Multi-Filtering
- **Related SRS Requirement**: `FR-009`
- **Objective**: Verify combined multi-predicate filtering using Category and Status dropdown menus.
- **Preconditions**: Assets of various categories (`HVAC`, `Electrical`, `Plumbing`) and statuses (`Active`, `Under Maintenance`) exist.
- **Test Steps**:
  1. On `/assets`, open Category dropdown and select `HVAC`.
  2. Open Status dropdown and select `Under Maintenance`.
  3. Verify displayed rows.
- **Input Data**: Category: `HVAC`, Status: `Under Maintenance`.
- **Expected Result**:
  - Table renders only assets that satisfy BOTH predicates (HVAC and Under Maintenance).
  - If zero assets match, an empty state ("No assets match the selected filters") is displayed cleanly.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-06_multi_filter.png`.

---

#### [TC-ASSET-07] Client-Side In-Memory Pagination Bounds
- **Related SRS Requirement**: `FR-010`
- **Objective**: Verify that asset table slices rows into pages of 6 items and navigation buttons handle boundary states correctly.
- **Preconditions**: At least 8 asset records exist in the account.
- **Test Steps**:
  1. On `/assets`, verify page 1 shows exactly 6 records.
  2. Verify "Previous" button is disabled on page 1.
  3. Click "Next" button.
  4. Verify page 2 shows the remaining 2 records.
  5. Verify "Next" button is disabled on page 2.
- **Input Data**: Pagination button clicks.
- **Expected Result**:
  - Rows are sliced accurately (`PAGE_SIZE = 6`).
  - Page indicator displays "Page 1 of 2" and "Page 2 of 2".
  - Boundary buttons disable dynamically to prevent index out of bounds.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-07_pagination_bounds.png`. Verified in [`src/pages/AssetManagement.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/AssetManagement.jsx).

---

#### [TC-ASSET-08] Hardware Asset Decommissioning / Deletion
- **Related SRS Requirement**: `FR-011`
- **Objective**: Verify that deleting an asset permanently removes the document from MongoDB and removes the row from the UI.
- **Preconditions**: Target asset `AHU-201` exists.
- **Test Steps**:
  1. On `/assets`, locate `AHU-201` and click the Trash (Delete) icon.
  2. In the confirmation dialog, click "Confirm Delete".
  3. Check the Network inspector for the outgoing request.
  4. Refresh the page to verify persistence.
- **Input Data**: Click Delete on `AHU-201`.
- **Expected Result**:
  - Network logs `DELETE http://localhost:5000/api/assets/<asset_id>` returning HTTP `200 OK`.
  - Response JSON: `{ "message": "Asset deleted successfully" }`.
  - Row `AHU-201` disappears from the table immediately.
  - Direct MongoDB query `db.assets.find({ assetId: "AHU-201" })` returns null.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-08_asset_deleted_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L249-L260).

---

#### [TC-ASSET-09] RFC 4180 CSV Asset Inventory Report Export
- **Related SRS Requirement**: `FR-012`
- **Objective**: Verify that clicking "Export CSV" generates and downloads a valid RFC 4180 compliant CSV document containing all active asset records.
- **Preconditions**: At least 2 assets exist in the inventory.
- **Test Steps**:
  1. On `/assets`, click the "Export CSV" button.
  2. Check the browser downloads bar.
  3. Open the downloaded file in a text editor or Excel.
  4. Inspect the header row and data rows.
- **Input Data**: Click "Export CSV".
- **Expected Result**:
  - Browser automatically downloads a file named `BIM_Asset_Report_<date>.csv`.
  - First line contains headers: `Asset ID,Name,Category,Location,Status,Health,Last Maintenance`.
  - Subsequent lines contain comma-separated values matching database records with escaped quotes.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ASSET-09_csv_export_download.png`. Verified in [`src/pages/AssetManagement.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/AssetManagement.jsx).

---

### MODULE 3: DEFECT & ISSUE MANAGEMENT

#### [TC-ISSUE-01] Log Incident Defect Ticket with Valid Data
- **Related SRS Requirement**: `FR-015`
- **Objective**: Verify that reporting a facility defect creates an issue record in MongoDB with default status `Open`.
- **Preconditions**: User authenticated; asset `CH-01` exists.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/issues`.
  2. Click "Report Issue" / "Log Issue".
  3. Fill the issue modal:
     - Title: `Chiller Refrigerant Leak`
     - Asset ID: `CH-01`
     - Category: `HVAC`
     - Priority: `High`
     - Reported By: `Alex Turner`
  4. Click "Submit Issue".
- **Input Data**:
  ```json
  {
    "title": "Chiller Refrigerant Leak",
    "assetId": "CH-01",
    "category": "HVAC",
    "priority": "High",
    "reportedBy": "Alex Turner"
  }
  ```
- **Expected Result**:
  - Network inspector shows `POST /api/issues` returning HTTP `201 Created`.
  - Response object contains `status: "Open"`, `assignedTo: "Unassigned"`, and `userId`.
  - Modal closes; the new ticket appears in the active issues table with a red "High" priority badge and yellow "Open" badge.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ISSUE-01_issue_logged_201.png`. Verified in [`backend/models/Issue.js`](file:///E:/SE_Project/Software_Engineering/backend/models/Issue.js) and [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L76-L84).

---

#### [TC-ISSUE-02] Defect Logging Rejection on Missing Required Fields
- **Related SRS Requirement**: `FR-015`, `NFR-REL-01`
- **Objective**: Verify that submitting an issue with missing title or invalid category is rejected with HTTP 400.
- **Preconditions**: User on `/issues`.
- **Test Steps**:
  1. Open Report Issue modal.
  2. Leave Title blank.
  3. Select Category: `HVAC`.
  4. Click "Submit Issue".
- **Input Data**: Title `""`.
- **Expected Result**:
  - Client-side validation blocks submission or backend returns HTTP `400 Bad Request`.
  - Toast error notification displays: "Please fill in all required fields".
  - No incomplete document is saved to MongoDB.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ISSUE-02_missing_fields_validation.png`. Verified in [`src/pages/IssueManagement.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/IssueManagement.jsx).

---

#### [TC-ISSUE-03] Inline Issue Status Workflow Transition
- **Related SRS Requirement**: `FR-016`
- **Objective**: Verify immediate status transitions from `Open` to `In Progress` to `Resolved` via table dropdowns.
- **Preconditions**: An issue with status `Open` exists.
- **Test Steps**:
  1. On `/issues`, locate the issue row.
  2. Change the Status dropdown from `Open` to `In Progress`.
  3. Verify Network tab.
  4. Change the Status dropdown from `In Progress` to `Resolved`.
  5. Verify Network tab and badge color.
- **Input Data**: Status updates: `"In Progress"`, `"Resolved"`.
- **Expected Result**:
  - Client dispatches `PUT /api/issues/:id/status` with `{ "status": "In Progress" }` returning HTTP `200 OK`.
  - Second update dispatches `PUT /api/issues/:id/status` with `{ "status": "Resolved" }` returning HTTP `200 OK`.
  - Status badge transforms from yellow (`Open`) to blue (`In Progress`) to green (`Resolved`).
  - Refreshing the page retains the `Resolved` status.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ISSUE-03_status_transition_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L263-L275).

---

#### [TC-ISSUE-04] Assign Field Technician to Incident Ticket
- **Related SRS Requirement**: `FR-017`
- **Objective**: Verify assigning a field technician updates the `assignedTo` attribute in MongoDB and changes the table display.
- **Preconditions**: Issue exists with `assignedTo: "Unassigned"`.
- **Test Steps**:
  1. On `/issues`, click "Assign Staff" or select technician dropdown on the target row.
  2. Select technician: `Marcus Vance (HVAC Lead)`.
  3. Click "Save Assignment".
- **Input Data**: `{ "assignedTo": "Marcus Vance" }`.
- **Expected Result**:
  - Network inspector logs `PUT /api/issues/:id/assign` returning HTTP `200 OK`.
  - Issue row updates from `Unassigned` to `Marcus Vance`.
  - Database reflects `assignedTo: "Marcus Vance"`.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ISSUE-04_technician_assigned_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L277-L290).

---

#### [TC-ISSUE-05] Issue Record Deletion / Ticket Archival
- **Related SRS Requirement**: `FR-018`
- **Objective**: Verify permanent deletion of an issue ticket.
- **Preconditions**: Target issue exists.
- **Test Steps**:
  1. Locate the issue on `/issues`.
  2. Click the Delete icon.
  3. Confirm the deletion prompt.
- **Input Data**: Click Delete on issue.
- **Expected Result**:
  - Network logs `DELETE /api/issues/:id` returning HTTP `200 OK`.
  - Issue row is removed from table view.
  - Document removed from MongoDB `issues` collection.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ISSUE-05_issue_deleted_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L292-L301).

---

### MODULE 4: PREVENTATIVE MAINTENANCE & SCHEDULING

#### [TC-MAINT-01] Schedule Preventative Maintenance Work Order
- **Related SRS Requirement**: `FR-019`
- **Objective**: Verify creating a scheduled maintenance task with due date, frequency, and assigned team.
- **Preconditions**: User authenticated; asset `AHU-04` exists.
- **Test Steps**:
  1. Navigate to `/maintenance` or `/maintenance-schedule`.
  2. Click "Schedule Task" / "Add Maintenance".
  3. Enter Task Name: `Quarterly Filter Replacement`.
  4. Enter Asset ID: `AHU-04`.
  5. Select Category: `Preventive`.
  6. Select Frequency: `Quarterly`.
  7. Set Due Date: Select a date 14 days in the future.
  8. Enter Assigned Team: `Mechanical Squad Alpha`.
  9. Click "Submit".
- **Input Data**:
  ```json
  {
    "taskName": "Quarterly Filter Replacement",
    "assetId": "AHU-04",
    "category": "Preventive",
    "frequency": "Quarterly",
    "dueDate": "2026-11-15",
    "technician": "Mechanical Squad Alpha"
  }
  ```
- **Expected Result**:
  - Network logs `POST /api/maintenance` returning HTTP `201 Created`.
  - Backend maps `dueDate` to `scheduledDate` and `technician` to `assignedTeam`.
  - Default `workStatus` set to `Scheduled`.
  - Maintenance table updates with the new task.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-MAINT-01_task_scheduled_201.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L105-L129).

---

#### [TC-MAINT-02] Automated Overdue Maintenance Flagging Logic
- **Related SRS Requirement**: `FR-020`
- **Objective**: Verify that scheduled tasks with past due dates and incomplete status are dynamically flagged as `Overdue` with red alert badges.
- **Preconditions**: A maintenance task exists with `scheduledDate: 2026-01-01` (in the past) and `workStatus: "Scheduled"`.
- **Test Steps**:
  1. Navigate to `/maintenance-schedule`.
  2. Observe the Overdue counter KPI card at the top.
  3. Inspect the table row for the past-due task.
  4. Check the badge color and status text.
- **Input Data**: Task with `scheduledDate < current date`.
- **Expected Result**:
  - The client date comparison logic (`scheduledDate < new Date() && workStatus !== 'Completed'`) flags the item.
  - Overdue KPI counter increments.
  - Table badge renders in red as `Overdue`.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-MAINT-02_overdue_flag_rendered.png`. Verified in [`src/pages/MaintenanceSchedule.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/MaintenanceSchedule.jsx).

---

#### [TC-MAINT-03] Preventative Maintenance Task Completion
- **Related SRS Requirement**: `FR-021`
- **Objective**: Verify that marking a maintenance task completed updates `workStatus: "Completed"` and removes overdue flags.
- **Preconditions**: Task exists with status `Scheduled` or `Overdue`.
- **Test Steps**:
  1. On `/maintenance-schedule`, locate the task.
  2. Click "Mark Completed" (checkmark button).
  3. Observe Network tab.
  4. Inspect row status badge.
- **Input Data**: Click "Mark Completed".
- **Expected Result**:
  - Dispatches `PUT /api/maintenance/:id` with `{ "status": "Completed" }` returning HTTP `200 OK`.
  - Work status updates to `Completed`.
  - Badge turns emerald green.
  - Overdue KPI counter decrements.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-MAINT-03_task_completed_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L304-L331).

---

#### [TC-MAINT-04] Delete Scheduled Maintenance Work Order
- **Related SRS Requirement**: `FR-019`
- **Objective**: Verify deletion of obsolete maintenance schedules.
- **Preconditions**: Task exists in maintenance list.
- **Test Steps**:
  1. Locate task on `/maintenance-schedule`.
  2. Click Delete icon and confirm.
- **Input Data**: Click Delete.
- **Expected Result**:
  - Dispatches `DELETE /api/maintenance/:id` returning HTTP `200 OK`.
  - Task is removed from the schedule table.
  - Record deleted from MongoDB.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-MAINT-04_maint_deleted_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L334-L345).

---

### MODULE 5: DASHBOARD & EXECUTIVE ANALYTICS

#### [TC-DASH-01] Dashboard KPI Metric Cards Aggregation & Navigation
- **Related SRS Requirement**: `FR-004`
- **Objective**: Verify that the main Dashboard queries parallel endpoints (`/api/assets`, `/api/maintenance`, `/api/issues`), computes accurate KPI sums, and navigates on card clicks.
- **Preconditions**: Account contains known counts: 5 assets (avg health 84%), 2 active issues, 3 maintenance runs.
- **Test Steps**:
  1. Navigate to `/dashboard`.
  2. Check the 4 KPI cards:
     - Total Assets
     - Active Issues
     - Scheduled Maintenance
     - Overall Facility Health
  3. Click on the "Total Assets" card.
- **Input Data**: Mount `/dashboard`.
- **Expected Result**:
  - Cards display: Total Assets: `5`, Active Issues: `2`, Maintenance: `3`, Health: `84%`.
  - Clicking "Total Assets" navigates to `/assets`.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-DASH-01_kpi_cards.png`. Verified in [`src/pages/Dashboard.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/Dashboard.jsx).

---

#### [TC-DASH-02] Floor-by-Floor Equipment Health Stacked Bar Chart
- **Related SRS Requirement**: `FR-005`
- **Objective**: Verify that Recharts renders equipment condition distribution categorized by building floor (L1, L2, L3) without SVG clipping.
- **Preconditions**: Assets with location values exist.
- **Test Steps**:
  1. On `/dashboard`, scroll to the "Asset Condition by Floor" chart.
  2. Hover over bar segments (Healthy, Warning, Critical).
  3. Verify tooltip popups.
- **Input Data**: Visual inspection of stacked bar chart.
- **Expected Result**:
  - Chart renders stacked bars for floors.
  - Tooltips display exact item counts per condition tier on hover.
  - Legend displays color indicators (Green, Yellow, Red).
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-DASH-02_bar_chart_tooltip.png`.

---

#### [TC-DASH-03] Maintenance Expenditure Timeline Spend Curves
- **Related SRS Requirement**: `FR-006`
- **Objective**: Verify rendering of Planned vs. Unplanned maintenance expense lines over the 7-month calendar horizon.
- **Preconditions**: Maintenance records exist.
- **Test Steps**:
  1. On `/dashboard`, scroll to the "Maintenance Spend vs Budget" chart.
  2. Hover over curve data points (Jan through Jul).
- **Input Data**: Visual inspection of Area/Line chart.
- **Expected Result**:
  - Dual curves render with smooth cubic bezier interpolation.
  - Tooltip shows dollar amounts for Planned and Unplanned spend.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-DASH-03_spend_timeline.png`.

---

#### [TC-DASH-04] High-Level Summary Statistics (`/dashboard-overview`)
- **Related SRS Requirement**: `FR-007`
- **Objective**: Verify that the secondary overview page retrieves data from `GET /api/dashboard/stats` with Bearer token and renders breakdown bars.
- **Preconditions**: User logged in; token valid.
- **Test Steps**:
  1. Navigate to `/dashboard-overview`.
  2. Check Network log for `GET /api/dashboard/stats`.
  3. Inspect Category breakdown bars (HVAC, Electrical, Plumbing).
- **Input Data**: Mount `/dashboard-overview`.
- **Expected Result**:
  - Request sends `Authorization: Bearer <token>` and returns HTTP `200 OK`.
  - JSON payload contains `totalAssets`, `activeIssuesCount`, `maintenanceToday`, and `breakdown`.
  - Overview cards display statistics without authorization error.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-DASH-04_overview_stats_200.png`. Verified in [`src/pages/DashboardOverview.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/DashboardOverview.jsx) and [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L131-L162).

---

#### [TC-ANLY-01] Portfolio Health Score Stratification Donut Chart
- **Related SRS Requirement**: `FR-031`
- **Objective**: Verify analytics calculation of fleet condition index and risk stratification (Optimal, Warning, Critical) on `/analytics`.
- **Preconditions**: Assets loaded into account.
- **Test Steps**:
  1. Navigate to `/analytics`.
  2. Observe overall health percentage gauge.
  3. Inspect condition donut chart (Recharts Pie).
- **Input Data**: Mount `/analytics`.
- **Expected Result**:
  - Network dispatches `GET /api/assets` and `GET /api/maintenance`.
  - Calculates average health score across all active assets.
  - Donut chart segments represent percentage of fleet in Optimal ($\ge 80\%$), Warning ($50-79\%$), and Critical ($< 50\%$).
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ANLY-01_donut_chart.png`. Verified in [`src/pages/Analytics.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/Analytics.jsx).

---

#### [TC-ANLY-02] Top 5 Critical Equipment Triage Table Slicing
- **Related SRS Requirement**: `FR-032`
- **Objective**: Verify that the triage table sorts assets ascending by health score and displays the top 5 most vulnerable units.
- **Preconditions**: At least 6 assets with varying health scores exist.
- **Test Steps**:
  1. On `/analytics`, scroll down to "Critical Equipment Attention Required".
  2. Compare displayed assets against full inventory health scores.
- **Input Data**: Inspection of triage table.
- **Expected Result**:
  - Displays exactly 5 rows (or total count if $< 5$).
  - Rows are ordered from lowest health score to highest.
  - Red "Critical" and Yellow "Warning" badges correspond accurately to health values.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ANLY-02_critical_triage_table.png`.

---

### MODULE 6: FIELD TECHNICIAN REGISTRY

#### [TC-TECH-01] Retrieve Technician Roster for Issue Assignment
- **Related SRS Requirement**: `FR-017`
- **Objective**: Verify that the system queries `GET /api/technicians` to populate staff rosters in modals.
- **Preconditions**: User authenticated; technician records exist.
- **Test Steps**:
  1. Open Issue modal or Assign Staff dropdown on `/issues`.
  2. Inspect Network tab for `GET /api/technicians`.
  3. Inspect dropdown options.
- **Input Data**: Open technician selector.
- **Expected Result**:
  - Network logs `GET http://localhost:5000/api/technicians` returning HTTP `200 OK`.
  - Dropdown lists technician names and specializations.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-TECH-01_tech_roster_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L87-L93).

---

#### [TC-TECH-02] Fallback to Default Technician Roster on Unseeded Database
- **Related SRS Requirement**: `FR-017`
- **Objective**: Verify that when the MongoDB `technicians` collection is empty, the frontend gracefully falls back to the embedded `DEFAULT_TECHNICIANS` roster without throwing errors.
- **Preconditions**: Database `technicians` collection has 0 documents (`db.technicians.deleteMany({})`).
- **Test Steps**:
  1. Open Issue assignment modal on `/issues`.
  2. Inspect dropdown options.
- **Input Data**: Empty database collection response `[]`.
- **Expected Result**:
  - Frontend detects empty array and displays default staff (e.g., Marcus Vance, Sarah Jenkins, David Ross, Elena Rostova).
  - Modal functions cleanly without undefined pointer errors.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-TECH-02_tech_roster_fallback.png`. Verified in [`src/pages/IssueManagement.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/IssueManagement.jsx).

---

### MODULE 7: USER DIRECTORY & PROFILE MANAGEMENT

#### [TC-USER-01] View Administrative User Directory Listing
- **Related SRS Requirement**: `FR-026`
- **Objective**: Verify that navigating to `/users` retrieves the user list from `GET /api/users` and renders directory rows.
- **Preconditions**: Authenticated user.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/users`.
  2. Check Network tab for `GET /api/users`.
  3. Inspect rendered table rows.
- **Input Data**: Mount `/users`.
- **Expected Result**:
  - Network logs `GET /api/users` returning HTTP `200 OK`.
  - JSON payload contains user objects with `_id`, `fullName`, `email`, `role`, and `department`.
  - Table displays each user's full name, email, role badge, and department.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-USER-01_user_directory_200.png`. Verified in [`src/pages/UserManagement.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/UserManagement.jsx) and [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L196-L201).

---

#### [TC-USER-02] Administrative User Account Provisioning
- **Related SRS Requirement**: `FR-027`
- **Objective**: Verify that adding a user from the directory panel dispatches `POST /api/users`, sets default password `Welcome@123`, and stores the document.
- **Preconditions**: User on `/users`.
- **Test Steps**:
  1. Click "Add User" button.
  2. Enter Full Name: `Carlos Mendez`.
  3. Enter Email: `carlos.m@facility.com`.
  4. Select Role: `Technician`.
  5. Enter Department: `HVAC Maintenance`.
  6. Click "Save User".
- **Input Data**:
  ```json
  {
    "fullName": "Carlos Mendez",
    "email": "carlos.m@facility.com",
    "role": "Technician",
    "department": "HVAC Maintenance"
  }
  ```
- **Expected Result**:
  - Network logs `POST /api/users` returning HTTP `201 Created`.
  - Backend injects `password: "Welcome@123"`, hashes it, and saves document.
  - New user appears in the directory table.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-USER-02_user_provisioned_201.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L204-L217).

---

#### [TC-USER-03] Administrative User Account Deletion
- **Related SRS Requirement**: `FR-028`
- **Objective**: Verify deleting a user account via `DELETE /api/users/:id`.
- **Preconditions**: Target user `carlos.m@facility.com` exists.
- **Test Steps**:
  1. Locate `Carlos Mendez` on `/users`.
  2. Click Delete icon and confirm.
- **Input Data**: Click Delete on user row.
- **Expected Result**:
  - Network logs `DELETE /api/users/:id` returning HTTP `200 OK`.
  - User row is removed from directory.
  - Record is removed from MongoDB.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-USER-03_user_deleted_200.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L220-L228).

---

#### [TC-PROF-01] Update Personal User Profile Metadata
- **Related SRS Requirement**: `FR-029`
- **Objective**: Verify that modifying personal details on `/profile` sends `PUT /api/users/:id` and updates MongoDB.
- **Preconditions**: User authenticated.
- **Test Steps**:
  1. Navigate to `/profile`.
  2. Update Phone: `+1-555-0199`.
  3. Update Department: `Facilities & Plant Engineering`.
  4. Update Job Title: `Senior Facilities Director`.
  5. Click "Save Changes".
  6. Refresh page to verify persistence.
- **Input Data**: Updated profile fields.
- **Expected Result**:
  - Dispatches `PUT /api/users/:id` returning HTTP `200 OK`.
  - Toast displays "Profile updated successfully".
  - Data persists across browser refresh.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-PROF-01_profile_updated_200.png`. Verified in [`src/pages/UserProfile.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/UserProfile.jsx) and [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L177-L191).

---

#### [TC-PROF-02] Base64 Profile Picture Upload & Persistence
- **Related SRS Requirement**: `FR-030`
- **Objective**: Verify that selecting an image file converts it to a Base64 data string, saves it in MongoDB, and displays the avatar in the top header.
- **Preconditions**: User on `/profile`; standard JPEG/PNG image available ($\le 2\text{MB}$).
- **Test Steps**:
  1. On `/profile`, click the avatar camera icon or "Upload Photo".
  2. Select image `avatar_test.png`.
  3. Observe preview updates.
  4. Click "Save Changes".
  5. Inspect top-right navigation header.
- **Input Data**: Image file converted via `FileReader.readAsDataURL()`.
- **Expected Result**:
  - Request payload contains `profileImage: "data:image/png;base64,iVBORw0KGgo..."`.
  - Backend accepts payload within 10MB body limit and returns HTTP `200 OK`.
  - Avatar image renders in profile header and global navigation bar.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-PROF-02_base64_avatar_upload.png`. Verified in [`src/pages/UserProfile.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/UserProfile.jsx) and [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L30).

---

### MODULE 8: BIM SPATIAL WIREFRAME VIEWER

#### [TC-BIM-01] Render 2D Isometric Building Spatial Wireframe
- **Related SRS Requirement**: `FR-022`
- **Objective**: Verify that `/bim-viewer` queries `/api/bim` and renders the 2D isometric SVG spatial wireframe with categorized systems.
- **Preconditions**: User authenticated.
- **Test Steps**:
  1. Navigate to `http://localhost:5173/bim-viewer`.
  2. Check Network tab for `GET /api/bim`.
  3. Inspect the SVG viewport canvas in the center pane.
  4. Inspect the left equipment categories tree (HVAC, Electrical, Plumbing, Safety).
- **Input Data**: Mount `/bim-viewer`.
- **Expected Result**:
  - Network logs `GET /api/bim` returning HTTP `200 OK`.
  - SVG wireframe canvas displays building structural lines and MEP nodes.
  - Left panel displays categories with count badges.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-BIM-01_isometric_canvas_rendered.png`. Verified in [`src/pages/BIMViewer.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/BIMViewer.jsx) and [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L348-L380).

---

#### [TC-BIM-02] Viewport Interactive Canvas Zoom, Rotate, and Reset
- **Related SRS Requirement**: `FR-023`
- **Objective**: Verify toolbar transform controls (Zoom In, Zoom Out, Rotate, Reset).
- **Preconditions**: Canvas mounted on `/bim-viewer`.
- **Test Steps**:
  1. Click "Zoom In" button (+) twice.
  2. Observe zoom indicator shows `120%`.
  3. Click "Rotate" button once.
  4. Observe canvas rotation angle increments by 45°.
  5. Click "Reset" button.
- **Input Data**: Toolbar button clicks.
- **Expected Result**:
  - SVG canvas applies CSS `transform: scale(1.2) rotate(45deg)`.
  - Clicking Reset restores `scale(1) rotate(0deg)` and zoom indicator displays `100%`.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-BIM-02_canvas_zoom_rotate.png`. Verified in [`src/pages/BIMViewer.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/BIMViewer.jsx).

---

#### [TC-BIM-03] Spatial Asset Property Inspection & Tab Navigation
- **Related SRS Requirement**: `FR-024`
- **Objective**: Verify that selecting a spatial node in the left panel updates the right property inspection card.
- **Preconditions**: Viewer loaded with assets.
- **Test Steps**:
  1. In the left panel, click on `AHU-04` (`Air Handling Unit 4`).
  2. Observe the right property panel.
  3. Switch between tabs: "Overview", "Maintenance", "Issues".
- **Input Data**: Node click on `AHU-04`.
- **Expected Result**:
  - Right panel displays `AHU-04`, health progress bar (`92%`), category badge (`HVAC`), and engineering specs.
  - Tab navigation updates the lower card without throwing errors.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-BIM-03_node_inspection_panel.png`.

---

#### [TC-BIM-04] Export Spatial Building Node Data to JSON
- **Related SRS Requirement**: `FR-025`
- **Objective**: Verify that clicking "Export JSON" downloads the active BIM asset dataset.
- **Preconditions**: BIM viewer active.
- **Test Steps**:
  1. Click "Export" / "Download JSON" in the BIM toolbar.
  2. Inspect downloaded file.
- **Input Data**: Click Export JSON.
- **Expected Result**:
  - Browser downloads a file named `BIM_Assets_<date>.json`.
  - File contains structured array of equipment nodes with IDs, categories, and coordinates.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-BIM-04_bim_json_download.png`.

---

### MODULE 9: SYSTEM PREFERENCES & CACHE MANAGEMENT

#### [TC-CONF-01] Local Preference Toggle & `localStorage` Persistence
- **Related SRS Requirement**: `FR-033`
- **Objective**: Verify that toggling theme (Dark/Light) and density settings saves preferences to `localStorage`.
- **Preconditions**: User on `/settings`.
- **Test Steps**:
  1. Navigate to `/settings`.
  2. Toggle "Theme" from Light to Dark.
  3. Toggle "Table Density" to Compact.
  4. Open DevTools Console and evaluate `localStorage.getItem("app_preferences")`.
  5. Refresh page.
- **Input Data**: Toggle settings switches.
- **Expected Result**:
  - `localStorage` contains JSON object `{ "theme": "dark", "density": "compact", ... }`.
  - Dark mode styles apply to the UI.
  - Preferences persist after page refresh.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-CONF-01_settings_localstorage.png`. Verified in [`src/pages/Settings.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/Settings.jsx).

---

#### [TC-CONF-02] Danger Zone Cache Clear & Immediate Session Termination
- **Related SRS Requirement**: `FR-034`
- **Objective**: Verify that executing "Clear Cache & Reset" in Danger Zone purges storage and forces re-login.
- **Preconditions**: Active session with stored preferences.
- **Test Steps**:
  1. On `/settings`, scroll to the "Danger Zone".
  2. Click "Clear All Cache & Reset".
  3. Confirm warning modal.
- **Input Data**: Click Danger Zone reset.
- **Expected Result**:
  - Executes `localStorage.clear()` and `sessionStorage.clear()`.
  - Browser redirects immediately to `/` (Login).
  - Storage keys are completely empty.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-CONF-02_danger_zone_purge.png`. Verified in [`src/pages/Settings.jsx`](file:///E:/SE_Project/Software_Engineering/src/pages/Settings.jsx).

---

### MODULE 10: BOUNDARY VALIDATION & ERROR HANDLING

#### [TC-ERR-01] Rejection of Malformed Mongoose ObjectId on Parameterized Route
- **Related SRS Requirement**: `NFR-REL-01`
- **Objective**: Verify backend resilience when supplied with an invalid non-hexadecimal MongoDB ObjectId.
- **Preconditions**: User authenticated.
- **Test Steps**:
  1. Open API tester (Postman, ThunderClient, or PowerShell `Invoke-RestMethod`).
  2. Send `GET http://localhost:5000/api/users/not-a-valid-object-id` with valid Bearer token.
- **Input Data**: Parameter `:id = "not-a-valid-object-id"`.
- **Expected Result**:
  - Backend catches Mongoose `CastError: Cast to ObjectId failed`.
  - Returns HTTP status `500` or `400` with clean error JSON: `{ "error": "..." }`.
  - Server process remains alive and does not crash.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ERR-01_malformed_objectid_handling.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L165-L175).

---

#### [TC-ERR-02] Rejection of Invalid Priority / Category Enum Strings
- **Related SRS Requirement**: `NFR-DAT-01`
- **Objective**: Verify that submitting enum values outside schema constraints is rejected by Mongoose validation.
- **Preconditions**: User authenticated.
- **Test Steps**:
  1. Send `POST http://localhost:5000/api/issues` with payload:
     ```json
     {
       "title": "Invalid Enum Test",
       "assetId": "AHU-01",
       "category": "NuclearRadiation",
       "priority": "SuperUrgent",
       "reportedBy": "Tester"
     }
     ```
- **Input Data**: Non-enum values `"NuclearRadiation"`, `"SuperUrgent"`.
- **Expected Result**:
  - Backend returns HTTP `400 Bad Request`.
  - Response JSON indicates validator error: `is not a valid enum value for path 'category'` / `'priority'`.
  - Invalid record is not inserted.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ERR-02_enum_validation_400.png`. Verified in [`backend/models/Issue.js`](file:///E:/SE_Project/Software_Engineering/backend/models/Issue.js#L18-L23).

---

#### [TC-ERR-03] Base64 Payload Size Ceiling Rejection Over 10MB
- **Related SRS Requirement**: `NFR-SEC-05`
- **Objective**: Verify that uploading payloads exceeding the 10MB Express ceiling triggers HTTP 413 Payload Too Large.
- **Preconditions**: User authenticated.
- **Test Steps**:
  1. Generate a dummy Base64 payload string larger than 10MB ($> 10,485,760\text{ bytes}$).
  2. Send `PUT http://localhost:5000/api/users/:id` with payload.
- **Input Data**: String payload of size 12MB.
- **Expected Result**:
  - Express `express.json({ limit: '10mb' })` middleware intercepts request.
  - Returns HTTP `413 Payload Too Large` with error `entity.too.large`.
  - Server memory is protected from denial-of-service exhaustion.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-ERR-03_payload_too_large_413.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L30).

---

### MODULE 11: SECURITY & UNAUTHENTICATED API PROTECTION

#### [TC-SEC-01] Reject Unauthenticated API Request (Missing Authorization Header)
- **Related SRS Requirement**: `NFR-SEC-02`
- **Objective**: Verify that calling protected backend endpoints without a token returns HTTP 401 Unauthorized.
- **Preconditions**: Backend running on port 5000.
- **Test Steps**:
  1. Open terminal and execute PowerShell command:
     ```powershell
     Invoke-WebRequest -Uri "http://localhost:5000/api/assets" -Method GET -SkipHttpErrorCheck
     ```
  2. Repeat for `GET /api/issues` and `GET /api/maintenance`.
- **Input Data**: Zero `Authorization` headers.
- **Expected Result**:
  - Backend middleware `verifyToken` executes.
  - Returns HTTP status `401 Unauthorized`.
  - Response payload: `{ "error": "Access denied. No token provided." }` or `{ "message": "Unauthorized" }`.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-SEC-01_missing_token_401.png`. Verified in [`backend/middleware/auth.js`](file:///E:/SE_Project/Software_Engineering/backend/middleware/auth.js).

---

#### [TC-SEC-02] Reject Malformed / Tampered Bearer JWT Token
- **Related SRS Requirement**: `NFR-SEC-02`
- **Objective**: Verify that providing a forged, expired, or malformed JWT token is rejected with HTTP 403 Forbidden.
- **Preconditions**: Backend running.
- **Test Steps**:
  1. Execute PowerShell command:
     ```powershell
     Invoke-WebRequest -Uri "http://localhost:5000/api/assets" -Method GET -Headers @{ "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.tamperedsignature" } -SkipHttpErrorCheck
     ```
- **Input Data**: Forged Bearer token string.
- **Expected Result**:
  - `jwt.verify()` throws `JsonWebTokenError: invalid signature` or `invalid token`.
  - Backend responds with HTTP status `403 Forbidden` or `401 Unauthorized`.
  - Access to asset database is denied.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-SEC-02_tampered_token_403.png`. Verified in [`backend/middleware/auth.js`](file:///E:/SE_Project/Software_Engineering/backend/middleware/auth.js).

---

#### [TC-SEC-03] Enforce Multi-Tenant Data Isolation Across User Accounts
- **Related SRS Requirement**: `NFR-SEC-04`
- **Objective**: Verify that User B cannot read or modify assets owned by User A.
- **Preconditions**:
  - User A (`alex.turner@facility.com`) creates asset `AHU-USER-A`.
  - User B registers as `brenda.wright@facility.com`.
- **Test Steps**:
  1. Log in as User B (`brenda.wright@facility.com`).
  2. Navigate to `/assets`.
  3. Inspect table rows to verify whether `AHU-USER-A` appears.
  4. Attempt direct API request:
     ```powershell
     Invoke-RestMethod -Uri "http://localhost:5000/api/assets" -Method GET -Headers @{ "Authorization" = "Bearer <User_B_Token>" }
     ```
- **Input Data**: User B authenticated token.
- **Expected Result**:
  - User B's `/assets` view displays 0 assets (or only assets created by User B).
  - `AHU-USER-A` is completely invisible in User B's ledger.
  - Backend query `Asset.find({ userId: req.user.id })` restricts data access strictly to User B's identifier.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-SEC-03_multitenant_isolation.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L50).

---

#### [TC-SEC-04] Verification of Encrypted Password Exclusion in User Listing
- **Related SRS Requirement**: `NFR-SEC-05`
- **Objective**: Verify that the administrative user directory endpoint (`GET /api/users`) excludes encrypted password hashes.
- **Preconditions**: User authenticated.
- **Test Steps**:
  1. Send `GET http://localhost:5000/api/users` with valid Bearer token.
  2. Inspect response JSON in Network tab.
- **Input Data**: Authorized directory query.
- **Expected Result**:
  - Response contains array of user records.
  - Property `password` is strictly `undefined` on every user object (enforced by Mongoose `.select('-password')`).
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-SEC-04_password_omission.png`. Verified in [`backend/index.js`](file:///E:/SE_Project/Software_Engineering/backend/index.js#L198).

---

### MODULE 12: DATABASE & END-TO-END INTEGRATION

#### [TC-INT-01] End-to-End Asset Creation, Retrieval, and Database Verification
- **Related SRS Requirement**: `FR-008`, `NFR-SEC-01`
- **Objective**: Verify end-to-end integration across React UI, Express API, and MongoDB persistence.
- **Preconditions**: Full application stack active.
- **Test Steps**:
  1. Log in via UI.
  2. Navigate to `/assets` and click "Add Asset".
  3. Submit asset `GEN-501` (`Backup Diesel Generator`).
  4. Query MongoDB directly via terminal:
     ```powershell
     mongosh "mongodb://127.0.0.1:27017/bim_management" --eval "db.assets.findOne({ assetId: 'GEN-501' })"
     ```
- **Input Data**: Asset registration payload.
- **Expected Result**:
  - UI displays row `GEN-501`.
  - MongoDB output matches:
    ```javascript
    {
      _id: ObjectId("..."),
      assetId: "GEN-501",
      name: "Backup Diesel Generator",
      status: "Active",
      userId: ObjectId("..."),
      createdAt: ISODate("...")
    }
    ```
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-INT-01_mongosh_asset_verify.png`.

---

#### [TC-INT-02] End-to-End Issue Logging, Assignment, and Status Lifecycle
- **Related SRS Requirement**: `FR-015`, `FR-016`, `FR-017`
- **Objective**: Verify complete lifecycle integration of an incident from creation to resolution.
- **Preconditions**: User authenticated.
- **Test Steps**:
  1. Log an issue: `Elevator Motor Overheating` for asset `ELEV-01` (Priority: High).
  2. Assign technician `Sarah Jenkins`.
  3. Update status to `In Progress`.
  4. Update status to `Resolved`.
  5. Check Dashboard KPI card for Active Issues.
- **Input Data**: Multi-step issue lifecycle actions.
- **Expected Result**:
  - Issue state updates from `Open` to `In Progress` to `Resolved` in MongoDB.
  - Active issues counter on Dashboard decrements by 1 upon resolution.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-INT-02_issue_lifecycle_e2e.png`.

---

#### [TC-INT-03] End-to-End Maintenance Task Due Date Detection and State Update
- **Related SRS Requirement**: `FR-019`, `FR-020`, `FR-021`
- **Objective**: Verify complete flow of preventative maintenance scheduling, overdue calculation, and completion.
- **Preconditions**: Asset exists.
- **Test Steps**:
  1. Schedule a task due yesterday (`2026-10-28`).
  2. Observe task is immediately tagged `Overdue` in UI.
  3. Click "Mark Completed".
  4. Observe status becomes `Completed` and Overdue count decrements.
  5. Verify MongoDB document shows `workStatus: "Completed"`.
- **Input Data**: Past due task $\rightarrow$ Mark completed.
- **Expected Result**:
  - System transitions cleanly from auto-detected overdue state to completed state across UI and database.
- **Actual Result**: *Pending execution — To be recorded upon test run.*
- **Status**: **Not Run**
- **Remarks / Evidence**: Target screenshot: `docs/evidence/TC-INT-03_maint_lifecycle_e2e.png`.

---

## 6. TEST EXECUTION INSTRUCTIONS FOR STUDENTS & AUDITORS

To execute these tests and prepare your final submission report for IA3 Condition 4:

1. **Create Evidence Directory**:
   ```powershell
   New-Item -ItemType Directory -Force -Path "E:\SE_Project\Software_Engineering\docs\evidence"
   ```
2. **Execute Test Cases Sequentially**:
   - Begin with `TC-AUTH-01` and proceed through `TC-INT-03`.
   - Take full-screen screenshots showing the browser window and DevTools Network tab.
   - Save screenshots with exact filenames referenced in the **Remarks / Evidence** field of each test case.
3. **Update Document Control & Status Counts**:
   - Change test status from `Not Run` to `Pass` (or `Fail` if an unexpected behavior occurs).
   - Enter the actual test result text into the `Actual Result` field.
   - Update the numbers in **Section 3: Test Execution Summary** to reflect the completed test count (e.g., 45 Pass, 0 Fail, 0 Not Run).
4. **Preserve Codebase Integrity**:
   - Do not alter production frontend or backend application code during testing.

