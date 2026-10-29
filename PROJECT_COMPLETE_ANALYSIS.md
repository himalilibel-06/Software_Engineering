# COMPLETE PROJECT ANALYSIS AND AUDIT REPORT: BIM FACILITY MANAGEMENT SYSTEM

> **Repository**: [https://github.com/himalilibel-06/Software_Engineering.git](https://github.com/himalilibel-06/Software_Engineering.git)  
> **Workspace Location**: `E:\SE_Project\Software_Engineering`  
> **Audit Date**: October 29, 2026  
> **Auditor**: Senior Principal Software Engineer, Full-Stack Architect & Code Auditor  
> **Audit Scope**: Complete static code inspection, dependency audit, architectural review, database schema evaluation, API inventory, algorithm complexity analysis, and vulnerability audit.

---

## TABLE OF CONTENTS
1. [Executive Summary](#1-executive-summary)
2. [Project Objectives and Problem Statement](#2-project-objectives-and-problem-statement)
3. [Technology Stack](#3-technology-stack)
4. [Complete Folder and File Inventory](#4-complete-folder-and-file-inventory)
5. [Page-by-Page Analysis](#5-page-by-page-analysis)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend Architecture](#7-backend-architecture)
8. [Database Structure and Models](#8-database-structure-and-models)
9. [API Inventory and Route Specifications](#9-api-inventory-and-route-specifications)
10. [Function and Component Explanations](#10-function-and-component-explanations)
11. [Algorithms and Complexity Analysis](#11-algorithms-and-complexity-analysis)
12. [End-to-End Workflows](#12-end-to-end-workflows)
13. [Mermaid System Diagrams](#13-mermaid-system-diagrams)
14. [Feature Verification Checklist](#14-feature-verification-checklist)
15. [Test Cases and Actual Verification Results](#15-test-cases-and-actual-verification-results)
16. [Bugs, Security Vulnerabilities, and Code Smells](#16-bugs-security-vulnerabilities-and-code-smells)
17. [Missing Features and Improvement Roadmap](#17-missing-features-and-improvement-roadmap)
18. [Setup, Installation, and Execution Instructions](#18-setup-installation-and-execution-instructions)
19. [Known Limitations and Constraints](#19-known-limitations-and-constraints)
20. [Final Project Status and Verdict](#20-final-project-status-and-verdict)

---

## 1. EXECUTIVE SUMMARY

The **Software_Engineering** repository (configured under the package name `bim-management`) represents a full-stack **Building Information Modeling (BIM) Facility Management Platform**. The application is designed to bridge spatial architectural infrastructure with daily operational maintenance, asset tracking, issue dispatching, and user management.

The software architecture is divided into two primary sub-systems:
1. **Frontend Single Page Application (SPA)**: Built using **React 19**, **Vite 8**, **Tailwind CSS 4**, **React Router v7**, and **Recharts 3**. It provides multiple operational views including a high-level analytics dashboard, asset inventory management, issue management, routine maintenance schedulers, user directory administration, profile customizers, and an interactive 2D/3D BIM viewport mockup.
2. **Backend REST API**: Powered by **Node.js (ES Modules)**, **Express 5**, and **Mongoose 9** connecting to **MongoDB**. It handles user authentication with password hashing via **bcryptjs**, session token management via **JSON Web Tokens (JWT)**, role-based authorization, and user-scoped CRUD persistence for physical hardware assets, maintenance routines, issues, technicians, and user profiles.

### Key Audit Findings
- **High Architectural Disparity**: The codebase contains duplicate, parallel implementations of several core pages (e.g., `AssetManagement.jsx` vs. `AssetInventory.jsx`, `MaintenanceManagement.jsx` vs. `MaintenanceSchedule.jsx`, and `Dashboard.jsx` vs. `DashboardOverview.jsx`). While the primary pages (`AssetManagement`, `MaintenanceManagement`, `Dashboard`, `IssueManagement`) integrate with the Express backend using JWT-authenticated requests (`apiFetch`), the secondary pages make hardcoded `fetch('http://localhost:5000/...')` calls with no `Authorization` headers, triggering **401 Unauthorized** runtime failures against the Express backend.
- **Orphaned Layout and Component Hierarchy**: A dedicated `Layout.jsx` with an enterprise-grade `Sidebar.jsx` exists in `src/Layout/Layout.jsx`, but is never imported by any active route. Instead, pages like `Dashboard.jsx` build their own bespoke sidebar while other pages render without navigation shells.
- **Visual-Only Placeholders**: The `BIMViewer.jsx` implements SVG wireframe transforms (`scale` and `rotate`) rather than real WebGL/Three.js IFC geometry rendering. Similarly, `EditAsset.jsx` only displays an alert without persisting data, and `Analytics.jsx` expects an `assets` prop that `App.jsx` never passes to it.
- **Testing and Build Vacuum**: Zero unit tests, integration tests, or end-to-end testing suites exist in the workspace. No `node_modules` folders are present, rendering runtime execution blocked until dependencies are installed.

---

## 2. PROJECT OBJECTIVES AND PROBLEM STATEMENT

### 2.1 Problem Statement
Modern commercial facilities and enterprise buildings contain thousands of interconnected physical hardware assets (HVAC chillers, distribution boards, air handling units, plumbing pumps, fire safety systems). Traditional facility management relies on fragmented paper logs, isolated spreadsheets, or disconnected CAD files. When equipment fails:
- Maintenance teams struggle to locate physical units and their technical specifications.
- Recurring preventative maintenance is missed, leading to critical breakdowns.
- Operational spending is reactive rather than preventative.
- Issue assignment and accountability are delayed.

### 2.2 Proposed Solution
The **BIM Facility Manager** platform provides a centralized, cloud-connected management suite where facility managers, technicians, and administrators can:
- Track physical hardware assets with unique IDs, categories, spatial locations, and live health indices.
- Plan, schedule, and dispatch preventive maintenance work orders.
- Log, categorize, prioritize, and assign building defects and issues.
- Correlate asset degradation with spatial building wireframes.
- Calculate fleet health metrics, uptime SLAs, and planned vs. unplanned expenditures.

### 2.3 Target Users
1. **Facility Managers**: Oversee building operations, monitor fleet health scores, analyze maintenance spend trends, export CSV reports, and assign work orders.
2. **Technicians**: View assigned field maintenance routines, diagnose equipment issues, and update task statuses.
3. **System Administrators**: Provision user accounts, manage security credentials, configure department parameters, and oversee system directories.

---

## 3. TECHNOLOGY STACK

Based strictly on `package.json` manifests, configuration files, and source code imports, the project utilizes the following technologies:

| Layer | Technology | Version | Purpose in Codebase |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.6` | Component-based user interface rendering (`main.jsx`, `App.jsx`). |
| **DOM Renderer** | React DOM | `^19.2.6` | Mounting React virtual DOM to root HTML element. |
| **Build Tool / Bundler** | Vite | `^8.0.12` | Development server, Fast Refresh, and production bundling. |
| **Vite React Plugin** | `@vitejs/plugin-react` | `^6.0.1` | React JSX transformation and Fast Refresh integration. |
| **Client Routing** | React Router DOM | `^7.17.0` | Declarative client-side routing (`BrowserRouter`, `Routes`, `Route`, `Navigate`). |
| **Styling Engine** | Tailwind CSS | `^4.3.1` | Utility-first CSS styling via `@tailwindcss/vite` plugin. |
| **Data Visualizations** | Recharts | `^3.8.1` | Interactive Bar, Line, Area, and Pie charts for facility metrics. |
| **Icon Libraries** | React Icons | `^5.6.0` | Visual indicators from Material Icons (`md`), Feather Icons (`fi`), Heroicons (`hi2`), and Tabler Icons (`tb`). |
| **Notifications** | React Toastify | `^11.1.0` | User feedback notifications on registration (`Signup.jsx`). |
| **Backend Runtime** | Node.js | `>=18.x` | Execution environment using ES Modules (`"type": "module"`). |
| **Backend Framework** | Express | `^5.2.1` | RESTful API routing, middleware chaining, and request handling. |
| **Object Data Modeling** | Mongoose | `^9.7.2` | MongoDB schema modeling, validation, and query execution. |
| **Authentication / JWT**| jsonwebtoken | `^9.0.3` | Cryptographic JWT signing (HMAC SHA-256) and bearer token verification. |
| **Password Hashing** | bcryptjs | `^3.0.3` | Salted password hashing (10 salt rounds) and comparison. |
| **Cross-Origin Handling**| cors | `^2.8.6` | Enabling cross-origin resource sharing for frontend requests. |
| **Environment Config** | dotenv | `^17.4.2` | Injecting `.env` environment variables into `process.env`. |
| **Static Deployment** | gh-pages | `^6.3.0` | Build deployment to GitHub Pages (`dist` directory). |

---

## 4. COMPLETE FOLDER AND FILE INVENTORY

The following inventory details every file discovered in the `Software_Engineering` workspace:

| File Path | Type | Main Responsibility | Key Symbols / Exports | Dependencies | Status | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `package.json` | Config | Root frontend manifest and scripts | Scripts: `dev`, `build`, `deploy` | Vite, React 19, Recharts | Active | Lists unneeded `dotenv` and `mongoose`. |
| `package-lock.json` | Config | Pinned dependency tree lockfile | Dependency tree lock | npm registry | Active | Pinned tree for frontend dependencies. |
| `vite.config.js` | Config | Vite build configuration | `defineConfig` | `@vitejs/plugin-react`, `@tailwindcss/vite` | Active | Configures base URL based on `process.env.VERCEL`. |
| `eslint.config.js` | Config | Linting rules for JavaScript/React | ESLint flat config | `@eslint/js`, `eslint-plugin-react-hooks` | Active | Configured for React hooks and refresh. |
| `vercel.json` | Config | Vercel SPA rewrite routing | Route rewrite to `/index.html` | Vercel deployment engine | Active | Ensures HTML5 history API fallback on Vercel. |
| `.env.example` | Config | Example frontend environment variables | `VITE_API_URL` | None | Active | Instructs point to Express API (`http://localhost:5000`). |
| `.gitignore` | Config | Git file exclusion rules | Excludes `node_modules`, `dist`, `.env` | Git VCS | Active | Standard ignores for web projects. |
| `index.html` | HTML | Single-page application root entry | HTML document shell `#root` | `src/main.jsx`, `public/favicon.svg` | Active | Mount point for React virtual DOM. |
| `404.html` | HTML | Legacy or fallback HTML file | Empty (0 bytes) | None | Incomplete | 0 bytes; overridden by `scripts/copy-404.js` on build. |
| `debug.log` | Log | Chromium crash dump artifact | ICU data descriptor error | Electron / VS Code | Artifact | Non-application log generated by external IDE/tool. |
| `scripts/copy-404.js` | Script | Postbuild copy script for GitHub Pages | Copies `dist/index.html` to `dist/404.html` | `node:fs` | Active | Hooked in `package.json` via `"postbuild"`. |
| `backend/package.json` | Config | Backend Node.js manifest | Scripts: `start`, `dev` | Express 5, Mongoose 9, JWT, bcryptjs | Active | Configured with `"type": "module"`. |
| `backend/package-lock.json` | Config | Backend dependency lockfile | Dependency tree lock | npm registry | Active | Pinned tree for backend dependencies. |
| `backend/.env.example` | Config | Example backend environment variables | `MONGO_URI`, `JWT_SECRET`, `PORT` | None | Active | Documentation for backend environment. |
| `backend/test-db.js` | Script | MongoDB connection verification script | Mongoose connection probe | `mongoose`, `dotenv/config` | Active | Test utility to verify DB connectivity. |
| `backend/lib/jwtSecret.js` | Utility | Single source for JWT signing secret | `getJwtSecret()` | `process.env` | Active | Contains fallback key `"FIXED_SECRET_KEY_12345"`. |
| `backend/middleware/auth.js` | Middleware | JWT verification Express middleware | `verifyToken(req, res, next)` | `jsonwebtoken`, `jwtSecret.js` | Active | Injects decoded payload into `req.user`. |
| `backend/models/User.js` | Model | Mongoose schema for User accounts | `User` default export, `comparePassword` | `mongoose`, `bcryptjs` | Active | Includes pre-save hook for password hashing. |
| `backend/models/Asset.js` | Model | Mongoose schema for Facility Assets | `Asset` default export | `mongoose` | Active | Enforces `assetId` uniqueness and `userId` ref. |
| `backend/models/Issue.js` | Model | Mongoose schema for Work Issues | `Issue` default export | `mongoose` | Active | Categorized with enum priority and status. |
| `backend/models/Maintenance.js`| Model | Mongoose schema for PM Tasks | `Maintenance` default export | `mongoose` | Active | Mapped for scheduled tasks and team assignments. |
| `backend/models/Technician.js` | Model | Mongoose schema for Field Technicians | `Technician` default export | `mongoose` | Active | Holds technician name and role. |
| `backend/routes/authRoutes.js` | Route | Auth endpoints (Signup, Login) | `router` default export, `handleLogin` | `express`, `User.js`, `jwtSecret.js` | Active | Handles `/signup`, `/login`, and `/Login`. |
| `backend/index.js` | Server | Express server entry point and APIs | Express app, routes, DB connection | Express, Mongoose, models, middleware | Active | Listens on port 5000; defines user-scoped CRUD APIs. |
| `src/main.jsx` | Entry | React frontend bootstrap file | React root render with `BrowserRouter` | `react`, `react-dom`, `App.jsx` | Active | Sets `BrowserRouter` basename from `import.meta.env`. |
| `src/App.jsx` | Routing | Top-level routing switchboard | `App` default export | `react-router-dom`, pages, ProtectedRoute | Active | Maps 16 route declarations; lacks 404 catch-all. |
| `src/index.css` | Styling | Global Tailwind CSS import | `@import "tailwindcss";` | Tailwind CSS 4 | Active | Imports Tailwind 4 framework styles. |
| `src/App.css` | Styling | Boilerplate Vite template styles | `.hero`, `.counter` classes | None | Unused | Never imported in `main.jsx` or `App.jsx`. |
| `src/lib/api.js` | Utility | Centralized fetch client with JWT | `apiFetch()`, `getAuthToken()`, `getApiBaseUrl()` | Native `fetch`, `localStorage` | Active | Intercepts requests and injects Bearer token. |
| `src/components/ProtectedRoute.jsx`| Component | Route guard for authenticated pages | `ProtectedRoute` default export | `react-router-dom`, `api.js` | Active | Checks for token presence in `localStorage`. |
| `src/components/Sidebar.jsx` | Component | Enterprise navigation sidebar UI | `Sidebar` default export | `react-icons` | Unused | Only imported in orphaned `Layout.jsx`. |
| `src/Layout/Layout.jsx` | Layout | Master shell with header & sidebar | `Layout` default export | `Sidebar.jsx` | Unused | Never imported in `App.jsx` or any page. |
| `src/components/AssetAnalytics.jsx`| Component | Sub-analytics charts for assets | `AssetAnalytics` default export | `recharts`, `react-icons` | Active | Rendered inside `AssetManagement.jsx`. |
| `src/pages/Login.jsx` | Page | User login page | `Login` default export | `apiFetch`, `react-router-dom` | Active | Authenticates user and stores token in storage. |
| `src/pages/Signup.jsx` | Page | User registration page | `Signup` default export | `apiFetch`, `react-toastify` | Active | Registers new user; validation function uncalled. |
| `src/pages/Dashboard.jsx` | Page | Primary live metrics dashboard | `Dashboard` default export | `recharts`, `apiFetch`, `react-icons` | Active | Fetches assets, issues, and maintenance data. |
| `src/pages/DashboardOverview.jsx` | Page | Secondary summary overview page | `DashboardOverview` default export | `react-icons` | Incomplete | Uses unauthenticated fetch; fails with 401. |
| `src/pages/AssetManagement.jsx`| Page | Full CRUD asset management table | `AssetManagement` default export | `apiFetch`, `AssetAnalytics.jsx` | Active | Complete CRUD, search, filter, CSV export. |
| `src/pages/AssetInventory.jsx` | Page | Secondary asset inventory view | `AssetInventory` default export | `react-icons` | Incomplete | Hardcoded unauthenticated fetch; fails with 401. |
| `src/pages/AssetDetails.jsx` | Page | Asset deep-dive inspection page | `AssetDetails` default export | `react-router-dom`, `react-icons` | Partial | Requires route state; renders dummy data. |
| `src/pages/EditAsset.jsx` | Page | Asset edit form page | `EditAsset` default export | `react-router-dom` | Incomplete | Dummy component; does not persist updates. |
| `src/pages/MaintenanceManagement.jsx` | Page | Work order management ledger | `MaintenanceManagement` default export | `react-icons`, local `apiFetch` | Active | Full CRUD for maintenance work orders. |
| `src/pages/MaintenanceSchedule.jsx` | Page | Secondary routine calendar view | `MaintenanceSchedule` default export | `react-icons` | Incomplete | Hardcoded unauthenticated fetch; fails with 401. |
| `src/pages/IssueManagement.jsx`| Page | Defect and issue tracking board | `IssueManagement` default export | `apiFetch`, `react-icons` | Active | Full CRUD, staff assignment, status dropdown. |
| `src/pages/BIMViewer.jsx` | Page | 2D/3D BIM spatial wireframe modeler | `BIMViewer` default export | `react-icons` | Partial | Uses SVG wireframe; does not fetch `/api/bim`. |
| `src/pages/UserManagement.jsx` | Page | Administrator user directory | `UserManagement` default export | `apiFetch`, `react-icons` | Active | Admin directory, create user, delete user. |
| `src/pages/UserProfile.jsx` | Page | User profile view and photo upload | `UserProfile` default export | `apiFetch`, `react-icons` | Active | Persists profile updates and base64 avatars. |
| `src/pages/Settings.jsx` | Page | System and user preferences | `Settings` default export | `react-icons` | Partial | Extensive UI; persists to `localStorage` only. |
| `src/pages/Analytics.jsx` | Page | Fleet analytics and reporting | `Analytics` default export | `recharts`, `react-icons` | Incomplete | Expects `assets` prop; routed with none. |
| `src/assets/hero.png` | Asset | Vite demo placeholder graphic | Binary image | None | Unused | Leftover from template scaffolding. |
| `src/assets/react.svg` | Asset | React logo vector graphic | SVG image | None | Unused | Leftover from template scaffolding. |
| `src/assets/vite.svg` | Asset | Vite logo vector graphic | SVG image | None | Unused | Leftover from template scaffolding. |
| `public/favicon.svg` | Asset | Browser tab favicon | SVG vector graphic | `index.html` | Active | Rendered as application favicon. |
| `public/icons.svg` | Asset | SVG icon spritesheet | SVG vector definitions | None | Uncertain | Unreferenced in active JSX components. |

---

## 5. PAGE-BY-PAGE ANALYSIS

### Page 1: Login (`/`)
- **Source File**: [Login.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/Login.jsx)
- **Route**: `/` (Public)
- **Purpose**: Authenticates registered facility personnel using email, password, and selected role.
- **Interactive Elements**:
  - Role selection radio tiles: "Facility Manager", "Technician", "Administrator".
  - Email and password input fields with a visibility toggle button.
  - "Remember me" checkbox (stores state locally).
  - Submit button: "Sign In to Workspace".
  - Link to `/signup` ("Create an account").
- **API Requests**: Triggers `POST /api/auth/Login` via `apiFetch('/api/auth/Login', { auth: false, body: ... })`.
- **Data Flow & Storage**: On HTTP 200 response, extracts `data.token` and `data.user` and commits them to browser `localStorage` (`localStorage.setItem('token', data.token)` and `localStorage.setItem('user', JSON.stringify(data.user))`), then executes `navigate('/dashboard')`.
- **Validation**: Enforces non-empty email and password. Server enforces role verification against the user's database record.
- **Status**: **IMPLEMENTED** (Verified by static code inspection).

### Page 2: Signup (`/signup`)
- **Source File**: [Signup.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/Signup.jsx)
- **Route**: `/signup` (Public)
- **Purpose**: Self-registration for new users wishing to access the facility platform.
- **Interactive Elements**:
  - Full Name, Email, Password, Confirm Password inputs.
  - Password visibility toggle icon.
  - Interactive password strength meter evaluating length and character entropy.
  - Role selection dropdown: "Facility Manager", "Technician", "Administrator".
  - Submit button: "Create Account".
  - Link to `/` ("Sign in").
- **API Requests**: Triggers `POST /api/auth/signup` via `apiFetch('/api/auth/signup', { auth: false, body: ... })`.
- **Validation Defect**: While an extensive client-side `validate()` function is declared (checking email regex, 8-character length, password matching, role selection), `handleSignup` **never invokes `validate()`**, submitting the payload directly to the backend.
- **Status**: **PARTIAL** (Functional backend registration, but client validation logic is bypassed).

### Page 3: Dashboard (`/dashboard`)
- **Source File**: [Dashboard.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/Dashboard.jsx)
- **Route**: `/dashboard` (Protected via `ProtectedRoute`)
- **Purpose**: Main operations control center visualizing telemetry across assets, maintenance routines, and open issues.
- **Interactive Elements**:
  - Bespoke collapsible left sidebar with navigation routes to all major modules.
  - Top header displaying personalized greeting ("Good morning/afternoon/evening, [User]"), live date, search bar, and user profile avatar with dropdown menu.
  - 4 interactive KPI metric cards: Total Assets, Active Issues, Maintenance Tasks, Asset Health Score. Clicking any card navigates to the corresponding module.
  - Health by Floor Stacked Bar Chart (`Recharts`).
  - Maintenance Cost Trend Multi-Line Chart (`Recharts` planned vs. unplanned spend).
  - Open Issues by Priority Donut/Pie Chart (`Recharts`).
  - Recent Activities data table with live status badges.
- **API Requests**: Executes parallel telemetry queries via `Promise.all`:
  - `GET /api/assets`
  - `GET /api/maintenance`
  - `GET /api/issues`
- **Data Flow**: Calculates in-memory floor distributions, health averages, cost timelines, and priority breakdowns from returned JSON arrays.
- **Status**: **IMPLEMENTED**.

### Page 4: Dashboard Overview (`/dashboard-overview`)
- **Source File**: [DashboardOverview.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/DashboardOverview.jsx)
- **Route**: `/dashboard-overview` (Protected via `ProtectedRoute`)
- **Purpose**: Simplified, high-level summary overview of system counts.
- **Interactive Elements**:
  - Metric counters (Hardware Assets, Urgent Issues, Due Today Tasks, Operational Index).
  - Breakdown progress bars by issue category.
  - Quick navigation cards linking to `/issues`, `/assets`, `/maintenance`.
  - "Refresh Hub" button calling `fetchDashboardStats`.
- **API Requests**: Calls `GET http://localhost:5000/api/dashboard/stats`.
- **Critical Flaw**: Hardcodes `http://localhost:5000` and omits the JWT `Authorization` header. Because `/api/dashboard/stats` requires `verifyToken`, the backend responds with **401 Unauthorized**. The component fails to parse `stats.breakdown`, throwing a runtime error (`Object.values(undefined)`).
- **Status**: **INCOMPLETE / BROKEN**.

### Page 5: Asset Management (`/assets`)
- **Source File**: [AssetManagement.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/AssetManagement.jsx)
- **Route**: `/assets` (Protected via `ProtectedRoute`)
- **Purpose**: Primary enterprise hardware asset registry supporting complete CRUD operations.
- **Interactive Elements**:
  - Live search input matching asset ID, name, or location.
  - Dropdown filter by Status ("Operational", "Maintenance", "Critical").
  - Dynamic category filter dropdown populated from active asset records.
  - "Add Asset" button opening modal form with fields: Asset ID, Name, Category, Location, Status, Health.
  - Table action buttons per row: View (opens details modal), Edit (opens edit modal), Delete (opens confirmation modal).
  - "Export" button triggering instant client-side CSV generation and download.
  - "Sync" button triggering live database re-fetch.
  - Pagination controls (6 records per page).
  - Sub-component: `<AssetAnalytics assets={assets} />` rendering Category Health Bar Chart and Status Allocation Donut Chart.
- **API Requests**:
  - `GET /api/assets`
  - `POST /api/assets`
  - `PUT /api/assets/:id`
  - `DELETE /api/assets/:id`
- **Status**: **IMPLEMENTED**.

### Page 6: Asset Details (`/asset-details`)
- **Source File**: [AssetDetails.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/AssetDetails.jsx)
- **Route**: `/asset-details` (Protected via `ProtectedRoute`)
- **Purpose**: In-depth inspection view for a single physical asset.
- **Interactive Elements**:
  - "Back to Assets" button navigating to `/assets`.
  - "Edit Asset" button navigating to `/edit-asset` with state.
  - Visual KPI cards: Health Score, Asset Age, Maintenance Count, Open Issues.
  - Asset information grid (Manufacturer, Model, Installation Date, Warranty Expiry, Technician).
  - Maintenance history table (Hardcoded dummy array).
  - Open issues cards (Hardcoded dummy array).
  - Document attachments list (Hardcoded dummy array).
  - Action buttons: "Generate Report" and "New Work Order" (Visual only, no `onClick` handlers).
- **Data Flow Flaw**: Relies on `location.state?.asset`. If accessed directly or refreshed, renders "No Asset Data Found". Furthermore, `AssetManagement.jsx` opens its own modal instead of navigating to this page.
- **Status**: **PARTIAL / PLACEHOLDER**.

### Page 7: Asset Inventory (`/asset-inventory`)
- **Source File**: [AssetInventory.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/AssetInventory.jsx)
- **Route**: `/asset-inventory` (Protected via `ProtectedRoute`)
- **Purpose**: Secondary implementation of an asset inventory table.
- **Interactive Elements**: Search bar, Status and Category dropdowns, "Register Asset" modal.
- **Critical Flaw**: Uses raw `fetch('http://localhost:5000/api/assets')` without JWT tokens. All requests fail with 401 Unauthorized against the protected backend.
- **Status**: **INCOMPLETE / DUPLICATE**.

### Page 8: Edit Asset (`/edit-asset`)
- **Source File**: [EditAsset.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/EditAsset.jsx)
- **Route**: `/edit-asset` (Protected via `ProtectedRoute`)
- **Purpose**: Form view to update asset properties.
- **Interactive Elements**: Input fields for Name, Location, Status; "Save Changes" button.
- **Implementation Status**: Stub/Mock only. Clicking "Save Changes" triggers `alert("Save button clicked!")` and logs to the console without sending any HTTP request.
- **Status**: **INCOMPLETE / MOCK**.

### Page 9: BIM Viewer (`/bim-viewer`)
- **Source File**: [BIMViewer.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/BIMViewer.jsx)
- **Route**: `/bim-viewer` (Protected via `ProtectedRoute`)
- **Purpose**: Spatial visualization linking physical asset records to building wireframes.
- **Interactive Elements**:
  - Left Sidebar: Category filters and asset list.
  - Central Viewport: Rotatable and scalable 2D SVG building wireframe. Controls for Zoom In, Zoom Out, Rotate (+45°), and Reset.
  - "Load Model" button opening OS file picker for `.ifc`, `.gltf`, `.glb`, `.obj` files (updates model name text only).
  - "Export Data" button exporting in-memory asset list to JSON file.
  - "Full Screen" button invoking HTML5 Fullscreen API.
  - "Add Asset" modal injecting records into React local state.
  - Bottom Tabbed Ledger: Maintenance History, Open Issues, Documents.
  - Right Sidebar: Detailed property card of the selected asset.
- **Architecture Caveat**: When mounted by `App.jsx`, no props are passed (`initialAssets = []`). The component does not fetch backend data from `GET /api/bim` or `GET /api/assets`, meaning it defaults to an empty state unless populated manually. The 3D canvas is simulated using SVG CSS transforms rather than WebGL.
- **Status**: **PARTIAL**.

### Page 10: Maintenance Management (`/maintenance`)
- **Source File**: [MaintenanceManagement.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/MaintenanceManagement.jsx)
- **Route**: `/maintenance` (Protected via `ProtectedRoute`)
- **Purpose**: Comprehensive preventative maintenance ledger and work order dispatching system.
- **Interactive Elements**:
  - KPI metric cards: Total Orders, Scheduled, In Progress, Completed, Overdue.
  - Search input matching task name, asset ID, or technician.
  - Dropdown filters for Status, Priority, and Category.
  - "New Work Order" button opening modal form (Asset ID, Task Name, Category, Technician, Priority, Due Date, Status).
  - Table actions: Edit work order modal, Delete work order with confirmation.
- **API Requests**:
  - `GET /api/maintenance`
  - `POST /api/maintenance`
  - `PUT /api/maintenance/:id`
  - `DELETE /api/maintenance/:id`
- **Status**: **IMPLEMENTED**.

### Page 11: Maintenance Schedule (`/maintenance-schedule`)
- **Source File**: [MaintenanceSchedule.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/MaintenanceSchedule.jsx)
- **Route**: `/maintenance-schedule` (Protected via `ProtectedRoute`)
- **Purpose**: Secondary routine scheduler view.
- **Interactive Elements**: KPI cards, Frequency filter, Status filter, "Schedule Routine" modal.
- **Critical Flaw**: Performs unauthenticated requests to `http://localhost:5000/api/maintenance`, failing with 401 Unauthorized.
- **Status**: **INCOMPLETE / DUPLICATE**.

### Page 12: Issue Management (`/issues`)
- **Source File**: [IssueManagement.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/IssueManagement.jsx)
- **Route**: `/issues` (Protected via `ProtectedRoute`)
- **Purpose**: Incident reporting, defect triage, staff dispatching, and resolution workflow tracking.
- **Interactive Elements**:
  - 4 KPI cards: Total Defects, Open, In Progress, Resolved.
  - Search bar and filters for Status, Priority, Category.
  - "Log Issue" button opening modal form (Title, Asset ID, Category, Priority, Reported By, Assigned To).
  - "Export Report" button generating RFC 4180 CSV download.
  - Table inline Status Dropdown: Changing value immediately triggers `PUT /api/issues/:id/status`.
  - Assign Staff button: Opens staff modal querying `GET /api/technicians` and commits choice via `PUT /api/issues/:id/assign`.
  - View Modal: Read-only inspection of issue details.
  - Delete Modal: Permanent deletion via `DELETE /api/issues/:id`.
- **API Requests**: Full CRUD on `/api/issues` and read on `/api/technicians`.
- **Status**: **IMPLEMENTED**.

### Page 13: User Management (`/users`)
- **Source File**: [UserManagement.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/UserManagement.jsx)
- **Route**: `/users` (Protected via `ProtectedRoute`)
- **Purpose**: Administrator panel for overseeing user accounts, access roles, and departmental assignments.
- **Interactive Elements**:
  - Top statistical metrics: Total Users, Active Users, Technical Staff, Operations Staff.
  - Role distribution progress cards: Admin, Facility Manager, Technician.
  - Search input by name or email; filters for Role and Status.
  - "Add User" button opening modal form (Full Name, Email, Phone, Role, Department).
  - Delete User action button triggering `DELETE /api/users/:id`.
  - Export CSV button.
- **API Requests**:
  - `GET /api/users` (Fetches all users excluding passwords)
  - `POST /api/users` (Creates new user with default password `Welcome@123`)
  - `DELETE /api/users/:id`
- **Status**: **IMPLEMENTED**.

### Page 14: User Profile (`/profile`)
- **Source File**: [UserProfile.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/UserProfile.jsx)
- **Route**: `/profile` (Protected via `ProtectedRoute`)
- **Purpose**: Personal user identity, profile image upload, contact information, credentials, and activity logs.
- **Interactive Elements**:
  - Avatar camera button: Opens local file picker, converts image to Base64 data URL, and uploads directly to MongoDB.
  - Edit Profile modal: Edits job title, phone, emergency contact, experience, skills.
  - Tabs: Overview, Activity, Security, Documents.
  - Activity Logger: Appends activity events to the user's `recentActivity` array in MongoDB.
- **API Requests**:
  - `GET /api/users/:id`
  - `PUT /api/users/:id`
- **Status**: **IMPLEMENTED**.

### Page 15: Settings (`/settings`)
- **Source File**: [Settings.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/Settings.jsx)
- **Route**: `/settings` (Protected via `ProtectedRoute`)
- **Purpose**: System-wide configuration options, preferences, theme toggles, and notification settings.
- **Interactive Elements**:
  - Left navigation menu switching between 10 configuration sections.
  - Profile preferences, Theme selection (Light/Dark), Density (Comfortable/Compact).
  - Notification toggles (Email, Browser, Maintenance Alerts, Weekly Reports).
  - Security panel: Password change inputs, 2FA toggle.
  - Danger Zone: "Clear Cache", "Sign Out All Sessions", "Delete Account" confirmation dialogs.
- **Persistence Limitation**: Modifies and persists data exclusively to client `localStorage` (`app_preferences`, `user_profile`). It does not sync preferences to the Express backend database.
- **Status**: **PARTIAL / LOCAL PERSISTENCE**.

### Page 16: Analytics (`/analytics`)
- **Source File**: [Analytics.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/Analytics.jsx)
- **Route**: `/analytics` (Protected via `ProtectedRoute`)
- **Purpose**: Aggregated portfolio health, maintenance completion rate, and asset distribution graphs.
- **Interactive Elements**:
  - KPI cards: Total Assets, Health Score, Maintenance Completion, Open Issues.
  - Recharts Donut Chart: Asset Health Breakdown (Optimal, Warning, Critical).
  - Recharts Pie Chart: Equipment Category Distribution.
  - Critical Assets Table: Highlights top 5 lowest-health equipment.
  - "Export Report" CSV button and "Generate PDF" print trigger.
- **Critical Flaw**: Declared with `assets = []` as a prop. When navigated to directly via `/analytics`, no props are supplied and no `useEffect` fetch is implemented. The page renders all metrics as 0.
- **Status**: **INCOMPLETE / UNWIRED**.

---

## 6. FRONTEND ARCHITECTURE

```mermaid
graph TD
    Entry[index.html / main.jsx] --> Router[BrowserRouter]
    Router --> App[App.jsx Switchboard]
    
    App --> RoutePublic1[Route: / -> Login]
    App --> RoutePublic2[Route: /signup -> Signup]
    
    App --> Guard[ProtectedRoute]
    
    Guard --> P1[Dashboard]
    Guard --> P2[DashboardOverview]
    Guard --> P3[AssetManagement]
    Guard --> P4[AssetDetails]
    Guard --> P5[AssetInventory]
    Guard --> P6[EditAsset]
    Guard --> P7[BIMViewer]
    Guard --> P8[MaintenanceManagement]
    Guard --> P9[MaintenanceSchedule]
    Guard --> P10[IssueManagement]
    Guard --> P11[UserManagement]
    Guard --> P12[Analytics]
    Guard --> P13[Settings]
    Guard --> P14[UserProfile]
    
    P3 --> C1[AssetAnalytics Sub-Component]
    
    subgraph Orphaned Components
        L1[Layout.jsx] --> S1[Sidebar.jsx]
    end
```

### 6.1 State Management Architecture
The frontend does not use a global state manager (such as Redux, Zustand, or Recoil). State is managed via:
- **Component-Level State (`useState`, `useMemo`)**: Every active page independently owns its list arrays, modal visibility flags, form objects, and filter parameters.
- **Browser Web Storage (`localStorage`)**:
  - `token`: Stores the active JSON Web Token string used by `apiFetch`.
  - `user`: Stores serialized user profile data (`_id`, `fullName`, `email`, `role`).
  - `app_preferences` / `user_profile`: Used by `Settings.jsx` to persist local UI settings.
- **React Router Navigation State (`location.state`)**: Used transiently to pass asset objects between `AssetDetails.jsx` and `EditAsset.jsx`.

### 6.2 Centralized API Client (`src/lib/api.js`)
All primary operational modules communicate through `apiFetch()`:
```javascript
export async function apiFetch(path, options = {}) {
  const { auth = true, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  if (auth) {
    const token = getAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (rest.body != null && !(rest.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, { ...rest, headers });
}
```

---

## 7. BACKEND ARCHITECTURE

The backend is built as an Express 5 micro-service running on Node.js using native ECMAScript Modules (`import`/`export`).

### 7.1 Server Initialization & Middleware Pipeline
In [backend/index.js](file:///e:/SE_Project/Software_Engineering/backend/index.js):
1. **DNS Fallback Configuration**: Hardcodes DNS resolver servers to `8.8.8.8` (Google) and `1.1.1.1` (Cloudflare) via `node:dns` to prevent MongoDB Atlas SRV connection timeouts.
2. **Environment Hydration**: Invokes `dotenv.config()`.
3. **CORS Enabling**: Applies `cors()` middleware without origin restrictions to allow local Vite development.
4. **JSON Body Parsing**: `express.json({ limit: '10mb' })` configured with a 10MB payload ceiling to support direct Base64 profile image uploads.
5. **Database Initialization**: `mongoose.connect(process.env.MONGO_URI)` initializes asynchronous connection pools.
6. **Authentication Middleware**: `verifyToken` inspects incoming HTTP requests for `Authorization: Bearer <token>`, validates the cryptographic signature using `jsonwebtoken`, and decorates `req.user` with `{ id, userId, role }`.

---

## 8. DATABASE STRUCTURE AND MODELS

The application persists data in MongoDB via Mongoose 9 models.

```mermaid
erDiagram
    USER ||--o{ ASSET : owns
    USER ||--o{ ISSUE : reports
    USER ||--o{ MAINTENANCE : schedules
    
    USER {
        ObjectId _id PK
        string fullName
        string email UK
        string password
        string role
        string profileImage
        string department
        string phone
        string jobTitle
        Array recentActivity
        date createdAt
        date updatedAt
    }

    ASSET {
        ObjectId _id PK
        string assetId UK
        string name
        string category
        string status
        string location
        number health
        string lastMaintenance
        ObjectId userId FK
        date createdAt
        date updatedAt
    }

    ISSUE {
        ObjectId _id PK
        ObjectId userId FK
        string assetId
        string title
        string category
        string priority
        string reportedBy
        string assignedTo
        string status
        date createdAt
        date updatedAt
    }

    MAINTENANCE {
        ObjectId _id PK
        ObjectId userId FK
        string assetId
        string taskName
        string category
        string priority
        string frequency
        date scheduledDate
        string assignedTeam
        string workStatus
        date createdAt
        date updatedAt
    }

    TECHNICIAN {
        ObjectId _id PK
        string name
        string role
    }
```

### 8.1 Schema Details

#### 1. User (`backend/models/User.js`)
- `fullName`: String (Required)
- `email`: String (Required, Unique index)
- `password`: String (Required, hashed with bcrypt)
- `role`: String (Required: "Facility Manager", "Technician", "Administrator")
- `profileImage`: String (Base64 data URI string)
- `phone`, `employeeId`, `department`, `officeLocation`, `company`, `jobTitle`, `experience`, `specialization`: Optional Strings
- `skills`: Array of Strings
- `recentActivity`: Array of Objects `{ text, time, iconType }`
- **Pre-Save Hook**: Automatically hashes password using `bcrypt.genSalt(10)` and `bcrypt.hash()` if modified.
- **Instance Method**: `comparePassword(candidatePassword)` returns boolean comparison.

#### 2. Asset (`backend/models/Asset.js`)
- `assetId`: String (Required, Unique index)
- `name`: String (Required)
- `category`: String (Required, e.g., HVAC, Electrical, Plumbing)
- `status`: String (Required, Default: 'Active' / 'Operational')
- `location`: String (e.g., "Floor 3, Room 302")
- `installationDate`, `manufacturer`, `lastMaintenance`: Strings
- `health`: Number (Default: 100, Scale 0-100)
- `userId`: ObjectId referencing `User` (Required for multi-tenant isolation)

#### 3. Issue (`backend/models/Issue.js`)
- `userId`: ObjectId referencing `User` (Required)
- `assetId`: String (Required, references `Asset.assetId`)
- `title`: String (Required)
- `category`: String (Required, Enum: `['Plumbing', 'HVAC', 'Electrical', 'Mechanical', 'Safety']`)
- `priority`: String (Required, Enum: `['High', 'Medium', 'Low']`, Default: 'Medium')
- `reportedBy`: String (Required)
- `assignedTo`: String (Default: 'Unassigned')
- `status`: String (Required, Enum: `['Open', 'In Progress', 'Resolved']`, Default: 'Open')

#### 4. Maintenance (`backend/models/Maintenance.js`)
- `userId`: ObjectId referencing `User` (Required)
- `assetId`: String (Required)
- `taskName`: String (Required)
- `category`: String (Default: "Preventive")
- `priority`: String (Default: "Medium")
- `frequency`: String (Default: "Routine")
- `scheduledDate`: Date (Required)
- `assignedTeam`: String (Default: "Unassigned")
- `workStatus`: String (Default: "Scheduled")

#### 5. Technician (`backend/models/Technician.js`)
- `name`: String (Required)
- `role`: String (Required)

---

## 9. API INVENTORY AND ROUTE SPECIFICATIONS

| Method | Endpoint | Auth | Handler Location | Parameters / Body | Expected Response | Description / Database Operation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | None | `routes/authRoutes.js:9` | `{ fullName, email, password, role }` | `201 { message }` | Creates user document with hashed password | Implemented |
| `POST` | `/api/auth/login` | None | `routes/authRoutes.js:32` | `{ email, password, role }` | `200 { token, user }` | Validates credentials; returns 7-day signed JWT | Implemented |
| `POST` | `/api/auth/Login` | None | `routes/authRoutes.js:87` | `{ email, password, role }` | `200 { token, user }` | Case-insensitive alias for login endpoint | Implemented |
| `GET` | `/api/assets` | JWT | `backend/index.js:47` | None | `200 Asset[]` | Queries `Asset.find({ userId }).sort({ createdAt: -1 })` | Implemented |
| `POST` | `/api/assets` | JWT | `backend/index.js:56` | Asset JSON payload | `201 Asset` | Saves new Asset with `userId: req.user.id` | Implemented |
| `PUT` | `/api/assets/:id` | JWT | `backend/index.js:231` | Asset updates | `200 Asset` | Updates asset matching `_id` or `assetId` and `userId` | Implemented |
| `DELETE` | `/api/assets/:id` | JWT | `backend/index.js:249` | None | `200 { message, deletedAsset }` | Drops asset matching `_id` or `assetId` and `userId` | Implemented |
| `GET` | `/api/issues` | JWT | `backend/index.js:67` | None | `200 Issue[]` | Queries `Issue.find({ userId }).sort({ createdAt: -1 })` | Implemented |
| `POST` | `/api/issues` | JWT | `backend/index.js:76` | Issue JSON payload | `201 Issue` | Saves new Issue with `userId: req.user.id` | Implemented |
| `PUT` | `/api/issues/:id/status`| JWT | `backend/index.js:263`| `{ status }` | `200 Issue` | Updates issue workflow status | Implemented |
| `PUT` | `/api/issues/:id/assign`| JWT | `backend/index.js:278`| `{ assignedTo }` | `200 Issue` | Assigns technician to work order | Implemented |
| `DELETE` | `/api/issues/:id` | JWT | `backend/index.js:293` | None | `200 { message, deletedIssue }` | Deletes issue record matching `_id` and `userId` | Implemented |
| `GET` | `/api/technicians` | JWT | `backend/index.js:87` | None | `200 Technician[]` | Returns all technician records from database | Implemented |
| `GET` | `/api/maintenance` | JWT | `backend/index.js:96` | None | `200 Maintenance[]` | Queries `Maintenance.find({ userId }).sort({ scheduledDate: 1 })` | Implemented |
| `POST` | `/api/maintenance` | JWT | `backend/index.js:105` | Task JSON payload | `201 Maintenance` | Creates maintenance routine mapped to backend schema | Implemented |
| `PUT` | `/api/maintenance/:id`| JWT | `backend/index.js:304` | Task updates | `200 Maintenance` | Updates maintenance routine matching `_id` or `assetId` | Implemented |
| `DELETE` | `/api/maintenance/:id`| JWT | `backend/index.js:334` | None | `200 { message, deletedMaint }` | Deletes maintenance record | Implemented |
| `GET` | `/api/dashboard/stats` | JWT | `backend/index.js:131` | None | `200 { totalAssets, activeIssuesCount, ... }` | Aggregates collection counters and category breakdown | Implemented |
| `GET` | `/api/users/:id` | JWT | `backend/index.js:165` | URL `id` | `200 User` | Retrieves user profile document | Implemented |
| `PUT` | `/api/users/:id` | JWT | `backend/index.js:177` | User profile updates | `200 User` | Updates profile attributes or Base64 photo string | Implemented |
| `GET` | `/api/users` | JWT | `backend/index.js:196` | None | `200 User[]` | Returns user directory without passwords | Implemented |
| `POST` | `/api/users` | JWT | `backend/index.js:204` | `{ fullName, email, role, ... }`| `201 User` | Admin creates user; defaults password to `Welcome@123` | Implemented |
| `DELETE` | `/api/users/:id` | JWT | `backend/index.js:220` | URL `id` | `200 { message }` | Drops user document | Implemented |
| `GET` | `/api/bim` | JWT | `backend/index.js:348` | None | `200 { categories, assets, ... }` | Static JSON mockup payload for BIM simulation | Implemented |
| `GET` | `/` | None | `backend/index.js:398` | None | `200 "BIM Backend is live!"` | Health probe root endpoint | Implemented |

---

## 10. FUNCTION AND COMPONENT EXPLANATIONS

### 10.1 Key Frontend Components & Functions
- **`ProtectedRoute({ children })`** ([ProtectedRoute.jsx](file:///e:/SE_Project/Software_Engineering/src/components/ProtectedRoute.jsx)): Inspects `localStorage.getItem("token") || localStorage.getItem("accessToken")`. If absent, redirects to `/` with `<Navigate replace />`.
- **`apiFetch(path, options)`** ([api.js](file:///e:/SE_Project/Software_Engineering/src/lib/api.js)): Central HTTP wrapper that injects the Authorization Bearer header, sets Content-Type to `application/json`, prepends `VITE_API_URL`, and calls `fetch()`.
- **`AssetAnalytics({ assets })`** ([AssetAnalytics.jsx](file:///e:/SE_Project/Software_Engineering/src/components/AssetAnalytics.jsx)): Computes status counts and average category health using array reductions and feeds Recharts `BarChart` and `PieChart`.
- **`handleExportCSV()`** ([AssetManagement.jsx:107](file:///e:/SE_Project/Software_Engineering/src/pages/AssetManagement.jsx#L107)): Iterates over in-memory assets, formats CSV headers and values, builds a `data:text/csv` URI, and triggers browser file download.
- **`getPasswordStrength(password)`** ([Signup.jsx:17](file:///e:/SE_Project/Software_Engineering/src/pages/Signup.jsx#L17)): Calculates entropy score across length, uppercase letters, numbers, and special characters.

### 10.2 Key Backend Middleware & Handlers
- **`verifyToken(req, res, next)`** ([auth.js:4](file:///e:/SE_Project/Software_Engineering/backend/middleware/auth.js#L4)): Extracts the token from HTTP request header `Authorization: Bearer <token>`, verifies the HMAC signature using `jwt.verify`, and decorates `req.user` with decoded properties.
- **`handleLogin(req, res)`** ([authRoutes.js:32](file:///e:/SE_Project/Software_Engineering/backend/routes/authRoutes.js#L32)): Validates email, executes `bcrypt.compare` on password, checks role match, and signs a 7-day JWT.
- **`dualIdQuery(id, userId)`** ([index.js:233](file:///e:/SE_Project/Software_Engineering/backend/index.js#L233)): Branches between `_id` and business key `assetId` using `mongoose.isValidObjectId(id)`.

---

## 11. ALGORITHMS AND COMPLEXITY ANALYSIS

### Algorithm Inventory Table

| Algorithm / Logic Procedure | Source File & Function | Purpose | Data Structures | Time Complexity | Space Complexity | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Multi-Predicate In-Memory Filter** | `AssetManagement.jsx:84` | Filters asset fleet by search string, status, and category | Array, String | $O(N)$ | $O(N)$ | Implemented / Untested |
| **Dynamic Category Extraction** | `AssetManagement.jsx:78` | Computes unique category list from active asset records | Set, Array | $O(N)$ | $O(U)$ ($U \le N$) | Implemented / Untested |
| **Fleet Health Floor Map Aggregation**| `Dashboard.jsx:116` | Groups asset health status into building levels | Hash Map (Object), Array | $O(N + F \log F)$ | $O(F)$ ($F = \text{floors}$) | Implemented / Untested |
| **Monthly Spend Trend Calculation** | `Dashboard.jsx:152` | Sums planned vs unplanned maintenance costs per month | Array, Date Objects | $O(M \times K)$ ($M=7, K=\text{orders}$) | $O(M)$ | Implemented / Untested |
| **RFC 4180 CSV Serializer** | `AssetManagement.jsx:107` | Serializes object records into downloadable CSV URI | Array of Strings, DOM Anchor | $O(N \times C)$ ($C=\text{cols}$) | $O(N \times C)$ | Implemented / Untested |
| **Entropy Password Strength Evaluator**| `Signup.jsx:17` | Scores password complexity across 5 criteria | Regular Expressions | $O(L)$ ($L=\text{length}$) | $O(1)$ | Implemented / Untested |
| **Dual-Key ObjectId Query Branching** | `backend/index.js:233` | Resolves query target by Mongo ObjectId vs custom ID | BSON ObjectId, Mongo Query Object | $O(1)$ lookup preparation | $O(1)$ | Implemented / Untested |
| **2D Affine Viewport Transform** | `BIMViewer.jsx:285` | Rotates and scales 2D SVG building wireframe | CSS transform matrix | $O(1)$ | $O(1)$ | Implemented / Untested |
| **Overdue Maintenance Auto-Tagger** | `MaintenanceSchedule.jsx:77`| Flags past-due scheduled maintenance tasks | Array, Date comparison | $O(N)$ | $O(N)$ | Implemented / Untested |

---

## 12. END-TO-END WORKFLOWS

### 12.1 User Login & Session Establishment
1. User enters email, password, and selects role on `/`.
2. `Login.jsx` dispatches `POST /api/auth/Login`.
3. Backend finds user by email in MongoDB.
4. `bcrypt.compare` validates the password hash.
5. Role verification ensures requested role matches database record.
6. Backend signs JWT using `getJwtSecret()` with a 7-day expiration.
7. Frontend receives token and user object, saving them to `localStorage`.
8. React Router navigates to `/dashboard`.
9. `ProtectedRoute` verifies token presence and grants access.

### 12.2 Asset Creation & Telemetry Refresh
1. Facility manager clicks "Add Asset" in `AssetManagement.jsx`.
2. Modal captures Asset ID, Name, Category, Location, Initial Status, and Health.
3. On submit, dispatches `POST /api/assets` via `apiFetch`.
4. `verifyToken` authenticates the JWT and extracts `userId`.
5. Express creates `new Asset({ ...body, userId })` and saves to MongoDB.
6. On HTTP 201 response, `loadAssetsFromBackend()` re-queries `GET /api/assets`.
7. React updates the `assets` state array, re-renders the table, re-evaluates pagination, and recalculates KPI counters and charts.

---

## 13. MERMAID SYSTEM DIAGRAMS

### 13.1 Authentication & Authorization Flow
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser as React SPA (Login.jsx)
    participant API as Express API (/api/auth)
    participant DB as MongoDB (User Collection)

    User->>Browser: Enters email, password, selects role
    Browser->>API: POST /api/auth/Login { email, password, role }
    API->>DB: User.findOne({ email })
    DB-->>API: Returns user document with password hash
    API->>API: bcrypt.compare(password, user.password)
    alt Password Invalid or Role Mismatch
        API-->>Browser: HTTP 400/403 { message: "Invalid credentials" / "Access denied" }
        Browser-->>User: Displays error notification
    else Credentials Valid
        API->>API: jwt.sign({ id, userId, role }, JWT_SECRET, { expiresIn: '7d' })
        API-->>Browser: HTTP 200 { token, user }
        Browser->>Browser: localStorage.setItem('token', token)
        Browser->>Browser: navigate('/dashboard')
        Browser-->>User: Renders Operations Dashboard
    end
```

### 13.2 Asset Registration & State Synchronization Flow
```mermaid
sequenceDiagram
    autonumber
    actor Manager as Facility Manager
    participant UI as AssetManagement.jsx
    participant Client as apiFetch Client
    participant Server as Express Server (/api/assets)
    participant Auth as verifyToken Middleware
    participant DB as MongoDB (Asset Collection)

    Manager->>UI: Fills "Add Asset" modal & clicks submit
    UI->>Client: apiFetch('/api/assets', { method: 'POST', body })
    Client->>Client: Injects Authorization: Bearer <token>
    Client->>Server: POST /api/assets
    Server->>Auth: Validates JWT signature
    Auth-->>Server: Decoded user { id: "user_123" }
    Server->>DB: new Asset({ ...body, userId: "user_123" }).save()
    DB-->>Server: Confirms document creation
    Server-->>Client: HTTP 201 Created (Asset document)
    Client-->>UI: Response OK
    UI->>UI: Closes modal & triggers loadAssetsFromBackend()
    UI->>Client: apiFetch('/api/assets')
    Client->>Server: GET /api/assets
    Server->>DB: Asset.find({ userId: "user_123" })
    DB-->>Server: Returns updated asset array
    Server-->>UI: HTTP 200 Asset[]
    UI->>UI: setAssets(data) -> Recharts & Tables re-render
```

---

## 14. FEATURE VERIFICATION CHECKLIST

| Category | Feature / Requirement | Expected Behavior | Source File | Implementation Status | Testing Status | Defect / Missing Part |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | User Registration | Registers new user and hashes password | `Signup.jsx` | **PARTIAL** | **UNTESTED** | Client-side `validate()` function is never executed in `handleSignup`. |
| **Auth** | User Login | Authenticates user and returns JWT | `Login.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Auth** | Route Protection | Redirects unauthenticated users to `/` | `ProtectedRoute.jsx` | **IMPLEMENTED** | **UNTESTED** | Checks token presence only; does not verify expiry client-side. |
| **Dashboard** | KPI Metric Cards | Summarizes fleet assets, health, and issues | `Dashboard.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Dashboard** | Health by Floor Chart | Visualizes equipment condition by building floor | `Dashboard.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Dashboard** | Maintenance Cost Trend | Graphs planned vs. unplanned expenses | `Dashboard.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Dashboard Overview**| Central Metrics Overview | Summarizes system counters | `DashboardOverview.jsx` | **PARTIAL** | **BLOCKED** | Uses unauthenticated fetch; fails with 401 Unauthorized. |
| **Assets** | Asset CRUD | Add, edit, view, delete hardware assets | `AssetManagement.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Assets** | Asset CSV Export | Generates client-side CSV download | `AssetManagement.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Assets** | Secondary Inventory | Displays alternate asset ledger | `AssetInventory.jsx` | **PARTIAL** | **BLOCKED** | Uses unauthenticated fetch; fails with 401 Unauthorized. |
| **Assets** | Asset Details Inspection | Inspects single asset record | `AssetDetails.jsx` | **PARTIAL** | **UNTESTED** | Renders dummy maintenance and issues arrays; breaks on page refresh. |
| **Assets** | Edit Asset Form | Updates asset details | `EditAsset.jsx` | **MISSING** | **UNTESTED** | Mock component; displays alert without API call. |
| **BIM** | BIM Spatial Viewer | 3D visual building modeler | `BIMViewer.jsx` | **PARTIAL** | **UNTESTED** | 2D SVG wireframe simulation; does not load backend `/api/bim` data. |
| **Maintenance**| Work Order CRUD | Create, edit, drop maintenance orders | `MaintenanceManagement.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Maintenance**| Maintenance Scheduler | Schedules recurring maintenance windows | `MaintenanceSchedule.jsx` | **PARTIAL** | **BLOCKED** | Uses unauthenticated fetch; fails with 401 Unauthorized. |
| **Issues** | Issue Defect CRUD | Report, track, and delete defect logs | `IssueManagement.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Issues** | Inline Status Change | Updates defect status via table dropdown | `IssueManagement.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Issues** | Staff Assignment | Assigns technician to active issue | `IssueManagement.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Users** | User Directory | Lists users and allows admin creation | `UserManagement.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Profile** | User Profile & Avatar | Updates profile and uploads Base64 photo | `UserProfile.jsx` | **IMPLEMENTED** | **UNTESTED** | None. |
| **Settings** | App & User Preferences | Configures theme, alerts, and security | `Settings.jsx` | **PARTIAL** | **UNTESTED** | Persists to client `localStorage` only; no database sync. |
| **Analytics** | Fleet Analytics View | Deep analytics and Recharts visualizations | `Analytics.jsx` | **PARTIAL** | **UNTESTED** | Requires `assets` prop that `App.jsx` route does not pass. |
| **Routing** | Fallback / 404 Route | Displays 404 error on invalid path | `App.jsx` | **MISSING** | **UNTESTED** | No catch-all (`*`) route defined in `Routes`. |
| **Layout** | Global Master Shell | Unifies header and navigation sidebar | `Layout.jsx` | **MISSING** | **UNTESTED** | `Layout.jsx` is never imported by any active page. |

---

## 15. TEST CASES AND ACTUAL VERIFICATION RESULTS

### 15.1 Static Verification Results
- **Automated Test Suites**: **None Found**. No test scripts exist in `package.json` (`npm test` not defined).
- **Dependency State**: `node_modules` folders are missing in both the root frontend and backend directories.
- **Runtime Execution**: **BLOCKED** due to missing installed packages and absence of an active MongoDB connection.

### 15.2 Comprehensive Manual Test Plan Matrix

| ID | Test Scenario | Steps | Expected Result | Static Audit Finding | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | User Registration with Invalid Email | Enter invalid email on `/signup` and click Submit | Form halts and shows email validation error | `validate()` is not called; request sent to backend | **FAIL / DEFECT** |
| **TC-02** | User Registration Valid | Enter valid details and submit | Creates user in MongoDB and redirects to `/` | Supported by backend `User.js` and `authRoutes.js` | **PASS (Static)** |
| **TC-03** | User Login with Role Mismatch | Select "Technician" for an "Administrator" user | Backend returns HTTP 403 Access Denied | Supported by `authRoutes.js:50` | **PASS (Static)** |
| **TC-04** | Protected Route Access without Token | Open `/dashboard` directly with empty storage | Redirects to `/` | Supported by `ProtectedRoute.jsx` | **PASS (Static)** |
| **TC-05** | Dashboard Telemetry Load | Log in and view `/dashboard` | Executes 3 parallel API fetches and renders charts | Supported by `Dashboard.jsx:82` | **PASS (Static)** |
| **TC-06** | Dashboard Overview Access | Navigate to `/dashboard-overview` | Should render aggregated counters | Fails with 401 Unauthorized (No token sent) | **FAIL / BROKEN** |
| **TC-07** | Asset Creation | Fill modal in `/assets` and click Add | Sends `POST /api/assets` with JWT and refreshes | Supported by `AssetManagement.jsx:169` | **PASS (Static)** |
| **TC-08** | Asset CSV Export | Click Export on `/assets` | Browser downloads `BIM_Asset_Report_<date>.csv` | Supported by `AssetManagement.jsx:107` | **PASS (Static)** |
| **TC-09** | Asset Details Refresh | Open `/asset-details` directly | Should fetch and display asset details | Renders "No Asset Data Found" (`location.state` null) | **FAIL / DEFECT** |
| **TC-10** | Edit Asset Save | Click Save Changes on `/edit-asset` | Should update record in database | Shows `alert()` only; no API request | **FAIL / MOCK** |
| **TC-11** | Secondary Inventory Access | Open `/asset-inventory` | Should render hardware table | Fails with 401 Unauthorized (No token sent) | **FAIL / BROKEN** |
| **TC-12** | Issue Status Transition | Select new status in `/issues` dropdown | Sends `PUT /api/issues/:id/status` and updates UI | Supported by `IssueManagement.jsx:162` | **PASS (Static)** |
| **TC-13** | Maintenance Schedule Access | Open `/maintenance-schedule` | Should render PM windows table | Fails with 401 Unauthorized (No token sent) | **FAIL / BROKEN** |
| **TC-14** | Analytics Direct Access | Navigate to `/analytics` | Should display fleet analytics | Renders all metrics as 0 (No `assets` prop passed) | **FAIL / DEFECT** |
| **TC-15** | Invalid URL Navigation | Navigate to `/random-invalid-url` | Should render 404 Not Found page | Renders blank screen (No catch-all route in `App.jsx`)| **FAIL / DEFECT** |

---

## 16. BUGS, SECURITY VULNERABILITIES, AND CODE SMELLS

### 16.1 High Severity Defects & Vulnerabilities
1. **Unauthenticated Broken Pages (401 Crashes)**:
   - **Affected Files**: [DashboardOverview.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/DashboardOverview.jsx#L54), [AssetInventory.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/AssetInventory.jsx#L70), [MaintenanceSchedule.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/MaintenanceSchedule.jsx#L73).
   - **Evidence**: Directly invoking `fetch("http://localhost:5000/api/...")` without `Authorization` headers against endpoints protected by `verifyToken`.
   - **Impact**: Pages immediately crash or display empty data.
   - **Recommendation**: Refactor all pages to use `apiFetch` from `src/lib/api.js`.

2. **Bypassed Client-Side Validation on Signup**:
   - **Affected Files**: [Signup.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/Signup.jsx#L166).
   - **Evidence**: `validate()` function is declared on line 140 but never called inside `handleSignup`.
   - **Impact**: Submits malformed or empty payloads directly to backend, triggering raw validation errors.
   - **Recommendation**: Add `const errors = validate(); if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }` at start of `handleSignup`.

3. **Fallback JWT Secret in Production Code**:
   - **Affected Files**: [backend/lib/jwtSecret.js](file:///e:/SE_Project/Software_Engineering/backend/lib/jwtSecret.js#L10).
   - **Evidence**: Falls back to `"FIXED_SECRET_KEY_12345"` if `process.env.JWT_SECRET` is unset.
   - **Impact**: Predictable token signing keys allow attackers to forge valid administrative tokens.
   - **Recommendation**: Throw a fatal error on server startup if `JWT_SECRET` is missing in non-development environments.

### 16.2 Medium Severity Architectural Inconsistencies
4. **Orphaned Layout & Navigation Shell**:
   - **Affected Files**: [Layout.jsx](file:///e:/SE_Project/Software_Engineering/src/Layout/Layout.jsx), [Sidebar.jsx](file:///e:/SE_Project/Software_Engineering/src/components/Sidebar.jsx).
   - **Evidence**: `Layout.jsx` is defined with a sidebar and header, but is never used by any route in `App.jsx`.
   - **Impact**: UI inconsistency; pages duplicate navigation logic or lack navigation completely.
   - **Recommendation**: Wrap protected routes in `App.jsx` with `<Layout>` or use React Router `<Outlet />`.

5. **Missing Route Props for Analytics**:
   - **Affected Files**: [Analytics.jsx](file:///e:/SE_Project/Software_Engineering/src/pages/Analytics.jsx#L91), [App.jsx](file:///e:/SE_Project/Software_Engineering/src/App.jsx#L120).
   - **Evidence**: `Analytics` expects `{ assets = [] }` prop, but `App.jsx` mounts `<Analytics />` with no props.
   - **Impact**: Accessing `/analytics` shows 0 assets, 0% health, and blank charts.
   - **Recommendation**: Add internal data fetching via `apiFetch('/api/assets')` inside `Analytics.jsx`.

6. **Unused Dependencies in Frontend Manifest**:
   - **Affected Files**: [package.json](file:///e:/SE_Project/Software_Engineering/package.json#L16-L17).
   - **Evidence**: `dotenv` (`^17.4.2`), `mongoose` (`^9.7.1`), and `axios` (`^1.18.1`) are installed in the frontend, but never imported in `src/`.
   - **Impact**: Unnecessary bundle bloat and installation overhead.
   - **Recommendation**: Remove `dotenv`, `mongoose`, and `axios` from frontend `package.json`.

---

## 17. MISSING FEATURES AND IMPROVEMENT ROADMAP

1. **True 3D BIM Model Rendering Engine**:
   - Replace the SVG wireframe in `BIMViewer.jsx` with an industry-standard WebGL engine such as **Three.js**, **web-ifc-three**, or **Autodesk Platform Services (Forge) Viewer** to parse actual `.ifc` architectural files.
2. **Centralized Global Layout System**:
   - Connect `src/Layout/Layout.jsx` and `src/components/Sidebar.jsx` across all protected routes using React Router v7 layout routes and `<Outlet />`.
3. **Database-Backed Settings**:
   - Extend the Mongoose `User` schema to store notification preferences, theme options, and density settings in MongoDB rather than relying solely on client `localStorage`.
4. **Automated Testing Suite**:
   - Install **Vitest** and **React Testing Library** for frontend unit and component testing.
   - Install **Supertest** and **Jest** (or Vitest) for backend API route integration tests.

---

## 18. SETUP, INSTALLATION, AND EXECUTION INSTRUCTIONS

### Prerequisites
- **Node.js**: Version 18.x or 20.x LTS installed.
- **MongoDB**: A running local MongoDB instance (`mongodb://127.0.0.1:27017/bim_management`) or a MongoDB Atlas connection URI.

### Step 1: Install Dependencies
Open two separate terminal consoles.

**Terminal 1 (Backend)**:
```bash
cd backend
npm install
```

**Terminal 2 (Frontend)**:
```bash
npm install
```

### Step 2: Configure Environment Variables
1. **Backend Environment**: Copy `backend/.env.example` to `backend/.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/bim_management
   JWT_SECRET=your_super_secret_random_key_here
   PORT=5000
   ```
2. **Frontend Environment**: Copy `.env.example` to `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Step 3: Start the Backend Service
In Terminal 1 (`backend` directory):
```bash
npm run dev
# Expected output:
# Server is running on http://localhost:5000
# Connected to MongoDB successfully!
```

### Step 4: Start the Frontend Application
In Terminal 2 (root project directory):
```bash
npm run dev
# Expected output:
# VITE v8.x ready in ... ms
# Local: http://localhost:5173/BIM_MANAGEMENT/
```

### Step 5: Access the Web Application
Open your web browser and navigate to the displayed Vite local URL:
```
http://localhost:5173/BIM_MANAGEMENT/
```
1. Click **Create an account** to register a new user.
2. Sign in with the registered credentials to enter the operations dashboard.

---

## 19. KNOWN LIMITATIONS AND CONSTRAINTS

1. **GitHub Pages Routing Base Path**:
   - `vite.config.js` sets `base: process.env.VERCEL ? '/' : '/BIM_MANAGEMENT/'`. When running locally without `VERCEL=1`, all assets and routes are prefixed with `/BIM_MANAGEMENT/`.
2. **Lack of In-Memory Session Validation**:
   - `ProtectedRoute.jsx` checks only if a token string exists in `localStorage`. If the token is expired or revoked, the page still mounts, and child components only discover token invalidity when their individual API requests return 401/403.
3. **No Catch-All Route**:
   - `App.jsx` has no `<Route path="*" element={<NotFound />} />`. Accessing an undefined URL renders an empty viewport.

---

## 20. FINAL PROJECT STATUS AND VERDICT

### Quantitative Implementation Breakdown
- **Total Functional Modules Analyzed**: 24 distinct capabilities across frontend and backend.
- **Implemented Modules**: **15** (Authentication, User-scoped Asset CRUD, Issue CRUD with staff assignment, Maintenance CRUD, User Management, Profile updates with Base64 photos, Dashboard telemetry, CSV export).
- **Partially Implemented Modules**: **5** (Signup missing client validation, BIM Viewer using 2D SVG simulation, Asset Details relying on transient state, Settings persisting only to localStorage, Analytics lacking data unwiring).
- **Missing Modules**: **2** (EditAsset backend persistence, 404 catch-all route).
- **Untested Modules**: **20** (All valid implementations lack automated test suites).
- **Blocked / Broken Pages**: **3** (`DashboardOverview.jsx`, `AssetInventory.jsx`, `MaintenanceSchedule.jsx` due to unauthenticated 401 fetch calls).

### Conclusion
The **Software_Engineering (bim-management)** project features a functional, well-structured MERN core with robust user-scoped database isolation and JWT authentication across its primary workflows. However, it suffers from code duplication (parallel pages created without authentication), orphaned architectural artifacts (`Layout.jsx` and `Sidebar.jsx`), and a complete lack of automated testing. By addressing the evidence-based recommendations outlined in this report, the codebase can be transitioned into an enterprise-ready facility management suite.

