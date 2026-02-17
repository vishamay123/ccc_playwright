# System Attribute Create and Delete - Test Specification

## Overview
This test creates a new System Attribute with unique data, ensuring it is correctly saved, and then verifies its creation before deleting it using the list view.

**Base URL:** http://52.91.192.7  
**Timeout:** 2 minutes  
**Test File:** test/system-attributes.spec.js

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

### 2. Navigate to Add Attribute
- **Navigation Path**: Dashboards -> System -> Attribute -> Add Attribute
- **Steps**:
  - Click link "Dashboards"
  - Click link "System"
  - Click paragraph "Attribute" (or relevant container)
  - Click link " Add Attribute"

### 3. Fill the Attribute Form

#### Generate Unique Data
- **Timestamp**: `Date.now()`
- **Name**: `Test Attribute [timestamp]`
- **Code**: `attr_[timestamp]`

#### Form Fields
- **Name[en]**:
  - Find textbox by name "Name[en]"
  - Click and fill with generated Name
- **Code**:
  - Find textbox by name "Code"
  - Click and fill with generated Code
- **Input Type**:
  - Find label "Input Type"
  - Select Option: `checkbox`
- **Is Required**:
  - Find label "Is Required"
  - Select Option: `1` (Yes)

### 4. Save
- Click button "Save & Continue"

### 5. Navigate to Attribute List
- **Goal**: Return to the list to verify and delete.
- **Steps** (Robust Navigation):
  - Click "System" link
  - Click "Attribute" paragraph/menu item
  - Click " Attribute List" link

### 6. Locate and Delete the Item
- **Locate Row**: Find the table row (`role='row'`) that contains *both* the unique `Name` and `Code`.
- **Verify**: Expect the row to be visible.

#### Deletion Interaction
1. **Select**: Check the checkbox within the identified row (`input[type="checkbox"]`).
2. **Delete**: Click the global "Delete" button.
3. **Confirm**: Click "Delete" in the confirmation modal (`#delete-form`).

### 7. Verify Deletion
- **Assertion**: Expect the row with the unique Name and Code to *not* be visible.

---

## Important Notes

### Unique Data
- `Date.now()` is used to ensure the `Code` and `Name` are unique, preventing conflicts with previous test runs or existing data.

### Selectors
- **Form Filling**: Uses `getByRole('textbox', { name: ... })` for precise targeting of labeled inputs.
- **Dropdowns**: Uses `selectOption` for standard select elements.
- **Row Targeting**: Filtering by text ensures we only delete the item we just created.

---

## Success Indicators
The test passes when:
1. ✓ Navigation to "Add Attribute" is successful.
2. ✓ Form fills without variation or error.
3. ✓ Save operation completes.
4. ✓ The specific attribute is found in the list.
5. ✓ The attribute is successfully deleted.

---

## Running the Test
```bash
npx playwright test test/system-attributes.spec.js --project=chromium --headed
```
