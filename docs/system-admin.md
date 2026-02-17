# System Admin Create and Permanent Delete - Test Specification

## Overview
This test creates a new System Admin with unique data, performs a soft delete (moving it to the trash), and then robustly navigates to the trash to permanently delete the user.

**Base URL:** http://52.91.192.7  
**Timeout:** 2 minutes  
**Test File:** test/system-admin.spec.js

---

## Prerequisites

### Login Function
Use the existing login helper:
1. Import `require('./helpers/login')`
2. Call `await login(page)`
3. Wait for dashboard redirect

---

## Test Flow

### 1. Login
- Execute login helper
- Verify successful login

### 2. Navigate to Add Admin
- **Navigation Path**: System -> Admin -> Add Admin
- **Steps**:
  - Click link "System"
  - Click paragraph "Admin"
  - Click link " Add Admin"

### 3. Fill the Admin Form

#### Generate Unique Data
- **Timestamp**: `Date.now()`
- **Name**: `Admin User [timestamp]`
- **Email**: `admin_[timestamp]@example.com`
- **Password**: `Admin@1234`

#### Form Fields
- **Name**:
  - Input `name="user[name]"` -> Fill Name
- **Email**:
  - Textbox "Email" -> Fill Email
- **Role**:
  - Selector `id="user[role_id]"` -> Select option '2'
- **Password**:
  - Click Tab "Password"
  - Textbox "Password" (exact) -> Fill Password
  - Textbox "Confirm Password" -> Fill Password

### 4. Save
- Click button "Save & Continue"

### 5. Verify Creation & Soft Delete
- **Capture ID**: Verify URL contains `/edit/` and extract the numerical ID.
- **Navigate to List**:
  - Go directly to `${BASE_URL}/backend/user`
- **Locate Row**:
  - Find `tr` containing the unique **Name**.
- **Delete Interaction**:
  1. Check the checkbox in the row (`locator('[id="selectedCategory."]')`)
  2. Click global "Delete" button.
  3. Confirm in modal (`#delete-form` button).
- **Verify**: Row is no longer visible.

### 6. Permanent Delete (From Deleted List)
- **Navigate to Trash**:
  - Go directly to `${BASE_URL}/backend/deleted_user`
- **Locate Row**:
  - Find `tr` containing the unique **Name**.
- **Delete Interaction**:
  1. Check the checkbox in the row.
  2. Click global "Delete" button.
  3. Confirm in modal.
- **Verify**: Row is no longer visible.

---

## Important Notes

### Navigation Strategy
- Direct `page.goto()` is used for List pages (`/backend/user` and `/backend/deleted_user`) to ensure speed and reliability.
- UI Navigation (clicking links) is used for the creation flow.

### Robust ID & Name Matching
- The test captures the ID upon creation to ensure validation.
- Deletion logic uses the unique **Name** to find the specific row, which is more robust than generic indices.

---

## Success Indicators
The test passes when:
1. ✓ Admin is created successfully.
2. ✓ Admin ID is captured from the URL.
3. ✓ Admin is found in the main list and soft-deleted.
4. ✓ Admin is found in the deleted list and permanently deleted.

---

## Running the Test
```bash
npx playwright test test/system-admin.spec.js --project=chromium --headed
```
